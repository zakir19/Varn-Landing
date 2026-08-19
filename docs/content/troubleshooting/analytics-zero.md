---
title: Analytics shows zero
description: Why no swatch clicks are recorded, and the built-in test that tells you which link is broken.
---

Analytics has more moving parts than anything else in Varn, so there is a built-in diagnostic rather than a guessing game.

## Start with Test tracking

On the Analytics page's empty state, press **Test tracking**. It checks the whole pipeline and reports what it finds in plain words:

| Result | Meaning |
| --- | --- |
| **Connected** | The endpoint is live and reachable. Tracking works. Go click a swatch. |
| **Events already recorded** | Rows exist in your data, so the whole pipeline is proven. The dashboard filter may just be on a window with no data. |
| **Storefront password** | Your store is password protected, which blocks the outside-in check only. Tracking still works for anyone who has entered the password. This is a normal pre-launch state, not a fault. |
| **Endpoint not reachable** | The app needs deploying or is temporarily down. Contact support. |

## The checks, in order

### 1. Are you on Advance or Premium?

Analytics is on Advance and Premium. On Free and Grow the tracker is not shipped at all, so nothing can be recorded.

If it worked yesterday, check the Plan page: a cancelled [trial](billing/trial) or lapsed subscription returns the store to Free.

### 2. Has anyone clicked a swatch since?

Events only exist from real storefront interactions after you were on Advance or Premium. A store that upgraded an hour ago with no traffic since will show zero, correctly.

Test it yourself: open a product page on your storefront, click two or three colors, wait a moment and reload the Analytics page.

### 3. Does your storefront see your plan?

The storefront reads your plan from a value stored on your shop. In rare cases the admin and the storefront can disagree, and the symptom is exactly this: the admin shows Advance or Premium, the storefront never tracks.

On a product page:

```js
window.VarnConfig.pro
```

`true` means the storefront agrees you are on Advance or Premium. `false` while the admin shows a paid plan is the mismatch, and **Test tracking** detects it, repairs it, and then re-reads to confirm the repair actually stuck before telling you it worked.

### 4. Is the tracker running?

On a product page:

```js
window.VarnTrack.state()
```

It reports whether the tracker is enabled, whether it sees a paid entitlement, how many events it has sent and queued, and whether it has backed off after failures.

`window.VarnTrack.flush()` forces a send. `window.VarnTrack.reset()` clears a backoff.

::: note These are read-only diagnostics
`VarnTrack` cannot create events. It reports state and can send what is already queued, so you can never pollute your own data by inspecting it.
:::

### 5. Is the master switch on?

**Style, Show swatches on your storefront.** With it off nothing renders, so nothing can be clicked, so nothing is tracked.

## Zero clicks but the tables look locked

Top colors by clicks unlocks at **30 swatch clicks**, and merchandising advice at the same floor. Below that you see a progress line instead of a ranking, because a five-way tie on one click each is noise, not data.

The stat tiles and the sold-out demand table are visible from the first click.

## Events are delayed

Clicks are batched, so a shopper trying six colors produces one request rather than six. If the endpoint is briefly unreachable, events are held in the browser and sent on a later page load rather than being dropped.

That means a click can land in your dashboard a page load or two after it happened. Reload the dashboard before concluding something is missing.

## Events during a password-protected launch

Tracking works for any browser that has entered the storefront password: the beacon rides the shopper's own session. The password only blocks the outside-in health check, which is why that result is reported as information rather than a warning.

## Still zero

[Email support](resources/support) with your store URL, the result of Test tracking, and what `window.VarnTrack.state()` returned on a product page. That combination usually identifies the broken link immediately.
