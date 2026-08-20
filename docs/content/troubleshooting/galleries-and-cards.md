---
title: Galleries and card chips
description: Photos not filtering, the wrong order, gray chips on collection cards, and wrong photos on swatches.
---

## The gallery does not filter by color

**1. Did you actually map photos to that color?**

Open the [Variants editor](guides/variant-galleries), pick the product, and check the color's row shows a photo count. A color with no map deliberately leaves the gallery alone.

**2. Are you past the free allowance?**

Photo mapping is free on your first 5 products. Paid plans raise the limit to 150, 1,500 or unlimited. The Variants page shows a meter for the allowance.

**3. Does your theme show variant photos at all?**

Some themes have a "hide variant images in the gallery" setting that hides photos by CSS class. Varn detects photos in your map that the theme hid and forces them visible, but if your theme does something unusual here, report the theme name.

**4. Single-variant products**

A product with one variant has no picker to click. Varn applies the filter once on page load instead, but only for a map you built. If nothing happens, confirm the map is saved.

## The photos come back a moment after I click

**Cause:** the theme re-rendered the gallery asynchronously and rebuilt it from scratch.

Varn re-applies the filter after your theme's re-render. If the photos still come back and stay back, that is a theme-specific bug: report the theme name and a link to the product.

## The order I dragged is ignored

**1. Is it an explicit map?**

Order is only applied to a map you built by hand. Automatically detected photo matches are filtered but never reordered, because an automatic match carries no intent about sequence.

Open the picker and drag the photos into the order you want, even if the selection is already right.

**2. Do you have at least two photos in the map?**

Ordering one photo is a no-op.

## Chips on collection cards are gray

**1. Is the value configured?**

An unconfigured value falls back to a color implied by its name, then the variant photo, then gray. If your value is "Atelier Rust", no dictionary contains it, so it needs a real assignment.

Run [auto-configure](guides/auto-configure) or set it by hand.

**2. Is it a card on a template that cannot read metafields?**

Cards on collection, search and product templates always get your real assignments. Cards found on **other** templates by ["cards everywhere"](guides/collection-search) use Shopify's public product endpoint, which does not include metafields. Those cards fall back to the value name, then the variant photo, then gray. This is a platform limitation, not a setting.

**3. Was the product configured a long time ago?**

Very old configurations were saved under a different storage location. Varn still reads them, but the fastest fix is to open the product in the Swatches editor and press Save, which rewrites it in the current format.

## Cards show product photos instead of colors

That is the auto behaviour: a value with no assignment prefers a color implied by its name, then the variant photo. If you see photos where you expected colors, those values have no dictionary-matchable name and no assignment.

To force photos everywhere, set the card image source to **variant image** in [Style, advanced](style/advanced).

## The swatch shows a photo of a different product

**Cause:** that photo is attached to that variant in Shopify. Varn renders exactly what the variant carries.

This is common with test data and with bundle apps that attach media across products.

**Fix:** any one of

- upload a swatch image for the value in the [Swatches editor](guides/image-swatches)
- switch the value's type to **Color**
- correct the variant's media in Shopify

## Hover on a card does not swap the photo

Hover swap is part of card chips, so it needs the card surface on and a resolvable photo for that value. On touch devices there is no hover, and tapping goes straight to the product, which is the correct behaviour.
