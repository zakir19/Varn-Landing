---
title: Appearance
description: Shape, size, spacing, labels, borders and effects, with the live preview beside them.
---

Every control here previews live. Set it once and it applies to every product on every theme.

## Shape

| Shape | Renders |
| --- | --- |
| **Circle** | A round chip. The most common choice and the one shoppers recognise fastest. |
| **Square** | Sharp corners. |
| **Rounded** | A square with soft corners. |
| **Pill** | A wide rounded rectangle, good with labels. |

If you also set a rectangular height, circle switches to rounded corners rather than stretching into an ellipse.

## Size

Pick **Small**, **Medium** or **Large**, or set a **Custom size** in pixels for exact control. Custom overrides the preset; leave it empty to use the preset.

::: tip Minimum comfortable tap target
Anything under about 32 pixels is hard to hit on a phone. If you want visually smaller chips, keep the size and increase spacing instead: the eye reads the gap, the finger gets the target.
:::

## Spacing

The gap between chips. Tighter reads as a set, looser reads as separate choices. With labels on, give yourself more room than feels necessary, because the labels need it.

## Labels

Show the value name under each chip.

Labels are the simplest way to stop relying on color alone, which matters for shoppers with color vision deficiency and for anyone comparing two similar tones.

Two modes:

- **Clamped**, the default. Long names wrap to two lines and then ellipsize, so the row height stays predictable and your layout cannot shift.
- **Full**, which shows the whole name however many lines it takes.

With labels on, every chip cell gets the same width, so wrapped rows line up in columns instead of drifting.

Long option value names, for example "stainless steel bottle opener", are the case worth testing. The full name is always available on hover.

## Borders

Set a border width and color for every chip.

The case that needs it is white and near-white chips, which are invisible on a white background without one. Varn already puts a subtle hairline outside the selection ring so a white chip reads as selected, but a real border makes the unselected state visible too.

## The selected state

The chosen chip takes a ring. Under **Effects** you can change how selection is emphasised:

- **Ring**, the default.
- **Scale**, the chip grows slightly.
- **Lift**, the chip raises with a shadow.

Scale and lift are motion, so they are disabled automatically for shoppers who have asked their system to reduce motion.

## Hover effects

::: plans growth pro
:::

Optional feedback when a shopper hovers a chip: a glow, a lift or a subtle scale, in an accent color you choose.

Keep these restrained. A swatch row with eleven chips animating is noise, not polish.

## Shadow

A resting shadow that lifts every chip slightly off the page. Subtle is the whole point; anything stronger competes with your product photography.

## Label case

Force labels to sentence case, title case or uppercase, so a catalogue with inconsistent value naming still looks deliberate.

## Layout

Standard is a wrapping row.

::: plans pro
:::

**Slider** puts the swatches in a horizontal scroller with arrows, which is useful for products with a very large number of colors where a wrapping row would push the buy button below the fold.

## Caption row

Optionally show the current selection as a text line, for example "Color: Sand". Useful when labels are off, so the shopper still gets the name of what they picked.
