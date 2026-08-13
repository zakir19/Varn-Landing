---
title: Assignments and resolution
description: The data model behind a swatch, and the exact order Varn uses to decide what a value looks like.
---

An **assignment** is the record of what one option value looks like. It is the core object in Varn, and knowing how it resolves explains almost every "why does this chip look like that" question.

## The shape of an assignment

Each configured value carries:

| Field | Meaning |
| --- | --- |
| **mode** | `color`, `dual`, `gradient` or `image`. |
| **color** | The primary color. |
| **color2** | The second color, for two tone and gradient modes. |
| **image** | A CDN URL for an uploaded photo, used in image mode. |
| **media** | An ordered list of the product's photo IDs that belong to this value. |

The record is keyed by the option value text, lower-cased, so "Navy Blue" and "navy blue" are the same value. It is stored as one JSON object per product. See [Metafields](reference/metafields).

## Resolution order on the product page

When your storefront renders a chip, it works down this list and stops at the first hit:

::: steps

### Your saved assignment

If you configured the value, that is what renders. Always. Nothing overrides a deliberate choice.

### The theme's own image for that value

If your theme exposes a photo for the value in its native swatch markup, Varn uses it.

### A color implied by the value name

Varn matches the value against a multilingual color dictionary. "Rouge", "Rot" and "Red" all resolve to red.

### A neutral chip

A plain gray chip, so the value is visible and clickable rather than silently missing.

:::

### The all-blank exception

If **every** value in a group falls all the way through to the neutral chip, six identical gray circles would carry less information than the dropdown they replaced. So in that specific case Varn renders the group as **text pills showing the value names** instead.

This is common on products where the option is called "Color" but the values are not colors at all, for example "metal bottle opener" and "wood bottle opener".

::: note All or nothing
A single blank chip sitting among real colors still renders as a chip. A blank chip there means "not set up yet", which is useful information. The pill fallback only fires when the entire group is blank.
:::

## Resolution order on cards

Cards resolve slightly differently, because a shrunken product photo is often unreadable at chip size:

1. Your saved assignment.
2. A color implied by the value name.
3. The variant's own photo.
4. A neutral chip.

Steps 2 and 3 are swapped compared to the product page, so an unconfigured "Blue" renders as a blue circle rather than a tiny collage. You can force photos with the card image source setting in [Style](style/advanced).

## Sold-out values

A value whose variants are all unavailable always renders with the sold-out mark, and is not clickable. That is correctness rather than styling: it stops a shopper picking something your theme's own control would refuse.

You can change how the mark looks (crossed out, faded, or no marking) in [Sold-out appearance](style/sold-out).

## Translations

If your store is translated, your assignments still apply. Varn stores a position map alongside the values, so the third value in your default language matches the third value in French even though the text differs.

See [Languages](reference/languages).

## What is never stored in an assignment

- prices, inventory or SKU data
- variant IDs
- anything about a shopper

The record is purely presentational. If you delete it, your product returns to your theme's own picker with no other effect.
