---
title: Backups and restore
description: Automatic snapshots of your configuration, with one-tap restore.
---

::: plans free grow advance premium
:::

Varn keeps a rolling history of your configuration so a change you regret is a one-click undo rather than an afternoon.

Find it in **Style, Backups**.

## What is captured

A snapshot is taken automatically every time you save:

- your **style** configuration, every setting on every tab
- your **product groups**

Each snapshot is stamped with when it was taken. Varn keeps the most recent ten of each kind and drops the oldest as new ones arrive.

## What is not captured

Per-product assignments are not snapshotted. Two reasons:

1. They are per product, so a store-wide snapshot of them would be enormous.
2. They are additive by nature. Re-running [auto-configure](guides/auto-configure) rebuilds them, and a value you clear falls back to your theme's own swatch rather than breaking.

If you need to protect a specific product's setup, note its values before a big change.

## Restoring

Pick a snapshot and press **Restore**. The restore goes through the normal save path, which means it is validated exactly like a manual save.

::: note Plan checks apply to restores too
If you snapshot while on a paid plan or trial and restore after moving to a lower plan, the settings your current plan does not include are stripped on the way in. A restore can never re-enable a feature your plan does not include, which is why a restore is safe to press without checking what it contained.
:::

## After a restore

The editor updates to show the restored values immediately, and the change is live on your storefront on the next page load.

If you restored by accident, the state you were in a moment ago is itself the newest snapshot, so restore that.

## Good moments to check the list

- Before a big style change on a busy store.
- After someone else on your team edits the app.
- Before turning on a new surface, so you can compare.

::: tip Snapshots are not a substitute for looking
The safest habit is still: change one thing, open a product page, confirm. Backups exist for the change that seemed fine and turned out not to be.
:::
