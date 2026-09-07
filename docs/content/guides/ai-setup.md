---
title: AI setup
description: Two passes that fill your colors in for you: name matching in more than ten languages, free and unlimited, then a vision model that reads the photo itself.
---

AI setup fills in the color values you have not configured yet. Both passes leave everything editable, and neither will ever overwrite a decision you made.

| | Reads | Plan | Cost |
| --- | --- | --- | --- |
| **One-click AI setup** | Option value names, in more than ten languages. | Every plan | Free, unlimited |
| **The photo pass** | Your product photos, through a vision model. | Every plan | 1 [AI usage credit](billing/ai-credits) per photo |

::: note There is no plan gate on AI setup
Both passes run on every plan, Starter included. What differs between plans is the monthly [AI usage credit](billing/ai-credits) allowance the photo pass spends: 250 on Starter, 1,500 on Grow, 10,000 on Advance and 25,000 on Premium.
:::

## One-click AI setup

Press **One-click AI setup** in the Configure step of the Swatches editor. Varn matches each unconfigured value against a color dictionary and applies the confident matches. It costs nothing and it is not metered.

### What it recognises

- Plain color names in English, French, German, Spanish, Italian, Dutch, Portuguese, Danish, Swedish, Norwegian and more: `Rouge`, `Rot`, `Rosso`, `Rood`, `Rojo`.
- Compound names where the color is one of the words: "Midnight Blue", "Forest Green", "Dusty Rose".
- Names where the words together mean something different from either word: "Rose Gold" is rose gold, not pink.
- Light and dark modifiers, so "Light Blue" and "Dark Blue" do not resolve to the same swatch.
- Two-tone values written with a separator: "Black / White" becomes a split swatch.
- Common non-literal names that have a settled meaning: Charcoal, Ivory, Sand, Camel, Wine, Mint, Brass, Oak.

### What it deliberately skips

If it is not confident, it does nothing and leaves the value for you. "Assorted", "Print 4", "Summer Edition" and "Multi" stay untouched, because a wrong guess on a product page is worse than a blank.

::: note Word matching, not substring matching
The multilingual dictionary matches whole words only. Substring matching would turn "Assorted" into "sort" and then into black, which is exactly the class of confident-and-wrong result this avoids.
:::

### Doing the whole catalogue

The button above covers one product. For everything at once, use [Auto-configure all products](guides/auto-configure), which runs the same matcher over your entire catalogue and is also free and unmetered.

## The photo pass

Some values a name can never answer: style codes like "SS24-07", brand names like "Atelier Rust", or a catalogue where names were entered inconsistently. For those, Varn looks at the photo.

### How the color is decided

Varn works through four tiers, most reliable first, and only pays for the last one.

::: steps

### Gallery order

Shopify returns product media in gallery order, and each variant's featured image marks where that color's photos start. Photos between two of those markers belong to the color before them. No color maths at all, and no credits.

### File name

`blue-front.jpg` names its own color. The product title is stripped out first, so `midnight-blue-maxi-dress-red.jpg` resolves to Red, never to the Blue in the title.

### Alt text

The same matching, with the same title strip. This is why the [photo sequencer](guides/photo-sequencing) alt-texts uploads with the product and color name, and why fixing alt text is one of the [agent readiness](agent/fixes) actions.

### Vision model

Only for the photos nothing above could place. Varn sends the photo to a vision model with your own variant photos as reference, and it reports the color it can actually see. This is the pass that spends credits, one per photo.

:::

The vision pass exists because pixel averaging is not enough on real catalogues. On a mostly-black bottle with a blue lid, the dominant color is black for every variant, so an average tells you nothing. A model looking at the product says "that is the blue one".

### If you run out of credits

Nothing breaks. Varn falls back to color detection for the rest of the run, tells you the allowance is used up, and the count resets at the start of the next month. See [AI usage credits](billing/ai-credits).

## Everything stays editable

Both passes write ordinary assignments. Change any of them by hand, or clear one to fall back to your theme's native swatch. There is no "AI mode" to leave.

## Photos, not just colors

To assign your existing product **photos** to colors, rather than picking a color for each value, see [AI photo match](guides/ai-photo-match).
