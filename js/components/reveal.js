/**
 * Scroll reveal
 * Fades [data-reveal] elements up as they enter the viewport. Elements in the same
 * parent get a small stagger. Skipped entirely for reduced-motion users or old browsers,
 * and content is only hidden after this script has run, so nothing is lost without JS.
 */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;

  // Stagger siblings: 0ms, 70ms, 140ms… capped so long lists don't drag.
  items.forEach((item) => {
    const siblings = Array.from(item.parentElement.children).filter((el) => el.hasAttribute('data-reveal'));
    const index = siblings.indexOf(item);
    item.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 70}ms`);
  });

  document.documentElement.classList.add('has-reveal');

  // Once revealed, drop the attribute so the element's own hover transitions apply again.
  const finish = (item) => {
    item.removeAttribute('data-reveal');
    item.classList.remove('is-visible');
    item.style.removeProperty('--reveal-delay');
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      item.classList.add('is-visible');
      observer.unobserve(item);
      item.addEventListener('transitionend', (event) => {
        if (event.target === item && event.propertyName === 'opacity') finish(item);
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
})();
