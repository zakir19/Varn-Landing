---
title: Swatch analytics
description: Which colors shoppers click, which sold-out colors they still want, and what to do about it.
badge: Pro
---

::: plans pro
:::

Your Shopify reports tell you what **sold**. Swatch analytics tells you what shoppers **wanted**, including the colors you could not sell them.

Open **Analytics** in the navigation.

## What is measured

| Metric | Meaning |
| --- | --- |
| **Swatch clicks** | Every time a shopper picks a color. |
| **Add to cart** | Carts attributed to the last color the shopper clicked. |
| **Conversion** | Clicks that led to a cart. |
| **Sold-out clicks** | Picks on a color that was unavailable. |

Choose a **7, 30 or 90 day** window at the top. Data is kept for 90 days and then pruned.

## Top colors by clicks

A ranked table of your colors with a share-of-clicks bar.

It unlocks at **30 swatch clicks**. Below that the table shows a progress line instead, because a five-way tie on one click each is not a ranking, it is noise dressed up as insight.

The stat tiles above stay visible from the very first click, because a raw count is honest at any volume.

## Sold-out demand

The most useful table in the app, and the one that pays for the plan.

Every row is a color shoppers actively tried to buy and could not. It is a restock list written by your own customers, ordered by how many of them wanted it.

::: tip Read it against your reorder cycle
A color with steady sold-out clicks over 90 days is a permanent range gap, not a stockout. A spike in the last 7 days is usually a stockout. The window picker is how you tell them apart.
:::

## Merchandising advice

Once there is enough data, Varn turns the numbers into specific suggestions: restock this, feature that, investigate the other, retire this one. See [Merchandising advice](analytics/merchandising-advice).

## What is not measured

Deliberately, and permanently:

- Nothing about the shopper. No identifiers, no profile, no cross-site anything.
- No cursor tracking, session recording or heatmaps.
- No data sold or shared.

An event is: a kind (click or add to cart), a product handle, an option value, and whether it was sold out. See [Tracking and privacy](analytics/tracking-and-privacy).

## Why Pro only

Analytics is the one feature that stores data on our servers rather than in your Shopify metafields, because a high-volume time series is exactly what metafields cannot do. Free and Growth stores ship the tracker **not at all**: the code never runs and no beacon is ever sent.

## If the dashboard shows zero

Check, in order:

1. Are you on Pro, or inside your 14-day trial?
2. Has anyone visited a product page and clicked a swatch **since** you upgraded?
3. Is the storefront password-protected? Tracking still works for anyone who has entered the password.

There is a **Test tracking** button on the empty state that checks the whole pipeline and reports what it finds in plain words. See [Analytics shows zero](troubleshooting/analytics-zero).
