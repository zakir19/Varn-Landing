# Varn — Variants & Swatches · Landing page

Marketing site for the Shopify app **Varn - Variants & Swatches**, built by
**Enstacked Technologies**.

Static, zero build step, zero dependencies.
Drop the folder on any host and it runs.

The only third-party request is the Instrument Sans stylesheet from Google
Fonts. See [Typography](#typography) if you want to bring that back in-house.

---

## Quick start

```bash
# any static server works
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

**Deploy:** drag this folder into Netlify / Vercel / Cloudflare Pages, or push it
to any static host or S3 bucket. There is nothing to compile.

---

## Structure

```
index.html                     the whole page, semantic HTML only
assets/
  css/styles.css               design tokens + components, cascade layers
  js/main.js                   one IIFE, ten independent modules
  fonts/                       legacy woff2 files, no longer referenced by
                               index.html (docs/ still uses Inter Tight)
  img/
    enstacked-logo.svg         vector trace of the supplied Enstacked logo (with ®)
    enstacked-mark.svg         same mark, no ®, for small lockups
    varn-mark.svg              the official Varn app icon, vector-traced from
                               the supplied brand lockup (ink #26242E square,
                               violet / blush / clay / cream V)
    favicon.svg                same icon
    og-cover.jpg               1200×630 social share card
README.md
```

### Why three files instead of one

Structure, presentation and behaviour stay in separate files so the page can be
reviewed, maintained, and later converted to Shopify Liquid without a rewrite.
It is still zero-build and deploys exactly the same way as a single file would.

---

## Measured results

Taken in headless Chromium at 1440×900 on a local server.

> **Stale rows:** LCP, FCP and CLS were measured while the font was
> self-hosted. Moving to Google Fonts adds a render-blocking stylesheet on
> another origin, so re-measure before quoting them. Everything else in the
> table was re-verified after the switch: overflow was re-checked at 375 / 768
> / 1440 and is still zero, and the console is still clean.

| Metric | Result | Target |
|---|---|---|
| LCP | **324 ms** | < 2500 ms |
| FCP | **324 ms** | — |
| CLS | **0.029** | < 0.1 |
| DOM interactive | **34 ms** | — |
| DOM nodes | ~1020, max depth 12 | shallow |
| Total transfer | **~62 KB** gzipped (29 KB of that is the font) | — |
| Third-party requests | **1** stylesheet + 1 font file (Google Fonts) | — |
| Console errors | **0** | 0 |
| Horizontal overflow | none at 390 / 768 / 1440 | none |
| Colour contrast | all pairs pass WCAG AA (re-verified after the ink retune) | ≥ 4.5:1 |
| Keyboard | 32 tab stops, all named, all with a focus ring | — |

Gzipped payload: `index.html` ~15 KB · `styles.css` ~10 KB · `main.js` ~7 KB ·
font 29 KB.

Neither file in `assets/fonts/` is referenced by `index.html` any more.
`inter-tight-*.woff2` is still used by every page under `docs/`, so keep it
until the docs are switched too. `instrument-serif-*.woff2` was already unused
and can be deleted freely.

<a id="typography"></a>

## Typography

One family, **Instrument Sans**, variable weight 400–700, loaded from Google
Fonts by the `<link>` in the `<head>` of `index.html`.

**There are no italics on this page, by design.** Only the roman axis is
requested (`wght@400..700`, no `ital`), so the italic file is never downloaded.
Two rules in `styles.css` keep it that way:

- `font-synthesis: weight` on `body` — inherited by everything, it permits
  synthetic bold but forbids the browser from *slanting* the roman to fake an
  italic it does not have.
- a reset rule forcing `font-style: normal` on `i`, `em`, `cite`, `var`, `dfn`,
  `address`, `blockquote` and `figcaption`, the elements browsers italicise by
  default. `em` and `i` get `font-weight: 600` instead, so emphasis still reads.

If you add copy, express emphasis with weight or colour, never with italics.

### Bringing the font back in-house

The site self-hosted its font until this change, which is why the `<head>`
still has zero other external references. To return to zero third-party
requests, download the latin subset (30 KB) once:

```bash
curl -o assets/fonts/instrument-sans-latin-wght-normal.woff2 \
  "https://fonts.gstatic.com/s/instrumentsans/v4/pxiTypc9vsFDm051Uf6KVwgkfoSxQ0GsQv8ToedPibnr0SZe1Q.woff2"
```

Then swap the three Google `<link>` tags in `index.html` for a `preload` of
that file, and put the `@font-face` back at the top of `styles.css` with
`font-weight: 400 700`, `font-style: normal` and `font-display: swap`. Nothing
else has to change — the family is referenced through the `--font-sans` token
in exactly one place.

---

## Page sections

1. **Hero** — headline + a *live, working swatch picker*, not a video. Clicking a
   chip recolours the product, syncs the native `<select>`, filters the gallery,
   and shows the low-stock and sold-out states.
2. **Before / After toggle** — flips the picker between a plain dropdown and Varn
   chips. It plays itself once when the demo first scrolls into view.
3. **Theme compatibility marquee** — the Shopify-specific trust band.
4. **How it works** — the real five-step wizard, with a pinned admin mock that
   advances as you scroll. Step 4 animates the AI setup colour matching.
5. **Feature bento** — six capabilities, each tagged with the plan it starts on
   (Free / Free to start / Advance).
6. **Style studio** — an interactive playground mirroring the app's own style
   page (shape, size, spacing, border, labels, text pills).
7. **Where swatches show up** — collection, search, quick view, everywhere else.
8. **AI setup** — with a push-button demo that also shows the value it
   deliberately *doesn't* guess.
9. **Proof pillars** — the four objections every Shopify merchant has.
10. **Agent readiness** — the differentiator no competitor has.
11. **Pricing** — Free / Grow / Advance / Premium with a monthly–yearly switch,
    mirroring `app/data/plans.ts` in the app repo (the single source of truth).
12. **Enstacked Technologies** — dedicated maker section with the logo.
13. **FAQ** — native `<details>`, works with JavaScript disabled.
14. **Closing CTA + footer + mobile sticky bar.**

---

## Things you will want to edit

| What | Where |
|---|---|
| App Store URL (used by every CTA) | search `apps.shopify.com/varn-variants-swatches-ai` in `index.html` |
| Canonical + `og:url` | `<head>` of `index.html` |
| Prices and plan features | the `pricing` section in `index.html` |
| Theme / app names in the marquee | `THEME_ITEMS` in `assets/js/main.js` |
| Demo colours, stock states, gallery sets | `DEMO_COLOURS` in `assets/js/main.js` |
| AI setup demo outcome | `AI_SETUP_MATCHES` in `assets/js/main.js` |
| Brand palette, type scale, spacing | the `:root` token block in `assets/css/styles.css` |

The four brand colours live in one place:

```css
--color-violet: #7f77dd;
--color-blush:  #ed93b1;
--color-clay:   #d85a30;
--color-cream:  #f5f1e8;
--color-ink:    #26242e;   /* sampled from the official Varn icon */
```

The site is a clean white SaaS theme. The dark "ink" used for text, buttons
and the dark sections is the exact background colour of the Varn app icon, so
the site and the App Store listing read as one brand. Headline accent words use
`--grad-accent`, a violet-to-blush-to-clay gradient whose stops are tuned to
stay >= 3:1 on both white and ink backgrounds (WCAG AA for large text).

Darkened variants (`--color-violet-deep`, etc.) exist purely so text on cream
passes WCAG AA. If you change a brand colour, re-derive its `-deep` companion.

---

## Copy accuracy

Every product claim on the page was checked against the Varn codebase
(re-verified 2026-08-19 for the four-tier pricing restructure):

- **Three storefront chunks** (core / cards / media), each under the 9.5 KB
  gzipped budget enforced by `test/storefront-build.test.ts`. The page claims
  "split by feature with a size budget", never an exact byte count, so this
  cannot rot.
- **18 storefront locales**, **10+ colour-dictionary languages**.
- **Free $0 / Grow $14.99 ($129 yr) / Advance $39.99 ($339 yr) / Premium
  $69.99 ($599 yr)**. The yearly view crosses out what twelve monthly payments
  would cost (**$179 / $479 / $839**, floored to whole dollars exactly as
  `priceStrikeFor()` in `app/data/plans.ts` does), and states no percentage
  anywhere — the saving is no longer a single figure across the three plans.
- **Every paid plan free for 7 days** (`TRIAL_DAYS`), Shopify's own
  subscription trial. The old 14-day card-free reverse trial is gone — never
  re-add "no card" wording.
- Limits: variant-image setup **5 / 150 / 1,500 / unlimited products**
  (`MEDIA_PRODUCT_LIMIT`), grouping **1 / 5 / 15 / 50 groups** (`GROUP_LIMIT`),
  AI usage credits **250 / 1,500 / 15,000 / 50,000 a month** (`AI_PHOTO_LIMIT`).
  One credit is one photo the vision model looks at.
- Free now includes collection / search / quick-view swatches, the whole
  agent-readiness suite with its one-click fixes, and **AI setup in full** —
  names and photos alike, on every plan, metered only by the AI credit
  allowance. "Swatches on products you have not set up yet" starts at Grow;
  analytics and advanced styling start at Advance.
- The AI photo pass **does call an outside service** (a vision model), so the
  page must never claim "no credits and no third-party service" again. It sends
  the photo's public CDN URL, the option value names and the product title, and
  nothing else. `privacy.html` says the same thing.
- **85/100 agent score** — 30 + 25 + 15 + 15 + 0, matching the real scorer's
  weights (category 30, colour 25, size 15, gender 15, alt text 15).

Deliberately **not** claimed anywhere, because they are not true yet:

- No "Built for Shopify" badge (engineered against the requirements, not awarded).
- No merchant counts, star ratings, testimonials or install numbers.
- No Core Web Vitals *pass* claim for the app itself — that needs 28 days of real
  p75 field data after the production deploy.
- No "works with every theme" — the page says any Online Store 2.0 theme, and
  names Dawn and Horizon, which have specific handling in the code.

Keep it that way. Fabricated social proof is the fastest way to lose a merchant,
and invented statistics are an App Store listing rejection.

---

## Accessibility and motion

- One `<h1>`, no heading-level jumps, every image has `alt` and explicit
  dimensions.
- The hero swatch picker is a real `role="radiogroup"` with `aria-checked`,
  `aria-disabled`, arrow-key roving focus, and state in the accessible name
  ("Terracotta, only 2 left"), never colour alone.
- A sold-out swatch announces itself and refuses to select — the same rule the
  storefront engine follows.
- Every interactive target is at least 44 px.
- `prefers-reduced-motion: reduce` disables the marquee, the count-ups, the
  scroll reveals and the magnetic buttons, and lands every element on its final
  state. Verified.
- Scroll reveals use `animation-timeline: view()` behind `@supports`, with the
  default state **visible** — a browser without scroll timelines shows
  everything, it never gets a blank section.

---

## Later: converting to Shopify Liquid

The markup is already shaped for it.

| Landing page | Theme primitive |
|---|---|
| each `<section class="section">` | a **section** |
| `.tile`, `.plan`, `.pillar`, `.step`, `.faq__item`, `.marquee__item` | **blocks** (repeatable) |
| `.btn`, `.swatch`, `.product-card`, `.brand` | **snippets** |
| the `:root` token block | **theme settings** (colours, radii, spacing) |
| `DEMO_COLOURS`, `THEME_ITEMS`, `AI_MATCHES` | block settings / metafields |

Colours are passed through `data-chip` / `data-fill` attributes rather than
inline styles precisely so a Liquid loop can emit them from a setting.

---

Built by **Enstacked Technologies** — support@enstacked.com
