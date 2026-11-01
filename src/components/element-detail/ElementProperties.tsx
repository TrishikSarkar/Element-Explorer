'use client';

import React, { useState } from 'react';
import { ChemicalElement } from '@/types/element';
import { Atom, Thermometer, History, Box } from 'lucide-react';

interface ElementPropertiesProps {
  element: ChemicalElement;
}

export const ElementProperties: React.FC<ElementPropertiesProps> = ({ element }) => {
  const [activeTab, setActiveTab] = useState<'atomic' | 'physical' | 'discovery' | 'uses'>('atomic');

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Sleek Pill Tabs Bar matching Image 2 */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 self-start">
        <button
          onClick={() => setActiveTab('atomic')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'atomic'
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <Atom className="w-3.5 h-3.5 text-sky-400" />
          <span>Atomic</span>
        </button>

        <button
          onClick={() => setActiveTab('physical')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'physical'
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5" />
          <span>Physical</span>
        </button>

        <button
          onClick={() => setActiveTab('discovery')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'discovery'
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Discovery</span>
        </button>

        <button
          onClick={() => setActiveTab('uses')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeTab === 'uses'
              ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
              : 'text-zinc-400 hover:text-white border border-transparent'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Uses</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 space-y-4">
        {/* ATOMIC TAB */}
        {activeTab === 'atomic' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 3 Subatomic Particle Metric Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Protons */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-xs text-zinc-400 font-medium">Protons</span>
                </div>
                <span className="font-mono text-2xl font-bold text-white mt-2">
                  {element.protons}
                </span>
              </div>

              {/* Neutrons */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span className="text-xs text-zinc-400 font-medium">Neutrons</span>
                </div>
                <span className="font-mono text-2xl font-bold text-white mt-2">
                  {element.neutronsEstimate}
                </span>
              </div>

              {/* Electrons */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                  <span className="text-xs text-zinc-400 font-medium">Electrons</span>
                </div>
                <span className="font-mono text-2xl font-bold text-white mt-2">
                  {element.electrons}
                </span>
              </div>
            </div>

            {/* Electron Configuration */}
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">
                Electron Configuration
              </span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-sky-300">
                {element.electronConfiguration}
              </div>
            </div>

            {/* Oxidation States */}
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">
                Oxidation States
              </span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.oxidationStates || 'None known'}
              </div>
            </div>

            {/* Electronegativity (Pauling) */}
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">
                Electronegativity (Pauling)
              </span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.electronegativity ?? 'Not measured'}
              </div>
            </div>
          </div>
        )}

        {/* PHYSICAL TAB */}
        {activeTab === 'physical' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">State at STP</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white capitalize">
                {element.state}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Density</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.density ? `${element.density} g/cm³` : 'Unknown'}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Melting Point</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.meltingPoint
                  ? `${element.meltingPoint} K (${Math.round(element.meltingPoint - 273.15).toLocaleString('en-US')} °C)`
                  : 'Not experimentally observed'}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Boiling Point</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.boilingPoint
                  ? `${element.boilingPoint} K (${Math.round(element.boilingPoint - 273.15).toLocaleString('en-US')} °C)`
                  : 'Not experimentally observed'}
              </div>
            </div>
          </div>
        )}

        {/* DISCOVERY TAB */}
        {activeTab === 'discovery' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Discoverer</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm font-semibold text-white">
                {element.discoverer}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Discovery Year</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-sm font-semibold text-white">
                {element.discoveryYear}
              </div>
            </div>

            {element.discoveryLocation && (
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-400 font-medium block">Location</span>
                <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-sm font-medium text-white">
                  {element.discoveryLocation}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium block">Historical Context</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs leading-relaxed text-zinc-300">
                {element.nameOrigin || element.funFact}
              </div>
            </div>
          </div>
        )}

        {/* USES TAB */}
        {activeTab === 'uses' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-medium block">Primary Applications</span>
              <div className="space-y-1.5">
                {element.applications.map((app, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-zinc-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-zinc-400 font-medium block">Scientific Highlight</span>
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs leading-relaxed text-zinc-300">
                {element.funFact}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
