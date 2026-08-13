---
title: One-click AI setup
description: Two levels of automatic setup: name matching in more than ten languages on Free, and true color detection from photos on Pro.
---

Varn has two kinds of AI setup. Both fill in only values that are **not configured yet**, both leave everything editable, and neither will ever overwrite a decision you made.

| | Reads | Plan |
| --- | --- | --- |
| **One-click AI setup** | Option value names, in more than ten languages. | Free |
| **Full AI setup** | The actual pixels of your product photos. | Pro |

## One-click AI setup (Free)

Press **One-click AI setup** in the Configure step. Varn matches each unconfigured value against a color dictionary and applies the confident matches.

### What it recognises

- Plain color names in English, French, German, Spanish, Italian, Dutch, Portuguese, Danish, Swedish, Norwegian and more: `Rouge`, `Rot`, `Rosso`, `Rood`, `Rojo`.
- Compound names where the color is one of the words: "Midnight Blue", "Forest Green", "Dusty Rose".
- Common non-literal names that have a settled meaning: Charcoal, Ivory, Sand, Camel, Wine, Mint.

### What it deliberately skips

If it is not confident, it does nothing and leaves the value for you. "Assorted", "Print 4", "Summer Edition" and "Multi" stay untouched, because a wrong guess on a product page is worse than a blank.

::: note Word matching, not substring matching
The multilingual dictionary matches whole words only. Substring matching would turn "Assorted" into "sort" and then into black, which is exactly the class of confident-and-wrong result this avoids.
:::

### Doing the whole catalogue

The button above covers one product. For everything at once, use [Auto-configure all products](guides/auto-configure), which runs the same matcher over your entire catalogue and is also free.

## Full AI setup (Pro)

::: plans pro
:::

Full AI setup reads your product photos and extracts the dominant color of the garment itself.

Press **Full AI setup (photos)** for the selected product, or run it across the catalogue from the same panel.

### How the color is chosen

It is not a naive average, which on a white studio shot returns "very light gray" every time. The analysis:

- weights the **centre** of the image, where the product is
- recognises and discounts a **near-white studio background**
- bins similar pixels and clusters neighbouring bins, so a shadow does not split one color into three

### Cost and limits

There are no credits and no per-image fees. Catalogue runs are sequential, cancellable at any time, and capped per run so a huge catalogue cannot run away. Progress is shown while it works.

### When it beats name matching

- Value names that are style codes, "SS24-07".
- Brand color names with no dictionary meaning, "Atelier Rust".
- Any catalogue where names were entered inconsistently.

### When name matching is better

- Values that are already plain color names. Free matching is instant and exact.
- Products photographed on models in busy settings, where the dominant color may be the background.

::: tip A good workflow
Run the free catalogue pass first. It handles most values in seconds. Then run Full AI on whatever is left, and hand-check the results for your best sellers.
:::

## Everything stays editable

Both passes write ordinary assignments. Change any of them by hand, or clear one to fall back to your theme's native swatch. There is no "AI mode" to leave.

## Photos, not just colors

To assign existing product **photos** to colors instead of picking colors, see [AI photo match](guides/ai-photo-match), which is also Pro.
