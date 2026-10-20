/**
 * Second Brain - Mimi the 3D Cyber Familiar & Chief Cat Officer
 * Powered by Three.js & Web Audio API
 * 
 * Features:
 * - Renamed to Mimi!
 * - 'Are you babu?' interactive question with Yes/No choices.
 * - When Yes is chosen: Mimi comes out and starts happily jumping with joy, saying 'i love you babu'!
 * - Expressive Eyes with emotional states (Happy, Skeptical, Dilated Laser Focus, Winking, Blinking)
 * - Head tracking with inquisitive tilt and cursor parallax
 * - Hilarious, witty tech personality & chat engine
 * - Synthesized procedural meow, purr, and laser sounds
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

    // Create DOM Elements
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

        <!-- Special Babu Interactive Choice Box -->
        <div id="mochi-babu-box" class="mochi-babu-box" style="display: none;">
          <div class="mochi-babu-question">Wait a second... are you babu? 🥺👉👈</div>
          <div class="mochi-babu-choices">
            <button class="mochi-choice-btn yes" id="btn-babu-yes">Yes! 🥰</button>
            <button class="mochi-choice-btn no" id="btn-babu-no">No 😅</button>
          </div>
        </div>

        <div class="mochi-interactive-chips" id="mochi-chips">
          <button class="mochi-chip mochi-chip-babu" data-action="babu">🌸 Are you babu?</button>
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
    const babuBox = document.getElementById('mochi-babu-box');
    const btnBabuYes = document.getElementById('btn-babu-yes');
    const btnBabuNo = document.getElementById('btn-babu-no');
    const peekPrompt = document.getElementById('mochi-peek-prompt');
    const closeBtn = document.getElementById('mochi-close-dialogue');
    const chatForm = document.getElementById('mochi-chat-form');
    const chatInput = document.getElementById('mochi-user-input');

    // 1. Three.js Scene & Camera Setup
    const width = 160;
    const height = 180;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 5.4);

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

    // 2. Procedural 3D Chibi Cat Model
    const catGroup = new THREE.Group();
    scene.add(catGroup);
    catGroup.position.set(0, -0.65, 0);

    const headGroup = new THREE.Group();
    catGroup.add(headGroup);

    let isHappyJumping = false;
    let happyJumpEnd = 0;

    function getMaterials() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        body: new THREE.MeshStandardMaterial({
          color: isDark ? 0x1f1c34 : 0xfffcf7,
          roughness: 0.45,
          metalness: 0.08
        }),
        snout: new THREE.MeshStandardMaterial({
          color: isDark ? 0x2e2a4a : 0xffffff,
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
          color: isDark ? 0x1f1c34 : 0xfffcf7,
          roughness: 0.45
        }),
        nose: new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.3
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
          color: isDark ? 0x2b2746 : 0xffffff,
          roughness: 0.5
        }),
        toeBeans: new THREE.MeshStandardMaterial({
          color: 0xf472b6,
          roughness: 0.4
        })
      };
    }

    let mats = getMaterials();

    // Head
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

    // Ears
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

    // 3. Expressive Eye Rig
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

      const scleraGeo = new THREE.SphereGeometry(0.24, 20, 20);
      scleraGeo.scale(1.0, 1.25, 0.45);
      const scleraMesh = new THREE.Mesh(scleraGeo, mats.sclera);
      g.add(scleraMesh);

      const irisGeo = new THREE.SphereGeometry(0.18, 18, 18);
      irisGeo.scale(0.95, 1.15, 0.35);
      const irisMesh = new THREE.Mesh(irisGeo, mats.iris);
      irisMesh.position.set(0, 0, 0.05);
      g.add(irisMesh);

      const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);
      pupilGeo.scale(0.9, 1.1, 0.3);
      const pupilMesh = new THREE.Mesh(pupilGeo, mats.pupil);
      pupilMesh.position.set(0, 0, 0.07);
      g.add(pupilMesh);

      const star1Geo = new THREE.SphereGeometry(0.05, 12, 12);
      const star1 = new THREE.Mesh(star1Geo, mats.catchlight);
      star1.position.set(-0.04, 0.06, 0.11);
      g.add(star1);

      const star2Geo = new THREE.SphereGeometry(0.025, 10, 10);
      const star2 = new THREE.Mesh(star2Geo, mats.catchlight);
      star2.position.set(0.04, -0.04, 0.11);
      g.add(star2);

      const lidGeo = new THREE.SphereGeometry(0.26, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2);
      lidGeo.scale(1.02, 1.28, 0.48);
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

    // Collar & Golden Bell
    const collarGeo = new THREE.TorusGeometry(0.88, 0.08, 12, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.86, 0);
    catGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.94, 0.92);
    catGroup.add(bellMesh);

    // Paws with Pink Toe Beans
    function buildPaw(side) {
      const g = new THREE.Group();
      const pawGeo = new THREE.SphereGeometry(0.24, 16, 16);
      pawGeo.scale(1.15, 0.7, 1.4);
      const pawMesh = new THREE.Mesh(pawGeo, mats.paws);
      g.add(pawMesh);

      const padGeo = new THREE.SphereGeometry(0.045, 10, 10);
      padGeo.scale(1, 0.5, 1);
      for (let b = -1; b <= 1; b++) {
        const bean = new THREE.Mesh(padGeo, mats.toeBeans);
        bean.position.set(b * 0.08, 0.12, 0.2);
        g.add(bean);
      }
      g.position.set(side * 0.56, -0.98, 0.78);
      return g;
    }

    const leftPaw = buildPaw(-1);
    const rightPaw = buildPaw(1);
    catGroup.add(leftPaw);
    catGroup.add(rightPaw);

    // 4. Procedural Audio Synthesizer
    function playCatSound(type) {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (window.SecondBrainAudio && window.SecondBrainAudio.isMuted()) return;

      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        if (type === 'meow') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(620, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(940, ctx.currentTime + 0.14);
          osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.42);

          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.44);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.46);
        } else if (type === 'happyMeow') {
          // Double joyous chirp!
          for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(750 + i * 150, ctx.currentTime + i * 0.18);
            osc.frequency.exponentialRampToValueAtTime(1250 + i * 150, ctx.currentTime + i * 0.18 + 0.12);

            gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.18);
            osc.stop(ctx.currentTime + i * 0.18 + 0.16);
          }
        } else if (type === 'purr') {
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(42, ctx.currentTime + i * 0.11);
            gain.gain.setValueAtTime(0.025, ctx.currentTime + i * 0.11);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.11 + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.11);
            osc.stop(ctx.currentTime + i * 0.11 + 0.1);
          }
        } else if (type === 'laser') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.14);
        }
      } catch (e) {}
    }

    // 5. Witty Personality & Dialogue Repository
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

    function setExpression(expr) {
      eyeRig.expression = expr;

      if (expr === 'happy') {
        eyeRig.leftEyeGroup.scale.set(1.0, 0.15, 1.0);
        eyeRig.rightEyeGroup.scale.set(1.0, 0.15, 1.0);
      } else if (expr === 'skeptical') {
        eyeRig.leftEyeGroup.scale.set(1.0, 0.55, 1.0);
        eyeRig.rightEyeGroup.scale.set(1.0, 0.55, 1.0);
      } else if (expr === 'laser') {
        eyeRig.leftEyeGroup.scale.set(1.15, 1.15, 1.0);
        eyeRig.rightEyeGroup.scale.set(1.15, 1.15, 1.0);
        eyeRig.leftPupil.scale.set(1.6, 1.6, 1.0);
        eyeRig.rightPupil.scale.set(1.6, 1.6, 1.0);
      } else if (expr === 'wink') {
        eyeRig.leftEyeGroup.scale.set(1.0, 0.15, 1.0);
        eyeRig.rightEyeGroup.scale.set(1.0, 1.1, 1.0);
      } else {
        eyeRig.leftEyeGroup.scale.set(1.0, 1.0, 1.0);
        eyeRig.rightEyeGroup.scale.set(1.0, 1.0, 1.0);
        eyeRig.leftPupil.scale.set(0.9, 1.1, 0.3);
        eyeRig.rightPupil.scale.set(0.9, 1.1, 0.3);
      }
    }

    function showDialogue(text, sound = 'meow', expr = 'happy') {
      if (peekPrompt) peekPrompt.style.display = 'none';
      if (babuBox) babuBox.style.display = 'none';
      dialogueText.innerHTML = text;
      bubble.classList.add('visible');
      setExpression(expr);
      playCatSound(sound);
      bounceCat();

      setTimeout(() => {
        if (eyeRig.expression === expr && !isHappyJumping) setExpression('normal');
      }, 3500);
    }

    function bounceCat() {
      if (isHappyJumping) return;
      catGroup.position.y = -0.25;
      setTimeout(() => { catGroup.position.y = -0.65; }, 260);
    }

    function spawnParticles(symbol = '💖') {
      const rect = canvasContainer.getBoundingClientRect();
      for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.className = 'mochi-float-particle';
        p.textContent = symbol;
        p.style.left = `${rect.left + 50 + (Math.random() - 0.5) * 55}px`;
        p.style.top = `${rect.top + 20}px`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        p.style.setProperty('--dy', `${-65 - Math.random() * 55}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
      }
    }

    // 6. Babu Interaction Logic
    function triggerBabuQuestion() {
      if (peekPrompt) peekPrompt.style.display = 'none';
      dialogueText.innerHTML = "Wait a second... are you babu? 🥺👉👈";
      if (babuBox) babuBox.style.display = 'block';
      bubble.classList.add('visible');
      setExpression('laser');
      playCatSound('meow');
      bounceCat();
    }

    function handleBabuAnswer(isYes) {
      if (babuBox) babuBox.style.display = 'none';

      if (isYes) {
        // Start happy jumping celebration!
        isHappyJumping = true;
        happyJumpEnd = performance.now() + 6500; // Jump happily for 6.5s!

        dialogueText.innerHTML = "✨ <strong>YAAAY!! I love you babu!!</strong> ( ˘ ³˘)♥ Always and forever! 🐾💖🌸";
        setExpression('happy');
        playCatSound('happyMeow');

        // Continuous shower of hearts
        const interval = setInterval(() => {
          if (!isHappyJumping) {
            clearInterval(interval);
            return;
          }
          spawnParticles(['💖', '💕', '🌸', '✨', '🥰'][Math.floor(Math.random() * 5)]);
        }, 300);

        setTimeout(() => {
          isHappyJumping = false;
          setExpression('normal');
        }, 6500);

      } else {
        // Not babu
        showDialogue("Hmph! Impostor detected! 🕵️‍♀️ But I suppose you may still explore Nilesh's digital garden.", 'meow', 'skeptical');
      }
    }

    if (btnBabuYes) {
      btnBabuYes.addEventListener('click', () => handleBabuAnswer(true));
    }
    if (btnBabuNo) {
      btnBabuNo.addEventListener('click', () => handleBabuAnswer(false));
    }

    // 7. Action Chips Listeners
    const chips = document.getElementById('mochi-chips');
    if (chips) {
      chips.addEventListener('click', (e) => {
        const btn = e.target.closest('.mochi-chip');
        if (!btn) return;
        const action = btn.dataset.action;

        if (action === 'babu') {
          triggerBabuQuestion();
        } else if (action === 'scratch') {
          showDialogue("*Purrrrrrrrr...* ( ^ ﻌ ^ ) Under the chin! That's the sweet spot! All bugs in Nilesh's code are now forgiven.", 'purr', 'happy');
          spawnParticles('💖');
        } else if (action === 'coffee') {
          showDialogue("☕ *GULP!* EYES WIDE OPEN O_O! I can now rewrite the entire Spark execution engine in assembly in 4 minutes flat!", 'laser', 'laser');
          spawnParticles('⚡');
        } else if (action === 'roast') {
          const roast = roasts[Math.floor(Math.random() * roasts.length)];
          showDialogue(roast, 'meow', 'skeptical');
          spawnParticles('🔥');
        } else if (action === 'wisdom') {
          const w = wisdom[Math.floor(Math.random() * wisdom.length)];
          showDialogue(w, 'meow', 'wink');
          spawnParticles('💡');
        } else if (action === 'laser') {
          showDialogue("🔴 WHERE IS IT?! *pupils dilating* THE RED DOT! I MUST CATCH THE EVENT STREAM!", 'laser', 'laser');
          spawnParticles('🔴');
          playLaserChase();
        }
      });
    }

    function playLaserChase() {
      let count = 0;
      const interval = setInterval(() => {
        targetHead.x = (Math.random() - 0.5) * 0.9;
        targetHead.y = (Math.random() - 0.5) * 0.9;
        playCatSound('laser');
        count++;
        if (count > 5) clearInterval(interval);
      }, 250);
    }

    // 8. Chat Form Handler
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = (chatInput.value || '').trim();
        if (!msg) return;

        chatInput.value = '';
        const lower = msg.toLowerCase();

        if (lower.includes('babu') || lower === 'yes' || lower.includes('i am babu')) {
          handleBabuAnswer(true);
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

    // 9. Kinematics & Tracking (Head Turn, Jumping, Blinking)
    let mouseNorm = { x: 0, y: 0 };
    let targetHead = { x: 0, y: 0, z: 0 };
    let blinkTimer = 0;
    let isBlinking = false;

    window.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouseNorm.x = (e.clientX - cx) / window.innerWidth;
      mouseNorm.y = -(e.clientY - cy) / window.innerHeight;

      targetHead.y = Math.max(-0.6, Math.min(0.6, mouseNorm.x * 1.6));
      targetHead.x = Math.max(-0.35, Math.min(0.35, -mouseNorm.y * 1.2));
      targetHead.z = (mouseNorm.x * 0.2);

      if (eyeRig.expression === 'normal') {
        const pupilX = THREE.MathUtils.clamp(mouseNorm.x * 0.08, -0.05, 0.05);
        const pupilY = THREE.MathUtils.clamp(-mouseNorm.y * 0.08, -0.05, 0.05);
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

      // Check if jumping celebration is active
      if (isHappyJumping) {
        // Mimi comes out and leaps with joy!
        catGroup.position.y = 0.2 + Math.abs(Math.sin(t * 8.5)) * 0.75;
        catGroup.position.x = Math.sin(t * 5.0) * 0.28; // Cute happy dance side to side
        catGroup.rotation.z = Math.sin(t * 12.0) * 0.18; // Joyful wiggle

        leftEar.rotation.z = 0.38 + Math.sin(t * 16) * 0.18;
        rightEar.rotation.z = -0.38 - Math.cos(t * 16) * 0.18;
      } else {
        // Normal breathing & idle tracking
        catGroup.position.x = 0;
        catGroup.position.y = -0.65 + Math.sin(t * 2.4) * 0.04;
        catGroup.rotation.z = THREE.MathUtils.lerp(catGroup.rotation.z, targetHead.z, 0.09);

        headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHead.y, 0.09);
        headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHead.x, 0.09);
        headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetHead.z, 0.09);

        leftEar.rotation.z = 0.38 + Math.sin(t * 3.8) * 0.05 + (Math.sin(t * 14) > 0.82 ? 0.14 : 0);
        rightEar.rotation.z = -0.38 - Math.cos(t * 3.4) * 0.05 - (Math.sin(t * 11) > 0.85 ? 0.14 : 0);
      }

      // Bell subtle jingle
      bellMesh.position.y = -0.94 + Math.sin(t * 4.8) * 0.02;

      // Natural blinking
      if (eyeRig.expression === 'normal') {
        blinkTimer += 0.016;
        if (blinkTimer > 3.6 && !isBlinking) {
          isBlinking = true;
          eyeRig.leftEyeGroup.scale.y = 0.08;
          eyeRig.rightEyeGroup.scale.y = 0.08;
          setTimeout(() => {
            eyeRig.leftEyeGroup.scale.y = 1.0;
            eyeRig.rightEyeGroup.scale.y = 1.0;
            isBlinking = false;
            blinkTimer = Math.random() * 1.5;
          }, 140);
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // Theme changes
    const themeObserver = new MutationObserver(() => {
      mats = getMaterials();
      headMesh.material = mats.body;
      leftEar.material = mats.body;
      rightEar.material = mats.body;
      snoutMesh.material = mats.snout;
      eyeRig.leftEyelid.material = mats.eyelid;
      eyeRig.rightEyelid.material = mats.eyelid;
      eyeRig.leftEyeGroup.children[1].material = mats.iris;
      eyeRig.rightEyeGroup.children[1].material = mats.iris;
      leftPaw.children[0].material = mats.paws;
      rightPaw.children[0].material = mats.paws;
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  }
})();
