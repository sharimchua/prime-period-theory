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
**Generated:** 2026-08-28 11:42:45

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md) | 5 | 9124 | 6 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 12 | 13132 | 10 |
| [tuning/tetrachord-pairs.md](tuning/tetrachord-pairs.md) | 9 | 13419 | 8 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [index.md](index.md) | 85 | 17842 | 9 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 18824 | 16 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 6 | 5315 | 9 |
| [piano-triangles/index.md](piano-triangles/index.md) | 7 | 11998 | 12 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md) | 6 | 9610 | 7 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 6 | 8056 | 9 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 25 | 59 | 8 | 7741 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 20 | 12 | 0.38 | 10 | 42 | 10 | 13132 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 24 | 50 | 7 | 6233 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 31 | 50 | 7 | 7341 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 3 | 24 | 10 | 12194 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 30 | 52 | 12 | 16334 |
| [ppd/index.md](ppd/index.md) | 13 | 3 | 0.19 | 18 | 34 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 27 | 51 | 13 | 27654 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 11 | 0.5 | 12 | 34 | 16 | 18824 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 14 | 30 | 8 | 9185 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 13 | 30 | 10 | 12482 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 1 | 14 | 5 | 7109 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 23 | 39 | 8 | 6938 |
| [foundations/period.md](foundations/period.md) | 9 | 6 | 0.4 | 29 | 44 | 6 | 6643 |
| [piano-triangles/index.md](piano-triangles/index.md) | 9 | 7 | 0.44 | 9 | 25 | 12 | 11998 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [uniform-solfege/index.md](uniform-solfege/index.md) | 10 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [index.md](index.md) | 9 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 9 |
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [piano-triangles/index.md](piano-triangles/index.md) | 12 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 9 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |

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
- [domains/rhythm.md](domains/rhythm.md)
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [ppd/index.md](ppd/index.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [domains/timbre.md](domains/timbre.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [foundations/period.md](foundations/period.md)
- [piano-triangles/index.md](piano-triangles/index.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [domains/pitch.md](domains/pitch.md)
- [related/chromatic-clock.md](related/chromatic-clock.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [pedagogy/ear-first.md](pedagogy/ear-first.md)
- [structure/musicoil.md](structure/musicoil.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)
- [pedagogy/default-do.md](pedagogy/default-do.md)
- [context/music-as-language.md](context/music-as-language.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)
- [applications/notation-input.md](applications/notation-input.md)

## Pedagogical Independence
✅ Yes