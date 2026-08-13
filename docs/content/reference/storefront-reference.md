---
title: Storefront reference
description: CSS classes, data attributes, markup structure and rendering rules for developers.
---

For theme developers, agencies and anyone writing [custom CSS](style/custom-css).

## Markup structure

The swatch row Varn inserts next to your theme's own (now hidden) picker:

```html
<div class="varn-swatches varn--circle varn--md varn--labels"
     role="radiogroup" aria-label="Color">

  <span class="varn-swatch" role="radio" aria-checked="true" tabindex="0">
    <span class="varn-swatch__chip"></span>
    <span class="varn-swatch__label">Sand</span>
  </span>

  <span class="varn-swatch varn-swatch--soldout"
        role="radio" aria-checked="false" aria-disabled="true">
    <span class="varn-swatch__chip"></span>
    <span class="varn-swatch__label">Clay</span>
  </span>

</div>
```

## CSS classes

### Containers

| Class | Where |
| --- | --- |
| `.varn-swatches` | The product page swatch row |
| `.varn-cswatches` | Chip row on a collection or search card |
| `.varn-gswatches` | The [product group](guides/product-grouping) row |
| `.varn-mswatches` | The ["more in this color"](guides/more-in-this-color) row |
| `.varn-caption` | The caption line, with `.varn-caption__value` inside |
| `.varn-slider-shell` | Slider layout wrapper, with `.varn-arrow` controls |

### Swatches

| Class | Meaning |
| --- | --- |
| `.varn-swatch` | One swatch |
| `.varn-swatch__chip` | The colored or photographed circle |
| `.varn-swatch__label` | The value name under the chip |
| `.varn-swatch--current` | The selected swatch |
| `.varn-swatch--soldout` | Unavailable |
| `.varn-swatch--image` | Rendering a photo rather than a color |
| `.varn-swatch--more` | The overflow chip on a group row |
| `.varn-pill` | A text pill, used when no value in a group resolves to a visual |

### Modifier classes on the row

Set from your [Style studio](style/overview) settings:

| Class | Setting |
| --- | --- |
| `.varn--circle` `.varn--square` `.varn--rounded` `.varn--pill` | Shape |
| `.varn--sm` `.varn--md` `.varn--lg` | Size preset |
| `.varn--rect` | A rectangular height is set |
| `.varn--labels` | Labels are on |
| `.varn--wraplab` | Labels show in full rather than clamped |
| `.varn--slider` | Slider layout |
| `.varn-shadow-soft` `.varn-shadow-lift` | Shadow style |
| `.varn-sel-scale` `.varn-sel-glow` | Selected state effect |
| `.varn-so-fade` `.varn-so-none` | Sold-out style |
| `.varn-lc-upper` `.varn-lc-title` `.varn-lc-lower` | Label case |

## CSS custom properties

Free-form values are passed as custom properties rather than classes, so they can be any value:

| Property | Controls |
| --- | --- |
| `--varn-size` | Chip size in pixels |
| `--varn-fx` | Effect accent color |

Setting `--varn-size` inline on a row or a single swatch overrides the size preset. That is how per-color size overrides work.

## Data attributes

The app embed writes small JSON islands into the page. They are read once at startup and are not an API, but they are useful when debugging:

| Attribute | Carries |
| --- | --- |
| `data-varn-assignments` | This product's assignments |
| `data-varn-media` | The per-color photo map |
| `data-varn-collection` | Card data for a collection or search grid |
| `data-varn-group` | The product group this product belongs to |
| `data-varn-more` | Color index data for "more in this color" |
| `data-varn-order` | Self-optimizing order scores |
| `data-varn-custom` | Your custom CSS |

## Global objects

| Object | Purpose |
| --- | --- |
| `window.VarnConfig` | The resolved configuration for this page, including your style settings and whether Pro features are on. |
| `window.VarnExtras` | The optional second chunk, present only when a feature needs it. |
| `window.VarnTrack` | Analytics diagnostics, Pro only. `state()` reports the tracker's status, `flush()` forces a send, `reset()` re-arms it. Read-only diagnostics; it cannot create events. |

Checking `window.VarnConfig.pro` on a product page is the fastest way to confirm whether your storefront currently sees a Pro entitlement.

## Accessibility contract

- The row is a `radiogroup` with an accessible name taken from the option.
- Each swatch is a `radio` with `aria-checked`.
- Arrow keys move between swatches, <kbd>Space</kbd> selects, matching native radio behaviour.
- Sold-out swatches carry `aria-disabled` and announce their state as part of the accessible name.
- State is never carried by color alone: selection has a ring, sold out has a mark, and labels carry the name.
- All motion is disabled for shoppers with a reduced-motion preference.

## Rendering rules worth knowing

- **Varn drives your theme's input.** It never resolves a variant itself.
- **It defers to native swatches** on the product page. If your theme already draws its own swatch UI for an option, Varn steps aside rather than drawing a second row. Quick view is the deliberate exception.
- **It is idempotent.** A re-scan cannot double-render a row.
- **It re-applies after theme re-renders**, including during transitions where a theme keeps both the old and new picker in the DOM.
- **Everything is guarded.** A failure in one card, one gallery or one island never breaks the page.
