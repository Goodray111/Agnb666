/* Quotes page: search, theme filter, live count, and one random quote.
   Everything is read from the DOM, so the HTML is the single source of truth. */
(function () {
  'use strict';

  const grid = document.getElementById('quote-grid');
  if (!grid) return;

  const quotes = Array.from(grid.querySelectorAll('.quote'));
  const search = document.getElementById('quote-search');
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const count = document.getElementById('quote-count');
  const empty = document.getElementById('quote-empty');
  const randomBtn = document.getElementById('random-btn');
  const randomText = document.getElementById('random-quote');
  const randomAuthor = document.getElementById('random-author');

  let activeTheme = 'all';

  const normalise = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function applyFilter() {
    const term = normalise((search ? search.value : '').trim());
    let visible = 0;

    quotes.forEach((quote) => {
      const themeMatches = activeTheme === 'all' || quote.dataset.theme === activeTheme;
      const textMatches = !term || normalise(quote.dataset.text).includes(term)
        || normalise(quote.dataset.author).includes(term);
      const show = themeMatches && textMatches;

      quote.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} quote${visible === 1 ? '' : 's'}`;
    if (empty) empty.hidden = visible !== 0;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeTheme = chip.dataset.filter.toLowerCase().replace(/\s+/g, '-');
      chips.forEach((other) => {
        const on = other === chip;
        other.classList.toggle('is-active', on);
        other.setAttribute('aria-pressed', String(on));
      });
      applyFilter();
    });
  });

  if (search) {
    search.addEventListener('input', applyFilter);
    search.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        search.value = '';
        applyFilter();
      }
    });
  }
})();
