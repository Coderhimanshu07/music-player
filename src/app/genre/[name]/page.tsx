"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { usePlayer, Song } from "@/context/PlayerContext";
import { fetchSongsByQuery } from "@/lib/api";
import { useParams } from "next/navigation";

export default function GenrePage() {
  const params = useParams();
  const genreName = decodeURIComponent(params.name as string);
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (genreName) {
      setLoading(true);
      fetchSongsByQuery(genreName)
        .then((results) => setSongs(results))
        .catch((e) => console.error("Genre fetch error", e))
        .finally(() => setLoading(false));
    }
  }, [genreName]);

  return (
    <div className="pb-10">
      <h2 className="text-3xl font-extrabold text-white mb-8 mt-2">
        {genreName}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-text-subdued py-10">
          No songs found for "{genreName}".
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
