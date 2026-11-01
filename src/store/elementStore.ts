import { create } from 'zustand';
import { ChemicalElement, ElementCategory, ElementBlock, ElementState } from '@/types/element';
import { ELEMENTS, ELEMENTS_BY_NUMBER } from '@/data/elements';

interface ElementStoreState {
  // Navigation & Tabs
  activeTab: 'explore' | 'discover' | 'compare' | 'about';
  setActiveTab: (tab: 'explore' | 'discover' | 'compare' | 'about') => void;

  // Selected element & details
  selectedElement: ChemicalElement | null;
  detailOpen: boolean;
  isFullScreenDetail: boolean;
  openDetail: (element: ChemicalElement) => void;
  closeDetail: () => void;
  toggleFullScreenDetail: () => void;
  nextElement: () => void;
  prevElement: () => void;

  // Filters
  filterCategory: ElementCategory | 'all';
  filterBlock: ElementBlock | 'all';
  filterState: ElementState | 'all';
  filterFavoritesOnly: boolean;
  setFilterCategory: (category: ElementCategory | 'all') => void;
  setFilterBlock: (block: ElementBlock | 'all') => void;
  setFilterState: (state: ElementState | 'all') => void;
  setFilterFavoritesOnly: (onlyFavs: boolean) => void;
  resetFilters: () => void;

  // Comparison
  compareList: ChemicalElement[];
  addToCompare: (element: ChemicalElement) => void;
  removeFromCompare: (atomicNumber: number) => void;
  clearCompare: () => void;

  // 3D Atomic Engine Controls
  viewMode3D: 'bohr' | 'quantum';
  showOrbitalPaths: boolean;
  showElectronLabels: boolean;
  isAnimationPaused: boolean;
  setViewMode3D: (mode: 'bohr' | 'quantum') => void;
  toggleOrbitalPaths: () => void;
  toggleElectronLabels: () => void;
  toggleAnimationPaused: () => void;

  // Modals & Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  aboutOpen: boolean;
  setAboutOpen: (open: boolean) => void;

  // Favorites & History (persisted)
  favorites: number[];
  recentHistory: number[];
  toggleFavorite: (atomicNumber: number) => void;
  isFavorite: (atomicNumber: number) => boolean;
  initPersistedState: () => void;

  // Utility
  selectRandomElement: () => ChemicalElement;
}

export const useElementStore = create<ElementStoreState>((set, get) => ({
  activeTab: 'explore',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedElement: null,
  detailOpen: false,
  isFullScreenDetail: false,

  openDetail: (element) => {
    // Record in history
    const currentHistory = get().recentHistory;
    const updatedHistory = [
      element.atomicNumber,
      ...currentHistory.filter((id) => id !== element.atomicNumber),
    ].slice(0, 10);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('element_explorer_history', JSON.stringify(updatedHistory));
      } catch {
        // Ignore storage errors
      }
    }

    set({
      selectedElement: element,
      detailOpen: true,
      recentHistory: updatedHistory,
    });
  },

  closeDetail: () => set({ detailOpen: false, isFullScreenDetail: false }),
  toggleFullScreenDetail: () => set((state) => ({ isFullScreenDetail: !state.isFullScreenDetail })),

  nextElement: () => {
    const current = get().selectedElement;
    if (!current) return;
    const nextNum = current.atomicNumber >= 118 ? 1 : current.atomicNumber + 1;
    const nextEl = ELEMENTS_BY_NUMBER[nextNum];
    if (nextEl) get().openDetail(nextEl);
  },

  prevElement: () => {
    const current = get().selectedElement;
    if (!current) return;
    const prevNum = current.atomicNumber <= 1 ? 118 : current.atomicNumber - 1;
    const prevEl = ELEMENTS_BY_NUMBER[prevNum];
    if (prevEl) get().openDetail(prevEl);
  },

  // Filters
  filterCategory: 'all',
  filterBlock: 'all',
  filterState: 'all',
  filterFavoritesOnly: false,

  setFilterCategory: (category) =>
    set((state) => ({
      filterCategory: state.filterCategory === category ? 'all' : category,
    })),
  setFilterBlock: (block) =>
    set((state) => ({
      filterBlock: state.filterBlock === block ? 'all' : block,
    })),
  setFilterState: (elState) =>
    set((state) => ({
      filterState: state.filterState === elState ? 'all' : elState,
    })),
  setFilterFavoritesOnly: (onlyFavs) =>
    set({ filterFavoritesOnly: onlyFavs }),

  resetFilters: () =>
    set({
      filterCategory: 'all',
      filterBlock: 'all',
      filterState: 'all',
      filterFavoritesOnly: false,
    }),

  // Comparison (up to 3 elements)
  compareList: [ELEMENTS[0], ELEMENTS[1], ELEMENTS[5]], // H, He, C default comparison
  addToCompare: (element) => {
    const current = get().compareList;
    if (current.some((el) => el.atomicNumber === element.atomicNumber)) return;
    if (current.length >= 3) {
      set({ compareList: [...current.slice(1), element] });
    } else {
      set({ compareList: [...current, element] });
    }
  },
  removeFromCompare: (atomicNumber) => {
    set((state) => ({
      compareList: state.compareList.filter((el) => el.atomicNumber !== atomicNumber),
    }));
  },
  clearCompare: () => set({ compareList: [] }),

  // 3D Engine
  viewMode3D: 'bohr',
  showOrbitalPaths: true,
  showElectronLabels: true,
  isAnimationPaused: false,
  setViewMode3D: (mode) => set({ viewMode3D: mode }),
  toggleOrbitalPaths: () => set((state) => ({ showOrbitalPaths: !state.showOrbitalPaths })),
  toggleElectronLabels: () => set((state) => ({ showElectronLabels: !state.showElectronLabels })),
  toggleAnimationPaused: () => set((state) => ({ isAnimationPaused: !state.isAnimationPaused })),

  // Modals & Search
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  aboutOpen: false,
  setAboutOpen: (open) => set({ aboutOpen: open }),

  // Favorites & History
  favorites: [1, 6, 8, 26, 79], // Initial favorites: H, C, O, Fe, Au
  recentHistory: [],
  toggleFavorite: (atomicNumber) => {
    const current = get().favorites;
    const exists = current.includes(atomicNumber);
    const updated = exists
      ? current.filter((id) => id !== atomicNumber)
      : [...current, atomicNumber];

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('element_explorer_favorites', JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
    set({ favorites: updated });
  },
  isFavorite: (atomicNumber) => get().favorites.includes(atomicNumber),

  initPersistedState: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedFavs = localStorage.getItem('element_explorer_favorites');
      if (savedFavs) {
        set({ favorites: JSON.parse(savedFavs) });
      }
      const savedHistory = localStorage.getItem('element_explorer_history');
      if (savedHistory) {
        set({ recentHistory: JSON.parse(savedHistory) });
      }
    } catch {
      // Ignore
    }
  },

  selectRandomElement: () => {
    const randomIndex = Math.floor(Math.random() * ELEMENTS.length);
    const element = ELEMENTS[randomIndex];
    get().openDetail(element);
    return element;
  },
}));
