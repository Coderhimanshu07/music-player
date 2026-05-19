"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  audioUrl?: string;
}

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  likedSongs: Song[];
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load liked songs from Supabase (if logged in) or localStorage
  useEffect(() => {
    async function loadLikedSongs() {
      if (user) {
        const { data } = await supabase
          .from("liked_songs")
          .select("song_data")
          .eq("user_id", user.id);
        if (data) {
          setLikedSongs(data.map((row: any) => row.song_data as Song));
        }
      } else {
        const saved = localStorage.getItem("melody_liked_songs");
        if (saved) {
          try {
            setLikedSongs(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse liked songs", e);
          }
        }
      }
      setIsLoaded(true);
    }
    loadLikedSongs();
  }, [user]);

  // Save liked songs to localStorage as fallback when not logged in
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem("melody_liked_songs", JSON.stringify(likedSongs));
    }
  }, [likedSongs, isLoaded, user]);

  const playSong = (song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (newQueue) {
      setQueue(newQueue);
    }
  };

  const togglePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const toggleLike = useCallback(async (song: Song) => {
    setLikedSongs((prev) => {
      const exists = prev.find((s) => s.id === song.id);
      if (exists) {
        return prev.filter((s) => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });

    if (!user) return;

    const exists = likedSongs.some((s) => s.id === song.id);
    if (exists) {
      await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", song.id);
    } else {
      await supabase
        .from("liked_songs")
        .insert({ user_id: user.id, song_id: song.id, song_data: song });
    }
  }, [user, likedSongs]);

  const isLiked = (songId: string) => {
    return likedSongs.some((s) => s.id === songId);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        likedSongs,
        toggleLike,
        isLiked,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
