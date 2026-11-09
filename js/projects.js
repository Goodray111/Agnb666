/* Ideas page: filter by status, sort by the size of the project. */
(function () {
  'use strict';

  const grid = document.getElementById('idea-grid');
  if (!grid) return;

  const ideas = Array.from(grid.querySelectorAll('.idea'));
  const filter = document.getElementById('idea-filter');
  const sort = document.getElementById('idea-sort');
  const count = document.getElementById('idea-count');
  const empty = document.getElementById('idea-empty');

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

  if (filter) filter.addEventListener('change', render);
  if (sort) sort.addEventListener('change', render);
  render();
})();
