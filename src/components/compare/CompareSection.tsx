'use client';

import React, { useState } from 'react';
import { useElementStore } from '@/store/elementStore';
import { ELEMENTS } from '@/data/elements';
import { ChemicalElement } from '@/types/element';
import {
  BarChart2,
  RotateCcw,
  Layers,
  Flame,
  Disc,
  Cpu,
  ChevronDown,
  Table2,
  Plus,
  X,
} from 'lucide-react';

interface MetricOption {
  id: string;
  label: string;
  unit: string;
  getValue: (el: ChemicalElement) => number | null;
  formatValue: (val: number) => string;
}

export const CompareSection: React.FC = () => {
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    openDetail,
  } = useElementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false);
  const [selectedMetricId, setSelectedMetricId] = useState<string>('mass');

  // Filter available elements to add
  const availableElements = ELEMENTS.filter(
    (el) =>
      !compareList.some((c) => c.atomicNumber === el.atomicNumber) &&
      (el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.atomicNumber.toString().includes(searchQuery))
  ).slice(0, 8);

  // Preset comparison groups matching Image 2
  const presets = [
    {
      name: 'Coinage Metals',
      numbers: [29, 47, 79], // Cu, Ag, Au
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      name: 'Alkali Reactivity',
      numbers: [3, 11, 19], // Li, Na, K
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    {
      name: 'Noble Gas Radii',
      numbers: [2, 10, 18], // He, Ne, Ar
      icon: <Disc className="w-3.5 h-3.5" />,
    },
    {
      name: 'Semiconductor Group 14',
      numbers: [6, 14, 32], // C, Si, Ge
      icon: <Cpu className="w-3.5 h-3.5" />,
    },
  ];

  const applyPreset = (numbers: number[]) => {
    clearCompare();
    numbers.forEach((num) => {
      const el = ELEMENTS.find((e) => e.atomicNumber === num);
      if (el) addToCompare(el);
    });
  };

  // Metric options for graphical comparison
  const metrics: MetricOption[] = [
    {
      id: 'mass',
      label: 'Atomic Mass',
      unit: 'u',
      getValue: (el) =>
        el.exactMass || parseFloat(el.atomicMass.replace('[', '').replace(']', '')),
      formatValue: (v) => `${v.toFixed(3)} u`,
    },
    {
      id: 'density',
      label: 'Density',
      unit: 'g/cm³',
      getValue: (el) => el.density,
      formatValue: (v) => `${v} g/cm³`,
    },
    {
      id: 'melting',
      label: 'Melting Point',
      unit: 'K',
      getValue: (el) => el.meltingPoint,
      formatValue: (v) => `${v} K`,
    },
    {
      id: 'boiling',
      label: 'Boiling Point',
      unit: 'K',
      getValue: (el) => el.boilingPoint,
      formatValue: (v) => `${v} K`,
    },
    {
      id: 'electronegativity',
      label: 'Electronegativity',
      unit: 'Pauling',
      getValue: (el) => el.electronegativity,
      formatValue: (v) => `${v.toFixed(2)}`,
    },
    {
      id: 'protons',
      label: 'Proton Count',
      unit: 'p+',
      getValue: (el) => el.protons,
      formatValue: (v) => `${v} protons`,
    },
  ];

  const activeMetric = metrics.find((m) => m.id === selectedMetricId) || metrics[0];

  // Distinct palette for comparison slots matching Image 2 (Amber, Sky Blue, Emerald Green)
  const slotStyles = [
    {
      borderColor: 'border-amber-500/35 hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.06)]',
      barColor: 'bg-amber-400',
      badgeBorder: 'border-amber-500/40',
      badgeGlow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      textColor: 'text-amber-400',
    },
    {
      borderColor: 'border-sky-500/40 hover:border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.07)]',
      barColor: 'bg-sky-400',
      badgeBorder: 'border-sky-500/40',
      badgeGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.15)]',
      textColor: 'text-sky-400',
    },
    {
      borderColor: 'border-emerald-500/35 hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.06)]',
      barColor: 'bg-emerald-400',
      badgeBorder: 'border-emerald-500/40',
      badgeGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      textColor: 'text-emerald-400',
    },
  ];

  // Calculate maximum value for relative bar widths
  const metricValues = compareList.map((el) => activeMetric.getValue(el));
  const validValues = metricValues.filter((v): v is number => v !== null && !isNaN(v));
  const maxMetricVal = validValues.length > 0 ? Math.max(...validValues) : 1;

  return (
    <section
      id="compare"
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
        {/* Header matching Image 2 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4 h-4 text-zinc-400" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase font-medium">
                QUANTITATIVE ANALYSIS
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              <span className="font-normal text-white">Interactive Element </span>
              <span className="font-extrabold text-white">Comparison</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-[15px] text-zinc-400 max-w-2xl leading-relaxed">
              Compare atomic metrics, thermodynamics, electron orbitals, and chemical reactivity
              side-by-side for up to 3 elements.
            </p>
          </div>

          {/* Clear All Pill Button matching Image 2 */}
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-xs sm:text-sm font-medium text-white transition-all cursor-pointer self-start md:self-auto shrink-0 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Quick Comparisons Strip matching Image 2 */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase mr-1">
            QUICK COMPARISONS
          </span>
          {presets.map((preset, idx) => {
            const isFirst = idx === 0;
            return (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.numbers)}
                className={`px-4.5 py-2 rounded-full border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isFirst
                    ? 'border-white/30 bg-white/[0.06] text-white shadow-sm'
                    : 'border-white/10 bg-transparent hover:bg-white/[0.04] hover:border-white/20 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="text-zinc-300">{preset.icon}</span>
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Elements Top Row (Up to 3 Slots) matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {compareList.map((el, idx) => {
            const style = slotStyles[idx % slotStyles.length];
            return (
              <div
                key={el.atomicNumber}
                className={`p-4.5 rounded-2xl bg-[#0C101A]/90 backdrop-blur-md border ${style.borderColor} relative flex items-center justify-between transition-all duration-300 shadow-xl`}
              >
                <div
                  onClick={() => openDetail(el)}
                  className="flex items-center gap-3.5 cursor-pointer group"
                >
                  {/* Symbol Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/[0.04] border ${style.badgeBorder} flex items-center justify-center font-bold text-lg font-mono text-white group-hover:scale-105 transition-transform shrink-0`}
                  >
                    {el.symbol}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight group-hover:text-zinc-200 transition-colors">
                      {el.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400 block mt-0.5">
                      Atomic No. {el.atomicNumber} • {el.categoryLabel}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCompare(el.atomicNumber)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Add Slot if less than 3 */}
          {compareList.length < 3 && (
            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-full min-h-[76px] p-4.5 rounded-2xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center gap-2.5 cursor-pointer transition-all text-zinc-400 hover:text-white"
              >
                <Plus className="w-4 h-4 text-zinc-300" />
                <span className="text-xs sm:text-sm font-medium">Add Element to Compare</span>
              </div>

              {/* Element search dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 p-2 rounded-2xl bg-[#0D1119] border border-white/20 shadow-2xl space-y-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, symbol, or #..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                    {availableElements.map((el) => (
                      <button
                        key={el.atomicNumber}
                        onClick={() => {
                          addToCompare(el);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-xs text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white w-7 font-mono">{el.symbol}</span>
                          <span className="text-zinc-200">{el.name}</span>
                        </div>
                        <span className="font-mono text-zinc-500 text-[11px]">#{el.atomicNumber}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {compareList.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-white/10 bg-[#0B0F19]/80 text-zinc-400 space-y-3">
            <BarChart2 className="w-10 h-10 mx-auto text-zinc-500" />
            <h4 className="text-base font-semibold text-white">No Elements Selected</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Select elements using the add button above or pick a quick preset to view detailed
              side-by-side metric charts.
            </p>
          </div>
        ) : (
          /* Lower Panels Grid (2 Equal Cards) matching Image 2 */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Left Panel: Graphical Metric Comparisons matching Image 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-6">
              {/* Header with Title and Dropdown */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-zinc-300" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Graphical Metric Comparisons
                  </h3>
                </div>

                {/* Metric Selector Dropdown Pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsMetricDropdownOpen(!isMetricDropdownOpen)}
                    className="px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-xs font-medium text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{activeMetric.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {isMetricDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 z-30 w-44 rounded-xl bg-[#0D1119] border border-white/15 shadow-2xl py-1">
                      {metrics.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setSelectedMetricId(m.id);
                            setIsMetricDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                            m.id === selectedMetricId
                              ? 'bg-white/10 text-white font-medium'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {m.label} ({m.unit})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Metric Progress Bars matching Image 2 */}
              <div className="space-y-5 my-auto">
                {compareList.map((el, idx) => {
                  const val = activeMetric.getValue(el);
                  const style = slotStyles[idx % slotStyles.length];
                  const pct =
                    val !== null && maxMetricVal > 0 ? Math.max(8, (val / maxMetricVal) * 100) : 0;
                  const displayStr =
                    val !== null ? activeMetric.formatValue(val) : 'N/A';

                  return (
                    <div key={el.atomicNumber} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Mini Symbol Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl bg-white/[0.04] border ${style.badgeBorder} ${style.badgeGlow} flex items-center justify-center font-bold text-xs font-mono text-white shrink-0`}
                          >
                            {el.symbol}
                          </div>
                          <span className="text-sm font-medium text-white">{el.name}</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-300 font-medium">
                          {displayStr}
                        </span>
                      </div>

                      {/* Bar Track & Fill */}
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${style.barColor} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Systematic Properties Matrix matching Image 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-1">
                <Table2 className="w-4 h-4 text-zinc-300" />
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Systematic Properties Matrix
                </h3>
              </div>

              {/* Table matching Image 2 */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-500 font-mono text-[11px]">
                      <th className="py-3 pr-4 font-normal">Property</th>
                      {compareList.map((el, idx) => {
                        const style = slotStyles[idx % slotStyles.length];
                        return (
                          <th key={el.atomicNumber} className="py-3 px-3 font-normal text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-6 h-6 rounded-md bg-white/[0.04] border ${style.badgeBorder} text-[10px] font-mono font-bold text-white inline-flex items-center justify-center`}
                              >
                                {el.symbol}
                              </span>
                              <span className="font-medium text-xs">{el.name}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Atomic Number</td>
                      {compareList.map((el, idx) => {
                        const style = slotStyles[idx % slotStyles.length];
                        return (
                          <td key={el.atomicNumber} className={`py-3 px-3 font-bold ${style.textColor}`}>
                            {el.atomicNumber}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Category</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 text-zinc-300">
                          {el.categoryLabel}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Electron Configuration</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 text-zinc-300 text-[10.5px]">
                          {el.electronConfiguration}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Shell Distribution</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 text-zinc-300">
                          {el.shellDistribution.join(', ')}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Standard State</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 capitalize text-zinc-300">
                          {el.state}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Oxidation States</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 text-zinc-300">
                          {el.oxidationStates || 'None'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="py-3 pr-4 text-zinc-400">Year Discovered</td>
                      {compareList.map((el) => (
                        <td key={el.atomicNumber} className="py-3 px-3 text-zinc-300">
                          {el.discoveryYear}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
