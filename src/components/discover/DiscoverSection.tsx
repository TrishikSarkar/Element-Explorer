'use client';

import React, { useState } from 'react';
import { ELEMENTS_BY_NUMBER } from '@/data/elements';
import { ChemicalElement, ElementCategory } from '@/types/element';
import { useElementStore } from '@/store/elementStore';
import { Box, ArrowRight, Leaf, Cpu, Mountain, FlaskConical, Sparkles } from 'lucide-react';

interface CuratedTheme {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  elementNumbers: number[];
}

const SpiralGalaxyIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12c-2.2-2.2-5.5-1.5-6.5.5s.5 5.5 3 6.5 5.5-.5 6.5-3-1-5.5-3-6.5-5.5.5-6.5 3" />
    <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeOpacity="0.4" />
  </svg>
);

const getCardBorderColor = (category: ElementCategory, atomicNumber: number): string => {
  // Fine-tuned palette matching reference Image 2
  switch (atomicNumber) {
    case 1: // Hydrogen
      return 'border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.06)]';
    case 2: // Helium
      return 'border-sky-500/35 hover:border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.07)]';
    case 8: // Oxygen
      return 'border-yellow-600/35 hover:border-yellow-500/60 shadow-[0_0_20px_rgba(202,138,4,0.06)]';
    case 6: // Carbon
      return 'border-teal-500/30 hover:border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.06)]';
    case 10: // Neon
      return 'border-purple-500/35 hover:border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.07)]';
    case 26: // Iron
      return 'border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.06)]';
    case 12: // Magnesium
      return 'border-amber-600/35 hover:border-amber-500/60 shadow-[0_0_20px_rgba(217,119,6,0.06)]';
    case 14: // Silicon
      return 'border-indigo-500/35 hover:border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.07)]';
    default:
      break;
  }

  switch (category) {
    case 'reactive-nonmetal':
      return 'border-amber-500/25 hover:border-amber-400/50';
    case 'noble-gas':
      return 'border-sky-500/30 hover:border-sky-400/50';
    case 'transition-metal':
      return 'border-blue-500/25 hover:border-blue-400/50';
    case 'alkaline-earth':
      return 'border-amber-600/30 hover:border-amber-500/50';
    case 'alkali-metal':
      return 'border-rose-500/25 hover:border-rose-400/50';
    case 'metalloid':
      return 'border-indigo-500/30 hover:border-indigo-400/50';
    case 'post-transition-metal':
      return 'border-emerald-500/25 hover:border-emerald-400/50';
    case 'halogen':
      return 'border-teal-500/30 hover:border-teal-400/50';
    case 'lanthanide':
      return 'border-fuchsia-500/30 hover:border-fuchsia-400/50';
    case 'actinide':
      return 'border-purple-500/30 hover:border-purple-400/50';
    default:
      return 'border-white/10 hover:border-white/25';
  }
};

export const DiscoverSection: React.FC = () => {
  const { openDetail, selectRandomElement } = useElementStore();
  const [selectedThemeId, setSelectedThemeId] = useState<string>('abundant');

  const themes: CuratedTheme[] = [
    {
      id: 'abundant',
      title: 'Cosmic Abundance',
      description:
        'The primary elements forged in the Big Bang and stellar furnaces constituting the observable universe.',
      icon: <SpiralGalaxyIcon className="w-4 h-4" />,
      image: '/images/galaxy_thumb.jpg',
      elementNumbers: [1, 2, 8, 6, 10, 26, 12, 14], // H, He, O, C, Ne, Fe, Mg, Si
    },
    {
      id: 'life',
      title: 'Essential for Life',
      description:
        'Elements that form DNA, proteins, ATP cellular energy, neural impulses, and skeletal bone mineral.',
      icon: <Leaf className="w-4 h-4" />,
      image: '/images/life_thumb.jpg',
      elementNumbers: [8, 6, 1, 7, 20, 15, 19, 11], // O, C, H, N, Ca, P, K, Na
    },
    {
      id: 'tech',
      title: 'Modern Technology',
      description:
        'The critical semiconductors, battery cathodes, touchscreens, and microchip dielectrics powering our world.',
      icon: <Cpu className="w-4 h-4" />,
      image: '/images/tech_thumb.jpg',
      elementNumbers: [14, 3, 31, 49, 73, 60, 32, 72], // Si, Li, Ga, In, Ta, Nd, Ge, Hf
    },
    {
      id: 'rare-earth',
      title: 'Rare Earth Elements',
      description:
        'Crucial f-block lanthanides powering ultra-strong permanent magnets, EV motors, and laser optics.',
      icon: <Mountain className="w-4 h-4" />,
      image: '/images/rare_thumb.jpg',
      elementNumbers: [60, 63, 66, 65, 62, 59, 39, 68], // Nd, Eu, Dy, Tb, Sm, Pr, Y, Er
    },
    {
      id: 'unusual',
      title: 'Extreme Properties',
      description:
        'Elements exhibiting bizarre physics: liquid metals, superfluidity, super-densities, and highest melting points.',
      icon: <FlaskConical className="w-4 h-4" />,
      image: '/images/extreme_thumb.jpg',
      elementNumbers: [80, 31, 74, 76, 2, 83, 77, 9], // Hg, Ga, W, Os, He, Bi, Ir, F
    },
    {
      id: 'recent',
      title: 'Recent Discoveries',
      description:
        'The heaviest synthesized elements created one atom at a time in particle accelerator laboratories.',
      icon: <Sparkles className="w-4 h-4" />,
      image: '/images/recent_thumb.jpg',
      elementNumbers: [118, 117, 116, 115, 114, 113, 112, 111], // Og, Ts, Lv, Mc, Fl, Nh, Cn, Rg
    },
  ];

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const displayedElements = currentTheme.elementNumbers
    .map((num) => ELEMENTS_BY_NUMBER[num])
    .filter(Boolean) as ChemicalElement[];

  return (
    <section
      id="discover"
      className="w-full py-20 lg:py-28 relative bg-[#06070A] overflow-hidden select-none"
    >
      {/* Background Celestial Planet Limb Atmosphere matching Image 2 */}
      <div className="absolute top-0 right-0 w-[550px] sm:w-[750px] lg:w-[950px] h-[380px] lg:h-[480px] pointer-events-none overflow-hidden z-0 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/planet_limb.jpg"
          alt="Cosmic Horizon"
          className="w-full h-full object-cover object-top opacity-60 mix-blend-screen [mask-image:radial-gradient(ellipse_at_top_right,black_45%,transparent_85%)] [-webkit-mask-image:radial-gradient(ellipse_at_top_right,black_45%,transparent_85%)]"
        />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative z-10 space-y-9">
        {/* Section Heading & White Pill Button matching Image 2 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-zinc-500 inline-block" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-medium">
                CURATED COLLECTIONS
              </span>
            </div>

            {/* Title with dot */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              <span className="font-normal text-white">Discover the </span>
              <span className="font-extrabold text-white">Unknown.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-zinc-400 max-w-2xl leading-relaxed">
              Explore handpicked scientific collections revealing how elements shape cosmic evolution,
              human biology, cutting-edge computing, and quantum materials.
            </p>
          </div>

          {/* Random Element Pill Button matching Image 2 */}
          <button
            onClick={() => selectRandomElement()}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-xs sm:text-sm tracking-wide shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
          >
            <Box className="w-4 h-4 text-black stroke-[2]" />
            <span>Random Element</span>
            <ArrowRight className="w-4 h-4 text-black stroke-[2.2]" />
          </button>
        </div>

        {/* Theme Pills Selector matching Image 2 */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {themes.map((theme) => {
            const isActive = theme.id === selectedThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-xs sm:text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] border-white/30 text-white shadow-sm'
                    : 'bg-transparent border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-zinc-400'}>{theme.icon}</span>
                <span>{theme.title}</span>
              </button>
            );
          })}
        </div>

        {/* Curated Theme Banner Card with Image Preview matching Image 2 */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full md:w-auto">
            {/* Rectangular Image Preview */}
            <div className="w-full sm:w-48 lg:w-56 h-20 sm:h-22 rounded-xl overflow-hidden relative shrink-0 border border-white/10 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentTheme.image}
                alt={currentTheme.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {currentTheme.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                {currentTheme.description}
              </p>
            </div>
          </div>

          {/* Right: Counter with vertical divider */}
          <div className="flex items-center gap-6 self-end md:self-auto shrink-0 pr-2">
            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-white block leading-none">
                {displayedElements.length}
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mt-1 block">
                ELEMENTS CURATED
              </span>
            </div>
          </div>
        </div>

        {/* Elements Grid Cards matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayedElements.map((el) => {
            const cardBorder = getCardBorderColor(el.category, el.atomicNumber);
            return (
              <div
                key={el.atomicNumber}
                onClick={() => openDetail(el)}
                className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0C101A]/90 backdrop-blur-md border ${cardBorder} transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl`}
              >
                {/* Top Row: Symbol Badge + Name & Category + #Number */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Rounded Square Symbol Box */}
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center font-bold text-lg font-mono text-white group-hover:scale-105 transition-transform shrink-0">
                      {el.symbol}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight group-hover:text-zinc-200 transition-colors">
                        {el.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                        {el.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Atomic Number */}
                  <span className="text-xs font-mono text-zinc-500 font-medium">
                    #{el.atomicNumber}
                  </span>
                </div>

                {/* Center: Key Trivia Fact */}
                <p className="text-xs text-zinc-400 leading-relaxed min-h-[54px] my-4 line-clamp-3">
                  {el.funFact}
                </p>

                {/* Bottom: Two Stat Columns with Divider */}
                <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 items-center">
                  <div>
                    <div className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      MASS
                    </div>
                    <div className="text-xs font-mono font-medium text-white mt-0.5">
                      {el.atomicMass}
                    </div>
                  </div>

                  <div className="border-l border-white/10 pl-4">
                    <div className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      STATE
                    </div>
                    <div className="text-xs font-medium text-white capitalize mt-0.5">
                      {el.state}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
