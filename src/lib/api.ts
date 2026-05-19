import { Song } from "@/context/PlayerContext";

const API_BASE = "https://jiosaavn-api-ivory.vercel.app";

export async function fetchSongsByQuery(query: string, limit = 30): Promise<Song[]> {
  try {
    const response = await fetch(`${API_BASE}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const json = await response.json();

    if (json.data?.results) {
      return json.data.results.map(mapApiSongToLocalSong);
    }
    return [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

export async function fetchFeaturedPlaylists(): Promise<any[]> {
  return [];
}

function getBestQualityImage(images: any[]): string {
  if (!images || images.length === 0) return "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80";
  const bestImage = images[images.length - 1];
  return bestImage.link || bestImage.url;
}

function getBestAudioUrl(downloadUrls: any[]): string | undefined {
  if (!downloadUrls || downloadUrls.length === 0) return undefined;
  const bestAudio = downloadUrls[downloadUrls.length - 1];
  return bestAudio.url || bestAudio.link;
}

export function mapApiSongToLocalSong(apiSong: any): Song {
  let artistName = "Unknown Artist";
  if (apiSong.primaryArtists && typeof apiSong.primaryArtists === "string") {
    artistName = apiSong.primaryArtists;
  } else if (apiSong.artists?.primary?.length) {
    artistName = apiSong.artists.primary.map((a: any) => a.name).join(", ");
  } else if (apiSong.artists?.all?.length) {
    artistName = apiSong.artists.all.map((a: any) => a.name).join(", ");
  }

  artistName = artistName.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'");

  const albumName = apiSong.album?.name || "Unknown Album";

  return {
    id: apiSong.id,
    title: (apiSong.name || apiSong.title).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    artist: artistName,
    album: albumName.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
    coverUrl: getBestQualityImage(apiSong.image),
    duration: apiSong.duration || 0,
    audioUrl: getBestAudioUrl(apiSong.downloadUrl),
  };
}
