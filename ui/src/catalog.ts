export type ComponentFamily = {
  name: string;
  category: "foundation" | "action" | "input" | "navigation" | "display" | "feedback" | "overlay" | "commerce" | "layout";
  variants: number;
  sizes: number;
  states: number;
  description: string;
};

// A configuration is an independently documented component state: it has its
// own visual treatment, interaction semantics, and accessibility expectation.
export const componentFamilies: ComponentFamily[] = [
  { name: "Button", category: "action", variants: 5, sizes: 3, states: 4, description: "Primary and secondary actions" },
  { name: "IconButton", category: "action", variants: 4, sizes: 3, states: 4, description: "Compact icon-only action" },
  { name: "SplitButton", category: "action", variants: 4, sizes: 3, states: 3, description: "Action plus disclosure" },
  { name: "LinkAction", category: "action", variants: 4, sizes: 3, states: 3, description: "Inline contextual action" },
  { name: "Chip", category: "action", variants: 3, sizes: 2, states: 4, description: "Choice and filtering token" },
  { name: "Checkbox", category: "input", variants: 2, sizes: 2, states: 4, description: "Binary field" },
  { name: "RadioGroup", category: "input", variants: 3, sizes: 2, states: 4, description: "Single-choice field" },
  { name: "Toggle", category: "input", variants: 2, sizes: 2, states: 4, description: "Immediate preference" },
  { name: "TextInput", category: "input", variants: 4, sizes: 3, states: 4, description: "Short text field" },
  { name: "TextArea", category: "input", variants: 3, sizes: 2, states: 4, description: "Long-form text field" },
  { name: "Select", category: "input", variants: 3, sizes: 3, states: 4, description: "Native select shell" },
  { name: "Combobox", category: "input", variants: 3, sizes: 3, states: 4, description: "Searchable choice field" },
  { name: "NumberInput", category: "input", variants: 3, sizes: 3, states: 4, description: "Incrementable number" },
  { name: "DateInput", category: "input", variants: 3, sizes: 3, states: 4, description: "Date field" },
  { name: "ColorInput", category: "input", variants: 3, sizes: 2, states: 4, description: "Color capture field" },
  { name: "Field", category: "input", variants: 4, sizes: 3, states: 4, description: "Label and validation wrapper" },
  { name: "Tabs", category: "navigation", variants: 4, sizes: 3, states: 3, description: "Section navigation" },
  { name: "SegmentedControl", category: "navigation", variants: 3, sizes: 3, states: 3, description: "Compact view switcher" },
  { name: "Breadcrumbs", category: "navigation", variants: 3, sizes: 2, states: 2, description: "Hierarchy trail" },
  { name: "Pagination", category: "navigation", variants: 3, sizes: 2, states: 3, description: "Page navigation" },
  { name: "Sidebar", category: "navigation", variants: 3, sizes: 3, states: 3, description: "Persistent navigation" },
  { name: "StatusBadge", category: "display", variants: 5, sizes: 2, states: 3, description: "Compact semantic state" },
  { name: "Avatar", category: "display", variants: 4, sizes: 4, states: 2, description: "Person or workspace identity" },
  { name: "Swatch", category: "commerce", variants: 5, sizes: 3, states: 4, description: "Color or image choice" },
  { name: "ProductTile", category: "commerce", variants: 4, sizes: 3, states: 4, description: "Product variation surface" },
  { name: "StockState", category: "commerce", variants: 4, sizes: 2, states: 3, description: "Availability indicator" },
  { name: "Price", category: "commerce", variants: 4, sizes: 3, states: 3, description: "Price presentation" },
  { name: "Card", category: "display", variants: 5, sizes: 3, states: 3, description: "Layered content surface" },
  { name: "Metric", category: "display", variants: 4, sizes: 3, states: 3, description: "Performance measure" },
  { name: "KeyValueList", category: "display", variants: 3, sizes: 2, states: 2, description: "Definition pairs" },
  { name: "ListItem", category: "display", variants: 5, sizes: 3, states: 3, description: "Row primitive" },
  { name: "DataTable", category: "display", variants: 4, sizes: 3, states: 4, description: "Structured data table" },
  { name: "EmptyState", category: "feedback", variants: 4, sizes: 2, states: 3, description: "Zero-data communication" },
  { name: "Alert", category: "feedback", variants: 4, sizes: 2, states: 3, description: "In-flow system message" },
  { name: "Progress", category: "feedback", variants: 4, sizes: 3, states: 4, description: "Task completion signal" },
  { name: "Skeleton", category: "feedback", variants: 4, sizes: 3, states: 2, description: "Loading placeholder" },
  { name: "Toast", category: "feedback", variants: 4, sizes: 2, states: 3, description: "Transient confirmation" },
  { name: "Dialog", category: "overlay", variants: 4, sizes: 3, states: 3, description: "Focused decision" },
  { name: "Drawer", category: "overlay", variants: 4, sizes: 3, states: 3, description: "Contextual side panel" },
  { name: "Popover", category: "overlay", variants: 4, sizes: 2, states: 3, description: "Anchored detail" },
  { name: "Tooltip", category: "overlay", variants: 3, sizes: 2, states: 3, description: "Short contextual help" },
  { name: "Stack", category: "layout", variants: 3, sizes: 7, states: 2, description: "Vertical rhythm primitive" },
  { name: "Inline", category: "layout", variants: 3, sizes: 7, states: 2, description: "Inline rhythm primitive" },
  { name: "Grid", category: "layout", variants: 4, sizes: 7, states: 2, description: "Responsive grid primitive" },
  { name: "Cluster", category: "layout", variants: 3, sizes: 7, states: 2, description: "Wrapping item cluster" },
];

export const catalogConfigurationCount = componentFamilies.reduce((total, family) => total + family.variants * family.sizes * family.states, 0);
export const catalogFamiliesByCategory = componentFamilies.reduce<Partial<Record<ComponentFamily["category"], ComponentFamily[]>>>((groups, family) => { (groups[family.category] ??= []).push(family); return groups; }, {});
