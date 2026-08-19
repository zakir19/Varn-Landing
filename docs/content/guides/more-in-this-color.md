---
title: More in this color
description: Show other products in the color the shopper just picked, on the product page.
badge: Advance
---

::: plans advance premium
:::

A shopper who picks Sand has told you something specific: they are shopping for Sand. **More in this color** puts a row of other products in that same color right there on the product page, and the row follows their selection.

## Turning it on

**Style, Advance features, More in this color.**

Varn then builds a color index across your catalogue. That is a one-off pass over your products, mapping each one to the colors it comes in.

## What shoppers see

A small row of product chips under the swatches, labelled with the color. Pick a different color and the row updates to match.

Each chip links to that product. It is discovery, not a picker.

## Limits worth knowing

- The color index covers a bounded number of products, so on a very large catalogue it uses the first slice rather than everything.
- Matching is by **color keyword**, not by a visual comparison. Two products both configured as "Sand" match; a product whose value is "Dune" does not, even if the fabric is identical.
- Products with no color-like values never appear in the row.

::: tip Make it work harder
Consistent value naming across your catalogue is what makes this feature good. If the same beige is "Sand" on shirts and "Dune" on trousers, the row cannot connect them. Standardising the names is a one-hour job with a lasting payoff, and it also improves [analytics](analytics/overview) and [agent readiness](agent/overview).
:::

## Rebuilding the index

The index refreshes as your catalogue changes. After a large import or a bulk rename, allow a little time for the row to catch up.

## Where it renders

Product pages only. It does not appear on collection cards, in search or in quick view, where the shopper has not yet made a color choice for it to respond to.

## Related discovery features on Advance and Premium

::: cards
- [Self-optimizing order](analytics/merchandising-advice): {chart} Let popular colors drift to the front of the row.
- [Swatch analytics](analytics/overview): {chart} See which colors shoppers actually click.
- [Product grouping](guides/product-grouping): {users} Join separate products into one swatch row.
:::
