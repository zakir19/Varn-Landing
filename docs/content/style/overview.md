---
title: Style studio
description: One place that controls how every swatch looks, on every product and every theme.
---

The Style page is the single source of truth for swatch appearance. Change it once and every product on every theme updates, which is the consistency merchants expect and the reason style is not edited per product.

## The three tabs

| Tab | Controls |
| --- | --- |
| **Swatches** | How swatches look on the product page. |
| **Variants** | Settings specific to variant photo behaviour. |
| **Global** | Settings that affect both, plus which storefront pages swatches render on. |

If you arrive from the Swatches or Variants editor, the page opens on the matching tab and hides the one that is not relevant. Open **Style** from the navigation for the full unscoped view.

## The master switch

At the very top: **Show swatches on your storefront.**

This is the one true off switch. With it off, Varn renders nothing anywhere: no product page swatches, no card chips, no tracking. A warning banner stays visible while it is off so you cannot forget.

::: note Section headers are not switches
Each section header expands and collapses its settings. It is a disclosure, not an on/off. Turning a section closed changes nothing about your storefront.
:::

## The live preview

The panel beside the settings renders a sample swatch row using the exact same renderer as your storefront, with the same CSS. Change a setting and it updates immediately.

The samples are chosen to exercise every control: one selected, one photo, one sold out, and one with no color assigned. That is why the set looks a little odd; each state is there so a setting has something to demonstrate itself on.

Preview equals storefront. If they ever disagree, that is a bug worth [reporting](resources/support).

## Saving

The page uses Shopify's context save bar, which appears when you have unsaved changes. Nothing is written until you press Save.

## What lives where

::: cards
- [Appearance](style/appearance): {sliders} Shape, size, spacing, labels, borders and hover effects.
- [Sold-out appearance](style/sold-out): {swatch} How unavailable colors are marked.
- [Advanced customization](style/advanced): {wand} Option names, per-color overrides, card image source.
- [Custom CSS](style/custom-css): {code} Advance. Your own rules, sanitised.
- [Backups](style/backups): {shield} Snapshots of your configuration with one-tap restore.
:::

## Plan gating

Free covers shape, size, spacing, borders, labels and sold-out styling: everything that shapes the swatches you already have.

The card surfaces are free too. Advance and Premium add hover and selection effects, per-color overrides, custom CSS, the slider layout and the other advanced styling features.

Anything your plan does not include renders **visibly disabled with the plan named**. It is never a live control that fails when you press it. See [Feature matrix](reference/feature-matrix).

## Two things that are not style

- **What a value looks like** (its color or photo) is per product, in the [Swatches editor](guides/color-swatches).
- **Which photos belong to a color** is per product, in the [Variants editor](guides/variant-galleries).

Style controls the shape of the container. The editors control the content.
