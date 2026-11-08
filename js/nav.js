/* DRY navigation: the markup lives in nav.html and is loaded here, once.
   Every page has an empty <nav id="site-nav"> and this script fills it.
   No JavaScript? The fallback <noscript> menu in each page still works. */
(async function () {
  const mount = document.getElementById('site-nav');
  if (!mount) return;

  try {
    const res = await fetch('nav.html', { cache: 'no-cache' });
    if (res.ok) mount.innerHTML = await res.text();
  } catch (err) {
    /* Offline or opened from file:// — keep the <noscript> menu visible. */
    mount.querySelector('.nav-fallback')?.removeAttribute('hidden');
    return;
  }

  const here = document.body.dataset.page;
  mount.querySelectorAll('[data-page]').forEach((link) => {
    if (link.dataset.page === here) {
      link.setAttribute('aria-current', 'page');
    }
  });

  const toggle = mount.querySelector('.nav-toggle');
  const menu = mount.querySelector('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  }
})();
