---
title: Frequently asked questions
description: The things merchants ask first, answered short.
---

## Getting started

::: faq
### What is Varn?

Varn turns your product variants into color and image swatches, with one-click AI setup for your whole catalogue. See [Introduction](getting-started/introduction).

### How do I get started?

Two steps: activate the app embed on your theme, then run one-click AI setup. The dashboard guide walks you through both. See [Quick start](getting-started/quick-start).

### Is the free plan really free?

Yes. $0 with no time limit. Unlimited color swatches, card surfaces and agent readiness, permanently. See [Plans](billing/plans).

### Do I need a developer?

No. Everything is a toggle in the app plus one switch in your theme editor. No code, no theme edits.

### Will it work with my theme?

Almost certainly. Varn needs a normal variant picker, which nearly every theme has. See [Theme compatibility](reference/themes).
:::

## Setup

::: faq
### How do I activate the app on my theme?

Click **Activate on your theme** in the setup guide, toggle the embed on, and press Save. Once per theme. See [Install and activate](getting-started/install).

### Can I set it up on an unpublished theme?

Yes. The theme picker lists every theme and deep-links into the right one. Activation travels with the theme when you publish.

### What does one-click AI setup do?

It reads your option value names in more than ten languages and configures the confident matches, leaving anything ambiguous for you. When a name is not a color, the photo pass looks at the product photo itself. Both run on every plan; the photo pass spends [AI usage credits](billing/ai-credits). See [AI setup](guides/ai-setup).

### Does it leave code behind when I uninstall?

No. All storefront code is a theme app extension, which Shopify removes for you. Nothing is left in your theme files.

### Will it slow my store down?

Under 10 KB of gzipped JavaScript, deferred, with zero network requests to render. See [Performance](reference/performance).
:::

## Swatches and variants

::: faq
### What is the difference between color and image swatches?

A color swatch shows a color chip. An image swatch shows a real photo, which is what you want for prints, patterns and textures. Both are free on product pages.

### Can the main image change when a swatch is picked?

Yes. Selecting a swatch commits its image, and Varn holds it through your theme's own re-render. Showing multiple photos per color is [per-color galleries](guides/variant-galleries).

### How are sold-out variants shown?

Crossed out by default, and not clickable. You can change how the mark looks in [Style](style/sold-out), but sold-out values always stay unselectable.

### Can swatches show on collection pages?

Yes, on every plan including Free, along with search results and quick view. See [Collection and search swatches](guides/collection-search).

### My color option is called "Shade". Will it work?

Add "Shade" to the recognised option names in [Style, advanced](style/advanced). It is a store-wide setting you configure once.

### Can I use swatches for Size?

No, and deliberately. A swatch is a visual stand-in for a color, and rendering sizes as identical circles is worse than the control your theme already has.
:::

## Pricing and billing

::: faq
### What do the paid plans add?

Grow ($14.99/mo) raises the variant-image limit to 150 products, grouping to 5 groups and [AI credits](billing/ai-credits) to 1,500 a month. Advance ($39.99/mo) adds advanced styling and analytics. Premium ($69.99/mo) carries the highest limits: unlimited variant-image products, 50 groups and 50,000 credits. See [Plans](billing/plans).

### How does the free trial work?

Every paid plan is free for 7 days, through Shopify's own confirmation screen. Cancel during the trial and you are never billed; otherwise the plan simply continues. See [The trial](billing/trial).

### Is there a discount for paying yearly?

Yes: Grow $129/yr instead of $179.88, Advance $339/yr instead of $479.88, Premium $599/yr instead of $839.88.

### What happens to my setup if I downgrade?

Nothing is deleted. Features above your plan stop rendering and come straight back if you subscribe again.

### How am I charged?

Through Shopify's own app billing, on your regular Shopify invoice. Varn never sees your payment details, and uninstalling cancels the subscription automatically.
:::

## Troubleshooting

::: faq
### Swatches are not showing on my storefront.

Usually the app embed is not activated on the theme you are actually browsing. Full checklist: [Swatches are not showing](troubleshooting/swatches-not-showing).

### I see double or misaligned swatches.

Your theme is probably drawing its own swatches too. Keep one source. See [Duplicate swatches](troubleshooting/duplicates).

### My analytics dashboard shows zero.

Analytics is on Advance and Premium and needs a real storefront click after you upgraded. There is a Test tracking button that checks the whole pipeline. See [Analytics shows zero](troubleshooting/analytics-zero).

### A swatch shows a photo of a different product.

That photo is attached to that variant in Shopify, and Varn renders what the variant carries. Upload a swatch image, switch the value to Color, or fix the variant media.

### How fast is support?

Typically within 24 hours, on every plan. [Email support@enstacked.com](mailto:support@enstacked.com).
:::
