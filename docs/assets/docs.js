/* =========================================================================
   Varn documentation  |  client script
   Built by Enstacked Technologies

   No dependencies. Everything degrades: with JS off you still get every page,
   every link, the full sidebar (server-rendered open on the active group) and
   native <details> accordions.
   ========================================================================= */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) {
    return (ctx || doc).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  };

  /* ---------------------------------------------------------------- theme */
  var themeBtn = $("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("varn-docs-theme", next);
      } catch (e) {
        /* private mode: the choice just does not persist */
      }
    });
  }

  /* ------------------------------------------------------- sidebar drawer */
  var sidebar = $("[data-sidebar]");
  var scrim = $("[data-scrim]");
  var burger = $("[data-menu]");

  function setDrawer(open) {
    if (!sidebar) return;
    sidebar.classList.toggle("is-open", open);
    if (scrim) scrim.hidden = !open;
    if (burger) burger.setAttribute("aria-expanded", String(open));
    doc.body.style.overflow = open && window.innerWidth <= 960 ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setDrawer(!sidebar.classList.contains("is-open"));
    });
  }
  if (scrim) scrim.addEventListener("click", function () {
    setDrawer(false);
  });

  // A link tap inside the drawer should close it, not leave it hanging open.
  $$(".sb__link").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.innerWidth <= 960) setDrawer(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 960) setDrawer(false);
  });

  /* --------------------------------------------------------- nav sections */
  $$("[data-group]").forEach(function (group) {
    var head = $(".sb__grouphead", group);
    if (!head) return;
    head.addEventListener("click", function () {
      var open = group.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(open));
    });
  });

  // Keep the active nav item in view when the sidebar is taller than the pane.
  var active = $(".sb__link.is-active");
  if (active) {
    var pane = $(".sb__inner");
    if (pane) {
      var top = active.offsetTop - pane.clientHeight / 2;
      if (top > 0) pane.scrollTop = top;
    }
  }

  /* ---------------------------------------------------------- copy button */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var fig = btn.closest(".code");
      var code = fig && $("code", fig);
      if (!code) return;
      var text = code.textContent;
      var done = function () {
        var label = $("span", btn);
        var was = label.textContent;
        btn.classList.add("is-done");
        label.textContent = "Copied";
        setTimeout(function () {
          btn.classList.remove("is-done");
          label.textContent = was;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
      function fallback() {
        // clipboard API needs a secure context; this path covers file:// and http
        var ta = doc.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        doc.body.appendChild(ta);
        ta.select();
        try {
          doc.execCommand("copy");
          done();
        } catch (e) {
          /* nothing sensible to do: the code is still selectable by hand */
        }
        doc.body.removeChild(ta);
      }
    });
  });

  /* The "on this page" rail and its scroll tracking live in motion.js, which
     owns the animated SVG thumb as well as the active state. */

  /* -------------------------------------------------------------- search */
  var dlg = $("[data-search-dialog]");
  var input = $("[data-search-input]");
  var results = $("[data-search-results]");
  var empty = $("[data-search-empty]");
  var lastFocus = null;
  var cursor = -1;
  var current = [];

  function openSearch() {
    if (!dlg) return;
    lastFocus = doc.activeElement;
    dlg.hidden = false;
    doc.body.style.overflow = "hidden";
    input.value = "";
    render("");
    setTimeout(function () {
      input.focus();
    }, 20);
  }

  function closeSearch() {
    if (!dlg || dlg.hidden) return;
    dlg.hidden = true;
    doc.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$("[data-search-open]").forEach(function (b) {
    b.addEventListener("click", openSearch);
  });
  $$("[data-search-close]").forEach(function (b) {
    b.addEventListener("click", closeSearch);
  });

  doc.addEventListener("keydown", function (e) {
    var key = (e.key || "").toLowerCase();
    if ((e.metaKey || e.ctrlKey) && key === "k") {
      e.preventDefault();
      dlg && dlg.hidden ? openSearch() : closeSearch();
      return;
    }
    if (key === "/" && dlg && dlg.hidden) {
      var tag = (doc.activeElement && doc.activeElement.tagName) || "";
      if (tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        openSearch();
      }
      return;
    }
    if (!dlg || dlg.hidden) return;
    if (key === "escape") {
      e.preventDefault();
      closeSearch();
    } else if (key === "arrowdown") {
      e.preventDefault();
      move(1);
    } else if (key === "arrowup") {
      e.preventDefault();
      move(-1);
    } else if (key === "enter") {
      var el = results.children[cursor];
      var a = el && el.querySelector("a");
      if (a) {
        e.preventDefault();
        window.location.href = a.getAttribute("href");
      }
    }
  });

  function move(delta) {
    if (!current.length) return;
    cursor = (cursor + delta + current.length) % current.length;
    Array.prototype.forEach.call(results.children, function (li, i) {
      var a = li.querySelector("a");
      if (a) a.classList.toggle("is-active", i === cursor);
    });
    var el = results.children[cursor];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }

  /* Scoring: title hits beat heading hits beat body hits, and every term in
     the query has to appear somewhere or the page is dropped. Small index,
     so a linear scan is faster than building anything clever. */
  function search(q) {
    var index = window.VARN_DOCS_INDEX || [];
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var hits = [];

    for (var i = 0; i < index.length; i++) {
      var p = index[i];
      var title = p.t.toLowerCase();
      var desc = (p.d || "").toLowerCase();
      var body = (p.b || "").toLowerCase();
      var heads = (p.h || [])
        .map(function (h) {
          return h.t;
        })
        .join(" ")
        .toLowerCase();

      var score = 0;
      var all = true;

      for (var j = 0; j < terms.length; j++) {
        var t = terms[j];
        var got = 0;
        if (title.indexOf(t) === 0) got += 60;
        else if (title.indexOf(t) > -1) got += 40;
        if (heads.indexOf(t) > -1) got += 18;
        if (desc.indexOf(t) > -1) got += 12;
        if (body.indexOf(t) > -1) got += 6;
        if (!got) all = false;
        score += got;
      }
      if (!all) continue;

      // exact phrase anywhere is a strong signal
      if (terms.length > 1) {
        var phrase = terms.join(" ");
        if (title.indexOf(phrase) > -1) score += 50;
        else if (body.indexOf(phrase) > -1) score += 20;
      }

      hits.push({ p: p, score: score, snippet: snippet(p, terms[0]) });
    }

    return hits
      .sort(function (a, b) {
        return b.score - a.score;
      })
      .slice(0, 12);
  }

  function snippet(p, term) {
    var text = p.d && p.d.length > 30 ? p.d : p.b || p.d || "";
    var at = text.toLowerCase().indexOf(term);
    if (at < 0) return text.slice(0, 140);
    var from = Math.max(0, at - 45);
    return (from ? "..." : "") + text.slice(from, from + 150);
  }

  function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlight(text, terms) {
    var out = escHtml(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }

  function href(id) {
    return (window.VARN_DOCS_ROOT || "./") + id + ".html";
  }

  function render(q) {
    if (!results) return;
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    current = q.trim() ? search(q) : starters();
    cursor = current.length ? 0 : -1;

    results.innerHTML = current
      .map(function (hit, i) {
        var p = hit.p;
        return (
          '<li><a class="sres' +
          (i === 0 ? " is-active" : "") +
          '" href="' +
          href(p.id) +
          '">' +
          (p.g ? '<span class="sres__group">' + escHtml(p.g) + "</span>" : "") +
          '<span class="sres__title">' +
          (terms.length ? highlight(p.t, terms) : escHtml(p.t)) +
          "</span>" +
          '<span class="sres__snip">' +
          (terms.length ? highlight(hit.snippet, terms) : escHtml(hit.snippet)) +
          "</span></a></li>"
        );
      })
      .join("");

    if (empty) empty.hidden = !(q.trim() && !current.length);
  }

  /* With an empty box, show a useful starting point rather than nothing. */
  function starters() {
    var index = window.VARN_DOCS_INDEX || [];
    var want = [
      "getting-started/quick-start",
      "getting-started/install",
      "guides/color-swatches",
      "guides/ai-setup",
      "troubleshooting/swatches-not-showing",
      "billing/plans",
    ];
    return want
      .map(function (id) {
        for (var i = 0; i < index.length; i++) if (index[i].id === id) return index[i];
        return null;
      })
      .filter(Boolean)
      .map(function (p) {
        return { p: p, score: 0, snippet: p.d || "" };
      });
  }

  if (input) {
    var t;
    input.addEventListener("input", function () {
      clearTimeout(t);
      var v = input.value;
      t = setTimeout(function () {
        render(v);
      }, 90);
    });
  }

  /* Mac users expect Cmd, everyone else Ctrl. */
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    $$(".searchbtn__kbd").forEach(function (k) {
      k.textContent = "⌘ K";
    });
  }
})();
