---
title: Sync to variant photos
description: Push your uploaded image swatches into Shopify so they become the variant's own photo.
---

::: plans free grow advance premium
:::

This is the one action in Varn that writes to your **product** rather than to Varn's own data, so it lives behind its own button and is never part of a normal save.

## What it does

For every value that has an uploaded [image swatch](guides/image-swatches), it:

1. Adds the image to the product's media in Shopify.
2. Waits for Shopify to finish processing it.
3. Attaches it to every variant carrying that option value.

The result: the photo appears in your admin product gallery, and your theme shows it as the variant's own photo, with or without Varn.

## Running it

In the Swatches editor's Configure step, press **Set image swatches as variant photos**. The button only appears when the product has at least one uploaded image swatch.

You get a summary when it finishes: how many images were applied, and how many were skipped with the reason.

## What is eligible

Only **full-quality uploads** stored on Shopify's CDN. If you uploaded before granting the Files permission, that value used a small local fallback image, which Shopify cannot turn into product media. Those are reported as skipped with a clear message.

Grant the Files permission, re-upload, and run it again.

## Re-running is safe

Varn tags the media it creates with the color name and reuses existing media on a second run, so running it twice does not fill your gallery with duplicates.

If Shopify reports that an image is already applied to a variant, that counts as success, not an error.

::: note Shopify needs a moment
Right after a media upload, Shopify sometimes reports that the image is not ready to be positioned yet. Varn waits for the image to become ready and retries, so a transient message during processing is not treated as a failure.
:::

## When you want this

- You want the variant photo to be correct **outside** Varn too: in the Shopify admin, in exports, in your product feed, in marketplaces.
- Your theme shows a variant photo somewhere Varn does not reach.
- You are preparing your catalogue for AI shopping agents, which read variant media. See [Agent readiness](agent/overview).

## When you do not

- You only want swatches to look right on the product page. Varn already does that with no product changes.
- Your swatch images are tight crops of fabric. They make good chips and poor variant photos, because they will show as the variant's main image.

::: tip A cleaner alternative
If your goal is "show the right photos for the right color", you probably want [per-color galleries](guides/variant-galleries) instead. That maps photos you already have without adding new media to your product.
:::

## Undoing it

Varn does not remove media it created, because by then it is ordinary product media and you may have reordered or reused it. Remove it in Shopify's product editor.
