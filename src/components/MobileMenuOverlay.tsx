"use client";

import React from "react";
import Link from "next/link";
import { X, Home, Search, Library, Play, Pause, SkipBack, SkipForward, User, LogOut } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuOverlay({ isOpen, onClose }: MobileMenuProps) {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrevious } = usePlayer();
  const { user, signOut } = useAuth();

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col bg-bg-base/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden ${
        isOpen ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none -translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="p-2 text-text-subdued hover:text-white">
          <X size={28} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 flex flex-col">
        {/* Navigation */}
        <nav className="flex flex-col gap-6 text-xl font-bold mt-4 mb-12">
          <Link href="/" onClick={onClose} className="flex items-center gap-4 text-white hover:text-brand">
            <Home size={28} />
            Home
          </Link>
          <Link href="/search" onClick={onClose} className="flex items-center gap-4 text-white hover:text-brand">
            <Search size={28} />
            Search
          </Link>
          <Link href="/library" onClick={onClose} className="flex items-center gap-4 text-white hover:text-brand">
            <Library size={28} />
            Library
          </Link>
          
          <div className="pt-6 border-t border-white/10 mt-2">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                    <User size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-bold truncate">
                      {user.user_metadata?.full_name || "User"}
                    </span>
                    <span className="text-text-subdued text-xs truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="flex items-center gap-4 text-red-500 hover:text-red-400 font-bold transition-colors"
                >
                  <LogOut size={28} />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={onClose} 
                className="flex items-center gap-4 text-brand hover:text-brand-hover font-bold transition-colors"
              >
                <User size={28} />
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {/* Player Controls */}
        <div className="mt-auto mb-10 bg-bg-elevated rounded-2xl p-6 shadow-2xl border border-white/5">
          <h3 className="text-sm font-semibold text-text-subdued uppercase tracking-widest mb-4">Now Playing</h3>
          
          {currentSong ? (
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-6 shadow-lg shadow-black/50">
                <Image 
                  src={currentSong.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"} 
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-2xl font-bold text-white text-center line-clamp-1">{currentSong.title}</h4>
              <p className="text-text-subdued text-center mt-1 mb-8">{currentSong.artist}</p>

              <div className="flex items-center justify-center gap-8 w-full">
                <button 
                  onClick={playPrevious}
                  className="text-white hover:text-brand transition-colors"
                >
                  <SkipBack size={36} fill="currentColor" />
                </button>
                
                <button 
                  onClick={togglePlayPause}
                  className="w-20 h-20 rounded-full bg-brand hover:bg-brand-hover hover:scale-105 flex items-center justify-center transition-all shadow-lg shadow-brand/30 text-white"
                >
                  {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
                </button>
                
                <button 
                  onClick={playNext}
                  className="text-white hover:text-brand transition-colors"
                >
                  <SkipForward size={36} fill="currentColor" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-bg-highlight mx-auto mb-4 flex items-center justify-center text-text-subdued">
                <Play size={24} />
              </div>
              <p className="text-text-subdued">Nothing is playing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
