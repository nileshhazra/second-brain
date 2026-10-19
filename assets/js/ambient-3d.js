/**
 * Second Brain - Ambient 3D Synaptic Starfield & Parallax Background
 * Powered by Three.js
 * Generates an ethereal, living depth field of drifting synaptic dust
 * and connective neural filaments that respond to mouse depth & scroll.
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbient3D);
  } else {
    initAmbient3D();
  }

  function initAmbient3D() {
    if (typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bgCanvas = document.createElement('canvas');
    bgCanvas.id = 'ambient-3d-canvas';
    bgCanvas.className = 'ambient-3d-canvas';
    document.body.prepend(bgCanvas);

    let scene, camera, renderer, starMesh, linesMesh;
    let particles = [];
    const particleCount = 100;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let isVisible = true;

    function getThemePalette() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        particleColor: isDark ? 0xa78bfa : 0x7c3aed,
        lineColor: isDark ? 0x38bdf8 : 0x6366f1,
        lineOpacity: isDark ? 0.12 : 0.08,
        particleOpacity: isDark ? 0.6 : 0.45
      };
    }

    let palette = getThemePalette();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        powerPreference: 'low-power',
        antialias: false
      });
    } catch (e) {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Build Floating Particle Network
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 40;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.015
      });
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, 'rgba(167,139,250,0.6)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const particleTex = new THREE.CanvasTexture(canvas);

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTex,
      color: palette.particleColor,
      transparent: true,
      opacity: palette.particleOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    starMesh = new THREE.Points(starGeo, starMat);
    scene.add(starMesh);

    // Dynamic Filaments
    const linesGeo = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({
      color: palette.lineColor,
      transparent: true,
      opacity: palette.lineOpacity,
      blending: THREE.AdditiveBlending
    });
    linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);

    // Event Listeners
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 6;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY * 0.02;
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const themeObserver = new MutationObserver(() => {
      palette = getThemePalette();
      if (starMesh) {
        starMesh.material.color.setHex(palette.particleColor);
        starMesh.material.opacity = palette.particleOpacity;
      }
      if (linesMesh) {
        linesMesh.material.color.setHex(palette.lineColor);
        linesMesh.material.opacity = palette.lineOpacity;
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x;
      camera.position.y = mouse.y - scrollY;

      // Drift particles gently
      const pos = starMesh.geometry.attributes.position.array;
      const linePositions = [];
      const connectDist = 12;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].vx;
        pos[i * 3 + 1] += velocities[i].vy;
        pos[i * 3 + 2] += velocities[i].vz;

        // Wrap around bounds
        if (pos[i * 3] > 40) pos[i * 3] = -40;
        if (pos[i * 3] < -40) pos[i * 3] = 40;
        if (pos[i * 3 + 1] > 30) pos[i * 3 + 1] = -30;
        if (pos[i * 3 + 1] < -30) pos[i * 3 + 1] = 30;

        // Connect nearby points
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectDist) {
            linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
          }
        }
      }

      starMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
    }
    animate();
  }
})();
