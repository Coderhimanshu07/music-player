"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Play, Search as SearchIcon } from "lucide-react";
import { usePlayer, Song } from "@/context/PlayerContext";
import { fetchSongsByQuery } from "@/lib/api";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetchSongsByQuery(query)
        .then((results) => setSongs(results))
        .catch((e) => console.error("Search error", e))
        .finally(() => setLoading(false));
    } else {
      setSongs([]);
    }
  }, [query]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-subdued">
        <SearchIcon size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold mb-2">Search for Music</h2>
        <p>Find your favorite songs, artists, and playlists.</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Search Results for "{query}"
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-text-subdued text-center py-10">
          No songs found for "{query}".
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {songs.map((song, index) => (
            <div 
              key={song.id} 
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
              onClick={() => playSong(song, songs)}
            >
              <span className="text-text-subdued w-6 text-center group-hover:hidden">{index + 1}</span>
              <button className="w-6 text-center hidden group-hover:flex justify-center text-white">
                <Play size={16} fill="currentColor" />
              </button>
              
              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
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
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
