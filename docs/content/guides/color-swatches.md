---
title: Color swatches
description: Solid chips, two tone chips and gradients, and how to pick colors that read well at 40 pixels.
---

::: plans free grow advance premium
:::

A color swatch is a chip filled with a color you choose. It is the fastest kind to set up and the most reliable to read at small sizes.

## Setting one up

::: steps

### Open the Swatches editor

Pick your product, turn on its color option, and continue to **Configure**.

### Choose a type for the value

Each value row has a type control:

- **Color**, one solid fill.
- **Two tone**, a chip split diagonally between two colors.
- **Gradient**, a smooth blend between two colors.

### Pick the color

Use the color field to set the fill. Two tone and gradient show a second field for the other half.

### Save

Press Save. Only the values you actually changed are written. See [Assignments](concepts/assignments).

:::

## When to use each type

| Type | Use it for | Example |
| --- | --- | --- |
| Solid | Anything with one clear color. | Navy, Sand, Forest |
| Two tone | Values that name two colors. | "Black and White", "Navy and Cream" |
| Gradient | Values that describe a transition or a sheen. | Ombre, Iridescent, Holographic |
| [Image](guides/image-swatches) | Patterns, prints and textures where a flat color lies. | Leopard, Plaid, Oak, Marble |

::: tip The 40 pixel test
A swatch is roughly 40 pixels across. If two of your colors are hard to tell apart at that size, they will be impossible on a phone. Nudge one darker or lighter, or turn on labels in [Style](style/appearance) so the name carries the difference.
:::

## Picking colors that work

**Match the product, not the paint chip.** Shoppers compare the swatch to the photo. If your "Olive" photo looks warmer than your "Olive" chip, the chip is wrong even if it matches the fabric spec.

**Keep white and cream distinguishable.** Near-white chips need a border to be visible at all. Varn adds a subtle hairline to the selection ring so a white chip still shows as selected on a white theme, but you can add a visible border for every chip in [Style, appearance](style/appearance).

**Do not rely on color alone.** A shopper with color vision deficiency, or anyone in bright sunlight, needs a second cue. Labels are the simplest one, and the sold-out mark is never color-only for the same reason.

## Letting Varn do the first pass

You do not have to fill these in by hand. [One-click AI setup](guides/ai-setup) matches your option values against a color dictionary in more than ten languages and fills in the confident matches, leaving anything ambiguous for you.

For the whole catalogue at once, use [Auto-configure all products](guides/auto-configure), which is free.

## Editing later

Assignments are just data. Change a color and save, and every surface updates on the next page load: product pages, collection cards, search results and quick view all read the same record.

To remove a value's assignment entirely, clear it and save. That value falls back to your theme's native swatch.
