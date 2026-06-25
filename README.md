# Prime Period Theory

<table width="100%">
  <tr>
    <td bgcolor="white" align="center">
      <img src="resources/Logo.svg" alt="Prime Period Theory Logo" width="300" />
    </td>
  </tr>
</table>

A descriptive framework for musical structure, grounded in the physics of
amplitude and time, organised through the mathematics of prime-generated
periodic relationships.

## What this is

Prime Period Theory (PPT) proposes that the structural relationships within
music — across pitch, rhythm, and timbre — are all expressions of a single
underlying phenomenon: **periodic signals in time, organised through prime
ratios**.

It is offered as a lens, not a law. A vocabulary for making musical structure
more legible and intentional — in the same way that geometry and colour theory
serve visual artists — without constraining what music can be or mean.

## Repository structure

```
okf/                    # OKF knowledge bundle (AI-readable, human-browsable)
│
├── index.md            # Entry point and concept map
│
├── foundations/        # Core theoretical claims
│   ├── amplitude-time.md
│   ├── periodicity.md
│   └── prime-families.md
│
├── uniform-solfege/    # The notation layer
│   ├── index.md
│   ├── diacritic-system.md
│   ├── geometric-basis.md
│   └── base-12-algebra.md
│
├── domains/            # The three domains of application
│   ├── pitch.md
│   ├── rhythm.md
│   └── timbre.md
│
├── tuning/             # Tuning systems
│   ├── just-intonation.md
│   ├── 31-edo.md
│   └── 72-edo-grid.md
│
└── related/            # Connected systems
    ├── musicoil.md
    └── tone-atlas.md

docs/                   # GitHub Pages (interactive components)
└── components/
    ├── circle-of-fifths/
    ├── tone-atlas/
    ├── keyboard/
    ├── fretboard/
    └── harmonic-geometry/
```

## The OKF bundle

The `okf/` directory is a conformant
[Open Knowledge Format (OKF) v0.1](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing)
bundle. Each file is a markdown concept document with YAML frontmatter. The
documents link to each other, forming a knowledge graph that is both
human-readable and AI-agent-consumable.

Start at [`okf/index.md`](okf/index.md).

## Related projects

- **MusiCoil** — a spatial music notation and pedagogy system; the visual
  representation layer for PPT concepts
- **Tone Atlas** — a clock-face pitch relationship diagram

## Status

Early-stage theoretical notes. Living document. Not a finished theory.

## Author

Sharim — Melbourne, Australia
