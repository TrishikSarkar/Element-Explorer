<div align="center">

# ⚛️ ELEMENT EXPLORER

### Interactive Periodic Table & 3D Atomic Chemistry Engine

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r187-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

<br />

<p align="center">
  A world-class, editorial scientific instrument combining authentic IUPAC/NIST chemical data, real-time 3D atomic orbital visualizations (WebGL / Three.js), precision periodic table exploration, and multi-element comparative analytics.
</p>

[**Explore Live Demo**](http://localhost:3000) • [**Features**](#-features) • [**Tech Stack**](#-tech-stack) • [**Getting Started**](#-getting-started) • [**Architecture**](#-project-architecture)

</div>

---

## ✨ Features

### 1. 🪐 Real-Time 3D Atomic Simulation Engine
* **Bohr Model Simulation**: Visualizes dynamic concentric electron orbits calculated with physical angular velocity scaling ($\propto 1/\sqrt{n}$).
* **Dynamic Multi-Shell Rendering**: Exact electron shell counts ($K, L, M, N, O, P, Q$) with interactive glowing particle trails.
* **Realistic Nucleon Cluster**: High-specular, glossy protons (crimson red) and neutrons (royal blue) arranged in an organic jittered sphere.
* **Quantum Probability Cloud Mode**: Switch dynamically between classical Bohr orbits and quantum volumetric electron probability clouds ($s, p, d$ orbitals).
* **Interactive Controls**: Drag to orbit in 3D space, mouse wheel zoom, play/pause animation, toggle orbital trajectory rings, and instant camera reset.
* **Graceful High-Fidelity Fallback**: Responsive 2D SVG vector engine with glowing filters if WebGL is unavailable.

### 2. 🧪 118-Element Interactive Periodic Table
* **Authentic IUPAC & NIST Data**: Complete physical, thermodynamic, and atomic parameters for all 118 chemical elements (Hydrogen to Oganesson).
* **Multi-Dimensional Filtering**:
  * **By Category**: Alkali Metals, Alkaline Earth, Transition Metals, Post-Transition, Metalloids, Nonmetals, Halogens, Noble Gases, Lanthanides, Actinides.
  * **By Block**: $s$-block, $p$-block, $d$-block, $f$-block.
  * **By State of Matter at STP**: Solid, Liquid, Gas, Unknown.
  * **Favorites**: Dedicated quick-toggle for bookmarked elements.
* **Seamless Accessibility**: Full keyboard navigation (Arrow keys, Space/Enter activation, `ESC` dismiss) and ARIA support.

### 3. 💎 Sleek Minimal Element Detail Modal
* **Glowing Elemental Tile**: Minimalist glassmorphic badge with atomic number, chemical symbol, name, and standard atomic weight.
* **Instant Coordinates**: Inline display of Period, Group, Block, and category tags.
* **Thermodynamic Key-Value Matrix**:
  * Standard Atomic Weight ($u / \text{Da}$)
  * State at STP
  * Density ($\text{g/cm}^3$)
  * Melting Point & Boiling Point (exact Kelvin and converted Celsius)
* **Tabbed Deep-Dive Exploration**:
  * **Atomic**: Protons ($p^+$), Neutrons ($n^0$), Electrons ($e^-$) metric cards; Electron configuration with superscripts (`[Ar] 3d³ 4s²`); Oxidation states; Electronegativity (Pauling scale); segmented electron shell distribution bars.
  * **Physical**: Comprehensive phase changes, STP behavior, and density metrics.
  * **Discovery**: Discoverer, year of discovery, location, and historical origins.
  * **Uses & Trivia**: Real-world commercial applications and scientific trivia.

### 4. 🌌 Curated Cosmic & Biological Collections (Discover Mode)
* **Cosmic Abundance**: Elements forged in the Big Bang and stellar nucleosynthesis.
* **Essential for Life**: Biochemical elements underpinning DNA, proteins, cellular respiration, and neural signaling.
* **Modern Technology**: Critical semiconductors, laser dopants, and rare earth elements driving quantum computing and photovoltaics.
* **Extreme Properties**: Highest densities, extreme melting points, and exotic synthetic superheavy elements.

### 5. 📊 Multi-Element Quantitative Comparison
* **Side-by-Side Comparison**: Compare up to 3 elements simultaneously.
* **Graphical Metric Comparisons**: Visual comparison bars for atomic mass, density, melting point, boiling point, and electronegativity.
* **Systematic Properties Matrix**: Tabular comparison across atomic structure, electron configurations, and discovery history.
* **Quick Presets**: Instant comparison sets for *Coinage Metals*, *Alkali Reactivity*, *Noble Gas Radii*, and *Semiconductors*.

### 6. ⚡ Lightning Command Palette (`⌘K` / `Ctrl+K`)
* Global modal palette with fuzzy search across element names, chemical symbols, atomic numbers, categories, and blocks.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server-side rendering, Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety with strict schema definitions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility engine, `@tailwindcss/postcss` |
| **3D Graphics** | [Three.js r187](https://threejs.org/) | WebGL 3D scene graph, ACES Filmic tone mapping, MeshStandardMaterial |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight global state with `localStorage` persistence |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI layout transitions, spring physics |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent scientific icon library |
| **Typography** | [Geist](https://vercel.com/font) | Geist Sans & Geist Mono optimized via `next/font` |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher (tested on Node `v22.x`)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TrishikSarkar/Element-Explorer.git
   cd Element-Explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

To compile an optimized production build:

```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
Element-Explorer/
├── public/
│   ├── images/              # Curated theme photographic assets
│   ├── element_logo.png     # Brand and scientific emblem
│   └── favicon.ico          # Application icons
├── src/
│   ├── app/
│   │   ├── globals.css      # Tailwind CSS v4 & custom glassmorphism styles
│   │   ├── layout.tsx       # Root layout with Geist fonts & metadata
│   │   └── page.tsx         # Main entry experience
│   ├── components/
│   │   ├── about/           # Mission & methodology modal
│   │   ├── compare/         # Multi-element quantitative comparison suite
│   │   ├── discover/        # Curated cosmic & biological collections
│   │   ├── element-detail/  # Sleek minimal detail modal & 3D atomic viewer
│   │   │   ├── Atomic3DViewer.tsx     # WebGL Three.js Rutherford-Bohr engine
│   │   │   ├── ElementDetailModal.tsx # 3-column minimal modal shell
│   │   │   └── ElementProperties.tsx  # Tabbed property matrix
│   │   ├── hero/            # Editorial hero section with live 3D atom
│   │   ├── layout/          # Sticky navigation & footer
│   │   ├── periodic-table/  # 118-element responsive grid & filters
│   │   └── search/          # Command palette (⌘K) modal
│   ├── data/
│   │   └── elements.ts      # Complete dataset for all 118 chemical elements
│   ├── store/
│   │   └── elementStore.ts  # Zustand store for selections, filters & comparison
│   └── types/
│       └── element.ts       # TypeScript interfaces for elements & categories
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # Tailwind CSS v4 PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Scripts & dependency definitions
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + K` or `Ctrl + K` | Open Universal Element Search Palette |
| `←` / `→` (in Modal) | Navigate to Previous / Next Element |
| `Escape` | Close Modal / Search / About dialog |
| `Space` / `Enter` | Open selected element from Periodic Table |

---

## 📜 Scientific Standards & Data Sources

All chemical and physical properties adhere to official recommendations from:
- **IUPAC** (*International Union of Pure and Applied Chemistry*)
- **NIST** (*National Institute of Standards and Technology Physical Reference Data*)
- Standard atomic weights reflect the most recent IUPAC Commission on Isotopic Abundances and Atomic Weights (CIAAW) evaluations.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Crafted with precision for chemists, researchers, students, and explorers of the cosmos.</sub>
</div>
