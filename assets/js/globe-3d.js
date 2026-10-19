/**
 * Second Brain - Interactive 3D Earth Globe with Animated Network Connections
 * Powered by Three.js
 * 
 * Features:
 * - High-definition procedural canvas Earth texture with continent outlines & dot matrix
 * - Atmospheric rim glow & latitude/longitude graticule mesh
 * - 12 Major global tech hub nodes with coordinates & expanding radar beacons
 * - 3D Great-Circle Quadratic Bezier arcs with animated high-speed data pulses
 * - Interactive raycasting: hover/click cities to view real-time latency & telemetry HUD
 * - Smooth 360° drag-to-rotate with inertia damping & touch gestures
 * - City focus quick-pills that smoothly rotate the camera to target coordinates
 * - Data Surge mode: high-velocity packet bursts across all optical routes
 * - Real-time Theme synchronization (dark & light mode support)
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobeMesh);
  } else {
    initGlobeMesh();
  }

  function initGlobeMesh() {
    const container = document.getElementById('globe-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Skipping 3D globe initialization.');
      const loading = document.getElementById('globe-loading');
      if (loading) loading.innerHTML = '<span>3D Graphics library ready</span>';
      return;
    }

    // 1. City Hub Coordinates & Telemetry Data
    const CITIES = [
      { id: 'mumbai', name: 'Mumbai, IN', lat: 19.0760, lon: 72.8777, tier: 'TIER-1 HUB', latency: '12 ms', bandwidth: '142.4 Gbps' },
      { id: 'san-francisco', name: 'San Francisco, US', lat: 37.7749, lon: -122.4194, tier: 'TIER-1 HUB', latency: '18 ms', bandwidth: '180.2 Gbps' },
      { id: 'new-york', name: 'New York, US', lat: 40.7128, lon: -74.0060, tier: 'TIER-1 HUB', latency: '24 ms', bandwidth: '164.0 Gbps' },
      { id: 'london', name: 'London, UK', lat: 51.5074, lon: -0.1278, tier: 'TIER-1 HUB', latency: '28 ms', bandwidth: '158.6 Gbps' },
      { id: 'frankfurt', name: 'Frankfurt, DE', lat: 50.1109, lon: 8.6821, tier: 'TIER-1 HUB', latency: '32 ms', bandwidth: '150.8 Gbps' },
      { id: 'tokyo', name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503, tier: 'TIER-1 HUB', latency: '38 ms', bandwidth: '172.5 Gbps' },
      { id: 'singapore', name: 'Singapore, SG', lat: 1.3521, lon: 103.8198, tier: 'TIER-1 HUB', latency: '22 ms', bandwidth: '160.0 Gbps' },
      { id: 'sydney', name: 'Sydney, AU', lat: -33.8688, lon: 151.2093, tier: 'EDGE POP', latency: '64 ms', bandwidth: '88.4 Gbps' },
      { id: 'sao-paulo', name: 'São Paulo, BR', lat: -23.5505, lon: -46.6333, tier: 'EDGE POP', latency: '78 ms', bandwidth: '76.2 Gbps' },
      { id: 'dubai', name: 'Dubai, AE', lat: 25.2048, lon: 55.2708, tier: 'EDGE POP', latency: '34 ms', bandwidth: '94.0 Gbps' },
      { id: 'zurich', name: 'Zurich, CH', lat: 47.3769, lon: 8.5417, tier: 'EDGE POP', latency: '30 ms', bandwidth: '112.5 Gbps' },
      { id: 'cape-town', name: 'Cape Town, ZA', lat: -33.9249, lon: 18.4241, tier: 'EDGE POP', latency: '82 ms', bandwidth: '62.0 Gbps' }
    ];

    // Network connection routes between city pairs
    const ROUTES = [
      ['san-francisco', 'new-york'],
      ['new-york', 'london'],
      ['london', 'frankfurt'],
      ['frankfurt', 'zurich'],
      ['frankfurt', 'dubai'],
      ['dubai', 'mumbai'],
      ['mumbai', 'singapore'],
      ['singapore', 'tokyo'],
      ['tokyo', 'san-francisco'],
      ['singapore', 'sydney'],
      ['new-york', 'sao-paulo'],
      ['london', 'cape-town'],
      ['mumbai', 'tokyo'],
      ['london', 'san-francisco']
    ];

    // Theme Configuration
    function isDarkTheme() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function getThemePalette() {
      const isDark = isDarkTheme();
      if (isDark) {
        return {
          oceanColor: '#0b111e',
          landColor: '#1e293b',
          landBorder: '#38bdf8',
          gridLine: 'rgba(56, 189, 248, 0.12)',
          atmosphere: 0x38bdf8,
          nodeColor: 0x38bdf8,
          nodeCore: 0xffffff,
          pulseColor: 0x818cf8,
          arcColor: 0x6366f1,
          arcGlow: 0x22d3ee,
          particleColor: 0x38bdf8,
          surgeColor: 0xf43f5e
        };
      } else {
        return {
          oceanColor: '#f1f5f9',
          landColor: '#cbd5e1',
          landBorder: '#0284c7',
          gridLine: 'rgba(2, 132, 199, 0.15)',
          atmosphere: 0x0284c7,
          nodeColor: 0x0284c7,
          nodeCore: 0xffffff,
          pulseColor: 0x6366f1,
          arcColor: 0x7c3aed,
          arcGlow: 0x0284c7,
          particleColor: 0x0284c7,
          surgeColor: 0xe11d48
        };
      }
    }

    let palette = getThemePalette();

    // 2. Procedural World Map Texture Generator
    function createEarthTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Ocean Background
      ctx.fillStyle = palette.oceanColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Graticule grid lines (Latitude & Longitude)
      ctx.strokeStyle = palette.gridLine;
      ctx.lineWidth = 1.5;

      // Meridians (every 30 deg)
      for (let lon = -180; lon <= 180; lon += 30) {
        const x = ((lon + 180) / 360) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Parallels (every 30 deg)
      for (let lat = -90; lat <= 90; lat += 30) {
        const y = ((90 - lat) / 180) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Equator highlight
      ctx.strokeStyle = palette.landBorder;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4;
      const eqY = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(0, eqY);
      ctx.lineTo(canvas.width, eqY);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      // Simplified High-Fidelity Continent Polygons
      const continents = [
        // North America
        [
          [-168, 65], [-165, 71], [-140, 70], [-130, 70], [-110, 75], [-85, 70], [-80, 60],
          [-60, 50], [-65, 44], [-75, 35], [-80, 25], [-82, 23], [-88, 21], [-90, 16],
          [-80, 8], [-77, 8], [-82, 14], [-96, 16], [-105, 20], [-110, 30], [-120, 34],
          [-124, 38], [-125, 48], [-130, 54], [-138, 59], [-160, 56], [-165, 60], [-168, 65]
        ],
        // Greenland
        [
          [-45, 60], [-35, 65], [-20, 72], [-20, 80], [-35, 83], [-55, 83], [-60, 78],
          [-55, 70], [-45, 60]
        ],
        // South America
        [
          [-77, 8], [-70, 12], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-40, -22],
          [-50, -30], [-55, -35], [-65, -45], [-68, -55], [-75, -50], [-72, -40], [-70, -30],
          [-75, -15], [-80, -5], [-77, 8]
        ],
        // Europe
        [
          [-10, 36], [0, 43], [15, 40], [25, 40], [30, 47], [25, 55], [15, 55],
          [20, 60], [30, 70], [10, 71], [5, 62], [8, 55], [0, 50], [-5, 43], [-10, 36]
        ],
        // British Isles
        [
          [-5, 50], [2, 52], [0, 58], [-5, 58], [-5, 50]
        ],
        // Africa
        [
          [-10, 36], [10, 37], [25, 32], [32, 31], [43, 12], [51, 12], [40, -5],
          [35, -20], [32, -28], [20, -35], [18, -34], [12, -18], [9, 4], [-15, 12],
          [-17, 15], [-10, 36]
        ],
        // Madagascar
        [
          [44, -12], [50, -14], [47, -25], [44, -25], [44, -12]
        ],
        // Asia
        [
          [30, 70], [60, 70], [100, 75], [140, 72], [170, 66], [170, 60], [140, 50],
          [130, 42], [122, 30], [105, 20], [100, 5], [80, 8], [70, 22], [60, 25],
          [50, 30], [35, 30], [30, 40], [40, 50], [60, 55], [60, 60], [30, 70]
        ],
        // Indian Subcontinent
        [
          [68, 24], [72, 19], [77, 8], [80, 13], [88, 22], [80, 28], [68, 24]
        ],
        // Japan
        [
          [130, 32], [140, 36], [142, 44], [138, 38], [130, 32]
        ],
        // Australia
        [
          [114, -22], [120, -14], [135, -12], [142, -11], [148, -20], [153, -28],
          [150, -38], [140, -38], [130, -32], [115, -35], [114, -22]
        ],
        // New Zealand
        [
          [166, -46], [174, -41], [178, -38], [174, -36], [166, -46]
        ],
        // Antarctica
        [
          [-180, -75], [180, -75], [180, -90], [-180, -90], [-180, -75]
        ]
      ];

      // Draw Continents
      ctx.fillStyle = palette.landColor;
      ctx.strokeStyle = palette.landBorder;
      ctx.lineWidth = 2.5;

      continents.forEach(poly => {
        ctx.beginPath();
        poly.forEach((pt, i) => {
          const x = ((pt[0] + 180) / 360) * canvas.width;
          const y = ((90 - pt[1]) / 180) * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // Digital Cyber Dot-Matrix Overlay on Landmasses
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const dotCanvas = document.createElement('canvas');
      dotCanvas.width = canvas.width;
      dotCanvas.height = canvas.height;
      const dotCtx = dotCanvas.getContext('2d');
      dotCtx.drawImage(canvas, 0, 0);

      dotCtx.fillStyle = palette.landBorder;
      const step = 14; // Dot resolution
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          // If on land (check alpha or non-ocean pixel)
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          // Rough check if land color
          if (r > 20 || g > 30 || b > 40) {
            dotCtx.beginPath();
            dotCtx.arc(x, y, 1.8, 0, Math.PI * 2);
            dotCtx.fill();
          }
        }
      }

      return new THREE.CanvasTexture(dotCanvas);
    }

    // 3. Coordinate Conversion Utility: Lat/Lon -> Vector3
    const GLOBE_RADIUS = 3.6;

    function latLongToVector3(lat, lon, radius = GLOBE_RADIUS) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    }

    // 4. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 9.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL init failed:', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root Globe Group for rotations
    const globePivot = new THREE.Group();
    // Default angle facing India / Asia / Europe
    globePivot.rotation.y = -Math.PI * 0.42;
    globePivot.rotation.x = 0.22;
    scene.add(globePivot);

    // 5. Globe Sphere Mesh with Texture
    let earthTexture = createEarthTexture();
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 18,
      specular: new THREE.Color(0x223344),
      emissive: new THREE.Color(0x050b14),
      transparent: true,
      opacity: 0.98
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globePivot.add(globeMesh);

    // Ethereal Atmospheric Outer Halo (Glow)
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.14, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 color;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          gl_FragColor = vec4(color, intensity * 0.75);
        }
      `,
      uniforms: {
        color: { value: new THREE.Color(palette.atmosphere) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globePivot.add(atmoMesh);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(palette.atmosphere, 0.8);
    dirLight2.position.set(-8, -4, -6);
    scene.add(dirLight2);

    // 6. City Nodes & Pulse Rings
    const cityNodeGroup = new THREE.Group();
    globePivot.add(cityNodeGroup);

    const cityMeshLookup = {};
    const raycastTargets = [];
    const pulseRings = [];

    CITIES.forEach(city => {
      const pos = latLongToVector3(city.lat, city.lon, GLOBE_RADIUS + 0.03);

      // Core City Pin Point
      const pinGeo = new THREE.SphereGeometry(0.075, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: palette.nodeCore });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = { city: city };
      cityNodeGroup.add(pinMesh);
      raycastTargets.push(pinMesh);
      cityMeshLookup[city.id] = pinMesh;

      // Outer Glowing Ring (expanding beacon)
      const ringGeo = new THREE.RingGeometry(0.08, 0.14, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: palette.nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      cityNodeGroup.add(ringMesh);

      pulseRings.push({
        mesh: ringMesh,
        baseScale: 1.0,
        phase: Math.random() * Math.PI * 2
      });
    });

    // 7. Great-Circle 3D Bezier Optical Arcs
    const arcsGroup = new THREE.Group();
    globePivot.add(arcsGroup);

    const activeRoutes = [];

    ROUTES.forEach(route => {
      const c1 = CITIES.find(c => c.id === route[0]);
      const c2 = CITIES.find(c => c.id === route[1]);
      if (!c1 || !c2) return;

      const p1 = latLongToVector3(c1.lat, c1.lon, GLOBE_RADIUS + 0.04);
      const p2 = latLongToVector3(c2.lat, c2.lon, GLOBE_RADIUS + 0.04);

      // Midpoint altitude elevates based on distance
      const distance = p1.distanceTo(p2);
      const altitude = GLOBE_RADIUS + Math.min(2.2, Math.max(0.4, distance * 0.38));
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(45);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: palette.arcColor,
        transparent: true,
        opacity: 0.42,
        linewidth: 1.5
      });

      const line = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(line);

      // Glowing Data Pulses traveling along this arc
      const packetCount = distance > 4.5 ? 2 : 1;
      const packets = [];

      for (let i = 0; i < packetCount; i++) {
        const pulseGeo = new THREE.SphereGeometry(0.045, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: palette.particleColor,
          transparent: true,
          opacity: 0.95
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        arcsGroup.add(pulseMesh);

        packets.push({
          mesh: pulseMesh,
          progress: (i / packetCount) + Math.random() * 0.2,
          speed: 0.0035 + Math.random() * 0.0035
        });
      }

      activeRoutes.push({
        curve: curve,
        packets: packets
      });
    });

    // 8. Interaction State & Physics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.0025 };
    let autoRotate = true;
    let targetPivotRotation = null;
    let isSurging = false;
    let surgeEndTime = 0;

    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-1000, -1000);
    const tooltip = document.getElementById('globe-node-tooltip');
    const tooltipCity = document.getElementById('tooltip-city');
    const tooltipTier = document.getElementById('tooltip-tier');
    const tooltipCoords = document.getElementById('tooltip-coords');
    const tooltipLatency = document.getElementById('tooltip-latency');
    const tooltipBandwidth = document.getElementById('tooltip-bandwidth');

    // Drag-to-rotate events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      targetPivotRotation = null; // cancel active animated camera focus
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationVelocity.y = deltaX * 0.0045;
        rotationVelocity.x = deltaY * 0.0045;

        globePivot.rotation.y += rotationVelocity.y;
        globePivot.rotation.x = Math.max(-1.1, Math.min(1.1, globePivot.rotation.x + rotationVelocity.x));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch Support for mobile
    let touchStart = { x: 0, y: 0 };
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        previousMousePosition = { x: touchStart.x, y: touchStart.y };
        targetPivotRotation = null;
      }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        rotationVelocity.y = deltaX * 0.006;
        rotationVelocity.x = deltaY * 0.006;

        globePivot.rotation.y += rotationVelocity.y;
        globePivot.rotation.x = Math.max(-1.1, Math.min(1.1, globePivot.rotation.x + rotationVelocity.x));

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Scroll to zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z = Math.max(6.2, Math.min(12.5, camera.position.z + e.deltaY * 0.005));
    }, { passive: false });

    // 9. Focus On City Coordinates
    function focusCity(cityId) {
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return;

      // Calculate desired Y and X rotation so target city faces camera (0, 0, 1)
      const targetY = -((city.lon + 90) * (Math.PI / 180));
      const targetX = (city.lat) * (Math.PI / 180) * 0.75;

      targetPivotRotation = { x: targetX, y: targetY };
      autoRotate = false;
      const orbitBtn = document.getElementById('btn-globe-orbit');
      if (orbitBtn) orbitBtn.classList.remove('active');

      // Highlight active pill
      document.querySelectorAll('.city-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.city === cityId);
      });

      // Show Tooltip for selected city
      showTooltipForCity(city, { clientX: container.clientWidth / 2, clientY: container.clientHeight / 2 });
    }

    // City pills click listener
    document.querySelectorAll('.city-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        focusCity(pill.dataset.city);
        if (window.SecondBrainAudio) window.SecondBrainAudio.playClick();
      });
    });

    function showTooltipForCity(city, screenPos) {
      if (!tooltip) return;
      tooltipCity.textContent = city.name;
      tooltipTier.textContent = city.tier;
      tooltipCoords.textContent = `${Math.abs(city.lat).toFixed(1)}° ${city.lat >= 0 ? 'N' : 'S'}, ${Math.abs(city.lon).toFixed(1)}° ${city.lon >= 0 ? 'E' : 'W'}`;
      tooltipLatency.textContent = city.latency;
      tooltipBandwidth.textContent = city.bandwidth;

      tooltip.classList.add('visible');

      // Position tooltip near cursor or center
      const rect = container.getBoundingClientRect();
      const left = Math.max(15, Math.min(rect.width - 240, screenPos.clientX - rect.left + 15));
      const top = Math.max(15, Math.min(rect.height - 150, screenPos.clientY - rect.top - 60));

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }

    function hideTooltip() {
      if (tooltip) tooltip.classList.remove('visible');
    }

    // 10. HUD Action Buttons
    const orbitBtn = document.getElementById('btn-globe-orbit');
    if (orbitBtn) {
      orbitBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        orbitBtn.classList.toggle('active', autoRotate);
        targetPivotRotation = null;
        if (window.SecondBrainAudio) window.SecondBrainAudio.playClick();
      });
    }

    const resetBtn = document.getElementById('btn-globe-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetPivotRotation = { x: 0.22, y: -Math.PI * 0.42 };
        autoRotate = true;
        if (orbitBtn) orbitBtn.classList.add('active');
        hideTooltip();
        if (window.SecondBrainAudio) window.SecondBrainAudio.playClick();
      });
    }

    const surgeBtn = document.getElementById('btn-globe-surge');
    if (surgeBtn) {
      surgeBtn.addEventListener('click', () => {
        isSurging = true;
        surgeEndTime = performance.now() + 2400;
        surgeBtn.classList.add('pulsing');
        setTimeout(() => surgeBtn.classList.remove('pulsing'), 2400);

        if (window.SecondBrainAudio) {
          window.SecondBrainAudio.playPulse();
        }
      });
    }

    // Double-click to trigger data surge
    container.addEventListener('dblclick', () => {
      isSurging = true;
      surgeEndTime = performance.now() + 2400;
      if (surgeBtn) {
        surgeBtn.classList.add('pulsing');
        setTimeout(() => surgeBtn.classList.remove('pulsing'), 2400);
      }
      if (window.SecondBrainAudio) window.SecondBrainAudio.playPulse();
    });

    // 11. Main 60FPS Animation Loop
    let clock = new THREE.Clock();
    let hoveredMesh = null;

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Check Surge state
      const now = performance.now();
      const surgeMultiplier = (isSurging && now < surgeEndTime) ? 4.2 : 1.0;
      if (isSurging && now >= surgeEndTime) isSurging = false;

      // Handle Smooth Focus Pivot Interpolation
      if (targetPivotRotation) {
        globePivot.rotation.y = THREE.MathUtils.lerp(globePivot.rotation.y, targetPivotRotation.y, 0.06);
        globePivot.rotation.x = THREE.MathUtils.lerp(globePivot.rotation.x, targetPivotRotation.x, 0.06);

        if (Math.abs(globePivot.rotation.y - targetPivotRotation.y) < 0.005 &&
            Math.abs(globePivot.rotation.x - targetPivotRotation.x) < 0.005) {
          targetPivotRotation = null;
        }
      } else if (!isDragging) {
        // Inertia damping
        rotationVelocity.x *= 0.94;
        rotationVelocity.y *= 0.94;

        if (autoRotate) {
          globePivot.rotation.y += 0.0018 * surgeMultiplier;
        } else {
          globePivot.rotation.y += rotationVelocity.y;
          globePivot.rotation.x = Math.max(-1.1, Math.min(1.1, globePivot.rotation.x + rotationVelocity.x));
        }
      }

      // Animate Beacon Radar Pulse Rings
      pulseRings.forEach(ring => {
        ring.phase += delta * 2.8;
        const scale = 1.0 + (Math.sin(ring.phase) + 1) * 0.9;
        ring.mesh.scale.set(scale, scale, scale);
        ring.mesh.material.opacity = Math.max(0.05, 0.9 - (scale - 1.0) * 0.45);
      });

      // Animate Optical Data Packets along Arcs
      activeRoutes.forEach(route => {
        route.packets.forEach(packet => {
          packet.progress += packet.speed * surgeMultiplier;
          if (packet.progress > 1.0) packet.progress = 0;

          const point = route.curve.getPoint(packet.progress);
          packet.mesh.position.copy(point);

          // Surge color effect
          if (isSurging) {
            packet.mesh.material.color.setHex(palette.surgeColor);
            packet.mesh.scale.set(1.6, 1.6, 1.6);
          } else {
            packet.mesh.material.color.setHex(palette.particleColor);
            packet.mesh.scale.set(1.0, 1.0, 1.0);
          }
        });
      });

      // Raycasting Hover Detection for Cities
      if (!isDragging && mouseNorm.x > -1.0 && mouseNorm.x < 1.0) {
        raycaster.setFromCamera(mouseNorm, camera);
        const intersects = raycaster.intersectObjects(raycastTargets);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hoveredMesh !== hit) {
            hoveredMesh = hit;
            container.style.cursor = 'pointer';
            const city = hit.userData.city;
            hit.scale.set(1.8, 1.8, 1.8);

            // Screen position for tooltip
            const vector = hit.position.clone();
            vector.applyMatrix4(globePivot.matrixWorld);
            vector.project(camera);

            const screenX = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const screenY = (-(vector.y * 0.5) + 0.5) * container.clientHeight;

            showTooltipForCity(city, { clientX: screenX, clientY: screenY });
          }
        } else {
          if (hoveredMesh) {
            hoveredMesh.scale.set(1.0, 1.0, 1.0);
            hoveredMesh = null;
            container.style.cursor = 'grab';
            hideTooltip();
          }
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // 12. Window Resize Handler
    function handleResize() {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // 13. Dynamic Theme Change Synchronizer
    function applyThemeChanges() {
      palette = getThemePalette();
      earthTexture = createEarthTexture();
      sphereMat.map = earthTexture;
      sphereMat.needsUpdate = true;
      atmoMat.uniforms.color.value.setHex(palette.atmosphere);
      dirLight2.color.setHex(palette.atmosphere);

      arcsGroup.children.forEach(child => {
        if (child.isLine) {
          child.material.color.setHex(palette.arcColor);
        }
      });
    }

    const themeObserver = new MutationObserver(() => {
      applyThemeChanges();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Focus default hub: Mumbai
    setTimeout(() => {
      focusCity('mumbai');
    }, 400);
  }
})();
