---
title: AI photo match
description: Let Varn work out which of your existing product photos belong to which color.
badge: Pro
---

::: plans pro
:::

[Per-color galleries](guides/variant-galleries) are the highest-impact feature in Varn and the most tedious to set up by hand. AI photo match does the first pass for you, using photos you already have.

## Running it

Open the **Variants** editor, pick a product, and press **AI photo match** in the Configure step.

Varn analyses the product's media and proposes an assignment for each color. Review it, adjust anything you disagree with, and save.

## How it decides

Two passes, in order.

::: steps

### Alt text

If a photo's alt text names a color, that is the strongest signal available and it is used directly. "Aria Tee, Sand" goes to Sand.

This is why the [photo sequencer](guides/photo-sequencing) alt-texts uploads with the product and color name, and why fixing alt text is one of the [agent readiness](agent/fixes) actions. Good alt text pays off in three places at once.

### Dominant color

For photos with no useful alt text, Varn extracts the dominant color of the product in the photo and matches it against your configured colors.

The analysis weights the centre of the frame, discounts a near-white studio background, and clusters similar tones so a shadow does not read as a separate color.

:::

## What it will not do

- It never overwrites a mapping you made by hand.
- It never invents a color that is not one of your option values.
- It leaves photos it cannot place unassigned, rather than guessing. An unassigned photo simply shows for every color, which is today's behaviour.

## Where it struggles

Worth knowing before you trust a run on 400 products:

- **Lifestyle photography.** A model on a beach in a navy swimsuit may be dominated by sand and sky.
- **Flat lays showing several colorways.** They genuinely belong to more than one color, and Varn will pick one.
- **Very similar colors.** Ivory, Cream and Bone will be assigned confidently and sometimes wrongly.
- **Detail shots.** A macro of a zip has no colorway signal.

::: tip Where to check first
Look at products where two colors are close in tone. That is where a wrong assignment shows most, and where fixing it by hand takes ten seconds.
:::

## Cost

No credits, no per-image charge. It is included in Pro. Runs are sequential and cancellable.

## After the run

The result is an ordinary photo map, identical to one you built by hand. Open the [photo picker](guides/photo-sequencing) for any color to adjust the selection, set a different cover, or change the order.

Order is worth a second pass: AI photo match decides **which** photos belong to a color, and it has no opinion about which one should be the cover.
