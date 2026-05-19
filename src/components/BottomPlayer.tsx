"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Heart, Plus } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylists } from "@/context/PlaylistContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "./Toast";

export function BottomPlayer() {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrevious, toggleLike, isLiked } = usePlayer();
  const { playlists, addSongToPlaylist } = usePlaylists();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [volume, setVolume] = React.useState(0.8);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.load();
      const playPromise = el.play();
      if (playPromise) {
        playPromise.catch((e) => {
          if (e.name !== "AbortError") console.error("Playback failed", e);
        });
      }
    } else {
      el.pause();
    }
  }, [isPlaying, currentSong]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, currentSong]);

  React.useEffect(() => {
    // Reset progress when song changes
    setProgress(0);
    setCurrentTime(0);
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="h-24 bg-bg-base border-t border-bg-elevated flex items-center justify-between px-4 md:px-6 z-50">
      {/* Hidden Audio Element */}
      {currentSong.audioUrl && (
        <audio 
          ref={audioRef}
          src={currentSong.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="auto"
        />
      )}

      {/* Now Playing Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
        <div className="relative w-14 h-14 rounded overflow-hidden shadow-md flex-shrink-0">
          <Image 
            src={currentSong.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80"} 
            alt={currentSong.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-white font-medium truncate hover:underline cursor-pointer">{currentSong.title}</span>
          <span className="text-sm text-text-subdued truncate hover:underline cursor-pointer">{currentSong.artist}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center max-w-[45%] w-full">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={playPrevious} className="text-text-subdued hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlayPause} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <button onClick={playNext} className="text-text-subdued hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 text-xs text-text-subdued">
          <span>{formatTime(currentTime)}</span>
          <div className="h-1 flex-1 bg-bg-highlight rounded-full overflow-hidden group cursor-pointer" onClick={(e) => {
            if (audioRef.current) {
              const bounds = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - bounds.left) / bounds.width;
              audioRef.current.currentTime = percent * audioRef.current.duration;
            }
          }}>
            <div className="h-full bg-white group-hover:bg-brand transition-colors relative" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{formatTime(currentSong.duration || 0)}</span>
        </div>
      </div>

      {/* Extra Controls: Volume Only */}
      <div className="hidden lg:flex items-center justify-end w-1/4 min-w-[180px] text-text-subdued pr-2">
        <div className="flex items-center gap-4 w-48 group cursor-pointer justify-end">
          {/* Add to Playlist */}
          {user && playlists.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="hover:text-white transition-colors hover:scale-110"
                title="Add to Playlist"
              >
                <Plus size={20} />
              </button>
              {showAddMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-bg-elevated border border-white/10 rounded-xl py-2 min-w-[180px] shadow-2xl z-50" onMouseLeave={() => setShowAddMenu(false)}>
                  <span className="text-xs font-bold uppercase tracking-widest text-text-subdued/50 px-3 pb-2 block">Add to Playlist</span>
                  {playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => { addSongToPlaylist(pl.id, currentSong); setShowAddMenu(false); showToast(`Added to "${pl.name}"`); }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors truncate"
                    >
                      {pl.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => { toggleLike(currentSong); showToast(isLiked(currentSong.id) ? "Removed from Liked Songs" : "Added to Liked Songs"); }} 
            className="hover:scale-110 transition-transform flex items-center justify-center"
          >
            <Heart size={20} className={isLiked(currentSong.id) ? "text-brand fill-brand" : "text-text-subdued hover:text-white transition-colors"} />
          </button>
          
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
          </button>
          <div 
            className="h-1 flex-1 bg-bg-highlight rounded-full overflow-hidden relative cursor-pointer"
            onClick={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect();
              const percent = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
              setVolume(percent);
              if (percent > 0) setIsMuted(false);
            }}
          >
            <div 
              className="h-full bg-white group-hover:bg-brand transition-colors" 
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
