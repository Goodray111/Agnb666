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

})();
