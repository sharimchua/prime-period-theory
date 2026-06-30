---
type: index
title: Implementations — PPT Tool Register
description: >
  A register of existing PPT-related tools and implementations,
  recording what each covers, its PPT concept alignment, and its
  status relative to the canonical OKF framework.
tags:
  - implementations
  - tools
  - register
  - prime-period-theory
timestamp: 2026-07-01
---

# Implementations — PPT Tool Register

## Overview

This register tracks the tools and interactive implementations in the
PPT ecosystem. Entries are classified as **precursor** (built before
PPT formalisation, covers related ideas in non-PPT vocabulary) or
**canonical** (built explicitly on PPT principles using OKF as design
reference).

The distinction matters for agents working on the OKF: precursor tools
should be understood as context for how certain ideas developed, not
as authoritative implementations of PPT concepts. Canonical
implementations are the active development front and should be treated
as reference implementations of the applications layer.

## Register

| Tool | Domain | Type | URL | Status |
|---|---|---|---|---|
| Harmonic Geometry | Pitch / chord geometry | Precursor | harmonic-geometry.midlifemuso.com | Live |
| Note Navigation | Staff / instrument mapping | Precursor | note-navigation.midlifemuso.com | Live |
| Frequency Perception | Psychoacoustics / tuning | Precursor | frequency-perception.midlifemuso.com | Live |
| PPT Component Library | All domains | Canonical | ppt.midlifemuso.com/components | Active development |
| PPT Topics Site | All domains | Canonical | ppt.midlifemuso.com/topics | Active development |

## PPT concept coverage by tool

| PPT Concept | Covered by |
|---|---|
| Chord quality as geometry | Harmonic Geometry (precursor), PPT Tonal Clock (canonical) |
| Pitch-rhythm unification | PPT Metronome + Tonal Clock composition |
| Uniform Solfège | PPT Solfège Writer, PPT notation components |
| Metric DuPeriod visualisation | Frequency Perception (partial, precursor) |
| Prime families | PPT Tonal Clock colour system (canonical) |
| Just intonation / microtonality | Frequency Perception (precursor), PPT components (planned) |
| Rhythmic Grammar / polyrhythm | PPT Metronome (partial, canonical) |
| Transcription workflow | Planned |
| Play-along feedback | Planned |

## See also

- [Component Philosophy](../applications/component-philosophy.md) —
  the design principles governing canonical implementations
- Applications — the tool philosophy layer
- Harmonic Geometry — detailed entry
- [PPT Components](ppt-components.md) — detailed entry