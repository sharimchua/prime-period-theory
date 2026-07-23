---
type: reference
title: OKF Architectural Analysis
description: Auto-generated graph metrics and health analysis of the OKF repository.
timestamp: 2026-07-23
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
**Generated:** 2026-07-23 12:18:25

## God Concepts (Refactor Candidates)
<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;">
<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.
</div>

| File | Fan-Out | Size (chars) | H2 Sections |
|------|---------|--------------|-------------|
| [domains/timbre.md](domains/timbre.md) | 3 | 7109 | 5 |
| [structure/musicoil.md](structure/musicoil.md) | 11 | 20997 | 11 |
| [domains/rhythm.md](domains/rhythm.md) | 7 | 12194 | 10 |
| [domains/pitch.md](domains/pitch.md) | 4 | 5710 | 6 |
| [specifications/midi-solfege-input.md](specifications/midi-solfege-input.md) | 6 | 6783 | 7 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 8 | 11389 | 8 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 6 | 12482 | 10 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 4 | 16404 | 12 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 8 | 16334 | 12 |
| [foundations/periodicity.md](foundations/periodicity.md) | 6 | 6233 | 7 |
| [foundations/period.md](foundations/period.md) | 5 | 6643 | 6 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 5 | 7341 | 7 |
| [domains/rhythmic-overtone-series.md](domains/rhythmic-overtone-series.md) | 9 | 10958 | 9 |
| [extended/ppt-feature-taxonomy.md](extended/ppt-feature-taxonomy.md) | 11 | 15059 | 7 |
| [structure/coil-notation.md](structure/coil-notation.md) | 5 | 9185 | 8 |
| [foundations/prime-families.md](foundations/prime-families.md) | 9 | 7741 | 8 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 8 | 18214 | 16 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 5 | 6938 | 8 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 13 | 27654 | 13 |

## Metrics Top 15 (by Fan-in)
| File | Fan-In | Fan-Out | Instability | H2 | Size |
|------|--------|---------|-------------|----|------|
| [foundations/prime-families.md](foundations/prime-families.md) | 20 | 9 | 0.31 | 8 | 7741 |
| [foundations/periodicity.md](foundations/periodicity.md) | 18 | 6 | 0.25 | 7 | 6233 |
| [uniform-solfege/index.md](uniform-solfege/index.md) | 14 | 8 | 0.36 | 8 | 11389 |
| [reference/metric-duperiod.md](reference/metric-duperiod.md) | 13 | 8 | 0.38 | 12 | 16334 |
| [perception/temporal-place-limen.md](perception/temporal-place-limen.md) | 13 | 5 | 0.28 | 7 | 7341 |
| [domains/rhythm.md](domains/rhythm.md) | 12 | 7 | 0.37 | 10 | 12194 |
| [ppd/index.md](ppd/index.md) | 11 | 3 | 0.21 | 7 | 4327 |
| [foundations/prime-lattice.md](foundations/prime-lattice.md) | 10 | 13 | 0.57 | 13 | 27654 |
| [structure/melodic-grammar.md](structure/melodic-grammar.md) | 9 | 6 | 0.4 | 10 | 12482 |
| [foundations/amplitude-time.md](foundations/amplitude-time.md) | 9 | 5 | 0.36 | 8 | 6938 |
| [domains/timbre.md](domains/timbre.md) | 8 | 3 | 0.27 | 5 | 7109 |
| [structure/coil-notation.md](structure/coil-notation.md) | 8 | 5 | 0.38 | 8 | 9185 |
| [structure/rhythmic-grammar.md](structure/rhythmic-grammar.md) | 8 | 8 | 0.5 | 16 | 18214 |
| [domains/pitch.md](domains/pitch.md) | 7 | 4 | 0.36 | 6 | 5710 |
| [uniform-solfege/diacritic-system.md](uniform-solfege/diacritic-system.md) | 7 | 4 | 0.36 | 12 | 16404 |

## Graph Topology
The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.