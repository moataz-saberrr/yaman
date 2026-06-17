/*
 * real-results-n.js — YAMAN "Real Results" before/after reveal
 * ---------------------------------------------------------------------------
 * Controls ONLY the before/after drag/reveal inside `.hdt-yaman-results-section`.
 * The outer carousel is the theme's own Kalles <hdt-slideshow> slider — this file
 * does NOT touch it.
 *
 * - Native pointer events (mouse + touch + pen); no library.
 * - Each card is independent; supports multiple sections per page.
 * - Re-initialises on Shopify `shopify:section:load`.
 * - stopPropagation on pointer-down keeps a drag on the image from also swiping
 *   the carousel; vertical page scrolling still works (touch-action: pan-y).
 */
(function () {
  'use strict';

  var SECTION = '.hdt-yaman-results-section';

  function clamp(n) { return n < 0 ? 0 : n > 100 ? 100 : n; }

  function percentFromX(ba, clientX) {
    var rect = ba.getBoundingClientRect();
    if (!rect.width) return 50;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }

  function setupCard(ba) {
    if (ba.dataset.rrInit === '1') return;
    ba.dataset.rrInit = '1';

    var handle = ba.querySelector('[data-rr-handle]');
    var dragging = false;

    function apply(p) {
      p = clamp(p);
      ba.style.setProperty('--rr-pos', p + '%');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(p));
    }

    function onDown(e) {
      dragging = true;
      if (ba.setPointerCapture && e.pointerId != null) {
        try { ba.setPointerCapture(e.pointerId); } catch (err) {}
      }
      apply(percentFromX(ba, e.clientX));
      e.stopPropagation(); // don't let the carousel start a swipe
    }
    function onMove(e) {
      if (!dragging) return;
      apply(percentFromX(ba, e.clientX));
      e.stopPropagation();
    }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      if (ba.releasePointerCapture && e.pointerId != null) {
        try { ba.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }

    ba.addEventListener('pointerdown', onDown);
    ba.addEventListener('pointermove', onMove);
    ba.addEventListener('pointerup', onUp);
    ba.addEventListener('pointercancel', onUp);
    // belt-and-suspenders for older touch handling in the carousel engine
    ba.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });

    if (handle) {
      handle.addEventListener('keydown', function (e) {
        var cur = parseFloat(getComputedStyle(ba).getPropertyValue('--rr-pos'));
        if (isNaN(cur)) cur = 50;
        var next;
        switch (e.key) {
          case 'ArrowLeft': case 'ArrowDown': next = cur - 2; break;
          case 'ArrowRight': case 'ArrowUp': next = cur + 2; break;
          case 'Home': next = 0; break;
          case 'End': next = 100; break;
          default: return;
        }
        e.preventDefault();
        apply(next);
      });
    }
  }

  function initAll(scope) {
    var root = scope || document;
    var sections = [];
    if (root.matches && root.matches(SECTION)) sections.push(root);
    if (root.querySelectorAll) {
      Array.prototype.push.apply(sections, root.querySelectorAll(SECTION));
    }
    sections.forEach(function (section) {
      var cards = section.querySelectorAll('[data-rr-ba]');
      Array.prototype.forEach.call(cards, setupCard);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(document); });
  } else {
    initAll(document);
  }

  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
