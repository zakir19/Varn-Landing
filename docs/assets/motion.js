/* =========================================================================
   Varn documentation  |  motion layer
   Built by Enstacked Technologies

   GSAP + ScrollTrigger + Lenis, all self-hosted. Adds:

     1. Smooth scrolling (Lenis, driven by the GSAP ticker)
     2. The "on this page" rail: an SVG path that jogs in for nested
        headings, with an accent segment spanning every heading currently
        in view, animated between states
     3. Reading progress bar
     4. Restrained reveal animations for long-form content

   EVERY part degrades. If GSAP or Lenis fail to load, the rail still tracks
   (without tweening), scrolling is native, and content is simply visible:
   the hidden state for reveals is set from JS, never from CSS, so a script
   failure can never leave the page blank.
   ========================================================================= */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var HAS_GSAP = !!(gsap && ST);

  var reduce = false;
  try {
    reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {
    /* very old browser: treat as no preference */
  }
  var coarse = false;
  try {
    coarse = matchMedia("(pointer: coarse)").matches;
  } catch (e) {}

  if (HAS_GSAP) gsap.registerPlugin(ST);

  var $ = function (s, c) {
    return (c || doc).querySelector(s);
  };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || doc).querySelectorAll(s));
  };
  var raf =
    window.requestAnimationFrame ||
    function (fn) {
      return setTimeout(fn, 16);
    };

  function headerOffset() {
    var v = parseInt(getComputedStyle(root).getPropertyValue("--top-h"), 10);
    return (isNaN(v) ? 60 : v) + 18;
  }

  /* =======================================================================
     1. SMOOTH SCROLL
     Skipped for reduced-motion and for touch, where the platform's own
     momentum scrolling is better than anything we can synthesise.
     ======================================================================= */
  var lenis = null;

  if (window.Lenis && HAS_GSAP && !reduce && !coarse) {
    lenis = new window.Lenis({
      duration: 1.05,
      // exponential ease out: fast to start, long calm settle
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      autoRaf: false,
    });

    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    // The ticker is now the single clock for scroll + tweens, so GSAP must not
    // insert its own catch-up frames after a stall.
    gsap.ticker.lagSmoothing(0);
    root.classList.add("has-lenis");
  }

  function scrollToEl(el) {
    if (lenis) {
      lenis.scrollTo(el, { offset: -headerOffset(), duration: 1 });
    } else {
      var y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      if (window.scrollTo && !reduce) {
        try {
          window.scrollTo({ top: y, behavior: "smooth" });
          return;
        } catch (e) {
          /* older browsers reject the options object */
        }
      }
      window.scrollTo(0, y);
    }
  }

  // In-page anchors go through the smooth path and still update the URL.
  doc.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var hash = a.getAttribute("href");
    if (!hash || hash === "#") return;
    var el = doc.getElementById(decodeURIComponent(hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    scrollToEl(el);
    if (history.pushState) history.pushState(null, "", hash);
    // Keep keyboard focus with the target, which the browser would have done.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });

  // Landing on a deep link: let layout settle, then position under the header.
  if (location.hash) {
    var target = doc.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      setTimeout(function () {
        if (lenis) lenis.scrollTo(target, { offset: -headerOffset(), immediate: true });
      }, 60);
    }
  }

  // The search dialog and the mobile drawer lock the page; Lenis has to agree.
  if (lenis) {
    var lockables = [$("[data-search-dialog]"), $("[data-sidebar]")].filter(Boolean);
    var syncLock = function () {
      var locked = lockables.some(function (el) {
        return el.hasAttribute("data-search-dialog") ? !el.hidden : el.classList.contains("is-open");
      });
      if (locked) lenis.stop();
      else lenis.start();
    };
    lockables.forEach(function (el) {
      new MutationObserver(syncLock).observe(el, {
        attributes: true,
        attributeFilter: ["hidden", "class"],
      });
    });
  }

  /* =======================================================================
     2. THE "ON THIS PAGE" RAIL
     ======================================================================= */
  var rail = $("[data-toc-rail]");
  var svg = $("[data-toc-svg]");
  var track = $("[data-toc-track]");
  var thumb = $("[data-toc-thumb]");
  var items = rail ? $$(".toc__item", rail) : [];
  var links = items.map(function (li) {
    return $(".toc__link", li);
  });

  var headings = links.map(function (a) {
    return a ? doc.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))) : null;
  });

  /* Rail geometry. The jog between a heading and its sub-heading is small on
     purpose: it should read as a hierarchy cue next to the text indent, not as
     a second navigation column. Raise INDENT if you want it more pronounced;
     CORNER is clamped to half the jog, so it follows automatically. */
  var INDENT = 3; // px the path moves in per nesting level
  var PAD_X = 4; // px from the left edge of the svg, wide enough that the
  //                dot's radius is never clipped by the TOC's own overflow
  var CORNER = 2.5; // max corner radius at an indent change

  /* How much of an entry's rung the stroke must cover before its label lights
     up. Measured in rail pixels, so it is independent of section length: it is
     what stops a label flickering on as the stroke merely grazes it. */
  var MIN_OVERLAP = 9; // px of rail
  var MIN_FRACTION = 0.34; // or a third of the rung, whichever is smaller

  /* Scroll distance in one direction before the dot changes ends. */
  var DIR_FLIP = 40; // px

  /* The reading band, as a fraction of the viewport. It is deliberately
     ASYMMETRIC, because the two edges answer different questions.

     The top does NOT start at the header: a section whose last few lines are
     still clipped to the top edge has been read, so holding it lit there is
     what made the highlight look stale.

     The bottom runs to the very edge of the viewport: the moment a new
     heading appears from below it is on screen, so the stroke should reach it
     straight away rather than waiting for it to climb. */
  var BAND_TOP = 0.14;
  var BAND_BOTTOM = 1;

  var dot = $("[data-toc-dot]");

  /* geo.bounds holds the path length at the START of every item, plus the
     total as a final entry, so bounds[i]..bounds[i+1] is item i's stretch of
     rail. Keeping it as one contiguous ladder is what lets a document
     position map onto the rail continuously instead of snapping to an item. */
  var geo = null; // { total, bounds[] }
  var tops = []; // cached document offset of every heading
  var state = { s: 0, l: 0, d: 1 }; // dash start, dash length, dot 0=top 1=bottom
  var lastY = 0;
  var travel = 0; // accumulated scroll in one direction, for dot hysteresis
  var dirDown = true;

  function depthOf(li) {
    var d = parseInt(li.getAttribute("data-depth"), 10);
    return isNaN(d) || d < 0 ? 0 : d;
  }

  function buildPath() {
    if (!rail || !items.length) return false;

    var railBox = rail.getBoundingClientRect();
    if (!railBox.height) return false;

    var maxDepth = 0;
    var pts = items.map(function (li) {
      var box = li.getBoundingClientRect();
      var depth = depthOf(li);
      if (depth > maxDepth) maxDepth = depth;
      return {
        x: PAD_X + depth * INDENT,
        top: box.top - railBox.top,
        bottom: box.bottom - railBox.top,
      };
    });

    var d = "M" + pts[0].x + " " + pts[0].top;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var n = pts[i + 1];
      if (n && n.x !== p.x) {
        // Rounded jog: down, curve out, across, curve back down.
        var dx = n.x - p.x;
        var sign = dx > 0 ? 1 : -1;
        // Radius can never exceed half the jog or the two curves would cross.
        var r = Math.min(CORNER, Math.abs(dx) / 2, (p.bottom - p.top) / 2);
        d += "L" + p.x + " " + (p.bottom - r);
        d += "Q" + p.x + " " + p.bottom + " " + (p.x + sign * r) + " " + p.bottom;
        d += "L" + (n.x - sign * r) + " " + p.bottom;
        d += "Q" + n.x + " " + p.bottom + " " + n.x + " " + (p.bottom + r);
      } else {
        d += "L" + p.x + " " + p.bottom;
      }
    }

    var w = PAD_X * 2 + maxDepth * INDENT + 2;
    svg.setAttribute("viewBox", "0 0 " + w + " " + railBox.height);
    svg.setAttribute("width", w);
    svg.setAttribute("height", railBox.height);
    svg.style.width = w + "px";
    svg.style.height = railBox.height + "px";
    track.setAttribute("d", d);
    thumb.setAttribute("d", d);

    var total = track.getTotalLength ? track.getTotalLength() : railBox.height;

    /* Binary search the path for the length at a given y. The path only ever
       runs downward or sideways, so y is monotonic along it and this is exact
       to within a fraction of a pixel. Runs once per layout, not per frame. */
    function lengthAtY(y) {
      var lo = 0;
      var hi = total;
      for (var k = 0; k < 22; k++) {
        var mid = (lo + hi) / 2;
        if (track.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }

    var bounds = pts.map(function (p) {
      return lengthAtY(p.top);
    });
    bounds.push(total);

    geo = { total: total, bounds: bounds };

    thumb.style.strokeDasharray = state.l + " " + total;
    return true;
  }

  /* Document position to rail position, interpolated inside the item. This is
     the whole trick: the stroke slides as the page moves rather than jumping
     when a heading crosses a line. */
  function yToLen(y) {
    if (!geo || !tops.length) return 0;
    var n = tops.length;
    if (y <= tops[0]) return 0;
    var docEnd = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    for (var i = 0; i < n; i++) {
      var top = tops[i];
      var bottom = i + 1 < n ? tops[i + 1] : docEnd;
      if (y < bottom) {
        var f = (y - top) / Math.max(1, bottom - top);
        return geo.bounds[i] + f * (geo.bounds[i + 1] - geo.bounds[i]);
      }
    }
    return geo.total;
  }

  function measure() {
    tops = headings.map(function (h) {
      return h ? h.getBoundingClientRect().top + window.pageYOffset : Infinity;
    });
    buildPath();
  }

  function applyDash() {
    if (!geo) return;
    var len = Math.max(0, state.l);
    var visible = len > 0.5;

    thumb.style.strokeDasharray = len + " " + (geo.total + 1);
    thumb.style.strokeDashoffset = String(-state.s);
    thumb.style.opacity = visible ? "1" : "0";

    if (!dot) return;
    if (!visible || !track.getPointAtLength) {
      dot.style.opacity = "0";
      return;
    }
    // state.d slides the dot between the two ends, so a change of direction
    // reads as the marker travelling rather than teleporting.
    var at = Math.min(geo.total, Math.max(0, state.s + state.d * len));
    var p = track.getPointAtLength(at);
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.style.opacity = "1";
  }

  function setThumb(s, l, animate) {
    if (!geo) return;
    s = Math.max(0, Math.min(geo.total, s));
    l = Math.max(0, Math.min(geo.total - s, l));
    var d = dirDown ? 1 : 0;

    if (HAS_GSAP && !reduce && animate) {
      gsap.to(state, {
        s: s,
        l: l,
        d: d,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
        onUpdate: applyDash,
      });
    } else {
      state.s = s;
      state.l = l;
      state.d = d;
      applyDash();
    }
  }

  /* A heading is active while its section overlaps a band running from just
     under the sticky header to a little past the middle of the viewport. That
     is what makes the segment grow to cover several short sections at once,
     and shrink back to one on a long section. */
  function syncToc(animate) {
    if (!geo) return;

    var y = window.pageYOffset;

    /* Direction, with hysteresis. A few pixels of jitter must not flip the
       marker, so the direction only changes after a deliberate move. */
    var delta = y - lastY;
    lastY = y;
    if (delta !== 0) {
      if (delta > 0 === travel > 0) travel += delta;
      else travel = delta;
      if (travel > DIR_FLIP && !dirDown) dirDown = true;
      else if (travel < -DIR_FLIP && dirDown) dirDown = false;
    }

    var bandTop = y + headerOffset() + window.innerHeight * BAND_TOP;
    var bandBottom = y + window.innerHeight * BAND_BOTTOM;

    var s = yToLen(bandTop);
    var e = yToLen(bandBottom);
    setThumb(s, e - s, animate);

    /* The stroke is continuous, but the labels are not: an entry lights up
       once the stroke covers a real part of its rung. */
    for (var i = 0; i < links.length; i++) {
      if (!links[i]) continue;
      var a = geo.bounds[i];
      var b = geo.bounds[i + 1];
      var overlap = Math.min(b, e) - Math.max(a, s);
      var need = Math.min(MIN_OVERLAP, (b - a) * MIN_FRACTION);

      /* The entries the stroke STARTS and ENDS in are always lit, however
         little of them it covers. That is what makes a heading arriving at
         the bottom of the viewport light up the instant it appears, instead
         of waiting until enough of its section is on screen. Entries in the
         middle are fully crossed anyway, so the threshold only ever filters a
         rung the stroke merely grazes. */
      var holdsEdge = (s >= a && s < b) || (e > a && e <= b);
      var on = holdsEdge || overlap >= Math.max(1, need);
      if (on === links[i].classList.contains("is-active")) continue;
      links[i].classList.toggle("is-active", on);
      if (on) links[i].setAttribute("aria-current", "location");
      else links[i].removeAttribute("aria-current");
    }
  }

  /* =======================================================================
     3. PROGRESS BAR
     ======================================================================= */
  var bar = $("[data-progress-bar]");

  function syncProgress() {
    if (!bar) return;
    var max =
      Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.pageYOffset / max)) : 0;
    bar.style.transform = "scaleX(" + p + ")";
  }

  /* =======================================================================
     SCROLL LOOP
     One rAF-throttled listener drives the rail and the progress bar. Lenis
     performs a real window scroll, so this works with or without it.
     ======================================================================= */
  var topBar = $(".top");
  var wasScrolled = null;

  function syncHeader() {
    if (!topBar) return;
    var on = window.pageYOffset > 8;
    if (on === wasScrolled) return;
    wasScrolled = on;
    topBar.classList.toggle("is-scrolled", on);
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    raf(function () {
      queued = false;
      syncToc(true);
      syncProgress();
      syncHeader();
    });
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      measure();
      syncToc(false);
      syncProgress();
      if (HAS_GSAP) ST.refresh();
    }, 140);
  }

  /* =======================================================================
     4. REVEALS
     Deliberately small: 14px and 0.5s. Long-form text that slides a long way
     is annoying to read, and anything that delays the first screen is worse
     than no animation at all.
     ======================================================================= */
  function reveals() {
    if (!HAS_GSAP || reduce) return;

    var head = [$(".crumbs"), $(".doc__title"), $(".doc__lead")].filter(Boolean);
    if (head.length) {
      gsap.from(head, {
        y: 12,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.06,
        clearProps: "all",
      });
    }

    var blocks = $$(".prose > *");
    if (blocks.length) {
      // The hidden state is set here, in JS, so a failed script leaves the
      // page readable rather than blank.
      gsap.set(blocks, { opacity: 0, y: 14 });
      ST.batch(blocks, {
        start: "top 92%",
        once: true,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05,
            clearProps: "transform,opacity",
          });
        },
      });

      /* Last-resort guarantee. If a trigger never fires (a block inside a
         collapsed element, a refresh that lands wrong, anything unforeseen)
         no paragraph is left invisible. Text beats animation, every time. */
      setTimeout(function () {
        blocks.forEach(function (el) {
          if (parseFloat(getComputedStyle(el).opacity) < 0.99) {
            gsap.set(el, { clearProps: "transform,opacity" });
          }
        });
      }, 2500);
    }

    // Cards and steps lift a touch further, they read as objects not prose.
    $$(".cards").forEach(function (grid) {
      var cards = $$(".card", grid);
      if (!cards.length) return;
      gsap.from(cards, {
        y: 18,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.07,
        clearProps: "all",
        scrollTrigger: { trigger: grid, start: "top 88%", once: true },
      });
    });

    $$(".step").forEach(function (step) {
      gsap.from(step, {
        x: -8,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: { trigger: step, start: "top 90%", once: true },
      });
    });

    /* The sidebar is deliberately NOT animated. It is persistent navigation:
       the reader keeps looking at the same list from page to page, so fading
       it in on every load reads as the page reloading rather than as polish.
       Only the content that actually changed is allowed to animate. */
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  function boot() {
    if (rail && items.length) {
      var remeasure = function () {
        measure();
          syncToc(false);
      };

      remeasure();

      /* The rail is display:none below the three column breakpoint, so at
         narrow widths there is no box to measure and buildPath bails. It has
         to pick itself up the moment it becomes visible, and a resize event
         is not a reliable signal for that on its own. Belt and braces:
         a breakpoint listener, a resize observer, and a bounded retry. */
      try {
        var wide = matchMedia("(min-width: 1181px)");
        var onBreak = function () {
          if (wide.matches) remeasure();
        };
        if (wide.addEventListener) wide.addEventListener("change", onBreak);
        else if (wide.addListener) wide.addListener(onBreak);
      } catch (e) {}

      if (window.ResizeObserver) {
        new ResizeObserver(function () {
          if (geo || rail.getBoundingClientRect().height) remeasure();
        }).observe(rail);
      }

      if (!geo) {
        var tries = 0;
        var retry = setInterval(function () {
          if (geo || ++tries > 20) {
            clearInterval(retry);
            return;
          }
          remeasure();
        }, 250);
      }

      // Fonts land after first paint and change item heights, so re-measure.
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(remeasure);
    }

    syncProgress();
    syncHeader();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reveals();

    root.classList.add("motion-ready");

    /* Small diagnostic surface, in the same spirit as the app's own:
       read state, force a re-measure, nothing that can corrupt anything. */
    window.VarnMotion = {
      lenis: lenis,
      smooth: !!lenis,
      refresh: function () {
        measure();
        syncToc(false);
        syncProgress();
          if (HAS_GSAP) ST.refresh();
      },
      state: function () {
        return {
          gsap: HAS_GSAP ? gsap.version : null,
          smooth: !!lenis,
          reduced: reduce,
          touch: coarse,
          headings: tops.length,
          railBuilt: !!geo,
          dirDown: dirDown,
          thumb: { start: +state.s.toFixed(1), length: +state.l.toFixed(1), dotAtEnd: state.d },
        };
      },
    };
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
