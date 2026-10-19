/**
 * Second Brain - Mimi the 3D Cyber Familiar & Chief Cat Officer
 * Powered by Three.js & Web Audio API
 * 
 * Features:
 * - Full-body 3D cute chibi cat model (head, chubby body, cute belly, front & hind paws, wagging tail, collar & bell).
 * - Big, expressive anime/glossy eyes (squinting removed - eyes remain large and sparkly!).
 * - Interactive Chat with witty personality, roasts, and system design wisdom.
 * - Secret Easter Egg: When someone types "i am babu" in chat, Mimi performs a joyful 360-degree pirouette
 *   rotation in pure happiness with heart showers, glowing blush, and an affectionate declaration!
 * - Organic procedural animations: tail wagging, idle breathing, head tracking, ear twitches, dynamic lighting.
 * - Zero external assets needed: procedural 3D geometry + procedural Web Audio API synthesis.
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

    // 2. Three.js Scene & Camera Setup (Full Body View)
    const width = 160;
    const height = 195;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.18, 5.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (e) {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    canvasContainer.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.25);
    dirLight.position.set(2.5, 4.5, 3.5);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xa78bfa, 1.8, 12);
    rimLight.position.set(-2.5, 1.5, -0.8);
    scene.add(rimLight);

    // 3. Materials Palette
    function getMaterials() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        body: new THREE.MeshStandardMaterial({
          color: isDark ? 0x221f3b : 0xfffcf7,
          roughness: 0.45,
          metalness: 0.08
        }),
        belly: new THREE.MeshStandardMaterial({
          color: isDark ? 0x2f2a50 : 0xffffff,
          roughness: 0.5
        }),
        snout: new THREE.MeshStandardMaterial({
          color: isDark ? 0x2f2a50 : 0xffffff,
          roughness: 0.5
        }),
        innerEar: new THREE.MeshStandardMaterial({
          color: 0xf472b6,
          roughness: 0.5
        }),
        sclera: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        iris: new THREE.MeshBasicMaterial({
          color: isDark ? 0x38bdf8 : 0x0284c7
        }),
        pupil: new THREE.MeshBasicMaterial({
          color: 0x09090b
        }),
        catchlight: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        eyelid: new THREE.MeshStandardMaterial({
          color: isDark ? 0x221f3b : 0xfffcf7,
          roughness: 0.45
        }),
        nose: new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.3
        }),
        blush: new THREE.MeshBasicMaterial({
          color: 0xff4d8d,
          transparent: true,
          opacity: 0
        }),
        collar: new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          metalness: 0.4,
          roughness: 0.3
        }),
        bell: new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          metalness: 0.85,
          roughness: 0.15
        }),
        paws: new THREE.MeshStandardMaterial({
          color: isDark ? 0x2a2649 : 0xffffff,
          roughness: 0.5
        }),
        toeBeans: new THREE.MeshStandardMaterial({
          color: 0xf472b6,
          roughness: 0.4
        })
      };
    }

    let mats = getMaterials();

    // 4. Procedural Full-Body 3D Chibi Cat Model
    const catGroup = new THREE.Group();
    scene.add(catGroup);
    catGroup.position.set(0, -0.12, 0);

    // --- Body & Limbs Group ---
    const bodyGroup = new THREE.Group();
    catGroup.add(bodyGroup);

    // Chubby Pear-shaped Torso
    const bodyGeo = new THREE.SphereGeometry(0.82, 32, 32);
    bodyGeo.scale(0.9, 1.15, 0.82);
    const bodyMesh = new THREE.Mesh(bodyGeo, mats.body);
    bodyMesh.position.set(0, -0.72, -0.05);
    bodyGroup.add(bodyMesh);

    // Soft Creamy Belly Patch
    const bellyGeo = new THREE.SphereGeometry(0.62, 24, 24);
    bellyGeo.scale(0.72, 0.95, 0.35);
    const bellyMesh = new THREE.Mesh(bellyGeo, mats.belly);
    bellyMesh.position.set(0, -0.72, 0.36);
    bodyGroup.add(bellyMesh);

    // Helper for Paws with Pink Toe Beans
    function buildPawMesh(isFront) {
      const g = new THREE.Group();
      const pawGeo = new THREE.SphereGeometry(isFront ? 0.2 : 0.22, 16, 16);
      pawGeo.scale(1.15, 0.65, 1.35);
      const pawMesh = new THREE.Mesh(pawGeo, mats.paws);
      g.add(pawMesh);

      // Pink Toe Beans
      const beanGeo = new THREE.SphereGeometry(0.04, 10, 10);
      beanGeo.scale(1, 0.5, 1);
      for (let b = -1; b <= 1; b++) {
        const bean = new THREE.Mesh(beanGeo, mats.toeBeans);
        bean.position.set(b * 0.065, 0.08, 0.16);
        g.add(bean);
      }
      return g;
    }

    // Sitting Haunches (Rear Thighs)
    const haunchGeo = new THREE.SphereGeometry(0.38, 18, 18);
    haunchGeo.scale(0.75, 0.95, 1.05);

    const leftHaunch = new THREE.Mesh(haunchGeo, mats.body);
    leftHaunch.position.set(-0.52, -1.02, -0.08);
    leftHaunch.rotation.set(0.1, 0.25, -0.15);
    bodyGroup.add(leftHaunch);

    const rightHaunch = new THREE.Mesh(haunchGeo, mats.body);
    rightHaunch.position.set(0.52, -1.02, -0.08);
    rightHaunch.rotation.set(0.1, -0.25, 0.15);
    bodyGroup.add(rightHaunch);

    // Hind Paws (Peeking forward on the sides)
    const leftHindPaw = buildPawMesh(false);
    leftHindPaw.position.set(-0.52, -1.34, 0.22);
    leftHindPaw.rotation.y = 0.2;
    bodyGroup.add(leftHindPaw);

    const rightHindPaw = buildPawMesh(false);
    rightHindPaw.position.set(0.52, -1.34, 0.22);
    rightHindPaw.rotation.y = -0.2;
    bodyGroup.add(rightHindPaw);

    // Front Legs & Front Paws (Resting cutely in front)
    const frontLegGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.42, 16);
    
    const leftFrontLeg = new THREE.Mesh(frontLegGeo, mats.body);
    leftFrontLeg.position.set(-0.24, -1.14, 0.32);
    leftFrontLeg.rotation.x = 0.08;
    bodyGroup.add(leftFrontLeg);

    const rightFrontLeg = new THREE.Mesh(frontLegGeo, mats.body);
    rightFrontLeg.position.set(0.24, -1.14, 0.32);
    rightFrontLeg.rotation.x = 0.08;
    bodyGroup.add(rightFrontLeg);

    const leftFrontPaw = buildPawMesh(true);
    leftFrontPaw.position.set(-0.24, -1.34, 0.46);
    bodyGroup.add(leftFrontPaw);

    const rightFrontPaw = buildPawMesh(true);
    rightFrontPaw.position.set(0.24, -1.34, 0.46);
    bodyGroup.add(rightFrontPaw);

    // Curled Wagging Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, -1.08, -0.55);
    bodyGroup.add(tailGroup);

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.15, 0.25, -0.25),
      new THREE.Vector3(0.35, 0.65, -0.15),
      new THREE.Vector3(0.48, 1.05, 0.05),
      new THREE.Vector3(0.42, 1.25, 0.18)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.09, 12, false);
    const tailMesh = new THREE.Mesh(tailGeo, mats.body);
    tailGroup.add(tailMesh);

    // Fluffy round tip of tail
    const tailTipGeo = new THREE.SphereGeometry(0.12, 14, 14);
    const tailTipMesh = new THREE.Mesh(tailTipGeo, mats.body);
    tailTipMesh.position.set(0.42, 1.25, 0.18);
    tailGroup.add(tailTipMesh);

    // --- Neck Collar & Golden Bell ---
    const collarGeo = new THREE.TorusGeometry(0.68, 0.07, 12, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.22, 0);
    catGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.32, 0.72);
    catGroup.add(bellMesh);

    // --- Head Group ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0);
    catGroup.add(headGroup);

    // Rounded Chibi Head
    const headGeo = new THREE.SphereGeometry(1.0, 32, 32);
    headGeo.scale(1.18, 1.0, 1.08);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headGroup.add(headMesh);

    // Snout / Cheeks
    const snoutGeo = new THREE.SphereGeometry(0.38, 24, 24);
    snoutGeo.scale(1.25, 0.75, 0.82);
    const snoutMesh = new THREE.Mesh(snoutGeo, mats.snout);
    snoutMesh.position.set(0, -0.22, 0.9);
    headGroup.add(snoutMesh);

    // Cute Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 14, 14);
    noseGeo.scale(1.2, 0.85, 0.85);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.11, 1.15);
    headGroup.add(noseMesh);

    // Glowing Rosy Blush Cheeks (Glows when happy or babu is found!)
    const blushGeo = new THREE.SphereGeometry(0.22, 16, 16);
    blushGeo.scale(1.2, 0.6, 0.2);

    const leftBlush = new THREE.Mesh(blushGeo, mats.blush);
    leftBlush.position.set(-0.62, -0.14, 0.82);
    leftBlush.rotation.set(0.1, -0.3, -0.1);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, mats.blush);
    rightBlush.position.set(0.62, -0.14, 0.82);
    rightBlush.rotation.set(0.1, 0.3, 0.1);
    headGroup.add(rightBlush);

    // Whiskers
    const whiskerMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 });
    function createWhiskers(side) {
      const g = new THREE.Group();
      for (let w = -1; w <= 1; w++) {
        const pts = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(side * 0.7, w * 0.12 - 0.05, 0.1)
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        g.add(new THREE.Line(geo, whiskerMat));
      }
      g.position.set(side * 0.35, -0.2, 1.0);
      return g;
    }
    headGroup.add(createWhiskers(-1));
    headGroup.add(createWhiskers(1));

    // Pointy Ears
    const earGeo = new THREE.ConeGeometry(0.4, 0.75, 16);
    const leftEar = new THREE.Mesh(earGeo, mats.body);
    leftEar.position.set(-0.68, 0.88, 0.06);
    leftEar.rotation.set(-0.15, 0, 0.38);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, mats.body);
    rightEar.position.set(0.68, 0.88, 0.06);
    rightEar.rotation.set(-0.15, 0, -0.38);
    headGroup.add(rightEar);

    // Pink Inner Ears
    const innerEarGeo = new THREE.ConeGeometry(0.26, 0.55, 16);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, mats.innerEar);
    leftInnerEar.position.set(-0.66, 0.85, 0.12);
    leftInnerEar.rotation.set(-0.15, 0, 0.38);
    headGroup.add(leftInnerEar);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, mats.innerEar);
    rightInnerEar.position.set(0.66, 0.85, 0.12);
    rightInnerEar.rotation.set(-0.15, 0, -0.38);
    headGroup.add(rightInnerEar);

    // 5. Big, Glossy, Expressive Eyes (Squinting effect REMOVED!)
    const eyeRig = {
      leftEyeGroup: new THREE.Group(),
      rightEyeGroup: new THREE.Group(),
      leftPupil: null,
      rightPupil: null,
      leftEyelid: null,
      rightEyelid: null,
      expression: 'normal'
    };

    function buildExpressiveEye(side) {
      const g = new THREE.Group();
      const x = side * 0.44;
      g.position.set(x, 0.06, 0.94);
      g.rotation.y = side * -0.18;

      // Big Round Sclera
      const scleraGeo = new THREE.SphereGeometry(0.26, 22, 22);
      scleraGeo.scale(1.05, 1.2, 0.45);
      const scleraMesh = new THREE.Mesh(scleraGeo, mats.sclera);
      g.add(scleraMesh);

      // Large Vibrant Iris
      const irisGeo = new THREE.SphereGeometry(0.20, 20, 20);
      irisGeo.scale(1.0, 1.15, 0.35);
      const irisMesh = new THREE.Mesh(irisGeo, mats.iris);
      irisMesh.position.set(0, 0, 0.05);
      g.add(irisMesh);

      // Deep Pupil
      const pupilGeo = new THREE.SphereGeometry(0.13, 18, 18);
      pupilGeo.scale(0.95, 1.1, 0.3);
      const pupilMesh = new THREE.Mesh(pupilGeo, mats.pupil);
      pupilMesh.position.set(0, 0, 0.07);
      g.add(pupilMesh);

      // Multiple Catchlights / Anime Sparkles for Big Living Eyes
      const star1Geo = new THREE.SphereGeometry(0.055, 12, 12);
      const star1 = new THREE.Mesh(star1Geo, mats.catchlight);
      star1.position.set(-0.045, 0.065, 0.11);
      g.add(star1);

      const star2Geo = new THREE.SphereGeometry(0.028, 10, 10);
      const star2 = new THREE.Mesh(star2Geo, mats.catchlight);
      star2.position.set(0.042, -0.045, 0.11);
      g.add(star2);

      const star3Geo = new THREE.SphereGeometry(0.016, 8, 8);
      const star3 = new THREE.Mesh(star3Geo, mats.catchlight);
      star3.position.set(-0.025, -0.065, 0.11);
      g.add(star3);

      // Eyelid for gentle blinks (starts hidden)
      const lidGeo = new THREE.SphereGeometry(0.28, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
      lidGeo.scale(1.06, 1.22, 0.48);
      const lidMesh = new THREE.Mesh(lidGeo, mats.eyelid);
      lidMesh.position.set(0, 0, 0.02);
      lidMesh.rotation.x = -Math.PI / 2;
      g.add(lidMesh);

      return { group: g, pupil: pupilMesh, eyelid: lidMesh };
    }

    const leftEyeBuilt = buildExpressiveEye(-1);
    const rightEyeBuilt = buildExpressiveEye(1);

    headGroup.add(leftEyeBuilt.group);
    headGroup.add(rightEyeBuilt.group);

    eyeRig.leftEyeGroup = leftEyeBuilt.group;
    eyeRig.rightEyeGroup = rightEyeBuilt.group;
    eyeRig.leftPupil = leftEyeBuilt.pupil;
    eyeRig.rightPupil = rightEyeBuilt.pupil;
    eyeRig.leftEyelid = leftEyeBuilt.eyelid;
    eyeRig.rightEyelid = rightEyeBuilt.eyelid;

    // 6. Audio Synthesizer (Meow, Purr, Happy Melody, Laser)
    function playCatSound(type) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (window.SecondBrainAudio && window.SecondBrainAudio.isMuted()) return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const t0 = ctx.currentTime;

        if (type === 'happy') {
          // Cheerful, joyful melodic chirp for happiness & babu!
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(650, t0);
          osc1.frequency.exponentialRampToValueAtTime(1180, t0 + 0.12);
          osc1.frequency.exponentialRampToValueAtTime(880, t0 + 0.28);

          gain1.gain.setValueAtTime(0.01, t0);
          gain1.gain.linearRampToValueAtTime(0.09, t0 + 0.05);
          gain1.gain.exponentialRampToValueAtTime(0.001, t0 + 0.32);

          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(t0);
          osc1.stop(t0 + 0.34);

          // Second joyful harmonic note
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(950, t0 + 0.12);
          osc2.frequency.exponentialRampToValueAtTime(1420, t0 + 0.24);
          osc2.frequency.exponentialRampToValueAtTime(1100, t0 + 0.42);

          gain2.gain.setValueAtTime(0.001, t0 + 0.12);
          gain2.gain.linearRampToValueAtTime(0.07, t0 + 0.18);
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
          osc.frequency.exponentialRampToValueAtTime(940, t0 + 0.14);
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
            gain.gain.setValueAtTime(0.025, t0 + i * 0.11);
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

    // 7. Expressions (Squinting removed - eyes stay big and expressive)
    function setExpression(expr) {
      eyeRig.expression = expr;

      // Keep eyes big and round at all times! No slit or squint scaling!
      eyeRig.leftEyeGroup.scale.set(1.0, 1.0, 1.0);
      eyeRig.rightEyeGroup.scale.set(1.0, 1.0, 1.0);

      if (expr === 'happy') {
        // Big round sparkling eyes with affectionate warm dilated pupils
        eyeRig.leftPupil.scale.set(1.15, 1.15, 0.3);
        eyeRig.rightPupil.scale.set(1.15, 1.15, 0.3);
        mats.blush.opacity = 0.85;
      } else if (expr === 'laser') {
        // High focus dilated pupils
        eyeRig.leftPupil.scale.set(1.4, 1.4, 0.3);
        eyeRig.rightPupil.scale.set(1.4, 1.4, 0.3);
      } else if (expr === 'wink') {
        // Playful wink: left eyelid drops cleanly while right eye stays big & sparkling
        eyeRig.leftEyelid.rotation.x = 0;
        eyeRig.rightPupil.scale.set(1.1, 1.1, 0.3);
        setTimeout(() => {
          eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
        }, 1200);
      } else {
        // Normal state
        eyeRig.leftPupil.scale.set(0.95, 1.1, 0.3);
        eyeRig.rightPupil.scale.set(0.95, 1.1, 0.3);
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
      catGroup.position.y = 0.06;
      setTimeout(() => { catGroup.position.y = -0.12; }, 240);
    }

    function spawnParticles(symbol = '💖') {
      const rect = canvasContainer.getBoundingClientRect();
      for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.className = 'mochi-float-particle';
        p.textContent = symbol;
        p.style.left = `${rect.left + 75 + (Math.random() - 0.5) * 60}px`;
        p.style.top = `${rect.top + 30}px`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
        p.style.setProperty('--dy', `${-65 - Math.random() * 65}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }

    // 8. 360-Degree Joyful Pirouette for Babu!
    let isSpinningHappy = false;
    let spinStartTime = 0;
    const SPIN_DURATION = 1350; // Smooth 1.35s pirouette

    function celebrateBabu() {
      if (isSpinningHappy) return;
      isSpinningHappy = true;
      spinStartTime = performance.now();

      dialogueText.innerHTML = "✨ <strong>OMG BABU!! It's you!!</strong> (≧◡≦) ♡<br><strong>I love you so, so much babu!</strong> Always and forever! 💖🌸✨";
      bubble.classList.add('visible');

      // Big sparkling eyes & glowing blush
      setExpression('happy');
      mats.blush.opacity = 0.95;

      // Play joyful sound & shower of particles
      playCatSound('happy');
      spawnParticles('💖');
      setTimeout(() => spawnParticles('✨'), 250);
      setTimeout(() => spawnParticles('🌸'), 500);
      setTimeout(() => spawnParticles('💕'), 750);
      setTimeout(() => spawnParticles('🥰'), 1000);
    }

    // 9. Tech Roasts & Wisdom Repositories
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

    // 10. Interactive Chips
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

    // 11. Chat Form Handler (detects "i am babu" -> 360 degree spin)
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = (chatInput.value || '').trim();
        if (!msg) return;

        chatInput.value = '';
        const lower = msg.toLowerCase();

        // Check for babu declaration
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

    // Click canvas container
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

    // 12. Kinematics, Mouse Tracking & Tail Sway
    let mouseNorm = { x: 0, y: 0 };
    let targetHead = { x: 0, y: 0, z: 0 };
    let blinkTimer = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouseNorm.x = (e.clientX - cx) / window.innerWidth;
      mouseNorm.y = -(e.clientY - cy) / window.innerHeight;

      targetHead.y = Math.max(-0.6, Math.min(0.6, mouseNorm.x * 1.5));
      targetHead.x = Math.max(-0.35, Math.min(0.35, -mouseNorm.y * 1.2));
      targetHead.z = (mouseNorm.x * 0.2);

      // Pupil gaze tracking (subtle & responsive within big eyes)
      if (eyeRig.expression === 'normal' && !isSpinningHappy) {
        const pupilX = THREE.MathUtils.clamp(mouseNorm.x * 0.07, -0.05, 0.05);
        const pupilY = THREE.MathUtils.clamp(-mouseNorm.y * 0.07, -0.05, 0.05);
        eyeRig.leftPupil.position.x = pupilX;
        eyeRig.leftPupil.position.y = pupilY;
        eyeRig.rightPupil.position.x = pupilX;
        eyeRig.rightPupil.position.y = pupilY;
      }
    }, { passive: true });

    setTimeout(() => {
      if (peekPrompt) peekPrompt.classList.add('visible');
    }, 2400);

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Check if 360-Degree Pirouette is active
      if (isSpinningHappy) {
        const elapsed = performance.now() - spinStartTime;
        const progress = Math.min(1, elapsed / SPIN_DURATION);

        // Smooth cubic ease-in-out rotation for full 360 degrees (2 * PI)
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        catGroup.rotation.y = ease * Math.PI * 2;
        // Joyful little hop during the pirouette
        catGroup.position.y = -0.12 + Math.sin(progress * Math.PI) * 0.45;

        // Tail wags fast and enthusiastically!
        tailGroup.rotation.y = Math.sin(t * 16) * 0.6;
        tailGroup.rotation.z = Math.cos(t * 16) * 0.35;

        // Ears twitch happily
        leftEar.rotation.z = 0.38 + Math.sin(t * 18) * 0.12;
        rightEar.rotation.z = -0.38 - Math.cos(t * 18) * 0.12;

        if (progress >= 1) {
          isSpinningHappy = false;
          catGroup.rotation.y = 0;
          catGroup.position.y = -0.12;
          playCatSound('purr');
          setTimeout(() => {
            mats.blush.opacity = 0;
            setExpression('normal');
          }, 4500);
        }

      } else {
        // Idle organic animations
        catGroup.position.y = -0.12 + Math.sin(t * 2.2) * 0.025; // Gentle breathing bob
        catGroup.rotation.y = THREE.MathUtils.lerp(catGroup.rotation.y, targetHead.y * 0.35, 0.08);

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHead.y * 0.7, 0.09);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHead.x, 0.09);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHead.z, 0.09);

        // Tail gentle natural wagging
        tailGroup.rotation.y = Math.sin(t * 3.2) * 0.35;
        tailGroup.rotation.z = 0.2 + Math.cos(t * 3.2) * 0.12;

        // Ear twitches
        leftEar.rotation.z = 0.38 + Math.sin(t * 3.4) * 0.04 + (Math.sin(t * 14) > 0.85 ? 0.12 : 0);
        rightEar.rotation.z = -0.38 - Math.cos(t * 3.1) * 0.04 - (Math.sin(t * 11) > 0.88 ? 0.12 : 0);
      }

      // Bell subtle jingle
      bellMesh.position.y = -0.32 + Math.sin(t * 4.4) * 0.015;

      // Natural quick eyelid blink while maintaining big expressive eyes
      if (eyeRig.expression === 'normal' && !isSpinningHappy) {
        blinkTimer += 0.016;
        if (blinkTimer > 3.8) {
          eyeRig.leftEyelid.rotation.x = 0;
          eyeRig.rightEyelid.rotation.x = 0;
          setTimeout(() => {
            eyeRig.leftEyelid.rotation.x = -Math.PI / 2;
            eyeRig.rightEyelid.rotation.x = -Math.PI / 2;
            blinkTimer = Math.random() * 1.5;
          }, 110);
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // 13. Theme change sync
    const themeObserver = new MutationObserver(() => {
      mats = getMaterials();
      headMesh.material = mats.body;
      bodyMesh.material = mats.body;
      bellyMesh.material = mats.belly;
      leftEar.material = mats.body;
      rightEar.material = mats.body;
      leftHaunch.material = mats.body;
      rightHaunch.material = mats.body;
      leftFrontLeg.material = mats.body;
      rightFrontLeg.material = mats.body;
      tailMesh.material = mats.body;
      tailTipMesh.material = mats.body;
      snoutMesh.material = mats.snout;
      eyeRig.leftEyelid.material = mats.eyelid;
      eyeRig.rightEyelid.material = mats.eyelid;
      eyeRig.leftEyeGroup.children[1].material = mats.iris;
      eyeRig.rightEyeGroup.children[1].material = mats.iris;
      leftFrontPaw.children[0].material = mats.paws;
      rightFrontPaw.children[0].material = mats.paws;
      leftHindPaw.children[0].material = mats.paws;
      rightHindPaw.children[0].material = mats.paws;
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  }
})();
