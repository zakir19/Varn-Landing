---
title: Performance
description: The byte budget, the request count, and what Varn does to protect your Core Web Vitals.
---

Swatch apps sit on your most valuable page. This is what Varn costs you, measured rather than claimed.

## The numbers

| | |
| --- | --- |
| Core storefront JavaScript | under 10 KB gzipped |
| Extras chunk, only when needed | under 7 KB gzipped |
| Storefront CSS | about 5 KB gzipped |
| Network requests to render swatches | **zero** |
| Theme files edited | zero |
| Render-blocking resources added | zero |

## Zero requests, and why

Your settings are read from Shopify metafields **in Liquid**, while your page is being built, and written into the HTML. By the time the browser runs Varn's script, everything it needs is already in the page.

There is no API call, no round trip to our servers and no third party connection. If our servers went down, your swatches would keep rendering.

## The byte budget is enforced

Under 10 KB gzipped per chunk is not an aspiration, it is a build-time check. A change that pushes a chunk over the limit fails the build, and the fix is to split the code or move a feature into the optional chunk, never to raise the limit.

That is why the engine is split in two:

| Chunk | Contains | Downloaded |
| --- | --- | --- |
| **Core** | Product page swatches, selection, hover, gallery filtering, styling. | Always |
| **Extras** | Card chips, quick view, product groups, more in this color, analytics. | Only when a feature that needs it is switched on |

A Free-plan store downloads the core chunk only. The extras chunk is not disabled code sitting in your page, it is absent.

## Both scripts are deferred

Nothing Varn adds blocks your page from rendering or delays first paint.

## Layout stability

Cumulative Layout Shift is the metric a swatch app is most likely to damage, because it inserts elements into a page that has already been laid out. Varn protects it by:

- reserving the swatch row's height before painting the chips
- clamping labels to a bounded height by default, so a long value name cannot change the row height
- giving every labelled chip cell a uniform width, so wrapped rows do not reflow
- animating only `transform` and `opacity`, never layout properties

## Interaction

Selecting a swatch clicks your theme's own input. The work Varn does on that click is trivial; the time you observe is your theme responding, exactly as it does when someone uses the dropdown.

## Images

- Swatch chips request a small, correctly sized version from Shopify's CDN, not your full-resolution photo.
- The gallery swap requests an appropriately sized image for the main view.
- Uploaded swatch images are stored as CDN URLs, so your metafields stay tiny regardless of image quality.

## The card-fetch exception

The one place Varn makes requests is ["cards everywhere"](guides/collection-search) on templates that cannot expose their products to Liquid. There it fetches Shopify's own public product JSON.

Those requests are same origin, cached by the browser, deduplicated per product, hard capped per page, and only happen when you have switched that surface on. Cards on collection, search and product templates make no requests at all.

## The admin side

The Varn admin is also built to Shopify's Built for Shopify performance bar:

- Slow reads are streamed rather than blocking the page, so content paints immediately.
- Every screen paints real text before the interface loads, rather than showing a spinner.
- Large tables page rather than growing without limit.
- Heavy interface code loads only when the feature that needs it is opened.

## Measuring it yourself

::: steps

### Run Lighthouse before and after

Test a product page with the app embed off, then on. The honest comparison is same page, same connection, back to back.

### Check the request waterfall

Filter your browser's network panel to the product page load. You should see the two Varn assets from Shopify's CDN and nothing else.

### Watch for layout shift

Enable layout shift regions in your browser dev tools and reload. The swatch row should not move anything.

:::

::: note Where numbers come from
Shopify's own Web Vitals report in your Partner or store dashboard is the number that matters, and it uses real visitor data over 28 days. A single Lighthouse run on your laptop is a useful smoke test, not a verdict.
:::
