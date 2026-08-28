---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-08-28
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
**Generated:** 2026-08-28 11:24:38

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [index.md](index.md) | 84 | 17715 | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [piano-triangles/index.md](piano-triangles/index.md) | 7 | 11998 | 12 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 11 | 12180 | 9 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 6 | 8056 | 9 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 18824 | 16 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [tuning/tetrachord-pairs.md](tuning/tetrachord-pairs.md) | 9 | 13419 | 8 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 23 | 57 | 8 | 7741 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 28 | 54 | 7 | 6233 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 18 | 11 | 0.38 | 7 | 36 | 9 | 12180 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 15 | 36 | 10 | 12194 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 17 | 36 | 7 | 7341 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 18 | 40 | 12 | 16334 |
| [ppd/index.md](ppd/index.md) | 12 | 3 | 0.2 | 22 | 37 | 7 | 4327 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 11 | 0.5 | 14 | 36 | 16 | 18824 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 21 | 45 | 13 | 27654 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 30 | 46 | 8 | 6938 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 9 | 26 | 10 | 12482 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 27 | 40 | 5 | 7109 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 10 | 26 | 8 | 9185 |
| [foundations/period.md](foundations/period.md) | 9 | 6 | 0.4 | 19 | 34 | 6 | 6643 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 9 | 4 | 0.31 | 1 | 14 | 12 | 16404 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [index.md](index.md) | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |
| [piano-triangles/index.md](piano-triangles/index.md) | 12 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 9 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 9 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 9 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |

## Duplication Warnings
| File A | File B | Similarity | Text A Snippet |
|--------|--------|------------|----------------|

## Coverage
| Metric | Percentage |
|--------|------------|
| Examples | 24.7% |
| References | 67.1% |
| Implementations | 9.4% |
| Pedagogy | 9.4% |

## Foundational Concepts
- [foundations/prime-families.md](foundations/prime-families.md)
- [foundations/periodicity.md](foundations/periodicity.md)
- [uniform-solfege/index.md](uniform-solfege/index.md)
- [domains/rhythm.md](domains/rhythm.md)
- [perception/temporal-place-limen.md](perception/temporal-place-limen.md)
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [ppd/index.md](ppd/index.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [domains/timbre.md](domains/timbre.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [foundations/period.md](foundations/period.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [domains/pitch.md](domains/pitch.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [piano-triangles/index.md](piano-triangles/index.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [related/chromatic-clock.md](related/chromatic-clock.md)
- [pedagogy/ear-first.md](pedagogy/ear-first.md)
- [structure/musicoil.md](structure/musicoil.md)
- [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)
- [applications/notation-input.md](applications/notation-input.md)
- [pedagogy/default-do.md](pedagogy/default-do.md)
- [context/music-as-language.md](context/music-as-language.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)

## Pedagogical Independence
✅ Yes