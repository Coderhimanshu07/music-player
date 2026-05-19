import React from "react";
import { Heart } from "lucide-react";

const GithubIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" /><path d="M9 18c-4.5 1.5-5-2.5-7-3" /></svg>);
const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>);
const TwitterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 11 3 10c-1.1 0-2-.9-2-2 1.1.2 2.1.2 3 0-1-1.3-2-3-1-5 2.1 2.6 5.3 4.4 8.8 4.6a4.5 4.5 0 0 1 7.2-4.8 9 9 0 0 0 3-1.1c-.8 1.4-2 2.4-3.2 2.9A9 9 0 0 0 22 4z" /></svg>);
const WhatsappIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);

export function Footer() {
  return (
    <footer className="w-full py-6 md:py-10 mt-6 md:mt-12 border-t border-bg-elevated flex flex-col items-center">

      {/* Social Icons */}
      <div className="flex space-x-6 mb-6 md:mb-8 text-text-subdued">
        <a href="#" className="hover:text-brand transition-colors"><InstagramIcon /></a>
        <a href="#" className="hover:text-brand transition-colors"><TwitterIcon /></a>
        <a href="#" className="hover:text-brand transition-colors"><WhatsappIcon /></a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors"><GithubIcon /></a>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 md:mb-8 text-text-subdued text-sm font-medium">
        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="https://coderhimanshu.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">About Developer</a>
        <a href="#" className="hover:text-white transition-colors">Contact Developer</a>
      </div>

      {/* Copyright & Credit */}
      <p className="text-text-subdued text-xs md:text-sm mb-3">
        Copyright © 2026 All Rights Reserved
      </p>

      <div className="flex items-center space-x-2 text-text-subdued text-sm">
        <span>Made With</span>
        <Heart size={14} className="text-brand fill-brand" />
        <span>by Coder Himanshu</span>
      </div>
    </footer>
  );
}
