---
title: Image swatches
description: Use a real photo as the chip, for prints, textures and anything a flat color cannot describe.
---

::: plans free grow advance premium
:::

An image swatch renders a photo, cropped into the chip. Use it whenever a single color would be a lie: leopard print, oak, marble, tartan, tie-dye, glitter.

## Upload a photo

::: steps

### Set the value's type to Image

In the Configure step, switch the value from Color to Image.

If the value already has a variant photo, Varn pre-fills it with that photo, which is usually what you want.

### Choose a file

Press the upload control and pick an image. Varn uploads the **original file at full quality** to Shopify's Files, then stores only the CDN URL.

### Save

:::

::: note Why full quality matters
Early versions stored a shrunken copy inline, which capped quality. Varn now uploads to Shopify Files and stores a URL, so your chip is as sharp as your source and the storefront requests a small, correctly sized version of it. Your data stays tiny either way.
:::

## The Files permission

Uploading needs Shopify's file permissions. If Varn does not have them yet, a banner appears with a **Grant access** button that opens Shopify's own permission dialog. It takes one click and no app restart.

If you skip it, uploads still work using a small local thumbnail instead, so you are never blocked. Grant the permission when you can, for the quality.

## Choosing a good crop

The chip is a small square or circle, so the photo is centre-cropped hard.

- **Crop tight before uploading.** A full product shot at 40 pixels is a smudge. A close-up of the fabric reads instantly.
- **Fill the frame with the pattern.** Aim for the texture, not the garment.
- **Keep the scale consistent.** If one chip is a macro shot and its neighbour is a whole shirt, the row looks broken.
- **Square source images** avoid surprises about what gets cut.

::: tip A shortcut that usually works
The best swatch photo is often a crop of a photo you already have. Zoom into the fabric detail shot you took for the gallery.
:::

## Image swatches and your gallery

They are separate things, and both are useful:

- An **image swatch** is the chip the shopper taps.
- A **[per-color gallery](guides/variant-galleries)** is the set of photos shown once they have tapped it.

Selecting a swatch commits its image to the main gallery, and Varn holds it through your theme's own re-render so it does not snap back to the previous photo.

## Pushing swatch photos into your product

If you want the photo you uploaded to also become the variant's photo in Shopify, use **Set image swatches as variant photos**. See [Sync to variant photos](guides/sync-variant-photos).

::: warning This one modifies your product
Everything else in Varn writes only its own metafields. That button attaches media to your product, so it lives behind its own explicit action and never runs as part of a save.
:::

## Mixing types in one row

Perfectly fine, and common. A row can be three solid colors, one gradient and two photos. Varn renders them at the same size with the same shape, so the row still looks deliberate.
