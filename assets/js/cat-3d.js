/**
 * Second Brain - Mimi the 3D Cyber Familiar & Chief Architecture Officer
 * Cute Peeking & Hiding Desk Companion (Soft Natural Geometry & Theme Harmonized)
 * Powered by Three.js & Web Audio API
 * 
 * Design Features:
 * - Theme-Harmonized Color Palette:
 *   - Light Mode: Elegant, soft warm lilac-cashmere coat (#DED2ED) matching the site's signature
 *     violet accent (#7C3AED) with crisp white bib/paws (#FFFFFF) for perfect silhouette contrast.
 *   - Dark Mode: Deep velvet night-violet (#221F3D) with bioluminescent cyan eyes (#38BDF8).
 * - Soft, Blended & Natural Geometry (Zero Sharp Needle-Edges):
 *   - Smooth rounded feline ears with dome apex tips (no artificial sharp traffic-cone points).
 *   - High-subdivision (48x48) organic cranium with soft zygomatic cheek curvature.
 *   - Wrap-around hemisphere & soft studio lighting producing velvety diffuse micro-fur shading.
 * - Simple Curvy Continuous Long Tail:
 *   - Smooth S-curved Catmull-Rom tube that arches gracefully beside her head with fluid swish physics.
 * - Peeking & Smart Reading Hide:
 *   - Paws and golden bell resting cutely on the bottom screen ledge.
 *   - Gently ducks down below the edge when reading or scrolling so text is never blocked,
 *     and perks right up when the cursor approaches or when hovered/clicked!
 * - Living Expressive Eyes:
 *   - Big kawaii eyes with triple star sparkles, pupil dilation, responsive cursor tracking,
 *     and gentle slow blinks.
 * - Interactive:
 *   - "i am babu": 360-degree joyful pirouette jump with heart bursts.
 *   - "i love you babu": Loving affectionate bounce, purrs, and floating hearts.
 *   - Witty tech roasts, system design wisdom, chin scratch, coffee, laser mode.
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

    // 2. Three.js Scene & Clean Camera Setup
    const width = 145;
    const height = 155;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.40, 5.2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // 3. Soft, Diffuse Studio Lighting (Eliminates Harsh/Sharp Shadow Edges)
    // Wrap-around hemisphere light for soft velvety fur fill
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.95);
    scene.add(hemiLight);

    // Warm key light with softened intensity
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.05);
    keyLight.position.set(2.8, 4.0, 3.2);
    scene.add(keyLight);

    // Soft sky fill
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.75);
    fillLight.position.set(-2.8, 1.8, 2.2);
    scene.add(fillLight);

    // Subtle violet rim light harmonized with the theme accent
    const rimLight = new THREE.PointLight(0xa78bfa, 1.4, 12);
    rimLight.position.set(0, 2.5, -3.0);
    scene.add(rimLight);

    // 4. Materials Palette (Theme-Harmonized & Diffuse Softness)
    function isDarkTheme() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function getMaterials() {
      const isDark = isDarkTheme();

      return {
        // Main coat: In light mode, soft warm lilac-cashmere (#DED2ED) matching site violet #7C3AED
        coatMain: new THREE.MeshStandardMaterial({
          color: isDark ? 0x221f3d : 0xded2ed,
          roughness: 0.65,
          metalness: 0.02
        }),
        // Cream muzzle & paws: Crisp pure white for clear, friendly contrast
        coatCream: new THREE.MeshStandardMaterial({
          color: isDark ? 0x352e5a : 0xffffff,
          roughness: 0.65,
          metalness: 0.0
        }),
        // Soft pastel pink inner ear
        innerEar: new THREE.MeshStandardMaterial({
          color: isDark ? 0xf472b6 : 0xf9a8d4,
          roughness: 0.58
        }),
        // Cute strawberry button nose
        nose: new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.28,
          metalness: 0.08
        }),
        sclera: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        // Living sapphire/sky blue eyes
        iris: new THREE.MeshStandardMaterial({
          color: isDark ? 0x38bdf8 : 0x0284c7,
          roughness: 0.25,
          metalness: 0.08
        }),
        limbalRing: new THREE.MeshBasicMaterial({
          color: isDark ? 0x0c4a6e : 0x075985
        }),
        pupil: new THREE.MeshBasicMaterial({
          color: 0x09090b
        }),
        catchlight: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        eyelid: new THREE.MeshStandardMaterial({
          color: isDark ? 0x221f3d : 0xded2ed,
          roughness: 0.65
        }),
        blush: new THREE.MeshBasicMaterial({
          color: 0xff4d8d,
          transparent: true,
          opacity: 0
        }),
        // Royal violet collar matching theme accent #7C3AED
        collar: new THREE.MeshStandardMaterial({
          color: isDark ? 0x8b5cf6 : 0x7c3aed,
          roughness: 0.35,
          metalness: 0.25
        }),
        // Golden brass bell
        bell: new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          roughness: 0.16,
          metalness: 0.88
        }),
        pawPad: new THREE.MeshStandardMaterial({
          color: 0xf472b6,
          roughness: 0.42
        })
      };
    }

    let mats = getMaterials();

    // 5. Cute Peeking Cat Hierarchy
    const catGroup = new THREE.Group();
    scene.add(catGroup);
    catGroup.position.set(0, -0.65, 0); // Normal peeking baseline

    // --- Head Group ---
    const headGroup = new THREE.Group();
    catGroup.add(headGroup);

    // Chubby Round Head (High 48x48 subdivision for silky smooth, non-sharp silhouette)
    const headGeo = new THREE.SphereGeometry(1.0, 48, 48);
    headGeo.scale(1.16, 1.0, 1.08);
    const headMesh = new THREE.Mesh(headGeo, mats.coatMain);
    headGroup.add(headMesh);

    // Puffy Whisker Pads (Cheeks)
    const whiskerPadGeo = new THREE.SphereGeometry(0.33, 28, 28);
    whiskerPadGeo.scale(1.22, 0.82, 0.88);

    const leftWhiskerPad = new THREE.Mesh(whiskerPadGeo, mats.coatCream);
    leftWhiskerPad.position.set(-0.24, -0.20, 0.86);
    headGroup.add(leftWhiskerPad);

    const rightWhiskerPad = new THREE.Mesh(whiskerPadGeo, mats.coatCream);
    rightWhiskerPad.position.set(0.24, -0.20, 0.86);
    headGroup.add(rightWhiskerPad);

    // Little Rounded Chin
    const chinGeo = new THREE.SphereGeometry(0.19, 20, 20);
    chinGeo.scale(1.1, 0.8, 0.88);
    const chinMesh = new THREE.Mesh(chinGeo, mats.coatCream);
    chinMesh.position.set(0, -0.36, 0.78);
    headGroup.add(chinMesh);

    // Cute Soft Button Nose
    const noseGeo = new THREE.SphereGeometry(0.088, 20, 20);
    noseGeo.scale(1.22, 0.82, 0.85);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.11, 1.15);
    headGroup.add(noseMesh);

    // Fine Delicate Whiskers
    const whiskerMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    function createWhiskers(side) {
      const g = new THREE.Group();
      const angles = [-0.18, 0, 0.16];
      angles.forEach((ang) => {
        const pts = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(side * 0.42, ang * 0.4, 0.12),
          new THREE.Vector3(side * 0.92, ang * 0.8 - 0.08, 0.16)
        ];
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12));
        g.add(new THREE.Line(geo, whiskerMat));
      });
      g.position.set(side * 0.28, -0.20, 0.94);
      return g;
    }
    headGroup.add(createWhiskers(-1));
    headGroup.add(createWhiskers(1));

    // --- Soft, Natural, Curved Feline Ears (NO Sharp Needle Points!) ---
    function buildSoftCurvedEar(side) {
      const g = new THREE.Group();

      // 1. Smooth Ear Root (blends smoothly into skull without sharp seams)
      const baseGeo = new THREE.SphereGeometry(0.32, 24, 24);
      baseGeo.scale(1.1, 0.72, 0.85);
      const baseMesh = new THREE.Mesh(baseGeo, mats.coatMain);
      baseMesh.position.set(0, 0.08, 0);
      g.add(baseMesh);

      // 2. Smooth Tapered Concha Shell (flattened front-to-back like real ears)
      const coneGeo = new THREE.CylinderGeometry(0.13, 0.35, 0.62, 28);
      coneGeo.scale(1.0, 1.0, 0.65);
      const coneMesh = new THREE.Mesh(coneGeo, mats.coatMain);
      coneMesh.position.set(0, 0.36, 0);
      g.add(coneMesh);

      // 3. Soft Rounded Ear Apex Tip (Dome tip removes sharp geometric point)
      const tipGeo = new THREE.SphereGeometry(0.13, 24, 24);
      tipGeo.scale(1.0, 0.85, 0.65);
      const tipMesh = new THREE.Mesh(tipGeo, mats.coatMain);
      tipMesh.position.set(0, 0.66, 0);
      g.add(tipMesh);

      // 4. Soft Recessed Inner Pink Ear
      const innerBaseGeo = new THREE.CylinderGeometry(0.08, 0.25, 0.46, 24);
      innerBaseGeo.scale(1.0, 1.0, 0.55);
      const innerMesh = new THREE.Mesh(innerBaseGeo, mats.innerEar);
      innerMesh.position.set(0, 0.32, 0.08);
      g.add(innerMesh);

      const innerTipGeo = new THREE.SphereGeometry(0.08, 20, 20);
      innerTipGeo.scale(1.0, 0.85, 0.55);
      const innerTipMesh = new THREE.Mesh(innerTipGeo, mats.innerEar);
      innerTipMesh.position.set(0, 0.54, 0.08);
      g.add(innerTipMesh);

      // Organic forward tilt and gentle outward flare
      g.position.set(side * 0.66, 0.76, 0.08);
      g.rotation.set(-0.16, side * -0.06, side * -0.32);
      return g;
    }

    const leftEar = buildSoftCurvedEar(-1);
    headGroup.add(leftEar);

    const rightEar = buildSoftCurvedEar(1);
    headGroup.add(rightEar);

    // Rosy Pink Blush Cheeks
    const blushGeo = new THREE.SphereGeometry(0.22, 20, 20);
    blushGeo.scale(1.2, 0.6, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, mats.blush);
    leftBlush.position.set(-0.64, -0.14, 0.82);
    leftBlush.rotation.set(0.1, -0.3, -0.1);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, mats.blush);
    rightBlush.position.set(0.64, -0.14, 0.82);
    rightBlush.rotation.set(0.1, 0.3, 0.1);
    headGroup.add(rightBlush);

    // 6. Big, Soulful, Living Character Eyes (Clean Non-Flickering Layers)
    const eyeRig = {
      leftEyeGroup: new THREE.Group(),
      rightEyeGroup: new THREE.Group(),
      leftIris: null,
      rightIris: null,
      leftPupil: null,
      rightPupil: null,
      leftEyelid: null,
      rightEyelid: null,
      expression: 'normal'
    };

    function buildExpressiveEye(side) {
      const g = new THREE.Group();
      g.position.set(side * 0.44, 0.08, 0.94);
      g.rotation.y = side * -0.18;

      // Sclera
      const scleraGeo = new THREE.SphereGeometry(0.27, 28, 28);
      scleraGeo.scale(1.05, 1.25, 0.52);
      const scleraMesh = new THREE.Mesh(scleraGeo, mats.sclera);
      g.add(scleraMesh);

      // Limbal Ring (Frames the Iris)
      const limbalGeo = new THREE.SphereGeometry(0.22, 24, 24);
      limbalGeo.scale(1.02, 1.18, 0.35);
      const limbalMesh = new THREE.Mesh(limbalGeo, mats.limbalRing);
      limbalMesh.position.set(0, 0, 0.09);
      g.add(limbalMesh);

      // Vibrant Iris
      const irisGeo = new THREE.SphereGeometry(0.20, 24, 24);
      irisGeo.scale(1.0, 1.15, 0.35);
      const irisMesh = new THREE.Mesh(irisGeo, mats.iris);
      irisMesh.position.set(0, 0, 0.11);
      g.add(irisMesh);

      // Pupil
      const pupilGeo = new THREE.SphereGeometry(0.135, 20, 20);
      pupilGeo.scale(0.95, 1.15, 0.28);
      const pupilMesh = new THREE.Mesh(pupilGeo, mats.pupil);
      pupilMesh.position.set(0, 0, 0.15);
      g.add(pupilMesh);

      // Triple Sparkle Catchlights
      const star1Geo = new THREE.SphereGeometry(0.055, 14, 14);
      const star1 = new THREE.Mesh(star1Geo, mats.catchlight);
      star1.position.set(-0.052, 0.072, 0.21);
      g.add(star1);

      const star2Geo = new THREE.SphereGeometry(0.028, 12, 12);
      const star2 = new THREE.Mesh(star2Geo, mats.catchlight);
      star2.position.set(0.045, -0.045, 0.21);
      g.add(star2);

      const star3Geo = new THREE.SphereGeometry(0.016, 10, 10);
      const star3 = new THREE.Mesh(star3Geo, mats.catchlight);
      star3.position.set(-0.026, -0.065, 0.21);
      g.add(star3);

      // Eyelid for gentle blinks (Radius 0.31 eliminates Z-fighting with sclera 0.27)
      const lidGeo = new THREE.SphereGeometry(0.31, 28, 28, 0, Math.PI * 2, 0, Math.PI / 2);
      lidGeo.scale(1.06, 1.25, 0.54);
      const lidMesh = new THREE.Mesh(lidGeo, mats.eyelid);
      lidMesh.position.set(0, 0, 0.02);
      lidMesh.rotation.x = -Math.PI / 2; // Open by default
      g.add(lidMesh);

      return { group: g, iris: irisMesh, pupil: pupilMesh, eyelid: lidMesh };
    }

    const leftEyeBuilt = buildExpressiveEye(-1);
    const rightEyeBuilt = buildExpressiveEye(1);

    headGroup.add(leftEyeBuilt.group);
    headGroup.add(rightEyeBuilt.group);

    eyeRig.leftEyeGroup = leftEyeBuilt.group;
    eyeRig.rightEyeGroup = rightEyeBuilt.group;
    eyeRig.leftIris = leftEyeBuilt.iris;
    eyeRig.rightIris = rightEyeBuilt.iris;
    eyeRig.leftPupil = leftEyeBuilt.pupil;
    eyeRig.rightPupil = rightEyeBuilt.pupil;
    eyeRig.leftEyelid = leftEyeBuilt.eyelid;
    eyeRig.rightEyelid = rightEyeBuilt.eyelid;

    // --- Soft Paws Resting on the Bottom Screen Ledge ---
    function buildPeekingPaw(side) {
      const g = new THREE.Group();
      const pawGeo = new THREE.SphereGeometry(0.24, 24, 24);
      pawGeo.scale(1.15, 0.70, 1.40);
      const pawMesh = new THREE.Mesh(pawGeo, mats.coatCream);
      g.add(pawMesh);

      // Soft Pink Toe Beans
      const beanGeo = new THREE.SphereGeometry(0.046, 12, 12);
      beanGeo.scale(1, 0.5, 1);
      for (let b = -1; b <= 1; b++) {
        const bean = new THREE.Mesh(beanGeo, mats.pawPad);
        bean.position.set(b * 0.075, 0.09, 0.22);
        g.add(bean);
      }
      g.position.set(side * 0.56, -0.98, 0.82);
      return g;
    }

    const leftPaw = buildPeekingPaw(-1);
    catGroup.add(leftPaw);

    const rightPaw = buildPeekingPaw(1);
    catGroup.add(rightPaw);

    // Collar & Golden Jingle Bell Resting on Ledge
    const collarGeo = new THREE.TorusGeometry(0.85, 0.075, 16, 36);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.86, 0.05);
    catGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.125, 20, 20);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.92, 0.94);
    catGroup.add(bellMesh);

    // --- Simple Curvy Continuous Long Tail (Smooth S-Curve) ---
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0.50, -0.85, -0.22);
    catGroup.add(tailGroup);

    const tailCurvePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.35, 0.38, -0.15),
      new THREE.Vector3(0.58, 0.92, 0.05),
      new THREE.Vector3(0.44, 1.48, 0.18),
      new THREE.Vector3(0.22, 1.76, 0.22)
    ];
    const tailCurve = new THREE.CatmullRomCurve3(tailCurvePoints);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 48, 0.086, 18, false);
    const tailMesh = new THREE.Mesh(tailGeo, mats.coatMain);
    tailGroup.add(tailMesh);

    // Soft Round Tail Tip
    const tailTipGeo = new THREE.SphereGeometry(0.086, 20, 20);
    const tailTipMesh = new THREE.Mesh(tailTipGeo, mats.coatMain);
    tailTipMesh.position.copy(tailCurvePoints[tailCurvePoints.length - 1]);
    tailGroup.add(tailTipMesh);

    // 7. Procedural Web Audio Synthesizer
    function playCatSound(type) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (window.SecondBrainAudio && window.SecondBrainAudio.isMuted()) return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const t0 = ctx.currentTime;

        if (type === 'happy') {
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

    // 8. Expressive Eye Control (Big, Glossy, Non-Squinting)
    function setExpression(expr) {
      eyeRig.expression = expr;

      eyeRig.leftEyeGroup.scale.set(1.0, 1.0, 1.0);
      eyeRig.rightEyeGroup.scale.set(1.0, 1.0, 1.0);

      if (expr === 'happy') {
        eyeRig.leftPupil.scale.set(1.18, 1.18, 1.0);
        eyeRig.rightPupil.scale.set(1.18, 1.18, 1.0);
        mats.blush.opacity = 0.90;
      } else if (expr === 'laser') {
        eyeRig.leftPupil.scale.set(1.4, 1.4, 1.0);
        eyeRig.rightPupil.scale.set(1.4, 1.4, 1.0);
      } else if (expr === 'wink') {
        eyeRig.leftEyelid.rotation.x = 0;
        eyeRig.rightPupil.scale.set(1.1, 1.1, 1.0);
        setTimeout(() => {
          eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
        }, 1100);
      } else {
        eyeRig.leftPupil.scale.set(1.0, 1.0, 1.0);
        eyeRig.rightPupil.scale.set(1.0, 1.0, 1.0);
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
        if (eyeRig.expression === expr && !isSpinningHappy) {
          setExpression('normal');
          mats.blush.opacity = 0;
        }
      }, 4000);
    }

    function bounceCat() {
      if (isSpinningHappy) return;
      catGroup.position.y = -0.42;
      setTimeout(() => { catGroup.position.y = currentTargetY; }, 240);
    }

    function spawnParticles(symbol = '💖') {
      const rect = canvasContainer.getBoundingClientRect();
      for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.className = 'mochi-float-particle';
        p.textContent = symbol;
        p.style.left = `${rect.left + 72 + (Math.random() - 0.5) * 55}px`;
        p.style.top = `${rect.top + 25}px`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        p.style.setProperty('--dy', `${-65 - Math.random() * 55}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }

    // 9. Joyful 360-Degree Pirouette for "i am babu"
    let isSpinningHappy = false;
    let spinStartTime = 0;
    const SPIN_DURATION = 1350;

    function celebrateBabu() {
      if (isSpinningHappy) return;
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

    // 10. Loving Affectionate Response for "i love you babu"
    function celebrateLove() {
      dialogueText.innerHTML = "✨ <strong>I love you so, so much babu!!</strong> ( ˘ ³˘)♥<br>You are my favorite human in the whole universe! 🐾💖🌸✨";
      bubble.classList.add('visible');

      setExpression('happy');
      mats.blush.opacity = 0.95;
      playCatSound('happy');
      bounceCat();

      spawnParticles('💖');
      setTimeout(() => spawnParticles('💕'), 250);
      setTimeout(() => spawnParticles('🌸'), 500);
      setTimeout(() => spawnParticles('✨'), 750);
    }

    // 11. Tech Roasts & Wisdom
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

    // 12. Interactive Action Chips
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

    // 13. Chat Submission Handler
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = (chatInput.value || '').trim();
        if (!msg) return;

        chatInput.value = '';
        const lower = msg.toLowerCase();

        // Check for 'i love you babu'
        if (
          lower.includes('i love you babu') ||
          lower.includes('i love u babu') ||
          lower.includes('love you babu') ||
          lower.includes('love u babu') ||
          (lower.includes('love') && lower.includes('babu'))
        ) {
          celebrateLove();
          return;
        }

        // Check for babu declaration ("i am babu")
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

    // 14. Peeking, Hiding & Living Kinematics
    let mouseNorm = { x: 0, y: 0 };
    let targetHead = { x: 0, y: 0, z: 0 };
    let slowBlinkTimer = 0;
    let isSlowBlinking = false;
    let lastInteractionTime = performance.now();
    let currentTargetY = -0.65; // Normal peeking position

    // Hover listeners to perk up or duck down
    canvasContainer.addEventListener('mouseenter', () => {
      lastInteractionTime = performance.now();
      currentTargetY = -0.52; // Perk up with interest!
    });

    canvasContainer.addEventListener('mouseleave', () => {
      lastInteractionTime = performance.now();
      currentTargetY = -0.65; // Back to normal peeking
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouseNorm.x = (e.clientX - cx) / window.innerWidth;
      mouseNorm.y = -(e.clientY - cy) / window.innerHeight;

      // If user moves mouse near Mimi's corner, perk up!
      const distFromCat = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (distFromCat < 320) {
        lastInteractionTime = performance.now();
        currentTargetY = -0.58;
      }

      targetHead.y = Math.max(-0.6, Math.min(0.6, mouseNorm.x * 1.5));
      targetHead.x = Math.max(-0.35, Math.min(0.35, -mouseNorm.y * 1.2));
      targetHead.z = (mouseNorm.x * 0.18);

      // Pupil gaze tracking within large expressive eyes
      if (eyeRig.expression === 'normal' && !isSpinningHappy) {
        const pupilX = THREE.MathUtils.clamp(mouseNorm.x * 0.06, -0.05, 0.05);
        const pupilY = THREE.MathUtils.clamp(-mouseNorm.y * 0.06, -0.05, 0.05);
        eyeRig.leftIris.position.x = pupilX;
        eyeRig.leftIris.position.y = pupilY;
        eyeRig.leftPupil.position.x = pupilX;
        eyeRig.leftPupil.position.y = pupilY;

        eyeRig.rightIris.position.x = pupilX;
        eyeRig.rightIris.position.y = pupilY;
        eyeRig.rightPupil.position.x = pupilX;
        eyeRig.rightPupil.position.y = pupilY;
      }
    }, { passive: true });

    // When reader scrolls, hide/duck slightly so text is unobstructed
    window.addEventListener('scroll', () => {
      if (!bubble.classList.contains('visible')) {
        currentTargetY = -0.96; // Duck down while reading/scrolling
      }
    }, { passive: true });

    setTimeout(() => {
      if (peekPrompt) peekPrompt.classList.add('visible');
    }, 2400);

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Check reading idle: if no interaction for > 5s and bubble closed, duck down to hide
      const now = performance.now();
      if (!bubble.classList.contains('visible') && !isSpinningHappy) {
        if (now - lastInteractionTime > 5000) {
          currentTargetY = -0.94; // Duck down below ledge
        } else {
          currentTargetY = -0.65; // Normal peek
        }
      } else if (bubble.classList.contains('visible')) {
        currentTargetY = -0.55; // Perked up while speaking
      }

      // Smooth vertical peeking / hiding interpolation
      if (!isSpinningHappy) {
        catGroup.position.y = THREE.MathUtils.lerp(
          catGroup.position.y,
          currentTargetY + Math.sin(t * 2.2) * 0.035,
          0.06
        );
      }

      // Check if 360-Degree Pirouette is active ("i am babu")
      if (isSpinningHappy) {
        const elapsed = performance.now() - spinStartTime;
        const progress = Math.min(1, elapsed / SPIN_DURATION);

        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        catGroup.rotation.y = ease * Math.PI * 2;
        catGroup.position.y = -0.42 + Math.sin(progress * Math.PI) * 0.52;

        // Tail counter-whip
        tailGroup.rotation.z = Math.sin(t * 16) * 0.35;
        tailGroup.rotation.y = Math.cos(t * 16) * 0.45;

        if (progress >= 1) {
          isSpinningHappy = false;
          catGroup.rotation.y = 0;
          catGroup.position.y = currentTargetY;
          playCatSound('purr');
          setTimeout(() => {
            mats.blush.opacity = 0;
            setExpression('normal');
          }, 4500);
        }

      } else {
        // Idle living animations
        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHead.y * 0.7, 0.09);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHead.x * 0.7, 0.09);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHead.z * 0.7, 0.09);

        // Simple Curvy Continuous Long Tail - Organic Swish & Flick
        tailGroup.rotation.z = Math.sin(t * 2.6) * 0.15 + (Math.sin(t * 8.5) > 0.86 ? 0.22 : 0);
        tailGroup.rotation.y = Math.cos(t * 2.2) * 0.20;

        // Ear twitches
        leftEar.rotation.z = -0.32 + Math.sin(t * 3.4) * 0.04 + (Math.sin(t * 13) > 0.88 ? 0.10 : 0);
        rightEar.rotation.z = 0.32 - Math.cos(t * 3.1) * 0.04 - (Math.sin(t * 10) > 0.90 ? 0.10 : 0);

        // Gentle authentic feline slow blinks
        slowBlinkTimer += 0.016;
        if (slowBlinkTimer > 4.8 && !isSlowBlinking) {
          isSlowBlinking = true;
          eyeRig.leftEyelid.rotation.x = 0;
          eyeRig.rightEyelid.rotation.x = 0;
          setTimeout(() => {
            eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
            eyeRig.rightEyelid.rotation.x = -Math.PI / 2;
            isSlowBlinking = false;
            slowBlinkTimer = Math.random() * 2.0;
          }, 200);
        }
      }

      // Bell subtle jingle
      bellMesh.position.y = -0.92 + Math.sin(t * 4.4) * 0.015;

      renderer.render(scene, camera);
    }
    animate();

    // 15. Real-Time Theme Change Synchronizer
    function applyThemeColors() {
      const isDark = isDarkTheme();
      if (isDark) {
        mats.coatMain.color.setHex(0x221f3d);
        mats.coatCream.color.setHex(0x352e5a);
        mats.innerEar.color.setHex(0xf472b6);
        mats.iris.color.setHex(0x38bdf8);
        mats.limbalRing.color.setHex(0x0c4a6e);
        mats.eyelid.color.setHex(0x221f3d);
        mats.collar.color.setHex(0x8b5cf6);
      } else {
        // Soft lilac-cashmere coat (#DED2ED) perfectly harmonized with light theme violet accent #7C3AED
        mats.coatMain.color.setHex(0xded2ed);
        mats.coatCream.color.setHex(0xffffff);
        mats.innerEar.color.setHex(0xf9a8d4);
        mats.iris.color.setHex(0x0284c7);
        mats.limbalRing.color.setHex(0x075985);
        mats.eyelid.color.setHex(0xded2ed);
        mats.collar.color.setHex(0x7c3aed);
      }
    }

    const themeObserver = new MutationObserver(() => {
      applyThemeColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})();
