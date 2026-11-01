'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useElementStore } from '@/store/elementStore';
import { ElementProperties } from './ElementProperties';
import { CATEGORY_CONFIG } from '@/types/element';
import {
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Scale,
} from 'lucide-react';

const Atomic3DViewer = dynamic(
  () => import('./Atomic3DViewer').then((mod) => mod.Atomic3DViewer),
  { ssr: false }
);

export const ElementDetailModal: React.FC = () => {
  const {
    selectedElement,
    detailOpen,
    closeDetail,
    isFullScreenDetail,
    toggleFullScreenDetail,
    nextElement,
    prevElement,
    toggleFavorite,
    isFavorite,
    addToCompare,
    setActiveTab,
  } = useElementStore();

  // Handle ESC and Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && detailOpen) {
        closeDetail();
      } else if (e.key === 'ArrowRight' && detailOpen) {
        nextElement();
      } else if (e.key === 'ArrowLeft' && detailOpen) {
        prevElement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailOpen, closeDetail, nextElement, prevElement]);

  if (!detailOpen || !selectedElement) return null;

  const categoryConfig = CATEGORY_CONFIG[selectedElement.category];
  const isFav = isFavorite(selectedElement.atomicNumber);

  const handleCompareClick = () => {
    addToCompare(selectedElement);
    setActiveTab('compare');
    closeDetail();
    const compareSec = document.getElementById('compare');
    if (compareSec) {
      compareSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={closeDetail} />

      {/* Sleek Minimal Modal Window matching Image 2 */}
      <div
        className={`relative z-10 w-full rounded-3xl bg-[#080A0F] border border-white/10 flex flex-col overflow-hidden transition-all duration-300 shadow-[0_24px_70px_rgba(0,0,0,0.9)] ${
          isFullScreenDetail
            ? 'h-full max-w-full'
            : 'max-w-[1220px] max-h-[92vh] h-auto'
        }`}
      >
        {/* Subtle Top Atmospheric Light Arc Reflection from Image 2 */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[350px] pointer-events-none select-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 75% 0%, rgba(56, 189, 248, 0.12), transparent 75%)',
          }}
        />

        {/* Top Header Strip matching Image 2 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] relative z-20">
          {/* Navigation Prev / Next encapsulated in pill */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.04] border border-white/10">
            <button
              onClick={prevElement}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Previous Element (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-medium tracking-wider text-zinc-300">
              ELEMENT {selectedElement.atomicNumber} / 118
            </span>
            <button
              onClick={nextElement}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Next Element (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions (Compare, Bookmark, Fullscreen, Close) */}
          <div className="flex items-center gap-2.5">
            {/* Compare Button */}
            <button
              onClick={handleCompareClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-xs font-medium text-purple-300 border border-purple-500/25 transition-all cursor-pointer"
              title="Add this element to comparison table"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>Compare</span>
            </button>

            {/* Favorite / Bookmark */}
            <button
              onClick={() => toggleFavorite(selectedElement.atomicNumber)}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Bookmark Element"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-sky-400 text-sky-400' : ''}`} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullScreenDetail}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-colors hidden sm:block cursor-pointer"
              title="Toggle Fullscreen View"
            >
              {isFullScreenDetail ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={closeDetail}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-all cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3-Column Sleek Layout matching Image 2 */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] overflow-y-auto lg:overflow-hidden relative z-10">
          {/* LEFT COLUMN: Identity, Metadata & Sleek Key-Value List */}
          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-y-auto custom-scrollbar bg-[#080A0F]">
            {/* Top Row: Glowing Element Tile + Category & Coordinates */}
            <div className="flex items-start gap-5">
              {/* Sleek Glowing Card matching Image 2 */}
              <div
                style={{
                  borderColor: `${categoryConfig.color}60`,
                  boxShadow: `0 0 30px ${categoryConfig.color}30, inset 0 0 20px ${categoryConfig.color}15`,
                  background: `linear-gradient(135deg, ${categoryConfig.color}25 0%, rgba(12, 16, 24, 0.95) 100%)`,
                }}
                className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl border flex flex-col justify-between p-3 select-none"
              >
                <span className="font-mono text-base font-bold text-white/90 leading-none">
                  {selectedElement.atomicNumber}
                </span>
                <div className="flex-1 flex items-center justify-center">
                  <span className="font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
                    {selectedElement.symbol}
                  </span>
                </div>
                <div className="text-center space-y-0.5">
                  <span className="block text-xs font-semibold text-white/95 leading-tight">
                    {selectedElement.name}
                  </span>
                  <span className="block font-mono text-[11px] text-zinc-400 leading-none">
                    {selectedElement.atomicMass} u
                  </span>
                </div>
              </div>

              {/* Right Side: Category Pill + Period / Group / Block Table */}
              <div className="flex-1 flex flex-col justify-between h-full pt-1">
                {/* Category Pill with Colored Dot */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white self-start">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: categoryConfig.color }}
                  />
                  <span>{selectedElement.categoryLabel}</span>
                </div>

                {/* Coordinates Table */}
                <div className="space-y-2 mt-4 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-normal">Period</span>
                    <span className="font-mono text-white">{selectedElement.period}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-normal">Group</span>
                    <span className="font-mono text-white">{selectedElement.group}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-normal">Block</span>
                    <span className="font-mono text-white">{selectedElement.block}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Element Name & Clean Description */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {selectedElement.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#8E9AA8] leading-relaxed font-normal">
                {selectedElement.description}
              </p>
            </div>

            {/* Bottom Section: Sleek Key-Value Properties Table */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Standard Atomic Weight</span>
                <span className="font-mono text-white font-medium">{selectedElement.atomicMass} u</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">State at STP</span>
                <span className="text-white font-medium capitalize">{selectedElement.state}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Density</span>
                <span className="font-mono text-white font-medium">
                  {selectedElement.density ? `${selectedElement.density} g/cm³` : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Melting Point</span>
                <span className="font-mono text-white font-medium">
                  {selectedElement.meltingPoint
                    ? `${Math.round(selectedElement.meltingPoint - 273.15).toLocaleString('en-US')} °C`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Boiling Point</span>
                <span className="font-mono text-white font-medium">
                  {selectedElement.boilingPoint
                    ? `${Math.round(selectedElement.boilingPoint - 273.15).toLocaleString('en-US')} °C`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: 3D Atomic Engine & Floating Shells */}
          <div className="lg:col-span-4 min-h-[440px] relative flex flex-col bg-[#07090E]">
            <Atomic3DViewer element={selectedElement} />
          </div>

          {/* RIGHT COLUMN: Tabs, Subatomic Strip & Configuration Boxes */}
          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col overflow-y-auto custom-scrollbar bg-[#080A0F]">
            <ElementProperties element={selectedElement} />
          </div>
        </div>
      </div>
    </div>
  );
};
