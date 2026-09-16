# Design tokens + responsive uniformity pass

Branch `design-tokens-responsive-pass`, three commits, each reviewable on its own:

1. **Extract design tokens into design-tokens.css** (Task 1)
2. **Unify media queries on one rem scale** (Task 2, breakpoints only)
3. **Fix focus rings, touch targets and the status bar overflow** (Task 2, bugs found by rendering)

Scope held to `index.html`, `privacy.html`, `status.html`, `assets/css/*` and the README pointers. No HTML structure, class, id, `data-*`, copy or JS changed. The only HTML edit is one `<link>` per page. `ui/` (the `@varn/prism-ui` React/Vite library) and `docs/` (the zero-dependency docs generator) were checked and left alone; they are separate products with their own tokens.

The reference file `/reference/design-tokens-v2.css` is not in this repo or the working folder, so its conventions were followed as the brief describes them: the "why" is commented next to each value, AA ratios sit beside colour pairs, and deliberate exceptions are called out.

## How it was verified

A headless Chrome harness (DevTools protocol, not committed) recorded the computed value of every CSS property plus the box of every element and `::before` / `::after`, on all three pages, then diffed runs:

- **Widths:** 360, 390, 414, 480, 768, 820, 1024, 1280, 1440, 1920, plus the edges 479/480, 640, 700, 767/768 and 991/992.
- **Emulation:** phones (under 768px) were emulated with touch, so `(pointer: coarse)` matched.
- **Noise:** two back-to-back baselines were identical, so any diff is real. The only exceptions are live status data, which was checked case by case.
- **States:** hover was forced on `.btn--primary`, `.btn--inverse`, `.btn--secondary`, `.hero__pill--live`, `.tile--pastel-cream`, `.plan` and `.vgal__chip`, and all of them computed identically before and after.
- **Focus:** `:focus-visible` crops were captured for every custom control.
- **Print:** a print-media run of all three pages confirms print output did not regress.
- **Before copy:** the "before" tree was served from the original commit `d189068`, so every comparison is against the untouched site.

| Commit | Computed changes, all pages, all widths |
|---|---|
| 1. Tokens | One: the marquee mask stop colour (`#000` to `var(--color-ink)`). A mask reads alpha only, so it renders identically. |
| 2. Breakpoints | Only `.status-strip` border radius between 640 and 767px (see below). Every edge width is otherwise identical. |
| 3. Fixes | Only the fixes listed below, at the widths they target. |

Before/after screenshots (full page, 390 / 820 / 1440 for each page) are in `../screenshots/before` and `../screenshots/after`, next to the repo and not committed.

## Task 1: design-tokens.css

- All three `:root` blocks were moved with their names unchanged: the main set, the `62em` `--header-h` override and the `--st-*` status palette. `design-tokens.css` is linked before `styles.css` on every page.
- The file repeats `@layer reset, base, layout, components, utilities;`. Layers are ordered by first appearance, and the tokens file loads first, so without this `base` would be created before `reset` and reset rules would start beating base rules.
- Sections: Brand palette, Neutrals, Semantic, Channel triplets, Status tones, Typography, Spacing, Shape, Shadow, Layout, Layers, Motion, Journey plane, Print, Swatch demo, plus a breakpoint reference table.

### Literals that became tokens

| Was | Now | Note |
|---|---|---|
| `color: #fff` x5, `background: #fff` x3, the `2px #fff` receipt ring | `--color-white` | New raw value, kept apart from `--color-page` / `--color-surface`. Those are roles (page ground, card). Text on a dark fill must stay pure white even if the page is tinted again, as the old "AA on cream" comments show it once was. `.btn--inverse:hover` uses it too, because its hover was written to lift the button to pure white, which `--color-page` would turn into a no-op on a tinted page. |
| `.btn--primary:hover #5449b8` | `--color-violet-deep-hover` | White label 6.95:1 |
| `.hero__pill--live:hover #e4e2f8` | `--color-violet-soft-hover` | violet-deep text 6.93:1 |
| `.tile--pastel-cream #f5f1e8` | `--color-cream-soft` | Completes the pastel family. The README listed it as `--color-cream`, so the README now shows the real token. |
| hatch stripe `#f6d8ca` | `--color-clay-hatch` | No alpha of clay reproduces it exactly, so it stays a named literal. |
| plane fills `#dededf`, `#b7b6bb` | `--color-plane-shade`, `--color-plane-keel` | |
| print `.legal-doc { color: #000 }` | `--color-print-ink` | **Deliberate exception, kept.** It only applies inside `@media print`: warm ink prints as soft composite toner, while pure black prints crisp. Commented in both files. |
| brand stripe gradient, four hex stops | `var(--color-violet / blush / clay / ink)` | Can no longer drift from the palette it illustrates. |
| marquee mask `#000` | `var(--color-ink)` | The mask reads alpha only. |
| 43 `rgb(38 36 46 / n%)`-style literals | `rgb(var(--color-ink-rgb) / n%)` and six sibling triplets | Computes to exactly the same value. `color-mix()` would serialise differently and needs Safari 16.2+. |

Left literal on purpose, with comments: the `--grad-accent` stops (tuned darker than the fills to hold 3:1), the `--st-*` tones (a status colour must not move when the brand re-tints), and the select arrow's `%234e483a` stroke inside a data URI, where `var()` cannot reach.

### z-index scale (every value unchanged)

| Token | Value | Used by |
|---|---|---|
| `--z-local-below` / `-base` / `-raised` | -1 / 0 / 1 | inside one component: header backdrop, toggle thumb and options |
| `--z-route` | 1 | `.journey` (dives under sections) |
| `--z-content` | 2 | `.section`, `.hero`, `.site-footer` (one shared layer) |
| `--z-route-over` / `--z-route-notes` | 3 / 4 | journey lifted over panels, and its bubbles |
| `--z-tooltip` | 60 | `.st-tip` |
| `--z-sticky-cta` | 90 | `.mobile-cta` |
| `--z-header` | 100 | `.site-header` |
| `--z-modal` | 120 | `.launch-moment` |
| `--z-confetti` | 130 | `.confetti-layer` |
| `--z-skip-link` | 200 | `.skip-link` |

**Needs owner confirmation (not changed):**

- `--z-tooltip` (60) sits under `--z-header` (100), so a status tooltip near the top of the viewport can slide under the fixed header. Raising it above the header is probably right, but it changes what paints on top.
- `--z-modal` (120) sits over the header, so if the mobile menu were ever open while the launch card shows, the card would cover the bottom of the panel.

## Task 2a: breakpoints

One unit (rem), the classic `min-width` / `max-width` syntax, and one scale documented in `design-tokens.css`: 22.5 / 30 / 36 / 48 / 62 / 75rem, with 90rem reserved.

Rem is kept for the brief's reason: it respects the visitor's browser font size, which px ignores. One correction to that rationale, though: inside a media query `em` already resolves against the initial font size, so em-based queries never compounded. That's why every `em` query below converted with zero computed change. The classic syntax was chosen over `(width >= ...)` because the homepage already used it, and the range form needs Safari 16.4+.

| Was | Now |
|---|---|
| `max-width: 47.99em`, `.section` 64px | removed; `--section-pad` is 64px and becomes 100px at `min-width: 48rem` (mobile-first, in the token file) |
| `min-width: 36em` / `48em` x2 / `62em` x2 / `75em` | same numbers in rem |
| `min-width: 992px` (journey) | `min-width: 62rem` |
| `width >= 30rem` / `48rem` x2 / `62rem` x2 | `min-width:` same value |
| `width < 30rem` x2 | `max-width: 29.99rem` (narrow band) |
| `width < 40rem`, strip radius (off-scale) | mobile-first: `--radius-lg`, pill from `min-width: 48rem` (**bug fix**, below) |
| `width < 48rem`, strip service pips | mobile-first: `margin-inline-start: auto` from `min-width: 48rem` |
| `max-width: 767px` / `479px` | `max-width: 47.99rem` / `29.99rem` |
| `max-width: 22.5em` | `max-width: 22.5rem`, deliberately inclusive of 360px, commented |

**Status strip radius.** Measured in the browser, the strip is still two rows at 640px and fits on one row at 700px. The old 40rem (640px) switch put a pill radius on the two-row box from 640px until the strip fits on one row, which draws a capsule. The pill now starts at 48rem, the same step that moves the service pips. **Trade-off to confirm:** between 700 and 767px the strip is one row and now shows the 24px radius instead of the pill.

JS mirrors: `nav.js` `(min-width: 62em)` and `legal.js` `(width < 62rem)` both equal the CSS exactly. `main.js` `(min-width: 992px)` belongs to `initJourney`, which returns early (the tour is switched off), so it cannot disagree. JS was not edited.

## Task 2b: bugs found by rendering

| Bug | Evidence | Fix |
|---|---|---|
| **FAQ questions had no visible focus ring.** `.faq__item { overflow: hidden }` clipped the outline drawn 3px outside the question. | Focus crop: nothing visible before, full ring after. | `.faq__question:focus-visible { outline-offset: -3px }` with the radius matched to the item. |
| **Legal contents links lost their ring's left and right edges** from 62rem, where the list scrolls. | Focus crop at 1440. | `outline-offset: -2px`, desktop only. |
| **Status tick focus ring clipped** by the scrolling bar (top, bottom, and the outer side of the first and last tick). | Focus crop at 390: a 2px sliver before, whole ring after. | `.st-bar-wrap` gets 8px / 4px padding and matching negative margins. Nothing around it moves (verified: only the wrap's own box changes). |
| **Status bar scrolled on phones, hiding "today".** A 2px minimum for 90 ticks needs 269px; the bar is 236px wide at 360, 251px at 375 and 266px at 390, and 359px were needed at 480. The CSS comment claimed this was already fixed; the harness missed it at first because headless Chrome hides scrollbars. | Pre-change: `scrollWidth > clientWidth` on every bar at 360, 375, 390 and 480. After: none. | Minimum 1px under 30rem so ticks flex to fit (about 1.6px at 360). At 480 to 482px, the 3px the ticks still overshoot now lands inside the new 4px inline room instead of scrolling. |
| **Controls under 44px on touch screens:** live pill 36px, toggle options 38px, gallery chips 38px, `.btn--sm` 40px, sliders 24px, footer links 34 x 27px. | Touch audit at 360 to 480. | Under `(pointer: coarse)`, an iPad counts too. An invisible `::before` expands pill, toggles, chips and `.btn--sm` to 44px, so nothing moves (hit-tested at the edges in the browser). Sliders become 44px with -10px margins, so the layout is unchanged and their focus ring is inset so it stays clear of the label. Footer links really grow to 44 x 44px because their neighbours are too close for an overlay, so **the footer is 120px taller on touch screens**. |

Still under 44px, on purpose: `.st-tick` width (90 days on one row; the row is 44px tall and keyboard reachable), inline links inside policy text (WCAG 2.5.8 exempts them), and `.skip-link` (keyboard only).

Audited and fine as they were:
- **Page overflow:** no page-level horizontal overflow at any width. The only element past the edge is a `.visually-hidden` paragraph at -1px.
- **Scrolling boxes:** `.legal-table-wrap` scrolls inside its own box on phones, as its comment intends. The marquee and the (disabled) journey stay inside their clipping parents.
- **Reduced motion:** the global reduced-motion block (unlayered, `!important`) covers every animation and transition, including the marquee and journey. Nothing added here animates.
- **Contrast:** every token pair touched was measured and noted in the token file. All are AA: text pairs run 4.88:1 to 15.28:1.

## Section rhythm (measured at 390 and 1440)

| Block | Padding, mobile | Padding, desktop | Max width | Gutter | Matches default? |
|---|---|---|---|---|---|
| `.hero` | 104 / 32 | 120 / 32 | 1320 (`.shell`) | 12 | Differs, explained in the comment at `.hero` |
| `.marquee` (in the `.section--tight` after the hero) | 32 / 64 | 32 / 100 | full section width, not in a shell | none | Top trim commented (`.hero + .section--tight`). **The full-bleed strip has no comment.** It looks deliberate (edge fade mask). |
| `.steps`, `.bento`, `.studio`, `.surfaces` and the agent, variants, groups, AI, analytics sections | 64 / 64 | 100 / 100 | 1320 | 12 | Yes |
| `.pillars` (`.section--ink`) | 64 / 64 | 100 / 100 | panel 1296, content inset 28 to 56 | panel | Differs, commented at `.section--ink` |
| `.pricing` | 64 / 64 | 100 / 100 | **1320** | 12 | **Comment mismatch.** `--shell-mid` says pricing is a narrower 980px card, but no page uses `.shell--mid` (or `.shell--narrow`). Left as rendered; confirm which is intended. |
| `.faq` | 64 / 64 | 100 / 100 | 1320, answers capped at 68ch | 12 | Yes |
| status strip (`.section--tight`) | 64 / 64 | 100 / 100 | 1320 | 12 | Yes |
| `.closer` (`.section--ink`) | 64 / 64, +44 margin below | 100 / 100, +44 | panel 1296 | panel | Differs, commented at `.closer` |
| `.launch-moment` (fixed overlay) | 76px + safe area from bottom under 48rem, 24px above | | card 440 | 16 | **The 76px clears a sticky CTA bar that has no markup** (`.mobile-cta` exists only in CSS and `main.js`). |
| `.site-footer` | 44 / 36 | 44 / 36 | 1320 | 12 | Own values (`--space-2xl` / `--space-xl`), no comment |
| `.legal-page`, `.st-page` | 112 / 56 | 120 / 56 | 1320 | 12 | Commented at `.legal-page`; `.st-page` mirrors it |

`--section-gap` is defined but no rule uses it; its comment describes the switched-off journey tour.

## Other findings, not changed

- **Dead CSS:** about 30 selectors for `.wl*` (the waitlist page now redirects to the App Store) and `.mobile-cta` have no markup on any page.
- **Em-dashes:** there were none in the rendered content of the three pages, meta and alt text included, before or after. Six in `styles.css` comments were replaced. Em-dashes remain only where nothing was edited: JS comments, `README.md` prose, and `ui/index.html` (out of scope).
- **Print:** the print-media computed diff, before vs final, shows only the screen fixes above. Legal-doc black and the white print background are unchanged.

## Follow-up: heading clipping, groups heading, separators, button arrows, container

- **Last letter of gradient headings cut off (global fix in `.accent`).** Headings use negative letter-spacing, which is also applied after the final character, so each accent span's box ended before its last letter's ink. `background-clip: text` only paints inside the box, so up to 3.4px of the letter was lost. The problem showed on 11 of the 14 accents (`e`, `s`, `p`, `k`, `t` endings). `.accent` now has `padding-inline: 0.05em 0.12em` with a matching negative margin, so the painted area covers the ink and nothing moves. Measured after the fix, every last letter ends 3.8 to 7.3px inside the painted area at 1440px, and at least 1.5px inside at 390px.
- **Product grouping heading on top.** The eyebrow and title moved out of the split column into a `section__head` above it, like the other headed sections. On desktop the mock and the copy now sit side by side under the heading; on phones the order is heading, text, mock.
- **Section separators removed.** `.section--sunk` no longer draws hairlines, and the two rules that suppressed them next to ink panels are gone. The footer's own top rule is unchanged.
- **Arrow icons removed from buttons.** Removed from the three "Add Varn free" buttons (hero, closer, launch card) and the button-styled "Status page" link, and `.btn__icon` CSS deleted. The "Now live" hero pill arrow and the small arrows on status page incident links are links rather than buttons and were kept.
- **Container is 1320px of content.** `--shell-max` now means the content width, with the 12px gutters outside it. Before, it included them, so content was 1296px. Ink panels, the privacy page and the status page follow the same width. This supersedes the 1296 figures in the rhythm table above.
