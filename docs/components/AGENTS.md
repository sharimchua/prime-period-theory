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
- **No Hardcoded Colours/Fonts:** Always fall back to a CSS variable. E.g., `color: var(--ppt-text-color, #333);`

### 3. Interactivity & Inheritance
- **Interactive Flag:** Components must support an `interactive` boolean attribute/property.
- **Behaviour when `interactive=false`:**
  - The component must ignore pointer events (`pointer-events: none;`).
  - The component must ignore text cursor events (`user-select: none;`).
  - The component must visually indicate a static/disabled state if applicable.
- **Inheritance:** The `interactive` flag must be inherited by all child subcomponents within the container. If a parent is non-interactive, its children must also behave as non-interactive.

### 4. Layout, Sizing & Responsiveness
- **Container-Driven Sizing:** Components should not dictate their own fixed pixel sizes (no width/height/radius attributes). Instead, they must default to `width: 100%; height: 100%;` and adapt to the layout container the user places them in.
  - To maintain shapes, use CSS rules like `aspect-ratio: 1; max-width: 100%; max-height: 100%;`.
  - Position internal elements using percentages (`%`) rather than absolute pixels so they scale fluidly.
- **Minimum Sizing & Compromise Events:** Components must define a minimum size below which their visual legibility suffers. Use a `ResizeObserver` to monitor the component's size. If the size drops below this threshold, the component must dispatch a `ppt-compromised` `CustomEvent` to notify the parent container.
- **Proportional Typography:** Use CSS Container Queries (`container-type: inline-size`) and `cqi` units for font sizes. Enforce a minimum readable font size using the `max()` CSS function (e.g., `font-size: max(12px, 5cqi);`).

### 5. Extensibility
- **Base Classes:** Share common logic (like handling the `interactive` flag, `ResizeObserver`, and default styles) via a base class (e.g., `BasePPTComponent`).
- **Slots:** Use `<slot>` elements to provide attachment points for nested components (e.g., titles, body text, panels).

### 6. Composer Compatibility
- **Non-Destructive Rendering:** Components MUST protect their `attributeChangedCallback` and `slotchange` handlers to prevent destructive Shadow DOM recreation. If a component resets its entire innerHTML every time an attribute changes, it acts as a "kill switch" for any programmatically injected child slots and event listeners inside the Component Composer. Use an `_isRendered` flag to ensure the core Shadow DOM structure is built only once in `connectedCallback`.
- **Metadata:** Define `pptMetadata` as a static getter to expose customizable properties (e.g., colours, enums, booleans) to the Component Composer's Properties Panel. Specify property `type`, `options`, `default`, and `description`.
