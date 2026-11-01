'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroAtom: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglError(true);
        return;
      }
    } catch {
      setWebglError(true);
      return;
    }

    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 23);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root atom group
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // ========================================================
    // 1. NUCLEUS: Glossy, highly reflective cluster of purple & blue spheres
    // Matching Reference Image 2
    // ========================================================
    const nucleusGroup = new THREE.Group();
    atomGroup.add(nucleusGroup);

    // Palette of rich purple, sky blue, lavender, and cyan spheres
    const nucleusColors = [
      0x7c3aed, // Vivid purple
      0x3b82f6, // Bright blue
      0x8b5cf6, // Violet
      0x0ea5e9, // Cerulean
      0xa78bfa, // Light lavender
      0x06b6d4, // Cyan
      0x6366f1, // Indigo
      0x38bdf8, // Sky
    ];

    const nucleusSpheres: THREE.Mesh[] = [];
    const sphereCount = 22;

    // Golden spiral sphere distribution for an organic, tight grape cluster
    const clusterRadius = 1.35;
    for (let i = 0; i < sphereCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / sphereCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = clusterRadius * (0.65 + Math.random() * 0.45);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      const colorHex = nucleusColors[i % nucleusColors.length];

      // MeshStandardMaterial with high specular highlights
      const geom = new THREE.SphereGeometry(0.52 + Math.random() * 0.12, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.18,
        metalness: 0.15,
        emissive: colorHex,
        emissiveIntensity: 0.15,
      });

      const sphereMesh = new THREE.Mesh(geom, mat);
      sphereMesh.position.set(x, y, z);
      nucleusGroup.add(sphereMesh);
      nucleusSpheres.push(sphereMesh);
    }

    // ========================================================
    // 2. ORBITAL RINGS: 3 luminous, elegant, tilted thin rings
    // Matching the 3 classical Rutherford-Bohr rings in Image 2
    // ========================================================
    interface RingDef {
      mesh: THREE.Line;
      electron: THREE.Mesh;
      radiusX: number;
      radiusY: number;
      tiltX: number;
      tiltY: number;
      tiltZ: number;
      speed: number;
      angle: number;
    }

    const ringDefs: RingDef[] = [];

    // Configurations matching the 3 distinct orbital planes in Image 2:
    // Ring 1: Near-horizontal, slightly tilted towards viewer
    // Ring 2: Diagonal from bottom-left to top-right (~60°)
    // Ring 3: Diagonal from top-left to bottom-right (~-60°)
    const ringConfigs = [
      {
        rx: 8.8,
        ry: 4.8,
        tiltX: Math.PI * 0.46,
        tiltY: 0.1,
        tiltZ: -0.15,
        speed: 0.85,
        startAngle: 0.2,
      },
      {
        rx: 9.0,
        ry: 4.6,
        tiltX: Math.PI * 0.38,
        tiltY: 0.82,
        tiltZ: 0.95,
        speed: -0.75,
        startAngle: 2.4,
      },
      {
        rx: 9.0,
        ry: 4.6,
        tiltX: Math.PI * 0.38,
        tiltY: -0.82,
        tiltZ: -0.95,
        speed: 0.68,
        startAngle: 4.6,
      },
    ];

    ringConfigs.forEach((cfg) => {
      // Smooth ellipse curve
      const curve = new THREE.EllipseCurve(0, 0, cfg.rx, cfg.ry, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(180);
      const ringGeom = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, p.y, 0))
      );

      // Fine, glowing white/cyan line material
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.45,
      });

      const ringMesh = new THREE.Line(ringGeom, ringMat);
      const euler = new THREE.Euler(cfg.tiltX, cfg.tiltY, cfg.tiltZ);
      ringMesh.rotation.copy(euler);
      atomGroup.add(ringMesh);

      // Luminous white electron bead
      const electronGeom = new THREE.SphereGeometry(0.38, 24, 24);
      const electronMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xe0f2fe,
        emissiveIntensity: 2.2,
        roughness: 0.1,
      });
      const electronMesh = new THREE.Mesh(electronGeom, electronMat);
      atomGroup.add(electronMesh);

      ringDefs.push({
        mesh: ringMesh,
        electron: electronMesh,
        radiusX: cfg.rx,
        radiusY: cfg.ry,
        tiltX: cfg.tiltX,
        tiltY: cfg.tiltY,
        tiltZ: cfg.tiltZ,
        speed: cfg.speed,
        angle: cfg.startAngle,
      });
    });

    // ========================================================
    // 3. LIGHTING: Crisp key lights for strong specular reflections
    // ========================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Front-top key light for bright glossy highlights on spheres
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(12, 18, 16);
    scene.add(keyLight);

    // Soft cool rim light from bottom-left
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-15, -10, 10);
    scene.add(rimLight);

    // Subtle warm rim light from back-right
    const backLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    backLight.position.set(10, -8, -12);
    scene.add(backLight);

    // ========================================================
    // 4. MOUSE PARALLAX / ORBIT INTERACTION
    // ========================================================
    let targetRotY = 0;
    let targetRotX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
      } else {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 0.45;
        targetRotX = y * 0.35;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
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
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth slow rotation of the nucleus
      nucleusGroup.rotation.y += delta * 0.25;
      nucleusGroup.rotation.x += delta * 0.12;

      // Update orbiting electrons along their 3D ellipse planes
      ringDefs.forEach((ring) => {
        ring.angle += delta * ring.speed;

        const lx = Math.cos(ring.angle) * ring.radiusX;
        const ly = Math.sin(ring.angle) * ring.radiusY;

        const pos = new THREE.Vector3(lx, ly, 0);
        const euler = new THREE.Euler(ring.tiltX, ring.tiltY, ring.tiltZ);
        pos.applyEuler(euler);

        ring.electron.position.copy(pos);
      });

      // Smooth camera perspective damping
      atomGroup.rotation.y += (targetRotY - atomGroup.rotation.y) * 0.06;
      atomGroup.rotation.x += (targetRotX - atomGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-full min-h-[380px] lg:min-h-[480px] flex items-center justify-center relative select-none">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-2xl animate-pulse" />
          
          {/* Orbital rings */}
          <div className="absolute w-64 h-64 rounded-full border border-sky-500/20 rotate-45 animate-[spin_12s_linear_infinite]" />
          <div className="absolute w-64 h-64 rounded-full border border-indigo-500/20 -rotate-45 animate-[spin_16s_linear_infinite_reverse]" />
          <div className="absolute w-56 h-56 rounded-full border border-violet-500/20 rotate-12 animate-[spin_10s_linear_infinite]" />
          
          {/* Multi-layered Nucleus Cluster */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-sky-400 blur-[2px] shadow-[0_0_35px_rgba(56,189,248,0.5)]" />
            <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-cyan-300 opacity-90 shadow-inner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[380px] lg:min-h-[480px] flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};
