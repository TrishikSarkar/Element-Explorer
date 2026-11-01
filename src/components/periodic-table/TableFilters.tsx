'use client';

import React from 'react';
import { ElementBlock, ElementState } from '@/types/element';
import { useElementStore } from '@/store/elementStore';
import { RotateCcw, Filter } from 'lucide-react';

export const TableFilters: React.FC = () => {
  const {
    filterBlock,
    setFilterBlock,
    filterState,
    setFilterState,
    filterCategory,
    filterFavoritesOnly,
    resetFilters,
  } = useElementStore();

  const blocks: ElementBlock[] = ['s', 'p', 'd', 'f'];
  const states: ElementState[] = ['solid', 'liquid', 'gas', 'unknown'];

  const hasActiveFilters =
    filterBlock !== 'all' ||
    filterState !== 'all' ||
    filterCategory !== 'all' ||
    filterFavoritesOnly;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl glass-panel">
      {/* Blocks & States */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Block Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#8994A7] uppercase tracking-wider">
            BLOCK:
          </span>
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
            {blocks.map((block) => (
              <button
                key={block}
                onClick={() => setFilterBlock(block)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold transition-all ${
                  filterBlock === block
                    ? 'bg-sky-500/30 text-sky-300 border border-sky-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {block}-block
              </button>
            ))}
          </div>
        </div>

        {/* State of Matter Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#8994A7] uppercase tracking-wider">
            STATE:
          </span>
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize font-medium transition-all ${
                  filterState === st
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-medium transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
};
