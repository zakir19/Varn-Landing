---
title: Theme compatibility
description: What Varn needs from a theme, which ones are known good, and how theme quirks are handled.
---

Varn works with any theme that renders a normal Shopify variant picker, which is nearly all of them.

## What Varn needs

Exactly one thing: **a real variant control in the product form.** A set of radio inputs, or a select element, that your theme listens to.

If your theme has that, Varn can enhance it. If it does not, for example a fully custom picker built in JavaScript with no underlying input, Varn will leave the page alone rather than guess.

## Known good

| Theme | Notes |
| --- | --- |
| **Dawn** and the free Shopify themes | Fully supported, including the asynchronous picker re-render. |
| **Horizon** | Fully supported, including its background-style swatches, its single-value static text rendering, and its slide-wrapped gallery. |
| Paid themes built on Dawn patterns | Generally work without changes. |

## Theme behaviours Varn handles

These are the quirks that generate most of the engineering work in the storefront engine. You should not have to care about them, but if you are debugging, this is what is going on.

**Asynchronous picker re-render.** Dawn-family themes rebuild the variant picker on every change, and briefly keep both the old and new picker in the page. Varn watches for both the insert and the removal, and deduplicates by value so you never see two chips for one color or a flash of the native dropdown.

**Swatches drawn as background styles.** Horizon renders its native swatch as an element with an inline background property rather than an image tag. Varn reads those, so photo-based options are detected correctly.

**Availability marked without `disabled`.** Some themes keep unavailable options focusable and mark them with ARIA attributes instead. Varn checks those too, so sold-out marking and click blocking stay correct.

**Single-value options rendered as static text.** With one color, some themes render a label instead of a control. Varn adds a display-only chip there, never a fake radio, because there is nothing to select.

**Galleries that hide variant photos by CSS class.** If your theme has a "hide variant images" setting, a photo you deliberately mapped can be hidden by class. Varn forces those visible, copying the layout style of a photo that is already showing.

**Media modals and duplicated galleries.** Themes often repeat the same photo IDs in a lightbox and a mobile gallery. Varn orders each container independently rather than refusing to order at all.

**Themes with their own native swatches.** On the product page Varn detects them and steps aside instead of drawing a second row. See [Duplicate swatches](troubleshooting/duplicates).

## Working on an unpublished theme

Use the theme picker to activate the embed on any theme, published or not. Activation lives in that theme's settings, so it travels with the theme when you publish. See [Install and activate](getting-started/install).

## Theme updates

Because Varn adds nothing to your theme files, updating your theme cannot break Varn and Varn cannot block your update. The app embed setting lives in the theme's settings, so check it is still on after a major update.

## If your theme is not supported

[Email support](resources/support) with:

- your store URL
- the theme name and version, which `window.Shopify.theme` in your browser console will tell you
- a link to a product page showing the problem
- a screenshot

Most theme reports are fixed in the storefront engine, which means the fix reaches every merchant on that theme. Naming the theme is the single most useful thing you can include.

::: tip Check which theme you are actually looking at
More debugging time is lost to this than to anything else. A merchant activates the embed on their live theme and then browses an unpublished preview, or the reverse. `window.Shopify.theme.name` in the console settles it in one step.
:::
