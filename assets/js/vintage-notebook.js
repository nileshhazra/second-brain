/**
 * Second Brain - Interactive 3D Vintage Notebook & Field Journal Engine
 * Author: Nilesh Hazra Digital Garden
 * 
 * Features:
 * - 3D Perspective Desk Tilt with smooth physics lerping
 * - Tactile 3D page flipping with realistic paper curl transitions
 * - Index bookmark tab navigation & corner dog-ear page turn
 * - Procedural Web Audio paper rustle synthesizer (zero external audio files)
 * - Interactive Latency Codex scale with human-scale order-of-magnitude comparisons
 * - Touch swipe & keyboard arrow navigation
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVintageNotebook);
  } else {
    initVintageNotebook();
  }

  function initVintageNotebook() {
    const stageContainer = document.getElementById('vintage-stage-container');
    const notebook = document.getElementById('vintage-notebook');
    if (!stageContainer || !notebook) return;

    // State
    let currentPage = 1;
    const totalPages = 4;
    let isTiltEnabled = true;
    let isSoundEnabled = localStorage.getItem('sound-muted') !== 'true';
    let isFlipping = false;

    // DOM Elements
    const prevBtn = document.getElementById('btn-notebook-prev');
    const nextBtn = document.getElementById('btn-notebook-next');
    const currentPageNumEl = document.getElementById('current-page-num');
    const tabs = document.querySelectorAll('.notebook-tab');
    const pages = document.querySelectorAll('.notebook-page');
    const soundToggleBtn = document.getElementById('btn-notebook-sound');
    const soundOnIcon = soundToggleBtn ? soundToggleBtn.querySelector('.sound-on-icon') : null;
    const soundOffIcon = soundToggleBtn ? soundToggleBtn.querySelector('.sound-off-icon') : null;
    const tiltToggleBtn = document.getElementById('btn-notebook-tilt');
    const dogEar = document.getElementById('notebook-dogear');
    const actionTurn2 = document.getElementById('action-turn-page-2');

    // Latency Ruler Elements
    const rulerTicks = document.querySelectorAll('.ruler-tick');
    const calloutOp = document.getElementById('callout-operation');
    const calloutFactor = document.getElementById('callout-factor');
    const calloutDesc = document.getElementById('callout-description');

    // 1. Procedural Web Audio Paper Rustle Synthesizer
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

    function playPaperRustle() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // Generate synthetic paper friction noise buffer
        const bufferSize = ctx.sampleRate * 0.16; // 160ms burst
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          // Modulated white noise with textured grain
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // Bandpass filter to sculpt organic parchment frequency range
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        filter.Q.value = 1.4;

        // Gain envelope
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseNode.start();
        noiseNode.stop(ctx.currentTime + 0.16);
      } catch (e) {
        // Fallback or silently pass
      }
    }

    function playTickSound() {
      if (!isSoundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } catch (e) {}
    }

    // 2. Page Navigation Engine
    function goToPage(targetPage, directionHint) {
      if (targetPage < 1 || targetPage > totalPages || (targetPage === currentPage && !directionHint)) return;
      if (isFlipping) return;
      isFlipping = true;

      const oldPage = currentPage;
      const isForward = targetPage > oldPage;
      currentPage = targetPage;

      // Update notebook dataset for styling
      notebook.setAttribute('data-current-page', currentPage);

      // Play authentic parchment rustle sound
      playPaperRustle();

      // Trigger 3D fold class
      const oldPageEl = document.getElementById(`notebook-page-${oldPage}`);
      const newPageEl = document.getElementById(`notebook-page-${currentPage}`);

      if (oldPageEl) {
        oldPageEl.classList.remove('active');
        oldPageEl.classList.add(isForward ? 'flip-out-forward' : 'flip-out-backward');
        setTimeout(() => {
          oldPageEl.classList.remove('flip-out-forward', 'flip-out-backward');
        }, 400);
      }

      if (newPageEl) {
        newPageEl.classList.add('active', isForward ? 'flip-in-forward' : 'flip-in-backward');
        setTimeout(() => {
          newPageEl.classList.remove('flip-in-forward', 'flip-in-backward');
          isFlipping = false;
        }, 400);
      } else {
        isFlipping = false;
      }

      // Update Page Indicator
      if (currentPageNumEl) {
        currentPageNumEl.textContent = currentPage < 10 ? `0${currentPage}` : `${currentPage}`;
      }

      // Update Index Tabs
      tabs.forEach(tab => {
        const pageNum = parseInt(tab.dataset.page, 10);
        if (pageNum === currentPage) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Update Button states
      if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
      }
      if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
      }
    }

    // Event Listeners for Prev / Next
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToPage(currentPage - 1, 'backward');
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToPage(currentPage + 1, 'forward');
      });
    }

    if (actionTurn2) {
      actionTurn2.addEventListener('click', () => {
        goToPage(2, 'forward');
      });
    }

    if (dogEar) {
      dogEar.addEventListener('click', () => {
        if (currentPage < totalPages) {
          goToPage(currentPage + 1, 'forward');
        } else {
          goToPage(1, 'backward');
        }
      });
    }

    // Tab buttons
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const p = parseInt(tab.dataset.page, 10);
        goToPage(p);
      });
    });

    // Sound toggle button
    if (soundToggleBtn) {
      function updateSoundUI() {
        if (soundOnIcon && soundOffIcon) {
          soundOnIcon.style.display = isSoundEnabled ? 'block' : 'none';
          soundOffIcon.style.display = isSoundEnabled ? 'none' : 'block';
        }
        soundToggleBtn.classList.toggle('active', isSoundEnabled);
      }
      updateSoundUI();

      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('sound-muted', (!isSoundEnabled).toString());
        updateSoundUI();
        if (isSoundEnabled) playPaperRustle();
      });
    }

    // 3. Silky 3D Perspective Desk Physics
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHovering = false;
    let animFrameId = null;

    if (tiltToggleBtn) {
      tiltToggleBtn.addEventListener('click', () => {
        isTiltEnabled = !isTiltEnabled;
        tiltToggleBtn.classList.toggle('active', isTiltEnabled);
        if (!isTiltEnabled) {
          notebook.style.transform = 'perspective(1400px) rotateX(2deg) rotateY(0deg) translateZ(0)';
        }
      });
    }

    stageContainer.addEventListener('mouseenter', () => {
      isHovering = true;
    });

    stageContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    });

    stageContainer.addEventListener('mousemove', (e) => {
      if (!isTiltEnabled) return;
      const rect = stageContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Normalise range to [-1, 1]
      mouse.targetX = (x - 0.5) * 2;
      mouse.targetY = (y - 0.5) * 2;
    });

    function render3DDeskPhysics() {
      if (isTiltEnabled) {
        // Spring lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        const rotX = 2 - mouse.y * 5.5; // Natural baseline tilt of 2 deg
        const rotY = mouse.x * 6.5;

        notebook.style.transform = `perspective(1400px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;
      }

      animFrameId = requestAnimationFrame(render3DDeskPhysics);
    }
    render3DDeskPhysics();

    // 4. Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      // Only handle if user isn't typing in search input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const rect = stageContainer.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToPage(currentPage + 1, 'forward');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPage(currentPage - 1, 'backward');
      }
    });

    // 5. Touch Swipe Support for Mobile Devices
    let touchStartX = 0;
    let touchStartY = 0;

    notebook.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    notebook.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // Only register horizontal swipes if horizontal distance exceeds vertical
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            goToPage(currentPage + 1, 'forward');
          } else {
            goToPage(currentPage - 1, 'backward');
          }
        }
      }
    }, { passive: true });

    // 6. Interactive Latency Codex Scale (Ruler)
    rulerTicks.forEach(tick => {
      tick.addEventListener('mouseenter', () => {
        playTickSound();
        rulerTicks.forEach(t => t.classList.remove('active'));
        tick.classList.add('active');

        const label = tick.dataset.label;
        const time = tick.dataset.time;
        const mult = tick.dataset.mult;
        const analogy = tick.dataset.analogy;

        if (calloutOp && calloutFactor && calloutDesc) {
          calloutOp.textContent = `${label} (${time})`;
          calloutFactor.textContent = `${mult} Scale Factor`;
          calloutDesc.textContent = `Human Scale: If L1 Cache took 1 heartbeat, this operation takes ${analogy}.`;
        }
      });
    });

    // Initialize first button states
    goToPage(1);
  }
})();
