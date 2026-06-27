# Designer App Guidelines

## CSS Scoping for Dynamic Elements
When building or maintaining the Designer app (e.g., `DesignerApp.astro`), remember that Astro scopes CSS by default in `<style>` tags by appending `data-astro-cid-*` attributes to HTML elements generated at build time.

**CRITICAL RULE**: Any CSS classes applied to HTML elements that are dynamically generated and injected via Javascript (e.g., `innerHTML += ...`) **MUST** be placed in a `<style is:global>` block. Otherwise, the scoped CSS will completely ignore the dynamically generated elements because they lack the `data-astro-cid-*` attributes.
