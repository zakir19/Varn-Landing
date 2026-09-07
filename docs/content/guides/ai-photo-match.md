---
title: AI photo match
description: Let Varn work out which of your existing product photos belong to which color.
---

::: plans free grow advance premium
:::

[Per-color galleries](guides/variant-galleries) are the highest-impact feature in Varn and the most tedious to set up by hand. AI photo match does the first pass for you, using photos you already have.

It runs on every plan. Only the last of its four passes spends [AI usage credits](billing/ai-credits), one per photo the vision model looks at.

## Running it

Open the **Variants** editor, pick a product, and press **Match photos to variants** in the Configure step. To cover the catalogue instead, use the whole-catalogue run on the Variants list.

Varn analyses the product's media and proposes an assignment for each color. Review it, adjust anything you disagree with, and save.

## How it decides

Four passes, most reliable first. Each one only sees the photos the pass before it could not place.

::: steps

### Gallery order

Shopify returns your media in gallery order, and each variant's featured image marks where that color's photos begin. Everything between two markers belongs to the color before it, and anything before the first marker is treated as shared and shown for every color.

This costs nothing and works whatever your photos are named or colored.

### File name

`sand-front.jpg` names its color. The product title is stripped out first, so a title containing a color word cannot capture the whole gallery.

### Alt text

The same matching. "Aria Tee, Sand" goes to Sand.

This is why the [photo sequencer](guides/photo-sequencing) alt-texts uploads with the product and color name, and why fixing alt text is one of the [agent readiness](agent/fixes) actions. Good alt text pays off in three places at once.

### Vision model

Whatever is still unplaced is sent to a vision model, with your variant photos as the reference for what each color looks like on your products. It reports the color it can see, and Varn files the photo only if it is confident.

This is the only pass that spends credits.

:::

## What it will not do

- It never overwrites a mapping you made by hand.
- It never invents a color that is not one of your option values.
- It leaves photos it cannot place unassigned, rather than guessing. An unassigned photo simply shows for every color, which is today's behaviour.
- It recognises photos that belong to every color, a size chart or a flat lay with several colorways in frame, and shares them rather than filing them under one color.

## Where it struggles

Worth knowing before you trust a run on 400 products:

- **Lifestyle photography.** A model on a beach in a navy swimsuit may be dominated by sand and sky.
- **Very similar colors.** Ivory, Cream and Bone are close enough that a confident answer is sometimes still the wrong one.
- **Detail shots.** A macro of a zip has no colorway signal.

::: tip Where to check first
Look at products where two colors are close in tone. That is where a wrong assignment shows most, and where fixing it by hand takes ten seconds.
:::

## Cost

The first three passes are free and unmetered. The vision pass spends one [AI usage credit](billing/ai-credits) per photo it looks at, out of your plan's monthly allowance: 250 on Starter, 1,500 on Grow, 10,000 on Advance, 25,000 on Premium.

Credits are claimed before the model is called and handed straight back if the call fails, so a failed run does not cost you anything. If the allowance runs out mid-run, Varn finishes with color detection and tells you. Runs are sequential and cancellable.

## After the run

The result is an ordinary photo map, identical to one you built by hand. Open the [photo picker](guides/photo-sequencing) for any color to adjust the selection, set a different cover, or change the order.

Order is worth a second pass: AI photo match decides **which** photos belong to a color, and it has no opinion about which one should be the cover.
