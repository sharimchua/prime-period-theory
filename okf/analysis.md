---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-09-04
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
**Generated:** 2026-09-04 12:40:17

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |
| [piano-triangles/index.md](piano-triangles/index.md) | 7 | 11998 | 12 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 6 | 8056 | 9 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [index.md](index.md) | 85 | 17842 | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 6 | 5315 | 9 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [tuning/tetrachord-pairs.md](tuning/tetrachord-pairs.md) | 9 | 13419 | 8 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 12 | 13132 | 10 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |
| [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md) | 6 | 9610 | 7 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 18824 | 16 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md) | 5 | 9124 | 6 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 24 | 58 | 8 | 7741 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 20 | 12 | 0.38 | 10 | 42 | 10 | 13132 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 23 | 49 | 7 | 6233 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 6 | 25 | 7 | 7341 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 11 | 33 | 12 | 16334 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 4 | 25 | 10 | 12194 |
| [ppd/index.md](ppd/index.md) | 13 | 3 | 0.19 | 1 | 17 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 14 | 38 | 13 | 27654 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 11 | 0.5 | 18 | 40 | 16 | 18824 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 22 | 38 | 8 | 6938 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 19 | 35 | 8 | 9185 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 1 | 14 | 5 | 7109 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 20 | 37 | 10 | 12482 |
| [piano-triangles/index.md](piano-triangles/index.md) | 9 | 7 | 0.44 | 9 | 25 | 12 | 11998 |
| [domains/pitch.md](domains/pitch.md) | 9 | 4 | 0.31 | 21 | 34 | 6 | 5710 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [piano-triangles/index.md](piano-triangles/index.md) | 12 |
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 9 |
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |
| [index.md](index.md) | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 9 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 10 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |

## Duplication Warnings
| File A | File B | Similarity | Text A Snippet |
|--------|--------|------------|----------------|

## Coverage
| Metric | Percentage |
|--------|------------|
| Examples | 25.6% |
| References | 68.6% |
| Implementations | 9.3% |
| Pedagogy | 9.3% |

## Foundational Concepts
- [foundations/prime-families.md](foundations/prime-families.md)
- [uniform-solfege/index.md](uniform-solfege/index.md)
- [foundations/periodicity.md](foundations/periodicity.md)
- [perception/temporal-place-limen.md](perception/temporal-place-limen.md)
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [domains/rhythm.md](domains/rhythm.md)
- [ppd/index.md](ppd/index.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [domains/timbre.md](domains/timbre.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [piano-triangles/index.md](piano-triangles/index.md)
- [domains/pitch.md](domains/pitch.md)
- [foundations/period.md](foundations/period.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [related/chromatic-clock.md](related/chromatic-clock.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md)
- [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md)
- [context/music-as-language.md](context/music-as-language.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)
- [pedagogy/default-do.md](pedagogy/default-do.md)
- [applications/notation-input.md](applications/notation-input.md)
- [structure/musicoil.md](structure/musicoil.md)
- [pedagogy/ear-first.md](pedagogy/ear-first.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)

## Pedagogical Independence
✅ Yes