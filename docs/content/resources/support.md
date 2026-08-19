---
title: Support
description: How to reach us, what to include, and how to get an answer on the first reply.
---

## Email

[support@enstacked.com](mailto:support@enstacked.com)

Typical response is within 24 hours, on every plan including Free.

## What to include

Sending these four things turns a three-message thread into one reply.

::: steps

### Your store URL

And the storefront password, if the store is password protected. Without it we cannot look at the page you are describing.

### The theme name and version

Run this in your browser console on your storefront:

```js
window.Shopify.theme.name
```

This is the single most useful line in any message. Most storefront issues are theme-specific, and knowing the theme often identifies the cause before we open anything.

### A link to the exact page

Not "a product page". The product page where you see the problem. Different products are configured differently, and the difference is usually the answer.

### A screenshot or recording

Circle what is wrong. What reads as obviously broken to you is often one of several plausible readings to us.

:::

## Useful extras for storefront problems

On the affected page, in the browser console:

```js
window.VarnConfig            // the settings your storefront received
window.VarnConfig.pro        // whether your storefront sees a paid entitlement
window.VarnTrack.state()     // analytics tracker status, Advance and Premium
```

Pasting the output saves a round trip. See [Storefront reference](reference/storefront-reference).

## Before you write

Most reports match one of these, and they answer in less time than an email takes:

::: cards
- [Swatches are not showing](troubleshooting/swatches-not-showing): {wrench} Usually the app embed on the theme you are actually browsing.
- [Duplicate swatches](troubleshooting/duplicates): {wrench} Your theme is drawing its own too.
- [Galleries and card chips](troubleshooting/galleries-and-cards): {image} Photos not filtering, or gray chips.
- [Analytics shows zero](troubleshooting/analytics-zero): {chart} Advance and Premium, and needs a real click.
- [FAQ](troubleshooting/faq): {life} The things merchants ask first.
:::

## Feature requests

Genuinely welcome, and the useful shape is:

1. What you are trying to achieve for shoppers.
2. What you do today instead.
3. How often it comes up.

The problem is more valuable than the proposed solution. Several features in Varn exist because a merchant described a workaround they had built.

## Bug reports we prioritise

- Anything that shows a shopper the wrong variant, price or availability.
- Anything that breaks a product page.
- Anything that costs performance.
- Theme-specific rendering bugs, because a fix for one merchant reaches everyone on that theme.

## Agencies and developers

If you are setting Varn up for a client, [email us](mailto:support@enstacked.com) and say so. Development stores run billing in test mode, so you can exercise the full upgrade flow without money moving.

For security questionnaires, data processing agreements or architecture questions before a rollout, the same address reaches someone who can answer them.

## About us

Varn is built and supported by [Enstacked Technologies](https://www.enstacked.com).
