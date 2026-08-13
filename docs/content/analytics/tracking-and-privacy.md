---
title: Tracking and privacy
description: Exactly what an analytics event contains, how it travels, and everything Varn refuses to collect.
---

This page is the full technical answer to "what does this app send about my shoppers". The short version: a color name and whether it was in stock.

## What an event contains

Four fields. That is the whole payload.

```json
{
  "kind": "click",
  "product": "atelier-knit-tee",
  "value": "sand",
  "soldOut": false
}
```

| Field | Values |
| --- | --- |
| `kind` | `click` or `atc` (add to cart) |
| `product` | The product handle, which is already in the page URL |
| `value` | The option value that was picked |
| `soldOut` | Whether that value was unavailable |

## What is never collected

- No customer ID, email, name, address or account data.
- No cookies set by Varn, no fingerprinting, no device ID.
- No IP address stored with an event.
- No cross-site or cross-store tracking.
- No cursor tracking, session recording or heatmaps.
- No cart contents, order values or prices.
- Nothing is sold, shared or sent to a third party. There is no ad network involved.

Events are not linkable to a person, or to each other. There is no session identifier, so two clicks by the same shopper are indistinguishable from two clicks by two shoppers.

## When the tracker runs at all

Only when **all** of these are true:

1. Your store is on Pro, or inside the [14-day trial](billing/trial).
2. The shopper is on a page where swatches rendered.
3. They clicked a swatch.

On Free and Growth the tracker is not merely idle: the code path never runs and nothing is ever sent.

## How events travel

Clicks are batched in the browser and sent together, so a shopper who tries six colors produces one small request, not six.

The batch is sent to Varn's own endpoint, authenticated with a per-shop token that is included in your page. That token identifies the shop, not the shopper.

::: note Why a token and not a secret
The token is visible in your page source, and that is fine: the endpoint it opens can only add anonymous color counts for your own store. It was never a secret capability. It exists so events land in the right store's data.
:::

If the endpoint cannot be reached, events are held in the browser's session storage and sent on a later page load rather than being dropped, up to a small cap. If it keeps failing, the tracker backs off and stops trying for a while rather than retrying forever.

## Retention

Events are kept for **90 days** and then deleted automatically. There is no long-term archive.

## Deletion requests

Varn implements Shopify's mandatory data webhooks:

- **Customer data request**: we hold no customer data, so there is nothing to return.
- **Customer redact**: nothing to redact, because no event is linked to a customer.
- **Shop redact**: when a store uninstalls and Shopify signals redaction, all of that store's events are deleted.

## Turning tracking off

Three ways, any of which is complete:

- Turn off the master switch in [Style](style/overview). Nothing renders and nothing is tracked.
- Move to Free or Growth. The tracker does not ship.
- Uninstall. Shopify removes the storefront code and signals redaction.

## For your privacy policy

If you list your data processors, Varn is one, and the accurate description is short:

> Varn (Enstacked Technologies) records anonymous product option interactions (which color was selected on which product, and whether it was in stock) to provide merchandising analytics. No personal data is collected, and records are deleted after 90 days.

See also [Permissions and privacy](reference/permissions-privacy) for the admin side: which Shopify scopes Varn requests and why.
