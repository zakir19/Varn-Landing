---
title: Advanced customization
description: Option names, per-color overrides, card image source and the settings you reach for once.
---

The Advanced section sits at the bottom of each Style tab and starts closed. Everything in it is additive: every default reproduces exactly what Varn does today.

## Option names

**Which options become swatches.**

Varn recognises these option names out of the box:

```text
Color, Colour, Couleur, Farbe, Colore, Kleur, Farve
```

If your color option is called something else, "Shade", "Finish", "Tone", "Wood", add it here as a comma-separated list. It is a store-wide setting, so you do this once.

::: warning Add colors only
This list decides what becomes a swatch. Adding "Size" means Varn will try to render sizes as color chips, which produces a row of identical gray circles. If you have a non-color option you want as buttons, leave it to your theme.
:::

If a product's color option is not recognised, the Options step says so, names the words it does recognise, and links here.

## Per-color overrides

::: plans advance premium
:::

**Style one color differently.**

Sometimes one value needs to break the rules: your "Gold" needs a bigger chip, or "Limited Edition" needs a square one. Add an override keyed by the value name and set any of:

- a different visual (color or photo)
- a different size
- a different shape
- a tooltip shown on hover

Overrides apply everywhere that value appears, across every product.

Notes:

- Value names are matched case-insensitively.
- An override that changes nothing is discarded on save, so the list stays meaningful.
- There is a cap on how many overrides you can add, shown as a meter. Overrides are for exceptions; if you need dozens, the base style is probably wrong.
- Duplicate names are refused with an inline error rather than silently merged, because a silent merge destroys the row you were editing.

## Card image source

Controls what [card chips](guides/collection-search) prefer when a value has no assignment:

- **Auto** (default): a color implied by the value name, then the variant photo.
- **Variant image**: always the variant photo.

Auto is right for most stores, because a tiny product photo often reads as a smudge at chip size while a blue circle reads instantly. Choose variant image if your colors are prints and patterns where a flat color misleads.

## Non-image values as a dropdown

If a value has no photo, keep your theme's own dropdown for it instead of rendering a chip.

::: warning Check what this does on your theme
On themes that render their swatch photo as a background style rather than an image element, this used to hide every option. Varn now reads those correctly, but this setting is still the fastest way to make a whole option disappear if your products have no photos. Turn it on, then look at a product page.
:::

## Structured data

Emit product group structured data for your color range, which helps search engines and AI shopping agents understand that your variants are one product in several colors. See [Agent readiness](agent/overview).

## Smooth transitions and preloading

- **View transitions**: animate the swap between colors on browsers that support it. Committed selections only, and off automatically for reduced-motion shoppers.
- **Preload pages when a shopper hovers**: start fetching a product page when a shopper hovers a card chip, so the click feels instant. Capped at a small number of URLs so it cannot become a bandwidth problem.

## Reset

Each scope has its own reset, which returns that scope to defaults without touching the others.
