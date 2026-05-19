"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { usePlayer, Song } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchSongsByQuery } from "@/lib/api";

const CURATED_PLAYLISTS = [
  { id: "1", title: "Bollywood Hits", description: "Latest & greatest Bollywood bangers", coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&q=80" },
  { id: "2", title: "Arijit Singh", description: "Soulful melodies by Arijit Singh", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
  { id: "3", title: "Punjabi Hits", description: "High-energy Punjabi tracks", coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=500&q=80" },
  { id: "4", title: "Romantic Hindi", description: "Love songs that touch the heart", coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80" },
  { id: "5", title: "Hip Hop English", description: "Top Hip Hop & Rap tracks", coverUrl: "https://images.unsplash.com/photo-1546427660-eb346c344ba5?w=500&q=80" },
  { id: "6", title: "Chill Vibes", description: "Relax and unwind", coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80" },
  { id: "7", title: "Party Songs Hindi", description: "Get the party started", coverUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&q=80" },
  { id: "8", title: "Lo-Fi Beats", description: "Beats to study & relax to", coverUrl: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500&q=80" },
  { id: "9", title: "Pop English", description: "Global pop chart-toppers", coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80" },
  { id: "10", title: "Workout Mix", description: "Power up your workout", coverUrl: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500&q=80" },
  { id: "11", title: "EDM Party", description: "Electronic dance anthems", coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80" },
];

export default function Home() {
  const { playSong } = usePlayer();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllMadeForYou, setShowAllMadeForYou] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const songs = await fetchSongsByQuery("top hits");
        setTrendingSongs(songs);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const playlists = CURATED_PLAYLISTS;

  const handlePlayPlaylist = async (playlistTitle: string) => {
    try {
      const songs = await fetchSongsByQuery(playlistTitle);
      if (songs.length > 0) {
        playSong(songs[0], songs);
      }
    } catch (error) {
      console.error("Failed to play playlist", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-6 md:pb-10">
      {/* Hero Section */}
      {playlists.length > 0 && (
        <Link href={`/genre/${encodeURIComponent(playlists[0].title)}`} className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer block">
          <Image 
            src={playlists[0].coverUrl} 
            alt="Featured Playlist"
            fill
            className="object-cover scale-[1.35] origin-bottom-right transition-transform duration-700 group-hover:scale-[1.4]"
          />
          {/* Watermark hider patch removed */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand mb-2 block">Featured Playlist</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{playlists[0].title}</h2>
              <p className="text-text-subdued max-w-md hidden md:block">{playlists[0].description}</p>
            </div>
            {trendingSongs.length > 0 && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  playSong(trendingSongs[0], trendingSongs);
                }}
                className="w-14 h-14 min-w-[56px] min-h-[56px] flex-shrink-0 rounded-full bg-brand hover:bg-brand-hover flex items-center justify-center transition-all shadow-xl shadow-brand/30 hover:scale-110 opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100"
              >
                <Play fill="currentColor" className="text-white ml-1" size={24} />
              </button>
            )}
          </div>
        </Link>
      )}

      {/* Recommended for you */}
      {playlists.length > 1 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">Made For You</h2>
            <button 
              onClick={() => setShowAllMadeForYou(!showAllMadeForYou)}
              className="text-sm text-text-subdued font-bold hover:text-white transition-colors"
            >
              {showAllMadeForYou ? "Show less" : "Show all"}
            </button>
          </div>
          
          {showAllMadeForYou ? (
            <div className="flex flex-col gap-2">
              {playlists.slice(1).map((playlist, index) => (
                <Link href={`/genre/${encodeURIComponent(playlist.title)}`} key={playlist.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                  <span className="text-text-subdued w-6 text-center">{index + 1}</span>
                  <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0 shadow-md">
                    <Image src={playlist.coverUrl} alt={playlist.title} fill className="object-cover scale-[1.35] origin-bottom-right" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        className="w-full h-full flex items-center justify-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePlayPlaylist(playlist.title);
                        }}
                      >
                        <Play fill="currentColor" className="text-white ml-1" size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white font-bold truncate">{playlist.title}</span>
                    <span className="text-sm text-text-subdued truncate">{playlist.description || "JioSaavn"}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {playlists.slice(1).map((playlist) => (
                <Link href={`/genre/${encodeURIComponent(playlist.title)}`} key={playlist.id} className="bg-bg-elevated p-4 rounded-xl hover:bg-bg-highlight transition-colors cursor-pointer group block">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
                    <Image src={playlist.coverUrl} alt={playlist.title} fill className="object-cover scale-[1.35] origin-bottom-right transition-transform duration-700 group-hover:scale-[1.45]" />
                    {/* Watermark hider patch removed */}
                    <div className="absolute inset-0 bg-black/20 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-end justify-end p-2">
                      <button 
                        className="w-10 h-10 rounded-full bg-brand hover:bg-brand-hover flex items-center justify-center shadow-lg shadow-brand/30 hover:scale-105 transition-all transform md:translate-y-4 md:group-hover:translate-y-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePlayPlaylist(playlist.title);
                        }}
                      >
                        <Play fill="currentColor" className="text-white ml-1" size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-bold truncate mb-1">{playlist.title}</h3>
                  <p className="text-xs text-text-subdued line-clamp-2">{playlist.description}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Top Tracks */}
      {trendingSongs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Trending Tracks</h2>
          <div className="flex flex-col gap-2">
            {trendingSongs.slice(0, 10).map((song, index) => (
              <div 
                key={song.id} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                onClick={() => playSong(song, trendingSongs)}
              >
                <span className="text-text-subdued w-6 text-center group-hover:hidden">{index + 1}</span>
                <button className="w-6 text-center hidden group-hover:flex justify-center text-white">
                  <Play size={16} fill="currentColor" />
                </button>
                
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
                  {/* Watermark hider patch removed */}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-white font-medium truncate">{song.title}</span>
                  <span className="text-sm text-text-subdued truncate">{song.artist}</span>
                </div>
                
                <div className="hidden md:block text-text-subdued text-sm flex-1 truncate">
                  {song.album}
                </div>
                
                <div className="text-text-subdued text-sm">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
