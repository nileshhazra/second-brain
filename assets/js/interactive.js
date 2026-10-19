/**
 * Second Brain - Interactive Elements & Micro-Interactions Engine
 * Features:
 * - Instant post search & tag filtering with live counts
 * - 3D card perspective tilt & sheen effect
 * - Reading progress indicator
 * - Code snippet copy buttons with animated feedback
 * - Interactive post reactions (Sparks) with particle burst
 * - Web Share & Copy link toast
 * - Ambient cursor spotlight
 * - Circular scroll-to-top progress indicator
 * - Web Audio API procedural sound effects (synapse pulse, click)
 */

(function () {
  'use strict';

  // 1. Procedural Web Audio Engine (Zero external audio files needed)
  const AudioEngine = (function () {
    let ctx = null;
    let isMuted = localStorage.getItem('sound-muted') === 'true';

    function getContext() {
      if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      return ctx;
    }

    return {
      isMuted: () => isMuted,
      toggleMute: () => {
        isMuted = !isMuted;
        localStorage.setItem('sound-muted', isMuted);
        return isMuted;
      },
      playPulse: () => {
        if (isMuted) return;
        try {
          const c = getContext();
          if (!c) return;
          const osc = c.createOscillator();
          const gain = c.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(780, c.currentTime + 0.25);

          gain.gain.setValueAtTime(0.04, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.28);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start();
          osc.stop(c.currentTime + 0.3);
        } catch (e) {}
      },
      playClick: () => {
        if (isMuted) return;
        try {
          const c = getContext();
          if (!c) return;
          const osc = c.createOscillator();
          const gain = c.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(540, c.currentTime);
          osc.frequency.exponentialRampToValueAtTime(220, c.currentTime + 0.08);

          gain.gain.setValueAtTime(0.03, c.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.09);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start();
          osc.stop(c.currentTime + 0.1);
        } catch (e) {}
      }
    };
  })();

  window.SecondBrainAudio = AudioEngine;

  document.addEventListener('DOMContentLoaded', () => {
    initSearchAndFilter();
    init3DCardTilt();
    initCodeCopyButtons();
    initReadingProgress();
    initPostReactions();
    initShareButtons();
    initCursorSpotlight();
    initBackToTop();
    initAudioToggle();
    initGlobalShortcuts();
  });

  // 2. Instant Post Search & Tag Filtering
  function initSearchAndFilter() {
    const searchInput = document.getElementById('post-search-input');
    const searchClear = document.getElementById('search-clear-btn');
    const tagButtons = document.querySelectorAll('.filter-tag-pill');
    const postItems = document.querySelectorAll('.post-item-card');
    const countDisplay = document.getElementById('search-results-count');
    const emptyState = document.getElementById('search-empty-state');

    if (!postItems.length) return;

    let activeTag = 'all';
    let searchQuery = '';

    function filterPosts() {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      postItems.forEach(item => {
        const title = (item.dataset.title || '').toLowerCase();
        const excerpt = (item.dataset.excerpt || '').toLowerCase();
        const tags = (item.dataset.tags || '').toLowerCase();

        const matchesTag = (activeTag === 'all') || tags.includes(activeTag.toLowerCase());
        const matchesQuery = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q);

        if (matchesTag && matchesQuery) {
          item.style.display = 'block';
          item.classList.remove('filtered-out');
          visibleCount++;
        } else {
          item.style.display = 'none';
          item.classList.add('filtered-out');
        }
      });

      if (countDisplay) {
        countDisplay.textContent = `Showing ${visibleCount} of ${postItems.length} thought${postItems.length === 1 ? '' : 's'}`;
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      if (searchClear) {
        searchClear.style.display = q ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterPosts();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchInput.focus();
        filterPosts();
        AudioEngine.playClick();
      });
    }

    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTag = btn.dataset.tag || 'all';
        AudioEngine.playClick();
        filterPosts();
      });
    });

    // Reset filter button in empty state
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        activeTag = 'all';
        tagButtons.forEach(b => b.classList.toggle('active', b.dataset.tag === 'all'));
        filterPosts();
      });
    }
  }

  // 3. Interactive 3D Perspective Card Tilt
  function init3DCardTilt() {
    // Only apply tilt on fine-pointer devices (not touch screens)
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;

        // Specular sheen highlight
        card.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, border-color 0.2s ease, box-shadow 0.2s ease';
      });
    });
  }

  // 4. Interactive Code Block Copy Buttons
  function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre > code');
    codeBlocks.forEach(codeEl => {
      const pre = codeEl.parentElement;
      if (!pre || pre.dataset.hasCopyBtn) return;
      pre.dataset.hasCopyBtn = 'true';

      // Detect language from class (e.g. language-python)
      let lang = 'code';
      codeEl.classList.forEach(cls => {
        if (cls.startsWith('language-')) {
          lang = cls.replace('language-', '');
        }
      });

      // Wrapper bar
      const bar = document.createElement('div');
      bar.className = 'code-header-bar';

      const langSpan = document.createElement('span');
      langSpan.className = 'code-lang-tag';
      langSpan.textContent = lang.toUpperCase();

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.innerHTML = `
        <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>Copy</span>
      `;

      copyBtn.addEventListener('click', async () => {
        const text = codeEl.innerText;
        try {
          await navigator.clipboard.writeText(text);
          AudioEngine.playClick();
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code: ', err);
        }
      });

      bar.appendChild(langSpan);
      bar.appendChild(copyBtn);
      pre.parentNode.insertBefore(bar, pre);
    });
  }

  // 5. Reading Progress Bar for Posts
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 6. Interactive Post Reactions (Sparks) with Particle Explosions
  function initPostReactions() {
    const reactionBtn = document.getElementById('spark-reaction-btn');
    if (!reactionBtn) return;

    const countSpan = document.getElementById('spark-reaction-count');
    const postId = window.location.pathname;
    const storageKey = `second-brain-spark-${postId}`;

    let count = parseInt(localStorage.getItem(storageKey) || '0', 10);
    if (countSpan) countSpan.textContent = count;

    reactionBtn.addEventListener('click', (e) => {
      count++;
      localStorage.setItem(storageKey, count);
      if (countSpan) countSpan.textContent = count;

      reactionBtn.classList.add('bouncing');
      setTimeout(() => reactionBtn.classList.remove('bouncing'), 400);

      AudioEngine.playPulse();

      // Spawn floating particle burst
      spawnParticleBurst(e.clientX, e.clientY);
    });
  }

  function spawnParticleBurst(x, y) {
    const particles = ['🧠', '⚡', '✨', '💡', '🔥'];
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.className = 'spark-float-particle';
      p.textContent = particles[Math.floor(Math.random() * particles.length)];

      const angle = (Math.PI * 2 * i) / 8;
      const dist = 40 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30;

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  // 7. Interactive Share Button & Toast
  function initShareButtons() {
    const shareBtn = document.getElementById('btn-share-post');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', async () => {
      AudioEngine.playClick();
      const shareData = {
        title: document.title,
        text: 'Check out this thought on Second Brain:',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (e) {
          // Fall back to copy url
        }
      }

      // Copy link fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard! 📋');
      } catch (err) {
        showToast('Failed to copy link');
      }
    });
  }

  function showToast(message) {
    let toast = document.getElementById('sb-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sb-toast';
      toast.className = 'sb-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2500);
  }

  // 8. Subtle Cursor Spotlight Glow
  function initCursorSpotlight() {
    if (window.matchMedia('(hover: none)').matches) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-ambient-spotlight';
    document.body.appendChild(spotlight);

    window.addEventListener('mousemove', (e) => {
      spotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });
  }

  // 9. Back To Top Button with Circular Progress
  function initBackToTop() {
    const topBtn = document.getElementById('back-to-top-btn');
    const circle = document.getElementById('back-to-top-circle');
    if (!topBtn) return;

    const circumference = 2 * Math.PI * 18; // r = 18

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > 350) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }

      if (circle && maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        const offset = circumference - progress * circumference;
        circle.style.strokeDashoffset = offset;
      }
    }, { passive: true });

    topBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 10. Audio Mute Toggle Button
  function initAudioToggle() {
    const audioBtn = document.getElementById('sound-toggle-btn');
    if (!audioBtn) return;

    function updateIcon() {
      const muted = AudioEngine.isMuted();
      audioBtn.setAttribute('title', muted ? 'Unmute interactive sounds' : 'Mute interactive sounds');
      audioBtn.classList.toggle('muted', muted);
    }

    updateIcon();

    audioBtn.addEventListener('click', () => {
      const muted = AudioEngine.toggleMute();
      updateIcon();
      if (!muted) {
        AudioEngine.playPulse();
      }
    });
  }

  // 11. Global Keyboard Shortcuts
  function initGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Focus search on '/' or 'Cmd+K' / 'Ctrl+K'
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const searchInput = document.getElementById('post-search-input');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.select();
        }
      }

      // 'T' to toggle theme
      if (e.key === 't' && !e.metaKey && !e.ctrlKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) toggle.click();
      }

      // 'P' to trigger brain pulse
      if (e.key === 'p' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (window.triggerBrainPulse) {
          window.triggerBrainPulse();
        }
      }
    });
  }
})();
