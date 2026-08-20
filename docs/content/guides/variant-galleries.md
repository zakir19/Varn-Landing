---
title: Per-color photo galleries
description: Show only the photos that belong to the color a shopper picked, in the order you choose.
---

::: plans free grow advance premium
:::

By default a Shopify product page shows every photo, whichever color is selected. Shoppers pick red and scroll past eleven blue photos.

Per-color galleries fix that: pick which photos belong to each color, and Varn hides the rest when that color is chosen.

::: note Free for your first 5 products
Photo mapping is free on up to 5 products so you can use it on your hero products without paying. Paid plans raise the limit: 150 products on Grow, 1,500 on Advance, unlimited on Premium. The Variants page shows a meter with how much of your allowance you have used.
:::

## Mapping photos to a color

::: steps

### Open the Variants editor

Pick your product and continue to Configure. Each color value gets a row with a photo thumbnail, a status line and its actions.

### Open the photo picker

Press **Set up variant images** on the value's row, or click the thumbnail.

### Choose the photos for that color

Select from the product's existing media. The order you build is the order shoppers see, and the first slot is the **cover**, the photo that shows when the color is picked.

Drag to reorder. See [Photo sequencing](guides/photo-sequencing) for the full picker.

### Save

:::

Repeat for each color. Values you never map are left alone: their gallery behaves exactly as it does today.

## What shoppers see

When a shopper picks a color with a photo map:

1. Photos not in that color's map are hidden.
2. The remaining photos are reordered into your sequence.
3. The cover photo becomes the main image.

If they pick a color with no map, the full gallery comes back. Nothing is ever permanently hidden.

## The guardrails

Galleries are the most theme-specific part of any storefront, so Varn is careful:

- Reordering only happens for a map **you** built. Automatic photo matches are filtered but never reordered, because an automatic match carries no intent about order.
- If any step fails, the gallery is left exactly as your theme rendered it. A broken gallery is far worse than an unfiltered one.
- The filter is re-applied after your theme re-renders the gallery, which most themes do asynchronously on every variant change.

## Products with a single variant

A product with one variant has no picker to click, so there is nothing to trigger the filter. Varn handles this case separately: if you mapped photos to the only value, the filter is applied once on page load.

The same applies to a value shared by every variant, for example a single Color beside a real multi-value Size.

## Themes that hide variant photos

Some themes have a "hide variant images in the gallery" setting that hides photos by CSS class. That can hide a photo you deliberately mapped, for example a flat-lay showing four colorways that belongs to all of them.

Varn detects photos in your map that the theme has hidden and forces them visible, copying the layout style of a photo that is already showing so your theme's grid is not broken.

## Adding a photo you do not have yet

You can upload straight into the sequence from the picker. Varn uploads the file, attaches it to the product, alt-texts it with the product and color name, and adds it to the open color's sequence.

::: warning This modifies your product
Uploading here adds real media to your Shopify product, unlike everything else in Varn which only writes its own metafields. It is an explicit button, never part of a save.
:::

## Related

::: cards
- [Photo sequencing](guides/photo-sequencing): {image} The drag-and-drop picker, the cover slot and keyboard support.
- [AI photo match](guides/ai-photo-match): {wand} Let Varn assign existing photos to colors for you.
- [Sync to variant photos](guides/sync-variant-photos): {layers} Push an image swatch into Shopify as the variant's photo.
:::
