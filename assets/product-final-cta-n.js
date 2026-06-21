/*
 * product-final-cta-n.js — YAMAN product-page Final CTA
 * ---------------------------------------------------------------------------
 * ONLY job: when the CTA shows "SELECT OPTIONS" (multi-variant product), smooth-
 * scroll to the very top of the page so the shopper can choose a variant.
 * Scoped to `.hdt-product-final-cta-section`; touches no other button.
 * The add-to-cart path is a real Shopify product form (theme <hdt-buy-buttons>),
 * so it needs no JS here. Re-inits on shopify:section:load.
 */
(function () {
  'use strict';

  var SECTION = '.hdt-product-final-cta-section';

  function onScrollClick(e) {
    e.preventDefault();
    // smooth-scroll to the very top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  function setupSection(section) {
    if (section.dataset.fctaInit === '1') return;
    section.dataset.fctaInit = '1';
    Array.prototype.forEach.call(section.querySelectorAll('[data-fcta-scroll]'), function (btn) {
      btn.addEventListener('click', onScrollClick);
    });
  }

  function initAll(scope) {
    var root = scope || document;
    var sections = [];
    if (root.matches && root.matches(SECTION)) sections.push(root);
    if (root.querySelectorAll) {
      Array.prototype.push.apply(sections, root.querySelectorAll(SECTION));
    }
    sections.forEach(setupSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(document); });
  } else {
    initAll(document);
  }

  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
  document.addEventListener('shopify:section:unload', function (e) {
    var t = e.target;
    if (t && t.matches && t.matches(SECTION)) t.removeAttribute('data-fcta-init');
    if (t && t.querySelectorAll) {
      Array.prototype.forEach.call(t.querySelectorAll(SECTION), function (s) {
        s.removeAttribute('data-fcta-init');
      });
    }
  });
})();
