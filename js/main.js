/* Shared behaviour for every page. Small, dependency-free, and optional:
   the pages read fine with JavaScript switched off. */
(function () {
  'use strict';

  /* 1. Reveal sections as they come into view (skipped when the user asks
        for less motion, or when the browser has no IntersectionObserver). */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealables = document.querySelectorAll('.section, .hero, .machine, .game, .page-head');

  if (!reduced && 'IntersectionObserver' in window) {
    revealables.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach((el) => {
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.92 && box.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        io.observe(el);
      }
    });

    /* Failsafe: nothing stays invisible. If an element was never revealed
       (a very tall page, a browser quirk), show it after a moment. */
    window.setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-revealed');
        }
      });
    }, 1200);
  }

  /* 2. Back-to-top: appears after the first screen, jumps home when clicked. */
  const top = document.createElement('button');
  top.type = 'button';
  top.className = 'to-top';
  top.textContent = 'Back to top';
  top.hidden = true;
  document.body.appendChild(top);

  const onScroll = () => { top.hidden = window.scrollY < 600; };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  top.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    const skip = document.querySelector('a.skip-link');
    if (skip) { skip.focus({ preventScroll: true }); }
  });

  /* 3. Current year in the footer, so the site does not age. */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
