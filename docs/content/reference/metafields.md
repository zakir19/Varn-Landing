---
title: Metafields reference
description: Exactly what Varn stores, where, and how to read it from your own Liquid.
---

All of Varn's configuration lives in Shopify metafields in the plain `varn` namespace, on your shop and on individual products. Nothing about your catalogue is stored on our servers.

The namespace is plain, not app-reserved, on purpose: app-reserved metafields do not reliably resolve inside theme app extension Liquid, and a plain namespace survives uninstall and reinstall so your setup comes back intact.

## Product metafields

| Key | Type | Contains |
| --- | --- | --- |
| `varn.assignments` | JSON | What each option value looks like for this product. |
| `varn.value_order` | JSON | The position map that keeps assignments correct in translated storefronts. |

### `varn.assignments`

A map of lower-cased option value to its appearance.

```json
{
  "sand": {
    "mode": "color",
    "color": "#d8c9b0"
  },
  "leopard": {
    "mode": "image",
    "image": "https://cdn.shopify.com/s/files/.../leopard.jpg",
    "media": ["30412345678901", "30412345678902"]
  },
  "black and white": {
    "mode": "dual",
    "color": "#1a1a1a",
    "color2": "#ffffff"
  }
}
```

| Field | Meaning |
| --- | --- |
| `mode` | `color`, `dual`, `gradient` or `image` |
| `color` | Primary color |
| `color2` | Second color, for `dual` and `gradient` |
| `image` | CDN URL of an uploaded swatch photo |
| `media` | Ordered product media IDs for this value, first is the cover |

Only values you deliberately configured appear. An auto-seeded default is never written.

## Shop metafields

| Key | Type | Contains |
| --- | --- | --- |
| `varn.style` | JSON | Your whole Style studio configuration. |
| `varn.meta` | JSON | Install date, plan tier, trial end, free photo allowance, setup state, analytics endpoint. |
| `varn.groups` | JSON | Product groups with their members. |
| `varn.history` | JSON | Rolling config snapshots for [backups](style/backups). |
| `varn.order` | JSON | Click-derived swatch order scores, for self-optimizing order. |
| `varn.colors` | JSON | Color index for ["More in this color"](guides/more-in-this-color). |

::: warning Do not hand-edit these
`varn.meta` in particular carries your trial state, your plan tier as the storefront reads it, and the free photo allowance roster in one record. Editing it by hand can silently disable paid features on your storefront. Everything in it is set by the app.
:::

## Reading them in your own Liquid

They are ordinary metafields, so your theme can read them.

```liquid
{% assign varn = product.metafields.varn.assignments.value %}
{% if varn %}
  {% for entry in varn %}
    {{ entry[0] }} is {{ entry[1].mode }} {{ entry[1].color }}
  {% endfor %}
{% endif %}
```

The style record, for a store-wide setting:

```liquid
{% assign style = shop.metafields.varn.style.value %}
{{ style.shape }} {{ style.size }}
```

::: note Read only
Read them freely for your own templates. Do not write to them from your theme: Varn validates and normalises every write, and a hand-written record that does not match the expected shape is discarded rather than rendered.
:::

## Robustness

Every read runs through a defensive normaliser. A record with unknown keys, missing fields or malformed values degrades to sensible defaults rather than breaking your page.

This is also how removed features stay safe. When a setting is retired, old records still carrying it are simply ignored, because normalisers rebuild from known keys only.

## Uninstall and reinstall

Metafields survive uninstall. Reinstalling restores your entire configuration: assignments, style, groups and trial state.

That is deliberate, and it is also why the [trial](billing/trial) cannot be reset by reinstalling.

## Deleting everything

To remove Varn's data completely, uninstall the app and then delete the `varn` namespace metafields using Shopify's bulk editor or the Admin API. Shopify does not remove app metafields automatically, because they are yours.
