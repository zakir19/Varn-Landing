---
title: Photo sequencing
description: The drag-and-drop photo picker: setting the cover, reordering, adding photos, and doing it all from the keyboard.
---

The photo picker in the [Variants editor](guides/variant-galleries) works like Shopify's own product media grid, because that is the interaction merchants already know.

## The two grids

**The order** is the photos assigned to this color, in the sequence shoppers will see them.

**The tray** underneath holds the product's other photos, the ones not in this color's order yet.

Both grids share one drag context, so a photo can be dragged from the tray straight into any slot in the order, or dragged back down to the tray to remove it. Clicking still works if you prefer: click a tray photo to append it.

## The cover slot

Position 1 is drawn at double size and badged **Main**. It is the photo that becomes the product's main image when this color is selected.

The badge belongs to the **slot**, not to a photo. Drop any photo into position 1 and it becomes the cover; the previous cover moves along. Exactly like Shopify's media grid.

## Reordering

::: columns
**With a mouse**

Press and drag. Neighbours shift to open a gap, the grid scrolls if you drag past its edge, and the photo settles into place when you let go.

Press <kbd>Esc</kbd> mid-drag to cancel and restore the order.

---

**With a touch screen**

Press and hold briefly, then drag. The long-press is deliberate: a drag on first movement would trap the page scroll inside the grid.

---

**With a keyboard**

Focus a photo and press <kbd>Space</kbd> to lift it, arrow keys to move it, <kbd>Space</kbd> again to drop, <kbd>Esc</kbd> to cancel. Each move is announced for screen readers.
:::

## Adding a new photo

Press **Add a photo** in the tray and choose a file. Varn:

1. Uploads it at full quality to Shopify Files.
2. Attaches it to the product as real product media.
3. Alt-texts it with the product name and color, which also helps your [agent readiness score](agent/overview).
4. Adds it to the open color's sequence.

This needs Shopify's file permission. If Varn does not have it yet, a one-click grant banner appears.

::: warning This modifies your product
Uploading here adds media to your Shopify product. It is an explicit action and never happens as a side effect of saving.
:::

## Removing a photo

Drag it down to the tray, or press the remove control on the tile. That removes it from **this color's sequence only**. The photo stays on your product and stays available to other colors.

## Deleted photos

If a photo is deleted in Shopify after you mapped it, Varn drops it from the sequence rather than rendering an empty tile.

## Does the order affect anything else?

Only the gallery for that color, on the product page. It does not change your product's media order in Shopify, your collection card image, or anything else. To change the product's real media order, use Shopify's own product editor.

::: tip Sequence for the story, not the shoot
The order that converts is usually: the clearest full product shot first, then the detail that answers the biggest question (fabric, fit, hardware), then everything else. It is rarely the order the photos came off the camera.
:::
