---
title: How Varn works
description: The architecture, in plain terms: a theme app extension, your theme's own picker, and zero extra network requests.
---

Understanding this page makes every other page obvious, and it answers most "is this safe to install" questions before you have to ask them.

## Varn drives your theme's picker

Your theme already has a variant picker: a set of radio inputs, or a select element. That control is what your theme listens to for price updates, gallery changes and the add to cart button.

Varn does not replace it. Varn:

1. Finds it.
2. Hides it visually.
3. Renders a row of swatches next to it.
4. When a shopper taps a swatch, **clicks the matching native input**.

From your theme's point of view, a shopper used the dropdown. Price, gallery, availability and cart all update through your theme's own code, exactly as they always did.

::: tip Why this matters
The single worst bug class in swatch apps is "the shopper picked red and blue went into the cart". It happens when an app builds its own variant resolution and drifts out of sync with the theme. Varn structurally cannot do that, because it never resolves a variant.
:::

## Everything storefront-side is a theme app extension

Varn's storefront code ships as a Shopify **theme app extension** with an app embed block. That has three consequences you care about:

- **No theme files are edited.** Nothing is injected into `theme.liquid` and nothing is left behind on uninstall.
- **No script tags.** Script tags are blocked for new apps and are the usual reason an uninstalled app keeps slowing a store down.
- **Shopify controls the lifecycle.** Install adds it, uninstall removes it. You are never left cleaning up.

## Your settings travel as HTML, not as a request

When your product page renders, the app embed reads your saved settings straight out of Shopify metafields in Liquid and writes them into the page as a small block of data.

The result: **Varn makes zero network requests to render swatches.** No API call, no waiting on our servers, no third party connection from your storefront. If our servers were offline, your swatches would still render.

The only exceptions are optional and specific:

- **Analytics** sends one small anonymous beacon after a click, on Advance and Premium only. See [Tracking and privacy](analytics/tracking-and-privacy).
- **Cards everywhere** may fetch Shopify's own public product JSON for product cards it cannot read from Liquid. Same origin, browser cached, hard capped. See [Collection and search swatches](guides/collection-search).

## Two JavaScript files, both tiny

| File | Contains | Loaded when |
| --- | --- | --- |
| **Core** | Product page swatches, selection, hover, the gallery filter, style variables. | Always. |
| **Extras** | Collection and search card chips, quick view, product groups, more in this color, the analytics tracker. | Only when a feature that needs it is on. |

Both are under 10 KB gzipped and both are deferred, so they never block your page from rendering. A store on Starter downloads the core file only. See [Performance](reference/performance).

## Progressive enhancement, all the way down

If the JavaScript fails to load, is blocked, or a theme does something unexpected, the native picker is still there and still works. Varn hides it only after it has successfully built the swatch row to replace it.

## It re-renders when your theme re-renders

Modern themes rebuild the variant picker every time the selection changes, often asynchronously. Varn watches for that and re-applies itself, including the case where the theme keeps the old picker in the DOM for half a second during a transition.

This is the source of most theme-specific bug reports and most of the engineering in the storefront engine. If you see swatches flash back to a dropdown, that is this mechanism failing on an unusual theme, and it is worth [telling us](resources/support) which theme.

## Where your data lives

All configuration is stored in Shopify metafields, on your shop and on individual products, in a plain namespace your theme can read. Nothing about your catalogue is copied to our servers.

The one exception is analytics, which stores anonymous click counts in our database because a time series is exactly what metafields cannot do. See [Metafields](reference/metafields) and [Permissions and privacy](reference/permissions-privacy).
