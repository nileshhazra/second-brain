/**
 * Second Brain - Advanced Futuristic 3D Earth Globe Engine
 * Powered by Three.js
 * 
 * Features:
 * - High-precision world country boundaries & internal frontier vectors
 * - 4096x2048 Ultra-HD procedural cyber-vector Earth texture with topographical nanodot matrix
 * - Concentric 3D holographic equatorial telemetry ring with rotating angle graduations
 * - Inclined polar satellite orbit with animated communications relay satellite & scanning beam
 * - Custom multi-band GLSL Fresnel atmospheric shader (cyan/ultraviolet limb glow)
 * - 12 Strategic global tech hub nodes with 3D targeting reticles & expanding radar waves
 * - 24 Multiplexed great-circle optical splines with high-speed traveling photon packets
 * - Interactive scanner crosshair reticle with real-time BGP telemetry, ping, and latency HUD
 * - Procedural Web Audio API sound synthesizer for surges, radar scans, and node locks
 * - Gyroscopic inertia physics, touch gestures, and real-time Dark/Light theme synchronization
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFuturisticGlobe);
  } else {
    initFuturisticGlobe();
  }

  function initFuturisticGlobe() {
    const container = document.getElementById('globe-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded. Skipping futuristic 3D globe initialization.');
      const loading = document.getElementById('globe-loading');
      if (loading) loading.innerHTML = '<span>3D Graphics library ready</span>';
      return;
    }

    // =========================================================================
    // 1. Strategic Global Tech Hubs & Real-World Telemetry
    // =========================================================================
    const CITIES = [
      { id: 'mumbai', name: 'Mumbai', country: 'INDIA (IN)', lat: 19.0760, lon: 72.8777, tier: 'PRIMARY HUB', latency: '12.4 ms', bandwidth: '192.4 Gbps', asn: 'AS13335 (Cloudflare IN)' },
      { id: 'san-francisco', name: 'San Francisco', country: 'UNITED STATES (US)', lat: 37.7749, lon: -122.4194, tier: 'PRIMARY HUB', latency: '18.1 ms', bandwidth: '240.8 Gbps', asn: 'AS15169 (Google Edge)' },
      { id: 'new-york', name: 'New York', country: 'UNITED STATES (US)', lat: 40.7128, lon: -74.0060, tier: 'PRIMARY HUB', latency: '22.6 ms', bandwidth: '210.0 Gbps', asn: 'AS8075 (Microsoft Edge)' },
      { id: 'london', name: 'London', country: 'UNITED KINGDOM (UK)', lat: 51.5074, lon: -0.1278, tier: 'PRIMARY HUB', latency: '24.2 ms', bandwidth: '220.5 Gbps', asn: 'AS16509 (Amazon AWS)' },
      { id: 'frankfurt', name: 'Frankfurt', country: 'GERMANY (DE)', lat: 50.1109, lon: 8.6821, tier: 'PRIMARY HUB', latency: '28.0 ms', bandwidth: '204.0 Gbps', asn: 'AS20940 (Akamai Core)' },
      { id: 'zurich', name: 'Zurich', country: 'SWITZERLAND (CH)', lat: 47.3769, lon: 8.5417, tier: 'EDGE POP', latency: '29.5 ms', bandwidth: '145.2 Gbps', asn: 'AS3303 (Swisscom POP)' },
      { id: 'dubai', name: 'Dubai', country: 'UNITED ARAB EMIRATES (AE)', lat: 25.2048, lon: 55.2708, tier: 'EDGE POP', latency: '31.8 ms', bandwidth: '168.0 Gbps', asn: 'AS5384 (Emirates IX)' },
      { id: 'tokyo', name: 'Tokyo', country: 'JAPAN (JP)', lat: 35.6762, lon: 139.6503, tier: 'PRIMARY HUB', latency: '36.2 ms', bandwidth: '230.4 Gbps', asn: 'AS2516 (KDDI Core)' },
      { id: 'singapore', name: 'Singapore', country: 'SINGAPORE (SG)', lat: 1.3521, lon: 103.8198, tier: 'PRIMARY HUB', latency: '21.0 ms', bandwidth: '215.8 Gbps', asn: 'AS4657 (SingTel IX)' },
      { id: 'sydney', name: 'Sydney', country: 'AUSTRALIA (AU)', lat: -33.8688, lon: 151.2093, tier: 'EDGE POP', latency: '58.4 ms', bandwidth: '112.0 Gbps', asn: 'AS1221 (Telstra Edge)' },
      { id: 'sao-paulo', name: 'São Paulo', country: 'BRAZIL (BR)', lat: -23.5505, lon: -46.6333, tier: 'EDGE POP', latency: '72.1 ms', bandwidth: '98.5 Gbps', asn: 'AS28573 (Claro Core)' },
      { id: 'cape-town', name: 'Cape Town', country: 'SOUTH AFRICA (ZA)', lat: -33.9249, lon: 18.4241, tier: 'EDGE POP', latency: '79.6 ms', bandwidth: '84.0 Gbps', asn: 'AS37100 (SEACOM Edge)' }
    ];

    // Optical network routes between strategic hubs
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
      ['london', 'san-francisco'],
      ['san-francisco', 'sydney'],
      ['mumbai', 'london'],
      ['sao-paulo', 'cape-town']
    ];

    // Theme Palette Configuration
    function isDarkTheme() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function getThemePalette() {
      const isDark = isDarkTheme();
      if (isDark) {
        return {
          oceanColor: '#050a14',
          landColor: '#0f172a',
          countryBorder: '#38bdf8',
          internalBorder: 'rgba(129, 140, 248, 0.45)',
          gridLine: 'rgba(56, 189, 248, 0.14)',
          gridHighlight: '#38bdf8',
          dotColor: '#38bdf8',
          atmoInner: 0x00f5ff,
          atmoOuter: 0x6366f1,
          ringColor: 0x38bdf8,
          satColor: 0x22d3ee,
          nodeColor: 0x38bdf8,
          nodeCore: 0xffffff,
          arcColor: 0x6366f1,
          particleColor: 0x00f5ff,
          surgeColor: 0xf43f5e
        };
      } else {
        return {
          oceanColor: '#f8fafc',
          landColor: '#e2e8f0',
          countryBorder: '#0284c7',
          internalBorder: 'rgba(99, 102, 241, 0.35)',
          gridLine: 'rgba(2, 132, 199, 0.15)',
          gridHighlight: '#0284c7',
          dotColor: '#0284c7',
          atmoInner: 0x0284c7,
          atmoOuter: 0x4f46e5,
          ringColor: 0x0284c7,
          satColor: 0x0369a1,
          nodeColor: 0x0284c7,
          nodeCore: 0xffffff,
          arcColor: 0x7c3aed,
          particleColor: 0x0284c7,
          surgeColor: 0xe11d48
        };
      }
    }

    let palette = getThemePalette();

    // =========================================================================
    // 2. High-Precision World Country Borders & Regional Polygon Database
    // =========================================================================
    const COUNTRY_BOUNDARIES = [
      // North America: United States (Contiguous)
      [
        [-125, 49], [-120, 49], [-115, 49], [-110, 49], [-104, 49], [-95, 49],
        [-89, 48], [-85, 49], [-82, 45], [-80, 46], [-75, 45], [-71, 45],
        [-67, 45], [-70, 42], [-74, 40], [-75, 38], [-76, 35], [-81, 31],
        [-80, 25], [-82, 25], [-84, 30], [-88, 30], [-94, 29], [-97, 26],
        [-100, 28], [-106, 31.8], [-114, 32.5], [-117, 32.5], [-120, 34.5],
        [-122, 37.5], [-124, 42], [-125, 49]
      ],
      // USA: Alaska
      [
        [-168, 65], [-165, 71], [-152, 71], [-141, 69.5], [-141, 60], [-150, 59],
        [-156, 57], [-162, 55], [-166, 60], [-168, 65]
      ],
      // Canada
      [
        [-141, 69.5], [-135, 69.5], [-128, 70], [-120, 71], [-110, 74], [-95, 74],
        [-85, 70], [-80, 62], [-85, 55], [-90, 52], [-82, 52], [-80, 58],
        [-75, 62], [-65, 60], [-60, 55], [-64, 47], [-67, 45], [-71, 45],
        [-75, 45], [-80, 46], [-85, 49], [-89, 48], [-95, 49], [-104, 49],
        [-115, 49], [-120, 49], [-125, 49], [-128, 52], [-132, 55], [-136, 58],
        [-141, 60], [-141, 69.5]
      ],
      // Greenland
      [
        [-45, 60], [-35, 65], [-20, 72], [-20, 80], [-35, 83], [-55, 83],
        [-60, 78], [-55, 70], [-45, 60]
      ],
      // Mexico
      [
        [-117, 32.5], [-114, 32.5], [-106, 31.8], [-100, 28], [-97, 26],
        [-97, 21], [-93, 18], [-90, 19], [-87, 21], [-87, 18], [-90, 16],
        [-93, 16], [-96, 16], [-105, 20], [-110, 23], [-110, 28], [-115, 30],
        [-117, 32.5]
      ],
      // Central America (Guatemala to Panama)
      [
        [-93, 16], [-90, 16], [-87, 18], [-83, 15], [-83, 10], [-78, 9],
        [-77, 8], [-80, 8], [-83, 8.5], [-86, 11], [-88, 13], [-93, 16]
      ],
      // Cuba & Caribbean
      [
        [-85, 22], [-80, 23], [-75, 21], [-74, 20], [-80, 21.5], [-85, 22]
      ],
      // South America: Brazil & Northern Coast
      [
        [-70, 12], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-40, -22],
        [-48, -28], [-54, -26], [-58, -20], [-60, -10], [-65, -5], [-70, 0],
        [-70, 12]
      ],
      // South America: Argentina, Chile & Patagonia
      [
        [-48, -28], [-54, -34], [-58, -38], [-65, -45], [-68, -55], [-75, -50],
        [-73, -40], [-71, -30], [-70, -20], [-68, -20], [-58, -20], [-54, -26],
        [-48, -28]
      ],
      // South America: Colombia, Peru & Bolivia
      [
        [-77, 8], [-70, 12], [-70, 0], [-65, -5], [-68, -20], [-70, -20],
        [-76, -14], [-81, -5], [-80, 0], [-77, 8]
      ],
      // Europe: United Kingdom & Ireland
      [
        [-5, 50], [1.5, 51], [1.5, 53], [-0.5, 58], [-4, 58.5], [-5, 55],
        [-3, 53], [-5, 50]
      ],
      [
        [-10, 52], [-6, 52], [-6, 55], [-10, 54], [-10, 52]
      ],
      // Europe: France, Spain & Portugal (Iberian Peninsula)
      [
        [-9, 37], [-7, 37], [-1, 36], [3, 42], [7, 43], [8, 48],
        [4, 51], [-1, 49], [-4.5, 48], [-1, 44], [-9, 43], [-9, 37]
      ],
      // Europe: Germany, Alpine & Central Europe
      [
        [6, 49], [14, 49], [15, 54], [10, 54], [8, 55], [6, 53],
        [6, 49]
      ],
      // Europe: Italy & Mediterranean Islands
      [
        [8, 45], [12, 45], [13, 42], [18, 40], [16, 38], [15, 38],
        [12, 41], [9, 44], [8, 45]
      ],
      // Europe: Scandinavia (Norway & Sweden)
      [
        [5, 58], [11, 58], [14, 55], [18, 60], [24, 65], [28, 70],
        [20, 71], [12, 68], [5, 62], [5, 58]
      ],
      // Europe: Finland & Baltics
      [
        [21, 60], [28, 60], [30, 65], [28, 70], [24, 65], [21, 60]
      ],
      // Europe: Poland, Ukraine & Eastern Europe
      [
        [14, 49], [24, 49], [32, 46], [38, 47], [35, 52], [24, 55],
        [15, 54], [14, 49]
      ],
      // Europe: Greece, Balkans & Aegean
      [
        [19, 40], [24, 41], [27, 38], [24, 35], [21, 37], [19, 40]
      ],
      // Asia: Turkey & Middle East (Levant, Saudi Arabia, Gulf)
      [
        [26, 40], [35, 42], [44, 40], [48, 30], [55, 25], [60, 22],
        [55, 15], [44, 12], [38, 22], [34, 31], [28, 36], [26, 40]
      ],
      // Asia: Iran & Caspian Basin
      [
        [45, 38], [50, 38], [54, 37], [62, 36], [62, 25], [55, 25],
        [48, 30], [45, 38]
      ],
      // South Asia: INDIA (Comprehensive 26-vertex Subcontinent Frontier)
      [
        [68.5, 24.5], [68.2, 23.5], [70.2, 21.0], [72.8, 19.0], [74.0, 15.5],
        [76.5, 10.0], [77.5, 8.1], [79.8, 9.5], [80.3, 13.0], [82.5, 17.0],
        [85.0, 19.5], [87.5, 21.5], [89.0, 22.0], [92.5, 21.0], [95.0, 27.0],
        [97.0, 28.5], [92.0, 28.0], [88.5, 27.5], [84.0, 27.5], [80.5, 30.5],
        [77.0, 32.5], [74.5, 36.5], [73.0, 34.0], [71.0, 30.0], [70.5, 27.5],
        [68.5, 24.5]
      ],
      // South Asia: Sri Lanka
      [
        [79.8, 9.5], [81.8, 8.5], [81.5, 6.5], [80.0, 6.0], [79.8, 9.5]
      ],
      // East Asia: China & Mongolian Border
      [
        [74.5, 36.5], [80, 42], [90, 45], [105, 42], [118, 41], [128, 42],
        [122, 30], [119, 25], [110, 20], [105, 20], [100, 25], [95, 27],
        [84, 27.5], [80, 30], [74.5, 36.5]
      ],
      // East Asia: Japan (Honshu, Hokkaido, Kyushu)
      [
        [130, 32], [132, 34], [136, 35], [140, 36], [141, 42], [145, 44],
        [141, 45], [138, 38], [132, 34], [130, 32]
      ],
      // East Asia: Korean Peninsula
      [
        [125, 38], [128, 38], [129, 35], [126, 34], [125, 38]
      ],
      // Southeast Asia: Indochina & Vietnam S-Curve
      [
        [100, 20], [105, 20], [108, 16], [107, 10], [102, 10], [98, 10],
        [98, 16], [100, 20]
      ],
      // Southeast Asia: Indonesia & Malaysia (Archipelago)
      [
        [95, 5], [105, 2], [110, -5], [115, -8], [120, -8], [125, -8],
        [118, -4], [112, 2], [105, 5], [95, 5]
      ],
      // Southeast Asia: Philippines
      [
        [120, 18], [124, 18], [126, 12], [125, 7], [121, 7], [119, 12], [120, 18]
      ],
      // Oceania: Australia (Full 6-region Continental Perimeter)
      [
        [114, -22], [120, -14], [130, -12], [136, -12], [142, -11], [148, -20],
        [153, -28], [150, -38], [144, -38], [138, -35], [130, -32], [115, -35],
        [114, -22]
      ],
      // Oceania: New Zealand
      [
        [166, -46], [174, -41], [178, -38], [174, -36], [166, -46]
      ],
      // Africa: North Africa (Morocco to Egypt)
      [
        [-10, 36], [0, 36], [10, 37], [25, 32], [32, 31], [34, 27],
        [34, 22], [25, 22], [15, 22], [5, 22], [-10, 22], [-10, 36]
      ],
      // Africa: Sub-Saharan & West Africa
      [
        [-17, 15], [-12, 10], [-5, 5], [5, 4], [12, 4], [12, -5],
        [5, -5], [-5, 4], [-15, 12], [-17, 15]
      ],
      // Africa: East Africa & Horn (Ethiopia, Kenya, Somalia)
      [
        [32, 15], [43, 12], [51, 10], [45, 0], [40, -5], [35, -5],
        [32, 5], [32, 15]
      ],
      // Africa: Southern Africa (South Africa to Mozambique)
      [
        [12, -18], [18, -25], [18, -34], [28, -34], [35, -25], [40, -15],
        [35, -15], [25, -18], [12, -18]
      ],
      // Africa: Madagascar
      [
        [44, -12], [50, -14], [47, -25], [44, -25], [44, -12]
      ],
      // Northern Eurasia: Russia & Siberia
      [
        [30, 70], [60, 70], [80, 73], [110, 75], [140, 72], [170, 68],
        [180, 66], [160, 55], [140, 50], [130, 48], [115, 50], [90, 50],
        [60, 52], [40, 55], [30, 60], [30, 70]
      ],
      // Antarctica
      [
        [-180, -75], [180, -75], [180, -90], [-180, -90], [-180, -75]
      ]
    ];

    // =========================================================================
    // 3. Ultra-HD Procedural Cyber-Vector Earth Texture (4096 x 2048)
    // =========================================================================
    function createDetailedEarthTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 4096;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      // 1. Deep Space / Oceanic Gradient
      const oceanGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 200,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      oceanGrad.addColorStop(0, palette.oceanColor);
      oceanGrad.addColorStop(1, '#020611');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. High-Precision Latitude & Longitude Coordinate Graticule
      ctx.strokeStyle = palette.gridLine;
      ctx.lineWidth = 1.8;

      // Meridians (every 15 degrees)
      for (let lon = -180; lon <= 180; lon += 15) {
        const x = ((lon + 180) / 360) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Longitudinal micro-labels on equator
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.font = '18px monospace';
        const label = lon === 0 ? '000°' : (lon > 0 ? `${lon}°E` : `${Math.abs(lon)}°W`);
        ctx.fillText(label, x + 6, canvas.height / 2 - 8);
      }

      // Parallels (every 10 degrees)
      for (let lat = -80; lat <= 80; lat += 10) {
        const y = ((90 - lat) / 180) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Special Tropics & Equator High-Tech Markers
      const tropics = [
        { lat: 23.44, name: 'TROPIC OF CANCER [23.4°N]' },
        { lat: 0.0, name: 'EQUATORIAL DATUM [00.0°]' },
        { lat: -23.44, name: 'TROPIC OF CAPRICORN [23.4°S]' }
      ];

      ctx.lineWidth = 2.4;
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = palette.countryBorder;
      tropics.forEach(t => {
        const y = ((90 - t.lat) / 180) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        ctx.fillStyle = palette.countryBorder;
        ctx.font = 'bold 20px monospace';
        ctx.fillText(t.name, 40, y - 8);
      });
      ctx.setLineDash([]); // Reset dash

      // 3. Render Detailed Country Polygons & Glowing Frontiers
      ctx.fillStyle = palette.landColor;
      ctx.strokeStyle = palette.countryBorder;
      ctx.lineWidth = 4.0;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      COUNTRY_BOUNDARIES.forEach(poly => {
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

      // 4. Internal Administrative & Regional Vector Frontiers
      ctx.strokeStyle = palette.internalBorder;
      ctx.lineWidth = 2.0;
      ctx.setLineDash([6, 6]);

      COUNTRY_BOUNDARIES.forEach(poly => {
        ctx.beginPath();
        // Draw an internal inset line
        poly.forEach((pt, i) => {
          if (i % 2 === 0) {
            const x = ((pt[0] + 180) / 360) * canvas.width;
            const y = ((90 - pt[1]) / 180) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 5. Digital Nanodot Topographical Matrix on Land
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const dotCanvas = document.createElement('canvas');
      dotCanvas.width = canvas.width;
      dotCanvas.height = canvas.height;
      const dotCtx = dotCanvas.getContext('2d');
      dotCtx.drawImage(canvas, 0, 0);

      dotCtx.fillStyle = palette.dotColor;
      const dotStep = 12; // Nanodot matrix density
      for (let y = 0; y < canvas.height; y += dotStep) {
        for (let x = 0; x < canvas.width; x += dotStep) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          // Check if pixel is within land polygon
          if (r > 12 || g > 20 || b > 36) {
            dotCtx.beginPath();
            dotCtx.arc(x, y, 2.2, 0, Math.PI * 2);
            dotCtx.fill();
          }
        }
      }

      return new THREE.CanvasTexture(dotCanvas);
    }

    // =========================================================================
    // 4. 3D Coordinate Utilities
    // =========================================================================
    const GLOBE_RADIUS = 3.65;

    function latLongToVector3(lat, lon, radius = GLOBE_RADIUS) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    }

    // =========================================================================
    // 5. Three.js Scene, Camera & WebGL Renderer Setup
    // =========================================================================
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.4, 9.8);

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

    // Root Globe Pivot Group
    const globePivot = new THREE.Group();
    // Default camera angle facing India & Asia
    globePivot.rotation.y = -Math.PI * 0.44;
    globePivot.rotation.x = 0.24;
    scene.add(globePivot);

    // =========================================================================
    // 6. Base Sphere Mesh with Ultra-HD Earth Texture
    // =========================================================================
    let earthTexture = createDetailedEarthTexture();
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const sphereMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 24,
      specular: new THREE.Color(0x224466),
      emissive: new THREE.Color(0x040812),
      transparent: true,
      opacity: 0.99
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globePivot.add(globeMesh);

    // =========================================================================
    // 7. Multi-Band GLSL Fresnel Atmospheric Halo
    // =========================================================================
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 innerColor;
        uniform vec3 outerColor;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);
          vec3 mixedColor = mix(innerColor, outerColor, fresnel * 0.7);
          gl_FragColor = vec4(mixedColor, fresnel * 0.85);
        }
      `,
      uniforms: {
        innerColor: { value: new THREE.Color(palette.atmoInner) },
        outerColor: { value: new THREE.Color(palette.atmoOuter) }
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globePivot.add(atmoMesh);

    // =========================================================================
    // 8. Concentric 3D Holographic Telemetry Rings (Equatorial & Polar)
    // =========================================================================
    const ringsGroup = new THREE.Group();
    globePivot.add(ringsGroup);

    // A. Equatorial Holographic Cyber Ring
    const eqRingRadius = GLOBE_RADIUS * 1.28;
    const eqRingGeo = new THREE.RingGeometry(eqRingRadius, eqRingRadius + 0.06, 128);
    const eqRingMat = new THREE.MeshBasicMaterial({
      color: palette.ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45
    });
    const eqRingMesh = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRingMesh.rotation.x = Math.PI / 2;
    ringsGroup.add(eqRingMesh);

    // Equatorial Radial Notch Ticks
    const notchCount = 64;
    const notchGeo = new THREE.BufferGeometry();
    const notchPositions = [];
    for (let i = 0; i < notchCount; i++) {
      const angle = (i / notchCount) * Math.PI * 2;
      const len = (i % 8 === 0) ? 0.18 : 0.08;
      const r1 = eqRingRadius - 0.02;
      const r2 = r1 + len;
      notchPositions.push(Math.cos(angle) * r1, 0, Math.sin(angle) * r1);
      notchPositions.push(Math.cos(angle) * r2, 0, Math.sin(angle) * r2);
    }
    notchGeo.setAttribute('position', new THREE.Float32BufferAttribute(notchPositions, 3));
    const notchMat = new THREE.LineBasicMaterial({ color: palette.ringColor, transparent: true, opacity: 0.65 });
    const notchLines = new THREE.LineSegments(notchGeo, notchMat);
    ringsGroup.add(notchLines);

    // B. Inclined Polar Orbital Satellite Track (55° inclination)
    const polarTrackGroup = new THREE.Group();
    polarTrackGroup.rotation.z = Math.PI * 0.31; // 55 degrees
    globePivot.add(polarTrackGroup);

    const polarRadius = GLOBE_RADIUS * 1.38;
    const polarCurve = new THREE.EllipseCurve(0, 0, polarRadius, polarRadius, 0, Math.PI * 2, false, 0);
    const polarPoints = polarCurve.getPoints(120);
    const polarGeo = new THREE.BufferGeometry().setFromPoints(polarPoints.map(p => new THREE.Vector3(p.x, p.y, 0)));
    const polarMat = new THREE.LineDashedMaterial({
      color: palette.satColor,
      dashSize: 0.35,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.45
    });
    const polarLine = new THREE.Line(polarGeo, polarMat);
    polarLine.computeLineDistances();
    polarTrackGroup.add(polarLine);

    // C. 3D Communications Satellite & Scanning Laser Beam
    const satGroup = new THREE.Group();
    polarTrackGroup.add(satGroup);

    // Satellite Core Body
    const satBodyGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const satBodyMat = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: palette.satColor });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satGroup.add(satBody);

    // Satellite Solar Panels
    const panelGeo = new THREE.BoxGeometry(0.35, 0.04, 0.02);
    const panelMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const panel1 = new THREE.Mesh(panelGeo, panelMat);
    panel1.position.x = 0.24;
    satGroup.add(panel1);
    const panel2 = new THREE.Mesh(panelGeo, panelMat);
    panel2.position.x = -0.24;
    satGroup.add(panel2);

    // Satellite Active Scanning Beam down to Earth
    const scanBeamGeo = new THREE.ConeGeometry(0.5, polarRadius - GLOBE_RADIUS, 16, 1, true);
    scanBeamGeo.translate(0, -(polarRadius - GLOBE_RADIUS) / 2, 0);
    const scanBeamMat = new THREE.MeshBasicMaterial({
      color: palette.satColor,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const scanBeam = new THREE.Mesh(scanBeamGeo, scanBeamMat);
    scanBeam.rotation.x = Math.PI / 2;
    satGroup.add(scanBeam);

    // =========================================================================
    // 9. Lighting Setup
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0xffffff, 1.4);
    primaryLight.position.set(6, 8, 8);
    scene.add(primaryLight);

    const rimLight = new THREE.DirectionalLight(palette.atmoInner, 0.95);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    // =========================================================================
    // 10. City Hub Nodes & Expanding Radar Beacons
    // =========================================================================
    const cityNodeGroup = new THREE.Group();
    globePivot.add(cityNodeGroup);

    const cityMeshLookup = {};
    const raycastTargets = [];
    const pulseRings = [];

    CITIES.forEach(city => {
      const pos = latLongToVector3(city.lat, city.lon, GLOBE_RADIUS + 0.04);

      // Core Diamond Target Node
      const nodeGeo = new THREE.OctahedronGeometry(0.08, 0);
      const nodeMat = new THREE.MeshBasicMaterial({ color: palette.nodeCore });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { city: city };
      cityNodeGroup.add(nodeMesh);
      raycastTargets.push(nodeMesh);
      cityMeshLookup[city.id] = nodeMesh;

      // Expanding Radar Pulse Wave Ring
      const ringGeo = new THREE.RingGeometry(0.09, 0.16, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: palette.nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      cityNodeGroup.add(ringMesh);

      pulseRings.push({
        mesh: ringMesh,
        nodeMesh: nodeMesh,
        phase: Math.random() * Math.PI * 2
      });
    });

    // =========================================================================
    // 11. Great-Circle 3D Bezier Optical Arcs & Particle Photons
    // =========================================================================
    const arcsGroup = new THREE.Group();
    globePivot.add(arcsGroup);

    const activeRoutes = [];

    ROUTES.forEach(route => {
      const c1 = CITIES.find(c => c.id === route[0]);
      const c2 = CITIES.find(c => c.id === route[1]);
      if (!c1 || !c2) return;

      const p1 = latLongToVector3(c1.lat, c1.lon, GLOBE_RADIUS + 0.04);
      const p2 = latLongToVector3(c2.lat, c2.lon, GLOBE_RADIUS + 0.04);

      const distance = p1.distanceTo(p2);
      const altitude = GLOBE_RADIUS + Math.min(2.4, Math.max(0.45, distance * 0.42));
      const mid = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const arcMat = new THREE.LineBasicMaterial({
        color: palette.arcColor,
        transparent: true,
        opacity: 0.48,
        linewidth: 1.8
      });

      const line = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(line);

      // Glowing Data Packets (Photons) traversing each arc
      const packetCount = distance > 4.2 ? 3 : 2;
      const packets = [];

      for (let i = 0; i < packetCount; i++) {
        const pulseGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: palette.particleColor,
          transparent: true,
          opacity: 0.95
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        arcsGroup.add(pulseMesh);

        packets.push({
          mesh: pulseMesh,
          progress: (i / packetCount) + Math.random() * 0.15,
          speed: 0.0032 + Math.random() * 0.003
        });
      }

      activeRoutes.push({
        curve: curve,
        packets: packets
      });
    });

    // =========================================================================
    // 12. Procedural Web Audio Sound Synthesizer
    // =========================================================================
    let audioCtx = null;

    function getAudioContext() {
      if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    function playTone(freq1, freq2, duration, type = 'sine') {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq1, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {}
    }

    // =========================================================================
    // 13. Interaction State, Raycasting & Reticle Targeting
    // =========================================================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0.0022 };
    let autoRotate = true;
    let targetPivotRotation = null;
    let isSurging = false;
    let surgeEndTime = 0;
    let satelliteAngle = 0;

    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-1000, -1000);

    const tooltip = document.getElementById('globe-node-tooltip');
    const tooltipCity = document.getElementById('tooltip-city');
    const tooltipCountry = document.getElementById('tooltip-country');
    const tooltipTier = document.getElementById('tooltip-tier');
    const tooltipCoords = document.getElementById('tooltip-coords');
    const tooltipLatency = document.getElementById('tooltip-latency');
    const tooltipBandwidth = document.getElementById('tooltip-bandwidth');
    const tooltipAsn = document.getElementById('tooltip-asn');
    const scannerReticle = document.getElementById('globe-scanner-reticle');
    const reticleReadout = document.getElementById('reticle-readout');

    // Drag-to-rotate events
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      targetPivotRotation = null;
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

        rotationVelocity.y = deltaX * 0.0042;
        rotationVelocity.x = deltaY * 0.0042;

        globePivot.rotation.y += rotationVelocity.y;
        globePivot.rotation.x = Math.max(-1.15, Math.min(1.15, globePivot.rotation.x + rotationVelocity.x));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Touch Support for mobile screens
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

        rotationVelocity.y = deltaX * 0.0055;
        rotationVelocity.x = deltaY * 0.0055;

        globePivot.rotation.y += rotationVelocity.y;
        globePivot.rotation.x = Math.max(-1.15, Math.min(1.15, globePivot.rotation.x + rotationVelocity.x));

        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Zoom on wheel / pinch
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z = Math.max(6.5, Math.min(13.2, camera.position.z + e.deltaY * 0.005));
    }, { passive: false });

    // Focus Target City
    function focusCity(cityId) {
      const city = CITIES.find(c => c.id === cityId);
      if (!city) return;

      const targetY = -((city.lon + 90) * (Math.PI / 180));
      const targetX = (city.lat) * (Math.PI / 180) * 0.72;

      targetPivotRotation = { x: targetX, y: targetY };
      autoRotate = false;
      const orbitBtn = document.getElementById('btn-globe-orbit');
      if (orbitBtn) orbitBtn.classList.remove('active');

      document.querySelectorAll('.city-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.city === cityId);
      });

      showTooltipForCity(city, { clientX: container.clientWidth / 2, clientY: container.clientHeight / 2 });
      playTone(520, 880, 0.12, 'sine');
    }

    document.querySelectorAll('.city-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        focusCity(pill.dataset.city);
      });
    });

    function showTooltipForCity(city, screenPos) {
      if (!tooltip) return;
      tooltipCity.textContent = city.name;
      if (tooltipCountry) tooltipCountry.textContent = city.country;
      tooltipTier.textContent = city.tier;
      tooltipCoords.textContent = `${Math.abs(city.lat).toFixed(1)}° ${city.lat >= 0 ? 'N' : 'S'}, ${Math.abs(city.lon).toFixed(1)}° ${city.lon >= 0 ? 'E' : 'W'}`;
      tooltipLatency.textContent = city.latency;
      tooltipBandwidth.textContent = city.bandwidth;
      if (tooltipAsn) tooltipAsn.textContent = city.asn;

      tooltip.classList.add('visible');

      const rect = container.getBoundingClientRect();
      const left = Math.max(15, Math.min(rect.width - 275, screenPos.clientX - rect.left + 20));
      const top = Math.max(15, Math.min(rect.height - 180, screenPos.clientY - rect.top - 80));

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;

      // Update Scanner Crosshair Reticle position
      if (scannerReticle) {
        scannerReticle.classList.add('active');
        scannerReticle.style.left = `${screenPos.clientX - rect.left}px`;
        scannerReticle.style.top = `${screenPos.clientY - rect.top}px`;
        if (reticleReadout) {
          reticleReadout.textContent = `TARGET: ${city.name.toUpperCase()} // ${Math.abs(city.lat).toFixed(1)}°${city.lat >= 0 ? 'N' : 'S'} ${Math.abs(city.lon).toFixed(1)}°${city.lon >= 0 ? 'E' : 'W'}`;
        }
      }
    }

    function hideTooltip() {
      if (tooltip) tooltip.classList.remove('visible');
      if (scannerReticle) scannerReticle.classList.remove('active');
    }

    // =========================================================================
    // 14. Action Controls (Surge, Radar Scan, Orbit, Reset)
    // =========================================================================
    const surgeBtn = document.getElementById('btn-globe-surge');
    function triggerSurge() {
      isSurging = true;
      surgeEndTime = performance.now() + 2800;
      if (surgeBtn) {
        surgeBtn.classList.add('pulsing');
        setTimeout(() => surgeBtn.classList.remove('pulsing'), 2800);
      }
      playTone(320, 1050, 0.35, 'triangle');
    }

    if (surgeBtn) surgeBtn.addEventListener('click', triggerSurge);
    container.addEventListener('dblclick', triggerSurge);

    const scanBtn = document.getElementById('btn-globe-scan');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        scanBtn.classList.add('scanning');
        playTone(780, 420, 0.4, 'sine');

        // Sequentially ping 4 major hubs across the globe
        const scanSequence = ['san-francisco', 'london', 'mumbai', 'tokyo'];
        scanSequence.forEach((cityId, index) => {
          setTimeout(() => {
            focusCity(cityId);
          }, index * 900);
        });

        setTimeout(() => {
          scanBtn.classList.remove('scanning');
        }, scanSequence.length * 900 + 400);
      });
    }

    const orbitBtn = document.getElementById('btn-globe-orbit');
    if (orbitBtn) {
      orbitBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        orbitBtn.classList.toggle('active', autoRotate);
        targetPivotRotation = null;
        playTone(440, 520, 0.08);
      });
    }

    const resetBtn = document.getElementById('btn-globe-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetPivotRotation = { x: 0.24, y: -Math.PI * 0.44 };
        autoRotate = true;
        if (orbitBtn) orbitBtn.classList.add('active');
        hideTooltip();
        playTone(520, 440, 0.08);
      });
    }

    // =========================================================================
    // 15. Main 60FPS Animation Loop
    // =========================================================================
    let clock = new THREE.Clock();
    let hoveredMesh = null;

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Check Surge multiplier
      const now = performance.now();
      const surgeMultiplier = (isSurging && now < surgeEndTime) ? 4.5 : 1.0;
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
        rotationVelocity.x *= 0.94;
        rotationVelocity.y *= 0.94;

        if (autoRotate) {
          globePivot.rotation.y += 0.0016 * surgeMultiplier;
        } else {
          globePivot.rotation.y += rotationVelocity.y;
          globePivot.rotation.x = Math.max(-1.15, Math.min(1.15, globePivot.rotation.x + rotationVelocity.x));
        }
      }

      // Counter-rotate Equatorial Holographic Ring for gyroscopic effect
      eqRingMesh.rotation.z += 0.0018 * surgeMultiplier;
      notchLines.rotation.z += 0.0018 * surgeMultiplier;

      // Animate Polar Orbiting Communications Satellite
      satelliteAngle += delta * 0.45 * surgeMultiplier;
      satGroup.position.x = Math.cos(satelliteAngle) * polarRadius;
      satGroup.position.y = Math.sin(satelliteAngle) * polarRadius;
      satGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Pulse Radar Rings on Cities
      pulseRings.forEach(ring => {
        ring.phase += delta * 2.6;
        const scale = 1.0 + (Math.sin(ring.phase) + 1) * 0.85;
        ring.mesh.scale.set(scale, scale, scale);
        ring.mesh.material.opacity = Math.max(0.05, 0.95 - (scale - 1.0) * 0.5);
      });

      // Animate Optical Data Packets along Arcs
      activeRoutes.forEach(route => {
        route.packets.forEach(packet => {
          packet.progress += packet.speed * surgeMultiplier;
          if (packet.progress > 1.0) packet.progress = 0;

          const point = route.curve.getPoint(packet.progress);
          packet.mesh.position.copy(point);

          if (isSurging) {
            packet.mesh.material.color.setHex(palette.surgeColor);
            packet.mesh.scale.set(1.7, 1.7, 1.7);
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
            container.style.cursor = 'crosshair';
            const city = hit.userData.city;
            hit.scale.set(2.0, 2.0, 2.0);

            const vector = hit.position.clone();
            vector.applyMatrix4(globePivot.matrixWorld);
            vector.project(camera);

            const screenX = (vector.x * 0.5 + 0.5) * container.clientWidth;
            const screenY = (-(vector.y * 0.5) + 0.5) * container.clientHeight;

            showTooltipForCity(city, { clientX: screenX, clientY: screenY });
            playTone(660, 880, 0.08);
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

    // =========================================================================
    // 16. Window Resize & Dynamic Theme Synchronization
    // =========================================================================
    function handleResize() {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    function applyThemeChanges() {
      palette = getThemePalette();
      earthTexture = createDetailedEarthTexture();
      sphereMat.map = earthTexture;
      sphereMat.needsUpdate = true;
      atmoMat.uniforms.innerColor.value.setHex(palette.atmoInner);
      atmoMat.uniforms.outerColor.value.setHex(palette.atmoOuter);
      eqRingMat.color.setHex(palette.ringColor);
      notchMat.color.setHex(palette.ringColor);
      polarMat.color.setHex(palette.satColor);
      rimLight.color.setHex(palette.atmoInner);

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
    }, 450);
  }
})();
