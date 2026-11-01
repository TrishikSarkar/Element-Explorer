'use client';

import React from 'react';
import { useElementStore } from '@/store/elementStore';

export const Footer: React.FC = () => {
  const { setActiveTab, setAboutOpen } = useElementStore();

  const handleNav = (tab: 'explore' | 'discover' | 'compare') => {
    setActiveTab(tab);
    const el = document.getElementById(tab);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#05070A] py-12 px-4 sm:px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/element_logo.png" alt="Element Explorer Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold tracking-wider text-white text-sm">
              ELEMENT EXPLORER
            </span>
          </div>
          <p className="text-xs text-[#8994A7] max-w-sm">
            An interactive journey through the building blocks of matter.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#8994A7]">
          <button
            onClick={() => handleNav('explore')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => handleNav('discover')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Discover
          </button>
          <button
            onClick={() => handleNav('compare')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Compare
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About & IUPAC Sources
          </button>
        </div>

        {/* Motto & Attribution */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right text-[11px] font-mono text-zinc-500">
          <span className="text-zinc-400">Built for the curious.</span>
          <span>© 2026 Element Explorer Scientific Laboratory</span>
        </div>
      </div>
    </footer>
  );
};
