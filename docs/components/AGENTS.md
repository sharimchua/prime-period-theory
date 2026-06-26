# PPT Components - Agent Instructions

This directory contains the independent Web Components for Prime Period Theory. These components are designed to be framework-agnostic, independently distributable, and entirely atomic.

## Core Component Conventions

When building or modifying components in this directory, agents must strictly adhere to the following rules:

### 1. Technology Stack
- **Native Web Components:** Use standard Vanilla JS/TypeScript `HTMLElement` and Custom Elements API.
- **No External Dependencies:** Built components must not rely on external frameworks (like React, Lit, or Astro) to function in a browser.

### 2. Styling Strategy
- **Shadow DOM:** All components must use Shadow DOM (`mode: 'open'`) to encapsulate their styles and prevent leakage.
- **Injectable Styles (CSS Variables):** Component styling should be driven by CSS Custom Properties (Variables) defined in the `:host` selector. This allows the styling guides from the PPT docs to serve as defaults, while allowing any parent application to independently style the components by overriding the variables in their context.
- **No Hardcoded Colors/Fonts:** Always fall back to a CSS variable. E.g., `color: var(--ppt-text-color, #333);`

### 3. Interactivity & Inheritance
- **Interactive Flag:** Components must support an `interactive` boolean attribute/property.
- **Behavior when `interactive=false`:**
  - The component must ignore pointer events (`pointer-events: none;`).
  - The component must ignore text cursor events (`user-select: none;`).
  - The component must visually indicate a static/disabled state if applicable.
- **Inheritance:** The `interactive` flag must be inherited by all child subcomponents within the container. If a parent is non-interactive, its children must also behave as non-interactive.

### 4. Extensibility
- **Base Classes:** Share common logic (like handling the `interactive` flag and default styles) via a base class (e.g., `BasePPTComponent`).
- **Slots:** Use `<slot>` elements to provide attachment points for nested components (e.g., titles, body text, panels).
