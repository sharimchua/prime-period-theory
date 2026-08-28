---
type: concept
title: Fretboard Leaps and Seam Crossing
description: >
  An extension of triangle skip-marker grammar to guitar fretboard intervals,
  formalising the major-third tuning seam and string-crossing leap calculations.
tags:
  - notation
  - guitar
  - fretboard
  - piano-triangles
  - tuning
  - uniform-solfege
  - prime-period-theory
status: experimental
timestamp: 2026-08-28
depends_on:
  - piano-triangles/index.md
  - pedagogy/default-do.md
extends:
  - structure/rhythmic-grammar.md
contrasts_with:
  - uniform-solfege/index.md
---

# Fretboard Leaps and Seam Crossing

## Status

This page is a companion extension to [Piano Triangle Notation](index.md),
applying PPT's boundary-marker principles to stringed instruments with non-uniform
interval lattices.

## The isomorphic lattice with one seam

The guitar fretboard is largely an isomorphic 2D lattice: across most adjacent
strings, the interval is a uniform **perfect fourth** (5 semitones, 3-prime
Pythagorean generator). However, to facilitate six-string chord voicings,
standard tuning introduces a single **major third** seam (4 semitones, 5-prime
Ptolemaic generator):

- In **Standard Tuning** (`E2–A2–D3–G3–B3–E4`), the seam sits between strings 3
  and 2 (`G–B`).
- In **D-Standard Tuning** (`D2–G2–C3–F3–A3–D4`, the primary working tuning for
  PPT string research), the seam sits between strings 3 and 2 (`F–A`).

This asymmetry is the exact stringed-instrument analogue to the piano's two
black-key gaps (`E–F` and `B–C`). In both instruments, a predominantly uniform
geometric grid contains a small, fixed number of documented exceptions where
spatial shifts occur.

## The general leap formula

When calculating the physical fret position of an interval leaping across multiple
strings, the displacement on the destination string follows a simple linear
formula:

```
offset = (interval_in_semitones - 5 * strings_apart) + (1 if seam crossed else 0)
```

Where:
- `offset` is the number of frets relative to the origin fret on the destination
  string (e.g., `+1` means one fret higher, `0` means the same fret).
- `interval_in_semitones` is the interval size (e.g., octave = 12, major tenth = 16).
- `strings_apart` is the difference in string indices (`destination_string - origin_string`).
- The correction term `+1` is added if and only if the path crosses the `G–B` (or `F–A`) seam.

### Worked reference table

The following table demonstrates the formula across common melodic and harmonic
leaps in both standard and D-standard tunings:

| Interval | Semitones | Strings Apart | String Pair (Standard) | String Pair (D-Standard) | Seam Crossed? | Formula Calculation | Fret Offset |
|---|---|---|---|---|---|---|---|
| **Major 10th** | 16 | 3 | E (6) → G (3) | D (6) → F (3) | No | `16 - (5 * 3) + 0` | **+1 fret** |
| **Major 10th** | 16 | 3 | A (5) → B (2) | G (5) → A (2) | **Yes** | `16 - (5 * 3) + 1` | **+2 frets** |
| **Octave (P8)** | 12 | 2 | E (6) → D (4) | D (6) → C (4) | No | `12 - (5 * 2) + 0` | **+2 frets** |
| **Octave (P8)** | 12 | 2 | D (4) → B (2) | C (4) → A (2) | **Yes** | `12 - (5 * 2) + 1` | **+3 frets** |
| **Perfect 5th (P5)** | 7 | 1 | E (6) → A (5) | D (6) → G (5) | No | `7 - (5 * 1) + 0` | **+2 frets** |
| **Perfect 5th (P5)** | 7 | 1 | G (3) → B (2) | F (3) → A (2) | **Yes** | `7 - (5 * 1) + 1` | **+3 frets** |
| **Minor 7th (m7)** | 10 | 2 | E (6) → D (4) | D (6) → C (4) | No | `10 - (5 * 2) + 0` | **0 (same fret)** |
| **Minor 7th (m7)** | 10 | 2 | D (4) → B (2) | C (4) → A (2) | **Yes** | `10 - (5 * 2) + 1` | **+1 fret** |

## The seam-crossing flag

In notation and tabulation systems, crossing the fretboard seam can be explicitly
flagged by reusing the bare-letter skip marker from
[Piano Triangle Notation](index.md) and
[Rhythmic Grammar](../structure/rhythmic-grammar.md).

Rather than inventing an ad-hoc guitar symbol, the occurrence of a bare marker
indicates a boundary step in an otherwise uniform lattice.

### Future abstraction

The emergence of the same structural pattern across both piano and guitar — a
**uniform lattice + single documented seam + bare-marker flag** — suggests a
potential higher-level PPT primitive for instrument topography. For now, this is
retained as a concrete observation across the two instrument families, awaiting
further corpus and pedagogical testing before formal abstraction.

## See also

- [Piano Triangle Notation](index.md) — core ergonomic notation and skip-marker grammar
- [Rhythmic Grammar](../structure/rhythmic-grammar.md) — token chaining and the axis skip-marker precedent
- [Default Do (12TET Keyboard)](../pedagogy/default-do.md) — keyboard topographical symmetry around D
- [Uniform Solfège — Overview](../uniform-solfege/index.md) — the isomorphic notation layer
