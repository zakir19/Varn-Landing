---
title: Agent readiness
description: How well AI shopping agents can understand your products, scored, with the gaps named.
---

::: plans free grow advance premium
:::

A growing share of shopping starts with an AI assistant rather than a search box. Those agents read structured product data, and they are unforgiving: if your product does not clearly state its color, category and gender, it does not get recommended.

**Agent readiness** scores your catalogue on exactly that, and it is free to view.

Open **Agent readiness** in the navigation.

## The score

Each product scores out of 100 across five checks:

| Check | Weight | What it looks for |
| --- | --- | --- |
| **Category** | 30 | A product category an agent can map to a taxonomy. |
| **Color** | 25 | A machine-readable color, not just a marketing name. |
| **Size** | 15 | Size information where it applies. |
| **Gender** | 15 | A target gender where the category implies one. |
| **Alt text** | 15 | Images that describe what they show. |

Scores roll up to grades A to D. The overview shows your average score and how your catalogue is distributed across grades, so you can see whether you have a few bad products or a systemic gap.

## Agent View

Press **Agent View** on any product row to see what an AI agent sees when it reads that product: the fields it can extract, and the ones marked **Missing**, each with a plain-language note on why it matters.

It is the quickest way to understand the score, because the gap is usually obvious once it is named.

## Fixing the gaps

::: plans free grow advance premium
:::

Every plan, including Free, has one-click fixes for the two gaps that are safe to fix automatically:

- **Alt text**, generated from the product and color.
- **Target gender**, written to Shopify's own product metafield.

See [One-click fixes](agent/fixes).

Category is deliberately guidance only. Assigning a product taxonomy is a merchandising decision with real consequences for your feeds and marketplaces, so Varn tells you it is missing and leaves the choice to you.

## How Varn improves your score without you doing anything

Some of this comes free with normal use:

- Configuring [color swatches](guides/color-swatches) gives every value a real color, which is the color check.
- Uploading through the [photo sequencer](guides/photo-sequencing) alt-texts images with the product and color name.
- Turning on **structured data** in [Style, advanced](style/advanced) emits product group markup describing your color range as one product family.

## Why this is in a swatch app

Because a swatch app already knows the answer to the hardest question, which is what color each variant actually is. Once that is written down properly, the same data serves shoppers, search engines and agents.

## Scanning your catalogue

The table pages through your products 25 at a time. Press **Scan more** to load the next page. The overview statistics cover everything scanned so far, not just the visible page.
