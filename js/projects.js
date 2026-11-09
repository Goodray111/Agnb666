/* Ideas page: filter, sort, and a detail dialog with a "start this next" choice. */
(function () {
  'use strict';

  const grid = document.getElementById('idea-grid');
  if (!grid) return;

  const ideas = Array.from(grid.querySelectorAll('.idea'));
  const filter = document.getElementById('idea-filter');
  const sort = document.getElementById('idea-sort');
  const count = document.getElementById('idea-count');
  const empty = document.getElementById('idea-empty');

  const dialog = document.getElementById('idea-dialog');
  const dlgTitle = document.getElementById('idea-dialog-title');
  const dlgKicker = document.getElementById('idea-dialog-kicker');
  const dlgDesc = dialog ? dialog.querySelector('.idea-dialog-desc') : null;
  const dlgSteps = dialog ? dialog.querySelector('.idea-dialog-steps') : null;
  const dlgSkills = dialog ? dialog.querySelector('.idea-dialog-skills') : null;
  const dlgState = document.getElementById('idea-dialog-state');
  const startButton = document.getElementById('idea-start');
  const closeButton = document.getElementById('idea-close');

  const CHOSEN_KEY = 'ideas:chosen';

  /* The first three steps for each idea, keyed by the card's own number. */
  const PLANS = {
    ONE: ['Find a tide API for one bay and print the next high tide in the console.',
          'Turn it into a countdown card: hours, minutes, seconds to the next event.',
          'Add the weekly table and a plain-text forecast line, then make it responsive.'],
    TWO: ['Decide the data shape: ingredients with an amount and a unit.',
          'Add a “people” control and recalculate every amount from the base recipe.',
          'Round sensibly (2 / 0.5 / 0.25) and test 1, 2, 4 and 6 people.'],
    THREE: ['Draw the board in the DOM — a grid of divs is enough, no canvas.',
            'Move one player with the arrow keys and stop it leaving the board.',
            'Add a goal, a score and a restart; test with the keyboard only.'],
    FOUR: ['Sketch the book record: title, author, pages, rating, finished date.',
           'Build the form and the list, saving to localStorage as an array.',
           'Add the pages-per-month chart with inline SVG — no chart library.'],
    FIVE: ['Write one card as an object: question, answer, box, next review.',
           'Build the flip interaction and the “again / good” buttons.',
           'Add the spaced-repetition rule and persist it, then test a 20-card deck.'],
    SIX: ['Model each plant: name, last watered, days between waterings.',
          'Render the list sorted by how overdue each plant is.',
          'Add the “watered today” button and a quiet count on the home page.'],
    SEVEN: ['Find a GTFS or JSON feed for one route and cache one day of it.',
            'Show the next three departures for a chosen stop, updating each minute.',
            'Handle the last-bus case and the “no service today” case.'],
    EIGHT: ['Write the smallest possible version: Markdown to HTML for one file.',
            'Add a folder walk, a template and a layout file.',
            'Ship it as a command with a README, and use it to build this site’s notes.'],
  };

  function readChosen() {
    try { return window.localStorage.getItem(CHOSEN_KEY) || ''; } catch (err) { return ''; }
  }
  function writeChosen(value) {
    try { window.localStorage.setItem(CHOSEN_KEY, value); } catch (err) {}
  }

  function paintChosen() {
    const chosen = readChosen();
    ideas.forEach((idea) => {
      idea.classList.toggle('is-chosen', idea.dataset.num === chosen);
    });
  }

  /* --- filter + sort ----------------------------------------------------- */
  const sizeRank = { Small: 1, Medium: 2, Large: 3 };

  function render() {
    const wanted = filter ? filter.value : 'all';
    let visible = 0;

    ideas.forEach((idea) => {
      const show = wanted === 'all' || idea.dataset.status === wanted;
      idea.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} idea${visible === 1 ? '' : 's'}`;
    if (empty) empty.hidden = visible !== 0;

    if (sort) {
      const mode = sort.value;
      const ordered = ideas.slice().sort((a, b) => {
        if (mode === 'default') return ideas.indexOf(a) - ideas.indexOf(b);
        const delta = (sizeRank[a.dataset.size] || 0) - (sizeRank[b.dataset.size] || 0);
        return mode === 'small' ? delta : -delta;
      });
      ordered.forEach((idea) => grid.appendChild(idea));
    }
  }

  /* --- dialog ------------------------------------------------------------ */
  function openDialog(idea) {
    if (!dialog) return;
    const num = idea.dataset.num;
    const title = idea.querySelector('h3');
    const desc = idea.querySelector('p');
    const tags = Array.from(idea.querySelectorAll('.tags li')).map((li) => li.textContent);

    if (dlgTitle) dlgTitle.textContent = title ? title.textContent : 'Idea';
    if (dlgKicker) dlgKicker.textContent = 'Idea ' + (idea.querySelector('.idea-num') || {}).textContent + ' · ' + idea.dataset.status;
    if (dlgDesc) dlgDesc.textContent = desc ? desc.textContent : '';
    if (dlgSkills) dlgSkills.textContent = 'Skills: ' + tags.join(', ') + ' · Size: ' + idea.dataset.size;

    if (dlgSteps) {
      dlgSteps.innerHTML = '';
      (PLANS[num] || []).forEach((step) => {
        const li = document.createElement('li');
        li.textContent = step;
        dlgSteps.appendChild(li);
      });
    }

    if (startButton) {
      const isChosen = readChosen() === num;
      startButton.textContent = isChosen ? 'Chosen ✓' : 'Start this next';
      startButton.setAttribute('aria-pressed', String(isChosen));
      startButton.dataset.num = num;
    }
    if (dlgState) dlgState.textContent = '';

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  ideas.forEach((idea) => {
    const button = idea.querySelector('.idea-more');
    if (button) {
      button.addEventListener('click', () => openDialog(idea));
    }
  });

  if (startButton) {
    startButton.addEventListener('click', () => {
      const num = startButton.dataset.num || '';
      const already = readChosen() === num;
      writeChosen(already ? '' : num);
      paintChosen();
      startButton.textContent = already ? 'Start this next' : 'Chosen ✓';
      startButton.setAttribute('aria-pressed', String(!already));
      if (dlgState) {
        dlgState.textContent = already
          ? 'Cleared. Nothing is marked as next.'
          : 'Saved. The chosen idea is marked on the list.';
      }
    });
  }

  if (closeButton) closeButton.addEventListener('click', closeDialog);
  if (dialog) {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });
  }

  if (filter) filter.addEventListener('change', render);
  if (sort) sort.addEventListener('change', render);

  paintChosen();
  render();
})();
