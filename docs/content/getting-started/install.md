---
title: Install and activate
description: Installing Varn, switching the app embed on, activating unpublished themes, and reading the activation status correctly.
---

Installing the app and activating it on a theme are two separate things. The install gives Varn access to your admin. The **app embed** is what allows it to render anything on your storefront.

## Install

Add Varn from the [App Store listing](https://apps.shopify.com/varn-variants-swatches-ai). Shopify shows you the permissions before you approve them. See [Permissions and privacy](reference/permissions-privacy) for what each one is used for and why.

After approving, you land on the Varn dashboard. Your [14-day Pro trial](billing/trial) starts here, with no card and no charge.

## Activate the app embed

::: steps

### Open the theme picker

On the dashboard or in either editor, press **Activate on your theme**. A modal lists every theme in your store with:

- the theme name and its role (live, unpublished, development)
- whether the Varn embed is currently **On**, **Off**, or **Check failed**
- an action that deep-links straight into that theme's editor with the Varn embed pre-selected

### Toggle the embed on and save

The theme editor opens on the App embeds panel with Varn already selected. Switch it on and press **Save** at the top right.

The embed has no settings of its own. Everything is controlled from the [Style studio](style/overview) inside the app, so that one change applies to every theme and every product at once.

### Come back and confirm

Return to the Varn tab. The status re-checks automatically when the window regains focus (debounced, so it will not hammer the API), and the step turns green with the name of the theme it verified.

You can also press **Re-check status** at any time.

:::

## Activating an unpublished theme

This is the reason the theme picker exists. Shopify's generic "current theme" deep link only ever targets your live theme, so it cannot help you set up a theme you are still building.

Use the theme picker and press Activate on the row for the theme you want. The link targets that specific theme's editor.

::: tip Publishing later
Activation lives in the theme's own settings, so it travels with the theme. Activate your staging theme now, and when you publish it the swatches come with it. There is nothing to redo.
:::

## Reading the activation status

Varn reports four states, and it never guesses.

| State | Means | What to do |
| --- | --- | --- |
| **Checking** | The theme read is in flight. | Wait a second. |
| **Active** | The embed is present and enabled on the named theme. | Nothing. |
| **Not activated** | The theme was read successfully and the embed is off or missing. | Activate it. |
| **Check failed** | Varn could not read the theme at all. | Re-check. See below. |

"Check failed" is deliberately never shown as "not activated". Telling you to activate something that is already on would waste your time, so an unreadable theme is reported honestly as unknown.

### Status says unknown

Usually one of:

- The `read_themes` permission has not been granted yet. Reload the app once, Shopify will prompt.
- A transient Shopify API error. Press **Re-check status**.
- The theme stores its settings in a preset form that carries no block list, which happens on a handful of themes. In that case the storefront is the real test: open a configured product and look.

### Drafts are not detectable

If you toggled the embed in the theme editor but did not press Save, Shopify keeps that as an unsaved draft that no API can see. Varn will keep reporting **Not activated**, correctly. Press Save in the theme editor.

## Uninstalling

Uninstall from Shopify's Apps page. Because all storefront code is a theme app extension, Shopify removes it for you. Nothing is left in your theme files, and your product pages return to their previous state immediately.

Your configuration is stored in metafields on your shop and products, so if you reinstall later, your swatches come back exactly as they were. See [Metafields](reference/metafields).

::: info Subscriptions cancel automatically
Shopify cancels any active app subscription on uninstall. There are no post-uninstall charges and nothing to cancel by hand.
:::
