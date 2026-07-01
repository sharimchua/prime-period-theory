---
type: concept
title: Prime Period Diacritics — Overview
description: >
  Prime Period Diacritics (PPD) is a standalone diacritic system for marking sub-period positions on any base figure, derived from PPT's prime family structure.
tags:
  - prime-period-diacritics
  - notation
  - microtonality
  - prime-period-theory
timestamp: 2026-07-01
---

# Prime Period Diacritics

## What Prime Period Diacritics is

PPD is a standalone diacritic system for marking sub-period positions on any base figure. It is derived from PPT's prime family structure and is applicable wherever a period needs to be subdivided — pitch notation, rhythmic duration markers, amplitude or effect envelopes, or any parameter that varies across a repeating cycle.

It is used by Uniform Solfège as its microtonal extension layer, but is specified independently so it can be applied to other notational contexts.

## Relationship to the comma system

Prime Period Diacritics is the **writing system** for a more abstract
mathematical layer: the prime lattice comma system. In the comma system,
any microtonal position is described as an ordered sequence of
`{ prime, step }` entries navigating from a solfège anchor through the
prime lattice. See [Prime Lattice](../foundations/prime-lattice.md) for
the full mathematical treatment.

PPD glyph forms are visual renderings of specific comma values — the
most musically useful lattice positions, rendered as marks on a solfège
character. The relationship is analogous to decimal notation and real
numbers: the decimal system renders rational approximations of a
continuous space; PPD renders practical visual approximations of the
prime lattice. The lattice itself is finer than any finite glyph set.

Where this document describes a diacritic as indicating a specific tuning
deviation, the equivalent comma representation is a `{ prime, step }`
entry or sequence in the [MIDI to Solfège Input Specification](../specifications/midi-solfege-input.md)
output type.

## Directional convention

PPD glyphs encode direction as clockwise (positive, period expansion,
flatter) and withershins (negative, period compression, sharper). In the
underlying comma system, the same directions are encoded as positive
integer steps (period expansion) and negative integer steps (period
compression). The clockwise/withershins visual convention and the
positive/negative step convention are equivalent representations of
the same directional relationship.

## Core principle

Any period has a base position (0) and an Axis position (+1/2, the point equidistant between adjacent bases). Between these two poles, positions are defined by prime-ratio subdivision. Diacritics mark deviation from base within the range (−1/2, +1/2], where −1/2 is excluded by periodicity (it is equivalent to the prior period's +1/2).

## The prime families

| Family | Prime (p) | Unique forms needed | Positions |
|--------|-----------|---------------------|-----------|
| Du | 2 | 1 | +1/2 (Axis only) |
| Tri | 3 | 1 (+mirror) | ±1/3 |
| DuTri | 2×3 | 1 (+mirror) | ±1/6 |
| Qui | 5 | 2 (+mirror) | ±1/5, ±2/5 |
| Sep | 7 | 3 (+mirror) | ±1/7, ±2/7, ±3/7 |
| Undec | 11 | 5 (+mirror) | ±1/11 … ±5/11 |

Note: DuTri is a fractal compound — Du applied within a Tri segment — not a base prime. The naming convention `Du[Family]` generalises: DuQui = ±1/10, DuSep = ±1/14, etc. Glyph forms for non-Du fractal compounds are reserved for future extension; the principle is defined here but glyphs are not yet specified.

## Axis-proximity design principle

> When a position's proximity to Axis (1/2) exceeds its proximity to Base (0), the diacritic should visually inherit from the Axis glyph form rather than the Base glyph form.

Threshold: position > 1/4. This applies explicitly in Sep (+3/7 ≈ 0.429) and Undec (+4/11 ≈ 0.364, +5/11 ≈ 0.455).

## Fractal Du depth (Du family only)

The Du diacritic (Axis stroke) supports fractal subdivision to four levels, encoding depth via small triangle offsets on the Axis stroke itself:

| Depth | Position | Fraction |
|-------|----------|----------|
| 1 | ±1/2 | Axis |
| 2 | ±1/4 | Du of Axis |
| 3 | ±1/8 | Du of Du of Axis |
| 4 | ±1/16 | Du of Du of Du of Axis |

Fractal depth for non-Du families is theoretically defined but not currently specified in glyph form.

See [Glyph Forms](glyph-forms.md) for visual specifications.
