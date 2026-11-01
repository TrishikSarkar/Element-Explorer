'use client';

import React from 'react';
import { ElementCategory, CATEGORY_CONFIG } from '@/types/element';
import { useElementStore } from '@/store/elementStore';
import { ELEMENTS } from '@/data/elements';

export const CategoryLegend: React.FC = () => {
  const { filterCategory, setFilterCategory } = useElementStore();

  const categories = Object.keys(CATEGORY_CONFIG) as ElementCategory[];

  // Compute counts per category
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = ELEMENTS.filter((el) => el.category === cat).length;
    return acc;
  }, {} as Record<ElementCategory, number>);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono tracking-wider text-[#8994A7] uppercase">
          FILTER BY CHEMICAL CATEGORY
        </span>
        {filterCategory !== 'all' && (
          <button
            onClick={() => setFilterCategory('all')}
            className="text-[11px] font-mono text-sky-400 hover:underline cursor-pointer"
          >
            Reset Category
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map((catKey) => {
          const cfg = CATEGORY_CONFIG[catKey];
          const isSelected = filterCategory === catKey;
          const count = categoryCounts[catKey] || 0;

          return (
            <button
              key={catKey}
              onClick={() => setFilterCategory(catKey)}
              style={{
                borderColor: isSelected ? cfg.color : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: isSelected ? `${cfg.color}25` : 'rgba(18, 24, 36, 0.6)',
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'ring-1 ring-white/30 text-white shadow-sm'
                  : 'text-[#8994A7] hover:text-white hover:border-white/20'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: cfg.color }}
              />
              <span className="font-medium text-[11px]">{cfg.label}</span>
              <span
                className="font-mono-num text-[10px] px-1 py-0.2 rounded bg-black/40 text-zinc-400 ml-0.5"
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
