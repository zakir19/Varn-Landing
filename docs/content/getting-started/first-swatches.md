---
title: Your first swatches
description: A guided pass through the Swatches editor, from picking a product to what actually gets saved.
---

The Swatches editor is a five step wizard. It remembers where you were, so you can leave mid-setup, come back tomorrow and carry on.

## The five steps

| Step | What it is for |
| --- | --- |
| **1. Activate** | Confirms the app embed is live on a theme. Everything else depends on it. |
| **2. Product** | Pick the product you are configuring. |
| **3. Options** | Choose which of that product's color options become swatches. |
| **4. Configure** | Set what each value looks like. This is where the work happens. |
| **5. Go live** | Preview on your storefront. |

Steps unlock in order, because each one needs the answer from the one before. If a step is not reachable yet, it is visibly disabled and tells you why, rather than letting you land on an empty screen.

::: note Why Product comes before Options
The options list is derived from the product you picked, so there is nothing to show until you have picked one.
:::

## Step 3: options

Varn lists **color options only**. It recognises Color, Colour, Couleur, Farbe, Colore, Kleur and Farve out of the box, and names any option it left out underneath the list so you are never guessing.

If your color option is called something else, "Shade", "Finish", "Tone", add that word in [Style, Option names](style/advanced#option-names). It is a store-wide setting, so you only do it once.

Size and Material are deliberately not offered. A swatch is a visual stand-in for a color, and guessing a color for "Large" produces nonsense.

## Step 4: configure

Each value gets a row. The row shows the value name, a live preview of the chip, and the controls to change it.

### Choosing a type

| Type | What it renders | Good for |
| --- | --- | --- |
| **Color** | A solid chip. | Almost everything. |
| **Two tone** | A chip split diagonally between two colors. | "Black and White", "Navy and Cream". |
| **Gradient** | A smooth blend between two colors. | Iridescent, ombre, holographic. |
| **Image** | A real photo, cropped to the chip. | Patterns, prints, textures, wood, marble. |

Read the detail in [Color swatches](guides/color-swatches) and [Image swatches](guides/image-swatches).

### The live preview

The panel on the right renders a small product card using the exact same style settings as your storefront. It is the same renderer, so what you see is what ships. If a value has a photo mapped to it, the preview frame shows that photo.

### Seeded values

When you open a product, Varn seeds any value that already has a variant photo as an image swatch using that photo. That is the "same to same" default, and it is only a **display** default.

::: warning Seeds are not saved unless you touch them
This matters. When you press Save, Varn writes only the values you deliberately changed. An untouched seed is dropped, so your product page keeps using your theme's own native swatch for that value instead of inheriting a photo you never chose.
:::

That rule is why the "Configured" count on the product table is honest: it counts real decisions, not defaults.

## Step 5: go live

Press **Preview on your storefront** to open the product page in a new tab. Pick a swatch and check three things:

1. The chips replaced the dropdown.
2. The selected chip takes a ring.
3. The price and the gallery follow the selection, driven by your theme.

If all three are true, you are done. Repeat for other products, or run [Auto-configure all products](guides/auto-configure) to do the rest of the catalogue in one pass.

## What gets saved, exactly

One JSON record per product, in a metafield called `varn.assignments`, mapping an option value to its appearance. It contains only values you deliberately configured. Nothing about your products, variants, prices or inventory is copied into it.

See [Assignments](concepts/assignments) for the data model and [Metafields](reference/metafields) for the exact keys.

::: tip Clearing a product
Removing every value and saving writes an empty record. The product falls back to your theme's native picker with no trace of Varn on that page.
:::
