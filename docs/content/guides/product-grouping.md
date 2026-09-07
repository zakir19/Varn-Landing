---
title: Product grouping
description: Show separate products as one swatch row, for stores that list every color as its own product.
---

::: plans free grow advance premium
:::

Plenty of stores list each color as a separate product: "Aria Tee, Red", "Aria Tee, Blue", "Aria Tee, Sand". Shoppers land on one of them and never find out the other two exist.

A **group** joins those products into one swatch row on each of their product pages.

## Limits by plan

| Plan | Groups |
| --- | --- |
| Starter | 1 |
| Grow | Up to 5 |
| Advance | Up to 15 |
| Premium | Up to 50 |

The Groups page shows a meter for groups used and products per group, so you always know where you stand.

## Building a group

::: steps

### Create a group

Press **Create group**. It starts unnamed, because naming it is genuinely step one.

### Name it

The name is shown to shoppers above the row, for example "Also in".

### Add products

Search and tick the products that belong together, then **Add selected**. Each row shows a thumbnail, the title, and the color Varn detected from it.

If a product is already in another group, its row shows a conflict badge with a **Move here** action. That removes it from the other group and tells you what happened, so a product can never silently sit in two groups.

### Put them in order

Order is load-bearing: the order of the members is the order of the swatches shoppers see. Drag rows, or use the up and down controls, and watch the preview strip under the group update.

### Save

:::

## Let Varn suggest groups

Press **Find groups for me**. Varn clusters product titles that differ only by a color-like suffix, for example "Aria Tee, Red" and "Aria Tee, Blue".

Each suggestion is a reviewable card with three choices:

- **Add** the group as proposed
- **Add and edit** to open it straight away
- **Not a group** to dismiss it

There is also **Add all**, which respects your plan limit and tells you how many it could take.

## What shoppers see

On each member's product page, a row of chips appears with the group's name, positioned right after the swatch row (or just before the buy buttons if the product has no swatch row). Tapping a chip goes to that product.

Each chip resolves its color from the member's own photo, then from its label, then to a neutral chip, the same discipline as everywhere else.

## Why the member list is stored expanded

The group stores each member's title, handle, label and image directly, rather than just an ID. That way your product page renders the whole row from a single read, with no extra product lookups and no additional requests.

The cost is that if you rename a product, the group keeps the old label until you re-save the group. That is a deliberate trade: a fast product page beats an always-fresh label.

## Grouping vs variants

If your colors are **variants of one product**, you do not want groups. You want ordinary [swatches](guides/color-swatches), which are free.

Groups exist specifically for the separate-products case. If you are choosing an architecture from scratch, variants are almost always better for SEO, inventory and reporting, and grouping is the tool for when that ship has sailed.
