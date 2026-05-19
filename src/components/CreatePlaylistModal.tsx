"use client";

import React, { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { usePlaylists } from "@/context/PlaylistContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlaylistModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createPlaylist } = usePlaylists();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await createPlaylist(name.trim());
      setName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create playlist. Check that you ran the SQL for the playlists table.");
      console.error("Create playlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-bg-elevated rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Playlist</h2>
          <button onClick={onClose} className="text-text-subdued hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-subdued ml-1">Playlist Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My awesome playlist"
              className="w-full bg-bg-highlight/50 border border-white/5 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-text-subdued/50"
              autoFocus
              maxLength={100}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
