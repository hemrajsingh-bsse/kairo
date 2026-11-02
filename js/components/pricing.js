/**
 * Pricing billing switch
 * Reads data-monthly / data-annual from every [data-price] and [data-note] element
 * and swaps them when the Monthly / Annual radio changes. The radios are real form
 * controls, so keyboard (arrow keys) and screen readers work without extra code.
 */
(function initPricing() {
  const root = document.querySelector('[data-pricing]');
  if (!root) return;

  const radios = root.querySelectorAll('input[name="billing"]');
  const amounts = root.querySelectorAll('[data-price]');
  const notes = root.querySelectorAll('[data-note]');
  const status = root.querySelector('[data-billing-status]');

  function render(period, { announce = true } = {}) {
    root.dataset.billing = period;

    amounts.forEach((el) => {
      const next = el.dataset[period];
      if (el.textContent === next) return;
      el.textContent = next;
      // Restart the small "flip" animation on each change.
      el.classList.remove('is-updating');
      void el.offsetWidth;
      el.classList.add('is-updating');
    });

    notes.forEach((el) => { el.textContent = el.dataset[period]; });

    if (announce && status) {
      status.textContent = period === 'annual'
        ? 'Showing annual prices, billed yearly with 20% off.'
        : 'Showing monthly prices.';
    }
  }

  radios.forEach((radio) => {
    radio.addEventListener('change', () => { if (radio.checked) render(radio.value); });
  });

  // Browsers can restore a checked radio after reload, so sync to whatever is checked now.
  const checked = root.querySelector('input[name="billing"]:checked');
  render(checked ? checked.value : 'monthly', { announce: false });
})();
