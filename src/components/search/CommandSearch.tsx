'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useElementStore } from '@/store/elementStore';
import { ELEMENTS } from '@/data/elements';
import { ChemicalElement, CATEGORY_CONFIG } from '@/types/element';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';

export const CommandSearch: React.FC = () => {
  const { searchOpen, setSearchOpen, openDetail } = useElementStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global CMD+K / CTRL+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Filter elements matching query
  const cleanQuery = query.trim().toLowerCase();
  const results: ChemicalElement[] = cleanQuery
    ? ELEMENTS.filter((el) => {
        const matchesName = el.name.toLowerCase().includes(cleanQuery);
        const matchesSymbol = el.symbol.toLowerCase() === cleanQuery || el.symbol.toLowerCase().startsWith(cleanQuery);
        const matchesNumber = el.atomicNumber.toString() === cleanQuery || el.atomicNumber.toString().startsWith(cleanQuery);
        const matchesCategory = el.categoryLabel.toLowerCase().includes(cleanQuery) || el.category.includes(cleanQuery);
        return matchesName || matchesSymbol || matchesNumber || matchesCategory;
      }).slice(0, 8)
    : ELEMENTS.slice(0, 6); // show first few default elements when query is empty

  // Keyboard navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        openDetail(results[selectedIndex]);
        setSearchOpen(false);
      }
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={() => setSearchOpen(false)} />

      {/* Search Modal Container */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl glass-panel-elevated border border-white/20 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#080A0F]/60">
          <Search className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search by element name, symbol, atomic number, or category..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No matching elements found for <span className="text-zinc-300">"{query}"</span>.
            </div>
          ) : (
            results.map((el, idx) => {
              const isSelected = idx === selectedIndex;
              const catConfig = CATEGORY_CONFIG[el.category];

              return (
                <div
                  key={el.atomicNumber}
                  onClick={() => {
                    openDetail(el);
                    setSearchOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 border border-sky-500/40'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: `${catConfig.color}25`,
                        color: catConfig.textColor,
                        borderColor: catConfig.borderColor,
                      }}
                      className="w-10 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-base"
                    >
                      {el.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{el.name}</span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          #{el.atomicNumber}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {el.categoryLabel} • {el.state}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sky-400 font-semibold hidden sm:inline">
                      {el.atomicMass} u
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Footer hints */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>118 Elements Available</span>
        </div>
      </div>
    </div>
  );
};
