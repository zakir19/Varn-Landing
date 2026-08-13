---
title: Collection and search swatches
description: Put a chip row on every product card, so shoppers see the color range before they click.
badge: Growth
---

::: plans growth pro
:::

A shopper scrolling a collection sees one photo per product. If the jacket comes in six colors and the photo is black, five of those colors do not exist as far as that shopper is concerned.

Card swatches fix that with a small chip row under each card.

## Turning it on

::: steps

### Open Style, Global tab

The card settings live on the Global tab because they apply to swatches and variants alike.

### Turn on the master switch

**Show swatches on product cards.** Nothing renders on any card surface while this is off.

### Turn on the surfaces you want

- **Collection pages**
- **Search results**
- **Quick view**, see [Quick view swatches](guides/quick-view)
- **Everywhere else**, for cards on home pages, featured sections and related products

### Read the status line

Under the master switch, Varn states the live result in words: off, plan-gated, on but with no surface selected, or exactly which surfaces are rendering. Three separate conditions have to line up, so the app names the missing one instead of leaving you to guess.

:::

## What card chips do

- **Tap** goes to the product page with that variant preselected.
- **Hover** swaps the card photo to that color, and restores it on leave.
- **Sold out** values are marked.
- **Price** updates on the card where your theme's markup allows it.

They are navigation, not a picker. Adding to cart from a card is your theme's job, and Varn does not build a second path to it.

## Every value renders

There is no "and 4 more" overflow. If a product has nine colors, nine chips render. A value that cannot resolve to a color or a photo gets a neutral chip rather than being dropped, so the count a shopper sees always matches the colors you sell.

## How a card chip picks its look

1. Your saved assignment.
2. A color implied by the value name.
3. The variant's photo.
4. A neutral chip.

Note that steps 2 and 3 are the reverse of the product page. At card chip size a shrunken product photo often reads as a smudge, while a blue circle reads instantly. You can force photos with the card image source setting in [Style, advanced](style/advanced).

## "Everywhere else" and its limitation

Collection, search and product templates expose their products to Liquid, so Varn reads your real assignments straight out of the page with no request.

Other templates do not. There, Varn finds product cards in the DOM and fetches Shopify's own public product JSON per product.

::: warning No metafields on that endpoint
Cards found this way cannot see your assignments. They fall back to the color implied by the value name, then the variant photo, then neutral. If your brand color names are not dictionary colors, those chips will look plainer than the ones on your collection pages.
:::

Requests are same origin, browser cached, deduplicated per product, and hard capped per page. Lazily loaded sections are picked up as they appear, with the watcher disconnecting after a short window so an infinite feed cannot keep fetching forever.

## Styling card chips

Card chips have their own style scope in the [Style studio](style/overview), so you can make them smaller or squarer than product page swatches.

If you leave the card scope untouched, it **follows your product page styling**, so the two never silently disagree. Style the card scope explicitly and it takes over.

## If cards show gray chips

The usual cause is a product configured before some part of your setup changed, or a value with no assignment and a non-dictionary name. Full checklist: [Galleries and cards](troubleshooting/galleries-and-cards).
