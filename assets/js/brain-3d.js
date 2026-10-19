/**
 * Second Brain - Advanced Interactive 3D WebGL Visualizer Suite
 * Powered by Three.js
 * 
 * Features 3 Switchable Procedural 3D Visuals:
 * 1. Neural Brain: Dual-hemisphere neural network with dynamic synaptic action potentials.
 * 2. Knowledge Constellation: Interactive 3D orbital knowledge graph of tech domains.
 * 3. Data Stream Helix: 3D streaming data pipeline double-helix with high-speed particles.
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualizerSuite);
  } else {
    initVisualizerSuite();
  }

  function initVisualizerSuite() {
    const container = document.getElementById('brain-3d-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Skipping 3D visualizer initialization.');
      container.innerHTML = '<div class="brain-fallback"><div class="brain-fallback-icon">🧠</div><p>Interactive 3D Visualizer Ready</p></div>';
      return;
    }

    let scene, camera, renderer;
    let activeMode = 'neural'; // 'neural' | 'constellation' | 'helix'

    // Scene groups
    let neuralGroup = new THREE.Group();
    let constellationGroup = new THREE.Group();
    let helixGroup = new THREE.Group();
    let mainPivot = new THREE.Group();

    // Interaction state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.003 };
    let targetRotation = { x: 0.2, y: 0 };
    let mouse = new THREE.Vector2(-1000, -1000);
    let isVisible = true;
    let autoRotate = true;

    // References for animations
    let neuralRefs = {};
    let constellationRefs = {};
    let helixRefs = {};

    function getThemeColors() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      if (isDark) {
        return {
          nodeColor: 0xa78bfa,        // Violet 400
          pulseColor: 0x22d3ee,       // Cyan 400
          lineColor: 0x6366f1,        // Indigo 500
          coreColor: 0x4f46e5,        // Indigo 600
          accentAlt: 0xf43f5e,        // Rose 500
          gold: 0xfbbf24,             // Amber 400
          emerald: 0x10b981,          // Emerald 500
          lineOpacity: 0.28
        };
      } else {
        return {
          nodeColor: 0x6d28d9,        // Violet 700
          pulseColor: 0x0284c7,       // Sky 600
          lineColor: 0x7c3aed,        // Violet 600
          coreColor: 0x8b5cf6,        // Violet 500
          accentAlt: 0xe11d48,        // Rose 600
          gold: 0xd97706,             // Amber 600
          emerald: 0x059669,          // Emerald 600
          lineOpacity: 0.22
        };
      }
    }

    let colors = getThemeColors();

    // 1. Scene, Camera, Renderer Setup
    scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 9.8;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(mainPivot);
    mainPivot.add(neuralGroup);
    mainPivot.add(constellationGroup);
    mainPivot.add(helixGroup);

    constellationGroup.visible = false;
    helixGroup.visible = false;

    // 2. Build Procedural 3D Visual Models
    buildNeuralBrain();
    buildKnowledgeConstellation();
    buildDataStreamHelix();

    // 3. Setup Interactive HUD & Mode Switcher
    setupModeSwitcher();
    setupHUDButtons();
    setupEvents();

    // 4. Performance Observers
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    intersectionObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      colors = getThemeColors();
      updateAllThemeColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    // 5. Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotation handling
      if (autoRotate && !isDragging) {
        mainPivot.rotation.y += 0.005;
        mainPivot.rotation.x = THREE.MathUtils.lerp(mainPivot.rotation.x, targetRotation.x, 0.05);
      } else {
        mainPivot.rotation.y += rotationVelocity.y;
        mainPivot.rotation.x += rotationVelocity.x;
        rotationVelocity.x *= 0.94;
        rotationVelocity.y *= 0.94;
      }

      // Gentle vertical hover
      mainPivot.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Animate active visual
      if (activeMode === 'neural') {
        animateNeural(elapsedTime);
      } else if (activeMode === 'constellation') {
        animateConstellation(elapsedTime);
      } else if (activeMode === 'helix') {
        animateHelix(elapsedTime);
      }

      renderer.render(scene, camera);
    }
    animate();

    // ==========================================
    // VISUAL 1: NEURAL BRAIN
    // ==========================================
    function buildNeuralBrain() {
      const nodeCount = 380;
      const positions = [];
      const nodePositions = [];
      const colorsAttr = [];
      const sizesAttr = [];

      for (let i = 0; i < nodeCount; i++) {
        const side = Math.random() > 0.5 ? -1 : 1;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        let x = (1.45 * Math.sin(phi) * Math.cos(theta) + 0.5) * side;
        let y = 1.6 * Math.sin(phi) * Math.sin(theta) * 0.9;
        let z = 2.3 * Math.cos(phi);

        const furrow = Math.sin(x * 4.0) * Math.cos(z * 4.0) * 0.15;
        x += furrow * side;
        y += furrow * 0.5;

        if (Math.abs(x) < 0.28) x = (0.28 + Math.random() * 0.25) * side;
        if (y < -0.8 && Math.abs(x) < 0.8 && Math.abs(z) < 0.6) y += 0.3;

        const pos = new THREE.Vector3(x, y, z);
        nodePositions.push(pos);
        positions.push(x, y, z);

        const c = new THREE.Color(colors.nodeColor);
        c.offsetHSL((Math.random() - 0.5) * 0.08, 0, (Math.random() - 0.5) * 0.1);
        colorsAttr.push(c.r, c.g, c.b);
        sizesAttr.push(18.0 + Math.random() * 12.0);
      }

      const nodesGeo = new THREE.BufferGeometry();
      nodesGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      nodesGeo.setAttribute('color', new THREE.Float32BufferAttribute(colorsAttr, 3));

      const particleTexture = createCircularTexture();
      const nodesMat = new THREE.PointsMaterial({
        size: 0.22,
        map: particleTexture,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
      neuralGroup.add(nodesMesh);

      // Connect Axons
      const connections = [];
      const linePositions = [];
      const lineColors = [];

      for (let i = 0; i < nodePositions.length; i++) {
        let count = 0;
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          const threshold = (nodePositions[i].x * nodePositions[j].x > 0) ? 0.95 : 0.72;
          if (dist < threshold && count < 5) {
            connections.push({ from: i, to: j });
            linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
            linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
            const lc = new THREE.Color(colors.lineColor);
            lineColors.push(lc.r, lc.g, lc.b, lc.r, lc.g, lc.b);
            count++;
          }
        }
      }

      const linesGeo = new THREE.BufferGeometry();
      linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      const linesMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: colors.lineOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
      neuralGroup.add(linesMesh);

      // Action Potential Pulses
      const pulseCount = 75;
      const pulseData = [];
      const pulsePos = [];

      for (let p = 0; p < pulseCount; p++) {
        const connIndex = Math.floor(Math.random() * connections.length);
        pulseData.push({
          connIndex,
          progress: Math.random(),
          speed: 0.4 + Math.random() * 0.7,
          forward: Math.random() > 0.5
        });
        pulsePos.push(0, 0, 0);
      }

      const pulseGeo = new THREE.BufferGeometry();
      pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute(pulsePos, 3));

      const pulseMat = new THREE.PointsMaterial({
        size: 0.28,
        color: colors.pulseColor,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const pulsesMesh = new THREE.Points(pulseGeo, pulseMat);
      neuralGroup.add(pulsesMesh);

      // Core Ambient Wireframe Sphere
      const coreGeo = new THREE.SphereGeometry(1.3, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: colors.coreColor,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      neuralGroup.add(coreMesh);

      neuralRefs = {
        nodePositions,
        connections,
        pulseData,
        pulsesMesh,
        linesMesh,
        coreMesh
      };
    }

    function animateNeural() {
      const { pulseData, pulsesMesh, connections, nodePositions } = neuralRefs;
      if (!pulsesMesh || !pulseData) return;

      const pos = pulsesMesh.geometry.attributes.position.array;
      for (let i = 0; i < pulseData.length; i++) {
        const p = pulseData[i];
        const conn = connections[p.connIndex];
        if (!conn) continue;

        p.progress += 0.008 * p.speed;
        if (p.progress > 1.0) {
          p.progress = 0;
          p.connIndex = Math.floor(Math.random() * connections.length);
        }

        const startNode = p.forward ? nodePositions[conn.from] : nodePositions[conn.to];
        const endNode = p.forward ? nodePositions[conn.to] : nodePositions[conn.from];

        pos[i * 3] = THREE.MathUtils.lerp(startNode.x, endNode.x, p.progress);
        pos[i * 3 + 1] = THREE.MathUtils.lerp(startNode.y, endNode.y, p.progress);
        pos[i * 3 + 2] = THREE.MathUtils.lerp(startNode.z, endNode.z, p.progress);
      }
      pulsesMesh.geometry.attributes.position.needsUpdate = true;
    }

    // ==========================================
    // VISUAL 2: KNOWLEDGE CONSTELLATION (GRAPH CLUSTER)
    // ==========================================
    function buildKnowledgeConstellation() {
      // Core Center Hub: Second Brain
      const centerGeo = new THREE.IcosahedronGeometry(0.7, 2);
      const centerMat = new THREE.MeshBasicMaterial({
        color: colors.pulseColor,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const centerHub = new THREE.Mesh(centerGeo, centerMat);
      constellationGroup.add(centerHub);

      // Topic Nodes
      const topics = [
        { name: 'System Design', color: colors.nodeColor, radius: 2.8, angle: 0 },
        { name: 'Data Engineering', color: colors.pulseColor, radius: 2.9, angle: Math.PI * 0.25 },
        { name: 'Apache Spark', color: colors.gold, radius: 2.7, angle: Math.PI * 0.5 },
        { name: 'Delta Lake', color: colors.pulseColor, radius: 3.1, angle: Math.PI * 0.75 },
        { name: 'Azure Cloud', color: colors.coreColor, radius: 2.8, angle: Math.PI },
        { name: 'Context Engineering', color: colors.emerald, radius: 3.0, angle: Math.PI * 1.25 },
        { name: 'Python', color: colors.gold, radius: 2.6, angle: Math.PI * 1.5 },
        { name: 'AI & ML', color: colors.accentAlt, radius: 3.2, angle: Math.PI * 1.75 }
      ];

      const topicMeshes = [];
      const orbitLinesGeo = new THREE.BufferGeometry();
      const orbitPos = [];

      topics.forEach((topic, idx) => {
        const x = Math.cos(topic.angle) * topic.radius;
        const y = Math.sin(idx * 1.1) * 0.9;
        const z = Math.sin(topic.angle) * topic.radius;

        // Node sphere
        const nodeGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const nodeMat = new THREE.MeshBasicMaterial({
          color: topic.color,
          transparent: true,
          opacity: 0.9
        });
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set(x, y, z);
        mesh.userData = { topic: topic.name, originalPos: mesh.position.clone() };

        // Outer glow wireframe ring around node
        const ringGeo = new THREE.RingGeometry(0.32, 0.36, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: topic.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        mesh.add(ring);

        constellationGroup.add(mesh);
        topicMeshes.push(mesh);

        // Beam connecting to center
        orbitPos.push(0, 0, 0);
        orbitPos.push(x, y, z);
      });

      // Inter-connecting beams between neighboring topics
      for (let i = 0; i < topicMeshes.length; i++) {
        const next = (i + 1) % topicMeshes.length;
        orbitPos.push(topicMeshes[i].position.x, topicMeshes[i].position.y, topicMeshes[i].position.z);
        orbitPos.push(topicMeshes[next].position.x, topicMeshes[next].position.y, topicMeshes[next].position.z);
      }

      orbitLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPos, 3));
      const orbitLinesMat = new THREE.LineBasicMaterial({
        color: colors.lineColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const orbitLines = new THREE.LineSegments(orbitLinesGeo, orbitLinesMat);
      constellationGroup.add(orbitLines);

      // Surrounding Orbital Rings
      const ring1 = createOrbitalRing(3.2, 0x6366f1, 0.2);
      const ring2 = createOrbitalRing(3.6, 0x22d3ee, 0.15);
      ring2.rotation.x = Math.PI * 0.35;
      constellationGroup.add(ring1);
      constellationGroup.add(ring2);

      constellationRefs = {
        centerHub,
        topicMeshes,
        orbitLines,
        ring1,
        ring2
      };
    }

    function createOrbitalRing(radius, color, opacity) {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const ring = new THREE.Line(geo, mat);
      ring.rotation.x = Math.PI / 2;
      return ring;
    }

    function animateConstellation(elapsedTime) {
      const { centerHub, topicMeshes, ring1, ring2 } = constellationRefs;
      if (!centerHub) return;

      centerHub.rotation.x += 0.01;
      centerHub.rotation.y += 0.015;

      if (ring1) ring1.rotation.z += 0.003;
      if (ring2) ring2.rotation.y += 0.004;

      if (topicMeshes) {
        topicMeshes.forEach((mesh, idx) => {
          mesh.position.y = mesh.userData.originalPos.y + Math.sin(elapsedTime * 2 + idx) * 0.15;
          mesh.rotation.y += 0.02;
        });
      }
    }

    // ==========================================
    // VISUAL 3: DATA STREAM HELIX (3D PIPELINE VORTEX)
    // ==========================================
    function buildDataStreamHelix() {
      const turns = 4;
      const height = 6.0;
      const radius = 1.6;
      const pointCount = 180;

      const strand1Pos = [];
      const strand2Pos = [];
      const rungsPos = [];

      for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * turns * Math.PI * 2;
        const y = ((i / pointCount) - 0.5) * height;

        const x1 = Math.cos(t) * radius;
        const z1 = Math.sin(t) * radius;

        const x2 = Math.cos(t + Math.PI) * radius;
        const z2 = Math.sin(t + Math.PI) * radius;

        strand1Pos.push(x1, y, z1);
        strand2Pos.push(x2, y, z2);

        // Ladder rungs every 6 points
        if (i % 6 === 0) {
          rungsPos.push(x1, y, z1);
          rungsPos.push(x2, y, z2);
        }
      }

      // Strand 1 Line
      const geo1 = new THREE.BufferGeometry();
      geo1.setAttribute('position', new THREE.Float32BufferAttribute(strand1Pos, 3));
      const mat1 = new THREE.LineBasicMaterial({
        color: colors.pulseColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });
      const line1 = new THREE.Line(geo1, mat1);
      helixGroup.add(line1);

      // Strand 2 Line
      const geo2 = new THREE.BufferGeometry();
      geo2.setAttribute('position', new THREE.Float32BufferAttribute(strand2Pos, 3));
      const mat2 = new THREE.LineBasicMaterial({
        color: colors.nodeColor,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
      });
      const line2 = new THREE.Line(geo2, mat2);
      helixGroup.add(line2);

      // Connecting rungs
      const rungsGeo = new THREE.BufferGeometry();
      rungsGeo.setAttribute('position', new THREE.Float32BufferAttribute(rungsPos, 3));
      const rungsMat = new THREE.LineBasicMaterial({
        color: colors.lineColor,
        transparent: true,
        opacity: 0.35
      });
      const rungsMesh = new THREE.LineSegments(rungsGeo, rungsMat);
      helixGroup.add(rungsMesh);

      // High-speed Data Stream Particles (Flowing Upwards)
      const streamParticleCount = 120;
      const streamPos = [];
      const streamSpeeds = [];

      for (let i = 0; i < streamParticleCount; i++) {
        streamPos.push(0, 0, 0);
        streamSpeeds.push({
          progress: Math.random(),
          speed: 0.5 + Math.random() * 0.9,
          strand: Math.random() > 0.5 ? 0 : 1
        });
      }

      const streamGeo = new THREE.BufferGeometry();
      streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPos, 3));

      const particleTex = createCircularTexture();
      const streamMat = new THREE.PointsMaterial({
        size: 0.28,
        color: colors.pulseColor,
        map: particleTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const streamMesh = new THREE.Points(streamGeo, streamMat);
      helixGroup.add(streamMesh);

      helixRefs = {
        line1,
        line2,
        rungsMesh,
        streamMesh,
        streamSpeeds,
        turns,
        height,
        radius
      };
    }

    function animateHelix(elapsedTime) {
      const { streamMesh, streamSpeeds, turns, height, radius } = helixRefs;
      if (!streamMesh || !streamSpeeds) return;

      const pos = streamMesh.geometry.attributes.position.array;
      const count = streamSpeeds.length;

      for (let i = 0; i < count; i++) {
        const item = streamSpeeds[i];
        item.progress += 0.007 * item.speed;
        if (item.progress > 1.0) item.progress = 0;

        const offsetAngle = item.strand === 0 ? 0 : Math.PI;
        const t = item.progress * turns * Math.PI * 2 + offsetAngle;
        const y = (item.progress - 0.5) * height;

        pos[i * 3] = Math.cos(t) * radius;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = Math.sin(t) * radius;
      }

      streamMesh.geometry.attributes.position.needsUpdate = true;
      helixGroup.rotation.y = elapsedTime * 0.4;
    }

    // ==========================================
    // UTILITY: Circular Glow Particle Texture
    // ==========================================
    function createCircularTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.35, 'rgba(167,139,250,0.85)');
      grad.addColorStop(0.7, 'rgba(34,211,238,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    }

    // ==========================================
    // MODE SWITCHER & HUD LOGIC
    // ==========================================
    function setupModeSwitcher() {
      const modeButtons = document.querySelectorAll('.visual-mode-pill');
      const badgeBarText = document.getElementById('stage-badge-description');

      modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          if (mode === activeMode) return;

          modeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Switch active group
          activeMode = mode;
          neuralGroup.visible = (mode === 'neural');
          constellationGroup.visible = (mode === 'constellation');
          helixGroup.visible = (mode === 'helix');

          // Smoothly reset camera tilt
          mainPivot.rotation.set(0.15, 0, 0);

          if (badgeBarText) {
            if (mode === 'neural') {
              badgeBarText.innerHTML = '<span class="badge-item"><span class="badge-dot pulse"></span> 380 Synapses</span><span class="badge-item">⚡ 720+ Axons</span>';
            } else if (mode === 'constellation') {
              badgeBarText.innerHTML = '<span class="badge-item"><span class="badge-dot pulse"></span> 8 Core Domains</span><span class="badge-item">🌐 Orbital Mesh</span>';
            } else if (mode === 'helix') {
              badgeBarText.innerHTML = '<span class="badge-item"><span class="badge-dot pulse"></span> Stream Flow: 10k msg/s</span><span class="badge-item">🧬 Double Helix</span>';
            }
          }

          if (window.SecondBrainAudio) {
            window.SecondBrainAudio.playClick();
          }
        });
      });
    }

    function setupHUDButtons() {
      // Button: Fire Synapse / Energy Burst
      const pulseBtn = document.getElementById('btn-pulse-brain');
      if (pulseBtn) {
        pulseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          triggerBurst();
        });
      }

      // Button: Toggle Auto Rotate
      const rotateBtn = document.getElementById('btn-rotate-brain');
      if (rotateBtn) {
        rotateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          autoRotate = !autoRotate;
          rotateBtn.classList.toggle('active', autoRotate);
          if (window.SecondBrainAudio) window.SecondBrainAudio.playClick();
        });
      }

      // Button: Reset Camera
      const resetBtn = document.getElementById('btn-reset-brain');
      if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          mainPivot.rotation.set(0.2, 0, 0);
          rotationVelocity = { x: 0, y: 0 };
          if (window.SecondBrainAudio) window.SecondBrainAudio.playClick();
        });
      }

      container.addEventListener('dblclick', triggerBurst);
    }

    function triggerBurst() {
      if (window.SecondBrainAudio) {
        window.SecondBrainAudio.playPulse();
      }
      rotationVelocity.y = 0.05;

      if (activeMode === 'neural' && neuralRefs.pulsesMesh) {
        neuralRefs.pulsesMesh.material.size = 0.55;
        setTimeout(() => {
          if (neuralRefs.pulsesMesh) neuralRefs.pulsesMesh.material.size = 0.28;
        }, 600);
      } else if (activeMode === 'helix' && helixRefs.streamMesh) {
        helixRefs.streamMesh.material.size = 0.6;
        setTimeout(() => {
          if (helixRefs.streamMesh) helixRefs.streamMesh.material.size = 0.28;
        }, 600);
      }
    }

    function setupEvents() {
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
          targetRotation.x = 0.2 + mouse.y * 0.25;
        }
      });

      dom.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          autoRotate = false;
          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('touchend', () => { isDragging = false; });

      dom.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - previousMousePosition.x;
          const deltaY = e.touches[0].clientY - previousMousePosition.y;

          rotationVelocity.y = deltaX * 0.006;
          rotationVelocity.x = deltaY * 0.006;

          previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('resize', () => {
        if (!container || !renderer || !camera) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight || 400;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      });
    }

    function updateAllThemeColors() {
      // Update Neural materials
      if (neuralRefs.linesMesh) {
        neuralRefs.linesMesh.material.opacity = colors.lineOpacity;
      }
      if (neuralRefs.pulsesMesh) {
        neuralRefs.pulsesMesh.material.color.setHex(colors.pulseColor);
      }
      // Update Constellation materials
      if (constellationRefs.centerHub) {
        constellationRefs.centerHub.material.color.setHex(colors.pulseColor);
      }
      // Update Helix materials
      if (helixRefs.line1) {
        helixRefs.line1.material.color.setHex(colors.pulseColor);
      }
    }

    window.triggerBrainPulse = triggerBurst;
  }
})();
