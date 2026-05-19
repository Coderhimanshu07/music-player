"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { Song } from "./PlayerContext";

export interface Playlist {
  id: number;
  name: string;
  created_at: string;
}

interface PlaylistContextType {
  playlists: Playlist[];
  playlistSongs: Record<number, Song[]>;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: number) => Promise<void>;
  addSongToPlaylist: (playlistId: number, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: number, songId: string) => Promise<void>;
  refreshPlaylists: () => Promise<void>;
  refreshPlaylistSongs: (playlistId: number) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<Record<number, Song[]>>({});

  const refreshPlaylists = useCallback(async () => {
    if (!user) { setPlaylists([]); return; }
    const { data } = await supabase
      .from("playlists")
      .select("id, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setPlaylists(data);
  }, [user]);

  const refreshPlaylistSongs = useCallback(async (playlistId: number) => {
    const { data } = await supabase
      .from("playlist_songs")
      .select("song_data, position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true });
    if (data) {
      setPlaylistSongs((prev) => ({
        ...prev,
        [playlistId]: data.map((row: any) => row.song_data as Song),
      }));
    }
  }, []);

  useEffect(() => {
    if (user) refreshPlaylists();
  }, [user, refreshPlaylists]);

  const createPlaylist = async (name: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("playlists")
      .insert({ user_id: user.id, name });
    if (error) throw error;
    await refreshPlaylists();
  };

  const deletePlaylist = async (id: number) => {
    if (!user) return;
    await supabase.from("playlists").delete().eq("id", id);
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    setPlaylistSongs((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const addSongToPlaylist = async (playlistId: number, song: Song) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("playlist_songs")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1);
    const nextPos = existing && existing.length > 0 ? existing[0].position + 1 : 0;
    await supabase
      .from("playlist_songs")
      .insert({ playlist_id: playlistId, song_id: song.id, song_data: song, position: nextPos });
    await refreshPlaylistSongs(playlistId);
  };

  const removeSongFromPlaylist = async (playlistId: number, songId: string) => {
    await supabase
      .from("playlist_songs")
      .delete()
      .eq("playlist_id", playlistId)
      .eq("song_id", songId);
    await refreshPlaylistSongs(playlistId);
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        playlistSongs,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        refreshPlaylists,
        refreshPlaylistSongs,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error("usePlaylists must be used within a PlaylistProvider");
  }
  return context;
};
