/* =========================================================================
   Varn - Variants & Swatches  |  Marketing site behaviour
   Built by Enstacked Technologies

   One IIFE, no globals, no dependencies. Every module queries its own
   markup and returns early when it is not on the page, so a section can be
   deleted from the HTML without breaking anything else.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     Shared helpers
     ===================================================================== */

  var REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  /** Trailing-edge throttle for scroll handlers, one rAF per frame. */
  function rafThrottle(fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        fn();
      });
    };
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var self = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(self, args);
      }, wait);
    };
  }

  /* =======================================================================
     LAUNCH SWITCH  -  the one place the site flips from waitlist to live
     =======================================================================
     Before launch every call to action points at waitlist.html, which is
     what the markup ships with, so the page is correct with JavaScript
     disabled and correct if this file never loads.

     ON LAUNCH DAY: paste the App Store listing URL into LAUNCH_URL below.
     That single edit repoints every [data-launch] link, restores each
     link's own launch-day wording from its data-launch-label, and drops
     the "Launching soon" wording. Nothing else on the site has to change.
     ===================================================================== */

  var LAUNCH_URL = "";

  (function launchSwitch() {
    if (!LAUNCH_URL) return;

    qsa("[data-launch]").forEach(function (link) {
      link.setAttribute("href", LAUNCH_URL);

      var label = link.getAttribute("data-launch-label");
      var slot = qs("[data-launch-text]", link);
      if (label && slot) slot.textContent = label;
    });

    /* Wording that is only true while the app is unreleased. */
    qsa("[data-prelaunch]").forEach(function (node) {
      node.parentNode.removeChild(node);
    });
  })();

  /* =======================================================================
     Chip painting
     Colour values live in data attributes so the markup stays free of
     inline styles. This is also the seam a Liquid conversion would use:
     data-chip becomes a metafield value.
     ===================================================================== */

  function paintChips(scope) {
    qsa("[data-chip]", scope).forEach(function (chip) {
      chip.style.setProperty("--chip-a", chip.getAttribute("data-chip"));
      var second = chip.getAttribute("data-chip-b");
      if (second) chip.style.setProperty("--chip-b", second);
    });

    qsa("[data-fill]", scope).forEach(function (node) {
      node.style.backgroundColor = node.getAttribute("data-fill");
    });
  }

  /* =======================================================================
     Sliding pill indicator, shared by the demo toggle and the billing
     switch. Positions an absolute thumb behind the pressed option.
     ===================================================================== */

  function SlidingToggle(root, thumb, onChange) {
    var options = qsa("[aria-pressed]", root);
    if (!options.length || !thumb) return null;

    function move() {
      var active = options.filter(function (option) {
        return option.getAttribute("aria-pressed") === "true";
      })[0];
      if (!active) return;
      thumb.style.width = active.offsetWidth + "px";
      thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
    }

    function select(target, silent) {
      options.forEach(function (option) {
        option.setAttribute("aria-pressed", String(option === target));
      });
      move();
      if (!silent && typeof onChange === "function") onChange(target);
    }

    options.forEach(function (option) {
      option.addEventListener("click", function () {
        select(option);
      });
    });

    window.addEventListener("resize", debounce(move, 150));
    // Web fonts change button widths after first paint.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(move);
    }
    move();

    return { select: select, reposition: move, options: options };
  }

  /* =======================================================================
     MODULE - Live product demo
     A real swatch picker. Clicking a chip drives the native <select>,
     exactly the way the app drives a theme's own variant control.
     ===================================================================== */

  /* `image: true` renders the chip as a photo swatch (a generated knit
     texture in the colour), the same way the app shows a merchant-uploaded
     photo instead of a flat colour. The hex still drives the product stage. */
  var DEMO_COLOURS = [
    { name: "Lilac", hex: "#7F77DD", state: "in", image: true, photos: [0, 1, 2] },
    { name: "Blush", hex: "#ED93B1", state: "in", photos: [0, 1] },
    { name: "Terracotta", hex: "#D85A30", state: "in", image: true, photos: [0, 2] },
    { name: "Cream", hex: "#F5F1E8", state: "in", photos: [0, 1, 2] },
    {
      name: "Sage / Cream",
      hex: "#9CAF88",
      hex2: "#F5F1E8",
      mode: "duo",
      state: "in",
      photos: [0, 1]
    },
    { name: "Ink", hex: "#26242E", state: "out", image: true, photos: [0] }
  ];

  /**
   * A tiny generated "fabric photo" for image swatches: base colour, a
   * woven cross-hatch and one soft highlight so the chip reads as a photo
   * rather than a flat fill. Data URI, so the site stays asset-free.
   */
  function fabricImage(hex) {
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>" +
      "<rect width='48' height='48' fill='" + hex + "'/>" +
      "<g stroke='#ffffff' stroke-opacity='.22' stroke-width='1.6'>" +
      "<path d='M-6 6 6 -6M-6 18 18 -6M-6 30 30 -6M-6 42 42 -6M-6 54 54 -6M6 54 54 6M18 54 54 18M30 54 54 30M42 54 54 42'/>" +
      "</g>" +
      "<g stroke='#26242e' stroke-opacity='.16' stroke-width='1.6'>" +
      "<path d='M-6 -6 54 54M6 -6 54 42M18 -6 54 30M30 -6 54 18M42 -6 54 6M-6 6 36 48M-6 18 24 48M-6 30 12 48M-6 42 0 48'/>" +
      "</g>" +
      "<circle cx='14' cy='12' r='24' fill='#ffffff' fill-opacity='.14'/>" +
      "</svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  function initProductDemo() {
    var root = qs("[data-demo]");
    if (!root) return;

    var stage = qs("[data-demo-stage]", root);
    var stageTitle = qs("[data-demo-stage-title]", root);
    var select = qs("[data-demo-select]", root);
    var swatchRow = qs("[data-demo-swatches]", root);
    var valueOut = qs("[data-demo-value]", root);
    var stockOut = qs("[data-demo-stock]", root);
    var badge = qs("[data-demo-badge]", root);
    var thumbs = qsa("[data-demo-thumb]", root);
    var atc = qs("[data-demo-atc]", root);
    if (!stage || !select || !swatchRow) return;

    var buttons = [];
    var activeIndex = 0;
    var badgeTimer = null;

    function buildOptions() {
      var fragment = document.createDocumentFragment();
      DEMO_COLOURS.forEach(function (colour, index) {
        var option = document.createElement("option");
        option.value = String(index);
        option.textContent =
          colour.state === "out" ? colour.name + " - Sold out" : colour.name;
        option.disabled = colour.state === "out";
        fragment.appendChild(option);
      });
      select.appendChild(fragment);
    }

    function buildSwatches() {
      var fragment = document.createDocumentFragment();

      DEMO_COLOURS.forEach(function (colour, index) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "swatch";
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", "false");
        button.setAttribute("tabindex", index === 0 ? "0" : "-1");
        if (colour.state !== "in") button.dataset.state = colour.state;

        var chip = document.createElement("span");
        chip.className =
          "swatch__chip" +
          (colour.mode === "duo" ? " swatch__chip--duo" : "") +
          (colour.image ? " swatch__chip--photo" : "");
        chip.style.setProperty("--chip-a", colour.hex);
        if (colour.hex2) chip.style.setProperty("--chip-b", colour.hex2);
        if (colour.image) chip.style.backgroundImage = fabricImage(colour.hex);

        var label = document.createElement("span");
        label.className = "swatch__label";
        label.textContent = colour.name;

        // The accessible name carries state, never colour alone.
        var accessibleName = colour.name;
        if (colour.state === "out") {
          accessibleName += ", sold out";
          button.setAttribute("aria-disabled", "true");
        }
        button.setAttribute("aria-label", accessibleName);
        button.title = accessibleName;

        button.appendChild(chip);
        button.appendChild(label);
        fragment.appendChild(button);
        buttons.push(button);
      });

      swatchRow.appendChild(fragment);
    }

    function showBadge() {
      if (!badge) return;
      badge.classList.add("is-visible");
      window.clearTimeout(badgeTimer);
      badgeTimer = window.setTimeout(function () {
        badge.classList.remove("is-visible");
      }, 1800);
    }

    function paintStage(colour) {
      stage.style.setProperty("--product-color", colour.hex);
      qsa("[data-demo-thumb] svg", root).forEach(function (svg) {
        svg.style.setProperty("--product-color", colour.hex);
      });
      if (stageTitle) {
        stageTitle.textContent = "Atelier Knit Tee in " + colour.name;
      }
    }

    function filterGallery(colour) {
      var firstVisible = null;
      thumbs.forEach(function (thumb, index) {
        var visible = colour.photos.indexOf(index) !== -1;
        thumb.parentElement.hidden = !visible;
        if (visible && firstVisible === null) firstVisible = thumb;
        thumb.setAttribute("aria-current", "false");
      });
      if (firstVisible) firstVisible.setAttribute("aria-current", "true");
      showBadge();
    }

    /**
     * @param {number} index
     * @param {boolean} [fromSelect] true when the native control initiated it,
     *   so we do not write back into it and cause a loop.
     */
    function select_(index, fromSelect) {
      var colour = DEMO_COLOURS[index];
      if (!colour) return;

      // Sold out: announce, never force-select. This mirrors the real engine,
      // which refuses to check a control the theme has disabled.
      if (colour.state === "out") {
        if (stockOut) stockOut.textContent = colour.name + " is sold out";
        return;
      }

      activeIndex = index;

      buttons.forEach(function (button, i) {
        var isActive = i === index;
        button.setAttribute("aria-checked", String(isActive));
        button.setAttribute("tabindex", isActive ? "0" : "-1");
      });

      if (!fromSelect) select.value = String(index);
      if (valueOut) valueOut.textContent = colour.name;
      if (stockOut) stockOut.textContent = "";
      if (atc) atc.textContent = "Add to cart";

      paintStage(colour);
      filterGallery(colour);
    }

    function onSwatchClick(event) {
      var button = event.target.closest(".swatch");
      if (!button) return;
      select_(buttons.indexOf(button));
    }

    // Roving focus, the standard radiogroup keyboard contract.
    function onSwatchKeydown(event) {
      var keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
      if (keys.indexOf(event.key) === -1) return;
      event.preventDefault();

      var current = buttons.indexOf(document.activeElement);
      if (current === -1) current = activeIndex;

      var next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        next = (current + 1) % buttons.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        next = (current - 1 + buttons.length) % buttons.length;
      } else if (event.key === "Home") {
        next = 0;
      } else {
        next = buttons.length - 1;
      }

      buttons[next].focus();
      select_(next);
    }

    buildOptions();
    buildSwatches();

    swatchRow.addEventListener("click", onSwatchClick);
    swatchRow.addEventListener("keydown", onSwatchKeydown);
    select.addEventListener("change", function () {
      select_(Number(select.value), true);
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        thumbs.forEach(function (other) {
          other.setAttribute("aria-current", String(other === thumb));
        });
      });
    });

    if (atc) {
      atc.addEventListener("click", function () {
        atc.textContent = "Added - " + DEMO_COLOURS[activeIndex].name;
        window.setTimeout(function () {
          atc.textContent = "Add to cart";
        }, 1600);
      });
    }

    select_(0);
    if (badge) badge.classList.remove("is-visible");

    initDemoToggle(root);
  }

  /* =======================================================================
     MODULE - Before / after toggle
     Cross-fades the native dropdown panel and the Varn swatch panel.
     Plays itself once so the value proposition lands without a click.
     ===================================================================== */

  function initDemoToggle(demoRoot) {
    var root = qs("[data-toggle]", demoRoot);
    var thumb = qs("[data-toggle-thumb]", demoRoot);
    var panels = qsa("[data-demo-panel]", demoRoot);
    if (!root || !panels.length) return;

    function applyState(mode) {
      panels.forEach(function (panel) {
        var isActive = panel.getAttribute("data-demo-panel") === mode;
        panel.setAttribute("aria-hidden", String(!isActive));
      });
    }

    var toggle = SlidingToggle(root, thumb, function (target) {
      applyState(target.getAttribute("data-toggle-option"));
    });
    if (!toggle) return;

    applyState("before");

    // Auto-reveal: run the toggle once when the demo is first seen.
    if (REDUCED_MOTION.matches || !("IntersectionObserver" in window)) {
      window.setTimeout(function () {
        var after = toggle.options.filter(function (option) {
          return option.getAttribute("data-toggle-option") === "after";
        })[0];
        if (after) toggle.select(after);
      }, 900);
      return;
    }

    var played = false;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || played) return;
          played = true;
          observer.disconnect();
          window.setTimeout(function () {
            var after = toggle.options.filter(function (option) {
              return option.getAttribute("data-toggle-option") === "after";
            })[0];
            if (after) toggle.select(after);
          }, 1300);
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(demoRoot);
  }

  /* =======================================================================
     MODULE - Theme marquee
     Built from data so a name is a one-line change, and duplicated once so
     the CSS translate loop is seamless.
     ===================================================================== */

  var THEME_ITEMS = [
    { name: "Dawn", dot: "#7F77DD" },
    { name: "Horizon", dot: "#ED93B1" },
    { name: "Refresh", dot: "#D85A30" },
    { name: "Craft", dot: "#9CAF88" },
    { name: "Sense", dot: "#7F77DD" },
    { name: "Studio", dot: "#ED93B1" },
    { name: "Origin", dot: "#D85A30" },
    { name: "Online Store 2.0 themes", dot: "#26242E" },
    { name: "PageFly", dot: "#7F77DD" },
    { name: "GemPages", dot: "#ED93B1" },
    { name: "Quick-view apps", dot: "#D85A30" },
    { name: "Collection filter apps", dot: "#9CAF88" }
  ];

  function initMarquee() {
    var track = qs("[data-marquee-track]");
    if (!track) return;

    function buildItem(item, isClone) {
      var li = document.createElement("li");
      li.className = "marquee__item";
      if (isClone) li.setAttribute("aria-hidden", "true");

      var dot = document.createElement("span");
      dot.className = "marquee__dot";
      dot.style.backgroundColor = item.dot;

      var label = document.createElement("span");
      label.textContent = item.name;

      li.appendChild(dot);
      li.appendChild(label);
      return li;
    }

    var fragment = document.createDocumentFragment();
    THEME_ITEMS.forEach(function (item) {
      fragment.appendChild(buildItem(item, false));
    });
    THEME_ITEMS.forEach(function (item) {
      fragment.appendChild(buildItem(item, true));
    });
    track.appendChild(fragment);
  }

  /* =======================================================================
     MODULE - How it works
     Highlights the step nearest the middle of the viewport and swaps the
     pinned admin mock to match.
     ===================================================================== */

  function initSteps() {
    var root = qs("[data-steps]");
    if (!root) return;

    var steps = qsa("[data-step]", root);
    var panels = qsa("[data-mock-panel]", root);
    var label = qs("[data-mock-label]", root);
    if (!steps.length || !panels.length) return;

    var labels = [
      "Varn › Activate",
      "Varn › Products",
      "Varn › Options",
      "Varn › Configure",
      "Varn › Go live"
    ];
    var current = -1;
    var aiPlayed = false;

    function playAiPanel() {
      if (aiPlayed) return;
      aiPlayed = true;

      var panel = qs("[data-mock-ai]", root);
      if (!panel) return;
      var rows = qsa("[data-ai-row]", panel);
      var note = qs("[data-ai-note]", panel);
      var swatchColours = ["#7F77DD", "#ED93B1", "#D85A30", "#9CAF88"];
      var delay = REDUCED_MOTION.matches ? 0 : 260;

      rows.forEach(function (row, index) {
        window.setTimeout(function () {
          var chip = qs(".mock__row-chip", row);
          var state = qs(".mock__row-state", row);
          if (chip) chip.style.backgroundColor = swatchColours[index];
          if (state) state.textContent = "Matched";
          row.classList.add("is-matched");
          if (note && index === rows.length - 1) {
            note.textContent = "Matched 4 of 4 colors from their names.";
          }
        }, delay * (index + 1));
      });
    }

    function activate(index) {
      if (index === current) return;
      current = index;

      steps.forEach(function (step, i) {
        step.classList.toggle("is-active", i === index);
      });
      panels.forEach(function (panel, i) {
        panel.hidden = i !== index;
      });
      if (label) label.textContent = labels[index] || labels[0];
      if (index === 3) playAiPanel();
    }

    if (!("IntersectionObserver" in window)) {
      activate(0);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          activate(steps.indexOf(entry.target));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });
    activate(0);
  }

  /* =======================================================================
     MODULE - Style studio
     Writes CSS custom properties on the preview, the same mechanism the
     real storefront stylesheet uses.
     ===================================================================== */

  function initStudio() {
    var root = qs("[data-studio]");
    if (!root) return;

    var preview = qs("[data-studio-preview]", root);
    var sizeInput = qs("[data-studio-size]", root);
    var gapInput = qs("[data-studio-gap]", root);
    var borderInput = qs("[data-studio-border]", root);
    var labelsInput = qs("[data-studio-labels]", root);
    var sizeOut = qs("[data-studio-size-out]", root);
    var gapOut = qs("[data-studio-gap-out]", root);
    var borderOut = qs("[data-studio-border-out]", root);
    var shapeButtons = qsa("[data-studio-shape]", root);
    if (!preview) return;

    function setVar(name, value) {
      preview.style.setProperty(name, value);
    }

    if (sizeInput) {
      sizeInput.addEventListener("input", function () {
        setVar("--swatch-size", sizeInput.value + "px");
        if (sizeOut) sizeOut.textContent = sizeInput.value + " px";
      });
    }

    if (gapInput) {
      gapInput.addEventListener("input", function () {
        setVar("--swatch-gap", gapInput.value + "px");
        if (gapOut) gapOut.textContent = gapInput.value + " px";
      });
    }

    if (borderInput) {
      borderInput.addEventListener("input", function () {
        setVar("--swatch-border", borderInput.value + "px");
        if (borderOut) borderOut.textContent = borderInput.value + " px";
      });
    }

    if (labelsInput) {
      labelsInput.addEventListener("change", function () {
        preview.classList.toggle("swatches--no-labels", !labelsInput.checked);
      });
    }

    shapeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        shapeButtons.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === button));
        });
        setVar("--swatch-radius", button.getAttribute("data-studio-shape"));
      });
    });
  }

  /* =======================================================================
     MODULE - AI setup demo
     A push-button reproduction of one-click AI setup, including the value
     it deliberately leaves alone.
     ===================================================================== */

  var AI_SETUP_MATCHES = ["#1F3A6E", "#D85A30", "#9CAF88", "#ED93B1", null];

  function initAiDemo() {
    var root = qs("[data-ai-demo]");
    if (!root) return;

    var rows = qsa("[data-ai2-row]", root);
    var note = qs("[data-ai2-note]", root);
    var button = qs("[data-ai2-run]", root);
    if (!rows.length || !button) return;

    var timers = [];

    function reset() {
      timers.forEach(window.clearTimeout);
      timers = [];
      rows.forEach(function (row) {
        var chip = qs(".mock__row-chip", row);
        var state = qs(".mock__row-state", row);
        if (chip) chip.style.backgroundColor = "";
        if (state) state.textContent = "Not set";
        row.classList.remove("is-matched");
      });
      if (note) note.textContent = "5 values waiting.";
      button.textContent = "Run one-click AI setup";
      button.disabled = false;
    }

    function run() {
      button.disabled = true;
      button.textContent = "Matching…";
      var delay = REDUCED_MOTION.matches ? 0 : 280;

      rows.forEach(function (row, index) {
        timers.push(
          window.setTimeout(function () {
            var chip = qs(".mock__row-chip", row);
            var state = qs(".mock__row-state", row);
            var match = AI_SETUP_MATCHES[index];

            if (match) {
              if (chip) chip.style.backgroundColor = match;
              if (state) state.textContent = "Matched";
              row.classList.add("is-matched");
            } else if (state) {
              state.textContent = "Left for you";
            }

            if (index === rows.length - 1) {
              if (note) {
                note.textContent =
                  "Matched 4 of 5. “Atelier Special” is not a color, so it was left untouched.";
              }
              button.textContent = "Run again";
              button.disabled = false;
            }
          }, delay * (index + 1))
        );
      });
    }

    button.addEventListener("click", function () {
      if (button.textContent === "Run again") {
        reset();
        window.setTimeout(run, 120);
        return;
      }
      run();
    });
  }

  /* =======================================================================
     MODULE - Billing switch
     ===================================================================== */

  function initBilling() {
    var root = qs("[data-billing]");
    var thumb = qs("[data-billing-thumb]");
    if (!root || !thumb) return;

    var amounts = qsa("[data-price-monthly]");
    var strikes = qsa("[data-strike-yearly]");
    var periods = qsa("[data-period]");
    var notes = qsa("[data-note-monthly]");

    /* Every string comes from a data attribute on the element that shows it,
       so the monthly and yearly wording lives beside the price it belongs to
       and cannot drift from the plan card in the app. The Free card carries
       none of these attributes, so it is never rewritten. */
    function apply(mode) {
      var yearly = mode === "yearly";

      amounts.forEach(function (amount) {
        amount.textContent = yearly
          ? amount.getAttribute("data-price-yearly")
          : amount.getAttribute("data-price-monthly");
      });

      /* The yearly discount is shown as the crossed-out monthly-for-a-year
         price, never a percentage, matching the app plan cards. It is hidden
         entirely on the monthly view so there is nothing to cross out. */
      strikes.forEach(function (strike) {
        strike.hidden = !yearly;
      });

      periods.forEach(function (period) {
        period.textContent = yearly
          ? period.getAttribute("data-period-yearly")
          : period.getAttribute("data-period");
      });

      notes.forEach(function (note) {
        note.textContent = yearly
          ? note.getAttribute("data-note-yearly")
          : note.getAttribute("data-note-monthly");
      });
    }

    SlidingToggle(root, thumb, function (target) {
      apply(target.getAttribute("data-billing-option"));
    });
    apply("monthly");
  }

  /* =======================================================================
     MODULE - Header + mobile call to action
     Sticky header condenses on scroll and hides while scrolling down.
     ===================================================================== */

  function initHeader() {
    var header = qs("[data-site-header]");
    var mobileCta = qs("[data-mobile-cta]");
    if (!header && !mobileCta) return;

    var lastY = window.scrollY;
    var threshold = 24;
    var pinnedUntil = 0;

    var onScroll = rafThrottle(function () {
      var y = window.scrollY;

      if (header) {
        header.classList.toggle("is-stuck", y > threshold);
        var scrollingDown = y > lastY && y > 240;
        var pinned = Date.now() < pinnedUntil;
        header.classList.toggle("is-hidden", scrollingDown && !pinned);
      }

      if (mobileCta) {
        mobileCta.classList.toggle("is-visible", y > 620);
      }

      lastY = y;
    });

    // An in-page jump scrolls DOWN, which would otherwise hide the nav the
    // visitor just used. Pin it for the duration of the smooth scroll.
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute("href") === "#") return;
      pinnedUntil = Date.now() + 1200;
      if (header) header.classList.remove("is-hidden");
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =======================================================================
     MODULE - Number count-up and bar fills
     Runs once per element when it first scrolls into view.
     ===================================================================== */

  function initReveals() {
    var counters = qsa("[data-count-to]");
    var fills = qsa("[data-fill-to]");

    // Reserve the final value first so nothing can shift layout later.
    fills.forEach(function (fill) {
      fill.style.setProperty("--fill", fill.getAttribute("data-fill-to") + "%");
    });

    if (REDUCED_MOTION.matches || !("IntersectionObserver" in window)) return;

    fills.forEach(function (fill) {
      fill.style.setProperty("--fill", "0%");
    });

    function countUp(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      var suffix = el.getAttribute("data-count-suffix") || "";
      var duration = 900;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          observer.unobserve(el);

          if (el.hasAttribute("data-count-to")) {
            countUp(el);
          } else {
            el.style.setProperty("--fill", el.getAttribute("data-fill-to") + "%");
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.concat(fills).forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =======================================================================
     MODULE - Variants gallery mock
     The per-color photo demo: clicking a color chip filters the photo grid
     to that color's set, the same thing the app does to a real product
     gallery. Pure show/hide, no animation.
     ===================================================================== */

  function initVariantsGallery() {
    var root = qs("[data-vgal]");
    if (!root) return;

    var chips = qsa("[data-vgal-color]", root);
    var photos = qsa("[data-vgal-photo]", root);
    var note = qs("[data-vgal-note]", root);
    if (!chips.length || !photos.length) return;

    var NOTES = {
      lilac: "Lilac owns 3 photos. Shoppers who pick Lilac see these, cover first.",
      clay: "Clay owns 2 photos. The flat-lay you set as cover leads.",
      sage: "Sage owns 1 photo, so the gallery shows exactly that one."
    };

    function select(color) {
      chips.forEach(function (chip) {
        chip.setAttribute(
          "aria-pressed",
          String(chip.getAttribute("data-vgal-color") === color)
        );
      });
      photos.forEach(function (photo) {
        photo.hidden = photo.getAttribute("data-vgal-photo") !== color;
      });
      if (note && NOTES[color]) note.textContent = NOTES[color];
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        select(chip.getAttribute("data-vgal-color"));
      });
    });
  }

  /* =======================================================================
     MODULE - Journey path
     A scroll-driven SVG route that travels the whole page: a faint dotted
     track shows the route ahead, a gradient line draws itself as far as
     the visitor has scrolled, checkpoint dots light up at every section,
     and a swatch-chip traveler rides the line, changing color at each
     stop. Desktop only; never runs under prefers-reduced-motion.
     ===================================================================== */

  function initJourney() {
    var host = qs("[data-journey]");
    var topHost = qs("[data-journey-top]");
    var main = qs("#main");
    if (!host || !main) return;
    if (REDUCED_MOTION.matches) return;

    var SVG_NS = "http://www.w3.org/2000/svg";
    var DESKTOP = window.matchMedia("(min-width: 992px)");
    var COLORS = ["#7F77DD", "#ED93B1", "#D85A30", "#9CAF88"];
    var SAMPLE_STEP = 6; // px of path length per cached sample
    var APP_URL = "https://apps.shopify.com/varn-variants-swatches-ai";
    /* How far the dart reaches from the point it is drawn at: 34px nose,
       21px half-wingspan, plus stroke and drop shadow. Every clearance
       below is measured against this, so resizing the dart in build()
       means changing this number and nothing else. */
    var PLANE_REACH = 40;
    /* The tour ENDS in the seam above the closing panel. The dart parks
       there with its final note under it, so the gap has to hold the whole
       dart clear of the dark edge - the closer's own top margin in the
       stylesheet is sized to match. */
    var FINISH_GAP = 108;
    /* The last leg drops STRAIGHT DOWN into the finish, so the dart levels
       out and points at the closing CTA instead of parking at a diagonal.
       It has to be longer than the window angleAt() measures the heading
       over (+/-26px), or the nose would still be reading the curve behind
       it and the arrival would look crooked however straight the line is. */
    var LEVEL_OUT = 72;

    /* One notification per checkpoint, keyed by the section's
       aria-labelledby, so reordering sections cannot mislabel a stop. */
    var STOP_NOTES = {
      "themes-title": { text: "Works with the theme you already have" },
      "how-title": { text: "The app does most of the setup" },
      "features-title": { text: "Everything a swatch should do" },
      "agent-title": { text: "Ready for AI shoppers" },
      "variants-title": { text: "Every color gets its own gallery" },
      "groups-title": { text: "Separate products, one swatch row" },
      "studio-title": { text: "Style it like your store" },
      "surfaces-title": { text: "Swatches everywhere shoppers browse" },
      "ai-title": { text: "AI setup names your colors in one pass" },
      "analytics-title": { text: "Every click becomes a signal" },
      "proof-title": { text: "What it touches, and what it leaves alone" },
      "pricing-title": { text: "Starter is free forever", cta: "Install app", href: APP_URL },
      "maker-title": {
        text: "Built by Enstacked Technologies",
        cta: "enstacked.com",
        href: "https://enstacked.com"
      },
      "faq-title": { text: "Questions, answered" },
      "closer-title": { text: "End of the tour", cta: "Add Varn free", href: APP_URL }
    };

    var trailEl = null;
    var clipRectEl = null;
    var travelerEl = null;
    var nodeEls = [];
    var toastEls = [];
    var nodeLens = [];
    var samples = []; // { len, x, y } along the path, y is monotonic
    var totalLen = 0;
    var mainTop = 0;
    var headerH = 68;
    var routeStartY = 0;
    var currentLen = 0;
    var targetLen = 0;
    var currentAngle = 0;
    var lastNow = 0;
    var ticking = false;
    var shownStop = -2; // -2 forces the first paint to settle toast state

    function el(name, attrs) {
      var node = document.createElementNS(SVG_NS, name);
      for (var key in attrs) node.setAttribute(key, attrs[key]);
      return node;
    }

    /** Every top-level section after the hero is a stop on the route. */
    function stops() {
      return qsa(":scope > section", main).filter(function (section) {
        return !section.classList.contains("hero");
      });
    }

    /** The vertical LANE the route flies in: the free strip between the
        viewport edge and the text column.

        This is what makes the route visible for the whole page instead of
        only in the seams. The tinted and ink panels are inset rounded
        cards, but their CONTENT starts at the shell's padding edge, so a
        route kept inside this strip crosses a panel's margin and never its
        words. That in turn lets the layer be drawn ABOVE the panels
        (`journey--over`) rather than diving behind them.

        Below about 1360px (measured, not guessed: the shell's padding is
        fluid) the strip is too narrow to hold the dart, so `over` goes
        false and the route keeps the original behaviour - under the panels,
        showing in the seams between them. */
    function laneGeometry(width) {
      var shell = qs("#main .shell");
      var edge = width * 0.055;
      if (shell) {
        var r = shell.getBoundingClientRect();
        var pad = parseFloat(window.getComputedStyle(shell).paddingLeft) || 0;
        if (r.width) edge = r.left + pad;
      }
      return {
        // Centred in the strip, but never nearer the viewport edge than
        // the dart is wide, and never so far in that it drifts off the
        // margin on an ultra-wide screen.
        x: Math.min(Math.max(edge / 2, PLANE_REACH * 0.7), 110),
        over: edge >= PLANE_REACH * 2
      };
    }

    /** The blank band at the head and at the foot of a section, MEASURED
        off what is actually painted rather than read off the CSS padding.
        The two differ: the FAQ list overflows its own padding box, so a
        turn planned from the padding clips the last answer on the way out.
        Returned in pixels from the section's own top and bottom edges. */
    function freeBand(section) {
      var r = section.getBoundingClientRect();
      var head = r.height / 2;
      var foot = r.height / 2;
      qsa(".shell *", section).forEach(function (node) {
        var b = node.getBoundingClientRect();
        if (b.width < 4 || b.height < 4) return;
        head = Math.min(head, b.top - r.top);
        foot = Math.min(foot, r.bottom - b.bottom);
      });
      return { head: Math.max(head, 0), foot: Math.max(foot, 0) };
    }

    /** Alternating left / right waypoints. The route DEPARTS from the dot
        on the hero pill, drops into the left lane, then runs STRAIGHT DOWN
        one lane for the length of each section and crosses to the other
        lane between them, finishing center-stage in the seam just above the
        closing panel. Waypoints without a key are route geometry only,
        never a checkpoint.

        The turn points sit inside each section's own blank band (see
        freeBand). That is the load-bearing part of the shape: it confines
        every left-to-right crossing to empty space - one section's foot
        gap, the seam, the next section's head gap - so the diagonal never
        passes over a heading or a card, which is the only reason the route
        can be drawn on top of the panels at all. */
    function waypoints(width, lane) {
      var sections = stops();
      var pts = [];

      sections.forEach(function (section, i) {
        var key = section.getAttribute("aria-labelledby") || "";
        var top = section.offsetTop;
        var h = section.offsetHeight;

        if (i === sections.length - 1) {
          // Two points, same x: pathFrom puts both control points on the
          // vertical midpoint, so an unchanged x IS a straight line down.
          var finishY = top - FINISH_GAP;
          pts.push({ x: width / 2, y: finishY - LEVEL_OUT, side: "center", key: "" });
          pts.push({ x: width / 2, y: finishY, side: "center", key: key });
          return;
        }

        var side = i % 2 === 0 ? "left" : "right";
        var x = side === "left" ? lane.x : width - lane.x;
        /* The turns sit HALFWAY into the section's own blank band, so the
           crossing that follows is made of nothing but blank: this
           section's foot gap, the seam, and the next section's head gap.
           Capped so a tall section still gets a long straight run, floored
           so a section with almost no gap still turns before its content,
           and held clear of the mid-point checkpoint either way. */
        var band = freeBand(section);
        var turnIn = Math.min(150, Math.max(band.head / 2, 34), h * 0.3);
        var turnOut = Math.min(150, Math.max(band.foot / 2, 34), h * 0.3);

        pts.push({ x: x, y: top + turnIn, side: side, key: "" });
        pts.push({ x: x, y: top + h / 2, side: side, key: key });
        pts.push({ x: x, y: top + h - turnOut, side: side, key: "" });
      });

      /* The route DEPARTS FROM the dot on the hero pill, and must not fly
         through the hero copy on its way out. So two points are pushed on
         the front: the dot itself, marked as a sideways departure, and a
         turn in the empty left margin ABOVE the headline. From there the
         route runs straight down that margin, which measures clear of the
         hero's leftmost text by a wide margin at every breakpoint (the
         copy is centred, this lane is not). The pill scrolls with the page
         (unlike the fixed header), so its document position needs the
         scroll offset added before mainTop is taken off. */
      var startX = width / 2;
      var startY = 6;
      var dot = qs(".hero__pill-dot") || qs(".hero__pill");
      if (dot) {
        var r = dot.getBoundingClientRect();
        if (r.width) {
          startX = r.left + r.width / 2;
          startY = r.top + r.height / 2 + window.scrollY - mainTop;
        }
      }
      /* The turn is placed well DOWN the page, not just under the pill.
         Position is driven by scroll, i.e. by y, so a segment that is wide
         in x but short in y gets crossed in a few pixels of scrolling and
         reads as a teleport. Giving the sweep real vertical extent is what
         makes it travel. It still clears the copy because the hero text is
         centred and this lane is not: the curve is already left of the
         headline's first glyph by the time it reaches that band. */
      pts.unshift({ x: lane.x, y: startY + 300, side: "turn", key: "" });
      pts.unshift({
        x: startX,
        y: startY,
        side: "start",
        key: "",
        depart: "side"
      });
      return pts;
    }

    /** Smooth S-curves: both control points sit at the vertical midpoint,
        which keeps y strictly monotonic so scroll position maps to one
        unique point on the path.

        The one exception is the departure segment, which leaves SIDEWAYS
        instead of dropping: the pill sits directly above the headline, so
        a vertical exit would fly the route straight through the words. Its
        control points are pulled along x and kept early in y, which banks
        the plane out into the empty margin above the headline and has it
        already pointing down on arrival. Both control y values still rise
        from a.y to b.y, so monotonicity - and therefore the whole
        scroll-maps-to-one-point model - is preserved. */
    function pathFrom(pts) {
      var d = "M " + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1];
        var b = pts[i];
        var c1x, c1y, c2x, c2y;
        if (a.depart === "side") {
          var dy = b.y - a.y;
          c1x = a.x + (b.x - a.x) * 0.85;
          c1y = a.y + dy * 0.05;
          c2x = b.x;
          c2y = a.y + dy * 0.5;
        } else {
          c1x = a.x;
          c2x = b.x;
          c1y = c2y = (a.y + b.y) / 2;
        }
        d +=
          " C " + c1x.toFixed(1) + " " + c1y.toFixed(1) +
          ", " + c2x.toFixed(1) + " " + c2y.toFixed(1) +
          ", " + b.x.toFixed(1) + " " + b.y.toFixed(1);
      }
      return d;
    }

    /** Path length at a given document y, via binary search over samples. */
    function lenAtY(y) {
      var lo = 0;
      var hi = samples.length - 1;
      if (y <= samples[0].y) return samples[0].len;
      if (y >= samples[hi].y) return samples[hi].len;
      while (lo < hi) {
        var mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo].len;
    }

    /** The anchor line the logo tracks slides down the viewport as the
        page is scrolled: at the very top it sits just under the navbar,
        so the logo visibly departs from the brand mark on the first
        scroll, and by the bottom it has drifted to ~85% of the viewport,
        so the logo still reaches the destination pin. */
    function lenForViewport() {
      var doc = document.documentElement;
      var maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      var p = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      // Start just PAST the departure turn, so at rest the plane is already
      // clear of the pill with its trail showing where it came from,
      // instead of parked invisibly behind the pill's own background.
      var top = Math.max(headerH + 44, routeStartY + 48);
      var anchor = top + p * (window.innerHeight * 0.85 - top);
      return lenAtY(window.scrollY + anchor - mainTop);
    }

    /** Position at ANY path length, interpolated between the two nearest
        cached samples. Without this the plane would hop in SAMPLE_STEP
        increments, which is the difference between gliding and stepping. */
    function pointAt(len) {
      var f = Math.max(0, Math.min(len, totalLen)) / SAMPLE_STEP;
      var i0 = Math.min(Math.floor(f), samples.length - 1);
      var i1 = Math.min(i0 + 1, samples.length - 1);
      var t = f - i0;
      var a = samples[i0];
      var b = samples[i1];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }

    /** Heading in degrees, measured across a fixed window either side of
        the plane: wide enough to stay steady on the straights, short
        enough to actually lean into the curves. */
    function angleAt(len) {
      var back = pointAt(len - 26);
      var fwd = pointAt(len + 26);
      return (Math.atan2(fwd.y - back.y, fwd.x - back.x) * 180) / Math.PI;
    }

    function paint(len, angle) {
      var p = pointAt(len);

      // Reveal the trail down to the mark, and no further.
      clipRectEl.setAttribute("height", Math.max(p.y, 0).toFixed(1));

      // A plane points where it is going, so this is the full heading, not
      // the clamped lean the logo needed.
      travelerEl.setAttribute(
        "transform",
        "translate(" + p.x.toFixed(2) + " " + p.y.toFixed(2) + ")" +
          " rotate(" + angle.toFixed(2) + ")"
      );

      // nodeLens runs down the page, so the first checkpoint we have NOT
      // reached ends the search.
      var stop = -1;
      for (var i = 0; i < nodeLens.length; i++) {
        if (len < nodeLens[i] - 1) break;
        stop = i;
      }

      // Only touch the DOM when the current checkpoint actually changes -
      // every frame in between is one transform and one clip height. The
      // checkpoint dots need no state of their own: the clip is what
      // reveals them.
      if (stop === shownStop) return;
      shownStop = stop;
      for (var n = 0; n < toastEls.length; n++) {
        if (toastEls[n]) toastEls[n].classList.toggle("is-on", n === stop);
      }
    }

    function build() {
      host.textContent = "";
      if (topHost) topHost.textContent = "";
      trailEl = clipRectEl = travelerEl = null;
      nodeEls = [];
      toastEls = [];
      nodeLens = [];
      samples = [];
      shownStop = -2;
      if (!DESKTOP.matches) return;

      var width = main.clientWidth;
      var height = main.offsetHeight;

      // Measured BEFORE waypoints(), which needs mainTop to place the
      // navbar departure point.
      mainTop = main.getBoundingClientRect().top + window.scrollY;
      var headerEl = qs(".site-header");
      if (headerEl && headerEl.offsetHeight) headerH = headerEl.offsetHeight;

      var lane = laneGeometry(width);
      /* Wide enough for the dart to fly in the margin, so the route is
         lifted ABOVE the panels and stays visible the whole way down.
         Narrower than that and it keeps diving behind them. */
      host.classList.toggle("journey--over", lane.over);

      var pts = waypoints(width, lane);
      if (pts.length < 2) return;
      routeStartY = pts[0].y;

      var svg = el("svg", {
        viewBox: "0 0 " + width + " " + height,
        "aria-hidden": "true",
        focusable: "false"
      });

      /* The reveal is a plain rectangular clip, not a dash offset, because
         the trail is DOTTED: a dash pattern can draw the dots or animate
         the reveal, never both on one path. It works because the route is
         monotonic in y by construction (every curve puts both control
         points on the vertical midpoint), so "hide everything below the
         mark" is exactly "hide the part not yet travelled". Cost is one
         attribute per frame, and the browser only paints the strip that is
         actually on screen. */
      var defs = el("defs", {});
      var clip = el("clipPath", { id: "journey-clip" });
      clipRectEl = el("rect", {
        x: "0",
        y: "0",
        width: String(width),
        height: "0"
      });
      clip.appendChild(clipRectEl);
      defs.appendChild(clip);
      svg.appendChild(defs);

      // Trail and checkpoints share the clip, so nothing ahead of the mark
      // is ever drawn - no preview of the route.
      var travelled = el("g", { "clip-path": "url(#journey-clip)" });
      var d = pathFrom(pts);
      /* The same dotted route drawn twice: a slightly larger page-coloured
         dot under each ink dot. On the white page the halo is invisible;
         over an ink or tinted panel it is what you actually see, which is
         what lets one trail read on every background the page has. */
      travelled.appendChild(el("path", { class: "journey__trail-halo", d: d }));
      trailEl = el("path", { class: "journey__trail", d: d });
      travelled.appendChild(trailEl);
      svg.appendChild(travelled);
      host.appendChild(svg);

      // Measure once, then answer every scroll frame from the cache.
      totalLen = trailEl.getTotalLength();

      for (var lenPos = 0; lenPos < totalLen; lenPos += SAMPLE_STEP) {
        var p = trailEl.getPointAtLength(lenPos);
        samples.push({ len: lenPos, x: p.x, y: p.y });
      }
      var endPoint = trailEl.getPointAtLength(totalLen);
      samples.push({ len: totalLen, x: endPoint.x, y: endPoint.y });

      pts.forEach(function (pt) {
        // Most waypoints are route geometry (lane entry and exit, the
        // departure turn); only a keyed one is a checkpoint. The colour
        // cycles per CHECKPOINT, not per waypoint, so it stays even.
        if (!pt.key) return;
        var i = nodeEls.length;
        nodeLens.push(lenAtY(pt.y));
        var node = el("circle", {
          class: "journey__node",
          cx: pt.x.toFixed(1),
          cy: pt.y.toFixed(1),
          r: "7"
        });
        travelled.appendChild(node);
        nodeEls.push(node);

        // The notification bubble for this stop, in the layer above the
        // sections. Links inside get tabindex -1: the layer is decorative
        // (aria-hidden) and both CTAs exist as real page links elsewhere.
        var note = STOP_NOTES[pt.key];
        if (!topHost || !note) {
          toastEls.push(null);
          return;
        }
        var toast = document.createElement("div");
        toast.className = "jtoast";
        toast.setAttribute("data-side", pt.side);
        toast.style.left = pt.x.toFixed(1) + "px";
        toast.style.top = pt.y.toFixed(1) + "px";

        var dot = document.createElement("span");
        dot.className = "jtoast__dot";
        dot.style.backgroundColor = COLORS[i % COLORS.length];
        toast.appendChild(dot);

        var text = document.createElement("span");
        text.textContent = note.text;
        toast.appendChild(text);

        if (note.cta && note.href) {
          var cta = document.createElement("a");
          cta.className = "jtoast__cta";
          cta.href = note.href;
          cta.textContent = note.cta;
          cta.tabIndex = -1;
          if (note.href.indexOf("http") === 0) cta.rel = "noopener";
          toast.appendChild(cta);
        }
        topHost.appendChild(toast);
        toastEls.push(toast);
      });

      /* The traveler is the Varn brand mark itself, the same asset the
         navbar shows, so the story reads as the navbar logo detaching and
         escorting the visitor down the page. It stays upright and only
         LEANS into curves (see paint), because a logo shown sideways
         stops being a logo. */
      /* The traveler: a black-and-white sketch paper dart, ~60px long,
         drawn nose-first along +x so the tangent rotation in paint()
         points it down the route. Three shapes, painted back to front:
         the far wing, the underside keel, then the near wing on top. */
      travelerEl = el("g", { class: "journey__traveler" });
      travelerEl.appendChild(
        el("path", { class: "journey__plane-bot", d: "M34 0 L-12 0 L-26 21 Z" })
      );
      travelerEl.appendChild(
        el("path", { class: "journey__plane-keel", d: "M34 0 L-12 0 L-3 7 Z" })
      );
      travelerEl.appendChild(
        el("path", { class: "journey__plane-top", d: "M34 0 L-26 -21 L-12 0 Z" })
      );
      svg.appendChild(travelerEl);

      // Start already pointing the right way: a plane that spins from 0
      // on load (or after a resize rebuild) reads as a glitch.
      currentLen = targetLen = lenForViewport();
      currentAngle = angleAt(currentLen);
      lastNow = 0;
      paint(currentLen, currentAngle);
    }

    /* The plane eases toward the scroll target instead of snapping, so a
       fast scroll reads as travel. The easing is EXPONENTIAL AND TIME
       BASED, not a fixed per-frame fraction, so the glide looks identical
       on a 60Hz and a 144Hz screen and survives a dropped frame. The loop
       runs only while it is catching up. */
    var FOLLOW_MS = 130; // time constant: bigger = longer, lazier glide

    function tick(now) {
      var dt = lastNow ? Math.min(now - lastNow, 64) : 16;
      lastNow = now;
      var k = 1 - Math.exp(-dt / FOLLOW_MS);

      var gap = targetLen - currentLen;
      if (Math.abs(gap) < 0.25) currentLen = targetLen;
      else currentLen += gap * k;

      // Turn the short way round, so crossing the +/-180 seam never spins.
      var want = angleAt(currentLen);
      var turn = ((want - currentAngle + 540) % 360) - 180;
      if (Math.abs(turn) < 0.1) currentAngle = want;
      else currentAngle += turn * k;

      paint(currentLen, currentAngle);

      if (currentLen === targetLen && currentAngle === want) {
        ticking = false;
        lastNow = 0;
        return;
      }
      window.requestAnimationFrame(tick);
    }

    function onScroll() {
      // Self-heal: if the route was never built because the viewport
      // reported a mobile width at load time (pre-rendered or background
      // tabs do this), build it the moment a real desktop viewport scrolls.
      if (!samples.length) {
        if (!DESKTOP.matches) return;
        build();
        if (!samples.length) return;
      }
      targetLen = lenForViewport();
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(tick);
      }
    }

    var rebuild = debounce(function () {
      build();
      onScroll();
    }, 200);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", rebuild);
    // Fonts and images can shift section heights after first paint.
    window.addEventListener("load", rebuild);
    // Crossing the desktop breakpoint has to rebuild even when no resize
    // event reaches us (embedded panes, some split-screen managers).
    if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", rebuild);
    else if (DESKTOP.addListener) DESKTOP.addListener(rebuild);

    build();
  }

  /* =======================================================================
     MODULE - Footer year
     ===================================================================== */

  function initYear() {
    var el = qs("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* =======================================================================
     Boot
     ===================================================================== */

  function boot() {
    paintChips(document);
    initProductDemo();
    initMarquee();
    initSteps();
    initStudio();
    initAiDemo();
    initBilling();
    initHeader();
    initReveals();
    initVariantsGallery();
    initJourney();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
