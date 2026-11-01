'use client';

import React from 'react';
import { useElementStore } from '@/store/elementStore';
import { X, BookOpen, ShieldCheck, Atom, ExternalLink } from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { aboutOpen, setAboutOpen } = useElementStore();

  if (!aboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={() => setAboutOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl glass-panel-elevated border border-white/20 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Atom className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                About ELEMENT EXPLORER
              </h3>
              <p className="text-xs text-[#8994A7] font-mono">
                PRECISION SCIENTIFIC INSTRUMENT v2.4
              </p>
            </div>
          </div>

          <button
            onClick={() => setAboutOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm text-[#8994A7] leading-relaxed max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          <section className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Design & Scientific Philosophy</span>
            </h4>
            <p>
              ELEMENT EXPLORER was engineered at the intersection of scientific precision and digital craftsmanship. Our objective is to transform chemical education into an immersive, museum-grade scientific instrument.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Reference Data Sources & Standards</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>IUPAC (International Union of Pure and Applied Chemistry):</strong> Standard atomic weights (2021/2023 revision) and official element nomenclature.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>NIST Physical Measurement Laboratory:</strong> Ground state electron configurations and ionization energies.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>CRC Handbook of Chemistry and Physics:</strong> Thermochemical metrics, densities, melting, and boiling temperatures.
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-2 p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs">
            <h4 className="font-semibold text-sky-300">Scientific Visualization Notice</h4>
            <p className="text-sky-100/80 leading-relaxed">
              The 3D atomic orbital visualizer presents a concentric Bohr-Rutherford electron shell configuration calibrated to neutral atom electron totals. Real electrons obey quantum mechanical wave equations and exist as probability density distributions (viewable via the "Quantum" toggle).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Built for researchers, educators, and the curious.</span>
          <button
            onClick={() => setAboutOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
