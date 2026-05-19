"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Search, Library, Plus, Heart, Music } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { CreatePlaylistModal } from "./CreatePlaylistModal";

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { playlists } = usePlaylists();

  return (
    <div className="flex flex-col h-full">
      <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14v-8l6 4-6 4z"/>
            </svg>
          </span>
          Melody
        </h1>
      </div>

      <nav className="flex flex-col gap-4 mb-8">
        <Link href="/" className="flex items-center gap-4 text-text-subdued hover:text-white transition-colors font-medium">
          <Home size={24} />
          Home
        </Link>
        <Link href="/search" className="flex items-center gap-4 text-text-subdued hover:text-white transition-colors font-medium">
          <Search size={24} />
          Search
        </Link>
        <Link href="/library" className="flex items-center gap-4 text-text-subdued hover:text-white transition-colors font-medium">
          <Library size={24} />
          Your Library
        </Link>
      </nav>

      <div className="flex flex-col gap-4 mb-6 pt-6 border-t border-bg-elevated">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-4 text-text-subdued hover:text-white transition-colors font-medium group"
        >
          <div className="w-6 h-6 bg-text-subdued group-hover:bg-white rounded flex items-center justify-center transition-colors">
            <Plus size={16} className="text-bg-base" />
          </div>
          Create Playlist
        </button>
        <Link href="/library" className="flex items-center gap-4 text-text-subdued hover:text-white transition-colors font-medium group">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-brand flex items-center justify-center rounded opacity-80 group-hover:opacity-100 transition-opacity">
            <Heart size={14} className="text-white fill-white" />
          </div>
          Liked Songs
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-10">
        <div className="flex flex-col gap-3 text-sm text-text-subdued">
          {user && playlists.length > 0 && (
            <>
              <span className="text-xs font-bold uppercase tracking-widest text-text-subdued/50 mb-1">Your Playlists</span>
              {playlists.map((playlist) => (
                <Link
                  href={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  className="flex items-center gap-3 text-left hover:text-white cursor-pointer truncate py-1 transition-colors"
                >
                  <Music size={16} className="flex-shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </Link>
              ))}
              <div className="my-2 border-t border-bg-elevated"></div>
            </>
          )}
          {["Bollywood Hits", "Arijit Singh", "Punjabi Hits", "Chill Vibes", "Lo-Fi Beats"].map((playlist) => (
            <Link
              href={`/genre/${encodeURIComponent(playlist)}`}
              key={playlist}
              className="text-left hover:text-white cursor-pointer truncate py-1 transition-colors flex justify-between items-center"
            >
              <span>{playlist}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
