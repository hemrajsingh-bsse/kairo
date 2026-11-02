/**
 * Accessible accordion (WAI-ARIA Authoring Practices "Accordion" pattern)
 *
 * Markup contract:
 *   <div data-accordion [data-single]>
 *     <h3><button aria-expanded aria-controls="panel-id" data-accordion-trigger>…</button></h3>
 *     <div id="panel-id" role="region" aria-labelledby="trigger-id">…</div>
 *
 * - Enter / Space toggle (native <button> behaviour).
 * - ArrowUp / ArrowDown move between headers; Home / End jump to first / last.
 * - Collapsed panels get `inert`, so their links can't be tabbed into or read out.
 * - Add data-single to keep only one item open at a time.
 * - The open/close animation is pure CSS (grid-template-rows 0fr ↔ 1fr).
 */
(function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach((root) => {
    const triggers = Array.from(root.querySelectorAll('[data-accordion-trigger]'));
    const single = root.hasAttribute('data-single');
    const panelFor = (trigger) => document.getElementById(trigger.getAttribute('aria-controls'));

    function setExpanded(trigger, expanded) {
      const panel = panelFor(trigger);
      trigger.setAttribute('aria-expanded', String(expanded));
      if (!panel) return;
      panel.classList.toggle('is-open', expanded);
      panel.inert = !expanded;
    }

    // Apply the initial state from the markup, then switch on the collapsed styles.
    triggers.forEach((trigger) => setExpanded(trigger, trigger.getAttribute('aria-expanded') === 'true'));
    root.classList.add('is-enhanced');

    root.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-accordion-trigger]');
      if (!trigger || !root.contains(trigger)) return;
      const expand = trigger.getAttribute('aria-expanded') !== 'true';
      if (single && expand) triggers.forEach((other) => other !== trigger && setExpanded(other, false));
      setExpanded(trigger, expand);
    });

    root.addEventListener('keydown', (event) => {
      const index = triggers.indexOf(event.target);
      if (index === -1) return;
      const last = triggers.length - 1;
      const target = {
        ArrowDown: index === last ? 0 : index + 1,
        ArrowUp: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      triggers[target].focus();
    });
  });
})();
