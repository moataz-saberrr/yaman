/*
 * product-visible-lift-n.js — YAMAN product-page "Visible Lift" before/after
 * ---------------------------------------------------------------------------
 * Controls ONLY `.hdt-product-visible-lift-section`:
 *   - native pointer drag (mouse + touch + pen) on the active main pair; no library
 *   - thumbnail click -> that pair becomes the main, previous main returns as a thumb
 *   - each section is independent; supports multiple instances on one page
 *   - re-inits on shopify:section:load; clears flags on shopify:section:unload
 * Does NOT touch the homepage Real Results section or anything else.
 */
(function () {
  'use strict';

  var SECTION = '.hdt-product-visible-lift-section';

  function clamp(n) { return n < 0 ? 0 : n > 100 ? 100 : n; }

  function percentFromX(ba, clientX) {
    var rect = ba.getBoundingClientRect();
    if (!rect.width) return 50;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }

  function setupBeforeAfter(ba) {
    if (ba.dataset.vlBaInit === '1') return;
    ba.dataset.vlBaInit = '1';

    var handle = ba.querySelector('[data-vl-handle]');
    var dragging = false;

    function apply(p) {
      p = clamp(p);
      ba.style.setProperty('--vl-pos', p + '%');
      if (handle) handle.setAttribute('aria-valuenow', Math.round(p));
    }

    function onDown(e) {
      dragging = true;
      if (ba.setPointerCapture && e.pointerId != null) {
        try { ba.setPointerCapture(e.pointerId); } catch (err) {}
      }
      apply(percentFromX(ba, e.clientX));
    }
    function onMove(e) {
      if (!dragging) return;
      apply(percentFromX(ba, e.clientX));
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

    if (handle) {
      handle.addEventListener('keydown', function (e) {
        var cur = parseFloat(getComputedStyle(ba).getPropertyValue('--vl-pos'));
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

  function setupSection(section) {
    if (section.dataset.vlInit === '1') return;
    section.dataset.vlInit = '1';

    // wire the before/after drag on every main pair (only the active one is visible/interactive)
    Array.prototype.forEach.call(section.querySelectorAll('[data-vl-ba]'), setupBeforeAfter);

    var slides = section.querySelectorAll('[data-vl-slide]');
    var thumbs = section.querySelectorAll('[data-vl-thumb]');

    function activate(idx) {
      Array.prototype.forEach.call(slides, function (s) {
        s.classList.toggle('is-active', s.getAttribute('data-vl-slide') === idx);
      });
      // the active pair is hidden from the thumbnail row; all others are shown
      Array.prototype.forEach.call(thumbs, function (t) {
        t.classList.toggle('is-hidden', t.getAttribute('data-vl-thumb') === idx);
      });
    }

    Array.prototype.forEach.call(thumbs, function (t) {
      t.addEventListener('click', function () {
        activate(t.getAttribute('data-vl-thumb'));
      });
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
    if (!t) return;
    if (t.matches && t.matches(SECTION)) t.removeAttribute('data-vl-init');
    if (t.querySelectorAll) {
      Array.prototype.forEach.call(t.querySelectorAll(SECTION), function (s) {
        s.removeAttribute('data-vl-init');
      });
    }
  });
})();
