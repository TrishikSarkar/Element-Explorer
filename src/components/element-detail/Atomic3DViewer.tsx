'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChemicalElement, CATEGORY_CONFIG } from '@/types/element';
import { useElementStore } from '@/store/elementStore';
import {
  RotateCcw,
  Play,
  Pause,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface Atomic3DViewerProps {
  element: ChemicalElement;
}

export const Atomic3DViewer: React.FC<Atomic3DViewerProps> = ({ element }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    viewMode3D,
    setViewMode3D,
    showOrbitalPaths,
    toggleOrbitalPaths,
    showElectronLabels,
    toggleElectronLabels,
    isAnimationPaused,
    toggleAnimationPaused,
  } = useElementStore();

  const [webglSupported, setWebglSupported] = useState(true);

  // References for three.js manipulation outside the effect
  const controlsRef = useRef<{
    resetCamera: () => void;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const defaultCameraDist = Math.max(16, element.shellDistribution.length * 4.2 + 8);
    camera.position.set(0, defaultCameraDist * 0.4, defaultCameraDist);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const categoryConfig = CATEGORY_CONFIG[element.category];
    const accentColor = new THREE.Color(categoryConfig.color);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ==========================================
    // 1. NUCLEUS (Protons & Neutrons Cluster)
    // ==========================================
    const nucleusGroup = new THREE.Group();
    rootGroup.add(nucleusGroup);

    const protonCount = element.protons;
    const neutronCount = element.neutronsEstimate;
    // Cap visual cluster count for heavy atoms to maintain 60fps performance
    const visualNucleonCount = Math.min(protonCount + neutronCount, 48);

    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Vibrant glossy red
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.25,
    });

    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Rich glossy royal blue matching reference
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.25,
    });

    // Nucleus core light
    const nucleusLight = new THREE.PointLight(accentColor.getHex(), 2.5, 30);
    nucleusGroup.add(nucleusLight);

    const nucleonRadius = visualNucleonCount > 24 ? 0.28 : 0.38;
    const nucleonGeom = new THREE.SphereGeometry(nucleonRadius, 16, 16);

    for (let i = 0; i < visualNucleonCount; i++) {
      const isProton = i % 2 === 0;
      const sphereMesh = new THREE.Mesh(nucleonGeom, isProton ? protonMat : neutronMat);

      // Distribute in a compact spherical jitter
      const r = Math.pow(Math.random(), 0.5) * (1.1 + Math.log(visualNucleonCount) * 0.3);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      sphereMesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      nucleusGroup.add(sphereMesh);
    }

    // ==========================================
    // 2. ELECTRON SHELLS & ORBITS (Bohr Model)
    // ==========================================
    const bohrGroup = new THREE.Group();
    rootGroup.add(bohrGroup);

    interface OrbitingElectron {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      inclinationEuler: THREE.Euler;
    }

    const orbitingElectrons: OrbitingElectron[] = [];
    const ringMeshes: THREE.Line[] = [];

    const shellColors = [
      0x38bdf8, 0x818cf8, 0xa78bfa, 0x34d399, 0xfbbf24, 0xf472b6, 0x2dd4bf,
    ];

    element.shellDistribution.forEach((electronCountInShell, shellIdx) => {
      const shellRadius = 3.2 + shellIdx * 2.3;
      const shellColor = shellColors[shellIdx % shellColors.length];

      // Inclined orbital plane for visual dynamism
      const incX = (shellIdx * 0.45) % Math.PI;
      const incY = (shellIdx * 0.72) % Math.PI;
      const incZ = (shellIdx * 0.3) % Math.PI;
      const inclinationEuler = new THREE.Euler(incX, incY, incZ);

      // Ring geometry
      const curve = new THREE.EllipseCurve(0, 0, shellRadius, shellRadius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(96);
      const ringGeom = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, p.y, 0))
      );
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: showOrbitalPaths ? 0.45 : 0,
      });
      const ringMesh = new THREE.Line(ringGeom, ringMat);
      ringMesh.rotation.copy(inclinationEuler);
      bohrGroup.add(ringMesh);
      ringMeshes.push(ringMesh);

      // Distribute electrons along this shell ring
      const electronGeom = new THREE.SphereGeometry(0.28, 16, 16);
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 2.2,
        roughness: 0.1,
      });

      for (let eIdx = 0; eIdx < electronCountInShell; eIdx++) {
        const baseAngle = (eIdx / electronCountInShell) * Math.PI * 2;
        const eleMesh = new THREE.Mesh(electronGeom, electronMat);
        bohrGroup.add(eleMesh);

        orbitingElectrons.push({
          mesh: eleMesh,
          radius: shellRadius,
          speed: (1.2 / Math.sqrt(shellIdx + 1)) * (shellIdx % 2 === 0 ? 1 : -1),
          angle: baseAngle,
          inclinationEuler,
        });
      }
    });

    // ==========================================
    // 3. QUANTUM PROBABILITY CLOUDS (Quantum Mode)
    // ==========================================
    const quantumGroup = new THREE.Group();
    rootGroup.add(quantumGroup);

    // Stylized s, p, and d probability density clouds
    const qParticleCount = 1200;
    const qPositions = new Float32Array(qParticleCount * 3);
    const qColors = new Float32Array(qParticleCount * 3);

    for (let i = 0; i < qParticleCount; i++) {
      const idx = i * 3;
      // Probabilistic distribution modeling orbital lobes (spherical s + dumbbell p)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      // Angular modulation for p-orbital lobes: cos^2(phi)
      const angularFactor = 0.5 + 0.8 * Math.pow(Math.cos(phi), 2);
      const r = (Math.pow(Math.random(), 0.5) * 6 + 1.5) * angularFactor;

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      qPositions[idx] = px;
      qPositions[idx + 1] = py;
      qPositions[idx + 2] = pz;

      // Color gradient from center out
      const distRatio = Math.min(r / 6, 1);
      qColors[idx] = 0.2 + 0.8 * distRatio;
      qColors[idx + 1] = 0.7 - 0.3 * distRatio;
      qColors[idx + 2] = 0.95;
    }

    const qGeom = new THREE.BufferGeometry();
    qGeom.setAttribute('position', new THREE.BufferAttribute(qPositions, 3));
    qGeom.setAttribute('color', new THREE.BufferAttribute(qColors, 3));

    const qMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const quantumCloud = new THREE.Points(qGeom, qMat);
    quantumGroup.add(quantumCloud);

    // Initial view mode toggle
    bohrGroup.visible = viewMode3D === 'bohr';
    quantumGroup.visible = viewMode3D === 'quantum';

    // ==========================================
    // 4. LIGHTING & ENVIRONMENT
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 30, 25);
    scene.add(dirLight);

    // ==========================================
    // 5. MOUSE INTERACTION & DRAG ORBITING
    // ==========================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotX = 0.2;
    let rotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      rotY += deltaX * 0.008;
      rotX += deltaY * 0.008;
      rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Zoom on scroll
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      camera.position.z = Math.max(8, Math.min(50, camera.position.z + zoomFactor));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Reset camera exposed method
    controlsRef.current = {
      resetCamera: () => {
        rotX = 0.2;
        rotY = 0;
        camera.position.set(0, defaultCameraDist * 0.4, defaultCameraDist);
        camera.lookAt(0, 0, 0);
      },
    };

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update visibility of orbital rings dynamically
      ringMeshes.forEach((mesh) => {
        const mat = mesh.material as THREE.LineBasicMaterial;
        mat.opacity = showOrbitalPaths ? 0.35 : 0;
      });

      // Update view modes
      bohrGroup.visible = viewMode3D === 'bohr';
      quantumGroup.visible = viewMode3D === 'quantum';

      if (!isAnimationPaused) {
        // Rotate nucleus gently
        nucleusGroup.rotation.y += delta * 0.4;
        nucleusGroup.rotation.x += delta * 0.2;

        // Animate Bohr orbiting electrons
        orbitingElectrons.forEach((el) => {
          el.angle += delta * el.speed;
          const localX = Math.cos(el.angle) * el.radius;
          const localY = Math.sin(el.angle) * el.radius;

          const pos = new THREE.Vector3(localX, localY, 0);
          pos.applyEuler(el.inclinationEuler);
          el.mesh.position.copy(pos);
        });

        // Rotate quantum cloud
        quantumCloud.rotation.y += delta * 0.25;
        quantumCloud.rotation.z += delta * 0.12;

        // Auto spin if not dragging
        if (!isDragging) {
          rotY += delta * 0.1;
        }
      }

      // Smooth camera orientation
      rootGroup.rotation.x = rotX;
      rootGroup.rotation.y = rotY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [element, viewMode3D, showOrbitalPaths, isAnimationPaused]);

  if (!webglSupported) {
    return (
      <div className="relative w-full h-full min-h-[440px] flex flex-col select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#06080E] to-[#04060A]">
        {/* Top Floating Controls Bar */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 pointer-events-auto">
            <button
              onClick={() => setViewMode3D('bohr')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                viewMode3D === 'bohr'
                  ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                  : 'text-zinc-400 hover:text-white border border-transparent'
              }`}
            >
              Bohr
            </button>
            <button
              onClick={() => setViewMode3D('quantum')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                viewMode3D === 'quantum'
                  ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                  : 'text-zinc-400 hover:text-white border border-transparent'
              }`}
            >
              Quantum
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={toggleAnimationPaused}
              className="p-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
              title={isAnimationPaused ? 'Play' : 'Pause'}
            >
              {isAnimationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleOrbitalPaths}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                showOrbitalPaths
                  ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                  : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle orbital paths"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {}}
              className="p-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* High-Fidelity Animated 2D Bohr Atom Engine */}
        <div className="w-full flex-1 flex items-center justify-center relative p-6">
          <svg className="w-64 h-64 sm:w-72 sm:h-72" viewBox="0 0 320 320">
            <defs>
              <radialGradient id="redProton" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
              <radialGradient id="blueNeutron" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="60%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
              <filter id="electronGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Concentric Blue Orbital Rings with Orbiting Electrons */}
            {element.shellDistribution.map((electronCount, shellIdx) => {
              const ringRadius = 46 + shellIdx * 25;
              const angleStep = (2 * Math.PI) / electronCount;
              return (
                <g key={shellIdx}>
                  <circle
                    cx="160"
                    cy="160"
                    r={ringRadius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeOpacity={showOrbitalPaths ? 0.45 : 0}
                  />
                  {Array.from({ length: electronCount }).map((_, eIdx) => {
                    const angle = eIdx * angleStep + shellIdx * 0.7;
                    const cx = 160 + ringRadius * Math.cos(angle);
                    const cy = 160 + ringRadius * Math.sin(angle);
                    return (
                      <circle
                        key={eIdx}
                        cx={cx}
                        cy={cy}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        filter="url(#electronGlow)"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Nucleus Cluster: Red Protons & Royal Blue Neutrons matching Image 2 */}
            <g transform="translate(160, 160)">
              <circle cx="0" cy="0" r="24" fill="#38bdf8" opacity="0.18" filter="url(#electronGlow)" />
              <circle cx="-6" cy="-7" r="7.5" fill="url(#redProton)" />
              <circle cx="7" cy="-6" r="7.5" fill="url(#blueNeutron)" />
              <circle cx="-8" cy="6" r="7.5" fill="url(#blueNeutron)" />
              <circle cx="6" cy="7" r="7.5" fill="url(#redProton)" />
              <circle cx="0" cy="0" r="8" fill="url(#redProton)" />
              <circle cx="9" cy="0" r="6.5" fill="url(#blueNeutron)" />
              <circle cx="-9" cy="-1" r="6.5" fill="url(#redProton)" />
              <circle cx="-1" cy="9" r="6.5" fill="url(#blueNeutron)" />
            </g>
          </svg>
        </div>

        {/* Floating Electron Shells Bottom Panel */}
        <div className="absolute bottom-4 left-6 right-6 p-4 rounded-2xl bg-[#090C14]/85 backdrop-blur-xl border border-white/10 space-y-2.5 z-20 pointer-events-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-300">Electron Shells</span>
            <span className="font-mono font-bold text-white tracking-wider">
              {element.shellDistribution.join(' • ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {element.shellDistribution.map((electrons, idx) => {
              const maxCapacities = [2, 8, 18, 32, 32, 18, 8];
              const maxForShell = maxCapacities[idx] || 32;
              const pct = Math.min((electrons / maxForShell) * 100, 100);
              return (
                <div
                  key={idx}
                  className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden"
                  title={`Shell n=${idx + 1}: ${electrons} electrons`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.max(pct, 20)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#06080E] to-[#04060A]">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing relative overflow-hidden"
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        {/* Bohr vs Quantum Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 pointer-events-auto">
          <button
            onClick={() => setViewMode3D('bohr')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode3D === 'bohr'
                ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            Bohr
          </button>
          <button
            onClick={() => setViewMode3D('quantum')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode3D === 'quantum'
                ? 'bg-sky-500/25 border border-sky-400/40 text-sky-200 shadow-sm'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            Quantum
          </button>
        </div>

        {/* Action icons (Play/Pause, Eye, Reset) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleAnimationPaused}
            className="p-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
            title={isAnimationPaused ? 'Play' : 'Pause'}
          >
            {isAnimationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleOrbitalPaths}
            className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              showOrbitalPaths
                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Toggle orbital paths"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => controlsRef.current?.resetCamera()}
            className="p-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all cursor-pointer"
            title="Reset view"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Electron Shells Bottom Panel */}
      <div className="absolute bottom-4 left-6 right-6 p-4 rounded-2xl bg-[#090C14]/85 backdrop-blur-xl border border-white/10 space-y-2.5 z-20 pointer-events-auto">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-300">Electron Shells</span>
          <span className="font-mono font-bold text-white tracking-wider">
            {element.shellDistribution.join(' • ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {element.shellDistribution.map((electrons, idx) => {
            const maxCapacities = [2, 8, 18, 32, 32, 18, 8];
            const maxForShell = maxCapacities[idx] || 32;
            const pct = Math.min((electrons / maxForShell) * 100, 100);
            return (
              <div
                key={idx}
                className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden"
                title={`Shell n=${idx + 1}: ${electrons} electrons`}
              >
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.max(pct, 20)}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
