/**
 * Sticky navigation
 * - Adds .is-scrolled once the page scrolls, for a solid background and shadow.
 * - Opens/closes the mobile menu (aria-expanded, Escape, link click, resize).
 * - Highlights the link of the section currently in view (aria-current).
 */
(function initNav() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const toggle = header.querySelector('[data-nav-toggle]');
  const menu = header.querySelector('[data-nav-menu]');
  const links = Array.from(header.querySelectorAll('[data-nav-link]'));
  const desktop = window.matchMedia('(min-width: 900px)');

  /* 1. Scrolled state */
  const updateScrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });

  /* 2. Mobile menu */
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  /* 3. Active section highlighting */
  if (!('IntersectionObserver' in window)) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const hero = document.getElementById('top');

  function setActive(id) {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  // A thin band across the middle of the viewport decides which section is "current".
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.concat(hero ? [hero] : []).forEach((section) => observer.observe(section));
})();
