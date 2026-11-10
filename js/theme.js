/* Theme: follow the system by default, remember an explicit choice. */
(function () {
  'use strict';

  const KEY = 'theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let current = root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');

  function stored() {
    try { return window.localStorage.getItem(KEY); } catch (err) { return null; }
  }

  function preferred() {
    const choice = stored();
    if (choice === 'dark' || choice === 'light') return choice;
    return media.matches ? 'dark' : 'light';
  }

  function paint(theme) {
    if (root.getAttribute('data-theme') !== theme) {
      root.setAttribute('data-theme', theme);
    }
    root.style.colorScheme = theme;

    document.querySelectorAll('.theme-toggle').forEach((button) => {
      const dark = theme === 'dark';
      const nextPressed = String(dark);
      const nextLabel = dark ? 'Switch to the light theme' : 'Switch to the dark theme';
      const nextIcon = dark ? 'Light' : 'Dark';

      if (button.getAttribute('aria-pressed') !== nextPressed) {
        button.setAttribute('aria-pressed', nextPressed);
      }
      if (button.getAttribute('aria-label') !== nextLabel) {
        button.setAttribute('aria-label', nextLabel);
      }
      if (button.textContent !== nextIcon) {
        button.textContent = nextIcon;
      }
      if (button.title !== (dark ? 'Switch to the light theme' : 'Switch to the dark theme')) {
        button.title = dark ? 'Switch to the light theme' : 'Switch to the dark theme';
      }
    });
    current = theme;
  }

  function save(theme) {
    try { window.localStorage.setItem(KEY, theme); } catch (err) { /* ignore */ }
  }

  paint(preferred());

  /* The navigation is injected after this file runs, so attach when it appears.
     The observer touches only the button's attributes, which cannot re-trigger a
     childList mutation — but disconnect after wiring anyway, to be certain. */
  function wire(button) {
    if (button.dataset.wired) return;
    button.dataset.wired = 'true';
    button.addEventListener('click', () => {
      const next = current === 'dark' ? 'light' : 'dark';
      paint(next);
      save(next);
    });
  }

  function wireAll() {
    document.querySelectorAll('.theme-toggle').forEach(wire);
    paint(current);
  }

  const nav = document.getElementById('site-nav');
  if (nav && 'MutationObserver' in window) {
    const observer = new MutationObserver(() => {
      wireAll();
      if (document.querySelector('.theme-toggle[data-wired]')) observer.disconnect();
    });
    observer.observe(nav, { childList: true, subtree: true });
  }
  window.addEventListener('DOMContentLoaded', wireAll);
  setTimeout(wireAll, 600);

  media.addEventListener('change', () => {
    if (!stored()) paint(media.matches ? 'dark' : 'light');
  });
})();
