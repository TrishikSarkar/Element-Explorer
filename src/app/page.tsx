'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { PeriodicTable } from '@/components/periodic-table/PeriodicTable';
import { DiscoverSection } from '@/components/discover/DiscoverSection';
import { CompareSection } from '@/components/compare/CompareSection';
import { ElementDetailModal } from '@/components/element-detail/ElementDetailModal';
import { CommandSearch } from '@/components/search/CommandSearch';
import { AboutModal } from '@/components/about/AboutModal';
import { Footer } from '@/components/layout/Footer';
import { useElementStore } from '@/store/elementStore';

export default function Home() {
  const { initPersistedState } = useElementStore();

  useEffect(() => {
    initPersistedState();
  }, [initPersistedState]);

  return (
    <main className="min-h-screen flex flex-col bg-[#06070A] text-[#F1F4FA] relative selection:bg-sky-500/30">
      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Experience Flow */}
      <div className="flex-1 flex flex-col">
        {/* 1. Hero Experience with 3D Rutherford-Bohr Engine */}
        <HeroSection />

        {/* 2. Interactive Periodic Table with 118 Elements & Filters */}
        <PeriodicTable />

        {/* 3. Discover Mode: Curated Cosmic & Biological Collections */}
        <DiscoverSection />

        {/* 4. Compare Mode: Multi-Element Quantitative Matrix & Bars */}
        <CompareSection />
      </div>

      {/* Global Modals & Overlays */}
      <ElementDetailModal />
      <CommandSearch />
      <AboutModal />

      {/* Footer */}
      <Footer />
    </main>
  );
}
