/*
 * yaman-real-routines-video-n.js — YAMAN Routines (real-routines video carousel)
 * ---------------------------------------------------------------------------
 * The carousel itself is the native Kalles <hdt-slider> (defined in the theme's
 * global JS) — this file does NOT build, initialise, or control a carousel.
 *
 * It handles ONLY video behaviour, scoped to `.hdt-yaman-routines-section`:
 *   - click (or Enter/Space) anywhere on a card's media toggles play/pause
 *   - only one video plays at a time (playing one pauses the others)
 *   - videos stay muted; loop is controlled by the markup (section setting)
 *   - the centre overlay icon reflects the play/pause state (via .is-playing)
 *   - a playing video that scrolls out of view is paused (IntersectionObserver)
 *   - nothing autoplays
 *
 * No globals (IIFE). Multiple section instances supported. Re-binds cleanly on
 * Shopify theme-editor `shopify:section:load`.
 */
(function () {
  'use strict';

  var SECTION = '.hdt-yaman-routines-section';

  function pauseAll(root, except) {
    var videos = root.querySelectorAll('[data-rt-video]');
    Array.prototype.forEach.call(videos, function (v) {
      if (v !== except) {
        try { v.pause(); } catch (e) {}
        var card = v.closest('[data-rt-card]');
        if (card) card.classList.remove('is-playing');
      }
    });
  }

  function toggleVideo(section, media) {
    var video = media.querySelector('[data-rt-video]');
    var card = media.closest('[data-rt-card]');
    if (!video) return; // poster/placeholder only — nothing to toggle

    if (video.paused) {
      pauseAll(section, video); // only one video plays at a time
      video.muted = true;       // muted by default (autoplay policy + design)
      var p = video.play();
      if (p && typeof p.catch === 'function') { p.catch(function () {}); }
      if (card) card.classList.add('is-playing');
    } else {
      video.pause();
      if (card) card.classList.remove('is-playing');
    }
  }

  function bindOne(media, section) {
    if (media.dataset.rtBound === '1') return;
    media.dataset.rtBound = '1';

    media.addEventListener('click', function (e) {
      // Let an explicit label/CTA link navigate without toggling.
      if (e.target.closest('[data-rt-link]')) return;
      toggleVideo(section, media);
    });

    media.addEventListener('keydown', function (e) {
      if (e.target.closest('[data-rt-link]')) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleVideo(section, media);
      }
    });

    var video = media.querySelector('[data-rt-video]');
    if (video) {
      var card = media.closest('[data-rt-card]');
      video.addEventListener('play', function () { if (card) card.classList.add('is-playing'); });
      video.addEventListener('pause', function () { if (card) card.classList.remove('is-playing'); });
      video.addEventListener('ended', function () { if (card) card.classList.remove('is-playing'); });
    }
  }

  // Pause a playing video once it scrolls (or slides) mostly out of view.
  function observeOffscreen(section) {
    if (typeof IntersectionObserver === 'undefined') return;
    if (section.dataset.rtObserved === '1') return;
    section.dataset.rtObserved = '1';

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) return;
        var video = entry.target.querySelector('[data-rt-video]');
        if (video && !video.paused) {
          try { video.pause(); } catch (e) {}
          entry.target.classList.remove('is-playing');
        }
      });
    }, { root: null, threshold: 0.35 });

    var cards = section.querySelectorAll('[data-rt-card]');
    Array.prototype.forEach.call(cards, function (card) { io.observe(card); });
  }

  function initSection(section) {
    var medias = section.querySelectorAll('[data-rt-media]');
    Array.prototype.forEach.call(medias, function (media) { bindOne(media, section); });
    observeOffscreen(section);
  }

  function initAll(scope) {
    var root = scope || document;
    if (root.matches && root.matches(SECTION)) initSection(root);
    var nodes = root.querySelectorAll ? root.querySelectorAll(SECTION) : [];
    Array.prototype.forEach.call(nodes, initSection);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () { initAll(document); });

  // Shopify theme editor: a reloaded section is fresh DOM — re-bind within it.
  document.addEventListener('shopify:section:load', function (e) {
    initAll(e.target);
  });
})();
