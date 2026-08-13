---
title: Dashboard tour
description: What every screen in the Varn admin does, and which one you want.
---

The left navigation is ordered by the job you came to do, not by how the app is built.

## Home

The setup guide, your theme status, and quick links. Three steps:

1. **Activate on your theme.** Verified live from your theme every time the page loads, not remembered from a click.
2. **Configure your swatches.** Ticks itself once your store actually has swatch assignments saved. Verified server side, so it survives a new browser or a cleared cache.
3. **Go live and preview.** Self-marked, because there is no honest way for us to know you looked at your storefront, and inventing that signal would be a lie.

## Swatches

The main editor. Decide what each color value looks like: chip, two tone, gradient or photo. See [Your first swatches](getting-started/first-swatches).

## Variants

The photo editor. Decide which product photos belong to each color, and their order. See [Per-color photo galleries](guides/variant-galleries).

::: note Two editors, one record
Both write to the same per-product record. A value can have a swatch and a photo set at the same time, and that is the normal case. See [Swatches vs Variants](concepts/swatches-vs-variants).
:::

## Groups

Show separate products as one swatch row, for stores that list each color as its own product. See [Product grouping](guides/product-grouping).

## Style

The style studio. Shape, size, spacing, labels, borders, effects, sold-out appearance, and which surfaces swatches appear on. Everything is previewed live and saved through Shopify's own save bar. See [Style studio](style/overview).

The master switch at the top, **Show swatches on your storefront**, is the one true off switch. Turning it off renders nothing, anywhere, immediately.

## Analytics

Which colors get clicked, which sold-out colors people still want, and merchandising advice once you have enough data. Pro plan. See [Swatch analytics](analytics/overview).

## Agent readiness

Scores your products on how well an AI shopping agent can understand them, and offers one-click fixes for the gaps. Free to view. See [Agent readiness](agent/overview).

## Plan and billing

Compare plans, see your trial countdown, upgrade or downgrade. Every plan change goes through Shopify's own confirmation page, so you are never charged silently. See [Manage your plan](billing/manage).

## Support

FAQs, video guides, and a direct line to the team.

## Things that are true on every screen

- **Save bars, not save buttons.** Configuration screens use Shopify's context save bar, which appears when you have unsaved changes.
- **Locked features look locked.** A feature your plan does not include renders visibly disabled with the plan named, never as a live control that fails when you press it.
- **Empty, loading and error states exist.** If something cannot load, you get a specific reason, not a spinner forever.
- **Counters show their limit.** Anything with a cap (groups, products per group, the free photo allowance) shows a meter with the number in words as well as color.
