---
type: concept
title: Uniform Solfège — Overview
description: >
  Uniform Solfège is the notation layer of Prime Period Theory: a base-12
  numeral system using solfège syllables as digits, with a geometrically
  derived character set that encodes interval relationships visually.
tags:
  - uniform-solfege
  - notation
  - base-12
  - solfege
  - interval
  - clock-arithmetic
  - prime-period-theory
timestamp: 2026-06-19
---

# Uniform Solfège

## What it is

Uniform Solfège is the **notation layer** of Prime Period Theory. It is a
base-12 numeral system that uses solfège syllables as its digits — a
drop-in replacement for Arabic numerals when working in chromatic musical
space.

The key design principles are:

1. **Uniformity** — the same symbols describe pitch intervals, rhythmic
   ratios, and prime-family relationships, because these are structurally
   the same objects at different timescales.

2. **Geometric encoding** — the character set is derived from the geometry
   of the chromatic circle. Reading and writing the symbols teaches the
   underlying interval geometry by osmosis, without requiring explicit
   memorisation of rules.

3. **Base-12 foundation** — the chromatic octave divides into 12 equal
   positions. Base-12 arithmetic is a natural fit: 12 has factors 2, 3, 4,
   and 6, meaning thirds, fourths, and sixths all divide evenly. Clock
   arithmetic mod 12 handles enharmonic equivalence without remainder.

4. **Algebraic composability** — intervals can be added, subtracted, and
   combined using standard arithmetic in the base-12 system. Compound
   intervals are natural compositions; octave equivalence is modular
   reduction.

## The twelve positions

The twelve chromatic positions and their solfège names, mapped to base-12
numeral values:

| Position | Syllable | Interval from tonic | Prime family |
|---|---|---|---|
| 0 | **Do** | Unison | 2-prime (octave axis) |
| 1 | **Dop** | Minor 2nd | — |
| 2 | **Re** | Major 2nd | 3-prime (two fifths) |
| 3 | **Meb** | Minor 3rd | — |
| 4 | **Mi** | Major 3rd | 5-prime |
| 5 | **Fa** | Perfect 4th | 3-prime (inverse fifth) |
| 6 | **Fix** | Tritone | Axis of symmetry |
| 7 | **Sol** | Perfect 5th | 3-prime |
| 8 | **Leb** | Minor 6th | — |
| 9 | **La** | Major 6th | 5-prime (inverse third) |
| 10 | **Teb** | Minor 7th | 7-prime (approximation) |
| 11 | **Ti** | Major 7th | — |

*Note: chromatic positions 1, 3, 6, 8, 10 fall between prime-family
generators. Their prime-family membership depends on the tuning system and
harmonic context.*

## As a numeral system

In base-12, the solfège syllables function exactly as digits. Arithmetic
operates as normal, with modular reduction at 12 (Do) for octave equivalence:

```
Sol (7) + Fa (5) = Do (12 mod 12 = 0)   — fifth + fourth = octave
Mi  (4) + Mi (4) = Leb (8)              — third + third = minor sixth
Sol (7) + Sol (7) = Re (14 mod 12 = 2)  — fifth + fifth = major second
```

This means interval arithmetic is clock arithmetic. The Tone Atlas (clock-face
diagram) is a direct visual representation of this arithmetic — adding
intervals is rotation around the clock face.

**The prime generators as arithmetic operations:**

| Prime | Generator interval | Solfège | Value | Operation |
|---|---|---|---|---|
| 2 | Octave | Do | 0 (mod 12) | Identity / modular reset |
| 3 | Fifth | Sol | 7 | +7 mod 12 |
| 5 | Major third | Mi | 4 | +4 mod 12 |
| 7 | Harmonic seventh | Teb | 10 | +10 mod 12 (approx) |
| 11 | Neutral third | — | ~5.5 | Requires microtonal extension |

Repeated application of a generator cycles through its prime family. Sol
applied 12 times visits all 12 chromatic positions (the circle of fifths) —
because 7 and 12 are coprime.

## Geometric encoding

The character set is not arbitrary. Each symbol is derived from geometric
principles related to the chromatic circle, so that:

- **Complementary interval pairs** share visual roots or are mirror images
  (intervals that sum to 12 are visually related)
- **The tritone** (Fix, position 6) has a visually distinctive symbol
  reflecting its unique role as the axis of symmetry
- **Interval families** (seconds, thirds, fourths/fifths, sixths, sevenths)
  share visual family characteristics within their rows

A musician who spends time with the character set absorbs the interval
geometry through the act of reading and writing — the notation teaches the
theory implicitly.

See [Geometric Basis](geometric-basis.md) for a full account of the
derivation principles.

## Microtonal extension

Uniform Solfège extends into microtonal space through a **six-state diacritic
system** that tiles the 31 EDO and 72 EDO grids from 12TET anchor positions.

Each base position can be inflected by up to two steps in either direction,
plus an axis position at the exact midpoint between adjacent chromatic
positions:

```
[base]b   →  Sub2  (two steps flat)
[base]eb  →  Sub1  (one step flat)
[base]    →  Base  (12TET anchor)
[base]p   →  Sup1  (one step sharp)
[base]ep  →  Sup2  (two steps sharp)
[base]x   →  Axis  (midpoint / crossing)
```

This six-state system provides 6 × 12 = 72 positions — exactly the 72 EDO
grid — while also covering all 31 EDO positions when mapped against the
unequal semitone sizes in 31 EDO.

See [Diacritic System](diacritic-system.md) for the full specification.

## Relationship to existing solfège traditions

Uniform Solfège is not a replacement for existing traditions but a
generalisation. It is designed to be recognisable to practitioners of:

- **Western moveable-do** solfège (Do Re Mi Fa Sol La Ti)
- **Indian sargam** (Sa Re Ga Ma Pa Dha Ni) — the interval relationships
  are equivalent; the syllables differ
- **Fixed-do** traditions — Uniform Solfège can operate in fixed-do mode
  (Do always = C) or moveable-do mode (Do always = tonic)

The algebraic properties work in either mode; the choice is a matter of
context and preference.

## See also

- [Diacritic System](diacritic-system.md) — microtonal inflection
- [Geometric Basis](geometric-basis.md) — how symbols encode interval geometry
- [Base-12 Algebra](base-12-algebra.md) — clock arithmetic and interval composition
- [31 EDO](../tuning/31-edo.md) — the primary microtonal application
- [Prime Families](../foundations/prime-families.md) — the generators the system names
