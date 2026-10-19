/**
 * Second Brain - Rory the 3D Red Panda & Chief Systems Ranger
 * High-Performance, Cute Peeking & Hiding Desk Companion
 * Powered by Three.js & Web Audio API
 * 
 * Character Highlights:
 * - Iconic Red Panda Features:
 *   - Rich warm russet/cinnabar coat (#C2410C in light mode, #9A3412 in dark mode).
 *   - Signature white facial mask: white muzzle, curved white brow/tear tracks, and cheek patches.
 *   - Soft rounded ears with plush white inner tufts (natural, blended, zero sharp needle-edges).
 *   - Big, soulful, living amber-honey eyes with dual star catchlights and cursor gaze tracking.
 *   - Dark chocolate paws with pink toe beans resting on the bottom screen ledge.
 *   - Fluffy striped ringed tail with alternating russet and cream bands that swishes organically.
 * - Peeking & Smart Reading Hide:
 *   - Rory peeks from the bottom corner of the screen.
 *   - Gently ducks down below the ledge when reading or scrolling so text is never blocked.
 *   - Perks right up when the cursor approaches or when hovered/clicked!
 * - Interactive:
 *   - "i am babu": 360-degree joyful pirouette jump with heart particles and bamboo sparkles!
 *   - "i love you babu": Loving affectionate bounce, happy purrs, and floating hearts.
 *   - Chips: 🌿 Give Bamboo, 🐾 Scratch Ears, ☕ Give Coffee, 🔥 Roast My Stack, 💡 Panda Wisdom, 🔴 Laser Chase.
 * - 100% Flicker-Free standard WebGL materials with soft wrap-around hemisphere lighting.
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoryPanda);
  } else {
    initRoryPanda();
  }

  function initRoryPanda() {
    if (typeof THREE === 'undefined') return;

    // 1. Create DOM Elements
    const widget = document.createElement('div');
    widget.id = 'mochi-cat-widget';
    widget.className = 'mochi-cat-widget';
    widget.innerHTML = `
      <div id="mochi-dialogue-bubble" class="mochi-dialogue-bubble">
        <div class="mochi-dialogue-header">
          <div class="mochi-profile">
            <span class="mochi-avatar">🐾</span>
            <div>
              <div class="mochi-name">Rory</div>
              <div class="mochi-title">Chief Systems Ranger (CSR)</div>
            </div>
          </div>
          <button id="mochi-close-dialogue" class="mochi-bubble-close" aria-label="Close dialog">✕</button>
        </div>

        <div id="mochi-dialogue-text" class="mochi-dialogue-text">
          *squeak...* Oh look, a human in Nilesh's digital garden! Are you here to inspect data pipelines, or did you bring me a fresh stalk of bamboo? 🌿
        </div>

        <div class="mochi-interactive-chips" id="mochi-chips">
          <button class="mochi-chip" data-action="bamboo">🌿 Give Bamboo</button>
          <button class="mochi-chip" data-action="scratch">🐾 Scratch Ears</button>
          <button class="mochi-chip" data-action="coffee">☕ Give Coffee</button>
          <button class="mochi-chip" data-action="roast">🔥 Roast My Stack</button>
          <button class="mochi-chip" data-action="wisdom">💡 Panda Wisdom</button>
          <button class="mochi-chip" data-action="laser">🔴 Laser Chase</button>
        </div>

        <form id="mochi-chat-form" class="mochi-chat-form">
          <input type="text" id="mochi-user-input" class="mochi-chat-input" placeholder="Ask Rory about architecture, life, or snacks..." autocomplete="off">
          <button type="submit" class="mochi-chat-send" aria-label="Send">💬</button>
        </form>
      </div>

      <div id="mochi-canvas-container" class="mochi-canvas-container" title="Click Rory to chat or pet!">
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

    // 3. Warm Studio Lighting (Soft & Wrap-Around)
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0xe2e8f0, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 1.15);
    keyLight.position.set(2.8, 4.0, 3.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.75);
    fillLight.position.set(-2.8, 1.8, 2.2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 1.4, 12);
    rimLight.position.set(0, 2.5, -3.0);
    scene.add(rimLight);

    // 4. Red Panda Materials Palette
    function isDarkTheme() {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    function getMaterials() {
      const isDark = isDarkTheme();

      return {
        // Russet / Cinnabar Fur Coat
        furRusset: new THREE.MeshStandardMaterial({
          color: isDark ? 0x9a3412 : 0xc2410c,
          roughness: 0.62,
          metalness: 0.02
        }),
        // Cream Tail Rings & Highlights
        furCream: new THREE.MeshStandardMaterial({
          color: isDark ? 0xd4a373 : 0xfef3c7,
          roughness: 0.65,
          metalness: 0.0
        }),
        // Pure White Facial Mask (Muzzle, Brow Patches, Cheek Badges, Ear Tufts)
        furWhite: new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.65,
          metalness: 0.0
        }),
        // Dark Chocolate Brown for Paws & Muzzle Accents
        furDark: new THREE.MeshStandardMaterial({
          color: isDark ? 0x1f140e : 0x38220f,
          roughness: 0.6,
          metalness: 0.04
        }),
        // Cute Black Button Nose
        nose: new THREE.MeshStandardMaterial({
          color: 0x18181b,
          roughness: 0.28,
          metalness: 0.1
        }),
        // Large Soulful Eyes
        sclera: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        // Warm Amber / Honey-Chocolate Iris
        iris: new THREE.MeshStandardMaterial({
          color: isDark ? 0xf59e0b : 0xd97706,
          roughness: 0.25,
          metalness: 0.08
        }),
        limbalRing: new THREE.MeshBasicMaterial({
          color: isDark ? 0x78350f : 0x451a03
        }),
        pupil: new THREE.MeshBasicMaterial({
          color: 0x09090b
        }),
        catchlight: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        eyelid: new THREE.MeshStandardMaterial({
          color: isDark ? 0x9a3412 : 0xc2410c,
          roughness: 0.62
        }),
        blush: new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          transparent: true,
          opacity: 0
        }),
        // Royal Violet Collar matching site accent #7C3AED
        collar: new THREE.MeshStandardMaterial({
          color: isDark ? 0x8b5cf6 : 0x7c3aed,
          roughness: 0.35,
          metalness: 0.25
        }),
        // Golden Jingle Bell
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

    // 5. Cute Peeking Red Panda Model
    const pandaGroup = new THREE.Group();
    scene.add(pandaGroup);
    pandaGroup.position.set(0, -0.65, 0); // Normal peeking baseline

    // --- Head Group ---
    const headGroup = new THREE.Group();
    pandaGroup.add(headGroup);

    // Chubby Rounded Cranium (High subdivision for smooth silhouette)
    const headGeo = new THREE.SphereGeometry(1.0, 48, 48);
    headGeo.scale(1.18, 0.98, 1.05);
    const headMesh = new THREE.Mesh(headGeo, mats.furRusset);
    headGroup.add(headMesh);

    // Pure White Muzzle (Whiskers & Mouth area)
    const muzzleGeo = new THREE.SphereGeometry(0.34, 28, 28);
    muzzleGeo.scale(1.22, 0.82, 0.92);
    const muzzleMesh = new THREE.Mesh(muzzleGeo, mats.furWhite);
    muzzleMesh.position.set(0, -0.22, 0.84);
    headGroup.add(muzzleMesh);

    // Chin
    const chinGeo = new THREE.SphereGeometry(0.18, 20, 20);
    chinGeo.scale(1.1, 0.8, 0.88);
    const chinMesh = new THREE.Mesh(chinGeo, mats.furWhite);
    chinMesh.position.set(0, -0.38, 0.78);
    headGroup.add(chinMesh);

    // Red Panda White Tear Tracks / Brow Badges (Signature Bandit Mask)
    const tearGeo = new THREE.SphereGeometry(0.14, 18, 18);
    tearGeo.scale(0.85, 1.35, 0.3);

    const leftTear = new THREE.Mesh(tearGeo, mats.furWhite);
    leftTear.position.set(-0.46, 0.32, 0.88);
    leftTear.rotation.set(-0.15, 0.2, 0.28);
    headGroup.add(leftTear);

    const rightTear = new THREE.Mesh(tearGeo, mats.furWhite);
    rightTear.position.set(0.46, 0.32, 0.88);
    rightTear.rotation.set(-0.15, -0.2, -0.28);
    headGroup.add(rightTear);

    // White Cheek Fluff Badges (Lower cheeks)
    const cheekBadgeGeo = new THREE.SphereGeometry(0.24, 20, 20);
    cheekBadgeGeo.scale(1.1, 0.75, 0.35);

    const leftCheekBadge = new THREE.Mesh(cheekBadgeGeo, mats.furWhite);
    leftCheekBadge.position.set(-0.68, -0.22, 0.72);
    leftCheekBadge.rotation.set(0.1, -0.35, -0.15);
    headGroup.add(leftCheekBadge);

    const rightCheekBadge = new THREE.Mesh(cheekBadgeGeo, mats.furWhite);
    rightCheekBadge.position.set(0.68, -0.22, 0.72);
    rightCheekBadge.rotation.set(0.1, 0.35, 0.15);
    headGroup.add(rightCheekBadge);

    // Cute Dark Button Nose
    const noseGeo = new THREE.SphereGeometry(0.09, 20, 20);
    noseGeo.scale(1.22, 0.82, 0.85);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.12, 1.15);
    headGroup.add(noseMesh);

    // Fine Delicate Whiskers
    const whiskerMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
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
      g.position.set(side * 0.28, -0.22, 0.94);
      return g;
    }
    headGroup.add(createWhiskers(-1));
    headGroup.add(createWhiskers(1));

    // --- Rounded Red Panda Ears with Fluffy White Tufts (No Sharp Needle-Points!) ---
    function buildRedPandaEar(side) {
      const g = new THREE.Group();

      // Outer Russet Shell
      const shellGeo = new THREE.SphereGeometry(0.32, 24, 24);
      shellGeo.scale(1.0, 1.25, 0.55);
      const shellMesh = new THREE.Mesh(shellGeo, mats.furRusset);
      shellMesh.position.set(0, 0.22, 0);
      g.add(shellMesh);

      // Fluffy White Inner Tuft
      const innerGeo = new THREE.SphereGeometry(0.24, 20, 20);
      innerGeo.scale(1.0, 1.18, 0.5);
      const innerMesh = new THREE.Mesh(innerGeo, mats.furWhite);
      innerMesh.position.set(0, 0.20, 0.08);
      g.add(innerMesh);

      // Fluffy White Rim Accent
      const rimGeo = new THREE.SphereGeometry(0.12, 16, 16);
      rimGeo.scale(1.3, 0.8, 0.5);
      const rimMesh = new THREE.Mesh(rimGeo, mats.furWhite);
      rimMesh.position.set(0, 0.50, 0.04);
      g.add(rimMesh);

      // Sits cute and perky on top-side of skull
      g.position.set(side * 0.68, 0.74, 0.06);
      g.rotation.set(-0.12, side * -0.06, side * -0.32);
      return g;
    }

    const leftEar = buildRedPandaEar(-1);
    headGroup.add(leftEar);

    const rightEar = buildRedPandaEar(1);
    headGroup.add(rightEar);

    // Rosy Pink Blush Cheeks
    const blushGeo = new THREE.SphereGeometry(0.20, 20, 20);
    blushGeo.scale(1.2, 0.6, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, mats.blush);
    leftBlush.position.set(-0.64, -0.14, 0.82);
    leftBlush.rotation.set(0.1, -0.3, -0.1);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, mats.blush);
    rightBlush.position.set(0.64, -0.14, 0.82);
    rightBlush.rotation.set(0.1, 0.3, 0.1);
    headGroup.add(rightBlush);

    // 6. Soulful Warm Honey-Amber Eyes (Flicker-Free Layering)
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

      // Dark Chocolate Limbal Ring
      const limbalGeo = new THREE.SphereGeometry(0.22, 24, 24);
      limbalGeo.scale(1.02, 1.18, 0.35);
      const limbalMesh = new THREE.Mesh(limbalGeo, mats.limbalRing);
      limbalMesh.position.set(0, 0, 0.09);
      g.add(limbalMesh);

      // Warm Amber / Honey Iris
      const irisGeo = new THREE.SphereGeometry(0.20, 24, 24);
      irisGeo.scale(1.0, 1.15, 0.35);
      const irisMesh = new THREE.Mesh(irisGeo, mats.iris);
      irisMesh.position.set(0, 0, 0.11);
      g.add(irisMesh);

      // Deep Pupil
      const pupilGeo = new THREE.SphereGeometry(0.135, 20, 20);
      pupilGeo.scale(0.95, 1.15, 0.28);
      const pupilMesh = new THREE.Mesh(pupilGeo, mats.pupil);
      pupilMesh.position.set(0, 0, 0.15);
      g.add(pupilMesh);

      // Dual Catchlight Sparkles
      const star1Geo = new THREE.SphereGeometry(0.055, 14, 14);
      const star1 = new THREE.Mesh(star1Geo, mats.catchlight);
      star1.position.set(-0.052, 0.072, 0.21);
      g.add(star1);

      const star2Geo = new THREE.SphereGeometry(0.028, 12, 12);
      const star2 = new THREE.Mesh(star2Geo, mats.catchlight);
      star2.position.set(0.045, -0.045, 0.21);
      g.add(star2);

      // Eyelid for gentle blinks
      const lidGeo = new THREE.SphereGeometry(0.31, 28, 28, 0, Math.PI * 2, 0, Math.PI / 2);
      lidGeo.scale(1.06, 1.25, 0.54);
      const lidMesh = new THREE.Mesh(lidGeo, mats.eyelid);
      lidMesh.position.set(0, 0, 0.02);
      lidMesh.rotation.x = -Math.PI / 2;
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

    // --- Dark Chocolate Paws Resting on Screen Ledge ---
    function buildPandaPaw(side) {
      const g = new THREE.Group();
      const pawGeo = new THREE.SphereGeometry(0.24, 24, 24);
      pawGeo.scale(1.15, 0.70, 1.40);
      const pawMesh = new THREE.Mesh(pawGeo, mats.furDark);
      g.add(pawMesh);

      // Cute Pink Toe Beans
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

    const leftPaw = buildPandaPaw(-1);
    pandaGroup.add(leftPaw);

    const rightPaw = buildPandaPaw(1);
    pandaGroup.add(rightPaw);

    // Collar & Golden Bell Resting on Ledge
    const collarGeo = new THREE.TorusGeometry(0.85, 0.075, 16, 36);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.86, 0.05);
    pandaGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.125, 20, 20);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.92, 0.94);
    pandaGroup.add(bellMesh);

    // --- Iconic Fluffy Striped Ringed Tail ---
    // Alternating warm russet and cream bands on an elegant continuous S-curve
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0.50, -0.85, -0.22);
    pandaGroup.add(tailGroup);

    const tailCurvePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.35, 0.38, -0.15),
      new THREE.Vector3(0.58, 0.92, 0.05),
      new THREE.Vector3(0.44, 1.48, 0.18),
      new THREE.Vector3(0.22, 1.76, 0.22)
    ];
    const tailCurve = new THREE.CatmullRomCurve3(tailCurvePoints);

    // Main Plush Tail Tube
    const tailGeo = new THREE.TubeGeometry(tailCurve, 48, 0.115, 20, false);
    const tailMesh = new THREE.Mesh(tailGeo, mats.furRusset);
    tailGroup.add(tailMesh);

    // Distinctive Red Panda Ring Bands along the curve
    const ringTValues = [0.22, 0.45, 0.68, 0.88];
    ringTValues.forEach((tVal) => {
      const pt = tailCurve.getPoint(tVal);
      const tangent = tailCurve.getTangent(tVal);
      const ringGeo = new THREE.CylinderGeometry(0.118, 0.118, 0.14, 18, 1, true);
      const ringMesh = new THREE.Mesh(ringGeo, mats.furCream);
      ringMesh.position.copy(pt);
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      tailGroup.add(ringMesh);
    });

    // Plush Fluffy Tail Tip
    const tailTipGeo = new THREE.SphereGeometry(0.115, 20, 20);
    const tailTipMesh = new THREE.Mesh(tailTipGeo, mats.furCream);
    tailTipMesh.position.copy(tailCurvePoints[tailCurvePoints.length - 1]);
    tailGroup.add(tailTipMesh);

    // 7. Procedural Web Audio Synthesizer (Panda Squeaks, Chirps & Purrs)
    function playPandaSound(type) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (window.SecondBrainAudio && window.SecondBrainAudio.isMuted()) return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const t0 = ctx.currentTime;

        if (type === 'happy' || type === 'squeak') {
          // Sweet red panda joyful chirp / whistle squeak
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(780, t0);
          osc1.frequency.exponentialRampToValueAtTime(1380, t0 + 0.12);
          osc1.frequency.exponentialRampToValueAtTime(980, t0 + 0.28);

          gain1.gain.setValueAtTime(0.01, t0);
          gain1.gain.linearRampToValueAtTime(0.08, t0 + 0.05);
          gain1.gain.exponentialRampToValueAtTime(0.001, t0 + 0.32);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(t0);
          osc1.stop(t0 + 0.34);

        } else if (type === 'purr') {
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(46, t0 + i * 0.11);
            gain.gain.setValueAtTime(0.024, t0 + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, t0 + i * 0.11 + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t0 + i * 0.11);
            osc.stop(t0 + i * 0.11 + 0.1);
          }

        } else if (type === 'bamboo') {
          // Playful crunchy nibble pop
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, t0);
          osc.frequency.exponentialRampToValueAtTime(840, t0 + 0.06);
          osc.frequency.exponentialRampToValueAtTime(320, t0 + 0.16);

          gain.gain.setValueAtTime(0.01, t0);
          gain.gain.linearRampToValueAtTime(0.07, t0 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.20);

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

    // 8. Expressive Eye Control (Big, Warm, Non-Squinting)
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

    function showDialogue(text, sound = 'happy', expr = 'happy') {
      if (peekPrompt) peekPrompt.style.display = 'none';
      dialogueText.innerHTML = text;
      bubble.classList.add('visible');
      setExpression(expr);
      playPandaSound(sound);
      bouncePanda();

      setTimeout(() => {
        if (eyeRig.expression === expr && !isSpinningHappy) {
          setExpression('normal');
          mats.blush.opacity = 0;
        }
      }, 4000);
    }

    function bouncePanda() {
      if (isSpinningHappy) return;
      pandaGroup.position.y = -0.42;
      setTimeout(() => { pandaGroup.position.y = currentTargetY; }, 240);
    }

    function spawnParticles(symbol = '🌿') {
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

      dialogueText.innerHTML = "✨ <strong>OMG BABU!! It's you!!</strong> (≧◡≦) ♡<br>Always and forever! 🐾🌿✨";
      bubble.classList.add('visible');

      setExpression('happy');
      mats.blush.opacity = 0.95;
      playPandaSound('happy');

      spawnParticles('💖');
      setTimeout(() => spawnParticles('🌿'), 250);
      setTimeout(() => spawnParticles('✨'), 500);
      setTimeout(() => spawnParticles('💕'), 750);
    }

    // 10. Loving Affectionate Response for "i love you babu"
    function celebrateLove() {
      dialogueText.innerHTML = "✨ <strong>I love you so, so much babu!!</strong> ( ˘ ³˘)♥<br>You are my favorite human in the whole universe! 🐾💖🌿✨";
      bubble.classList.add('visible');

      setExpression('happy');
      mats.blush.opacity = 0.95;
      playPandaSound('happy');
      bouncePanda();

      spawnParticles('💖');
      setTimeout(() => spawnParticles('🌿'), 250);
      setTimeout(() => spawnParticles('🌸'), 500);
      setTimeout(() => spawnParticles('✨'), 750);
    }

    // 11. Tech Roasts & Red Panda Wisdom
    const roasts = [
      "🔥 *Looking at your stack:* You've got 14 microservices and 3 daily users. A single SQLite file and a basket of bamboo would run faster.",
      "🔥 *Architecture review:* Your system is 90% Jenga blocks and 10% hopeful git commits. One bad typo and it's panda chow.",
      "🔥 You call it 'eventual consistency'. I call it 'the data went out for bamboo and never came back'.",
      "🔥 Monoliths are like a cozy hollow tree. Microservices are 40 tiny trees scattered on fire across AWS.",
      "🔥 Your pull request says 'minor refactor' but touches 84 files. That's not a refactor, that's forest arson."
    ];

    const wisdom = [
      "💡 *Ranger Rule #1:* If you can't explain your data pipeline to a sleepy red panda on a whiteboard in 5 minutes, it's too complex.",
      "💡 Horizontal scaling > Vertical scaling. Same reason I don't climb one giant tree; I explore the whole grove.",
      "💡 In high-scale data engineering: decoupled message queues are like scratching logs. Essential for peace of mind.",
      "💡 Direct Lake mode in Power BI bypasses scheduled refreshes completely. Zero-copy sub-second queries = more bamboo nap time for everyone.",
      "💡 Context engineering is like giving an LLM the exact right hollow branch. Otherwise it knocks over your prod cluster."
    ];

    // 12. Interactive Action Chips
    const chips = document.getElementById('mochi-chips');
    if (chips) {
      chips.addEventListener('click', (e) => {
        const btn = e.target.closest('.mochi-chip');
        if (!btn) return;
        const action = btn.dataset.action;

        if (action === 'bamboo') {
          showDialogue("*crunch crunch crunch!* 🌿 Delicious bamboo snack! Nilesh's cluster uptime is now guaranteed for 30 days.", 'bamboo', 'happy');
          spawnParticles('🌿');
        } else if (action === 'scratch') {
          showDialogue("*Purrrrrrrrr...* ( ^ ﻌ ^ ) Right behind the fluffy ears! That's the sweet spot! All bugs are forgiven.", 'purr', 'happy');
          spawnParticles('💖');
        } else if (action === 'coffee') {
          showDialogue("☕ *Sips espresso* CAFFEINE DETECTED. Throughput elevated to 45,000 requests/sec! Red panda zoomies activated!", 'happy', 'laser');
          spawnParticles('⚡');
        } else if (action === 'roast') {
          const r = roasts[Math.floor(Math.random() * roasts.length)];
          showDialogue(r, 'squeak', 'wink');
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
        playPandaSound('laser');
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

        let reply = "Squeak? That sounds like a 500 error waiting to happen. Press '/' to search the garden notes for clarity!";
        let sound = 'squeak';
        let expr = 'happy';

        if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
          reply = "Greetings, human! 🐾 Welcome to Nilesh's digital knowledge garden. What architecture disaster can we prevent today?";
          expr = 'wink';
        } else if (lower.includes('spark') || lower.includes('data')) {
          reply = "Apache Spark! The Driver acts as the head chef, and Executors do the cooking. Read Issue #4 above for the full recipe!";
          expr = 'laser';
        } else if (lower.includes('panda') || lower.includes('cute') || lower.includes('good') || lower.includes('rory')) {
          reply = "*Squeak!* Of course I'm cute, I run on 60 FPS WebGL, fluffy ears, and pure biological perfection.";
          expr = 'happy';
          sound = 'purr';
          spawnParticles('✨');
        } else if (lower.includes('system') || lower.includes('design')) {
          reply = "Scalability, reliability, observability, and simplicity! Keep it simple, or I will bat your microservices off the shelf.";
          expr = 'wink';
        } else if (lower.includes('bye') || lower.includes('sleep') || lower.includes('nap')) {
          reply = "Going to nap? Wise choice. 14 hours of daily bamboo sleep is the secret to zero production bugs.";
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
        showDialogue("Squeak! Need a witty roast, tech wisdom, or want to give me bamboo?", 'happy', 'wink');
      } else {
        bouncePanda();
        playPandaSound('purr');
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

      // If user moves mouse near Rory's corner, perk up!
      const distFromPanda = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (distFromPanda < 320) {
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
        pandaGroup.position.y = THREE.MathUtils.lerp(
          pandaGroup.position.y,
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

        pandaGroup.rotation.y = ease * Math.PI * 2;
        pandaGroup.position.y = -0.42 + Math.sin(progress * Math.PI) * 0.52;

        // Tail counter-whip
        tailGroup.rotation.z = Math.sin(t * 16) * 0.35;
        tailGroup.rotation.y = Math.cos(t * 16) * 0.45;

        if (progress >= 1) {
          isSpinningHappy = false;
          pandaGroup.rotation.y = 0;
          pandaGroup.position.y = currentTargetY;
          playPandaSound('purr');
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

        // Fluffy Striped Tail - Organic Gentle Swish & Flick
        tailGroup.rotation.z = Math.sin(t * 2.4) * 0.14 + (Math.sin(t * 8.5) > 0.88 ? 0.20 : 0);
        tailGroup.rotation.y = Math.cos(t * 2.0) * 0.18;

        // Ear twitches
        leftEar.rotation.z = -0.32 + Math.sin(t * 3.4) * 0.04 + (Math.sin(t * 13) > 0.88 ? 0.10 : 0);
        rightEar.rotation.z = 0.32 - Math.cos(t * 3.1) * 0.04 - (Math.sin(t * 10) > 0.90 ? 0.10 : 0);

        // Gentle authentic slow blinks
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
        mats.furRusset.color.setHex(0x9a3412);
        mats.furCream.color.setHex(0xd4a373);
        mats.furDark.color.setHex(0x1f140e);
        mats.iris.color.setHex(0xf59e0b);
        mats.limbalRing.color.setHex(0x78350f);
        mats.eyelid.color.setHex(0x9a3412);
        mats.collar.color.setHex(0x8b5cf6);
      } else {
        mats.furRusset.color.setHex(0xc2410c);
        mats.furCream.color.setHex(0xfef3c7);
        mats.furDark.color.setHex(0x38220f);
        mats.iris.color.setHex(0xd97706);
        mats.limbalRing.color.setHex(0x451a03);
        mats.eyelid.color.setHex(0xc2410c);
        mats.collar.color.setHex(0x7c3aed);
      }
    }

    const themeObserver = new MutationObserver(() => {
      applyThemeColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})();
