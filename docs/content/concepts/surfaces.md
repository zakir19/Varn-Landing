---
title: Where swatches appear
description: Every page Varn can render on, what each one needs, and which plan unlocks it.
---

Varn can render on five kinds of surface. The product page is always on. The card surfaces are free on every plan; you switch them on in [Style, More storefront pages](style/overview).

## The surfaces

| Surface | What renders | Plan |
| --- | --- | --- |
| **Product page** | The full swatch row that drives your theme's picker, plus image swap and gallery filtering. | Free |
| **Collection pages** | A small chip row on each product card, deep-linking to that variant. | Free |
| **Search results** | The same chip row on search result cards. | Free |
| **Quick view** | Swatches inside your theme's quick view or quick add pop-up. | Free |
| **Everywhere else** | Chip rows on product cards on any other template: home page, featured collections, related products, blogs. | Free |

## Product page

The main event, and the only surface where swatches actually drive the variant selection. It includes:

- the swatch row, replacing the native picker
- hover preview and click to commit of the main image
- the [per-color gallery filter](guides/variant-galleries)
- the [product group row](guides/product-grouping) if the product is in a group
- ["More in this color"](guides/more-in-this-color) on Advance and Premium

## Collection and search cards

Card chips are **navigational, not selectors**. Tapping one takes the shopper to the product page with that variant preselected, and hovering swaps the card photo. They deliberately do not add to cart from the card, because that is your theme's job.

Card chips resolve their appearance in this order:

1. Your saved assignment for that value.
2. A color the value name clearly implies, so "Blue" renders blue even with nothing saved.
3. The variant's own photo.
4. A neutral chip, so a value is never silently missing.

See [Collection and search swatches](guides/collection-search).

## Quick view

Themes inject a product form into a pop-up. Varn watches for that and enhances the injected form with the popped product's own assignments.

Because the shopper explicitly asked for quick view, Varn enhances it even on themes that draw their own swatches there. That is the opposite of the product page rule, and it is deliberate. See [Quick view swatches](guides/quick-view).

## Everywhere else

Product cards outside collection, search and product templates cannot be read from Liquid, so Varn finds them in the page and fetches Shopify's own public product JSON for each one.

::: warning A real limitation
That public endpoint does not include metafields, so cards found this way cannot use your saved assignments. They fall back to the color implied by the value name, then the variant photo, then a neutral chip. Cards on collection, search and product templates always get your real assignments.
:::

Fetches are same origin, browser cached, deduplicated per product and hard capped, so the cost stays bounded on a big page.

## Turning surfaces on

Everything above lives in **Style, Global tab**, behind a master switch.

::: steps

### Turn on the card master switch

**Show swatches on product cards.** With this off, no card surface renders regardless of the individual toggles.

### Turn on the surfaces you want

Collection pages, search results, quick view, everywhere else. Each is independent.

### Check the status line

The switch tells you the actual live state in words, for example "On, but no card surface is turned on yet". More than one condition has to line up, so the app states which one is missing instead of leaving you guessing.

:::

::: tip Start with collection pages
It is the highest-value surface after the product page: shoppers see the color range before they commit to a click.
:::
