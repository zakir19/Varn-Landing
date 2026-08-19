# Varn documentation

The documentation site for **Varn - Variants & Swatches**, served at `/docs`.

Static HTML with no build dependencies and no framework. Content is Markdown,
a small generator turns it into one real `.html` file per page, and the design
uses the same brand tokens as the marketing site in `../assets/css/styles.css`.

## Layout

```text
docs/
  build.mjs               the generator (zero dependencies, Node 18+)
  content/
    meta.json             the navigation tree, and the page order
    index.md              docs home
    <section>/<page>.md   one file per page
  assets/
    docs.css              theme, layout and components
    docs.js               sidebar, search, theme toggle, copy buttons
    motion.js             smooth scroll, the TOC rail, progress, reveals
    vendor/               GSAP + ScrollTrigger + Lenis, self-hosted
    search-index.js       GENERATED, do not edit
  <section>/<page>.html   GENERATED, do not edit
  sitemap.xml             GENERATED
```

## Build

```bash
node docs/build.mjs
```

While writing:

```bash
node docs/build.mjs --watch
```

Preview it over HTTP rather than `file://` so the fonts and search behave
exactly as they will in production. Any static server works.

## Adding a page

1. Create `content/<section>/<page>.md`.
2. Add front matter.
3. Add its id to the right group in `content/meta.json`.
4. Rebuild.

```markdown
---
title: Page title
description: One sentence, used for the meta description and search results.
badge: Advance
---
```

`badge` is optional and renders next to the page in the sidebar. Use `Grow`,
`Advance` or `Premium`.

A page listed in `meta.json` but not yet written is reported as a warning and
skipped, so you can plan the tree before writing it.

## Writing

Standard Markdown, plus these blocks.

### Callouts

```markdown
::: note Optional custom title
Body text, which may contain lists and links.
:::
```

Kinds: `note`, `tip`, `info`, `warning`, `danger`, `plan`.

### Cards

```markdown
::: cards
- [Quick start](getting-started/quick-start): {rocket} One line of description.
:::
```

`{icon}` is optional. Icon names are the keys of `ICONS` in `build.mjs`.

### Steps

```markdown
::: steps

### First step

Body.

### Second step

Body.

:::
```

### Accordion or FAQ

```markdown
::: faq
### A question?
The answer.
:::
```

### Two columns

```markdown
::: columns
Left column.

---

Right column.
:::
```

### Pricing cards

```markdown
::: pricing
:::
```

Renders the four plan cards as a 2x2 grid, matching the marketing site and the
Plan and billing screen in the app. It takes no arguments: the plans, prices,
limits and feature rows live in the `PRICING` array near the top of
`build.mjs`, so a price change is one edit in one place.

`app/data/plans.ts` in the Varn app repo is the source of truth for what
merchants are actually charged. Change it there first, then mirror it into
`build.mjs` and the marketing site's pricing section.

### Plan availability

```markdown
::: plans advance premium
:::
```

Renders a row of Free / Grow / Advance / Premium pills with the named ones
ticked and the rest struck through.

## Linking

Link by page id, with no extension. The generator resolves it to the correct
relative path for the page it appears on:

```markdown
See [Assignments](concepts/assignments).
```

External links and `mailto:` are detected and get `target="_blank"` plus
`rel="noopener"` automatically.

Because ids are resolved at build time, a typo produces a link that does not
resolve rather than a silent 404. Run the link check below after a big edit.

## Checks worth running

- Every internal link resolves to a file that exists.
- No page is orphaned from `meta.json` (the build warns).
- The site has no horizontal overflow at 375px.

## Motion

`assets/motion.js` adds smooth scrolling, the "on this page" rail, the reading
progress bar and content reveals. Libraries are vendored into `assets/vendor/`
so the site still makes no third-party requests.

| Library | Version | Licence |
| --- | --- | --- |
| GSAP core + ScrollTrigger | 3.12.5 | GreenSock standard "no charge" licence |
| Lenis | 1.1.18 | MIT |

ScrollSmoother is deliberately **not** used: it is a Club GreenSock plugin and
would need a paid licence. Lenis does the same job under MIT.

### The rail

The TOC is traced by an SVG path that jogs in with a rounded corner wherever
the next heading is nested. A second copy of that path, in the accent colour,
is revealed through a dash window.

**The stroke is continuous, not snapped to entries.** `geo.bounds` records the
path length at the start of every entry, which turns the rail into one ladder,
and `yToLen()` maps any document position onto it by interpolating inside the
entry it falls in. The stroke's two ends are simply the top and bottom of the
reading band run through that map, so it slides as the page moves rather than
jumping when a heading crosses a line. That is what makes it track a heading
sliding up behind the header.

The **labels** are still discrete: an entry lights up once the stroke covers a
real part of its rung, so text does not flicker as the stroke grazes it.

The **dot** marks the leading end of the stroke: the bottom when you scroll
down, the top when you scroll up. It slides between the two ends on a change
of direction rather than teleporting, and `DIR_FLIP` keeps a few pixels of
jitter from flipping it.

Tuning knobs, all near the top of the rail section in `motion.js`:

| Constant | Default | Effect |
| --- | --- | --- |
| `INDENT` | `3` | px the rail moves in per heading level |
| `PAD_X` | `4` | px inset, keeps the dot's radius clear of the TOC's clip |
| `CORNER` | `2.5` | max corner radius, auto-clamped to half the jog |
| `BAND_TOP` | `0.14` | where the reading band starts, as a fraction of the viewport |
| `BAND_BOTTOM` | `1` | where it ends, at the very bottom edge |
| `MIN_OVERLAP` | `9` | rail px an entry needs covered before its label lights |
| `MIN_FRACTION` | `0.34` | or this share of the rung, whichever is smaller |
| `DIR_FLIP` | `40` | px of scroll before the dot changes ends |

The band is **asymmetric on purpose**, because its two edges answer different
questions. The top starts below the header, so a section still clipped to the
top edge counts as read and lets go. The bottom runs to the very edge of the
viewport, so a heading arriving from below lights up the instant it appears.

Raising `BAND_TOP` makes entries let go sooner as you scroll past them.
Lowering `BAND_BOTTOM` makes an arriving heading light up later. `INDENT` is
deliberately subtle; the fumadocs reference uses roughly 10px if you ever want
the hierarchy jog more pronounced.

The entries the stroke starts and ends in are always lit regardless of
`MIN_OVERLAP`, which is what makes the bottom edge feel instant.

### What is deliberately not animated

The **sidebar**. It is persistent navigation, so the reader is looking at the
same list from page to page. Fading it in on every load made navigating read
as the page reloading rather than as polish. Only content that actually
changed between pages animates.

There is also **no custom scrollbar**. The native one is styled (thin, brand
thumb, transparent track) and left alone.

### Degrading

Every part is optional and independently guarded:

- **No GSAP or no Lenis**: scrolling is native, the rail still tracks (without
  tweening), reveals are skipped entirely.
- **`prefers-reduced-motion`**: no smooth scroll, no reveals, no tweening. The
  rail still marks your position, it just moves instantly.
- **Touch devices**: smooth scroll is off. Native momentum scrolling is better
  than anything synthesised on top of it.
- **Script failure**: the hidden state for reveals is set from JS, never from
  CSS, and a timer clears any block still hidden after 2.5s. There is no state
  in which the documentation renders blank.

### Debugging

`window.VarnMotion` is exposed on every page:

```js
VarnMotion.state()    // gsap version, smooth on/off, rail built, active range
VarnMotion.refresh()  // re-measure after a layout change
VarnMotion.lenis      // the Lenis instance, or null
```

## Conventions

- **Say what is true.** If a feature has a limit, the page states the limit.
  If something cannot be measured honestly, the docs say so rather than
  implying a capability.
- **Lead with the answer.** Troubleshooting pages start with the most common
  cause so most readers can stop after the first paragraph.
- **No em dashes**, matching the house style used across the codebase.
- **US spelling** in prose ("color"), because that is what the app's interface
  uses. Option names that Varn genuinely recognises, such as `Colour`, are
  quoted as they are.
- Every page ends up in the sidebar, the search index and the prev/next pager
  automatically. There is nothing to register by hand beyond `meta.json`.
