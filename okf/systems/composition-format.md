---
type: concept
title: PPT Composition Format (PPT-CF)
description: A concise structural encoding format for serializing Prime Period Theory component layouts.
tags: [systems, web, architecture, serialization]
timestamp: 2026-06-27
---

# PPT Composition Format (PPT-CF)

The PPT Composition Format (PPT-CF) is a domain-specific serialization protocol designed to encode the structural layout, nesting, and configuration of PPT Web Components into a concise string. This format is heavily optimized for URL-based deep linking and native-application portability, abstracting away the verbosity of raw HTML.

## Architectural Philosophy

PPT-CF operates strictly within the PPT conceptual domain. It intentionally avoids standard HTML DOM definitions (like `<div>` or `<span>`). Instead, it relies on proxy components:
* `ppt-box`: A structural proxy (conceptually equivalent to a flex/grid block container).
* `ppt-text`: An inline text proxy.

By using semantic proxies, PPT-CF decoupling the encoding from HTML. A theoretical native application (e.g., iOS or Android renderer) could parse a PPT-CF payload and render native UI elements, completely bypassing the browser engine.

## Encoding Structure

A raw PPT-CF payload is composed of three interconnected parts separated by the pipe `|` character:

`[Header Index] | [Component Map] | [Structural Layout]`

### 1. Header Index (The Dictionary)
A comma-separated dictionary mapping a short, single-character alphabetical key to a full PPT component tag name.
`A:ppt-container,B:ppt-period,C:ppt-period-step-circle`

### 2. Component Map (Attribute Overrides)
A concise mapping of non-default attributes for specific instances. Instances in the structural layout are referenced by their order of appearance (0-indexed).
`1:{shape:circle,interactive:true},2:{textContent:X}`

### 3. Structural Layout (Nesting)
A bracket-based string defining the parent-child hierarchy using the keys from the Header Index.
`A[B[C,C,C]]`

### Complete Example Payload
`A:ppt-container,B:ppt-period,C:ppt-period-step-circle|1:{shape:circle},2:{textContent:1},3:{textContent:2}|A[B[C,C]]`

This payload translates to:
```html
<ppt-container>
  <ppt-period shape="circle">
    <ppt-period-step-circle textContent="1"></ppt-period-step-circle>
    <ppt-period-step-circle textContent="2"></ppt-period-step-circle>
  </ppt-period>
</ppt-container>
```

## Abstracting Standard HTML
All standard HTML must be proxied through PPT abstractions to ensure platform agnosticism:
- **`ppt-box`**: Used wherever a generic bounding box, layout container, or flex-row/column is required.
- **`ppt-text`**: Used for any textual labels, paragraphs, or inline typography.

This abstraction guarantees that a PPT-CF payload describes *intent* rather than *implementation*.

## Compression & Prefixes
Because complex compositions can result in lengthy strings, PPT-CF supports payload compression. By convention, a payload should be prefixed to indicate its encoding format:
- `raw:` Uncompressed plain-text PPT-CF (e.g., `raw:A:ppt-box|...|A[]`).
- `gz:` Compressed using Deflate/GZIP and encoded in Base64 (e.g., `gz:H4sIAAAAAAA...`).

If no prefix is provided, the parser may auto-detect the format (e.g., if it contains a `|` or `[`, it is treated as `raw`).
