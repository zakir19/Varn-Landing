---
title: Sold-out appearance
description: How unavailable colors are marked, and why they are always marked.
---

::: plans free growth pro
:::

A color whose variants are all unavailable is **always** rendered with a sold-out mark and is not clickable. That is not a preference, it is correctness: it stops a shopper choosing something your theme's own control would refuse, which is the wrong-variant bug class Varn is built to avoid.

What you control is how the mark **looks**.

## The three styles

Set this in **Style, Global tab, Sold-out swatches look like**.

| Style | Renders |
| --- | --- |
| **Crossed out** | A diagonal line through the chip. The default, and the clearest. |
| **Faded** | The chip is dimmed. Softer, and still obviously different. |
| **No marking** | The chip renders normally, but stays unclickable. |

You can also set the color of the strike line, so it stays visible against dark chips.

The setting applies to product pages and to [card chips](guides/collection-search) alike.

## Why "no marking" still is not clickable

Because availability is a fact about your inventory, not a style. Making a sold-out value selectable would let a shopper reach a state your theme refuses to serve.

If you want sold-out colors to disappear entirely, that is a merchandising decision best made in Shopify, by unpublishing or removing the variant.

## Why sold-out clicks are worth tracking

::: plans pro
:::

A shopper tapping a sold-out color is the clearest demand signal you will ever get: they wanted it, and you did not have it.

Varn records those clicks (anonymously) and reports them as **sold-out demand** in [Analytics](analytics/overview). It is often the single most actionable number in the app: a restock list written by your own customers.

::: note The click is counted before the block
The tap is recorded, then the selection is refused. The shopper gets correct behaviour and you get the signal.
:::

## Accessibility

The mark is never color alone. A sold-out chip:

- carries the visual mark
- is marked as disabled for assistive technology
- announces its state as part of its accessible name

So a screen reader user hears that the color is unavailable, and a shopper who cannot distinguish a faded chip still cannot select it by accident.
