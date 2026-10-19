/**
 * Second Brain - Interactive 3D Neural WebGL Experience
 * Powered by Three.js
 * Generates an interactive 3D dual-hemisphere neural network with dynamic synapses,
 * pulsing action potentials, raycasting interaction, and theme synchronization.
 */

(function () {
  'use strict';

  // Wait for DOM to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBrain3D);
  } else {
    initBrain3D();
  }

  function initBrain3D() {
    const container = document.getElementById('brain-3d-canvas-container');
    if (!container) return;

    // Check for Three.js availability
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Skipping 3D Brain canvas initialization.');
      container.innerHTML = '<div class="brain-fallback"><div class="brain-fallback-icon">🧠</div><p>Interactive 3D Brain Ready</p></div>';
      return;
    }

    let scene, camera, renderer, brainGroup;
    let nodesMesh, linesMesh, pulsesMesh, coreGlowMesh;
    let nodePositions = [];
    let connections = [];
    let pulseData = [];
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.003 };
    let targetRotation = { x: 0.2, y: 0 };
    let mouse = new THREE.Vector2(-1000, -1000);
    let raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.35;
    let hoveredNodeIndex = -1;
    let isVisible = true;
    let autoRotate = true;
    let pulseWave = { active: false, radius: 0, maxRadius: 6, speed: 0.15 };

    // Get active theme colors
    function getThemeColors() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      if (isDark) {
        return {
          nodeColor: 0xa78bfa,        // Violet 400
          hoverColor: 0x38bdf8,       // Sky 400
          pulseColor: 0x22d3ee,       // Cyan 400
          lineColor: 0x6366f1,        // Indigo 500
          activeLineColor: 0xa855f7,  // Purple 500
          coreColor: 0x4f46e5,        // Indigo 600
          background: 0x000000,
          lineOpacity: 0.28
        };
      } else {
        return {
          nodeColor: 0x6d28d9,        // Violet 700
          hoverColor: 0x0284c7,       // Sky 600
          pulseColor: 0x0ea5e9,       // Sky 500
          lineColor: 0x7c3aed,        // Violet 600
          activeLineColor: 0x9333ea,  // Purple 600
          coreColor: 0x8b5cf6,        // Violet 500
          background: 0xffffff,
          lineOpacity: 0.22
        };
      }
    }

    let colors = getThemeColors();

    // 1. Scene & Camera Setup
    scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 9.5;

    // 2. WebGL Renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // 3. Generate Dual Hemisphere Neural Brain Geometry
    generateBrainModel();

    // 4. Create Core Soft Glow
    createCoreGlow();

    // 5. Setup Interactive Controls & HUD
    setupControls();

    // 6. Handle Theme Changes dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateThemeColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // 7. Intersection Observer for Performance
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    intersectionObserver.observe(container);

    // 8. Event Listeners
    setupEvents();

    // 9. Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotation dynamics
      if (autoRotate && !isDragging) {
        brainGroup.rotation.y += 0.004;
        brainGroup.rotation.x = THREE.MathUtils.lerp(brainGroup.rotation.x, targetRotation.x, 0.05);
      } else {
        brainGroup.rotation.y += rotationVelocity.y;
        brainGroup.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.94;
        rotationVelocity.y *= 0.94;
      }

      // Action potential pulses animation
      updatePulses(elapsedTime);

      // Synapse shockwave animation if active
      if (pulseWave.active) {
        pulseWave.radius += pulseWave.speed;
        if (pulseWave.radius > pulseWave.maxRadius) {
          pulseWave.active = false;
        }
      }

      // Gentle floating breathing effect
      brainGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      renderer.render(scene, camera);
    }
    animate();

    // ================= HELPER FUNCTIONS ================= //

    function generateBrainModel() {
      const nodeCount = 380;
      nodePositions = [];
      const colorsAttr = [];
      const sizesAttr = [];

      // Procedural dual-hemisphere generation
      for (let i = 0; i < nodeCount; i++) {
        const isLeft = Math.random() > 0.5;
        const sideMultiplier = isLeft ? -1 : 1;

        // Spherical/Ellipsoidal distribution perturbed to resemble brain lobes
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        // Ellipsoidal base dimensions: (x: 2.2, y: 1.8, z: 2.7)
        let r = 1.0 + 0.15 * Math.sin(theta * 3.0) * Math.cos(phi * 2.0);
        let x = (1.45 * Math.sin(phi) * Math.cos(theta) + 0.5) * sideMultiplier;
        let y = 1.6 * Math.sin(phi) * Math.sin(theta) * 0.9;
        let z = 2.3 * Math.cos(phi);

        // Sulci & gyri indentation / fold perturbation
        const furrow = Math.sin(x * 4.0) * Math.cos(z * 4.0) * 0.15;
        x += furrow * sideMultiplier;
        y += furrow * 0.5;

        // Fissure separation between left and right hemispheres
        if (Math.abs(x) < 0.28) {
          x = (0.28 + Math.random() * 0.25) * sideMultiplier;
        }

        // Slight indentation at bottom (brainstem indent)
        if (y < -0.8 && Math.abs(x) < 0.8 && Math.abs(z) < 0.6) {
          y += 0.3;
        }

        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);

        const nodeColor = new THREE.Color(colors.nodeColor);
        // Slightly vary node hues for organic neural look
        nodeColor.offsetHSL((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.1);
        colorsAttr.push(nodeColor.r, nodeColor.g, nodeColor.b);
        sizesAttr.push(18.0 + Math.random() * 12.0);
      }

      // Create Nodes Geometry
      const nodesGeometry = new THREE.BufferGeometry();
      const posFlat = [];
      nodePositions.forEach(p => posFlat.push(p.x, p.y, p.z));
      nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posFlat, 3));
      nodesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsAttr, 3));
      nodesGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizesAttr, 1));

      // Circular particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(230,230,255,0.85)');
      grad.addColorStop(0.7, 'rgba(167,139,250,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const particleTexture = new THREE.CanvasTexture(canvas);

      const nodesMaterial = new THREE.PointsMaterial({
        size: 0.22,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      nodesMesh = new THREE.Points(nodesGeometry, nodesMaterial);
      brainGroup.add(nodesMesh);

      // Connect Nodes with Synaptic Axonal Lines
      connections = [];
      const linePositions = [];
      const lineColors = [];
      const maxDistance = 0.95;

      for (let i = 0; i < nodePositions.length; i++) {
        let neighborCount = 0;
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          // Connect neighboring nodes, or cross hemisphere corpus callosum bridge if close
          const sameHemisphere = (nodePositions[i].x * nodePositions[j].x > 0);
          const threshold = sameHemisphere ? maxDistance : 0.72;

          if (dist < threshold && neighborCount < 5) {
            connections.push({ from: i, to: j, dist: dist });
            linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
            linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);

            const col = new THREE.Color(colors.lineColor);
            lineColors.push(col.r, col.g, col.b);
            lineColors.push(col.r, col.g, col.b);
            neighborCount++;
          }
        }
      }

      const linesGeometry = new THREE.BufferGeometry();
      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: colors.lineOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
      brainGroup.add(linesMesh);

      // Create Active Synapse Action Potential Pulses
      createPulseSystem();
    }

    function createPulseSystem() {
      const pulseCount = 75;
      pulseData = [];
      const pulsePositions = [];

      for (let p = 0; p < pulseCount; p++) {
        const connIndex = Math.floor(Math.random() * connections.length);
        const conn = connections[connIndex];
        const progress = Math.random();
        const speed = 0.35 + Math.random() * 0.75;
        const forward = Math.random() > 0.5;

        pulseData.push({ connIndex, progress, speed, forward });
        pulsePositions.push(0, 0, 0);
      }

      const pulseGeometry = new THREE.BufferGeometry();
      pulseGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pulsePositions, 3));

      // Glowing dot texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, '#38bdf8');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      const pulseTexture = new THREE.CanvasTexture(canvas);

      const pulseMaterial = new THREE.PointsMaterial({
        size: 0.28,
        color: colors.pulseColor,
        map: pulseTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      pulsesMesh = new THREE.Points(pulseGeometry, pulseMaterial);
      brainGroup.add(pulsesMesh);
    }

    function updatePulses(elapsedTime) {
      if (!pulsesMesh || !pulseData.length) return;

      const positions = pulsesMesh.geometry.attributes.position.array;

      for (let i = 0; i < pulseData.length; i++) {
        const p = pulseData[i];
        const conn = connections[p.connIndex];
        if (!conn) continue;

        // Progress along the axon line
        p.progress += 0.008 * p.speed;
        if (p.progress > 1.0) {
          p.progress = 0;
          // Pick adjacent or random connection
          p.connIndex = Math.floor(Math.random() * connections.length);
        }

        const startNode = p.forward ? nodePositions[conn.from] : nodePositions[conn.to];
        const endNode = p.forward ? nodePositions[conn.to] : nodePositions[conn.from];

        const x = THREE.MathUtils.lerp(startNode.x, endNode.x, p.progress);
        const y = THREE.MathUtils.lerp(startNode.y, endNode.y, p.progress);
        const z = THREE.MathUtils.lerp(startNode.z, endNode.z, p.progress);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }

      pulsesMesh.geometry.attributes.position.needsUpdate = true;
    }

    function createCoreGlow() {
      // Soft spherical ambient glow in center of brain
      const glowGeo = new THREE.SphereGeometry(1.4, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: colors.coreColor,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        wireframe: true
      });
      coreGlowMesh = new THREE.Mesh(glowGeo, glowMat);
      brainGroup.add(coreGlowMesh);
    }

    function updateThemeColors() {
      colors = getThemeColors();
      if (linesMesh) {
        linesMesh.material.opacity = colors.lineOpacity;
        const lineColors = linesMesh.geometry.attributes.color.array;
        const c = new THREE.Color(colors.lineColor);
        for (let i = 0; i < lineColors.length; i += 3) {
          lineColors[i] = c.r;
          lineColors[i + 1] = c.g;
          lineColors[i + 2] = c.b;
        }
        linesMesh.geometry.attributes.color.needsUpdate = true;
      }
      if (pulsesMesh) {
        pulsesMesh.material.color.setHex(colors.pulseColor);
      }
      if (coreGlowMesh) {
        coreGlowMesh.material.color.setHex(colors.coreColor);
      }
    }

    function triggerSynapseBurst() {
      // Trigger shockwave & high energy glow
      pulseWave.active = true;
      pulseWave.radius = 0;

      if (pulsesMesh) {
        pulsesMesh.material.size = 0.5;
        setTimeout(() => {
          if (pulsesMesh) pulsesMesh.material.size = 0.28;
        }, 600);
      }

      // Spark sound effect if audio enabled
      if (window.SecondBrainAudio) {
        window.SecondBrainAudio.playPulse();
      }

      // Temporarily speed up rotation
      rotationVelocity.y = 0.04;
    }

    function setupControls() {
      // Button: Fire Synapse
      const pulseBtn = document.getElementById('btn-pulse-brain');
      if (pulseBtn) {
        pulseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          triggerSynapseBurst();
        });
      }

      // Button: Toggle Auto Rotate
      const rotateBtn = document.getElementById('btn-rotate-brain');
      if (rotateBtn) {
        rotateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          autoRotate = !autoRotate;
          rotateBtn.classList.toggle('active', autoRotate);
        });
      }

      // Button: Reset View
      const resetBtn = document.getElementById('btn-reset-brain');
      if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          brainGroup.rotation.set(0.2, 0, 0);
          rotationVelocity = { x: 0, y: 0 };
        });
      }

      // Click on canvas container also triggers a synapse burst
      container.addEventListener('dblclick', triggerSynapseBurst);
    }

    function setupEvents() {
      // Mouse drag for 3D rotation
      const dom = renderer.domElement;

      dom.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoRotate = false;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });

      dom.addEventListener('mousemove', (e) => {
        const rect = dom.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (isDragging) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;

          rotationVelocity.y = deltaX * 0.005;
          rotationVelocity.x = deltaY * 0.005;

          previousMousePosition = { x: e.clientX, y: e.clientY };
        } else {
          // Subtle parallax target
          targetRotation.x = 0.2 + mouse.y * 0.25;
        }
      });

      // Touch events for mobile
      dom.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          autoRotate = false;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        isDragging = false;
      });

      dom.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - previousMousePosition.x;
          const deltaY = e.touches[0].clientY - previousMousePosition.y;

          rotationVelocity.y = deltaX * 0.006;
          rotationVelocity.x = deltaY * 0.006;

          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      // Resize handler
      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 400;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    // Expose trigger to global scope
    window.triggerBrainPulse = triggerSynapseBurst;
  }
})();
