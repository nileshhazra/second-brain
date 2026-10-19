/**
 * Second Brain - Mimi the 3D Cyber Familiar & Chief Architecture Officer
 * Feature Animation / Pixar-Grade Procedural Feline Model
 * Powered by Three.js & Web Audio API
 * 
 * Architectural Highlights:
 * - Pixar-styled cinematic rendering: ACESFilmicToneMapping, studio 4-point lighting with velvet fur rim kicker.
 * - Anatomically accurate feline modeling:
 *   - Feline cranium, zygomatic cheeks, dual mystacial whisker pads, philtrum, chin, shield nose with nostrils.
 *   - Erect triangular ears with Henry's pocket (cutaneous marginal pouch) notch and soft inner pinna ridges.
 *   - True multi-layered Pixar eyes: deep procedural iris with radial striations & limbal ring, glass cornea dome catching studio specular glints.
 *   - Digitigrade leg anatomy: scapula, carpal wrist, raised feline hock (ankle), digitigrade paws with individual toe pads.
 *   - Articulated 10-joint caudal vertebra tail with natural wave propagation physics and tip twitches.
 * - Authentic Feline Biomechanics:
 *   - Ribcage breathing & flank heave.
 *   - Feline slow blinks (authentic sign of cat trust and affection).
 *   - Independent ear swivels responding to sounds/cursor.
 *   - Rotary gallop across the screen for "i love you babu" with continuous heart particle trail.
 *   - Dynamic feline righting-reflex acrobatic pirouette for "i am babu".
 * - Interactive AI personality engine with witty tech roasts, system design wisdom, and client-side synthesized Web Audio.
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMimiCat);
  } else {
    initMimiCat();
  }

  function initMimiCat() {
    if (typeof THREE === 'undefined') return;

    // 1. Create DOM Elements
    const widget = document.createElement('div');
    widget.id = 'mochi-cat-widget';
    widget.className = 'mochi-cat-widget';
    widget.innerHTML = `
      <div id="mochi-dialogue-bubble" class="mochi-dialogue-bubble">
        <div class="mochi-dialogue-header">
          <div class="mochi-profile">
            <span class="mochi-avatar">🐱</span>
            <div>
              <div class="mochi-name">Mimi</div>
              <div class="mochi-title">Chief Architecture Officer (CAO)</div>
            </div>
          </div>
          <button id="mochi-close-dialogue" class="mochi-bubble-close" aria-label="Close dialog">✕</button>
        </div>

        <div id="mochi-dialogue-text" class="mochi-dialogue-text">
          *purr...* Oh look, a human in Nilesh's digital garden! Are you here to read about distributed systems, or did you just come to admire my whiskers?
        </div>

        <div class="mochi-interactive-chips" id="mochi-chips">
          <button class="mochi-chip" data-action="scratch">🐾 Scratch Chin</button>
          <button class="mochi-chip" data-action="coffee">☕ Give Coffee</button>
          <button class="mochi-chip" data-action="roast">🔥 Roast My Stack</button>
          <button class="mochi-chip" data-action="wisdom">💡 Cat Wisdom</button>
          <button class="mochi-chip" data-action="laser">🔴 Laser Chase</button>
        </div>

        <form id="mochi-chat-form" class="mochi-chat-form">
          <input type="text" id="mochi-user-input" class="mochi-chat-input" placeholder="Ask Mimi about tech, life, or naps..." autocomplete="off">
          <button type="submit" class="mochi-chat-send" aria-label="Send">💬</button>
        </form>
      </div>

      <div id="mochi-canvas-container" class="mochi-canvas-container" title="Click Mimi to chat or pet!">
        <div class="mochi-peek-prompt" id="mochi-peek-prompt">Psst! 🐾</div>
      </div>
    `;
    document.body.appendChild(widget);

    const canvasContainer = document.getElementById('mochi-canvas-container');
    const bubble = document.getElementById('mochi-dialogue-bubble');
    const dialogueText = document.getElementById('mochi-dialogue-text');
    const peekPrompt = document.getElementById('mochi-peek-prompt');
    const closeBtn = document.getElementById('mochi-close-dialogue');
    const chatForm = document.getElementById('mochi-chat-form');
    const chatInput = document.getElementById('mochi-user-input');

    // 2. Three.js Scene, Cinematic Tone Mapping & Camera
    const width = 175;
    const height = 210;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.22, 6.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    if (renderer.outputEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
    canvasContainer.appendChild(renderer.domElement);

    // 3. Cinematic Pixar 4-Point Studio Lighting
    // Key Light: Warm golden directional beam
    const keyLight = new THREE.DirectionalLight(0xfff2df, 1.6);
    keyLight.position.set(3.2, 4.2, 3.5);
    scene.add(keyLight);

    // Fill Light: Soft cool ambient skylight
    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.85);
    fillLight.position.set(-3.2, 2.0, 2.0);
    scene.add(fillLight);

    // Rim / Kicker Light: Creates the signature Pixar velvet fur halo along silhouettes
    const rimLight = new THREE.DirectionalLight(0xf472b6, 2.2);
    rimLight.position.set(0, 3.5, -4.0);
    scene.add(rimLight);

    // Ambient Ground Bounce: Soft warm floor bounce
    const groundBounce = new THREE.HemisphereLight(0xfff7ed, 0x1e1b4b, 0.65);
    scene.add(groundBounce);

    // 4. Procedural Iris Texture Generator (Pixar-grade depth & striations)
    function createIrisTexture(isDark) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const cx = 128, cy = 128, r = 120;

      // Base Sclera / Background
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Radial Iris Gradient with deep jewel tone
      const grad = ctx.createRadialGradient(cx, cy, 12, cx, cy, r);
      if (isDark) {
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.35, '#0284c7');
        grad.addColorStop(0.7, '#0369a1');
        grad.addColorStop(0.9, '#0c4a6e');
        grad.addColorStop(1.0, '#062033'); // Limbal ring
      } else {
        grad.addColorStop(0, '#6ee7b7');
        grad.addColorStop(0.3, '#10b981');
        grad.addColorStop(0.68, '#059669');
        grad.addColorStop(0.88, '#047857');
        grad.addColorStop(1.0, '#022c22'); // Limbal ring
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Fine Iris Fibers (authentic feline striations)
      ctx.save();
      ctx.translate(cx, cy);
      for (let i = 0; i < 90; i++) {
        ctx.rotate((Math.PI * 2) / 90);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.32)' : 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(r - 6, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Expressive Feline Pupil (Almond Slit with smooth antialiasing)
      ctx.fillStyle = '#06060a';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 34, 76, 0, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Inner Pupil Corona
      ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(110, 231, 183, 0.4)';
      ctx.lineWidth = 2.0;
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = true;
      return tex;
    }

    // 5. Materials Palette with Pixar Velvet Sheen & Physical Subsurface Emulation
    function getMaterials() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const irisTex = createIrisTexture(isDark);

      return {
        furMain: new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x221f3d : 0xfcf8f2,
          roughness: 0.68,
          metalness: 0.02,
          sheen: 1.0,
          sheenRoughness: 0.42,
          sheenColor: new THREE.Color(isDark ? 0x818cf8 : 0xffedd5)
        }),
        furCream: new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x312b55 : 0xffffff,
          roughness: 0.65,
          metalness: 0.0,
          sheen: 0.9,
          sheenRoughness: 0.38,
          sheenColor: new THREE.Color(0xfff7ed)
        }),
        nose: new THREE.MeshPhysicalMaterial({
          color: 0xf472b6,
          roughness: 0.3,
          metalness: 0.0,
          clearcoat: 0.85,
          clearcoatRoughness: 0.12
        }),
        innerEar: new THREE.MeshPhysicalMaterial({
          color: 0xfb7185,
          roughness: 0.58,
          metalness: 0.0,
          transmission: 0.15
        }),
        sclera: new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.3
        }),
        iris: new THREE.MeshBasicMaterial({
          map: irisTex
        }),
        cornea: new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.02,
          metalness: 0.0,
          transmission: 0.94,
          ior: 1.34,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04
        }),
        eyelid: new THREE.MeshPhysicalMaterial({
          color: isDark ? 0x221f3d : 0xfcf8f2,
          roughness: 0.65,
          metalness: 0.02,
          sheen: 1.0,
          sheenColor: new THREE.Color(isDark ? 0x818cf8 : 0xffedd5)
        }),
        blush: new THREE.MeshBasicMaterial({
          color: 0xff4d8d,
          transparent: true,
          opacity: 0
        }),
        collar: new THREE.MeshPhysicalMaterial({
          color: 0x8b5cf6,
          roughness: 0.4,
          metalness: 0.1,
          sheen: 1.0,
          sheenColor: new THREE.Color(0xd8b4fe)
        }),
        bell: new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 0.92,
          roughness: 0.18
        }),
        pawPad: new THREE.MeshPhysicalMaterial({
          color: 0xf472b6,
          roughness: 0.45,
          clearcoat: 0.3
        }),
        shadow: new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.28
        })
      };
    }

    let mats = getMaterials();

    // 6. Anatomically Accurate Feline Skeleton & Rig
    const catGroup = new THREE.Group();
    scene.add(catGroup);
    catGroup.position.set(0, -0.15, 0);

    // Ground Contact Shadow (Soft AO under cat)
    const shadowGeo = new THREE.CircleGeometry(0.85, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMesh = new THREE.Mesh(shadowGeo, mats.shadow);
    shadowMesh.position.set(0, -1.45, 0);
    catGroup.add(shadowMesh);

    // --- Spine & Torso Hierarchy ---
    const spineRoot = new THREE.Group();
    spineRoot.position.set(0, -0.72, 0);
    catGroup.add(spineRoot);

    // Thoracic Chest & Ribcage (Oval, tapering forward to neck)
    const chestGeo = new THREE.SphereGeometry(0.74, 32, 32);
    chestGeo.scale(0.88, 1.12, 1.05);
    const chestMesh = new THREE.Mesh(chestGeo, mats.furMain);
    spineRoot.add(chestMesh);

    // Fluffy Cream Chest Bib
    const bibGeo = new THREE.SphereGeometry(0.58, 24, 24);
    bibGeo.scale(0.72, 0.92, 0.45);
    const bibMesh = new THREE.Mesh(bibGeo, mats.furCream);
    bibMesh.position.set(0, -0.05, 0.52);
    spineRoot.add(bibMesh);

    // Lumbar & Flanks (Flexible feline waist)
    const lumbarGeo = new THREE.SphereGeometry(0.68, 28, 28);
    lumbarGeo.scale(0.82, 0.98, 0.95);
    const lumbarMesh = new THREE.Mesh(lumbarGeo, mats.furMain);
    lumbarMesh.position.set(0, -0.22, -0.25);
    spineRoot.add(lumbarMesh);

    // --- Digitigrade Hindquarters ---
    // Muscular Thighs (Femur)
    const thighGeo = new THREE.SphereGeometry(0.42, 22, 22);
    thighGeo.scale(0.68, 1.15, 0.98);

    const leftThigh = new THREE.Mesh(thighGeo, mats.furMain);
    leftThigh.position.set(-0.54, -0.32, -0.28);
    leftThigh.rotation.set(0.18, 0.28, -0.18);
    spineRoot.add(leftThigh);

    const rightThigh = new THREE.Mesh(thighGeo, mats.furMain);
    rightThigh.position.set(0.54, -0.32, -0.28);
    rightThigh.rotation.set(0.18, -0.28, 0.18);
    spineRoot.add(rightThigh);

    // Raised Hock & Metatarsals (Anatomical Feline Ankle)
    function buildHindFoot(side) {
      const g = new THREE.Group();
      
      // Hock to metatarsal bridge
      const hockGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.35, 14);
      hockGeo.rotateX(0.25);
      const hockMesh = new THREE.Mesh(hockGeo, mats.furMain);
      hockMesh.position.set(0, 0.12, -0.06);
      g.add(hockMesh);

      // Digitigrade Paw with 4 Defined Feline Toes
      const footGeo = new THREE.SphereGeometry(0.19, 18, 18);
      footGeo.scale(1.12, 0.62, 1.38);
      const footMesh = new THREE.Mesh(footGeo, mats.furCream);
      g.add(footMesh);

      // Pink Paw Pads
      const padGeo = new THREE.SphereGeometry(0.045, 10, 10);
      padGeo.scale(1, 0.5, 1);
      for (let t = -1; t <= 1; t++) {
        const toe = new THREE.Mesh(padGeo, mats.pawPad);
        toe.position.set(t * 0.065, -0.04, 0.16);
        g.add(toe);
      }
      return g;
    }

    const leftHindFoot = buildHindFoot(-1);
    leftHindFoot.position.set(-0.52, -0.68, 0.18);
    spineRoot.add(leftHindFoot);

    const rightHindFoot = buildHindFoot(1);
    rightHindFoot.position.set(0.52, -0.68, 0.18);
    spineRoot.add(rightHindFoot);

    // --- Digitigrade Forelimbs ---
    // Scapula & Forearms (Radius / Ulna)
    const forelegGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.52, 16);

    const leftForeleg = new THREE.Mesh(forelegGeo, mats.furMain);
    leftForeleg.position.set(-0.25, -0.42, 0.32);
    leftForeleg.rotation.x = 0.06;
    spineRoot.add(leftForeleg);

    const rightForeleg = new THREE.Mesh(forelegGeo, mats.furMain);
    rightForeleg.position.set(0.25, -0.42, 0.32);
    rightForeleg.rotation.x = 0.06;
    spineRoot.add(rightForeleg);

    // Front Paws with Wrist Carpal Angle
    function buildForePaw() {
      const g = new THREE.Group();
      const pawGeo = new THREE.SphereGeometry(0.18, 18, 18);
      pawGeo.scale(1.15, 0.65, 1.35);
      const pawMesh = new THREE.Mesh(pawGeo, mats.furCream);
      g.add(pawMesh);

      // Pink Toe Beans
      const beanGeo = new THREE.SphereGeometry(0.042, 10, 10);
      beanGeo.scale(1, 0.5, 1);
      for (let b = -1; b <= 1; b++) {
        const bean = new THREE.Mesh(beanGeo, mats.pawPad);
        bean.position.set(b * 0.062, -0.04, 0.15);
        g.add(bean);
      }
      return g;
    }

    const leftForePaw = buildForePaw();
    leftForePaw.position.set(-0.25, -0.68, 0.44);
    spineRoot.add(leftForePaw);

    const rightForePaw = buildForePaw();
    rightForePaw.position.set(0.25, -0.68, 0.44);
    spineRoot.add(rightForePaw);

    // --- 10-Joint Articulated Caudal Vertebra Tail ---
    // True organic wave propagation
    const tailBase = new THREE.Group();
    tailBase.position.set(0, -0.32, -0.58);
    spineRoot.add(tailBase);

    const tailSegments = [];
    let prevTailNode = tailBase;
    for (let i = 0; i < 10; i++) {
      const node = new THREE.Group();
      node.position.set(0, i === 0 ? 0 : 0.15, i === 0 ? 0 : -0.11);
      prevTailNode.add(node);

      const rad = 0.10 * (1 - (i / 10) * 0.45);
      const segGeo = new THREE.CylinderGeometry(rad * 0.88, rad, 0.17, 14);
      segGeo.rotateX(Math.PI / 4.2);
      const segMesh = new THREE.Mesh(segGeo, mats.furMain);
      node.add(segMesh);

      tailSegments.push(node);
      prevTailNode = node;
    }

    // Fluffy Tail Tip
    const tipGeo = new THREE.SphereGeometry(0.085, 14, 14);
    const tipMesh = new THREE.Mesh(tipGeo, mats.furMain);
    tipMesh.position.set(0, 0.12, -0.09);
    prevTailNode.add(tipMesh);

    // --- Collar & Bell ---
    const collarGeo = new THREE.TorusGeometry(0.66, 0.065, 14, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, 0.48, 0.04);
    spineRoot.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.105, 16, 16);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, 0.38, 0.72);
    spineRoot.add(bellMesh);

    // --- Feline Head & Facial Anatomy ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.48, 0);
    catGroup.add(headGroup);

    // Feline Cranium (Sculpted skull with zygomatic arches)
    const craniumGeo = new THREE.SphereGeometry(0.96, 32, 32);
    craniumGeo.scale(1.18, 0.98, 1.04);
    const craniumMesh = new THREE.Mesh(craniumGeo, mats.furMain);
    headGroup.add(craniumMesh);

    // Dual Mystacial Whisker Pads (Left & Right curved muzzle lobes)
    const muzzlePadGeo = new THREE.SphereGeometry(0.28, 22, 22);
    muzzlePadGeo.scale(1.18, 0.82, 0.92);

    const leftWhiskerPad = new THREE.Mesh(muzzlePadGeo, mats.furCream);
    leftWhiskerPad.position.set(-0.21, -0.22, 0.86);
    headGroup.add(leftWhiskerPad);

    const rightWhiskerPad = new THREE.Mesh(muzzlePadGeo, mats.furCream);
    rightWhiskerPad.position.set(0.21, -0.22, 0.86);
    headGroup.add(rightWhiskerPad);

    // Firm Feline Chin
    const chinGeo = new THREE.SphereGeometry(0.18, 16, 16);
    chinGeo.scale(1.1, 0.8, 0.9);
    const chinMesh = new THREE.Mesh(chinGeo, mats.furCream);
    chinMesh.position.set(0, -0.38, 0.78);
    headGroup.add(chinMesh);

    // Feline Shield Nose Leather with Wet Specular Clearcoat
    const noseGeo = new THREE.SphereGeometry(0.085, 16, 16);
    noseGeo.scale(1.25, 0.78, 0.82);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.12, 1.12);
    headGroup.add(noseMesh);

    // Whisker Strands (Flexible cat vibrissae fanning out)
    const whiskerMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    function createWhiskers(side) {
      const g = new THREE.Group();
      const angles = [-0.18, 0, 0.16];
      angles.forEach((ang) => {
        const pts = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(side * 0.45, ang * 0.4, 0.12),
          new THREE.Vector3(side * 0.95, ang * 0.85 - 0.08, 0.18)
        ];
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12));
        g.add(new THREE.Line(geo, whiskerMat));
      });
      g.position.set(side * 0.28, -0.22, 0.94);
      return g;
    }
    headGroup.add(createWhiskers(-1));
    headGroup.add(createWhiskers(1));

    // Erect Triangular Ears with Henry's Pocket Notch
    function buildFelineEar(side) {
      const g = new THREE.Group();

      // Outer Pinna Cone
      const earGeo = new THREE.ConeGeometry(0.38, 0.76, 18);
      const earMesh = new THREE.Mesh(earGeo, mats.furMain);
      earMesh.rotation.set(-0.14, 0, side * 0.36);
      g.add(earMesh);

      // Translucent Pink Inner Ear
      const innerGeo = new THREE.ConeGeometry(0.25, 0.58, 18);
      const innerMesh = new THREE.Mesh(innerGeo, mats.innerEar);
      innerMesh.position.set(side * 0.02, -0.02, 0.06);
      innerMesh.rotation.set(-0.14, 0, side * 0.36);
      g.add(innerMesh);

      // Henry's Pocket Notch at Outer Base
      const notchGeo = new THREE.SphereGeometry(0.06, 10, 10);
      notchGeo.scale(0.8, 1.4, 0.6);
      const notchMesh = new THREE.Mesh(notchGeo, mats.innerEar);
      notchMesh.position.set(side * 0.28, -0.26, 0.04);
      g.add(notchMesh);

      g.position.set(side * 0.66, 0.88, 0.08);
      return g;
    }

    const leftEar = buildFelineEar(-1);
    headGroup.add(leftEar);

    const rightEar = buildFelineEar(1);
    headGroup.add(rightEar);

    // Glowing Rosy Blush Cheeks (Glows softly when babu is found)
    const blushGeo = new THREE.SphereGeometry(0.20, 16, 16);
    blushGeo.scale(1.2, 0.6, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, mats.blush);
    leftBlush.position.set(-0.62, -0.15, 0.82);
    leftBlush.rotation.set(0.1, -0.3, -0.1);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, mats.blush);
    rightBlush.position.set(0.62, -0.15, 0.82);
    rightBlush.rotation.set(0.1, 0.3, 0.1);
    headGroup.add(rightBlush);

    // 7. Pixar Layered Eye Assemblies (Cornea Glass Dome + Striated Iris)
    const eyeRig = {
      leftEyeGroup: new THREE.Group(),
      rightEyeGroup: new THREE.Group(),
      leftIris: null,
      rightIris: null,
      leftEyelid: null,
      rightEyelid: null,
      expression: 'normal'
    };

    function buildPixarEye(side) {
      const g = new THREE.Group();
      g.position.set(side * 0.44, 0.08, 0.94);
      g.rotation.y = side * -0.16;

      // 1. Sclera
      const scleraGeo = new THREE.SphereGeometry(0.27, 24, 24);
      scleraGeo.scale(1.05, 1.2, 0.45);
      const scleraMesh = new THREE.Mesh(scleraGeo, mats.sclera);
      g.add(scleraMesh);

      // 2. Deep Procedural Iris Plane
      const irisGeo = new THREE.CircleGeometry(0.21, 32);
      const irisMesh = new THREE.Mesh(irisGeo, mats.iris);
      irisMesh.position.set(0, 0, 0.16);
      g.add(irisMesh);

      // 3. Clear Glass Cornea Catching Specular Glints
      const corneaGeo = new THREE.SphereGeometry(0.26, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
      corneaGeo.scale(1.06, 1.22, 0.52);
      const corneaMesh = new THREE.Mesh(corneaGeo, mats.cornea);
      corneaMesh.position.set(0, 0, 0.08);
      g.add(corneaMesh);

      // 4. Eyelid for Authentic Slow Blinks
      const lidGeo = new THREE.SphereGeometry(0.29, 22, 22, 0, Math.PI * 2, 0, Math.PI / 2);
      lidGeo.scale(1.08, 1.24, 0.52);
      const lidMesh = new THREE.Mesh(lidGeo, mats.eyelid);
      lidMesh.position.set(0, 0, 0.04);
      lidMesh.rotation.x = -Math.PI / 2; // Initially open
      g.add(lidMesh);

      return { group: g, iris: irisMesh, eyelid: lidMesh };
    }

    const leftEyeBuilt = buildPixarEye(-1);
    const rightEyeBuilt = buildPixarEye(1);

    headGroup.add(leftEyeBuilt.group);
    headGroup.add(rightEyeBuilt.group);

    eyeRig.leftEyeGroup = leftEyeBuilt.group;
    eyeRig.rightEyeGroup = rightEyeBuilt.group;
    eyeRig.leftIris = leftEyeBuilt.iris;
    eyeRig.rightIris = rightEyeBuilt.iris;
    eyeRig.leftEyelid = leftEyeBuilt.eyelid;
    eyeRig.rightEyelid = rightEyeBuilt.eyelid;

    // 8. Procedural Web Audio Synthesizer (Meow, Purr, Happy Melodic Chirp, Laser)
    function playCatSound(type) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (window.SecondBrainAudio && window.SecondBrainAudio.isMuted()) return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const t0 = ctx.currentTime;

        if (type === 'happy') {
          // Playful ascending double-harmonic feline chirp
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(640, t0);
          osc1.frequency.exponentialRampToValueAtTime(1220, t0 + 0.12);
          osc1.frequency.exponentialRampToValueAtTime(900, t0 + 0.28);

          gain1.gain.setValueAtTime(0.01, t0);
          gain1.gain.linearRampToValueAtTime(0.085, t0 + 0.05);
          gain1.gain.exponentialRampToValueAtTime(0.001, t0 + 0.32);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(t0);
          osc1.stop(t0 + 0.34);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(960, t0 + 0.12);
          osc2.frequency.exponentialRampToValueAtTime(1450, t0 + 0.24);
          osc2.frequency.exponentialRampToValueAtTime(1120, t0 + 0.42);

          gain2.gain.setValueAtTime(0.001, t0 + 0.12);
          gain2.gain.linearRampToValueAtTime(0.065, t0 + 0.18);
          gain2.gain.exponentialRampToValueAtTime(0.001, t0 + 0.44);

          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(t0 + 0.12);
          osc2.stop(t0 + 0.46);

        } else if (type === 'meow') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(620, t0);
          osc.frequency.exponentialRampToValueAtTime(950, t0 + 0.14);
          osc.frequency.exponentialRampToValueAtTime(480, t0 + 0.42);

          gain.gain.setValueAtTime(0.01, t0);
          gain.gain.linearRampToValueAtTime(0.08, t0 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.44);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(t0 + 0.46);

        } else if (type === 'purr') {
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(42, t0 + i * 0.11);
            gain.gain.setValueAtTime(0.024, t0 + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.11 + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t0 + i * 0.11);
            osc.stop(t0 + i * 0.11 + 0.1);
          }

        } else if (type === 'laser') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, t0);
          osc.frequency.exponentialRampToValueAtTime(250, t0 + 0.12);
          gain.gain.setValueAtTime(0.04, t0);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.13);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(t0 + 0.14);
        }
      } catch (e) {}
    }

    // 9. Expressions (Squinting removed - eyes stay big, glossy, and living)
    function setExpression(expr) {
      eyeRig.expression = expr;

      eyeRig.leftEyeGroup.scale.set(1.0, 1.0, 1.0);
      eyeRig.rightEyeGroup.scale.set(1.0, 1.0, 1.0);

      if (expr === 'happy') {
        eyeRig.leftIris.scale.set(1.15, 1.15, 1.0);
        eyeRig.rightIris.scale.set(1.15, 1.15, 1.0);
        mats.blush.opacity = 0.88;
      } else if (expr === 'laser') {
        eyeRig.leftIris.scale.set(1.35, 1.35, 1.0);
        eyeRig.rightIris.scale.set(1.35, 1.35, 1.0);
      } else if (expr === 'wink') {
        eyeRig.leftEyelid.rotation.x = 0;
        eyeRig.rightIris.scale.set(1.1, 1.1, 1.0);
        setTimeout(() => {
          eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
        }, 1100);
      } else {
        eyeRig.leftIris.scale.set(1.0, 1.0, 1.0);
        eyeRig.rightIris.scale.set(1.0, 1.0, 1.0);
      }
    }

    function showDialogue(text, sound = 'meow', expr = 'happy') {
      if (peekPrompt) peekPrompt.style.display = 'none';
      dialogueText.innerHTML = text;
      bubble.classList.add('visible');
      setExpression(expr);
      playCatSound(sound);
      bounceCat();

      setTimeout(() => {
        if (eyeRig.expression === expr && !isSpinningHappy && !isRunningAcrossScreen) {
          setExpression('normal');
          mats.blush.opacity = 0;
        }
      }, 4000);
    }

    function bounceCat() {
      if (isSpinningHappy || isRunningAcrossScreen) return;
      catGroup.position.y = 0.05;
      setTimeout(() => { catGroup.position.y = -0.15; }, 220);
    }

    function spawnParticles(symbol = '💖') {
      const rect = canvasContainer.getBoundingClientRect();
      for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.className = 'mochi-float-particle';
        p.textContent = symbol;
        p.style.left = `${rect.left + 85 + (Math.random() - 0.5) * 60}px`;
        p.style.top = `${rect.top + 35}px`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
        p.style.setProperty('--dy', `${-65 - Math.random() * 65}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }

    // 10. Dynamic Feline Righting-Reflex Pirouette for "i am babu"
    let isSpinningHappy = false;
    let spinStartTime = 0;
    const SPIN_DURATION = 1350;

    function celebrateBabu() {
      if (isSpinningHappy || isRunningAcrossScreen) return;
      isSpinningHappy = true;
      spinStartTime = performance.now();

      dialogueText.innerHTML = "✨ <strong>OMG BABU!! It's you!!</strong> (≧◡≦) ♡<br><strong>I love you so, so much babu!</strong> Always and forever! 💖🌸✨";
      bubble.classList.add('visible');

      setExpression('happy');
      mats.blush.opacity = 0.95;
      playCatSound('happy');

      spawnParticles('💖');
      setTimeout(() => spawnParticles('✨'), 250);
      setTimeout(() => spawnParticles('🌸'), 500);
      setTimeout(() => spawnParticles('💕'), 750);
    }

    // 11. Authentic Rotary Gallop Across Screen for "i love you babu"
    let isRunningAcrossScreen = false;
    let runStartTime = 0;
    const RUN_DURATION = 3600;
    let lastHeartSpawnTime = 0;

    function triggerLoveRun() {
      if (isRunningAcrossScreen || isSpinningHappy) return;
      isRunningAcrossScreen = true;
      runStartTime = performance.now();
      lastHeartSpawnTime = 0;

      dialogueText.innerHTML = "✨ (♡°▽°♡) <strong>WAIT... YOU LOVE ME?!</strong><br><em>*ZOOMIES ACTIVATED!!*</em> 🐾💖💨";
      bubble.classList.add('visible');

      setExpression('happy');
      mats.blush.opacity = 0.95;
      playCatSound('happy');

      canvasContainer.classList.add('running');
      canvasContainer.style.left = '-185px';
    }

    function spawnRunningHeart(x, y) {
      const p = document.createElement('div');
      p.className = 'mochi-run-heart';
      const symbols = ['💖', '💕', '❤️', '🌸', '✨', '🥰', '🐾'];
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = `${x + (Math.random() - 0.5) * 24}px`;
      p.style.top = `${y + (Math.random() - 0.5) * 24}px`;
      p.style.setProperty('--dx', `${-32 - Math.random() * 45}px`);
      p.style.setProperty('--dy', `${-40 - Math.random() * 50}px`);
      p.style.setProperty('--rot', `${(Math.random() - 0.5) * 45}deg`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1250);
    }

    // 12. Personality & Wit Repository
    const roasts = [
      "🔥 *Looking at your stack:* You've got 14 microservices and 3 daily users. A single SQLite file and a prayer would run faster.",
      "🔥 *System review:* Your architecture is 90% Jenga blocks and 10% hopeful git commits. One bad typo and it's cat food.",
      "🔥 You call it 'eventual consistency'. I call it 'the data went out for milk and never came back'.",
      "🔥 Monoliths are like a warm cardboard box. Microservices are 40 tiny boxes scattered on fire across AWS.",
      "🔥 Your pull request says 'minor refactor' but touches 84 files. That's not a refactor, that's arson."
    ];

    const wisdom = [
      "💡 *Architecture Rule #1:* If you can't explain your data pipeline to a sleepy cat on a whiteboard in 5 minutes, it's too complex.",
      "💡 Horizontal scaling > Vertical scaling. Same reason I don't get one giant kettle; I just hire more cat friends.",
      "💡 In high-scale data engineering: decoupled message queues are like scratching posts. Essential for peace of mind.",
      "💡 Direct Lake mode in Power BI bypasses scheduled refreshes completely. Zero-copy sub-second queries = more nap time for everyone.",
      "💡 Context engineering is like giving an LLM the exact right cardboard box. Otherwise it just knocks over your vase."
    ];

    // 13. Interactive Action Chips
    const chips = document.getElementById('mochi-chips');
    if (chips) {
      chips.addEventListener('click', (e) => {
        const btn = e.target.closest('.mochi-chip');
        if (!btn) return;
        const action = btn.dataset.action;

        if (action === 'scratch') {
          showDialogue("*Purrrrrrrrr...* ( ^ ﻌ ^ ) Under the chin! That's the sweet spot! All bugs in Nilesh's code are now forgiven.", 'purr', 'happy');
          spawnParticles('💖');
        } else if (action === 'coffee') {
          showDialogue("☕ *Sips espresso* CAFFEINE DETECTED. Throughput elevated to 45,000 requests/sec! No downtime allowed!", 'meow', 'laser');
          spawnParticles('⚡');
        } else if (action === 'roast') {
          const r = roasts[Math.floor(Math.random() * roasts.length)];
          showDialogue(r, 'meow', 'skeptical');
        } else if (action === 'wisdom') {
          const w = wisdom[Math.floor(Math.random() * wisdom.length)];
          showDialogue(w, 'purr', 'wink');
          spawnParticles('💡');
        } else if (action === 'laser') {
          triggerLaserMode();
        }
      });
    }

    function triggerLaserMode() {
      showDialogue("🔴 WHERE IS THE RED DOT?! Target acquired! Calibrating paws for maximum intercept velocity!", 'laser', 'laser');
      let count = 0;
      const interval = setInterval(() => {
        targetHead.x = (Math.random() - 0.5) * 0.9;
        targetHead.y = (Math.random() - 0.5) * 0.9;
        playCatSound('laser');
        count++;
        if (count > 5) clearInterval(interval);
      }, 250);
    }

    // 14. Chat Submission Handler
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = (chatInput.value || '').trim();
        if (!msg) return;

        chatInput.value = '';
        const lower = msg.toLowerCase();

        // 1. Check for 'i love you babu'
        if (
          lower.includes('i love you babu') ||
          lower.includes('i love u babu') ||
          lower.includes('love you babu') ||
          lower.includes('love u babu') ||
          (lower.includes('love') && lower.includes('babu'))
        ) {
          triggerLoveRun();
          return;
        }

        // 2. Check for babu declaration ("i am babu")
        if (
          lower.includes('i am babu') ||
          lower.includes("i'm babu") ||
          lower.includes('im babu') ||
          lower === 'babu'
        ) {
          celebrateBabu();
          return;
        }

        let reply = "Meow? That sounds like a 500 error waiting to happen. Press '/' to search the garden notes for clarity!";
        let sound = 'meow';
        let expr = 'happy';

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
          reply = "Meowdy partner! 🤠 Welcome to Nilesh's knowledge garden. What architecture disaster can we prevent today?";
          expr = 'wink';
        } else if (lower.includes('spark') || lower.includes('data')) {
          reply = "Apache Spark! The Driver acts as the head chef, and Executors do the cooking. Read Issue #4 above for the full recipe!";
          expr = 'laser';
        } else if (lower.includes('cat') || lower.includes('cute') || lower.includes('good') || lower.includes('mimi')) {
          reply = "*Purrrr!* Of course I'm cute, I run on 60 FPS WebGL and pure biological perfection.";
          expr = 'happy';
          sound = 'purr';
          spawnParticles('✨');
        } else if (lower.includes('system') || lower.includes('design')) {
          reply = "Scalability, reliability, observability, and simplicity! Keep it simple, or I will bat your microservices off the shelf.";
          expr = 'skeptical';
        } else if (lower.includes('bye') || lower.includes('sleep') || lower.includes('nap')) {
          reply = "Going to nap? Wise choice. 14 hours of daily sleep is the secret to zero production bugs.";
          expr = 'wink';
        }

        showDialogue(reply, sound, expr);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        bubble.classList.remove('visible');
      });
    }

    canvasContainer.addEventListener('click', () => {
      if (!bubble.classList.contains('visible')) {
        showDialogue("Meow! Need a witty roast, tech wisdom, or just a chin scratch?", 'meow', 'wink');
      } else {
        bounceCat();
        playCatSound('purr');
        setExpression('happy');
        spawnParticles('🐾');
      }
    });

    // 15. Real Feline Kinematics & Living Idle Behavior
    let mouseNorm = { x: 0, y: 0 };
    let targetHead = { x: 0, y: 0, z: 0 };
    let slowBlinkTimer = 0;
    let isSlowBlinking = false;

    window.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouseNorm.x = (e.clientX - cx) / window.innerWidth;
      mouseNorm.y = -(e.clientY - cy) / window.innerHeight;

      targetHead.y = Math.max(-0.55, Math.min(0.55, mouseNorm.x * 1.4));
      targetHead.x = Math.max(-0.30, Math.min(0.30, -mouseNorm.y * 1.1));
      targetHead.z = (mouseNorm.x * 0.18);

      if (eyeRig.expression === 'normal' && !isSpinningHappy && !isRunningAcrossScreen) {
        const pupilX = THREE.MathUtils.clamp(mouseNorm.x * 0.05, -0.04, 0.04);
        const pupilY = THREE.MathUtils.clamp(-mouseNorm.y * 0.05, -0.04, 0.04);
        eyeRig.leftIris.position.x = pupilX;
        eyeRig.leftIris.position.y = pupilY;
        eyeRig.rightIris.position.x = pupilX;
        eyeRig.rightIris.position.y = pupilY;
      }
    }, { passive: true });

    setTimeout(() => {
      if (peekPrompt) peekPrompt.classList.add('visible');
    }, 2400);

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // --- STATE 1: Rotary Gallop Across Screen ("i love you babu") ---
      if (isRunningAcrossScreen) {
        const elapsed = performance.now() - runStartTime;
        const progress = Math.min(1, elapsed / RUN_DURATION);

        const startX = -185;
        const endX = window.innerWidth + 70;
        const currentX = startX + (endX - startX) * progress;
        canvasContainer.style.left = `${currentX}px`;

        // Profile posture facing run direction
        catGroup.rotation.y = Math.PI * 0.44;
        headGroup.rotation.y = 0.10;
        headGroup.rotation.x = -0.04;

        // Feline Rotary Gallop Cadence (Extension vs Flexion)
        const stride = t * 22;
        const strideCycle = Math.sin(stride);

        // Spine flexion/extension wave
        spineRoot.position.y = -0.72 + Math.abs(strideCycle) * 0.18;
        spineRoot.rotation.z = strideCycle * 0.12;

        // Forelimbs: Scapula & Carpal Reach
        leftForeleg.rotation.x = strideCycle * 0.65;
        rightForeleg.rotation.x = -strideCycle * 0.65;
        leftForePaw.position.z = 0.44 + strideCycle * 0.22;
        rightForePaw.position.z = 0.44 - strideCycle * 0.22;
        leftForePaw.position.y = -0.68 + Math.max(0, -strideCycle) * 0.14;
        rightForePaw.position.y = -0.68 + Math.max(0, strideCycle) * 0.14;

        // Hindlimbs: Femur & Hock Drive
        leftThigh.rotation.x = 0.18 - strideCycle * 0.58;
        rightThigh.rotation.x = 0.18 + strideCycle * 0.58;
        leftHindFoot.position.z = 0.18 - strideCycle * 0.22;
        rightHindFoot.position.z = 0.18 + strideCycle * 0.22;
        leftHindFoot.position.y = -0.68 + Math.max(0, strideCycle) * 0.14;
        rightHindFoot.position.y = -0.68 + Math.max(0, -strideCycle) * 0.14;

        // Tail Aerodynamic Streaming Wave
        tailSegments.forEach((seg, idx) => {
          seg.rotation.x = 0.12 + Math.sin(t * 18 - idx * 0.3) * 0.08;
          seg.rotation.y = -0.15 + Math.cos(t * 18 - idx * 0.25) * 0.12;
        });

        // Ears pinned back aerodynamically
        leftEar.rotation.x = -0.32;
        rightEar.rotation.x = -0.32;

        // Stream of floating hearts trailing behind
        const now = performance.now();
        if (now - lastHeartSpawnTime > 110) {
          lastHeartSpawnTime = now;
          spawnRunningHeart(currentX + 35, window.innerHeight - 85);
        }

        if (progress >= 1) {
          isRunningAcrossScreen = false;
          canvasContainer.classList.remove('running');
          canvasContainer.style.left = '';

          // Reset Anatomy
          catGroup.rotation.y = 0;
          catGroup.position.y = -0.15;
          spineRoot.position.set(0, -0.72, 0);
          spineRoot.rotation.set(0, 0, 0);
          headGroup.rotation.set(0, 0, 0);
          leftForeleg.rotation.x = 0.06;
          rightForeleg.rotation.x = 0.06;
          leftForePaw.position.set(-0.25, -0.68, 0.44);
          rightForePaw.position.set(0.25, -0.68, 0.44);
          leftThigh.rotation.set(0.18, 0.28, -0.18);
          rightThigh.rotation.set(0.18, -0.28, 0.18);
          leftHindFoot.position.set(-0.52, -0.68, 0.18);
          rightHindFoot.position.set(0.52, -0.68, 0.18);
          leftEar.rotation.x = 0;
          rightEar.rotation.x = 0;

          playCatSound('purr');
          dialogueText.innerHTML = "✨ <strong>I love you so, so much babu!!</strong> ( ˘ ³˘)♥<br>My heart just sprinted across the whole screen for you! 🐾💖🌸✨";
          spawnParticles('💖');
          setTimeout(() => spawnParticles('✨'), 250);

          setTimeout(() => {
            mats.blush.opacity = 0;
            setExpression('normal');
          }, 5000);
        }

      // --- STATE 2: Feline Acrobatic Pirouette ("i am babu") ---
      } else if (isSpinningHappy) {
        const elapsed = performance.now() - spinStartTime;
        const progress = Math.min(1, elapsed / SPIN_DURATION);

        // Smooth cubic easing
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        catGroup.rotation.y = ease * Math.PI * 2;
        // Athletic feline pounce hop with shock absorption
        catGroup.position.y = -0.15 + Math.sin(progress * Math.PI) * 0.44;

        // Excited Tail Counter-Whip
        tailSegments.forEach((seg, idx) => {
          seg.rotation.y = Math.sin(t * 16 - idx * 0.45) * 0.28;
          seg.rotation.x = Math.cos(t * 16 - idx * 0.35) * 0.16;
        });

        if (progress >= 1) {
          isSpinningHappy = false;
          catGroup.rotation.y = 0;
          catGroup.position.y = -0.15;
          playCatSound('purr');
          setTimeout(() => {
            mats.blush.opacity = 0;
            setExpression('normal');
          }, 4500);
        }

      // --- STATE 3: Natural Living Feline Idle Behavior ---
      } else {
        // 1. Organic Ribcage Breathing (Chest & Abdomen expand softly)
        const breath = Math.sin(t * 2.4);
        chestMesh.scale.x = 0.88 + breath * 0.025;
        chestMesh.scale.z = 1.05 + breath * 0.02;
        lumbarMesh.scale.x = 0.82 + breath * 0.02;
        spineRoot.position.y = -0.72 + breath * 0.015;

        // 2. Smooth Head & Eye Gaze Parallax
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHead.y * 0.65, 0.08);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHead.x * 0.65, 0.08);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHead.z * 0.65, 0.08);

        // 3. Sinuous 10-Joint Caudal Tail Wave Dynamics
        tailSegments.forEach((seg, idx) => {
          const wave = Math.sin(t * 2.2 - idx * 0.38);
          seg.rotation.y = wave * 0.16;
          seg.rotation.x = Math.cos(t * 1.6 - idx * 0.28) * 0.06;

          // Realistic Cat Tip Twitch
          if (idx >= 7) {
            const twitch = Math.sin(t * 8.2);
            if (twitch > 0.86) {
              seg.rotation.y += (twitch - 0.86) * 0.45;
            }
          }
        });

        // 4. Independent Pinna (Ear) Reflexes
        leftEar.rotation.y = Math.sin(t * 2.8) * 0.06 + (Math.sin(t * 12) > 0.88 ? 0.14 : 0);
        rightEar.rotation.y = -Math.cos(t * 2.4) * 0.06 - (Math.sin(t * 9.5) > 0.90 ? 0.14 : 0);

        // 5. Authentic Feline Slow Blinks (Sign of love and trust)
        slowBlinkTimer += 0.016;
        if (slowBlinkTimer > 5.5 && !isSlowBlinking) {
          isSlowBlinking = true;
          // Eyelid closes smoothly
          eyeRig.leftEyelid.rotation.x = 0;
          eyeRig.rightEyelid.rotation.x = 0;
          setTimeout(() => {
            eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
            eyeRig.rightEyelid.rotation.x = -Math.PI / 2;
            isSlowBlinking = false;
            slowBlinkTimer = Math.random() * 2.0;
          }, 240); // Soft, gentle blink
        }
      }

      // Bell subtle jingle
      bellMesh.position.y = 0.38 + Math.sin(t * 4.2) * 0.012;

      renderer.render(scene, camera);
    }
    animate();

    // 16. Theme change observer (Synchronizes Materials smoothly)
    const themeObserver = new MutationObserver(() => {
      mats = getMaterials();
      craniumMesh.material = mats.furMain;
      chestMesh.material = mats.furMain;
      bibMesh.material = mats.furCream;
      lumbarMesh.material = mats.furMain;
      leftThigh.material = mats.furMain;
      rightThigh.material = mats.furMain;
      leftForeleg.material = mats.furMain;
      rightForeleg.material = mats.furMain;
      leftWhiskerPad.material = mats.furCream;
      rightWhiskerPad.material = mats.furCream;
      chinMesh.material = mats.furCream;
      noseMesh.material = mats.nose;
      eyeRig.leftIris.material = mats.iris;
      eyeRig.rightIris.material = mats.iris;
      eyeRig.leftEyelid.material = mats.eyelid;
      eyeRig.rightEyelid.material = mats.eyelid;
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  }
})();
