'use client';

import React from 'react';
import { ELEMENTS } from '@/data/elements';
import { ElementTile } from './ElementTile';
import { useElementStore } from '@/store/elementStore';
import { ChemicalElement, ElementCategory, ElementBlock } from '@/types/element';

export const PeriodicTable: React.FC = () => {
  const {
    selectedElement,
    filterCategory,
    setFilterCategory,
    filterBlock,
    setFilterBlock,
    filterState,
    filterFavoritesOnly,
    favorites,
  } = useElementStore();

  // Helper to determine if an element matches all current filters
  const isElementDimmed = (el: ChemicalElement): boolean => {
    if (filterCategory !== 'all' && el.category !== filterCategory) return true;
    if (filterBlock !== 'all' && el.block !== filterBlock) return true;
    if (filterState !== 'all' && el.state !== filterState) return true;
    if (filterFavoritesOnly && !favorites.includes(el.atomicNumber)) return true;
    return false;
  };

  const groupNumbers = Array.from({ length: 18 }, (_, i) => i + 1);
  const blocks: (ElementBlock | 'all')[] = ['all', 's', 'p', 'd', 'f'];

  // Categories for the sleek bottom legend matching reference design
  const categoryLegendItems: { key: ElementCategory; label: string; color: string }[] = [
    { key: 'alkali-metal', label: 'Alkali metals', color: '#F87171' },
    { key: 'alkaline-earth', label: 'Alkaline earth metals', color: '#FB923C' },
    { key: 'transition-metal', label: 'Transition metals', color: '#38BDF8' },
    { key: 'post-transition-metal', label: 'Post-transition', color: '#34D399' },
    { key: 'metalloid', label: 'Metalloids', color: '#A78BFA' },
    { key: 'reactive-nonmetal', label: 'Nonmetals', color: '#2DD4BF' },
    { key: 'halogen', label: 'Halogens', color: '#60A5FA' },
    { key: 'noble-gas', label: 'Noble gases', color: '#818CF8' },
    { key: 'lanthanide', label: 'Lanthanides', color: '#C084FC' },
    { key: 'actinide', label: 'Actinides', color: '#A855F7' },
  ];

  // Group elements by period & group for main table grid (rows 1 to 7, cols 1 to 18)
  const getMainGridElement = (period: number, group: number): ChemicalElement | null => {
    if (period === 6 && group === 3) return null; // Lanthanides placeholder
    if (period === 7 && group === 3) return null; // Actinides placeholder

    return (
      ELEMENTS.find(
        (el) =>
          el.period === period &&
          el.group === group &&
          el.category !== 'lanthanide' &&
          el.category !== 'actinide'
      ) || null
    );
  };

  // Lanthanides (57 to 71)
  const lanthanides = ELEMENTS.filter((el) => el.category === 'lanthanide').sort(
    (a, b) => a.atomicNumber - b.atomicNumber
  );

  // Actinides (89 to 103)
  const actinides = ELEMENTS.filter((el) => el.category === 'actinide').sort(
    (a, b) => a.atomicNumber - b.atomicNumber
  );

  return (
    <section id="explore" className="w-full py-12 lg:py-16 relative bg-[#06070A]">
      <div id="periodic-table" className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Sleek Top Header & Block Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          {/* Left: Subtitle, Elements Title & Inline Stats */}
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                THE PERIODIC TABLE
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Elements
              </h2>
            </div>

            {/* Vertical Divider */}
            <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />

            {/* Metadata Stats */}
            <div className="flex items-center gap-6 text-left">
              <div>
                <span className="font-mono text-lg font-bold text-white block leading-tight">
                  118
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  Elements
                </span>
              </div>

              <div>
                <span className="font-mono text-lg font-bold text-white block leading-tight">
                  7
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  Periods
                </span>
              </div>

              <div>
                <span className="font-mono text-lg font-bold text-white block leading-tight">
                  18
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  Groups
                </span>
              </div>

              <div>
                <span className="font-mono text-lg font-bold text-white block leading-tight">
                  4
                </span>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">
                  Blocks
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sleek Pill Block Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 self-start md:self-auto">
            {blocks.map((b) => {
              const isActive = filterBlock === b;
              return (
                <button
                  key={b}
                  onClick={() => setFilterBlock(b)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {b === 'all' ? 'All' : `${b}-block`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified 19-Column Responsive Table Container */}
        <div className="relative w-full overflow-x-auto pb-4 custom-scrollbar">
          <div
            className="grid gap-1.5 relative min-w-[1160px] select-none"
            style={{
              gridTemplateColumns: '88px repeat(18, minmax(54px, 1fr))',
            }}
          >
            {/* 1. Header Row (Empty corner + Group Numbers 1-18) */}
            <div className="flex items-center justify-end pr-3 font-mono text-[11px] text-zinc-600 font-semibold" />
            {groupNumbers.map((g) => (
              <div
                key={`group-header-${g}`}
                className="flex items-center justify-center font-mono text-[11px] text-zinc-500 py-1 font-medium"
              >
                {g}
              </div>
            ))}

            {/* 2. Periods 1 through 7 */}
            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
              <React.Fragment key={`period-row-${period}`}>
                {/* Period number indicator */}
                <div className="flex items-center justify-end pr-3 font-mono text-[11px] font-semibold text-zinc-500">
                  {period}
                </div>

                {/* 18 group columns */}
                {groupNumbers.map((group) => {
                  // Lanthanides placeholder at Period 6, Group 3
                  if (period === 6 && group === 3) {
                    return (
                      <button
                        key="lanthanides-placeholder"
                        onClick={() => setFilterCategory('lanthanide')}
                        className="w-full h-full min-w-0 aspect-square flex flex-col items-center justify-center p-1 rounded-xl border border-dashed border-violet-500/40 bg-violet-950/20 hover:bg-violet-900/30 text-violet-300 text-center transition-all cursor-pointer group"
                        title="Highlight Lanthanides (57-71)"
                      >
                        <span className="font-mono text-[10px] font-medium text-violet-400/90 leading-none">
                          57–71
                        </span>
                        <span className="text-xs font-semibold text-violet-200 mt-1 leading-none">
                          La–Lu
                        </span>
                      </button>
                    );
                  }

                  // Actinides placeholder at Period 7, Group 3
                  if (period === 7 && group === 3) {
                    return (
                      <button
                        key="actinides-placeholder"
                        onClick={() => setFilterCategory('actinide')}
                        className="w-full h-full min-w-0 aspect-square flex flex-col items-center justify-center p-1 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 text-center transition-all cursor-pointer group"
                        title="Highlight Actinides (89-103)"
                      >
                        <span className="font-mono text-[10px] font-medium text-purple-400/90 leading-none">
                          89–103
                        </span>
                        <span className="text-xs font-semibold text-purple-200 mt-1 leading-none">
                          Ac–Lr
                        </span>
                      </button>
                    );
                  }

                  const element = getMainGridElement(period, group);

                  if (!element) {
                    return (
                      <div
                        key={`empty-${period}-${group}`}
                        className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none"
                      />
                    );
                  }

                  const isDimmed = isElementDimmed(element);
                  const isSelected = selectedElement?.atomicNumber === element.atomicNumber;

                  return (
                    <ElementTile
                      key={element.atomicNumber}
                      element={element}
                      isDimmed={isDimmed}
                      isSelected={isSelected}
                    />
                  );
                })}
              </React.Fragment>
            ))}

            {/* Spacer row between Main Grid and F-Block */}
            <div className="h-6" style={{ gridColumn: '1 / -1' }} />

            {/* 3. Lanthanides Series Row (57 - 71) */}
            <div className="flex items-center justify-end pr-3 font-mono text-[11px] text-zinc-400 font-medium">
              Lanthanides
            </div>
            {/* Empty slots for Groups 1 and 2 */}
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />
            {/* 15 Lanthanides in columns 3 to 17 */}
            {lanthanides.map((element) => (
              <ElementTile
                key={element.atomicNumber}
                element={element}
                isDimmed={isElementDimmed(element)}
                isSelected={selectedElement?.atomicNumber === element.atomicNumber}
              />
            ))}
            {/* Empty slot for Group 18 */}
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />

            {/* 4. Actinides Series Row (89 - 103) */}
            <div className="flex items-center justify-end pr-3 font-mono text-[11px] text-zinc-400 font-medium">
              Actinides
            </div>
            {/* Empty slots for Groups 1 and 2 */}
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />
            {/* 15 Actinides in columns 3 to 17 */}
            {actinides.map((element) => (
              <ElementTile
                key={element.atomicNumber}
                element={element}
                isDimmed={isElementDimmed(element)}
                isSelected={selectedElement?.atomicNumber === element.atomicNumber}
              />
            ))}
            {/* Empty slot for Group 18 */}
            <div className="w-full h-full min-w-0 aspect-square opacity-0 pointer-events-none" />
          </div>
        </div>

        {/* Sleek Bottom Horizontal Category Legend (Reference Image 3 & 4) */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
              Categories
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {categoryLegendItems.map((cat) => {
              const isSelected = filterCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFilterCategory(cat.key)}
                  className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'text-white font-semibold scale-105'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: isSelected ? `0 0 10px ${cat.color}` : 'none',
                    }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {filterCategory !== 'all' && (
              <button
                onClick={() => setFilterCategory('all')}
                className="text-[11px] font-mono text-sky-400 hover:underline cursor-pointer ml-2"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
