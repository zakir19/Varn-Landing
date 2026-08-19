---
title: Swatches vs Variants
description: Two editors, one record. Which one you want, and why they are separate.
---

Varn has two editors and new merchants sometimes open the wrong one. The split is simple:

::: columns
**Swatches**

Answers "what does the chip for **Blue** look like?"

A solid color, a two tone chip, a gradient, or an uploaded photo.

Free on unlimited products.

[Open the guide](guides/color-swatches)

---

**Variants**

Answers "which of my product photos belong to **Blue**, and in what order?"

Picks from the product's existing media and sets the sequence, including which one is the cover.

Free for your first 5 products; paid plans raise the limit.

[Open the guide](guides/variant-galleries)
:::

## They write to the same record

Both editors save into the same per-product metafield. A value can carry a chip and a photo map at once, and that is the normal, good configuration:

- the **chip** is what the shopper taps
- the **photo map** is what the gallery shows once they do

Because both write the same record, both apply the same plan checks server side. You cannot use one editor to sneak past a limit in the other.

## Which one do I want?

| You want to... | Editor |
| --- | --- |
| Make "Sand" render as a beige circle | Swatches |
| Make "Leopard" render as a photo of the print | Swatches |
| Show only the 3 photos of the red version when red is picked | Variants |
| Change which photo is the cover for a color | Variants |
| Add a new photo to the product from inside Varn | Variants |
| Let Auto Detect guess colors from value names | Swatches |
| Let Auto Detect assign existing photos to colors | Variants |

## Why two editors and not one screen

Two reasons, both learned the hard way.

**They are different jobs at different moments.** Setting up chips is a fast pass over the whole catalogue. Mapping photos is careful, per-product work you do for your hero products. Putting them on one screen made the fast job slow.

**Saving scope.** Each editor saves only what it owns. A per-product photo save can never clobber a chip you set five minutes ago, and neither can overwrite your global style. Keeping the write scopes separate is what prevents that class of data loss.

## The shared safety rule

Both editors apply the same rule when saving: **only deliberate choices are written**.

Both seed sensible defaults so the screen is useful the moment you open it, for example showing a value's variant photo as its chip. But an untouched default is dropped at save time. Only the values you actually changed end up in your storefront data.

That is why a value you never touched keeps using your theme's own native swatch instead of quietly inheriting something you did not pick.
