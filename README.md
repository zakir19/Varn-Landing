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
index.html                     the landing page, semantic HTML only
waitlist.html                  pre-launch signup page, where every CTA goes
privacy.html                   privacy policy
status.html                    live system status, fed by the dashboard API
assets/
  css/styles.css               design tokens + components, cascade layers
  js/main.js                   one IIFE, ten independent modules
  js/waitlist.js               waitlist.html: brand field + signup form
  js/legal.js                  privacy.html: contents list highlighting
  js/status.js                 status.html + the strip on index.html
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
| **Launch switch** (every CTA, all pages) | `LAUNCH_URL` at the top of `assets/js/main.js` |
| **Waitlist signup endpoint** | `WAITLIST_ENDPOINT` at the top of `assets/js/waitlist.js` |
| **Status API** | `STATUS_ENDPOINT` at the top of `assets/js/status.js` |
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

## Pre-launch state

The site currently sells a waitlist, not an install.

- Every call to action on every page links to `waitlist.html` **in the markup**,
  so it is correct with JavaScript disabled and correct if `main.js` never
  loads. Each one also carries `data-launch` and a `data-launch-label` holding
  the wording it should show on launch day.
- `waitlist.html` collects the email and **sends it to MailerLite**. The two
  ids at the top of `assets/js/waitlist.js` are the only part of MailerLite's
  generated embed we kept — the markup, styling and states are ours, so the
  page reads as Varn rather than as a MailerLite widget:

  ```js
  var MAILERLITE = { account: "2519972", form: "197865579280861031" };
  ```

  **How the submit works, and why it is not `fetch()`.** MailerLite's classic
  endpoint sends no CORS headers, so the browser refuses to hand us the
  response and the promise rejects — every signup looks like a failure even
  when MailerLite stored it. That is exactly why their own embed uses a plain
  form with `target="_blank"`. JSONP is no better: a `<script>` tag can only
  issue a GET, and this is a POST endpoint.

  So we send the form MailerLite already expects — same action, same method,
  same field names — and point its `target` at a hidden iframe instead of a
  new tab. A form POST is never subject to CORS, so there is no protocol left
  to guess at.

  **What that can and cannot know.** The iframe is cross-origin, so its body
  is unreadable: a load event means MailerLite answered, so success means
  "sent and answered", not "definitely stored". One case is worth the extra
  request to get right — a signup killed by an ad or tracker blocker *also*
  fires that load event, and MailerLite is on most blocklists, so it would
  otherwise show "You're on the list" and be lost in silence. A `no-cors`
  reachability probe runs first and, when the host is unreachable, says so in
  words the visitor can act on instead of a useless "try again".

  **Without JavaScript it still works.** The `action`, `method="post"`,
  `target="_blank"`, `name="fields[email]"` and MailerLite's two hidden
  fields are all in the markup, so the form posts straight to MailerLite and
  the visitor lands on MailerLite's own confirmation page.

  `WAITLIST_ENDPOINT` in the same file overrides MailerLite with any endpoint
  that accepts a JSON POST (`{ email, source, ts }`) — the seam to use if the
  list moves or signups should hit your own server first. With both blank the
  page runs in **demo mode**: the flow plays, nothing is stored, and the
  console says so on every submit.
- The form covers empty, invalid, submitting, success, network failure and
  returning-visitor. A honeypot field catches bots and answers them exactly as
  if they had succeeded.

**On launch day:** paste the App Store listing URL into `LAUNCH_URL` at the top
of `assets/js/main.js`. That one edit repoints every `[data-launch]` link,
restores each link's own launch-day wording, and removes the "Launching soon"
prefix in the hero. Nothing else changes. Note that `privacy.html` deliberately
has no launch-dependent call to action, so it needs no edit and does not load
`main.js`.

---

## System status

`status.html` is the full board and `index.html` carries a one-line strip
above the closing call to action. Both read the same endpoint through
`assets/js/status.js`, and both ship in a resting state that never shifts the
page while the fetch is in flight.

**It is wired.** `STATUS_ENDPOINT` points at
`https://varn.enstacked.com/api/status`, which is
`app/routes/api.status.tsx` in the Varn app repo. That route answers `GET`
with open CORS and a 15-second shared cache, so this site can be served from
any host. Set the constant back to `""` to return both surfaces to labelled
preview data.

**Deploy order matters:** the app route has to be live before this site is,
or the status page shows its "cannot reach the status API" state.

The full shape is documented in a comment at the top of `assets/js/status.js`
and in `app/lib/status.server.ts`; in outline:

```jsonc
{
  "page":    { "name": "Varn Status", "updatedAt": "<ISO>" },
  "status":  "operational | degraded | partial | major | maintenance",
  "uptime":  99.98,
  "services": [{ "id", "name", "description",
                 "group": "product | platform | account",
                 "status", "uptime",
                 "days": [{ "date": "YYYY-MM-DD", "status", "incidentIds": [] }] }],
  "incidents": [{ "id", "title", "severity", "state", "impact", "components",
                  "startedAt", "resolvedAt", "summary",
                  "updates": [{ "at", "state", "body" }] }],
  "maintenance": [{ "id", "title", "startsAt", "duration", "componentIds", "impact" }]
}
```

`days` is what draws the uptime bars, and the page trims it to the requested
range so the bars can never disagree with the sentence above them.

**The live app API reports this minute's checks and currently omits `days`.**
This site still draws the 30/60/90 bars itself: a day is operational unless
an incident on that payload (or a GitHub issue labelled `incident`, when the
browser can read `enstacked/varn`) overlaps it. That is "nothing was
reported", not a guessed probe. The round-trip time of each live check is
shown next to uptime where the API measured one.

**What the route actually measures:** the database round trip, whether the
analytics store is readable, the recent AI failure share across catalogue
runs, and photo-run workers whose heartbeat has gone stale. It deliberately
reports nothing about Shopify's admin API, Shopify billing or the theme
extension CDN — those are Shopify's to report, and a green tick we cannot
justify is worse than an absent one. Nothing per-shop leaves the endpoint.

**Incidents come from GitHub Issues when this page can read them**, and
otherwise from the `incidents` array on `/api/status`. An issue is the
incident, closing it resolves it, and each card links back to GitHub.

The label convention (only the first is required):

| Label | Effect |
| --- | --- |
| `incident` | The opt-in. No label, not published. |
| `maintenance` | Scheduled work; needs `Starts:` in the body. |
| `severity:minor\|major\|critical` | The badge. Default `minor`. |
| `impact:degraded\|partial\|major\|maintenance` | How bad it was. Default `degraded`. |
| `status:investigating\|identified\|monitoring` | Ignored once the issue is closed. |
| `component:<service id>` | Repeatable. Ids from `SERVICE_META`. |

A comment starting with a bold state — `**Identified** the slow query is …` —
becomes a timeline entry with that state. A comment without one is still
published and inherits the incident's state.

Configure it with `STATUS_GITHUB_REPO`, `STATUS_GITHUB_LABEL` and an optional
`GITHUB_TOKEN` (see the app's `.env.example`).

> **Use a dedicated public status repo.** Every issue carrying the label has
> its title, body and comments rendered on a public page. Pointing this at the
> private app repo means one stray internal comment on a labelled issue is
> published.

`app/data/status-incidents.ts` remains the break-glass path: it still works
when GitHub is the thing that is down, and its entries are merged in alongside
whatever GitHub returns (a GitHub issue wins a clash of ids). `incidents` and
`maintenance` may be empty arrays; the page renders an empty state rather than
hiding the section.

**Until it is set,** both surfaces run on clearly labelled **preview data**
and the page says so in those words. That banner is deliberate: a status page
that invents uptime is worse than no status page, so preview mode is never
silent.

**States it covers:** loading skeleton, live, preview, an open incident
(repeated above the component grid, because a reader arriving mid-incident
should not scroll past nine healthy services), scheduled maintenance, a
selected day filtering the history, the endpoint failing on first load, and
the endpoint failing later — which keeps the last good reading on screen and
says when it was taken. It re-checks about once a minute while the tab is
visible.

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
