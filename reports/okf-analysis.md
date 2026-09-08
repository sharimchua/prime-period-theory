---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-09-08
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
**Generated:** 2026-09-08 12:14:39

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [applications/notation-input.md](applications/notation-input.md) | 6 | 8627 | 8 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [pedagogy/ear-first.md](pedagogy/ear-first.md) | 7 | 5025 | 5 |
| [pedagogy/index.md](pedagogy/index.md) | 9 | 5228 | 5 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 6 | 7827 | 9 |
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [structure/musicoil.md](structure/musicoil.md) | 13 | 20997 | 11 |
| [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md) | 6 | 9610 | 7 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 6 | 6938 | 8 |
| [foundations/periodicity.md](foundations/periodicity.md) | 7 | 6233 | 7 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [foundations/period.md](foundations/period.md) | 6 | 6643 | 6 |
| [tuning/tetrachord-pairs.md](tuning/tetrachord-pairs.md) | 9 | 13419 | 8 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 7 | 12482 | 10 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 12 | 13132 | 10 |
| [applications/component-philosophy.md](applications/component-philosophy.md) | 6 | 6140 | 6 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 18824 | 16 |
| [index.md](index.md) | 85 | 17842 | 9 |
| [foundations/prime-families.md](foundations/prime-families.md) | 12 | 7741 | 8 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 6 | 5315 | 9 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 7 | 6783 | 7 |
| [piano-triangles/index.md](piano-triangles/index.md) | 7 | 11998 | 12 |
| [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md) | 5 | 9124 | 6 |
| [structure/coil-notation.md](structure/coil-notation.md) | 6 | 9185 | 8 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 6 | 8056 | 9 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |
|------|--------|---------|-------------|-------|------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 22 | 12 | 0.35 | 28 | 62 | 8 | 7741 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 20 | 12 | 0.38 | 10 | 42 | 10 | 13132 |
| [foundations/periodicity.md](foundations/periodicity.md) | 19 | 7 | 0.27 | 32 | 58 | 7 | 6233 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 14 | 8 | 0.36 | 21 | 43 | 12 | 16334 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 14 | 5 | 0.26 | 20 | 39 | 7 | 7341 |
| [domains/rhythm.md](domains/rhythm.md) | 14 | 7 | 0.33 | 18 | 39 | 10 | 12194 |
| [ppd/index.md](ppd/index.md) | 13 | 3 | 0.19 | 25 | 41 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 11 | 13 | 0.54 | 24 | 48 | 13 | 27654 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 11 | 11 | 0.5 | 17 | 39 | 16 | 18824 |
| [domains/timbre.md](domains/timbre.md) | 10 | 3 | 0.23 | 3 | 16 | 5 | 7109 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 10 | 6 | 0.38 | 31 | 47 | 8 | 6938 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 | 7 | 0.41 | 12 | 29 | 10 | 12482 |
| [structure/coil-notation.md](structure/coil-notation.md) | 10 | 6 | 0.38 | 13 | 29 | 8 | 9185 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 9 | 4 | 0.31 | 26 | 39 | 12 | 16404 |
| [domains/pitch.md](domains/pitch.md) | 9 | 4 | 0.31 | 2 | 15 | 6 | 5710 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.

## Dead Concepts
None detected.

## Cohesion Warnings
| File | H2 Sections |
|------|-------------|
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 12 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 12 |
| [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md) | 9 |
| [structure/musicoil.md](structure/musicoil.md) | 11 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 |
| [domains/rhythmic-phase-coherence.md](domains/rhythmic-phase-coherence.md) | 9 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 10 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 10 |
| [domains/rhythm.md](domains/rhythm.md) | 10 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 16 |
| [index.md](index.md) | 9 |
| [related/chromatic-clock.md](related/chromatic-clock.md) | 9 |
| [applications/song-sphere.md](applications/song-sphere.md) | 12 |
| [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md) | 10 |
| [piano-triangles/index.md](piano-triangles/index.md) | 12 |
| [pedagogy/default-do.md](pedagogy/default-do.md) | 9 |

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
- [reference/metric-duperiod.md](reference/metric-duperiod.md)
- [perception/temporal-place-limen.md](perception/temporal-place-limen.md)
- [domains/rhythm.md](domains/rhythm.md)
- [ppd/index.md](ppd/index.md)
- [foundations/prime-lattice.md](foundations/prime-lattice.md)
- [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md)
- [domains/timbre.md](domains/timbre.md)
- [foundations/amplitude-time.md](foundations/amplitude-time.md)
- [structure/melodic-grammar.md](structure/melodic-grammar.md)
- [structure/coil-notation.md](structure/coil-notation.md)
- [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md)
- [domains/pitch.md](domains/pitch.md)
- [foundations/period.md](foundations/period.md)
- [piano-triangles/index.md](piano-triangles/index.md)
- [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md)
- [related/chromatic-clock.md](related/chromatic-clock.md)
- [tuning/just-intonation.md](tuning/just-intonation.md)
- [implementations/ppt-components.md](implementations/ppt-components.md)
- [uniform-solfege/base-12-algebra.md](uniform-solfege/base-12-algebra.md)
- [uniform-solfege/geometric-basis.md](uniform-solfege/geometric-basis.md)
- [related/tritone-pitch-naming.md](related/tritone-pitch-naming.md)
- [applications/component-philosophy.md](applications/component-philosophy.md)
- [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md)
- [pedagogy/axis-fan-pedagogy.md](pedagogy/axis-fan-pedagogy.md)
- [applications/notation-input.md](applications/notation-input.md)
- [ppd/glyph-forms.md](ppd/glyph-forms.md)
- [pedagogy/ear-first.md](pedagogy/ear-first.md)
- [structure/musicoil.md](structure/musicoil.md)
- [context/music-as-language.md](context/music-as-language.md)
- [applications/three-layer-coil-editor.md](applications/three-layer-coil-editor.md)
- [pedagogy/default-do.md](pedagogy/default-do.md)

## Pedagogical Independence
✅ Yes