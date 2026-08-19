---
title: One-click fixes
description: Fix alt text and target gender straight from the readiness table.
---

::: plans free grow advance premium
:::

Two of the five [agent readiness](agent/overview) checks can be fixed safely and automatically. The other three are decisions only you can make.

## Fix alt text

Writes descriptive alt text onto the product's images, built from the product title and the color the image belongs to, for example "Aria Tee, Sand".

::: columns
**Why it is safe to automate**

Alt text describing what an image shows is factually correct by construction, and empty alt text helps nobody.

---

**What it improves**

Accessibility for screen reader users, image search, agent comprehension, and Varn's own [Auto Detect photo match](guides/ai-photo-match), which reads alt text first.
:::

You can edit any generated text in the Agent View modal before or after applying.

## Fix target gender

Writes Shopify's own target gender metafield on the product, based on its category and title.

This is the field agents and marketplaces use to filter "men's jackets" from "women's jackets". Without it your product is excluded from a large share of filtered results.

::: note Only where it applies
Target gender is written where the category clearly implies one. A unisex tote or a candle does not get a gender, and the check does not count against those products.
:::

## What is not automated

**Product category.** Shopify's taxonomy drives marketplace listings, feeds, tax treatment in some regions and agent classification. A wrong category is worse than a missing one, so Varn reports it and links you to the product, rather than guessing.

**Size.** Size lives in your variants and option structure. A fix here would mean restructuring your product, which is not something an app should do behind a button.

## Applying fixes

::: steps

### Scan your catalogue

Open Agent readiness and press **Scan more** until you have loaded the products you care about.

### Sort by score

Start with the D grades. The biggest gain is always at the bottom.

### Apply the fix

Press the fix action on a row, or open Agent View to see the detail first. Applying updates the row's score immediately.

### Re-check after big catalogue changes

New products arrive without alt text or gender. Re-scan after an import.

:::

## If a fix fails

You get the actual reason, not a generic error. The usual causes:

- The product was changed in Shopify while the page was open. Reload and retry.
- A transient Shopify API error. Retry.
- Missing permissions, if your install predates a scope change. Reload the app once and Shopify will prompt.

::: tip Do alt text first
It is the cheapest win in the app. It improves accessibility, image SEO, agent readiness and Varn's own photo matching in a single pass.
:::
