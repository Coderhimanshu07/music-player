"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileMenuOverlay } from "./MobileMenuOverlay";
import { BottomPlayer } from "./BottomPlayer";
import { Footer } from "./Footer";
import { PlayerProvider } from "@/context/PlayerContext";
import { PlaylistProvider } from "@/context/PlaylistContext";
import { ToastProvider } from "./Toast";
import { Menu, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleUserClick = () => {
    if (user) {
      // For now, let's just show a simple logout or go to profile
      // For simplicity, let's make it logout on click or show a small menu
      // I'll implement a logout button separately or just redirect to login if not authenticated
    } else {
      router.push("/login");
    }
  };

  return (
    <PlayerProvider>
      <PlaylistProvider>
        <ToastProvider>
      <div className="relative flex h-[100dvh] w-full overflow-hidden bg-bg-base text-text-base selection:bg-brand selection:text-white">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-bg-base border-r border-bg-elevated p-6 z-20">
          <Sidebar />
        </div>

        {/* Mobile Menu Overlay */}
        <MobileMenuOverlay 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Topbar / Mobile Header */}
          <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-bg-base/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-text-subdued hover:text-white transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Desktop Navigation / Search Area */}
            <div className="flex-1 flex items-center gap-4 ml-4 md:ml-0 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subdued" size={18} />
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get("q")?.toString() || "";
                    if (query.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                    }
                  }}
                >
                  <input 
                    name="q"
                    type="text" 
                    placeholder="What do you want to play?" 
                    className="w-full bg-bg-elevated rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand hover:bg-bg-highlight transition-colors"
                  />
                </form>
              </div>
            </div>

            <div className="flex items-center ml-4 gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:block text-xs font-medium text-text-subdued truncate max-w-[100px]">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <button 
                    onClick={() => signOut()}
                    className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-bg-highlight hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => router.push("/login")}
                  className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-bg-highlight transition-colors"
                  title="Login"
                >
                  <User size={16} />
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pb-6 md:pb-28 scrollbar-hide px-4 md:px-8 pt-4 flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        
        {/* Desktop Bottom Player */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-50">
          <BottomPlayer />
        </div>
      </div>
        </ToastProvider>
      </PlaylistProvider>
    </PlayerProvider>
  );
}
