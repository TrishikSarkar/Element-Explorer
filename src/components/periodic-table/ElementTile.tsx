'use client';

import React, { useState } from 'react';
import { ChemicalElement, CATEGORY_CONFIG } from '@/types/element';
import { useElementStore } from '@/store/elementStore';

interface ElementTileProps {
  element: ChemicalElement;
  isDimmed: boolean;
  isSelected: boolean;
}

export const ElementTile: React.FC<ElementTileProps> = ({
  element,
  isDimmed,
  isSelected,
}) => {
  const { openDetail } = useElementStore();
  const [isHovered, setIsHovered] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[element.category];

  return (
    <div
      onClick={() => openDetail(element)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`${element.name}, atomic number ${element.atomicNumber}, symbol ${element.symbol}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(element);
        }
      }}
      style={{
        borderColor: isSelected
          ? '#FFFFFF'
          : isHovered
          ? categoryConfig.color
          : isDimmed
          ? 'rgba(255, 255, 255, 0.03)'
          : `${categoryConfig.color}45`,
        backgroundColor: isSelected
          ? 'rgba(255, 255, 255, 0.08)'
          : isHovered
          ? `${categoryConfig.color}15`
          : isDimmed
          ? 'rgba(10, 12, 16, 0.2)'
          : 'rgba(15, 18, 24, 0.6)',
        boxShadow: isSelected
          ? `0 0 16px ${categoryConfig.color}80, inset 0 0 12px ${categoryConfig.color}30`
          : isHovered
          ? `0 0 14px ${categoryConfig.color}40`
          : 'none',
      }}
      className={`group relative flex flex-col justify-between p-1.5 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer select-none text-left w-full h-full min-w-0 aspect-square focus:outline-none ${
        isDimmed ? 'opacity-20 grayscale scale-[0.98]' : 'opacity-100'
      } ${isSelected ? 'scale-[1.04] z-20' : ''} ${
        isHovered && !isDimmed ? 'scale-[1.06] -translate-y-0.5 z-30' : ''
      }`}
    >
      {/* Top Left: Atomic Number (minimal, clean single/double digit) */}
      <span className="font-mono text-[10px] sm:text-[11px] font-medium text-zinc-400/90 group-hover:text-white transition-colors leading-none">
        {element.atomicNumber}
      </span>

      {/* Center: Large Chemical Symbol */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className="font-bold text-base sm:text-lg md:text-xl tracking-tight transition-colors leading-none"
          style={{
            color: isSelected || isHovered ? '#FFFFFF' : '#F1F4FA',
          }}
        >
          {element.symbol}
        </span>
      </div>

      {/* Sleek Floating Hover Tooltip */}
      {isHovered && (
        <div
          className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-[#0F131A] border border-white/20 text-white text-[11px] shadow-2xl pointer-events-none whitespace-nowrap flex items-center gap-2 animate-fadeIn"
          style={{
            boxShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 15px ${categoryConfig.color}50`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: categoryConfig.color }}
          />
          <span className="font-semibold text-white">{element.name}</span>
          <span className="text-zinc-400 font-mono text-[10px]">
            {element.atomicMass} u
          </span>
          <span className="text-zinc-500 capitalize text-[10px]">• {element.state}</span>
        </div>
      )}
    </div>
  );
};
