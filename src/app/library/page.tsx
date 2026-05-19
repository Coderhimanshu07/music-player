"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Clock, Music, Lock, ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LibraryPage() {
  const { playSong, likedSongs } = usePlayer();
  const { playlists } = usePlaylists();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full text-center">
        <div className="w-20 h-20 bg-bg-elevated rounded-full flex items-center justify-center mb-6 text-text-subdued">
          <Lock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Login to see your library</h1>
        <p className="text-text-subdued mb-8">You need to be logged in to view your liked songs.</p>
        <Link href="/login" className="bg-brand hover:bg-brand-hover text-white font-bold py-3 px-8 rounded-full transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-end gap-6 mb-4 mt-4">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-brand flex items-center justify-center shadow-2xl">
          <Music size={64} className="text-white opacity-80" />
        </div>
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-text-subdued mb-2 block">Profile</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">Your Library</h1>
          <p className="text-text-subdued text-sm font-medium">
            {likedSongs.length} Liked Songs
          </p>
        </div>
      </div>

      {/* Liked Songs Quick Access */}
      {/* Your Playlists */}
      {playlists.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ListMusic size={24} />
              Your Playlists
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {playlists.map((pl) => (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="bg-bg-elevated/50 hover:bg-bg-highlight/50 transition-colors rounded-xl p-4 border border-white/5 group"
              >
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-brand flex items-center justify-center mb-3 shadow-lg">
                  <Music size={40} className="text-white opacity-80" />
                </div>
                <h3 className="text-white font-bold truncate">{pl.name}</h3>
                <p className="text-xs text-text-subdued truncate">Playlist</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {likedSongs.length > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="text-brand fill-brand" size={24} /> 
              Liked Songs
            </h2>
          </div>
          <div className="flex flex-col gap-2 bg-bg-elevated/50 rounded-xl p-2 border border-white/5">
            {likedSongs.map((song, index) => (
              <div 
                key={song.id} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                onClick={() => playSong(song, likedSongs)}
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
                
                <div className="text-text-subdued text-sm flex items-center gap-1">
                  <Clock size={14} className="opacity-50" />
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-bg-elevated/20 rounded-2xl border border-white/5">
          <Heart className="text-text-subdued mb-4 opacity-50" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Songs you like will appear here</h2>
          <p className="text-text-subdued">Save songs by tapping the heart icon.</p>
        </div>
      )}
    </div>
  );
}
