---
title: Custom CSS
description: Your own rules on top of Varn's storefront styles, with the safety rules that apply.
badge: Pro
---

::: plans pro
:::

When the style controls do not reach far enough, Custom CSS lets you write rules that ship with the swatch styles on your storefront.

Find it in **Style, Advanced customization, Custom CSS**.

## What gets through

Your CSS is sanitised before it is emitted. Specifically, Varn strips:

- any `<` character, so a rule can never break out of the stylesheet into markup
- `@import`, so no third party stylesheet can be pulled into your storefront
- `javascript:` URLs

There is also a length cap, shown as helper text under the field.

::: note What sanitising is for
It protects your storefront from a rule that could inject markup or fetch remote code. It is not a linter: a rule with a typo is passed through and simply does nothing, exactly as it would in your theme.
:::

## Useful selectors

The full list is in the [storefront reference](reference/storefront-reference). The ones you will reach for most:

```css
/* the whole swatch row */
.varn-swatches { }

/* one swatch, and its chip */
.varn-swatch { }
.varn-swatch__chip { }

/* the selected swatch */
.varn-swatch[aria-checked="true"] .varn-swatch__chip { }

/* a sold-out swatch */
.varn-swatch--unavailable { }

/* the label under a chip */
.varn-swatch__label { }

/* chips on collection and search cards */
.varn-cswatches { }
```

## Examples

Bigger chips on the product page only, leaving cards alone:

```css
.varn-swatches .varn-swatch__chip {
  inline-size: 52px;
  block-size: 52px;
}
```

A heavier ring on the selected chip:

```css
.varn-swatch[aria-checked="true"] .varn-swatch__chip {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #26242e;
}
```

Hide labels on small screens only:

```css
@media (max-width: 480px) {
  .varn-swatch__label { display: none; }
}
```

## Rules of thumb

**Try the settings first.** Anything you can set in the Style studio is previewed live, survives updates and does not need testing on every theme. Custom CSS is the escape hatch, not the starting point.

**Scope your selectors.** A bare `.varn-swatch__chip` rule hits product pages, cards, quick view and group rows at once. Prefix with `.varn-swatches` or `.varn-cswatches` to target one surface.

**Do not use it to hide the sold-out mark.** That mark is what stops shoppers picking unavailable colors. Use the [sold-out style setting](style/sold-out), which keeps the behaviour while changing the look.

**Test on a phone.** Most swatch layout problems are width problems.

::: warning Custom CSS is not covered by theme updates
If your theme changes its markup, a rule that targets your theme's own classes can stop applying. Rules that only use `varn-` classes are stable, because those come from Varn.
:::

## Removing it

Clear the field and save. Your storefront returns to the standard styles on the next page load.
