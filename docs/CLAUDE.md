## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation Architecture

This `docs/` folder represents the **display layer** for the project. It uses Astro to serve static documentation. 
The canonical source of truth for all theory is the `okf/` folder in the root repository. **Do not put core theory definitions directly in this folder.**

### Topic Generation Pipeline

We use a block-level generative pipeline for topic pages (like tutorials, guides, and introductions) to keep the human-facing documentation in sync with the canonical OKF knowledge base.

**Convention:**
- **Templates (`docs/templates/topics/*.mdx`):** These are the source files for topic pages. They contain static content, Astro components, and special Agent Generation Blocks.
- **Generated Topics (`docs/src/content/generated_topics/`):** This is where the final pages live after an agent has processed the template.

#### Agent Generation Blocks

Templates use the following syntax to direct agents on what to generate. Agents must preserve all static content outside these blocks and only replace the block itself.

```markdown
<!-- AGENT_GENERATE_BLOCK 
okf_dependencies:
  - okf/path/to/concept.md
tone: Conversational, non-academic.
audience: General public.
instructions: Synthesise the concept of music as expectation based on the OKF.
-->
[Agent will replace this block with the generated markdown in the final output file]
<!-- AGENT_GENERATE_BLOCK_END -->
```

**Agent Process for Generating Topics:**
1. Read the `.mdx` template from `docs/templates/topics/`.
2. Read all files listed in `okf_dependencies`.
3. Synthesise the content according to the `tone`, `audience`, and `instructions`.
4. Output a new `.mdx` file to `docs/src/content/generated_topics/` where the target block has been replaced by the synthesised markdown, leaving the rest of the template exactly as is.

## Astro Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:
- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

### Navigation Updates
**IMPORTANT**: When creating new pages or components, ALWAYS update the sidebar navigation tree.
- For component showcases and reference pages, update `docs/src/layouts/ComponentLayout.astro` (the `drawer-sidebar` nav tree).
- Missing sidebar links make newly created pages undiscoverable to the user.

## Component Composer

The `docs/src/components/designer/DesignerApp.astro` file orchestrates the Component Composer, a visual tool to assemble PPT Web Components.

**Composer Architecture:**
- **Toolbar & Layout:** Supports four split views (Designer Focused 75%, Split 50/50, Preview Focused 25%, and Preview Only 0%).
- **Component Library (`library-list`):** Iterates over registered Web Components to provide draggable elements.
- **Component Tree:** Synchronizes with the visual canvas to display the DOM hierarchy. Allows rearranging (up/down) and deleting elements.
- **Properties Panel:** Parses `pptMetadata` from the component definition to dynamically generate editing controls (colour pickers, enums, textareas for content parameters, etc.).
- **Source Code Pane:** Resizable/collapsible footer panel displaying formatted HTML representation of the canvas.
- **Persistence (Payloads):** Generates and loads compressed base64 gzip payloads containing the raw HTML composition.

**Important Note for Composer Development:**
- Web Components in the designer MUST protect their `attributeChangedCallback` and `slotchange` handlers to prevent destructive re-renders (using flags like `_isRendered`).
- The Composer uses `pptMetadata` mapped to data attributes to configure the UI. Ensure `parseComponents.ts` correctly extracts properties.
- The root `ppt-container` node is locked from deletion, dragging, and the library to enforce a single master canvas layout.
