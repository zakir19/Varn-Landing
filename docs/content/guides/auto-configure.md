---
title: Auto-configure your catalogue
description: One button that sets up color swatches across every product in your store, free.
---

::: plans free growth pro
:::

If you sell hundreds of products, configuring them one at a time is not a plan. **Auto-configure all products** runs the color matcher over your whole catalogue in one pass.

## Running it

Open the **Swatches** editor. On the Product step you will see the auto-configure banner. Press it.

Varn works through your catalogue a page at a time and shows live progress:

- products scanned
- products updated
- values configured

You can press **Stop** at any moment. Everything already written stays written, so a stopped run is not a wasted run.

## What it changes, precisely

It is deliberately conservative. On each page of products it:

1. Looks only at options it recognises as **color options**. Size and Material are never touched.
2. Looks only at values with **no assignment yet**.
3. Applies a match **only when confident**, using the same multilingual dictionary as [one-click AI setup](guides/ai-setup).
4. Merges the result into that product's existing record, leaving your manual work alone.

::: note Your decisions always win
A value you configured by hand is never overwritten, on any run, at any time. Auto-configure only ever fills blanks.
:::

## Limits

- The run is capped at a large but finite number of products so it cannot loop forever on a huge catalogue. Run it again to continue.
- Values it is not sure about are skipped, not guessed. Expect leftovers like "Assorted" and "Print 2".
- It configures colors only. It does not map photos, which is a separate job: see [Per-color photo galleries](guides/variant-galleries).

## After the run

::: steps

### Spot-check your best sellers

Open two or three important products in the Swatches editor and look at the values. The matcher is accurate on plain color names, but your brand names are your own.

### Fill in what it skipped

Use the product filters to find products that still have unconfigured values, and set those by hand or with [Full AI setup](guides/ai-setup) on Pro.

### Look at a real product page

The only test that counts. Open a product on your storefront and pick a swatch.

:::

## When to re-run it

- After importing new products.
- After renaming option values.
- After adding a custom option name in [Style, Option names](style/advanced), which can make previously invisible options eligible.

Re-running is safe. It only ever fills blanks.

::: tip Big catalogue, short attention span
The run is server side and page by page, so you can leave the tab open and come back. If you close the tab mid-run, everything written up to that point is already saved.
:::
