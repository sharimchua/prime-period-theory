---
type: concept
title: Uniform Solfège — Diacritic System
description: >
  The Uniform Solfège diacritic system encodes sub-semitone pitch positions through a set of geometrically distinct, prime-family-specific marks applied to the base chromatic solfège glyphs.
tags:
  - uniform-solfege
  - diacritics
  - microtonality
  - prime-families
  - notation
  - prime-period-theory
timestamp: 2026-06-26
status: active
version: 2.0
relates-to:
  - uniform-solfege/geometric-basis
  - uniform-solfege/base-12-algebra
  - foundations/prime-families
  - tuning/72-edo-grid
---

# Diacritic System

> **Note:** The diacritic system described here is an application of
> [Prime Period Diacritics (PPD)](../ppd/index.md) to Uniform Solfège pitch
> space. Refer to PPD for the general specification; this document covers
> Uniform Solfège-specific mappings only.

## Overview

The Uniform Solfège diacritic system encodes sub-semitone pitch positions by applying Prime Period Diacritics (PPD) to the base chromatic solfège glyphs. Each diacritic family corresponds to a prime number and subdivides the chromatic semitone (100¢) into exact rational intervals — no decimal approximation, no rounding.

The system is built on the PPD families: Du (Axis), DuTri, Tri, Qui, Sep, and Undec. It comprises **two functionally distinct groups**:

- **Approximation family**: Du (prime 2), including Fractal Du — a recursive binary subdivision system
- **Exact families**: Tri, Qui, Sep, UnDec (primes 3, 5, 7, 11) — fixed rational targets

These two families are structurally and semantically separate and should not be conflated.

### The Tritone Axis and 11-Limit Convergence

The tritone position (Fi, position 6) is structurally unique in the system. While the 11-limit prime family natively yields an over-tritone (11:8) and an under-tritone (16:11), Uniform Solfège intentionally collapses this neighborhood into a single cardinal position mapped to the irrational geometric mean (square root of 2 over 1). 

This hybrid design delivers a "closed" geometric axis of symmetry for multi-domain base-12 algebra while gracefully acting as a structural proxy for the 11-limit tritone family. When strict acoustic realism or specific prime-limit alignments are required, the system utilizes the Undecimal diacritics as rational offsets from this geometric centre:

* **FiUnDecSub1** (or a customised Sub-inflection): Pulls the square root of 2 axis downward to approximate the pure acoustic resonance of the lesser-tritone (11:8).
* **FiUnDecSup1** (or a customised Sup-inflection): Pushes the square root of 2 axis upward to approximate the pure acoustic resonance of the greater-tritone (16:11).

> **Note on "Axis" across contexts:** The term Axis is used in three distinct
> ways within the PPT framework. (1) As the Du-family glyph: the horizontal
> crossbar at 50% of the period, the depth-1 Fractal Du position.
> (2) As the shared upper boundary of every period symbol's range: 50% is
> a common reference point across all families;
> DuTri inherits it as its
> sixth position. (3) In Rhythmic Grammar: the Axis suffix on Do and Di
> (written Dox, Dix) marks rhythmic block boundaries. This is a notational
> convention of Rhythmic Grammar, not a microtonal inflection. The three
> uses are contextually distinct and do not overlap.

---

## Romanized Notation Standard

To ensure machine parsability and consistent written communication, Uniform Solfège uses a standardized romanized string format to represent syllables, diacritics, and superscripts.

A full solfège token is constructed as a single continuous string without spaces, following these rules:

1. **Base Solfège**: Must be exactly two characters in title case (`[A-Z][a-z]`), matching the twelve base chromatic syllables (e.g., `Do`, `Re`, `Fi`).
2. **Diacritic Suffix**: If a diacritic is applied, it immediately follows the base syllable in title case. The standard suffixes are:
   - `Sub`: Withershins (negative Tri)
   - `HalfSub`: Withershins (negative DuTri)
   - `HalfSup`: Deosil (positive DuTri)
   - `Sup`: Deosil (positive Tri)
   - `Axis`: The 50¢ Du boundary
   - `x`: A convenient shorthand for `Axis` (e.g., `Dox` is exactly equivalent to `DoAxis`)
3. **Superscript Concatenation**: Superscripts (used for remainder sub-glyphs or cross-family notation) are concatenated using the caret (`^`) symbol. The string following the caret is parsed as its own complete solfège token.

**Examples:**
- `Do` — Base chromatic syllable
- `ReSub` — Re with a negative Tri diacritic (withershins)
- `Dox` or `DoAxis` — Do with the Axis diacritic (50¢)
- `Dox^ReSub` — Do with the Axis diacritic, hosting a superscript of `ReSub`

---

## Reference Interval

All diacritics operate within a single chromatic semitone. The reference interval is **100¢** (one semitone), consistent across all prime families. The base solfège syllables (Do, Di, Re, Ri, Me, Mi, Fi, Se, So, Si, La, Ti) are the shared zero-reference points — chromatic anchors common to all families.

---

## Solfège Symbol Range

Each solfège symbol owns a 100¢ space. The boundary conditions are:

- **Base (0¢)**: the exact chromatic anchor — undecorated glyph
- **Axis (50¢)**: the midpoint between chromatic anchors — the terminal point of the solfège range and threshold of the Du approximation space

The full range of any solfège symbol runs from **UnDecSub5** through to **Axis** (50¢). The widest negative reach of any diacritic is UnDecSub5 at −5/11 of the period (≈ −45.45%). This stays within the valid symbol range of (−50%, +50%] — the period boundary at −50% (the adjacent symbol's Axis) is never crossed or reached. The opening direction of the UnDecSub5 moon glyph (toward the previous symbol's Axis) is directionally honest: it signals proximity to −50%, the territory boundary, without crossing it.

---

## Glyph Forms Summary

For the full visual specification of diacritic shapes, see [PPD Glyph Forms](../ppd/glyph-forms.md). When applied to Uniform Solfège, these forms interact with the specific geometry of the solfège characters (the rotated U with decorated arms):

| Family | Forms | Uniform Solfège Specifics |
|--------|-------|---------------------------|
| Du (Axis) | Horizontal stroke | Passes through the vertical arms of the base character. Extended for Fractal Du to provide legibility clearance. |
| Tri / DuTri | Triangles | Attached at the base character perimeter. |
| Qui | Triangle + T-cross | Pointing away from the base character perimeter. |
| Sep | Ticks / capped strokes | Placed on the 3 o'clock side (positive) or 9 o'clock side (negative) of the base character. |
| Undec | Moons | Placed at the cardinal points (3 o'clock or 9 o'clock). |

---

## Pitch Position Mappings

The following tables show how the PPD positions map specifically to cents from the Base chromatic anchor.

### Du (Prime 2) — Approximation Family

Fractal Du subdivides the space between Base and Axis via binary halving.

| Depth | Shorthand | Position (¢) |
|-------|-----------|--------------|
| 1 | Dox | 50¢ |
| 2 | Doxo / Doxi | 25¢ / 75¢ |
| 3 | Doxoo / Doxio | 12.5¢ / 62.5¢ |

### Tri (Prime 3) — Exact Family

Tri provides six evenly-spaced positions per semitone, combining to tile the 72 EDO grid.

| Position | ¢ from Base | Accidental analogy |
|----------|-------------|-------------------|
| Sub | −33.33¢ | 𝄫 double flat |
| HalfSub | −16.67¢ | ♭ flat |
| Base | 0¢ | ♮ natural |
| HalfSup | +16.67¢ | ♯ sharp |
| Sup | +33.33¢ | 𝄪 double sharp |
| Axis | +50¢ | threshold |

### Qui (Prime 5) — Exact Family

| Position | ¢ from Base |
|----------|-------------|
| QuiSub2 / HalfQuiSub | −40¢ |
| QuiSub1 / QuiSub | −20¢ |
| Base | 0¢ |
| QuiSup1 / QuiSup | +20¢ |
| QuiSup2 / HalfQuiSup | +40¢ |

### Sep (Prime 7) — Exact Family

| Position | ¢ from Base |
|----------|-------------|
| SepSub3 / HalfSepSub | −42.86¢ |
| SepSub2 | −28.57¢ |
| SepSub1 / SepSub | −14.29¢ |
| Base | 0¢ |
| SepSup1 / SepSup | +14.29¢ |
| SepSup2 | +28.57¢ |
| SepSup3 / HalfSepSup | +42.86¢ |

### UnDec (Prime 11) — Exact Family

| Position | ¢ from Base |
|----------|-------------|
| UnDecSub5 | −90.91¢ |
| UnDecSub4 | −81.82¢ |
| UnDecSub3 | −72.73¢ |
| UnDecSub2 | −63.64¢ |
| UnDecSub1 | −54.55¢ |
| Base | 0¢ |
| UnDecSup1 | +9.09¢ |
| UnDecSup2 | +18.18¢ |
| UnDecSup3 | +27.27¢ |
| UnDecSup4 | +36.36¢ |
| UnDecSup5 | +45.45¢ |

---

## Universal Grid and Remainder System

### LCM Grid

The base grid is derived from the LCM of the exact prime family
denominators: DuTri (÷6), Qui (÷5), Sep (÷7), and Undec (÷11).
LCM(6, 5, 7, 11) = 2310 units per period. This grid is not per semitone
specifically — it applies to any defined period: a solfège note's range,
an octave, a rhythmic cycle, a dynamic envelope. Du and Fractal Du sit
outside this grid as an approximation family; each depth of Fractal Du
doubles the grid resolution, extending 2310 to 4620 (depth 1), 9240
(depth 2), and so on.

The exact prime families and their period subdivisions are:

| Family | Subdivision |
|---|---|
| DuTri (compound of Tri + AxisTri) | ÷6 |
| Qui | ÷5 |
| Sep | ÷7 |
| Undec | ÷11 |

Each family's step size on this grid:

| Family | Grid units per step |
|---|---|
| DuTri (÷6) | 385 |
| Qui (÷5) | 462 |
| Sep (÷7) | 330 |
| Undec (÷11) | 210 |

| Fractal Du depth | Total grid units per period |
|---|---|
| Depth 0 (exact families only) | 2310 |
| Depth 1 (Axis included, ÷2) | 4620 |
| Depth 2 (÷4) | 9240 |
| Depth 3 (÷8) | 18480 |

### Cross-Family Arithmetic and Remainders

Within-family arithmetic is always closed and exact — n/p ± m/p = (n±m)/p, always the same prime family.

Cross-family arithmetic (e.g. a Qui point ± a Sep point) produces exact rationals on the 2310 grid (or 4620 at Fractal Du depth 1) but with denominators (e.g. 35, 55, 77) not covered by any single diacritic family. These residuals are **PPT commas** — irreducible gaps between prime families, exact and nameable.

**Named commas identified:**
- **Sep/UnDec comma**: 1/77 of the period (≈ 1.30¢ per semitone). Derived from the gap between SepSup2 (2/7) and UnDecSup3 (3/11): 2/7 − 3/11 = 1/77. — appears twice symmetrically around 50¢
- **Sep/DuTri comma**: 1/42 of the period (≈ 2.38¢ per semitone). Derived from the gap between SepSup1 (1/7) and DuTri HalfSup (1/6): 1/6 − 1/7 = 1/42.

### Do as Remainder Register

Any cross-family arithmetic remainder is sub-semitone by definition, so it always fits within the diacritic space. **Do (Base) is the canonical remainder register** — remainders are expressed as Do-anchored sub-glyphs regardless of which chromatic syllable hosts the primary diacritic.

This gives a natural **canonical form** for any pitch:
1. Base chromatic syllable — coarse position
2. Prime family diacritic — fine position within semitone
3. Do-anchored remainder sub-glyph — cross-family arithmetic residual (if needed)

The remainder sub-glyph occupies the **descent zone** of the host glyph (see Glyph Architecture). The Do-remainder is always a U-form (Do-oriented arc) since remainders are always Do-anchored — the descent zone is semantically typed, never ambiguous.

---

## Poly-Base Structure

The diacritic families form a **parallel multi-base coordinate system** on the same pitch line, unified at the chromatic anchor points. Key properties:

- Bases are **parallel**, not hierarchical (unlike mixed-radix systems)
- Moduli (2, 3, 5, 7, 11) are **coprime** — unique reconstruction from residues (cf. Chinese Remainder Theorem)
- Chromatic anchors are the **common zeros** across all families
- Diacritics are **mutually exclusive** — each pitch carries one family's diacritic only

This is not a tensor product or direct sum — it is a **partition of rational pitch space by prime family**, unified at the integers. No standard algebraic name exists for this structure; it is defined here as a foundational PPT construct.

### Practical Coverage

- **Perceptual layer**: primary diacritics to ~6¢ (Fractal Du ÷16)
- **Performance layer**: Fractal Du ÷32 to ~3¢ — human-articulable in rhythm, audible in sustained pitch
- **Algebraic layer**: 2310-grid remainders for exact cross-family arithmetic

The system is perceptually complete at the diacritic layer, algebraically complete at the remainder layer, and theoretically open via decimal extension.

---

## Applications

**Pitch:** honest representation of blue notes, just intonation chords, shruti positions, spectral partials — without approximation to 12-EDO. C# and D♭ are distinct pitches (BaseTri Sup and next-symbol BaseTri Sub) rather than collapsed into one equal-tempered slot.

**Rhythm:** prime family subdivision applies identically to rhythmic cycles. Tuplets in 5, 7, and 11 are first-class citizens. Polyrhythm across families (5 against 7) is Qui vs Sep subdivision of the same period. The Fractal Du bitmask maps directly onto standard beam notation — the isomorphism is explicit and teachable.

**Interval analysis:** any two pitches have exact rational distance. Cross-family intervals produce PPT commas as algebraic residues.

**Timbre:** harmonic partials are a prime-ratio structure. Spectral analysis uses the same coordinate system as pitch and rhythm.

---

## Relationship to Tuning Systems

- **72-EDO**: the six DuTri positions per semitone (÷6) exactly reproduce 72-EDO within the chromatic space. 72-EDO is an emergent property of the two interlocking Tri triangles, not a design target.
- **31-EDO**: BaseTri Sub/Sup at ±33.33¢ approximate the 31-EDO enharmonic distinction (~38.71¢) with a gap of ~5.38¢ — a nameable PPT comma. 72-EDO provides a good approximation grid for 31-EDO but not an exact one.

---

## Open Questions

- Formal naming and catalogue of all PPT commas derivable from cross-family arithmetic
- Decimal-place extension convention: notation for nested prime family diacritics as successive approximation digits
- FontForge implementation: GSUB lookup structure, GPOS axis-relative mark attachment anchors
- PUA codepoint block allocation for MusiCoil

---

*See also: [Geometric Basis](geometric-basis.md) for glyph architecture (three-zone structure, axis-relative remainder placement, rotational identity of the four arc families).*
