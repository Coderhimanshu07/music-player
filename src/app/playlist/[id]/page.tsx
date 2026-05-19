"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Music, Trash2, ArrowLeft } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { useAuth } from "@/context/AuthContext";

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = Number(params.id);
  const { playSong } = usePlayer();
  const { user, loading: authLoading } = useAuth();
  const { playlists, playlistSongs, refreshPlaylistSongs, removeSongFromPlaylist, deletePlaylist } = usePlaylists();
  const [loading, setLoading] = useState(true);

  const playlist = playlists.find((p) => p.id === playlistId);
  const songs = playlistSongs[playlistId] || [];

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) {
      refreshPlaylistSongs(playlistId).finally(() => setLoading(false));
    }
  }, [user, authLoading, playlistId, refreshPlaylistSongs, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-subdued">
        <Music size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold mb-2">Playlist not found</h2>
        <Link href="/library" className="text-brand hover:underline">Go to Library</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-text-subdued hover:text-white transition-colors w-fit mb-2">
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex items-end gap-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl flex-shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-brand flex items-center justify-center shadow-2xl">
          <Music size={64} className="text-white opacity-80" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold uppercase tracking-widest text-text-subdued mb-2 block">Playlist</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 truncate">{playlist.name}</h1>
          <p className="text-text-subdued text-sm font-medium">{songs.length} songs</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => deletePlaylist(playlistId).then(() => router.push("/library"))}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-full"
        >
          <Trash2 size={16} />
          Delete Playlist
        </button>
      </div>

      {songs.length > 0 ? (
        <div className="flex flex-col gap-2 bg-bg-elevated/50 rounded-xl p-2 border border-white/5">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              onClick={() => playSong(song, songs)}
            >
              <span className="text-text-subdued w-6 text-center group-hover:hidden">{index + 1}</span>
              <button className="w-6 text-center hidden group-hover:flex justify-center text-white">
                <Play size={16} fill="currentColor" />
              </button>

              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 shadow-md">
                <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white font-medium truncate">{song.title}</span>
                <span className="text-sm text-text-subdued truncate">{song.artist}</span>
              </div>

              <div className="hidden md:block text-text-subdued text-sm flex-1 truncate">
                {song.album}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); removeSongFromPlaylist(playlistId, song.id); }}
                className="text-text-subdued hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
              >
                <Trash2 size={16} />
              </button>

              <div className="text-text-subdued text-sm flex items-center gap-1">
                <Clock size={14} className="opacity-50" />
                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-bg-elevated/20 rounded-2xl border border-white/5">
          <Music className="text-text-subdued mb-4 opacity-50" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">This playlist is empty</h2>
          <p className="text-text-subdued">Search for songs and add them to this playlist.</p>
        </div>
      )}
    </div>
  );
}
