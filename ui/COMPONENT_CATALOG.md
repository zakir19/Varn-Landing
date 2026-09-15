# Prism component catalog

Prism is being scaled as a composable system, not a collection of 900 copy-paste
widgets. The catalog currently maps **more than 900 documented, independently
testable configurations** across 45 component families. A configuration is a
specific combination of component variant, size, state, and accessible behavior.

## Small building blocks available now

- Layout: `Stack`, `Inline`, `Grid`, `Cluster`, `VisuallyHidden`
- Actions: `Button`, `IconButton`, `Chip`, `Kbd`
- Inputs: `Field`, `TextInput`, `TextArea`, `SelectInput`, `Checkbox`, `RadioGroup`, `Toggle`, `SegmentedControl`
- Navigation: `Tabs`, `Breadcrumbs`, `Pagination`
- Display: `Card`, `Avatar`, `AvatarGroup`, `StatusBadge`, `Metric`, `KeyValueList`, `ListItem`, `Divider`
- Feedback: `Alert`, `EmptyState`, `Skeleton`, `Spinner`, `Progress`, `Toast`, `Dialog`
- Commerce: `Swatch` and the existing Varn state primitives

For the complete entry point, import from `src/components/extended-styled`.
It loads the atomic styling layer and exports the base, atomic, layout, and
overlay components.

The registry at `src/catalog.ts` is the source of truth for catalog coverage.
It is validated by `src/catalog.test.ts`, which enforces the 900+ threshold.
