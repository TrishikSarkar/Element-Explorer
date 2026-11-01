'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useElementStore } from '@/store/elementStore';
import { ArrowRight, Box } from 'lucide-react';

const HeroAtom = dynamic(
  () => import('./HeroAtom').then((mod) => mod.HeroAtom),
  { ssr: false }
);

export const HeroSection: React.FC = () => {
  const { selectRandomElement } = useElementStore();

  const scrollToTable = () => {
    const el = document.getElementById('periodic-table');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden bg-[#06070A] select-none">
      {/* Soft Cosmic Background Atmosphere with Seamless Bottom Blend */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
        {/* Soft cyan/blue nebula glow behind the atom */}
        <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-sky-500/[0.07] blur-[150px]" />
        <div className="absolute top-1/3 right-[12%] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.08] blur-[130px]" />
      </div>

      {/* Smooth bottom gradient feather to blend seamlessly into the periodic table */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#06070A]/80 to-[#06070A] pointer-events-none z-0" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Content matching Image 2 */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            {/* Eyebrow with leading dash */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-zinc-500 inline-block" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-medium">
                SCIENTIFIC INSTRUMENT & 3D ATOMIC ENGINE
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.05]">
                THE UNIVERSE <br />
                <span className="text-zinc-200">
                  IS MADE OF ELEMENTS.
                </span>
              </h1>
              <p className="text-[#8E9AA8] text-base sm:text-lg max-w-xl font-normal leading-relaxed pt-3">
                118 known elements. Infinite combinations. Explore the fundamental building blocks of everything around you with interactive 3D atomic orbitals and authentic IUPAC precision.
              </p>
            </div>

            {/* Action Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {/* White Pill Button */}
              <button
                onClick={scrollToTable}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.18)]"
              >
                <span>Explore Periodic Table</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>

              {/* Dark Outline Pill Button with Isometric Cube */}
              <button
                onClick={() => selectRandomElement()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-transparent hover:bg-white/[0.06] border border-white/20 hover:border-white/40 text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <Box className="w-4 h-4 text-zinc-300 stroke-[1.8]" />
                <span>Discover a Random Element</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Atom Simulation matching Image 2 */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] lg:min-h-[540px]">
            <HeroAtom />

            {/* Subtle bottom-right corner notation from Image 2 */}
            <div className="absolute bottom-2 right-4 flex flex-col items-end pointer-events-none text-zinc-600 select-none">
              <span className="text-[12px] font-mono leading-none">⌝</span>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500 mt-1">
                3D ATOM SIMULATION
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
