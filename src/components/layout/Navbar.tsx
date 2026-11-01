'use client';

import React, { useEffect, useState } from 'react';
import { useElementStore } from '@/store/elementStore';
import { Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    setActiveTab,
    setSearchOpen,
    setAboutOpen,
  } = useElementStore();

  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  const handleNav = (targetId: string, tab?: 'explore' | 'discover' | 'compare') => {
    if (tab) setActiveTab(tab);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#06070A]/80 transition-all select-none">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Left: Brand Logo from Reference Image 3 + Title */}
        <div
          onClick={() => handleNav('explore', 'explore')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Atomic Symbol from user's element_logo.png */}
          <div className="w-8 h-8 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/element_logo.png"
              alt="Element Explorer Logo"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          <span className="font-semibold text-sm tracking-[0.22em] text-white uppercase group-hover:text-zinc-200 transition-colors">
            ELEMENT EXPLORER
          </span>
        </div>

        {/* Right: Clean Text Navigation + Search Pill matching Image 2 */}
        <div className="flex items-center gap-7">
          <nav className="flex items-center gap-7 text-xs sm:text-sm font-normal text-zinc-300">
            <button
              onClick={() => handleNav('periodic-table', 'explore')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Table
            </button>

            <button
              onClick={() => handleNav('discover', 'discover')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Discover
            </button>

            <button
              onClick={() => handleNav('compare', 'compare')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Compare
            </button>

            <button
              onClick={() => setAboutOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Thin Vertical Separator */}
          <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />

          {/* Minimal Search Pill Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 text-xs text-zinc-300 transition-all cursor-pointer group"
            title="Search elements (⌘K or Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
            <span className="font-mono text-[11px] text-zinc-400">
              {isMac ? '⌘' : 'Ctrl+'}K
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
