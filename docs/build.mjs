/* =========================================================================
   Varn documentation - static site generator
   Built by Enstacked Technologies

   Zero dependencies. Reads content/**.md + content/meta.json and writes one
   real .html file per page, plus a client-side search index.

     node docs/build.mjs           build once
     node docs/build.mjs --watch   rebuild on change

   Why a generator and not a SPA: every page is a real file, so deep links
   work on any static host AND straight off the filesystem, crawlers get real
   HTML, and there is no framework to keep up to date.
   ========================================================================= */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(ROOT, "content");

const SITE = {
  name: "Varn",
  docsName: "Varn docs",
  tagline: "Variants & Swatches for Shopify",
  /* Where the docs are published for search engines: WordPress serves them at
     enstacked.com/varn/docs/<page>/ (clean URLs). This static copy points its
     canonical there so the two never compete as duplicates. varn.enstacked.com
     is the Shopify app host and never serves these pages. */
  canonicalBase: "https://enstacked.com/varn/docs",
  /* Absolute host for files a crawler fetches on its own (the share image). */
  assetOrigin: "https://varn-landing.vercel.app",
  docsBase: "/docs",
  appListing: "https://apps.shopify.com/varn-variants-swatches",
  support: "mailto:support@enstacked.com",
};

/* ------------------------------------------------------------- pricing -- */
/* Mirrors app/data/plans.ts in the Varn app repo, which is the source of
   truth for what merchants are actually charged and what each tier unlocks.
   Change it there first, then here and on the marketing site. */
const TRIAL_DAYS = 7;

const coreRows = (products, groups, credits) => [
  products.toLowerCase() === "unlimited"
    ? "Products with variant images, unlimited"
    : `Products with variant images, up to ${products}`,
  `Product grouping, ${groups}`,
  `AI usage credits, ${credits} a month`,
];

const SHARED_FEATURES = [
  "Unlimited color swatches",
  "Unlimited auto setup from color names",
  "Multiple variant options",
  "Agent readiness for all products",
  "Swatches on collections, search and quick view",
];

/* The row Grow adds, and the two Advance and Premium add on top, declared once
   so no two cards can describe the same capability differently. Each maps to a
   real gate in the app: showOnAllProducts is Grow+, the styling effects and the
   analytics dashboard are Advance+. AI setup is NOT here, it is on every plan
   and metered by the credit allowance in coreRows. */
const BARE_ROW = "Swatches on products you have not set up yet";
const ADVANCED_ROWS = [
  "Advanced styling options",
  "Swatch and variant click analytics",
];

const PRICING = [
  {
    name: "Starter",
    price: "Free",
    per: "forever",
    note: "No time limit.",
    tagline: "Everything you need to launch swatches on your store.",
    cta: "Start free",
    trial: false,
    rows: coreRows("5", "only 1 group", "250"),
  },
  {
    name: "Grow",
    price: "$14.99",
    per: "/month",
    note: "or $129 a year, instead of $179",
    tagline: "More products and groups as your catalog grows.",
    cta: "Start with Grow",
    trial: true,
    rows: [...coreRows("150", "up to 5 groups", "1,500"), BARE_ROW],
  },
  {
    name: "Advance",
    price: "$39.99",
    per: "/month",
    note: "or $349 a year, instead of $479",
    tagline: "Adds advanced styling and swatch click analytics.",
    cta: "Start with Advance",
    trial: true,
    flag: "Most popular",
    rows: [...coreRows("1,500", "up to 15 groups", "10,000"), BARE_ROW, ...ADVANCED_ROWS],
  },
  {
    name: "Premium",
    price: "$69.99",
    per: "/month",
    note: "or $599 a year, instead of $839",
    tagline: "For large catalogs that need the highest limits.",
    cta: "Start with Premium",
    trial: true,
    rows: [...coreRows("Unlimited", "up to 50 groups", "25,000"), BARE_ROW, ...ADVANCED_ROWS],
  },
];

/* ---------------------------------------------------------------- icons -- */
/* 20x20 stroke icons, currentColor. Small, consistent set. */
const ICONS = {
  rocket:
    '<path d="M8.5 12.5 4 11l2-3.5 3 .5M7.5 11.5 9 16l3.5-2-.5-3M6.5 13.5 4.5 15.5M9.5 10.5c3-3 5.5-4.5 8-4.5 0 2.5-1.5 5-4.5 8"/>',
  book: '<path d="M4 4.5h4a2 2 0 0 1 2 2v9a1.6 1.6 0 0 0-1.6-1.6H4Zm12 0h-4a2 2 0 0 0-2 2v9a1.6 1.6 0 0 1 1.6-1.6H16Z"/>',
  swatch:
    '<circle cx="7" cy="7" r="3.2"/><circle cx="13" cy="13" r="3.2"/><path d="M13 4.2v5.6M4.2 13h5.6"/>',
  image:
    '<rect x="3.5" y="4.5" width="13" height="11" rx="2"/><circle cx="7.5" cy="8.5" r="1.2"/><path d="m4 13.5 3.5-3 3 2.5 2.5-2 3 2.5"/>',
  wand: '<path d="m4 16 8-8M13.5 3.5v3M16.5 6.5h-3M6 4.5v2M7 5.5H5M15 12v2M16 13h-2"/>',
  sliders:
    '<path d="M4 6h8M15 6h1M4 14h1M8 14h8"/><circle cx="13.5" cy="6" r="1.6"/><circle cx="6.5" cy="14" r="1.6"/>',
  chart: '<path d="M4 16V9M8 16V5M12 16v-4M16 16V8"/><path d="M3 16.5h14" opacity=".45"/>',
  robot:
    '<rect x="4" y="7" width="12" height="8" rx="2"/><path d="M10 4v3M7.5 10.5h.01M12.5 10.5h.01M8 15v1.5M12 15v1.5"/>',
  card: '<rect x="3.5" y="5" width="13" height="10" rx="2"/><path d="M3.5 8.5h13"/>',
  wrench:
    '<path d="M13.5 3.8a3.6 3.6 0 0 0-4.3 4.7L4 13.7l1.9 1.9 5.2-5.2a3.6 3.6 0 0 0 4.7-4.3l-2 2-1.9-.5-.5-1.9Z"/>',
  layers:
    '<path d="m10 3.5 6.5 3.2L10 9.9 3.5 6.7Zm6.5 6.6L10 13.3l-6.5-3.2M16.5 13.3 10 16.5l-6.5-3.2"/>',
  compass: '<circle cx="10" cy="10" r="6.5"/><path d="m12.5 7.5-1.4 3.6-3.6 1.4 1.4-3.6Z"/>',
  shield:
    '<path d="M10 3.2 15.5 5v4.6c0 3-2.2 5.5-5.5 6.7-3.3-1.2-5.5-3.7-5.5-6.7V5Z"/><path d="m7.8 9.8 1.6 1.6 3-3.2"/>',
  code: '<path d="m7 7-3 3 3 3M13 7l3 3-3 3M11.2 5.5l-2.4 9"/>',
  spark: '<path d="m10 3.5 1.7 4.3 4.3 1.7-4.3 1.7L10 15.5l-1.7-4.3L4 9.5l4.3-1.7Z"/>',
  life: '<circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="2.6"/><path d="m5.4 5.4 2.7 2.7m3.8 3.8 2.7 2.7m0-9.2-2.7 2.7m-3.8 3.8-2.7 2.7"/>',
  bolt: '<path d="M11 3.5 5.5 11H10l-1 5.5L14.5 9H10Z"/>',
  globe:
    '<circle cx="10" cy="10" r="6.5"/><path d="M3.5 10h13M10 3.5c1.9 2 2.9 4.2 2.9 6.5S11.9 14.5 10 16.5C8.1 14.5 7.1 12.3 7.1 10S8.1 5.5 10 3.5Z"/>',
  users:
    '<circle cx="8" cy="7.5" r="2.5"/><path d="M3.5 15.5a4.5 4.5 0 0 1 9 0"/><path d="M13.5 6.2a2.4 2.4 0 0 1 0 4.6M14.2 15.5a4.6 4.6 0 0 0-1.4-3.3" opacity=".55"/>',
  search: '<circle cx="9" cy="9" r="4.8"/><path d="m12.6 12.6 3.4 3.4"/>',
  check: '<path d="m4.5 10.5 3.5 3.5 7.5-8"/>',
  arrow: '<path d="M4 10h11m0 0-4-4m4 4-4 4"/>',
};

const icon = (name, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
    ICONS[name] || ICONS.book
  }</svg>`;

/* -------------------------------------------------------------- helpers -- */
const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

/** Relative path from one page id to another (ids carry no extension). */
function rel(fromId, toId) {
  const depth = fromId.split("/").length - 1;
  return (depth ? "../".repeat(depth) : "./") + toId + ".html";
}

/** Relative path from a page id to a file at the docs root. */
function asset(fromId, file) {
  const depth = fromId.split("/").length - 1;
  return (depth ? "../".repeat(depth) : "./") + file;
}

/* -------------------------------------------------- inline markdown ------ */
/* Control characters, so a parked slot can never collide with real content. */
const SLOT_A = String.fromCharCode(1);
const SLOT_B = String.fromCharCode(2);

function inline(src) {
  const slots = [];
  const hold = (html) => {
    slots.push(html);
    return SLOT_A + (slots.length - 1) + SLOT_B;
  };

  let s = src;

  // 1. inline code first, so nothing inside it is interpreted
  s = s.replace(/`([^`]+)`/g, (_, code) => hold(`<code>${esc(code)}</code>`));

  // 2. raw inline HTML passes through untouched (authored content only)
  s = s.replace(/<\/?[a-zA-Z][^<>]*>/g, (tag) => hold(tag));

  // 3. images
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, href) =>
    hold(`<img src="${esc(href)}" alt="${esc(alt)}" loading="lazy" decoding="async">`),
  );

  // 4. links: only the TAGS are parked, so the label still gets escaped and
  //    emphasised, and resolveLinks() can still rewrite the href afterwards.
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_, text, href) => hold(`<a href="${esc(href)}" data-mdlink>`) + text + hold("</a>"),
  );

  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");

  return s.replace(new RegExp(SLOT_A + "(\\d+)" + SLOT_B, "g"), (_, i) => slots[Number(i)]);
}

/** Resolve page-id hrefs to real files and flag external links. */
function resolveLinks(html, fromId, pageIds) {
  return html.replace(/<a href="([^"]*)" data-mdlink>/g, (_, rawHref) => {
    const href = rawHref.replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      return `<a class="link link--ext" href="${esc(href)}" target="_blank" rel="noopener">`;
    }
    if (href.startsWith("#")) return `<a class="link" href="${esc(href)}">`;
    const [id, hash] = href.split("#");
    if (pageIds.has(id)) {
      return `<a class="link" href="${esc(rel(fromId, id) + (hash ? "#" + hash : ""))}">`;
    }
    return `<a class="link" href="${esc(href)}">`;
  });
}

/* --------------------------------------------------- block markdown ------ */
const CALLOUTS = {
  note: { label: "Note", icon: "book" },
  tip: { label: "Tip", icon: "spark" },
  info: { label: "Good to know", icon: "compass" },
  warning: { label: "Heads up", icon: "shield" },
  danger: { label: "Careful", icon: "shield" },
  plan: { label: "Plan", icon: "card" },
};

function render(md, ctx) {
  const lines = md.split(/\r?\n/);
  const out = [];
  const toc = [];
  let i = 0;

  while (i < lines.length) {
    const t = lines[i].trim();

    if (!t) {
      i++;
      continue;
    }

    /* ---- fenced code ---- */
    if (t.startsWith("```")) {
      const lang = t.slice(3).trim() || "text";
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(
        `<figure class="code"><figcaption class="code__bar">` +
          `<span class="code__lang">${esc(lang)}</span>` +
          `<button class="code__copy" type="button" data-copy>` +
          `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">` +
          `<rect x="7" y="7" width="9" height="9" rx="2"/><path d="M13 5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13"/></svg>` +
          `<span>Copy</span></button></figcaption>` +
          `<pre><code>${esc(buf.join("\n"))}</code></pre></figure>`,
      );
      continue;
    }

    /* ---- ::: directives ---- */
    if (t.startsWith(":::")) {
      const [kind, ...rest] = t.slice(3).trim().split(/\s+/);
      const buf = [];
      i++;
      let depth = 1;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (l.startsWith(":::") && l.length > 3) depth++;
        else if (l === ":::") {
          depth--;
          if (!depth) break;
        }
        buf.push(lines[i++]);
      }
      i++;
      out.push(directive(kind, rest.join(" "), buf.join("\n"), ctx, toc));
      continue;
    }

    /* ---- headings ---- */
    const h = /^(#{1,4})\s+(.*)$/.exec(t);
    if (h) {
      const level = h[1].length;
      const id = slug(h[2]);
      if (level === 2 || level === 3) {
        toc.push({ id, text: h[2].replace(/[*`]/g, "").replace(/<[^>]+>/g, ""), level });
      }
      out.push(
        `<h${level} id="${id}" class="md-h${level}">${inline(h[2])}` +
          `<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`,
      );
      i++;
      continue;
    }

    /* ---- horizontal rule ---- */
    if (/^(-{3,}|\*{3,})$/.test(t)) {
      out.push('<hr class="md-hr">');
      i++;
      continue;
    }

    /* ---- table ---- */
    if (t.startsWith("|") && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (l) => l.trim().split("|").slice(1, -1).map((c) => c.trim());
      const head = cells(t);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        `<div class="table-wrap"><table class="md-table"><thead><tr>` +
          head.map((c) => `<th>${inline(c)}</th>`).join("") +
          `</tr></thead><tbody>` +
          rows
            .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
            .join("") +
          `</tbody></table></div>`,
      );
      continue;
    }

    /* ---- blockquote ---- */
    if (t.startsWith("> ")) {
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) buf.push(lines[i++].trim().slice(2));
      out.push(`<blockquote class="md-quote">${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    /* ---- lists ---- */
    if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
      const ordered = /^\d+\.\s+/.test(t);
      const items = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const m = ordered ? /^\d+\.\s+(.*)$/.exec(l) : /^[-*]\s+(.*)$/.exec(l);
        if (!m) break;
        let item = m[1];
        i++;
        // an indented continuation line belongs to the same item
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s/.test(lines[i])) {
          item += " " + lines[i++].trim();
        }
        items.push(item);
      }
      const tag = ordered ? "ol" : "ul";
      out.push(
        `<${tag} class="md-list">${items.map((li) => `<li>${inline(li)}</li>`).join("")}</${tag}>`,
      );
      continue;
    }

    /* ---- raw HTML block ---- */
    if (t.startsWith("<")) {
      const buf = [];
      while (i < lines.length && lines[i].trim()) buf.push(lines[i++]);
      out.push(buf.join("\n"));
      continue;
    }

    /* ---- paragraph ---- */
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|```|:::|[-*]\s|\d+\.\s|>\s|\|)/.test(lines[i].trim())
    ) {
      buf.push(lines[i++].trim());
    }
    out.push(`<p class="md-p">${inline(buf.join(" "))}</p>`);
  }

  return { html: out.join("\n"), toc };
}

function directive(kind, title, body, ctx, toc) {
  /* callouts */
  if (CALLOUTS[kind]) {
    const meta = CALLOUTS[kind];
    return (
      `<aside class="callout callout--${kind}">${icon(meta.icon, "callout__icon")}` +
      `<div class="callout__body"><p class="callout__title">${esc(title || meta.label)}</p>` +
      `${render(body, ctx).html}</div></aside>`
    );
  }

  /* card grid:  - [Title](href): {icon} description */
  if (kind === "cards") {
    const items = body
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "))
      .map((l) => {
        const m = /^-\s+\[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?$/.exec(l);
        if (!m) return "";
        const [, label, href, desc = ""] = m;
        const ic = /^\s*\{(\w+)\}/.exec(desc);
        const text = desc.replace(/^\s*\{\w+\}\s*/, "");
        return (
          `<a class="card" href="${esc(href)}" data-mdcard>` +
          `<span class="card__icon">${icon(ic ? ic[1] : "book")}</span>` +
          `<span class="card__title">${inline(label)}</span>` +
          (text ? `<span class="card__desc">${inline(text)}</span>` : "") +
          `</a>`
        );
      })
      .join("");
    return `<div class="cards">${items}</div>`;
  }

  /* numbered steps */
  if (kind === "steps") {
    const items = body
      .split(/^###\s+/m)
      .filter((p) => p.trim())
      .map((p) => {
        const nl = p.indexOf("\n");
        const head = (nl === -1 ? p : p.slice(0, nl)).trim();
        const rest = nl === -1 ? "" : p.slice(nl + 1);
        const id = slug(head);
        toc.push({ id, text: head, level: 3 });
        return (
          `<li class="step"><h3 class="step__title" id="${id}">${inline(head)}` +
          `<a class="anchor" href="#${id}" aria-label="Link to this step">#</a></h3>` +
          `<div class="step__body">${render(rest, ctx).html}</div></li>`
        );
      })
      .join("");
    return `<ol class="steps">${items}</ol>`;
  }

  /* accordion / FAQ */
  if (kind === "faq" || kind === "accordion") {
    const items = body
      .split(/^###\s+/m)
      .filter((p) => p.trim())
      .map((p) => {
        const nl = p.indexOf("\n");
        const head = (nl === -1 ? p : p.slice(0, nl)).trim();
        const rest = nl === -1 ? "" : p.slice(nl + 1);
        return (
          `<details class="accordion"><summary class="accordion__head"><span>${inline(head)}</span>` +
          `<svg class="accordion__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6.5 8.5 3.5 3.5 3.5-3.5"/></svg>` +
          `</summary><div class="accordion__body">${render(rest, ctx).html}</div></details>`
        );
      })
      .join("");
    return `<div class="accordions">${items}</div>`;
  }

  /* side-by-side columns, split on a --- line */
  if (kind === "columns") {
    return `<div class="columns">${body
      .split(/^---$/m)
      .map((c) => `<div class="col">${render(c, ctx).html}</div>`)
      .join("")}</div>`;
  }

  /* pricing cards:  ::: pricing
     The same four-plan 2x2 grid the marketing site shows. Both cycles are
     printed on the card rather than behind a toggle: the docs are reference
     material, so seeing the yearly figure without interacting is the point,
     and it keeps this page working with JavaScript disabled. */
  if (kind === "pricing") {
    const cards = PRICING.map((plan) => {
      const rows = plan.rows
        .map(
          (r) =>
            `<li class="pcard__row">${icon("check", "pcard__tick")}<span>${inline(r)}</span></li>`,
        )
        .join("");
      const flag = plan.flag
        ? `<span class="pcard__flag">${icon("spark", "pcard__flag-icon")}${esc(plan.flag)}</span>`
        : "";
      const trial = plan.trial
        ? `<span class="pcard__trial">Free for ${TRIAL_DAYS} days</span>`
        : "";
      return (
        `<article class="pcard${plan.flag ? " pcard--featured" : ""}">` +
        `<div class="pcard__head"><h3 class="pcard__name">${esc(plan.name)}</h3>${flag}</div>` +
        `<p class="pcard__price"><span class="pcard__amount">${esc(plan.price)}</span>` +
        `<span class="pcard__per">${esc(plan.per)}</span></p>` +
        `<p class="pcard__note">${esc(plan.note)}</p>` +
        `<p class="pcard__tagline">${esc(plan.tagline)}</p>` +
        `<p class="pcard__cta"><a class="btn ${plan.flag ? "btn--primary" : "btn--secondary"}" ` +
        `href="${SITE.appListing}" target="_blank" rel="noopener">${esc(plan.cta)}</a>${trial}</p>` +
        `<ul class="pcard__rows">${rows}</ul>` +
        `</article>`
      );
    }).join("");
    const shared = SHARED_FEATURES.map(
      (r) =>
        `<li class="pcard__row">${icon("check", "pcard__tick")}<span>${inline(r)}</span></li>`,
    ).join("");
    return (
      `<div class="pricing">${cards}</div>` +
      `<div class="pricing-includes">` +
      `<p class="pricing-includes__title">Every plan includes</p>` +
      `<ul class="pricing-includes__list">${shared}</ul>` +
      `</div>`
    );
  }

  /* plan availability strip:  ::: plans free grow advance premium */
  if (kind === "plans") {
    const PLAN_PILL_LABEL = { free: "Starter", grow: "Grow", advance: "Advance", premium: "Premium" };
    const on = new Set(title.toLowerCase().split(/[\s,]+/).filter(Boolean));
    const row = ["free", "grow", "advance", "premium"]
      .map(
        (p) =>
          `<span class="planpill planpill--${p} ${on.has(p) ? "is-on" : "is-off"}">` +
          `${on.has(p) ? icon("check", "planpill__tick") : ""}` +
          `${PLAN_PILL_LABEL[p]}</span>`,
      )
      .join("");
    return `<div class="planrow"><span class="planrow__label">Included on</span>${row}</div>`;
  }

  return `<div class="md-raw">${render(body, ctx).html}</div>`;
}

/* ---------------------------------------------------------- front matter - */
function parseFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line.trim());
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(m[0].length) };
}

/* ----------------------------------------------------------------- shell - */
/* "index" is the docs home (/varn/docs/), every other page is a clean directory URL. */
function canonicalFor(id) {
  return id === "index" ? `${SITE.canonicalBase}/` : `${SITE.canonicalBase}/${id}/`;
}

function shell({ page, nav, contentHtml, toc, prev, next, breadcrumb }) {
  const id = page.id;
  const a = (f) => asset(id, f);
  const depth = id.split("/").length - 1;
  const toRoot = depth ? "../".repeat(depth) : "./";
  const site = toRoot + "../";
  const canonical = canonicalFor(id);

  /* Every URL in this page is relative to the page's own directory. That holds
     for every page except this one: index.html is also reachable as the bare
     directory URL "/docs", and a host that serves it there without redirecting
     to "/docs/" makes the browser resolve "./assets/docs.css" against "/" - so
     the stylesheet 404s and the page renders as raw text. Pin the base to the
     real directory before anything relative is parsed. The last path segment
     tells us which case we are in, so a clean-URL host serving "/docs/index"
     (already correct) is left alone. */
  const baseGuard =
    id === "index"
      ? '<script>(function(){var p=location.pathname,s=p.split("/"),n=s[s.length-1];' +
        'if(n!=="index"&&n!=="index.html"){var b=document.createElement("base");' +
        'b.href=p+(p.slice(-1)==="/"?"":"/");' +
        'document.head.insertBefore(b,document.head.firstChild);}})();</script>\n'
      : "";

  const navHtml = nav
    .map((group) => {
      const open = group.pages.some((p) => p.id === id);
      const items = group.pages
        .map((p) => {
          const active = p.id === id;
          return (
            `<li><a class="sb__link${active ? " is-active" : ""}" href="${rel(id, p.id)}"` +
            `${active ? ' aria-current="page"' : ""}>` +
            `<span>${esc(p.title)}</span>` +
            (p.badge
              ? `<span class="sb__badge sb__badge--${p.badge.toLowerCase()}">${esc(p.badge)}</span>`
              : "") +
            `</a></li>`
          );
        })
        .join("");
      return (
        `<div class="sb__group${open ? " is-open" : ""}" data-group>` +
        `<button class="sb__grouphead" type="button" aria-expanded="${open}">` +
        `<span class="sb__groupicon">${icon(group.icon)}</span>` +
        `<span class="sb__grouptitle">${esc(group.title)}</span>` +
        `<svg class="sb__chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6.5 8.5 3.5 3.5 3.5-3.5"/></svg>` +
        `</button><ul class="sb__list">${items}</ul></div>`
      );
    })
    .join("");

  /* data-depth drives the SVG rail: it is what tells the client script how far
     to jog the path in for a nested heading. */
  const tocHtml = toc
    .map(
      (h) =>
        `<li class="toc__item toc__item--h${h.level}" data-depth="${h.level - 2}">` +
        `<a class="toc__link" href="#${h.id}">${esc(h.text)}</a></li>`,
    )
    .join("");

  const pagerCard = (p, dir) =>
    p
      ? `<a class="pager__card pager__card--${dir}" href="${rel(id, p.id)}">` +
        `<span class="pager__dir">${dir === "prev" ? "Previous" : "Next"}</span>` +
        `<span class="pager__title">${esc(p.title)}</span></a>`
      : `<span class="pager__spacer"></span>`;

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${baseGuard}<title>${esc(page.title)} | ${SITE.docsName}</title>
<meta name="description" content="${esc(page.description || SITE.tagline)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${SITE.docsName}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description || SITE.tagline)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.assetOrigin}/assets/img/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${site}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${site}assets/fonts/inter-tight-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${a("assets/docs.css")}">
<script>
/* Resolve the theme before first paint so the page never flashes the wrong one. */
(function(){try{var t=localStorage.getItem("varn-docs-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){}})();
</script>
</head>
<body>
<a class="skip" href="#content">Skip to content</a>

<div class="progress" data-progress aria-hidden="true"><span class="progress__bar" data-progress-bar></span></div>

<header class="top">
  <div class="top__inner">
    <button class="top__burger" type="button" data-menu aria-label="Open navigation" aria-expanded="false">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M3.5 6h13M3.5 10h13M3.5 14h13"/></svg>
    </button>

    <a class="top__brand" href="${a("index.html")}">
      <img class="top__mark" src="${site}assets/img/varn-mark.svg" width="26" height="26" alt="">
      <span class="top__name">Varn</span>
      <span class="top__docs">Docs</span>
    </a>

    <button class="searchbtn" type="button" data-search-open>
      ${icon("search", "searchbtn__icon")}
      <span class="searchbtn__label">Search documentation</span>
      <kbd class="searchbtn__kbd">Ctrl K</kbd>
    </button>

    <nav class="top__links" aria-label="Site">
      <a class="top__link" href="${site}index.html">Website</a>
      <a class="top__link" href="${site}index.html#pricing">Pricing</a>
      <a class="top__link" href="${SITE.support}">Support</a>
    </nav>

    <button class="themebtn" type="button" data-theme-toggle aria-label="Switch between light and dark">
      <svg class="themebtn__sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="3.4"/><path d="M10 2.6v2M10 15.4v2M2.6 10h2M15.4 10h2M4.8 4.8l1.4 1.4M13.8 13.8l1.4 1.4M15.2 4.8l-1.4 1.4M6.2 13.8l-1.4 1.4"/></svg>
      <svg class="themebtn__moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M16 11.7A6.5 6.5 0 0 1 8.3 4a6.5 6.5 0 1 0 7.7 7.7Z"/></svg>
    </button>

    <a class="top__cta" href="${SITE.appListing}" target="_blank" rel="noopener">Add Varn free</a>
  </div>
</header>

<div class="layout">
  <aside class="sb" data-sidebar data-lenis-prevent>
    <div class="sb__inner" data-lenis-prevent>
      <nav class="sb__nav" aria-label="Documentation">${navHtml}</nav>
      <div class="sb__foot">
        <a class="sb__footlink" href="${SITE.support}">${icon("life")}<span>Email support</span></a>
      </div>
    </div>
  </aside>
  <div class="sb__scrim" data-scrim hidden></div>

  <main class="doc" id="content">
    <article class="doc__body">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${a("index.html")}">Docs</a>
        ${breadcrumb ? `<span class="crumbs__sep" aria-hidden="true">/</span><span>${esc(breadcrumb)}</span>` : ""}
        <span class="crumbs__sep" aria-hidden="true">/</span>
        <span class="crumbs__now">${esc(page.title)}</span>
      </nav>

      <h1 class="doc__title">${esc(page.title)}</h1>
      ${page.description ? `<p class="doc__lead">${esc(page.description)}</p>` : ""}

      <div class="prose">
${contentHtml}
      </div>

      <nav class="pager" aria-label="Pagination">${pagerCard(prev, "prev")}${pagerCard(next, "next")}</nav>

      <footer class="doc__foot">
        <p>Still stuck? <a class="link" href="${SITE.support}">Email support@enstacked.com</a> with your store URL and theme name and we will take a look.</p>
      </footer>
    </article>

    <aside class="toc" aria-label="On this page" data-lenis-prevent>
      <div class="toc__inner">
        <p class="toc__head">
          <svg class="toc__headicon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 5.5h12M4 10h9M4 14.5h6"/></svg>
          On this page
        </p>
        <div class="toc__rail" data-toc-rail>
          <svg class="toc__svg" data-toc-svg aria-hidden="true" focusable="false" preserveAspectRatio="none">
            <path class="toc__track" data-toc-track fill="none" />
            <path class="toc__thumb" data-toc-thumb fill="none" />
            <circle class="toc__dot" data-toc-dot r="2.75" cx="-10" cy="-10" />
          </svg>
          <ul class="toc__list">${tocHtml}</ul>
        </div>
        <a class="toc__top" href="#content">${icon("arrow", "toc__topicon")}<span>Back to top</span></a>
      </div>
    </aside>
  </main>
</div>

<div class="searchdlg" data-search-dialog hidden>
  <div class="searchdlg__scrim" data-search-close></div>
  <div class="searchdlg__panel" role="dialog" aria-modal="true" aria-label="Search documentation">
    <div class="searchdlg__bar">
      ${icon("search", "searchdlg__icon")}
      <input class="searchdlg__input" type="search" placeholder="Search the documentation" autocomplete="off" spellcheck="false" data-search-input aria-label="Search the documentation">
      <kbd class="searchdlg__esc">Esc</kbd>
    </div>
    <ul class="searchdlg__results" data-search-results data-lenis-prevent></ul>
    <p class="searchdlg__empty" data-search-empty hidden>No matches. Try a page name, a feature, or a plan.</p>
    <p class="searchdlg__hint"><kbd>&uarr;</kbd><kbd>&darr;</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close</p>
  </div>
</div>

<script>window.VARN_DOCS_PAGE=${JSON.stringify(id)};window.VARN_DOCS_ROOT=${JSON.stringify(toRoot)};</script>
<script src="${a("assets/search-index.js")}" defer></script>
<script src="${a("assets/vendor/gsap.min.js")}" defer></script>
<script src="${a("assets/vendor/ScrollTrigger.min.js")}" defer></script>
<script src="${a("assets/vendor/lenis.min.js")}" defer></script>
<script src="${a("assets/docs.js")}" defer></script>
<script src="${a("assets/motion.js")}" defer></script>
</body>
</html>
`;
}

/* -------------------------------------------------------------------- run */
async function collectMd(dir, base = "") {
  const found = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) found.push(...(await collectMd(p, base + e.name + "/")));
    else if (e.name.endsWith(".md")) found.push(base + e.name.slice(0, -3));
  }
  return found;
}

async function build() {
  const meta = JSON.parse(await readFile(path.join(CONTENT, "meta.json"), "utf8"));
  const ids = await collectMd(CONTENT);
  const pageIds = new Set(ids);

  const pages = new Map();
  for (const id of ids) {
    const raw = await readFile(path.join(CONTENT, id + ".md"), "utf8");
    const { data, body } = parseFrontMatter(raw);
    pages.set(id, {
      id,
      title: data.title || id,
      description: data.description || "",
      badge: data.badge || "",
      body,
    });
  }

  const gaps = [];
  const nav = meta.groups.map((g) => ({
    title: g.title,
    icon: g.icon,
    pages: g.pages
      .map((pid) => {
        const p = pages.get(pid);
        if (!p) {
          gaps.push(pid);
          return null;
        }
        return { id: pid, title: p.title, badge: p.badge };
      })
      .filter(Boolean),
  }));
  if (gaps.length) console.warn("  ! listed in meta.json but not written yet:", gaps.join(", "));
  const flat = nav.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.title })));

  const orphans = ids.filter((id) => !flat.some((p) => p.id === id));
  if (orphans.length) console.warn("  ! not listed in meta.json:", orphans.join(", "));

  const index = [];

  for (const [id, page] of pages) {
    const { html, toc } = render(page.body, { id });
    const contentHtml = resolveLinks(html, id, pageIds).replace(
      /<a class="card" href="([^"]*)" data-mdcard>/g,
      (_, href) =>
        /^(https?:|mailto:)/.test(href)
          ? `<a class="card" href="${esc(href)}" target="_blank" rel="noopener">`
          : `<a class="card" href="${esc(pageIds.has(href) ? rel(id, href) : href)}">`,
    );

    const pos = flat.findIndex((p) => p.id === id);
    const outFile = path.join(ROOT, id + ".html");
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(
      outFile,
      shell({
        page,
        nav,
        contentHtml,
        toc,
        prev: pos > 0 ? flat[pos - 1] : null,
        next: pos >= 0 && pos < flat.length - 1 ? flat[pos + 1] : null,
        breadcrumb: pos >= 0 ? flat[pos].group : "",
      }),
      "utf8",
    );

    const text = contentHtml
      .replace(/<figure class="code">[\s\S]*?<\/figure>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    index.push({
      id,
      t: page.title,
      d: page.description,
      g: pos >= 0 ? flat[pos].group : "",
      b: text.slice(0, 1500),
      h: toc.filter((x) => x.level === 2).slice(0, 12).map((x) => ({ t: x.text, a: x.id })),
    });
  }

  await writeFile(
    path.join(ROOT, "assets", "search-index.js"),
    "window.VARN_DOCS_INDEX=" + JSON.stringify(index) + ";\n",
    "utf8",
  );

  await writeFile(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      flat
        .map(
          (p) =>
            `  <url><loc>${canonicalFor(p.id)}</loc><changefreq>monthly</changefreq></url>`,
        )
        .join("\n") +
      `\n</urlset>\n`,
    "utf8",
  );

  console.log(`  Varn docs built: ${pages.size} pages across ${nav.length} sections.`);
}

await build();

if (process.argv.includes("--watch")) {
  console.log("  watching content/ and assets/ ...");
  let t;
  const rerun = () => {
    clearTimeout(t);
    t = setTimeout(() => build().catch((e) => console.error("  build failed:", e.message)), 120);
  };
  watch(CONTENT, { recursive: true }, rerun);
  watch(path.join(ROOT, "assets"), { recursive: true }, rerun);
}
