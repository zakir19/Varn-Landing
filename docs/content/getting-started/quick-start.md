---
title: Quick start
description: From install to live swatches in about two minutes, using the setup guide on your dashboard.
---

This is the fastest honest path from a fresh install to swatches on your storefront. Every step here matches a step in the app's own setup guide, so you can follow either.

::: note Before you start
You need a Shopify store you can edit, and at least one product with a color option. If you do not have one yet, skip to step 3 and use [Auto-configure all products](guides/auto-configure) once you do.
:::

::: steps

### Install Varn

Add the app from the [Shopify App Store listing](https://apps.shopify.com/varn-variants-swatches-ai) and approve the permissions. You land on the Varn dashboard with a three-step setup guide.

You start on Starter, which has no time limit. Every paid plan is [free for 7 days](billing/trial).

### Activate the app embed on your theme

Nothing renders on your storefront until the app embed is switched on. This is a Shopify requirement for every app that touches the storefront, and it is a once-per-theme job.

Click **Activate on your theme**. Varn opens a theme picker listing every theme in your store with its current status, so you can activate an unpublished theme you are still building as well as the live one.

In the theme editor that opens, the Varn embed is already selected. Toggle it on and press **Save**.

Come back to the app tab. Varn re-checks automatically when the window regains focus, and the step turns green.

::: warning If the status says "unknown"
That means Varn could not read the theme, not that the embed is off. Press **Re-check status**. See [Install and activate](getting-started/install#status-says-unknown).
:::

### Pick a product

Open **Swatches** in the left navigation and choose a product from the table. Search by title, or use the filters to jump to products that are not configured yet.

Varn only lists options it recognises as color options: Color, Colour, Couleur, Farbe, Colore, Kleur, Farve. If your color option is called something else, add its name in [Style, Option names](style/advanced#option-names).

### Let AI setup do the first pass

Press **One-click AI setup**. Varn matches each option value against a multilingual color dictionary and fills in the confident matches only. "Midnight Blue" becomes navy, "Assorted" is left alone for you to decide.

Everything it does is a normal, editable assignment. Change any value by hand, upload a photo instead, or use a two tone chip for something like "Black and White".

Read more in [AI setup](guides/ai-setup).

### Save and look at your storefront

Press **Save**. Open the product on your storefront and pick a swatch.

You should see the chips replace the dropdown, the selected chip take a ring, and the main image swap to the photo for that color if you have one.

:::

## What to do next

::: cards
- [Configure the rest of your catalogue](guides/auto-configure): {wand} One button, whole catalogue, free.
- [Style your swatches](style/overview): {sliders} Shape, size, labels and effects, previewed live.
- [Map photos to colors](guides/variant-galleries): {image} Show only the photos that match the chosen color.
- [Put swatches on collection pages](guides/collection-search): {globe} Free on every plan, one toggle.
:::

## If nothing appeared

Work through these in order. In practice the first one is the answer about nine times out of ten.

1. **Is the app embed on the theme you are actually looking at?** Not the theme you activated, the one your browser is showing. `window.Shopify.theme.name` in the browser console will tell you.
2. **Did you press Save in the theme editor?** Toggling the embed is not enough on its own.
3. **Does the product have a color option with more than one value?** A single-value option renders as static text on most themes, and Varn handles that separately.
4. **Is the master switch on?** Style, "Show swatches on your storefront", at the top of the page.

Full checklist: [Swatches are not showing](troubleshooting/swatches-not-showing).
