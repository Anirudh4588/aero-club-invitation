/**
 * Aero Club Vignan - Oath Taking Ceremony
 * Interactive Digital Invitation Engine
 * Version 2.0: 5.0s Continuous Auto-Timer, Multi-Aircraft Sky Fleet & Advanced Swipe Gestures
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const curtainStage = document.getElementById('curtain-stage');
  const curtainSeal = document.getElementById('curtain-seal');
  const cardScene = document.getElementById('card-3d-scene');
  const book = document.getElementById('invitation-book');
  const pages = [
    document.getElementById('page-1'),
    document.getElementById('page-2')
  ];
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dots = document.querySelectorAll('.pagination-dots .dot');
  const timerCircle = document.getElementById('timer-circle');
  const timerLabel = document.getElementById('timer-label');
  const timerBadge = document.getElementById('timer-badge');
  const audioToggle = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const replayBtn = document.getElementById('replay-btn');
  const calendarBtn = document.getElementById('calendar-btn');

  // Configuration & State
  const AUTO_FLIP_SECONDS = 7.0; // 7.0 seconds per page
  const CIRCLE_CIRCUMFERENCE = 69.1; // 2 * Math.PI * 11
  let currentPage = 1;
  const totalPages = 2;
  let autoTimerInterval = null;
  let timerPaused = false;
  let soundEnabled = true;

  // Web Audio Context for synthesized chimes & aerodynamic whooshes
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playChime() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Ceremonial Fanfare)
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 1.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 1.5);
      });
    } catch (e) {
      console.log('Audio note error:', e);
    }
  }

  function playWhoosh() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Whoosh audio error:', e);
    }
  }

  // ==========================================
  // Automated 5.0s Page Turn Timer Engine
  // ==========================================
  function startAutoFlipTimer(durationSeconds = AUTO_FLIP_SECONDS) {
    clearAutoTimer();
    if (timerPaused) {
      timerLabel.textContent = 'Paused';
      return;
    }

    const totalMs = durationSeconds * 1000;
    const intervalMs = 50;
    let elapsedMs = 0;

    timerCircle.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE}`;
    timerCircle.style.strokeDashoffset = '0';
    timerLabel.textContent = `${durationSeconds.toFixed(1)}s`;
    timerBadge.style.opacity = '1';

    autoTimerInterval = setInterval(() => {
      if (timerPaused) return;

      elapsedMs += intervalMs;
      const remainingSec = Math.max(0, (totalMs - elapsedMs) / 1000);
      const progress = elapsedMs / totalMs;
      const offset = CIRCLE_CIRCUMFERENCE * progress;

      timerCircle.style.strokeDashoffset = `${offset}`;
      timerLabel.textContent = `${remainingSec.toFixed(1)}s`;

      if (elapsedMs >= totalMs) {
        clearAutoTimer();
        // Turn to next page in sequence (loops back to Page 1 from Page 3)
        const nextPage = (currentPage % totalPages) + 1;
        goToPage(nextPage);
      }
    }, intervalMs);
  }

  function clearAutoTimer() {
    if (autoTimerInterval) {
      clearInterval(autoTimerInterval);
      autoTimerInterval = null;
    }
  }

  // Toggle timer pause/resume on badge click
  timerBadge.addEventListener('click', () => {
    timerPaused = !timerPaused;
    if (timerPaused) {
      clearAutoTimer();
      timerLabel.textContent = 'Paused';
      timerBadge.style.borderColor = 'rgba(255,255,255,0.4)';
    } else {
      timerBadge.style.borderColor = '#D4AF37';
      startAutoFlipTimer(AUTO_FLIP_SECONDS);
    }
  });

  // ==========================================
  // Stage Curtain & Pop-up Sequence
  // ==========================================
  function openCurtains() {
    initAudio();
    playChime();

    // 1. Part Blue Stage Curtains
    curtainStage.classList.add('is-open');

    // 2. Pop up invitation card at majestic slower speed
    setTimeout(() => {
      cardScene.classList.add('popped-up');
      
      // 3. Start 5.0s timer for automated page turn
      startAutoFlipTimer(AUTO_FLIP_SECONDS);
    }, 600);

    setTimeout(() => {
      curtainStage.classList.add('opened');
    }, 2400);
  }

  // Tap seal to open
  curtainSeal.addEventListener('click', openCurtains);

  // Auto-trigger curtain opening after short delay
  setTimeout(() => {
    if (!curtainStage.classList.contains('is-open')) {
      openCurtains();
    }
  }, 900);

  // ==========================================
  // Page Transition Engine (Smooth 3D Flip)
  // ==========================================
  function goToPage(targetPage) {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;
    playWhoosh();

    currentPage = targetPage;
    book.setAttribute('data-current-page', currentPage);

    pages.forEach((pageEl, idx) => {
      const pageNum = idx + 1;
      pageEl.classList.remove('active', 'prev-flipped', 'next-queued');

      if (pageNum === currentPage) {
        pageEl.classList.add('active');
      } else if (pageNum < currentPage) {
        pageEl.classList.add('prev-flipped');
      } else {
        pageEl.classList.add('next-queued');
      }
    });

    // Update Pagination Dots
    dots.forEach((dot, idx) => {
      if (idx + 1 === currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Nav Buttons
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (currentPage === totalPages);

    // Automatically restart 5-second countdown timer on EVERY page turn!
    startAutoFlipTimer(AUTO_FLIP_SECONDS);
  }

  // Navigation Arrow Buttons
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    } else {
      // Loop to page 1 if next clicked on last page
      goToPage(1);
    }
  });

  // Pagination Dot Click Navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.getAttribute('data-page'), 10);
      goToPage(target);
    });
  });

  // Perforated Stub Action Hint Click
  const stubAction = document.querySelector('.stub-action-hint');
  if (stubAction) {
    stubAction.addEventListener('click', () => goToPage(2));
  }

  // ==========================================
  // Advanced Touch & Gesture Swipe Engine
  // (Works seamlessly across iOS Safari, Android Chrome, and Laptops)
  // ==========================================
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;
  let swipeThreshold = 35; // Minimum px distance for quick swipe response

  function onSwipeStart(x, y) {
    startX = x;
    startY = y;
    currentX = x;
    currentY = y;
    isDragging = true;
  }

  function onSwipeMove(x, y) {
    if (!isDragging) return;
    currentX = x;
    currentY = y;
  }

  function onSwipeEnd() {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX;
    const diffY = startY - currentY;

    // Check if horizontal swipe is dominant
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        // Swiped Left -> Go to Next Page
        if (currentPage < totalPages) {
          goToPage(currentPage + 1);
        } else {
          goToPage(1); // Loop back
        }
      } else {
        // Swiped Right -> Go to Previous Page
        if (currentPage > 1) {
          goToPage(currentPage - 1);
        } else {
          goToPage(totalPages); // Loop to last
        }
      }
    }
  }

  // 1. Touch Events (iOS / Android)
  cardScene.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      onSwipeStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  cardScene.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      onSwipeMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  cardScene.addEventListener('touchend', (e) => {
    onSwipeEnd();
  }, { passive: true });

  cardScene.addEventListener('touchcancel', () => {
    isDragging = false;
  });

  // 2. Mouse Drag Events (Laptop / Desktop)
  cardScene.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('iframe')) return;
    onSwipeStart(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      onSwipeMove(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      onSwipeEnd();
    }
  });

  // 3. Keyboard Arrow Navigation (Laptops / Keyboards)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      } else {
        goToPage(1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      } else {
        goToPage(totalPages);
      }
    }
  });

  // ==========================================
  // Replay Experience
  // ==========================================
  replayBtn.addEventListener('click', () => {
    curtainStage.classList.remove('opened', 'is-open');
    cardScene.classList.remove('popped-up');
    goToPage(1);
    clearAutoTimer();
    timerPaused = false;
    timerLabel.textContent = `${AUTO_FLIP_SECONDS.toFixed(1)}s`;
    timerBadge.style.opacity = '1';

    setTimeout(() => {
      openCurtains();
    }, 400);
  });

  // ==========================================
  // Audio Sound Effects Toggle
  // ==========================================
  audioToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      audioIcon.textContent = '🔊';
      audioToggle.style.color = '#FFFFFF';
      playChime();
    } else {
      audioIcon.textContent = '🔇';
      audioToggle.style.color = '#8FA8C2';
    }
  });

  // ==========================================
  // Calendar (.ics) Generator & 1-Click Download
  // ==========================================
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Aero Club VITS//Oath Taking Ceremony//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:aeroclub-oath-2026-vits@vignanits.ac.in',
        'DTSTAMP:20260915T120000Z',
        'DTSTART:20260917T051000Z', // 10:40 AM IST
        'DTEND:20260917T065000Z',   // 12:20 PM IST
        'SUMMARY:Aero Club Oath Taking Ceremony - Vignan ITS',
        'DESCRIPTION:Take the Oath, Fly Towards Your Dreams.\\nCordially invited to the Aero Club Oath Taking Ceremony at VITS Hyderabad.\\nExplore - Learn - Build - Soar.',
        'LOCATION:Vignan Institute of Technology and Science, Deshmukhi, Hyderabad, Telangana',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Aero_Club_Oath_Taking_Ceremony.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

});
