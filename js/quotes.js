/* Quotes page: search, theme filters, favourites, live count and random quote.
   Everything is read from the DOM, so the HTML stays the single source of truth. */
(function () {
  'use strict';

  const grid = document.getElementById('quote-grid');
  if (!grid) return;

  const quotes = Array.from(grid.querySelectorAll('.quote'));
  const search = document.getElementById('quote-search');
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const count = document.getElementById('quote-count');
  const empty = document.getElementById('quote-empty');
  const favCount = document.getElementById('fav-count');
  const favChip = document.querySelector('.chip[data-filter="favourites"]');
  const randomBtn = document.getElementById('random-btn');
  const randomText = document.getElementById('random-quote');
  const randomAuthor = document.getElementById('random-author');

  const FAV_KEY = 'quotes:favs';
  const favourites = new Set();

  try {
    const stored = JSON.parse(window.localStorage.getItem(FAV_KEY) || '[]');
    if (Array.isArray(stored)) stored.forEach((i) => favourites.add(Number(i)));
  } catch (err) { /* storage blocked — favourites just do not persist */ }

  let activeTheme = 'all';

  const normalise = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function saveFavourites() {
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favourites)));
    } catch (err) { /* ignore */ }
  }

  function updateFavCount() {
    if (!favCount) return;
    favCount.textContent = String(favourites.size);
  }

  /* --- favourite buttons, one per quote --------------------------------- */
  quotes.forEach((quote, index) => {
    quote.dataset.index = String(index);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quote-fav';
    button.setAttribute('aria-pressed', String(favourites.has(index)));
    button.innerHTML = '<span class="quote-fav-icon" aria-hidden="true">♥</span>'
      + '<span class="visually-hidden">Save this quote</span>';

    button.addEventListener('click', () => {
      const now = !favourites.has(index);
      if (now) { favourites.add(index); } else { favourites.delete(index); }
      button.setAttribute('aria-pressed', String(now));
      quote.classList.toggle('is-fav', now);
      saveFavourites();
      updateFavCount();
      if (activeTheme === 'favourites') applyFilter();
    });

    quote.classList.toggle('is-fav', favourites.has(index));
    quote.appendChild(button);
  });

  /* --- filtering --------------------------------------------------------- */
  function applyFilter() {
    const term = normalise((search ? search.value : '').trim());
    let visible = 0;

    quotes.forEach((quote) => {
      const index = Number(quote.dataset.index);
      const themeMatches =
        activeTheme === 'all' ? true :
        activeTheme === 'favourites' ? favourites.has(index) :
        quote.dataset.theme === activeTheme;
      const textMatches = !term || normalise(quote.dataset.text).includes(term)
        || normalise(quote.dataset.author).includes(term);
      const show = themeMatches && textMatches;

      quote.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} quote${visible === 1 ? '' : 's'}`;
    if (empty) {
      empty.hidden = visible !== 0;
      empty.textContent = activeTheme === 'favourites'
        ? 'No favourites yet — press the heart on a quote you want to keep.'
        : 'No quote matches that. Try a shorter word.';
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeTheme = chip.dataset.filter;
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

  /* --- one random quote -------------------------------------------------- */
  function randomQuote() {
    const pick = quotes[Math.floor(Math.random() * quotes.length)];
    const text = pick.querySelector('blockquote p');
    const author = pick.querySelector('cite');
    if (!text || !author) return;

    if (randomText) randomText.textContent = text.textContent.trim();
    if (randomAuthor) randomAuthor.textContent = '— ' + author.textContent.trim();
  }

  if (randomBtn) randomBtn.addEventListener('click', randomQuote);

  updateFavCount();
  applyFilter();
})();
