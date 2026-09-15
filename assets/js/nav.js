/* =========================================================================
   Varn - Variants & Swatches  |  Site header (every page)
   Built by Enstacked Technologies

   The ONE script that drives .site-header, loaded by index.html, status.html
   and privacy.html. It used to live in main.js, which only index.html loads,
   so on the other pages the header never got its background and page text
   scrolled visibly through it.

   - is-stuck    white frosted background once the page scrolls
   - is-hidden   slides away while scrolling down, back on scroll up
   - menu        the small-screen menu (the link row is hidden below 992px)
   ========================================================================= */

(function () {
  "use strict";

  var header = document.querySelector("[data-site-header]");
  if (!header) return;

  var menuButton = header.querySelector("[data-menu-toggle]");
  var panel = header.querySelector("[data-menu-panel]");
  var DESKTOP = window.matchMedia("(min-width: 62em)");
  var THRESHOLD = 24;
  var lastY = window.scrollY;
  var pinnedUntil = 0;
  var queued = false;

  function isOpen() {
    return !!panel && !panel.hidden;
  }

  function update() {
    queued = false;
    var y = window.scrollY;
    header.classList.toggle("is-stuck", y > THRESHOLD || isOpen());

    var scrollingDown = y > lastY && y > 240;
    var pinned = Date.now() < pinnedUntil || isOpen();
    header.classList.toggle("is-hidden", scrollingDown && !pinned);
    lastY = y;
  }

  // rAF and a short timer race; whichever lands first runs. rAF is parked in
  // hidden, prerendered or battery-throttled tabs, and a lone rAF would leave
  // the header without its background for the rest of the visit.
  function onScroll() {
    if (queued) return;
    queued = true;
    var ran = false;
    var run = function () {
      if (ran) return;
      ran = true;
      update();
    };
    window.requestAnimationFrame(run);
    window.setTimeout(run, 100);
  }

  function setMenu(open, restoreFocus) {
    if (!menuButton || !panel) return;
    panel.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    header.classList.toggle("is-menu-open", open);
    header.classList.remove("is-hidden");
    update();

    if (open) {
      var first = panel.querySelector("a, button");
      if (first) first.focus();
    } else if (restoreFocus) {
      menuButton.focus();
    }
  }

  // An in-page jump scrolls DOWN, which would otherwise hide the nav the
  // visitor just used. Pin it for the duration of the smooth scroll.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (href && href.charAt(0) === "#" && href !== "#") {
      pinnedUntil = Date.now() + 1200;
      header.classList.remove("is-hidden");
    }
    if (isOpen() && panel.contains(link)) setMenu(false, false);
  });

  if (menuButton && panel) {
    menuButton.addEventListener("click", function () {
      setMenu(!isOpen(), true);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) setMenu(false, true);
    });

    // Tapping outside the header closes the menu.
    document.addEventListener("click", function (event) {
      if (isOpen() && !header.contains(event.target)) setMenu(false, false);
    });

    // Growing to desktop width closes it, since the link row takes over.
    var onBreakpoint = function (mq) {
      if (mq.matches && isOpen()) setMenu(false, false);
    };
    if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", onBreakpoint);
    else if (DESKTOP.addListener) DESKTOP.addListener(onBreakpoint);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
})();
