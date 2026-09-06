/* =========================================================================
   VARN  —  legal pages (privacy.html)
   =========================================================================
   One job: keep the contents list in step with the section being read, so
   a long policy always says where you are. The list is a plain anchor list
   in the markup and works with this file missing; all this adds is the
   highlight and, on small screens, closing the disclosure after a jump.
   ========================================================================= */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(
    document.querySelectorAll("[data-toc-link]")
  );
  if (!links.length || !("IntersectionObserver" in window)) return;

  var toc = document.querySelector("[data-toc]");
  var byId = {};
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (!section) return;
    byId[id] = link;
    sections.push(section);
  });

  var current = null;

  function mark(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (link) {
      link.removeAttribute("aria-current");
    });
    if (byId[id]) byId[id].setAttribute("aria-current", "true");
  }

  /* The band is the top third of the viewport: a heading is "current" from
     the moment it settles under the header until the next one arrives. */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) mark(entry.target.id);
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  /* The list ships open, because on desktop the disclosure control is
     hidden and the list has to be visible without it. On a phone that
     would push the policy itself a screen down, so it is closed here —
     with this file missing the worst case is a visible contents list. */
  if (toc && window.matchMedia("(width < 62rem)").matches) {
    toc.open = false;
  }

  /* On mobile the list is a <details>. Leaving it open over the section it
     just jumped to would hide the answer. */
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (toc && toc.open && window.matchMedia("(width < 62rem)").matches) {
        toc.open = false;
      }
    });
  });

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
