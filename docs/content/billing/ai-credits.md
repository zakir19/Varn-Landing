---
title: AI usage credits
description: What a credit is, what spends one, what every plan includes, and what happens when the month runs out.
---

**One credit is one product photo the AI looks at.** That is the whole unit.

Credits exist because that pass is the only part of Varn that calls a vision model, and each photo it reads costs real money. Metering the photo rather than selling you a token bundle means the number on your meter is something you can reason about: "60 credits left" means sixty more photos.

## What is included

| Plan | AI usage credits a month |
| --- | --- |
| Starter | 250 |
| Grow | 1,500 |
| Advance | 10,000 |
| Premium | 25,000 |

The allowance is per calendar month and resets at the start of each one. Credits do not roll over, and there is nothing to buy separately.

## What spends a credit

Only one thing: a photo sent to the vision model, during [AI setup](guides/ai-setup) or [AI photo match](guides/ai-photo-match).

## What spends nothing

Everything else, including the parts of AI setup that place most photos on a normal catalogue:

- [One-click AI setup](guides/ai-setup) from color names, in more than ten languages
- [Auto-configure all products](guides/auto-configure) across the whole catalogue
- Matching photos by gallery order and variant featured images
- Matching photos by file name
- Matching photos by alt text
- Color detection from the pixels of a photo, which runs in your own browser

The vision model is the last resort in the chain, not the first step, so a catalogue with tidy alt text or a sensible gallery order spends far fewer credits than it has photos.

## Where to see your balance

The **AI usage credits** meter appears on the Home dashboard, on the Variants list and in the Variants editor, next to the product allowance. It shows what you have used this month and what is left.

## When the month runs out

Nothing breaks and nothing is blocked:

- The run continues using color detection instead of the model.
- Varn tells you the allowance is used up rather than failing silently.
- Everything already matched stays exactly as it is.
- The count resets at the start of the next month.

If you regularly finish the month early, moving up a plan raises the allowance. See [Plans and pricing](billing/plans).

## Failed calls are not charged

Credits are claimed before the model is called, so several batches running at once cannot overspend your allowance, and they are handed straight back if the call fails. A timeout or an error costs you nothing.

## Privacy

Only the product photo itself, its public Shopify CDN URL, your option value names and the product title are sent. No shopper data, no order data and no customer data is involved. See [Permissions and privacy](reference/permissions-privacy).
