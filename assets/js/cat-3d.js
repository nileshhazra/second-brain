/**
 * Second Brain - Mochi the Interactive 3D Companion Cat
 * Powered by Three.js & Web Audio API
 * 
 * Features:
 * - Procedural 3D cute stylized Chibi Cat with head tracking, ear twitching, and blinking.
 * - Peeks from the bottom-right corner of the viewport.
 * - Interactive speech bubble with conversational dialogue, tips, and responses.
 * - Interactive action chips (Pet, Spark, Tell me a thought, Chat input).
 * - Synthesized purring & meowing audio via Web Audio API.
 * - Minimize/nap mode toggle.
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCat3D);
  } else {
    initCat3D();
  }

  function initCat3D() {
    if (typeof THREE === 'undefined') return;

    // Create Cat DOM Container
    const catWidget = document.createElement('div');
    catWidget.id = 'mochi-cat-widget';
    catWidget.className = 'mochi-cat-widget';
    catWidget.innerHTML = `
      <div id="mochi-dialogue-bubble" class="mochi-dialogue-bubble">
        <div class="mochi-dialogue-header">
          <span class="mochi-name">🐱 Mochi</span>
          <span class="mochi-status-tag">Garden Companion</span>
          <button id="mochi-close-dialogue" class="mochi-bubble-close" aria-label="Dismiss message">✕</button>
        </div>
        <div id="mochi-dialogue-text" class="mochi-dialogue-text">
          *purr...* Welcome to Nilesh's Second Brain! Need a thought or want to fire the 3D neural brain?
        </div>
        <div class="mochi-interactive-chips" id="mochi-chips">
          <button class="mochi-chip" data-action="pet">🐾 Pet Mochi</button>
          <button class="mochi-chip" data-action="thought">💡 Share a Thought</button>
          <button class="mochi-chip" data-action="pulse">⚡ Fire Pulse</button>
          <button class="mochi-chip" data-action="joke">😸 Tech Joke</button>
        </div>
        <form id="mochi-chat-form" class="mochi-chat-form">
          <input type="text" id="mochi-user-input" class="mochi-chat-input" placeholder="Say something to Mochi..." autocomplete="off">
          <button type="submit" class="mochi-chat-send" aria-label="Send message">💬</button>
        </form>
      </div>

      <div id="mochi-canvas-container" class="mochi-canvas-container" title="Click Mochi to talk or pet!">
        <div class="mochi-peek-prompt" id="mochi-peek-prompt">Psst! 👋</div>
      </div>
    `;
    document.body.appendChild(catWidget);

    const canvasContainer = document.getElementById('mochi-canvas-container');
    const bubble = document.getElementById('mochi-dialogue-bubble');
    const dialogueText = document.getElementById('mochi-dialogue-text');
    const peekPrompt = document.getElementById('mochi-peek-prompt');
    const closeBtn = document.getElementById('mochi-close-dialogue');
    const chatForm = document.getElementById('mochi-chat-form');
    const chatInput = document.getElementById('mochi-user-input');

    // 1. Three.js Scene Setup for Cat
    const width = 160;
    const height = 170;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 5.2);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0fa, 1.2);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0xa78bfa, 1.5, 10);
    backLight.position.set(-2, 1, -1);
    scene.add(backLight);

    // 2. Build Procedural 3D Chibi Cat Model
    const catGroup = new THREE.Group();
    scene.add(catGroup);
    catGroup.position.set(0, -0.6, 0);

    const headGroup = new THREE.Group();
    catGroup.add(headGroup);

    // Materials
    function getCatMaterials() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        body: new THREE.MeshStandardMaterial({
          color: isDark ? 0x221f3b : 0xfef9f3,
          roughness: 0.5,
          metalness: 0.1
        }),
        snout: new THREE.MeshStandardMaterial({
          color: isDark ? 0x312d50 : 0xffffff,
          roughness: 0.6
        }),
        innerEar: new THREE.MeshStandardMaterial({
          color: 0xf472b6, // Soft pink
          roughness: 0.5
        }),
        eyes: new THREE.MeshBasicMaterial({
          color: isDark ? 0x38bdf8 : 0x0f172a // Sky blue in dark, deep slate in light
        }),
        pupilHighlight: new THREE.MeshBasicMaterial({
          color: 0xffffff
        }),
        nose: new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.4
        }),
        collar: new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          metalness: 0.3
        }),
        bell: new THREE.MeshStandardMaterial({
          color: 0xfbbf24, // Gold bell
          metalness: 0.8,
          roughness: 0.2
        }),
        paws: new THREE.MeshStandardMaterial({
          color: isDark ? 0x2e2a4a : 0xffffff,
          roughness: 0.6
        })
      };
    }

    let mats = getCatMaterials();

    // Head
    const headGeo = new THREE.SphereGeometry(1.0, 32, 32);
    headGeo.scale(1.15, 1.0, 1.05);
    const headMesh = new THREE.Mesh(headGeo, mats.body);
    headGroup.add(headMesh);

    // Ears (Cones)
    const earGeo = new THREE.ConeGeometry(0.38, 0.7, 16);
    earGeo.rotateZ(0.1);

    const leftEar = new THREE.Mesh(earGeo, mats.body);
    leftEar.position.set(-0.65, 0.85, 0.05);
    leftEar.rotation.z = 0.35;
    leftEar.rotation.x = -0.15;
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, mats.body);
    rightEar.position.set(0.65, 0.85, 0.05);
    rightEar.rotation.z = -0.35;
    rightEar.rotation.x = -0.15;
    headGroup.add(rightEar);

    // Pink Inner Ears
    const innerEarGeo = new THREE.ConeGeometry(0.24, 0.5, 16);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, mats.innerEar);
    leftInnerEar.position.set(-0.63, 0.82, 0.1);
    leftInnerEar.rotation.z = 0.35;
    leftInnerEar.rotation.x = -0.15;
    headGroup.add(leftInnerEar);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, mats.innerEar);
    rightInnerEar.position.set(0.63, 0.82, 0.1);
    rightInnerEar.rotation.z = -0.35;
    rightInnerEar.rotation.x = -0.15;
    headGroup.add(rightInnerEar);

    // Cute Muzzle / Cheeks
    const snoutGeo = new THREE.SphereGeometry(0.35, 20, 20);
    snoutGeo.scale(1.2, 0.75, 0.8);
    const snoutMesh = new THREE.Mesh(snoutGeo, mats.snout);
    snoutMesh.position.set(0, -0.22, 0.88);
    headGroup.add(snoutMesh);

    // Nose (Pink inverted triangle / small sphere)
    const noseGeo = new THREE.SphereGeometry(0.08, 12, 12);
    noseGeo.scale(1.2, 0.8, 0.8);
    const noseMesh = new THREE.Mesh(noseGeo, mats.nose);
    noseMesh.position.set(0, -0.12, 1.12);
    headGroup.add(noseMesh);

    // Big Cute Anime / Chibi Eyes
    const eyeGeo = new THREE.SphereGeometry(0.18, 20, 20);
    eyeGeo.scale(1.0, 1.25, 0.5);

    const leftEye = new THREE.Mesh(eyeGeo, mats.eyes);
    leftEye.position.set(-0.42, 0.05, 0.95);
    leftEye.rotation.y = -0.2;
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, mats.eyes);
    rightEye.position.set(0.42, 0.05, 0.95);
    rightEye.rotation.y = 0.2;
    headGroup.add(rightEye);

    // Specular eye catchlights (White sparkle)
    const catchGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const leftCatch = new THREE.Mesh(catchGeo, mats.pupilHighlight);
    leftCatch.position.set(-0.45, 0.12, 1.05);
    headGroup.add(leftCatch);

    const rightCatch = new THREE.Mesh(catchGeo, mats.pupilHighlight);
    rightCatch.position.set(0.39, 0.12, 1.05);
    headGroup.add(rightCatch);

    // Collar & Tiny Bell
    const collarGeo = new THREE.TorusGeometry(0.85, 0.07, 12, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeo, mats.collar);
    collarMesh.position.set(0, -0.85, 0);
    catGroup.add(collarMesh);

    const bellGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const bellMesh = new THREE.Mesh(bellGeo, mats.bell);
    bellMesh.position.set(0, -0.92, 0.88);
    catGroup.add(bellMesh);

    // Cute Paws Peeking Over Edge
    const pawGeo = new THREE.SphereGeometry(0.24, 16, 16);
    pawGeo.scale(1.1, 0.7, 1.4);

    const leftPaw = new THREE.Mesh(pawGeo, mats.paws);
    leftPaw.position.set(-0.55, -0.98, 0.75);
    catGroup.add(leftPaw);

    const rightPaw = new THREE.Mesh(pawGeo, mats.paws);
    rightPaw.position.set(0.55, -0.98, 0.75);
    catGroup.add(rightPaw);

    // 3. Audio Synthesizer for Cat (Purr & Meow via Web Audio API)
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
          // Cute pitch bend down: 880Hz -> 540Hz
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
          osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.45);

          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'purr') {
          // Soft rhythmic motor hum
          for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(45, ctx.currentTime + i * 0.12);

            gain.gain.setValueAtTime(0.02, ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.11);
          }
        }
      } catch (e) {}
    }

    // 4. Cat Dialogue & Knowledge Engine
    const catThoughts = [
      "🐾 *Paw note:* Scalability is like running a tea stall. More kettles > one giant kettle!",
      "⚡ In system design, simplicity is what survives. Complexity is just Jenga waiting to fall.",
      "📦 Spark drivers plan the menu, executors cook the data! I just eat the results.",
      "🧠 Context engineering shapes how AI thinks. Just like how shaking a treat bag shapes where I run!",
      "🌐 Have you tried the 3D Knowledge Graph above? Press 'P' to fire an energy pulse through the brain!",
      "🔍 Looking for something specific? Press '/' on your keyboard to instantly filter insights.",
      "💡 Direct Lake mode in Power BI bypasses scheduled refreshes. Faster queries, more nap time!"
    ];

    const catJokes = [
      "Why do data engineers love cats? Because we both love purr-sistent storage!",
      "There are 10 types of cats: those who understand binary, and those who sit on your keyboard.",
      "My human writes Apache Spark pipelines. I prefer Apache Nap.",
      "Why did the database break up with the table? There were too many relational issues!"
    ];

    function showDialogue(text, sound = 'meow') {
      if (peekPrompt) peekPrompt.style.display = 'none';
      dialogueText.innerHTML = text;
      bubble.classList.add('visible');
      playCatSound(sound);
    }

    // Interactive Action Chips
    const chipsContainer = document.getElementById('mochi-chips');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.mochi-chip');
        if (!btn) return;
        const action = btn.dataset.action;

        if (action === 'pet') {
          showDialogue("*Purrrrrr...* 😻 That feels amazing! Nilesh's brain synapses are firing smoothly today!", 'purr');
          spawnHearts();
          bounceCat();
        } else if (action === 'thought') {
          const randomThought = catThoughts[Math.floor(Math.random() * catThoughts.length)];
          showDialogue(randomThought, 'meow');
          bounceCat();
        } else if (action === 'pulse') {
          showDialogue("⚡ *POW!* Firing synaptic shockwave across the 3D brain!", 'meow');
          if (window.triggerBrainPulse) window.triggerBrainPulse();
          bounceCat();
        } else if (action === 'joke') {
          const joke = catJokes[Math.floor(Math.random() * catJokes.length)];
          showDialogue(joke, 'meow');
          bounceCat();
        }
      });
    }

    // Chat Form Submission
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (chatInput.value || '').trim();
        if (!query) return;

        chatInput.value = '';
        const q = query.toLowerCase();

        let reply = "Meow? That sounds intriguing! Have you searched for that in Nilesh's garden using the '/' shortcut?";

        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
          reply = "Meowdy! 👋 I'm Mochi, your Second Brain familiar. What shall we explore?";
        } else if (q.includes('spark') || q.includes('apache')) {
          reply = "Spark? The master chef of big data! Check out Issue #4 above for the full architectural breakdown.";
        } else if (q.includes('system design') || q.includes('architecture')) {
          reply = "Scalability, reliability, observability, and simplicity! Check out Issue #1 and Issue #7 in the garden.";
        } else if (q.includes('ai') || q.includes('llm') || q.includes('context')) {
          reply = "Context is everything! Context engineering shapes the reasoning environment for AI models.";
        } else if (q.includes('name') || q.includes('who are you')) {
          reply = "I'm Mochi! A 3D companion guardian of Nilesh's thoughts, ideas, and data architecture insights.";
        } else if (q.includes('cute') || q.includes('good cat') || q.includes('love')) {
          reply = "*Purrr!* ( ^ ﻌ ^ ) Thank you! You get +10 Brain Sparks today!";
          spawnHearts();
        }

        showDialogue(reply, 'meow');
        bounceCat();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        bubble.classList.remove('visible');
      });
    }

    // Click on Cat triggers dialogue / greeting
    canvasContainer.addEventListener('click', () => {
      if (!bubble.classList.contains('visible')) {
        showDialogue("Meow! 👋 Need a guided tour or a thought from the garden?", 'meow');
        bounceCat();
      } else {
        bounceCat();
        playCatSound('purr');
      }
    });

    function bounceCat() {
      catGroup.position.y = -0.2;
      setTimeout(() => { catGroup.position.y = -0.6; }, 250);
    }

    function spawnHearts() {
      const rect = canvasContainer.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'mochi-heart-particle';
        heart.textContent = ['💖', '✨', '🐾', '🌸'][Math.floor(Math.random() * 4)];
        heart.style.left = `${rect.left + 50 + (Math.random() - 0.5) * 40}px`;
        heart.style.top = `${rect.top + 30}px`;
        heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 60}px`);
        heart.style.setProperty('--dy', `${-50 - Math.random() * 40}px`);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
      }
    }

    // 5. Kinematics & Animation (Head Tracking, Ear Twitch, Blinking)
    let mouseNorm = { x: 0, y: 0 };
    let targetHeadRot = { x: 0, y: 0 };
    let blinkTimer = 0;
    let isBlinking = false;

    window.addEventListener('mousemove', (e) => {
      const rect = canvasContainer.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2;

      mouseNorm.x = (e.clientX - catCenterX) / window.innerWidth;
      mouseNorm.y = -(e.clientY - catCenterY) / window.innerHeight;

      // Bound head rotation
      targetHeadRot.y = Math.max(-0.55, Math.min(0.55, mouseNorm.x * 1.5));
      targetHeadRot.x = Math.max(-0.35, Math.min(0.35, -mouseNorm.y * 1.2));
    }, { passive: true });

    // Initial greeting after 3 seconds
    setTimeout(() => {
      if (peekPrompt) peekPrompt.classList.add('visible');
    }, 2500);

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Smooth Head Tracking towards cursor
      headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetHeadRot.y, 0.08);
      headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, targetHeadRot.x, 0.08);

      // Cute ear twitch
      leftEar.rotation.z = 0.35 + Math.sin(t * 3.5) * 0.05 + (Math.sin(t * 12) > 0.8 ? 0.12 : 0);
      rightEar.rotation.z = -0.35 - Math.cos(t * 3.2) * 0.05 - (Math.sin(t * 10) > 0.85 ? 0.12 : 0);

      // Gentle breathing body bob
      catGroup.position.y = -0.6 + Math.sin(t * 2.2) * 0.04;

      // Bell subtle jingle
      bellMesh.position.y = -0.92 + Math.sin(t * 4.4) * 0.02;

      // Blinking animation
      blinkTimer += 0.016;
      if (blinkTimer > 3.8 && !isBlinking) {
        isBlinking = true;
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
        setTimeout(() => {
          leftEye.scale.y = 1.25;
          rightEye.scale.y = 1.25;
          isBlinking = false;
          blinkTimer = Math.random() * 1.5;
        }, 150);
      }

      renderer.render(scene, camera);
    }
    animate();

    // Theme listener for Cat colors
    const themeObserver = new MutationObserver(() => {
      mats = getCatMaterials();
      headMesh.material = mats.body;
      leftEar.material = mats.body;
      rightEar.material = mats.body;
      snoutMesh.material = mats.snout;
      leftEye.material = mats.eyes;
      rightEye.material = mats.eyes;
      leftPaw.material = mats.paws;
      rightPaw.material = mats.paws;
    });
    themeObserver.observe(document.documentElement, { attributes: true });
  }
})();
