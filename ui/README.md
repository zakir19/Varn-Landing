# Prism UI

Prism is Varn's React component system. It packages the existing Varn visual
language into reusable, accessible primitives without changing the production
landing page, which intentionally remains a zero-dependency static site.

## Start the showcase

```bash
npm install
npm run dev
```

The Vite app opens a responsive component showcase with light/night themes,
interactive controls, dialog, toast, progress, form validation, and components
in default, loading, disabled, error, and success states.

## Component API

`src/components` exports `Button`, `Card`, `Field`, `TextInput`,
`SegmentedControl`, `Toggle`, `StatusBadge`, `Progress`, `Divider`, `Dialog`,
and `Toast`.

`src/styles.css` contains every Prism token and component rule. Color/surface,
type, radii, elevation, motion, focus, and responsive behavior are all driven
from semantic tokens. Dark mode redefines the semantic surface tokens rather
than duplicating component styles.

## Integration

Import from the component barrel and the stylesheet once at the consuming app
entry point:

```tsx
import { Button, Field, TextInput } from "./components";
import "./styles.css";
```

The app deliberately does not import external icon, animation, utility-CSS, or
component-library dependencies. This keeps the library portable to the future
Varn React app while the current marketing site continues to deploy unchanged.
