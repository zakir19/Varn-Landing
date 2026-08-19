---
title: Introduction
description: What Varn does, how it behaves inside your theme, and the promises it keeps.
---

Varn is a Shopify app that replaces the variant dropdown on your storefront with swatches: a color chip, a two tone chip, a gradient, or a real photo. Shoppers see the choice instead of reading it.

It is built around one rule that shapes every other decision in the app: **Varn never becomes the picker, it drives yours.** When a shopper taps a swatch, Varn clicks your theme's own hidden radio button or select. Your theme still owns the variant, the price, the gallery and the cart. That is why the classic "wrong variant went into the cart" bug cannot happen here.

## What you get

::: cards
- [Color and image swatches](guides/color-swatches): {swatch} Solid, two tone, gradient or a real product photo, on unlimited products.
- [One-click Auto Detect setup](guides/ai-setup): {wand} Varn reads your option values and photos and configures colors for you.
- [Per-color photo galleries](guides/variant-galleries): {image} Pick which photos belong to which color, and their order.
- [Swatches beyond the product page](guides/collection-search): {globe} Collection pages, search results, quick view and everywhere else.
- [A real style studio](style/overview): {sliders} Shape, size, spacing, labels, borders, effects, with a live preview.
- [Analytics that tell you what to stock](analytics/overview): {chart} Which colors get clicked, and which sold-out colors people still want.
:::

## What Varn deliberately does not do

Being explicit about this is the point. A swatch app sits on the most valuable page in your store, so the limits matter as much as the features.

- **It does not edit your theme files.** Everything storefront-side is a theme app extension, which Shopify installs and removes for you. Uninstalling leaves nothing behind. See [How Varn works](concepts/how-it-works).
- **It does not use script tags.** Script tags are blocked for new apps and do not clean up on uninstall.
- **It does not build a second cart path.** No parallel add to cart, no custom variant resolution.
- **It does not touch your products unless you press a button.** Varn writes its own metafields. The only two actions that modify a product are [Set image swatches as variant photos](guides/sync-variant-photos) and uploading a photo from the [photo sequencer](guides/photo-sequencing), and both are explicit buttons, never a side effect of saving.
- **It does not collect shopper data.** Analytics records an anonymous color click, nothing about the person. See [Permissions and privacy](reference/permissions-privacy).
- **It does not invent numbers.** If we cannot measure something honestly, we do not show a chart for it.

## Who it is for

Varn is aimed at merchants who sell the same product in several colors and are losing sales to a gray dropdown. It works on any Shopify theme that renders a normal variant picker, including Dawn, Horizon and the paid themes built on the same patterns. See [Theme compatibility](reference/themes).

If your theme already ships native swatches for an option, Varn detects that and steps aside instead of drawing a second row. You can override that per option in the [Style studio](style/overview).

## The shape of the app

There are two editors, and knowing which one you want saves a lot of time:

| Editor | Use it to |
| --- | --- |
| **Swatches** | Decide what each color value looks like: a color chip, a two tone chip, a gradient or an uploaded photo. |
| **Variants** | Decide which product photos belong to each color, and in what order. |

They write to the same record, so a value can have both a swatch and a photo set. See [Swatches vs Variants](concepts/swatches-vs-variants).

## Pricing in one line

Free covers unlimited color swatches, swatches on collection, search and quick view, and the whole agent-readiness suite, forever. Grow ($14.99/mo) raises the variant-image and grouping limits. Advance ($24.99/mo) adds full Auto Detect, photo matching, advanced styling and analytics. Premium ($49.99/mo) carries the highest limits for large catalogs. Every paid plan includes a **7-day free trial**. See [Plans](billing/plans) and [The free trial](billing/trial).

::: tip Next step
[Run the quick start](getting-started/quick-start). It is three screens and about two minutes.
:::
