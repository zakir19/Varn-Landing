/* =========================================================================
   Varn v2 "Noir" | micro-interactions
   One IIFE, no globals. Every feature checks for its own markup and bails
   out when it is missing. Nothing here runs under prefers-reduced-motion
   except the class hooks that keep content visible.
   ========================================================================= */

(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");
  var FINE = window.matchMedia("(hover: hover) and (pointer: fine)");
  var HAS_IO = "IntersectionObserver" in window;
  var MOTION = !REDUCED.matches;

  function qs(sel, scope) {
    return (scope || document).querySelector(sel);
  }

  function qsa(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function rafThrottle(fn) {
    var queued = false;
    var lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        fn.apply(null, lastArgs);
      });
    };
  }

  /* 5. Scroll reveals: fade, blur and rise, staggered among siblings. */
  function initReveals() {
    var items = qsa("[data-reveal]");
    if (!items.length) return;

    function show(el) {
      el.classList.add("is-revealed");
      window.setTimeout(function () {
        el.style.removeProperty("--reveal-delay");
      }, 1600);
    }

    if (!MOTION || !HAS_IO) {
      items.forEach(function (el) {
        el.classList.add("is-revealed");
      });
      return;
    }

    items.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = Array.prototype.filter.call(parent.children, function (child) {
        return child.hasAttribute("data-reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index, 6) * 90 + "ms");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var passed = entry.boundingClientRect.bottom < 0;
          if (!entry.isIntersecting && !passed) return;
          observer.unobserve(entry.target);
          show(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* 1. Cursor spotlight on [data-spotlight] cards. */
  function initSpotlight() {
    if (!MOTION || !FINE.matches) return;
    qsa("[data-spotlight]").forEach(function (card) {
      var move = rafThrottle(function (x, y) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", (x - rect.left).toFixed(1) + "px");
        card.style.setProperty("--my", (y - rect.top).toFixed(1) + "px");
      });
      card.addEventListener("pointermove", function (event) {
        move(event.clientX, event.clientY);
      });
    });
  }

  /* 2. Hero demo: pointer tilt (max 6deg) plus a scroll-linked flatten. */
  function initTilt() {
    if (!MOTION) return;
    var stage = qs("[data-tilt-stage]");
    var frame = stage && qs("[data-tilt]", stage);
    if (!frame) return;

    var MAX = 6;
    var scrollTilt = 0;
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var running = false;

    function readScroll() {
      var rect = stage.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var start = vh * 0.95;
      var end = vh * 0.3;
      var t = clamp((start - rect.top) / (start - end), 0, 1);
      var maxScroll = window.innerWidth < 768 ? 0 : 12;
      scrollTilt = maxScroll * (1 - t);
    }

    function apply() {
      frame.style.setProperty("--rx", (scrollTilt + current.x).toFixed(2) + "deg");
      frame.style.setProperty("--ry", current.y.toFixed(2) + "deg");
    }

    function tick() {
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      if (Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01) {
        current.x = target.x;
        current.y = target.y;
        running = false;
        apply();
        return;
      }
      apply();
      window.requestAnimationFrame(tick);
    }

    function kick() {
      if (running) return;
      running = true;
      window.requestAnimationFrame(tick);
    }

    var onScroll = rafThrottle(function () {
      readScroll();
      apply();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    if (FINE.matches) {
      stage.addEventListener("pointermove", function (event) {
        var rect = frame.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var nx = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        var ny = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        target.y = nx * 2 * MAX;
        target.x = -ny * 2 * MAX;
        kick();
      });
      stage.addEventListener("pointerleave", function () {
        target.x = 0;
        target.y = 0;
        kick();
      });
    }

    readScroll();
    apply();
  }

  /* 3. Conic borders: pause the rotation while off screen. */
  function initGlowFrames() {
    if (!MOTION || !HAS_IO) return;
    var frames = qsa(".glow-frame");
    if (!frames.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
      });
    });
    frames.forEach(function (frame) {
      observer.observe(frame);
    });
  }

  /* 4. Shimmer sweep on gradient words, only while they are visible. */
  function initShimmer() {
    if (!MOTION || !HAS_IO) return;
    var words = qsa(".grad-text");
    if (!words.length) return;
    words.forEach(function (word, i) {
      word.style.setProperty("--shine-delay", (i % 5) * 700 + 600 + "ms");
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-shimmering", entry.isIntersecting);
      });
    });
    words.forEach(function (word) {
      observer.observe(word);
    });
  }

  /* 6. Magnetic pull on primary calls to action. Press scale and the glow
     sweep are pure CSS. */
  function initMagnetic() {
    if (!MOTION || !FINE.matches) return;
    qsa("[data-magnetic]").forEach(function (button) {
      var rect = null;
      var move = rafThrottle(function (x, y) {
        if (!rect) return;
        var dx = x - (rect.left + rect.width / 2);
        var dy = y - (rect.top + rect.height / 2);
        button.style.setProperty("--mag-x", clamp(dx * 0.22, -10, 10).toFixed(1) + "px");
        button.style.setProperty("--mag-y", clamp(dy * 0.35, -8, 8).toFixed(1) + "px");
      });
      button.addEventListener("pointerenter", function () {
        button.style.setProperty("--mag-x", "0px");
        button.style.setProperty("--mag-y", "0px");
        rect = button.getBoundingClientRect();
      });
      button.addEventListener("pointermove", function (event) {
        move(event.clientX, event.clientY);
      });
      button.addEventListener("pointerleave", function () {
        rect = null;
        button.style.setProperty("--mag-x", "0px");
        button.style.setProperty("--mag-y", "0px");
      });
    });
  }

  /* 7. Active section link in the header nav. nav.js owns .is-stuck. */
  function initActiveNav() {
    if (!HAS_IO) return;
    var main = qs("#main");
    var links = qsa(".site-header__link[href^='#'], .site-header__panel-link[href^='#']");
    if (!main || !links.length) return;

    var targets = {};
    links.forEach(function (link) {
      targets[link.getAttribute("href").slice(1)] = true;
    });

    var sections = qsa(":scope > section", main);
    var owner = new Map();
    var last = null;
    sections.forEach(function (section) {
      if (section.id && targets[section.id]) last = section.id;
      owner.set(section, last);
    });

    function setActive(id) {
      links.forEach(function (link) {
        if (id && link.getAttribute("href") === "#" + id) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(owner.get(entry.target));
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* 8. Agent readiness gauge fills from 0 to 82 when it scrolls in. */
  function initGauge() {
    if (!MOTION || !HAS_IO) return;
    qsa("[data-gauge]").forEach(function (gauge) {
      gauge.classList.add("is-armed");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            window.requestAnimationFrame(function () {
              gauge.classList.add("is-filled");
            });
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(gauge);
    });
  }

  /* 9. FAQ: animate <details> height open and closed. */
  function initFaq() {
    if (!MOTION) return;
    var items = qsa(".faq__item");
    if (!items.length || typeof document.body.animate !== "function") return;

    items.forEach(function (item) {
      var summary = qs("summary", item);
      var answer = qs(".faq__answer", item);
      if (!summary || !answer) return;
      var anim = null;
      var token = 0;

      /* Runs once per animation, from onfinish or from a timer fallback
         (onfinish can be delayed indefinitely in a throttled tab). */
      function settle(id, closing) {
        if (id !== token) return;
        token += 1;
        if (anim) {
          anim.cancel();
          anim = null;
        }
        if (closing) item.open = false;
        item.classList.remove("is-closing");
      }

      summary.addEventListener("click", function (event) {
        event.preventDefault();
        var from = item.open ? answer.offsetHeight : 0;

        if (anim) {
          anim.cancel();
          anim = null;
        }
        token += 1;
        var id = token;
        var closing = item.open && !item.classList.contains("is-closing");
        var duration = closing ? 320 : 420;

        if (!closing) {
          item.classList.remove("is-closing");
          item.open = true;
          anim = answer.animate(
            [
              { height: from + "px", opacity: from ? 1 : 0 },
              { height: answer.scrollHeight + "px", opacity: 1 }
            ],
            { duration: duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
          );
        } else {
          item.classList.add("is-closing");
          anim = answer.animate(
            [
              { height: from + "px", opacity: 1 },
              { height: "0px", opacity: 0 }
            ],
            { duration: duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" }
          );
        }

        anim.onfinish = function () {
          settle(id, closing);
        };
        window.setTimeout(function () {
          settle(id, closing);
        }, duration + 120);
      });
    });
  }

  /* 10. Marquee: pause while off screen (hover pause and edge fades are
     CSS). Aurora drift is CSS keyframes. */
  function initMarquee() {
    if (!MOTION || !HAS_IO) return;
    var marquee = qs("[data-marquee]");
    if (!marquee) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        marquee.classList.toggle("is-paused", !entry.isIntersecting);
      });
    }).observe(marquee);
  }

  /* 11. Light / dark theme. Light is the default; the choice is remembered.
     The swap runs inside a view transition that grows a circle out of the
     toggle, and falls back to an instant swap without motion support. */
  function initThemeToggle() {
    var buttons = qsa("[data-theme-toggle]");
    if (!buttons.length) return;
    var meta = qs("[data-theme-color]");
    var COLORS = { light: "#F8F7FB", dark: "#09080D" };

    function current() {
      return doc.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }

    function sync() {
      var isDark = current() === "dark";
      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(isDark));
      });
      if (meta) meta.setAttribute("content", COLORS[current()]);
    }

    function apply(theme) {
      doc.setAttribute("data-theme", theme);
      try {
        window.localStorage.setItem("varn-theme", theme);
      } catch (err) {
        /* private mode: the choice lasts for this page view only */
      }
      sync();
    }

    /* Freeze every CSS transition and looping animation while the theme
       swaps. Without this, ~450 color/border/shadow transitions start at
       once and the aurora, spinning borders and shimmer keep repainting
       the live snapshot the circle reveals, which drops frames badly. */
    function freeze() {
      doc.classList.add("is-theme-switching");
    }

    var switching = false;

    function unfreeze() {
      // Two frames later, so the new colors are already committed and
      // removing "transition: none" cannot start any transitions.
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          doc.classList.remove("is-theme-switching");
          switching = false;
        });
      });
    }

    function toggle(button) {
      // Ignore repeat clicks while a switch is still running.
      if (switching) return;
      switching = true;
      var next = current() === "dark" ? "light" : "dark";
      if (!MOTION || typeof document.startViewTransition !== "function") {
        freeze();
        apply(next);
        unfreeze();
        return;
      }

      var rect = button.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Freeze and swap in the same step: one style recalculation instead
      // of two, and no transition can start from the color change.
      var transition = document.startViewTransition(function () {
        freeze();
        apply(next);
      });
      transition.ready
        .then(function () {
          doc.animate(
            {
              clipPath: [
                "circle(0px at " + x + "px " + y + "px)",
                "circle(" + radius + "px at " + x + "px " + y + "px)"
              ]
            },
            {
              duration: 520,
              easing: "cubic-bezier(0.33, 1, 0.68, 1)",
              pseudoElement: "::view-transition-new(root)"
            }
          );
        })
        .catch(function () {
          /* transition skipped: the theme is already applied */
        });
      transition.finished.then(unfreeze, unfreeze);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        toggle(button);
      });
    });
    sync();
  }

  /* 12. Segmented control (studio shape): a pill slides to the pressed
     option. main.js sets aria-pressed first; this listener runs after it. */
  function initSegmented() {
    qsa("[data-segmented]").forEach(function (group) {
      var thumb = qs("[data-segmented-thumb]", group);
      if (!thumb) return;

      function move() {
        var active = qs("[aria-pressed='true']", group);
        if (!active) return;
        thumb.style.width = active.offsetWidth + "px";
        thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
      }

      group.addEventListener("click", function (event) {
        if (event.target.closest("[aria-pressed]")) move();
      });

      var resizeTimer = null;
      window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(move, 150);
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(move);

      move();
      // First placement without a slide, then enable the transition.
      window.requestAnimationFrame(function () {
        group.classList.add("has-thumb");
      });
    });
  }

  /* 13. "Without Varn": plain color-name pills. They write to the hidden
     native select and fire "change", so main.js keeps driving the stage,
     gallery and cart exactly as before. */
  function initNamePills() {
    var root = qs("[data-demo]");
    var host = root && qs("[data-name-pills]", root);
    var select = root && qs("[data-demo-select]", root);
    if (!host || !select) return;
    var valueOut = qs("[data-name-value]", root);
    var stockOut = qs("[data-name-stock]", root);
    var pills = [];

    Array.prototype.forEach.call(select.options, function (option) {
      var name = option.textContent.replace(/ - Sold out$/, "");
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "name-pill";
      pill.textContent = name;
      pill.setAttribute("data-value", option.value);
      if (option.disabled) {
        pill.classList.add("is-soldout");
        pill.setAttribute("aria-disabled", "true");
        pill.setAttribute("aria-label", name + ", sold out");
      }
      host.appendChild(pill);
      pills.push(pill);
    });

    function sync() {
      pills.forEach(function (pill) {
        var on = pill.getAttribute("data-value") === select.value;
        pill.setAttribute("aria-pressed", String(on));
        if (on && valueOut) valueOut.textContent = pill.textContent;
      });
    }

    host.addEventListener("click", function (event) {
      var pill = event.target.closest(".name-pill");
      if (!pill) return;
      if (pill.getAttribute("aria-disabled") === "true") {
        if (stockOut) stockOut.textContent = pill.textContent + " is sold out";
        return;
      }
      if (stockOut) stockOut.textContent = "";
      select.value = pill.getAttribute("data-value");
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    });

    // Swatch clicks in the "With Varn" panel set select.value without an
    // event, so re-read it after any interaction inside the demo.
    ["click", "keydown"].forEach(function (type) {
      root.addEventListener(type, function () {
        window.setTimeout(sync, 0);
      });
    });
    sync();
  }

  /* 14. Studio sliders: fill the track up to the thumb. */
  function initSliderFill() {
    qsa(".slider").forEach(function (input) {
      function paint() {
        var min = parseFloat(input.min) || 0;
        var max = parseFloat(input.max) || 100;
        var pct = ((parseFloat(input.value) - min) / (max - min)) * 100;
        input.style.setProperty("--pct", clamp(pct, 0, 100).toFixed(1) + "%");
      }
      input.addEventListener("input", paint);
      paint();
    });
  }

  function boot() {
    initNamePills();
    initSliderFill();
    initThemeToggle();
    initSegmented();
    initReveals();
    initActiveNav();
    initSpotlight();
    initTilt();
    initGlowFrames();
    initShimmer();
    initMagnetic();
    initGauge();
    initFaq();
    initMarquee();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
