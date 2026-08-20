---
title: Glossary
description: The words used across these docs and in the app, defined once.
---

## AI setup

The two passes that fill your color values in for you: name matching against a multilingual color dictionary, which is free and unlimited, and a photo pass that sends a photo to a vision model, which spends an AI usage credit. Both run on every plan. See [AI setup](guides/ai-setup).

## AI usage credit

One product photo the AI vision model looks at. Each plan includes a monthly allowance, 250 on Free through 50,000 on Premium, and it resets every month. Nothing else in Varn spends one. See [AI usage credits](billing/ai-credits).

## App embed

The Shopify mechanism that lets an app add code to your storefront without editing theme files. Varn's storefront code is an app embed, which is why it installs and uninstalls cleanly. See [Install and activate](getting-started/install).

## Assignment

The saved record of what one option value looks like: its mode, colors, uploaded image and photo map. See [Assignments](concepts/assignments).

## Card chip

A small swatch on a product card in a collection, search result or other grid. Navigational: tapping it goes to the product with that variant selected. See [Collection and search swatches](guides/collection-search).

## Cover

The first photo in a color's [photo sequence](guides/photo-sequencing), which becomes the main image when that color is selected.

## Entitlement

What your store is currently allowed to use, derived from your subscription or your trial. Checked in the admin, on the server when saving, and again on your storefront.

## Free trial

The first 7 days of any paid plan, granted by Shopify's own subscription billing. Cancel inside those 7 days and you are never billed. The Free plan needs no trial: it has no time limit. See [The free trial](billing/trial).

## Group

Several separate products joined so they render as one swatch row on each other's product pages. See [Product grouping](guides/product-grouping).

## Island

A small block of JSON that the app embed writes into your page so the storefront script has your settings without making a request. See [Storefront reference](reference/storefront-reference).

## Metafield

Shopify's own storage for structured data attached to a shop or a product. All of Varn's configuration lives in metafields, in your store. See [Metafields](reference/metafields).

## Native picker

Your theme's own variant control, the radio inputs or select element. Varn hides it visually and clicks it on the shopper's behalf, never replacing it. See [How Varn works](concepts/how-it-works).

## Native swatches

Swatches your theme draws itself. On product pages Varn detects them and steps aside rather than drawing a second row.

## Option value

One choice within an option: "Sand" within "Color". Assignments are keyed by option value.

## Photo map

The ordered list of product photos belonging to one color. Drives [per-color galleries](guides/variant-galleries).

## Scope

A Shopify permission. See [Permissions and privacy](reference/permissions-privacy).

## Seed

A sensible default Varn shows in an editor, for example a value's variant photo as its chip. Seeds are for display only and are never saved unless you touch them.

## Surface

A kind of page swatches can render on: product page, collection, search, quick view, everywhere else. See [Where swatches appear](concepts/surfaces).

## Swatch

The chip a shopper taps to choose a color. Solid, two tone, gradient or a photo.

## Theme app extension

The Shopify packaging format for storefront code that installs and uninstalls with the app. Varn's entire storefront presence is one of these.

## Value order map

The stored positions that keep your assignments correct when your store is translated and option values differ per language. See [Languages](reference/languages).
