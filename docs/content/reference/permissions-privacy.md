---
title: Permissions and privacy
description: Every Shopify permission Varn requests, what it is used for, and what happens to your data.
---

## The permissions Varn requests

Shopify shows you these before you approve the install.

| Permission | Used for |
| --- | --- |
| `write_products` | Reading your products, options, variants and media so the editors can show them, and writing the `varn` metafields that hold your configuration. Also required by the two explicit actions that add media to a product. |
| `read_themes` | Checking whether the app embed is switched on, so activation status is verified rather than assumed. Read only: Varn never writes to a theme. |
| `read_files` and `write_files` | Uploading swatch images and product photos to Shopify Files at full quality, and reading them back. Requested only when you first upload. |
| `write_metaobjects` | App-owned configuration storage. |

There is no request for customer data, orders, or any protected customer field. Varn is not approved for and does not receive protected customer data.

::: note Why product write and not product read
Your configuration is stored as metafields **on your products**, which is what makes it readable by your theme with no request and what makes it survive uninstall. Writing a metafield on a product requires product write access. Varn does not change your product titles, descriptions, prices, inventory or variants.
:::

## The only two actions that change your products

Everything else Varn does writes only its own metafields.

1. **[Set image swatches as variant photos](guides/sync-variant-photos)**, which adds your uploaded swatch images to the product and attaches them to variants.
2. **Uploading a photo from the [photo sequencer](guides/photo-sequencing)**, which adds that photo to the product.

Both are explicit buttons you press. Neither happens as a side effect of saving, and neither runs automatically.

## What is stored where

| Data | Where it lives |
| --- | --- |
| Swatch assignments, style, groups, backups | Shopify metafields, in your store |
| Uploaded swatch images | Shopify Files, in your store |
| Your Shopify session | Our database, so the app can authenticate you |
| Anonymous swatch click events, Advance and Premium only | Our database, deleted after 90 days |

Your catalogue is not copied to our servers. The editors read your products live from Shopify each time you open them.

## Shopper data

None is collected. In detail:

- Varn sets no cookies on your storefront.
- No fingerprinting, no device identifiers, no cross-site tracking.
- No session recording, heatmaps or cursor tracking.
- No IP address is stored with an event.
- Nothing is sold, shared or passed to an ad network.

The most Varn ever records is: someone clicked this color on this product, and it was in stock. See [Tracking and privacy](analytics/tracking-and-privacy).

## GDPR and Shopify's mandatory webhooks

Varn implements all three:

| Webhook | Response |
| --- | --- |
| **customers/data_request** | No customer data is held, so there is nothing to return. |
| **customers/redact** | Nothing to redact: no record is linked to a customer. |
| **shop/redact** | All of that store's analytics events are deleted. |

Every webhook request is signature-verified before it is processed. An unverified request is rejected.

## Security posture

- Every admin request is authenticated with Shopify session tokens.
- Every webhook and every storefront-facing endpoint verifies its signature or token before doing any work.
- All storefront code is a theme app extension. No script tags, nothing injected into your theme files.
- Custom CSS is sanitised before it is emitted, so it cannot break out into markup or pull in remote code.
- Plan enforcement happens on the server and in the storefront, not only in the interface.

## Data deletion

**While installed**: turn off the master switch in [Style](style/overview) to stop all rendering and tracking immediately.

**On uninstall**: Shopify removes the storefront code and any subscription. Analytics events are deleted when Shopify signals shop redaction.

**Completely**: after uninstalling, delete the `varn` namespace metafields with Shopify's bulk editor or Admin API. Shopify leaves them in place because they are your data. See [Metafields](reference/metafields).

## Sub-processors

Varn runs on standard cloud infrastructure and uses no third party analytics, advertising or tracking services in the app or on your storefront.

For a data processing agreement or a security questionnaire, [email support@enstacked.com](mailto:support@enstacked.com).
