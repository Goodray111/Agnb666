/* Notes page: a reading-progress bar, and "read" marks kept in localStorage. */
(function () {
  'use strict';

  const bar = document.getElementById('read-bar');
  const entries = Array.from(document.querySelectorAll('.note-entry[data-note]'));
  const KEY = 'notes:read';

  /* The real reading time of each entry, from its word count. */
  const minutes = (text) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));
  entries.forEach((entry) => {
    const body = entry.querySelectorAll('p, li');
    let words = 0;
    body.forEach((el) => { words += el.textContent.trim().split(/\s+/).length; });
    const label = entry.querySelector('.read-min');
    if (label) {
      const mins = Math.max(1, Math.round(words / 200));
      label.textContent = mins + ' min';
      label.dataset.min = String(mins);
    }
  });

  if (!entries.length) return;

  /* --- progress bar ------------------------------------------------------ */
  let ticking = false;
  function updateBar() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (bar) {
      bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
      bar.parentElement.setAttribute('aria-hidden', progress < 0.02 ? 'true' : 'false');
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateBar);
    }
  }, { passive: true });
  updateBar();

  /* --- "read" state ------------------------------------------------------ */
  const read = new Set();
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    if (Array.isArray(stored)) stored.forEach((id) => read.add(id));
  } catch (err) { /* storage blocked: the marks simply do not persist */ }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(Array.from(read))); } catch (err) {}
  }

  entries.forEach((entry) => {
    const id = entry.dataset.note;
    const head = entry.querySelector('.note-head');
    if (!head) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'note-read';
    button.addEventListener('click', () => {
      const now = !read.has(id);
      if (now) { read.add(id); } else { read.delete(id); }
      button.setAttribute('aria-pressed', String(now));
      button.textContent = now ? 'Read ✓' : 'Mark as read';
      entry.classList.toggle('is-read', now);
      save();
    });

    const isRead = read.has(id);
    button.setAttribute('aria-pressed', String(isRead));
    button.textContent = isRead ? 'Read ✓' : 'Mark as read';
    entry.classList.toggle('is-read', isRead);
    head.appendChild(button);
  });
})();
