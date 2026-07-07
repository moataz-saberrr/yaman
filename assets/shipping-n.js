/*
 * shipping-n.js — YAMAN Trust Badges carousel (Flickity)
 * ---------------------------------------------------------------------------
 * Replaces the previous transform/pointer-drag slider with Flickity, which
 * handles draggable/flickable carousels reliably (including dragging BACK on
 * mobile, which the old code mishandled).
 *
 * - Scoped ONLY to `.hdt-yaman-trust-badges-section`; never touches other
 *   carousels or sections.
 * - No globals (IIFE). Supports multiple section instances on one page.
 * - Initialises on DOM ready and re-initialises / destroys cleanly on Shopify
 *   theme-editor `shopify:section:load` / `shopify:section:unload`.
 * - Flickity itself is loaded only by sections/shipping-n.liquid (not globally).
 */
(function () {
  'use strict';

  var SECTION = '.hdt-yaman-trust-badges-section';
  var instances = []; // { section, flkty }

  function getInstance(section) {
    for (var i = 0; i < instances.length; i++) {
      if (instances[i].section === section) return instances[i];
    }
    return null;
  }

  function initOne(section) {
    if (!window.Flickity) return;
    if (getInstance(section)) return; // already initialised

    var track = section.querySelector('[data-tb-track]');
    var root = section.querySelector('.hdt-yaman-trust-badges');
    if (!track || !track.children.length) return;

    var d = (root && root.dataset) || {};
    var loop = d.tbLoop === 'true';
    var autoplay = d.tbAutoplay === 'true';
    var autoplayMs = parseInt(d.tbAutoplayMs, 10) || 4000;
    var rightToLeft = d.tbRtl === 'true';

    var flkty = new window.Flickity(track, {
      cellAlign: rightToLeft ? 'right' : 'left',
      rightToLeft: rightToLeft,
      // `contain` keeps dragging bounded (no body scroll); `wrapAround` gives an
      // endless loop when the merchant turns Loop on. They are mutually exclusive.
      contain: !loop,
      wrapAround: loop,
      draggable: true,
      freeScroll: false,
      prevNextButtons: false, // no arrows (per design)
      pageDots: false,        // no dots (per design)
      adaptiveHeight: false,
      groupCells: false,
      resize: true,
      autoPlay: autoplay ? autoplayMs : false,
      pauseAutoPlayOnHover: true
    });

    instances.push({ section: section, flkty: flkty });
    section.classList.add('is-tb-ready');
  }

  function destroyOne(section) {
    var inst = getInstance(section);
    if (!inst) return;
    try { inst.flkty.destroy(); } catch (e) {}
    instances.splice(instances.indexOf(inst), 1);
    section.classList.remove('is-tb-ready');
  }

  function initAll(scope) {
    var root = scope || document;
    // scope may itself be a matching section (rare) or a wrapper containing one
    if (root.matches && root.matches(SECTION)) initOne(root);
    var nodes = root.querySelectorAll ? root.querySelectorAll(SECTION) : [];
    Array.prototype.forEach.call(nodes, initOne);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () { initAll(document); });

  // Shopify theme editor: a reloaded section is fresh DOM — re-init within it.
  document.addEventListener('shopify:section:load', function (e) {
    initAll(e.target);
  });
  document.addEventListener('shopify:section:unload', function (e) {
    var root = e.target;
    if (root.matches && root.matches(SECTION)) destroyOne(root);
    var nodes = root.querySelectorAll ? root.querySelectorAll(SECTION) : [];
    Array.prototype.forEach.call(nodes, destroyOne);
  });
})();
