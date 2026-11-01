export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementState = 'solid' | 'liquid' | 'gas' | 'unknown';
export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ChemicalElement {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string; // e.g. "1.008" or "[294]"
  exactMass?: number;
  category: ElementCategory;
  categoryLabel: string;
  period: number;
  group: number; // 1-18 (for lanthanides/actinides, group 3)
  block: ElementBlock;
  electronConfiguration: string;
  electronConfigurationSemantic?: string;
  shellDistribution: number[]; // electrons per shell: [2, 8, ...]
  protons: number;
  electrons: number;
  neutronsEstimate: number; // based on standard atomic weight or most stable isotope
  mostStableIsotope?: string;
  density: number | null; // g/cm³ at standard conditions
  meltingPoint: number | null; // Kelvin
  boilingPoint: number | null; // Kelvin
  state: ElementState;
  oxidationStates: string;
  electronegativity: number | null; // Pauling scale
  discoveryYear: number | string; // e.g. 1766 or "Ancient"
  discoverer: string;
  discoveryLocation?: string;
  description: string;
  applications: string[];
  funFact: string;
  appearance?: string;
  nameOrigin?: string;
  radioactive?: boolean;
  synthetic?: boolean;
  colorHex: string;
}

export interface CategoryInfo {
  id: ElementCategory;
  label: string;
  description: string;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
}

export const CATEGORY_CONFIG: Record<ElementCategory, CategoryInfo> = {
  'alkali-metal': {
    id: 'alkali-metal',
    label: 'Alkali Metals',
    description: 'Highly reactive, soft metals with single valence electron.',
    color: '#FB7185', // Rose
    borderColor: 'rgba(251, 113, 133, 0.4)',
    bgLight: 'rgba(251, 113, 133, 0.12)',
    textColor: '#FECDD3',
  },
  'alkaline-earth': {
    id: 'alkaline-earth',
    label: 'Alkaline Earth Metals',
    description: 'Reactive, electropositive divalent metals.',
    color: '#FB923C', // Orange
    borderColor: 'rgba(251, 146, 60, 0.4)',
    bgLight: 'rgba(251, 146, 60, 0.12)',
    textColor: '#FFEDD5',
  },
  'transition-metal': {
    id: 'transition-metal',
    label: 'Transition Metals',
    description: 'Ductile, malleable metals with high electrical conductivity.',
    color: '#38BDF8', // Sky Blue
    borderColor: 'rgba(56, 189, 248, 0.4)',
    bgLight: 'rgba(56, 189, 248, 0.12)',
    textColor: '#E0F2FE',
  },
  'post-transition-metal': {
    id: 'post-transition-metal',
    label: 'Post-Transition Metals',
    description: 'Metals located between transition metals and metalloids.',
    color: '#34D399', // Emerald
    borderColor: 'rgba(52, 211, 153, 0.4)',
    bgLight: 'rgba(52, 211, 153, 0.12)',
    textColor: '#D1FAE5',
  },
  'metalloid': {
    id: 'metalloid',
    label: 'Metalloids',
    description: 'Intermediate properties between metals and nonmetals.',
    color: '#A78BFA', // Violet
    borderColor: 'rgba(167, 139, 250, 0.4)',
    bgLight: 'rgba(167, 139, 250, 0.12)',
    textColor: '#EDE9FE',
  },
  'reactive-nonmetal': {
    id: 'reactive-nonmetal',
    label: 'Reactive Nonmetals',
    description: 'Essential life elements with high electronegativity.',
    color: '#FBBF24', // Amber
    borderColor: 'rgba(251, 191, 36, 0.4)',
    bgLight: 'rgba(251, 191, 36, 0.12)',
    textColor: '#FEF3C7',
  },
  'halogen': {
    id: 'halogen',
    label: 'Halogens',
    description: 'Highly reactive nonmetals that form salts with metals.',
    color: '#2DD4BF', // Teal
    borderColor: 'rgba(45, 212, 191, 0.4)',
    bgLight: 'rgba(45, 212, 191, 0.12)',
    textColor: '#CCFBF1',
  },
  'noble-gas': {
    id: 'noble-gas',
    label: 'Noble Gases',
    description: 'Extremely unreactive, colorless, odorless monoatomic gases.',
    color: '#818CF8', // Indigo
    borderColor: 'rgba(129, 140, 248, 0.4)',
    bgLight: 'rgba(129, 140, 248, 0.12)',
    textColor: '#E0E7FF',
  },
  'lanthanide': {
    id: 'lanthanide',
    label: 'Lanthanides',
    description: 'Rare earth f-block elements used in lasers and magnets.',
    color: '#F472B6', // Pink
    borderColor: 'rgba(244, 114, 182, 0.4)',
    bgLight: 'rgba(244, 114, 182, 0.12)',
    textColor: '#FCE7F3',
  },
  'actinide': {
    id: 'actinide',
    label: 'Actinides',
    description: 'Heavy, radioactive f-block elements.',
    color: '#C084FC', // Purple
    borderColor: 'rgba(192, 132, 252, 0.4)',
    bgLight: 'rgba(192, 132, 252, 0.12)',
    textColor: '#F3E8FF',
  },
  'unknown': {
    id: 'unknown',
    label: 'Unknown Properties',
    description: 'Recently synthesized superheavy synthetic elements.',
    color: '#94A3B8', // Slate
    borderColor: 'rgba(148, 163, 184, 0.4)',
    bgLight: 'rgba(148, 163, 184, 0.12)',
    textColor: '#F1F5F9',
  },
};
