/*
 * tabby-installment.js — keep the Tabby installment price in sync with the
 * selected product variant.
 * ---------------------------------------------------------------------------
 * The block pre-renders a {variantId: installmentString} map (identical money
 * formatting to the server render). Two independent triggers swap the right
 * value into [data-tabby-price], so it works regardless of how the theme
 * drives the variant change:
 *   1) the <hdt-variant-picker> "variant:updated" DOM event (detail.variant), and
 *   2) a MutationObserver on the price element (re-applies on every price re-render,
 *      reading the selected variant id the picker writes into the form).
 * Scoped per product section. No library.
 */
(function () {
  'use strict';
  if (window.__yamanTabbyInit) return;
  window.__yamanTabbyInit = true;

  function parseMap(block) {
    var el = block.querySelector('[data-tabby-installments]');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function apply(block, map, id) {
    if (!map || id == null) return;
    var val = map[String(id)];
    if (val == null || val === '') return;
    var priceEl = block.querySelector('[data-tabby-price]');
    if (priceEl && priceEl.textContent !== val) priceEl.textContent = val;
  }

  function sectionOf(el) {
    return (el && el.closest && el.closest('.shopify-section')) || document;
  }

  // the selected variant id the picker writes into the product form's hidden input
  function selectedVariantId(scope, map) {
    var preferred = scope.querySelector('.hdt-main-product-form [name="id"]');
    if (preferred && map[preferred.value] != null) return preferred.value;
    var inputs = scope.querySelectorAll('[name="id"]');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value && map[inputs[i].value] != null) return inputs[i].value;
    }
    return null;
  }

  // 1) primary: the picker's own event carries the variant object
  document.addEventListener('variant:updated', function (e) {
    var variant = e.detail && e.detail.variant;
    if (!variant) return;
    var scope = sectionOf(e.target);
    if (scope.dataset) scope.dataset.tabbyVariant = variant.id; // cache for the observer
    var blocks = scope.querySelectorAll('.hdt-product__tabby-installment');
    Array.prototype.forEach.call(blocks, function (block) {
      apply(block, parseMap(block), variant.id);
    });
  });

  // 2) fallback: re-apply whenever the price re-renders (the price always updates
  //    on a variant change, so this catches it even if the event doesn't reach us)
  function observe() {
    var blocks = document.querySelectorAll('.hdt-product__tabby-installment');
    Array.prototype.forEach.call(blocks, function (block) {
      var map = parseMap(block);
      if (!map) return;
      var scope = sectionOf(block);
      var priceEls = scope.querySelectorAll('.hdt-product__price, .hdt-price');
      if (!priceEls.length) return;
      var observer = new MutationObserver(function () {
        var id = (scope.dataset && scope.dataset.tabbyVariant) || selectedVariantId(scope, map);
        if (id) apply(block, map, id);
      });
      Array.prototype.forEach.call(priceEls, function (p) {
        observer.observe(p, { childList: true, subtree: true, characterData: true });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
