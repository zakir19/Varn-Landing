---
title: Duplicate or flickering swatches
description: Two rows of swatches, doubled chips, or a flash back to the dropdown after clicking.
---

## Two swatch rows on the product page

**Cause:** your theme draws its own swatches for that option, and Varn drew a row too.

Varn detects native swatches and steps aside, but themes signal them in many different ways and a few slip through.

**Fix:** pick one source and turn the other off.

::: columns
**Keep Varn's swatches**

In your theme editor, find the product page setting for swatches or option display and set that option back to a plain dropdown or buttons.

Usually in Theme settings, or in the variant picker block's settings.

---

**Keep your theme's swatches**

In Varn, set that option to **dropdown** mode in [Style, advanced](style/advanced), or remove the option name from the recognised list.
:::

If neither works, [tell us the theme name](resources/support). Native swatch detection is per theme, and a fix reaches every merchant on that theme.

## Two chips for the same color

**Cause:** a theme re-render race. The theme inserted a new picker before removing the old one, and both were briefly counted.

This is handled by deduplicating values within a group. If you still see it, it is a genuine bug and worth reporting with the theme name and a screenshot.

## Swatches flash back to a dropdown after clicking

**Cause:** the theme rebuilt the variant picker after the change, and the re-enhance did not fire.

Dawn-family themes replace the whole picker on every variant change, sometimes hundreds of milliseconds later. Varn watches for both the insertion of the new picker and the removal of the old one, so the fresh picker is enhanced before the native control can show.

If you see the flash on your theme, please report it with:

- the theme name and version
- whether the flash happens on every click or only the first
- a screen recording if you can

## Duplicate swatches in quick view

**Cause:** in quick view, Varn enhances even when the theme draws its own swatches, deliberately. You opted into quick view swatches explicitly, and deferring there was causing "the swatch is not visible in quick view" reports.

**Fix:** if your theme's quick view already has good swatches, turn off **Quick-view swatches** in [Style, Global](guides/quick-view). Card chips are unaffected.

## Chips on cards but not on the product page

That is the [native swatch deferral](troubleshooting/swatches-not-showing) doing its job: your theme draws swatches on the product page but not on cards, so Varn stays out of the way in one place and fills the gap in the other.

If you would rather Varn owned both, turn your theme's product page swatches off.

## Duplicate photos in the product gallery

**Cause:** running [Set image swatches as variant photos](guides/sync-variant-photos) more than once, on an older version.

Varn now tags the media it creates and reuses it on a second run, so re-running does not duplicate. Remove any duplicates already created in Shopify's product editor.

## Two swatch rows on the same card

Report it. Card chips are inserted once per card and skip cards that already have chips, so this indicates a theme structure Varn is misreading. The collection URL and theme name are what we need.
