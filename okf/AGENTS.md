# OKF Knowledge Bundle — Agent Instructions

## Purpose of this directory

All files here are **OKF v0.1 concept documents**. They form the canonical
knowledge graph for Prime Period Theory. Every file is both human-readable
documentation and structured context for AI agents working on this project.

## Required frontmatter

Every `.md` file in this directory tree must begin with:

```yaml
---
type: concept          # or: index | reference | glossary
title: Human-readable title
description: >
  One or two sentence summary. Used by agents as a quick-read
  before deciding whether to read the full file.
tags:
  - relevant-tag
  - another-tag
timestamp: YYYY-MM-DD  # date of last meaningful edit
---
```

The `description` field is critical — it is what agents read first when
navigating the graph. Make it precise and specific, not generic.

## Subdirectory index and status

| Directory | Contents | Status |
|---|---|---|
| `foundations/` | Core physical and mathematical claims | Partially written |
| `perception/` | Human perceptual layer and agency | Active |
| `context/` | Orientation and theoretical motivation | Active |
| `reference/` | Core coordinate systems and maps | Active |
| `specifications/` | System-level specifications and formal definitions | Active |
| `extended/` | Extended ranges and abstract concepts | Partially written |
| `uniform-solfege/` | Notation system | Partially written |
| `domains/` | Pitch, rhythm, timbre | Stub only |
| `tuning/` | JI, 31 EDO, 72 EDO | Partially written |
| `related/` | MusiCoil, Tone Atlas | Stub only |

## Concept graph conventions

- Cross-links between pages use **relative paths**: `[Prime Families](foundations/prime-families.md)`
- Every concept page must have a `## See also` section at the bottom with
  relevant links
- `index.md` is the authoritative concept map — its `## Concept map` section
  must stay current
- Orphaned pages (not linked from `index.md`) should not exist

## Adding a new concept page

1. Choose the correct subdirectory (see subdirectory index above)
2. Check the subdirectory's own `AGENTS.md` for local conventions
3. Create the file with full frontmatter
4. Add a `## See also` section linking to related pages
5. Add the new page to `index.md` under the correct section
6. Add the new page to the subdirectory's `AGENTS.md` file index

## Modifying or moving concept pages

When renaming, moving, or deleting an existing concept page:
1. Update all cross-links within the `okf/` directory to point to the new path.
2. **Crucially**, search the rest of the project (especially the `docs/` directory, such as `docs/templates/topics/`) for references to the old file path (e.g., in `okf_dependencies` frontmatter) and update them. The OKF bundle acts as a dependency for the docs site, and breaking paths will break the site build.
3. Update `index.md` and the relevant subdirectory `AGENTS.md` files to reflect the change.

## Tag vocabulary

Use existing tags where possible. Core tags:

`prime-period-theory`, `foundations`, `uniform-solfege`, `notation`,
`pitch`, `rhythm`, `timbre`, `just-intonation`, `31-edo`, `72-edo`,
`microtonality`, `polyrhythm`, `prime-families`, `periodicity`,
`clock-arithmetic`, `base-12`, `diacritics`, `interval`, `tuning`

## Writing conventions

- **Prose, not bullets** for explanatory content
- **Tables** for systematic mappings (interval tables, diacritic states, etc.)
- **Code blocks** for notation examples and arithmetic
- **Bold** for first introduction of a defined term
- Equations in plain text or code blocks — no LaTeX dependency
