---
title: Quick view swatches
description: Swatches inside your theme's quick view and quick add pop-ups.
badge: Growth
---

::: plans growth pro
:::

Many themes offer a quick view or quick add pop-up from a product card. It usually contains a real product form with a real variant picker, which means Varn can enhance it.

## Turning it on

**Style, Global tab, Quick-view swatches.** It sits with the other card surfaces because it is reached from a card.

## How it works

Quick view content is injected into the page after it loads, so it cannot be prepared in advance. Varn watches for an injected product form and enhances it with the assignments of the product that was actually opened, not the product page you happen to be standing on.

## The deliberate difference from the product page

On a product page, if your theme already draws its own native swatches for an option, Varn steps aside rather than drawing a second row.

In quick view, Varn enhances **anyway**.

The reason: you switched quick view swatches on explicitly, and merchants who did that were reporting "the swatch is not visible in quick view" because the deferral was hiding it. An explicit opt-in beats an automatic politeness rule.

If that produces a double row in your theme's pop-up, turn quick view swatches off, or [tell us the theme](resources/support) so we can teach Varn about it.

## What works and what does not

| | |
| --- | --- |
| Swatches replace the pop-up's picker | Yes |
| Selection drives the pop-up's own form | Yes |
| Price and availability update | Yes, through your theme |
| Add to cart from the pop-up | Yes, your theme's button, untouched |
| Per-color gallery filtering | Product page only |
| Analytics tracking of the click | Yes on Pro |

## Themes without quick view

Nothing to do, and no cost. If no injected form ever appears, the watcher simply never fires.

## Card chips vs quick view

They solve different problems and pair well:

- **[Card chips](guides/collection-search)** show the color range at a glance while scrolling.
- **Quick view swatches** let a shopper commit to a color without leaving the collection.

Turning both on is the normal configuration.
