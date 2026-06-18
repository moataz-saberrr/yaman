/*
 * shoppable-video-ugc-n.js — YAMAN UGC ("Real People. Real Glow.") video behaviour.
 * ---------------------------------------------------------------------------
 * Duplicated from assets/shoppable-video-n.js. The carousel is the native Kalles
 * <hdt-slider> (theme global JS) — this file does NOT build or initialise a carousel.
 *
 * Handles ONLY video behaviour, scoped to `.hdt-yaman-ugc-section`:
 *   - click (or Enter/Space) anywhere in a card toggles play/pause
 *   - only one video plays at a time (playing one pauses the others)
 *   - videos stay muted; loop is controlled by the markup (section setting)
 *   - the centre overlay icon reflects the play/pause state
 *
 * No globals (IIFE). Multiple section instances supported. Re-binds cleanly on
 * Shopify theme-editor `shopify:section:load`.
 */
(function () {
  'use strict';

  var SECTION = '.hdt-yaman-ugc-section';

  function pauseAll(root, except) {
    var videos = root.querySelectorAll('[data-yv-video]');
    Array.prototype.forEach.call(videos, function (v) {
      if (v !== except) {
        try { v.pause(); } catch (e) {}
        var card = v.closest('[data-yv-card]');
        if (card) card.classList.remove('is-playing');
      }
    });
  }

  function toggleVideo(section, media) {
    var video = media.querySelector('[data-yv-video]');
    var card = media.closest('[data-yv-card]');
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
    if (media.dataset.yvBound === '1') return;
    media.dataset.yvBound = '1';

    media.addEventListener('click', function (e) {
      // Let explicit links (product label) navigate without toggling.
      if (e.target.closest('[data-yv-link]')) return;
      toggleVideo(section, media);
    });

    media.addEventListener('keydown', function (e) {
      if (e.target.closest('[data-yv-link]')) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleVideo(section, media);
      }
    });

    var video = media.querySelector('[data-yv-video]');
    if (video) {
      var card = media.closest('[data-yv-card]');
      video.addEventListener('play', function () { if (card) card.classList.add('is-playing'); });
      video.addEventListener('pause', function () { if (card) card.classList.remove('is-playing'); });
      video.addEventListener('ended', function () { if (card) card.classList.remove('is-playing'); });
    }
  }

  function initSection(section) {
    var medias = section.querySelectorAll('[data-yv-media]');
    Array.prototype.forEach.call(medias, function (media) { bindOne(media, section); });
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
