/*
 * testimonial_section-n.js — YAMAN Reviews carousel
 * ---------------------------------------------------------------------------
 * Scoped ONLY to `.hdt-yaman-reviews-section`. Transform-based track + prev/next
 * arrows + pointer drag, with optional autoplay/loop. Mirrors the proven
 * `shipping-n.js` pattern used by the trust-badges strip.
 *
 * Desktop: cards-per-view derived from a minimum card width (responsive, not a
 *   hardcoded count). Arrows appear only when there are more cards than fit.
 * Mobile: shows one card at a configurable width (`data-rv-peek`) so the next
 *   card peeks in, and the row stays horizontal — never stacks.
 *
 * - No globals (IIFE), no effect on any other section.
 * - Supports multiple instances on the page, each independent.
 * - Re-initialises on Shopify theme-editor section reloads.
 * - Before this script runs, CSS leaves the viewport as a native horizontal
 *   scroll, so the cards are still swipeable without JS.
 */
(function () {
  'use strict';

  var SECTION = '.hdt-yaman-reviews-section';
  var MOBILE = '(max-width: 767px)';
  var DRAG_THRESHOLD = 5; // px before a press counts as a drag

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function Carousel(section) {
    this.section = section;
    this.root = section.querySelector('.hdt-yaman-reviews');
    this.viewport = section.querySelector('[data-rv-viewport]');
    this.track = section.querySelector('[data-rv-track]');
    this.prevBtn = section.querySelector('[data-rv-prev]');
    this.nextBtn = section.querySelector('[data-rv-next]');
    if (!this.root || !this.viewport || !this.track) return;

    var d = this.root.dataset;
    this.autoplay = d.rvAutoplay === 'true';
    this.autoplayMs = parseInt(d.rvAutoplayMs, 10) || 5000;
    this.loop = d.rvLoop === 'true';
    this.peek = clamp(parseFloat(d.rvPeek) || 85, 50, 100) / 100;
    this.minItem = parseInt(d.rvMin, 10) || 360;

    this.index = 0;
    this.perView = 1;
    this.gap = 0;
    this.itemWidth = 0;
    this.timer = null;
    this.wasDragged = false;
    this._raf = 0;

    this.bind();
    this.layout();
    this.start();
    this.section.classList.add('is-rv-ready');
  }

  Carousel.prototype.items = function () {
    return Array.prototype.slice.call(this.track.children);
  };

  Carousel.prototype.maxIndex = function () {
    return Math.max(0, this.items().length - this.perView);
  };

  Carousel.prototype.layout = function () {
    var items = this.items();
    var vw = this.viewport.clientWidth;
    if (!vw || !items.length) return;

    var cs = getComputedStyle(this.track);
    this.gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;

    if (window.matchMedia(MOBILE).matches) {
      this.perView = 1;
      this.itemWidth = Math.min(vw * this.peek, vw - 24);
    } else {
      this.perView = clamp(Math.floor((vw + this.gap) / (this.minItem + this.gap)), 1, items.length);
      this.itemWidth = (vw - this.gap * (this.perView - 1)) / this.perView;
    }

    for (var i = 0; i < items.length; i++) {
      items[i].style.flex = '0 0 ' + this.itemWidth + 'px';
      items[i].style.maxWidth = this.itemWidth + 'px';
    }

    if (this.index > this.maxIndex()) this.index = this.maxIndex();
    this.apply();
    this.updateNav();
  };

  Carousel.prototype.apply = function () {
    var x = this.index * (this.itemWidth + this.gap);
    this.track.style.transform = 'translateX(' + (-x) + 'px)';
  };

  Carousel.prototype.updateNav = function () {
    var noScroll = this.items().length <= this.perView;
    if (this.prevBtn) {
      this.prevBtn.hidden = noScroll;
      this.prevBtn.disabled = !this.loop && this.index <= 0;
    }
    if (this.nextBtn) {
      this.nextBtn.hidden = noScroll;
      this.nextBtn.disabled = !this.loop && this.index >= this.maxIndex();
    }
  };

  Carousel.prototype.go = function (dir) {
    var mi = this.maxIndex();
    this.index += dir;
    if (this.loop) {
      if (this.index > mi) this.index = 0;
      else if (this.index < 0) this.index = mi;
    } else {
      this.index = clamp(this.index, 0, mi);
    }
    this.apply();
    this.updateNav();
  };

  Carousel.prototype.bind = function () {
    var self = this;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function () { self.go(-1); self.restart(); });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function () { self.go(1); self.restart(); });
    }

    var startX = 0;
    var startTx = 0;
    var dragging = false;

    this.viewport.addEventListener('pointerdown', function (e) {
      dragging = true;
      self.wasDragged = false;
      startX = e.clientX;
      startTx = -self.index * (self.itemWidth + self.gap);
      self.track.style.transition = 'none';
      try { self.viewport.setPointerCapture(e.pointerId); } catch (err) {}
    });

    this.viewport.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) self.wasDragged = true;
      self.track.style.transform = 'translateX(' + (startTx + dx) + 'px)';
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      self.track.style.transition = '';
      var dx = (typeof e.clientX === 'number' ? e.clientX : startX) - startX;
      var step = self.itemWidth + self.gap;
      if (step > 0 && Math.abs(dx) > DRAG_THRESHOLD) {
        self.index += Math.round(-dx / step);
        self.index = clamp(self.index, 0, self.maxIndex());
      }
      self.apply();
      self.updateNav();
      self.restart();
    }

    this.viewport.addEventListener('pointerup', endDrag);
    this.viewport.addEventListener('pointercancel', endDrag);

    // A drag should not also trigger a card link click.
    this.track.addEventListener('click', function (e) {
      if (self.wasDragged) {
        e.preventDefault();
        e.stopPropagation();
        self.wasDragged = false;
      }
    }, true);

    this.section.addEventListener('mouseenter', function () { self.stop(); });
    this.section.addEventListener('mouseleave', function () { self.start(); });

    window.addEventListener('resize', function () {
      cancelAnimationFrame(self._raf);
      self._raf = requestAnimationFrame(function () { self.layout(); });
    });
  };

  Carousel.prototype.start = function () {
    if (!this.autoplay || this.items().length <= this.perView) return;
    this.stop();
    var self = this;
    this.timer = setInterval(function () {
      if (!self.loop && self.index >= self.maxIndex()) {
        self.index = 0;
        self.apply();
        self.updateNav();
      } else {
        self.go(1);
      }
    }, this.autoplayMs);
  };

  Carousel.prototype.stop = function () {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  };

  Carousel.prototype.restart = function () {
    this.stop();
    this.start();
  };

  function initAll(scope) {
    var nodes = (scope || document).querySelectorAll(SECTION);
    Array.prototype.forEach.call(nodes, function (s) {
      if (s.dataset.rvInit === '1') return;
      s.dataset.rvInit = '1';
      new Carousel(s);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  // Shopify theme editor: a reloaded section is fresh DOM, so re-init within it.
  document.addEventListener('shopify:section:load', function (e) { initAll(e.target); });
})();
