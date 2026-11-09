/* The useless machine and the bug game. One file, two toys, no dependencies. */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- machine */
  const box = document.getElementById('machine-box');
  const switchBtn = document.getElementById('machine-switch');
  const status = document.getElementById('machine-status');
  let machineTimer = 0;

  if (box && switchBtn && status) {
    const setText = (text) => { status.textContent = text; };

    switchBtn.addEventListener('click', () => {
      const isOn = box.classList.contains('is-open');

      if (isOn) {
        /* Someone switched it off by hand: put it back to sleep. */
        box.classList.remove('is-open');
        switchBtn.setAttribute('aria-pressed', 'false');
        setText('Off');
        clearTimeout(machineTimer);
        return;
      }

      box.classList.add('is-open');
      switchBtn.setAttribute('aria-pressed', 'true');
      setText('On');
      clearTimeout(machineTimer);

      /* The hand comes out, and the machine switches itself off again. */
      machineTimer = window.setTimeout(() => {
        box.classList.remove('is-open');
        switchBtn.setAttribute('aria-pressed', 'false');
        setText('Off');
      }, reduced ? 60 : 1500);
    });
  }

  /* ------------------------------------------------------------------- game */
  const field = document.getElementById('game-field');
  const bug = document.getElementById('bug');
  const idle = document.getElementById('game-idle');
  const scoreEl = document.getElementById('game-score');
  const timeEl = document.getElementById('game-time');
  const startBtn = document.getElementById('game-start');
  const stopBtn = document.getElementById('game-stop');
  const bestEl = document.getElementById('game-best');

  if (!field || !bug || !scoreEl || !timeEl || !startBtn || !stopBtn) return;

  const ROUND_SECONDS = 30;
  const BEST_KEY = 'catch-the-bugs:best';
  const state = {
    running: false,
    caught: 0,
    seconds: ROUND_SECONDS,
    clock: 0,
    spawn: 0,
  };

  const readBest = () => {
    try { return Number(window.localStorage.getItem(BEST_KEY)) || 0; } catch (err) { return 0; }
  };
  const writeBest = (value) => {
    try { window.localStorage.setItem(BEST_KEY, String(value)); } catch (err) { /* private mode */ }
  };

  if (bestEl) bestEl.textContent = String(readBest());

  const paintScore = () => {
    scoreEl.textContent = String(state.caught);
    timeEl.textContent = String(state.seconds);
  };

  /* Place the bug somewhere inside the field, never half outside it. */
  function moveBug() {
    const pad = 8;
    const maxX = 100 - pad * 2;
    const maxY = 100 - pad * 2;
    const x = pad + Math.random() * maxX;
    const y = pad + Math.random() * maxY;
    bug.style.left = x + '%';
    bug.style.top = y + '%';
    bug.hidden = false;
  }

  function nextBug() {
    if (!state.running) return;
    moveBug();
    /* A bug that is not caught escapes after a moment and is replaced. */
    window.clearTimeout(state.spawn);
    state.spawn = window.setTimeout(() => {
      if (!state.running) return;
      bug.hidden = true;
      state.spawn = window.setTimeout(nextBug, 260);
    }, Math.max(900, 1600 - state.caught * 40));
  }

  function catchBug() {
    if (!state.running || bug.hidden) return;
    state.caught += 1;
    bug.hidden = true;
    paintScore();

    /* A little pop for feedback, skipped when motion is reduced. */
    if (!reduced) {
      bug.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.5)', opacity: 0 }],
        { duration: 180, easing: 'ease-out' }
      );
    }
    window.clearTimeout(state.spawn);
    state.spawn = window.setTimeout(nextBug, 220);
  }

  function tick() {
    state.seconds -= 1;
    paintScore();
    if (state.seconds <= 0) endGame();
  }

  function startGame() {
    state.running = true;
    state.caught = 0;
    state.seconds = ROUND_SECONDS;
    paintScore();
    bug.hidden = true;
    if (idle) idle.hidden = true;
    field.classList.add('is-running');
    startBtn.disabled = true;
    stopBtn.disabled = false;
    field.focus({ preventScroll: true });

    nextBug();
    window.clearInterval(state.clock);
    state.clock = window.setInterval(tick, 1000);
  }

  function endGame() {
    state.running = false;
    window.clearInterval(state.clock);
    window.clearTimeout(state.spawn);
    bug.hidden = true;
    field.classList.remove('is-running');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    startBtn.textContent = 'Play again';

    if (idle) {
      idle.hidden = false;
      idle.textContent = state.caught > 0
        ? `Time. You caught ${state.caught} bug${state.caught === 1 ? '' : 's'}.`
        : 'Time. No bugs this round — try again.';
    }

    if (state.caught > readBest()) {
      writeBest(state.caught);
      if (bestEl) bestEl.textContent = String(state.caught);
    }
  }

  startBtn.addEventListener('click', startGame);
  stopBtn.addEventListener('click', endGame);
  bug.addEventListener('click', catchBug);

  /* Keyboard: Enter or Space on the bug itself, or Enter on the field. */
  field.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && state.running) {
      event.preventDefault();
      catchBug();
    }
  });

  bug.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      catchBug();
    }
  });
})();
