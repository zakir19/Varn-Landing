---
title: Languages
description: The 18 storefront languages Varn ships, how translated stores are handled, and why the admin is English.
---

## Storefront languages

Every string Varn renders on your storefront ships in 18 languages and follows your store's active locale automatically. There is nothing to configure.

```text
English    French     German     Spanish    Italian
Dutch      Danish     Finnish    Norwegian  Swedish
Polish     Turkish    Portuguese (BR)       Portuguese (PT)
Japanese   Korean     Chinese (Simplified)  Chinese (Traditional)
```

Translated strings cover accessible labels, the caption row, sold-out announcements, the group row heading and the "more in this color" heading. Your own option values are never translated by Varn: they come from your product data, which Shopify translates for you.

## Translated stores and your assignments

This is the subtle part, and Varn handles it for you.

If you use Shopify's translation features, your option values differ per language. "Red" is "Rouge" in French. A naive app keyed on the text would lose every assignment in every language but the default.

Varn stores a **position map** alongside your assignments, so the third value in your default language is understood to be the third value in French. Your swatches render correctly in every language with no extra setup and no duplicate configuration.

## The color dictionary is multilingual

[One-click Auto Detect setup](guides/ai-setup) matches values against a color dictionary in more than ten languages, so `Rouge`, `Rot`, `Rosso`, `Rojo` and `Rood` all resolve to red.

Matching is whole-word only. Substring matching would turn "Assorted" into "sort" and then into black, which is exactly the confident-and-wrong result the app avoids.

## Recognised color option names

Varn recognises these option names out of the box:

```text
Color, Colour, Couleur, Farbe, Colore, Kleur, Farve
```

If your store uses another word, add it in [Style, Option names](style/advanced). It is a store-wide setting you configure once.

## Right-to-left

The storefront styles use logical CSS properties throughout, so swatch rows, labels, spacing and slider arrows all mirror correctly in right-to-left locales.

## The admin is English

The Varn admin interface is English only, deliberately and honestly. Half-translating an admin produces a worse experience than a consistent one, so the app is consistent English until a full translation pass is done properly.

This is why our App Store listing lists English as the only language: the storefront translations are described in the listing text rather than claimed in the languages field, because that field describes the admin.

## Missing or wrong translation

If a storefront string reads badly in your language, [tell us](resources/support) with the language and the string. Translations are data files, so a correction ships quickly and reaches every store in that language.
