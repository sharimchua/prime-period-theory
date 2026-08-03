---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-08-03
tags:
  - analytics
  - graph
status: stable
depends_on: []
extends: []
contrasts_with: []
used_by: []
implemented_by: []
defines: []
evidence: []
---
# OKF Architectural Analysis
**Generated:** 2026-08-03 12:22:07

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 10 | 11389 | 8 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [index.md](index.md) | 82 | 17408 | 9 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 9 | 18214 | 16 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 21 | 55 | 8 | 7741 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 20 | 46 | 7 | 6233 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 15 | 10 | 0.4 | 1 | 26 | 8 | 11389 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 4 | 25 | 10 | 12194 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 2 | 21 | 7 | 7341 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 26 | 48 | 12 | 16334 |
| [ppd/index.md](ppd/index.md) | 12 | 3 | 0.2 | 14 | 29 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 23 | 47 | 13 | 27654 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 9 | 26 | 10 | 12482 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 10 | 26 | 8 | 9185 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 1 | 14 | 5 | 7109 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 19 | 35 | 8 | 6938 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 9 | 4 | 0.31 | 15 | 28 | 12 | 16404 |
| [domains/pitch.md](domains/pitch.md) | 9 | 4 | 0.31 | 18 | 31 | 6 | 5710 |
| [foundations/period.md](foundations/period.md) | 9 | 6 | 0.4 | 25 | 40 | 6 | 6643 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [index.md](index.md) | 9 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |

## Duplication Warnings
| File A | File B | Similarity | Text A Snippet |
|--------|--------|------------|----------------|

## Coverage
| Metric | Percentage |
|--------|------------|
| Examples | 22.9% |
| References | 65.1% |
| Implementations | 9.6% |
| Pedagogy | 9.6% |

## Foundational Concepts
- [foundations/prime-families.md](foundations/prime-families.md)
- [foundations/periodicity.md](foundations/periodicity.md)
- [uniform-solfege/index.md](uniform-solfege/index.md)
- [domains/rhythm.md](domains/rhythm.md)
- [perception/temporal-place-limen.md](perception/temporal-place-limen.md)
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [ppd/index.md](ppd/index.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [domains/timbre.md](domains/timbre.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [domains/pitch.md](domains/pitch.md)
- [foundations/period.md](foundations/period.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [structure/musicoil.md](structure/musicoil.md)
- [applications/notation-input.md](applications/notation-input.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)
- [context/music-as-language.md](context/music-as-language.md)

## Pedagogical Independence
✅ Yes