---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-08-27
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
**Generated:** 2026-08-27 12:17:06

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 9 | 18214 | 16 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 10 | 11389 | 8 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [index.md](index.md) | 82 | 17408 | 9 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 20 | 54 | 8 | 7741 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 19 | 45 | 7 | 6233 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 15 | 10 | 0.4 | 3 | 28 | 8 | 11389 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 6 | 25 | 7 | 7341 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 4 | 25 | 10 | 12194 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 7 | 29 | 12 | 16334 |
| [ppd/index.md](ppd/index.md) | 12 | 3 | 0.2 | 1 | 16 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 10 | 34 | 13 | 27654 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 15 | 31 | 8 | 9185 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 16 | 33 | 10 | 12482 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 1 | 14 | 5 | 7109 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 18 | 34 | 8 | 6938 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 9 | 9 | 0.5 | 14 | 32 | 16 | 18214 |
| [domains/pitch.md](domains/pitch.md) | 9 | 4 | 0.31 | 17 | 30 | 6 | 5710 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 9 | 4 | 0.31 | 2 | 15 | 12 | 16404 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [index.md](index.md) | 9 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |

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
- [perception/temporal-place-limen.md](perception/temporal-place-limen.md)
- [domains/rhythm.md](domains/rhythm.md)
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [ppd/index.md](ppd/index.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [domains/timbre.md](domains/timbre.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [domains/pitch.md](domains/pitch.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [foundations/period.md](foundations/period.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [context/music-as-language.md](context/music-as-language.md)
- [applications/notation-input.md](applications/notation-input.md)
- [structure/musicoil.md](structure/musicoil.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)

## Pedagogical Independence
✅ Yes