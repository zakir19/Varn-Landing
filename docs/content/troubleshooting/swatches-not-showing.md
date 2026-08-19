---
title: Swatches are not showing
description: The ordered checklist. The first item is the answer roughly nine times out of ten.
---

Work down this list in order and stop when something changes.

## 1. Is the app embed on the theme you are looking at?

Not the theme you activated. The theme your browser is currently rendering.

Open your storefront, open the browser console, and run:

```js
window.Shopify.theme.name
```

More debugging time is lost to this than to everything else combined. Merchants activate the embed on their live theme and then browse an unpublished preview, or activate a staging theme and then check the live site.

If the name is not the theme you activated, use the theme picker in Varn to activate **that** theme. See [Install and activate](getting-started/install).

## 2. Did you press Save in the theme editor?

Toggling the app embed on is not enough. Shopify keeps it as an unsaved draft that no API can see, so Varn will keep reporting "Not activated", correctly.

Reopen the theme editor and check the embed is on, then press **Save**.

## 3. Is the master switch on?

**Style, Show swatches on your storefront**, at the top of the page. With it off, Varn renders nothing anywhere. A warning banner stays visible while it is off.

## 4. Does the product actually have a color option?

Varn only renders for options it recognises as color options: Color, Colour, Couleur, Farbe, Colore, Kleur, Farve.

Open the product in the Swatches editor. If the Options step shows a warning instead of a list, the option name is not recognised. Add your name in [Style, Option names](style/advanced).

## 5. Did you save the product's swatches?

Only values you deliberately configured are written. Open the product in the Swatches editor and check the values show your colors, then press Save.

Remember that an auto-seeded default is **not** saved unless you touched it, by design.

## 6. Is it a paid surface?

If swatches show on product pages but a paid feature is missing, check the plan it needs:

| Missing on | Needs |
| --- | --- |
| Collection pages, search, quick view, other cards | Free on every plan, but the surface toggle in Style, Global must be on |
| The group row | A saved [group](guides/product-grouping); your first group is free |
| More in this color | Advance or Premium |

If a paid feature stopped, your subscription may have lapsed or a [trial](billing/trial) was cancelled. Check the Plan page.

## 7. Is your theme drawing its own swatches?

On product pages, Varn steps aside when your theme already draws native swatches for that option, to avoid a double row. If your theme's own swatches are showing, that is Varn deliberately not competing.

To take over, turn off your theme's swatch setting for that option in the theme editor. See [Duplicate swatches](troubleshooting/duplicates).

## 8. Check the console

On a product page:

```js
window.VarnConfig
```

| Result | Means |
| --- | --- |
| `undefined` | The app embed is not active on this theme. Back to step 1. |
| An object with `enabled: false` | The master switch is off. Step 3. |
| An object with `pro: false` | Your storefront sees a plan below Advance. Check the Plan page. |
| An object that looks right | The config arrived. The problem is in rendering, and it is worth reporting. |

## 9. Single-value options

A product with one color renders as static text on many themes, because there is nothing to select. Varn adds a display-only chip there, but only if you configured that value. Configure it in the Swatches editor.

## Still nothing

[Email support](resources/support) with:

- your store URL and, if the store is password protected, the password
- the theme name from step 1
- a link to a product page that should show swatches
- what `window.VarnConfig` returned

Include the theme name. It is the single most useful line in the message.
