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

## Overview

The Uniform Solfège diacritic system encodes sub-semitone pitch positions through a set of geometrically distinct, prime-family-specific marks applied to the base chromatic solfège glyphs. Each diacritic family corresponds to a prime number and subdivides the chromatic semitone (100¢) into exact rational intervals — no decimal approximation, no rounding.

The system comprises **two functionally distinct families**:

- **Approximation family**: Du (prime 2), including Fractal Du — a recursive binary subdivision system
- **Exact families**: Tri, Qui, Sep, UnDec (primes 3, 5, 7, 11) — fixed rational targets

These two families are structurally and semantically separate and should not be conflated.

---

## Reference Interval

All diacritics operate within a single chromatic semitone. The reference interval is **100¢** (one semitone), consistent across all prime families. The base solfège syllables (Do, Di, Re, Ri, Me, Mi, Fi, Se, So, Si, La, Ti) are the shared zero-reference points — chromatic anchors common to all families.

---

## Solfège Symbol Range

Each solfège symbol owns a 100¢ space. The boundary conditions are:

- **Base (0¢)**: the exact chromatic anchor — undecorated glyph
- **Axis (50¢)**: the midpoint between chromatic anchors — the terminal point of the solfège range and threshold of the Du approximation space

The full range of any solfège symbol runs from **UnDecSub5** (≈ -90.91¢ from the next Base) through to **Axis** (50¢). The first position of any solfège symbol is UnDecSub5, whose moon diacritics open toward the previous symbol's Axis — directionally honest across the boundary.

---

## Family 1: Du (Prime 2) — Approximation Family

Du is the prime-2 family. It is structurally distinct from the exact prime families — rather than targeting fixed JI ratios, it provides a **recursive binary subdivision** of the space between chromatic anchors. Du positions are dyadic rationals, which are dense in pitch space and can approximate any pitch to arbitrary precision with sufficient depth.

### Du States

| Name | Position | Description |
|------|----------|-------------|
| Base | 0¢ | Exact chromatic anchor — undecorated |
| Axis | 50¢ | Midpoint — threshold of Du Fractal space |

Axis is the entry point to the Fractal Du system, not a member of the Tri exact family.

### Fractal Du

Fractal Du subdivides the space between Base and Axis (and Axis and the next Base) via binary halving. Each level of subdivision is encoded as a **bitmask** on an extended axis crossbar:

- **0** = flat side (withershins, toward Sub)
- **1** = sharp side (clockwise, toward Sup)

The path reads from most significant bit (coarsest split) to least significant bit (finest):

```
Depth 1 (÷4):   0 = 25¢       1 = 75¢
Depth 2 (÷8):   00 = 12.5¢    01 = 37.5¢    10 = 62.5¢    11 = 87.5¢
Depth 3 (÷16):  000 = 6.25¢   001 = 18.75¢  ...           111 = 93.75¢
Depth 4 (÷32):  0000 = 3.125¢ ...                          1111 = 96.875¢
```

÷32 (depth 4) has precedent in 32nd-note notation and is included for completeness. ÷16 (depth 3) is at or below the threshold of pitch discrimination in most musical contexts (~6¢).

**Bitmask algebraic properties:**
- Bitwise NOT gives the tritone complement (structurally meaningful — 50¢ is the axis midpoint)
- Bitwise AND gives the coarsest shared subdivision floor between two positions
- Bitwise XOR gives the irreducible difference — the minimal ornamentation path
- Carry propagation maps onto subdivision consolidation (two ⅛ steps = one ¼ step)

**Visual encoding:** the axis crossbar is extended to provide legibility clearance for decorations. Direction is encoded by arrowhead/triangle orientation — clockwise for sharp side, withershins for flat side. Decoration count and position encode binary value, analogous to beam stacking in standard notation.

### Shorthand Notation

Fractal Du positions use the **Dox** shorthand, extending the existing DoAxis (Dox) convention:

| Shorthand | Long form | Position |
|-----------|-----------|----------|
| Dox | DoAxis | 50¢ |
| Doxo | DoAxis0 | 25¢ |
| Doxi | DoAxis1 | 75¢ |
| Doxoo | DoAxis00 | 12.5¢ |
| Doxoi | DoAxis01 | 37.5¢ |
| Doxio | DoAxis10 | 62.5¢ |
| Doxii | DoAxis11 | 87.5¢ |

The `x` marks the Axis threshold; `o` = 0 (flat side); `i` = 1 (sharp side). This convention extends to all solfège roots (Sox, Soxo, etc.). No delimiter is needed — solfège syllables terminate at non-numeric characters, preventing parsing conflict with Ra/Ti as chromatic syllables.

---

## Family 2: Tri (Prime 3) — Exact Family

Tri is the prime-3 family. It is geometrically expressed as **two interlocking triangles** within the semitone, each with three points. Together they produce six evenly-spaced positions per semitone — the ÷6 subdivision required for 72-EDO coverage across all 12 chromatic tones.

**The ÷6 denominator** reflects the LCM of primes 2 and 3, providing the pathway to 72-EDO and 31-EDO support. Each individual triangle is a pure ÷3 structure.

### Two Triangles

**BaseTri** — triangle rooted at Base (point at 0¢):
- Sub (−33.33¢ from Base): double-flat equivalent — the honest flat
- HalfSub (−16.67¢ from Base): half-flat
- Base (0¢): the chromatic anchor

**AxisTri** — triangle rooted at Axis (point at 50¢):
- HalfSup (+16.67¢ from Base): half-sharp  
- Sup (+33.33¢ from Base): double-sharp equivalent — the honest sharp
- Axis (50¢): Du threshold

### Full Tri Sequence

| Position | Triangle | ¢ from Base | Accidental analogy |
|----------|----------|-------------|-------------------|
| Sub | BaseTri | −33.33¢ | 𝄫 double flat |
| HalfSub | AxisTri | −16.67¢ | ♭ flat |
| Base | — | 0¢ | ♮ natural |
| HalfSup | AxisTri | +16.67¢ | ♯ sharp |
| Sup | BaseTri | +33.33¢ | 𝄪 double sharp |
| Axis | Du | +50¢ | threshold |

**Naming rationale:** Sub/Sup are BaseTri members (wider deviation, double accidental weight). HalfSub/HalfSup are AxisTri members (narrower deviation, single accidental weight). The Half prefix directly communicates proximity to Base without requiring knowledge of triangle geometry.

**Musical significance:** BaseTri Sub/Sup at ±33.33¢ are more honest representations of sharps and flats than 12-EDO's equal-tempered approximation. AxisTri HalfSub/HalfSup at ±16.67¢ provide genuine quarter-tone positions as first-class notation rather than extended-notation afterthoughts.

---

## Family 3: Qui (Prime 5) — Exact Family

Qui subdivides the semitone into 5 equal parts. Diacritics are built on the DuTri tick system with a crossed-line ornament.

| Position | ¢ from Base |
|----------|-------------|
| QuiSub2 / HalfQuiSub | −40¢ |
| QuiSub1 / QuiSub | −20¢ |
| Base | 0¢ |
| QuiSup1 / QuiSup | +20¢ |
| QuiSup2 / HalfQuiSup | +40¢ |

---

## Family 4: Sep (Prime 7) — Exact Family

Sep subdivides the semitone into 7 equal parts. Diacritics extend the tick system with circle ornaments.

| Position | ¢ from Base |
|----------|-------------|
| SepSub3 / HalfSepSub | −42.86¢ |
| SepSub2 | −28.57¢ |
| SepSub1 / SepSub | −14.29¢ |
| Base | 0¢ |
| SepSup1 / SepSup | +14.29¢ |
| SepSup2 | +28.57¢ |
| SepSup3 / HalfSepSup | +42.86¢ |

---

## Family 5: UnDec (Prime 11) — Exact Family

UnDec subdivides the semitone into 11 equal parts. Unlike other exact families, UnDec uses a **moon-based diacritic system** rather than tick-derived marks, providing five positions per side from Base.

### Moon Diacritics

The diacritics are constructed from circle and half-circle (moon) primitives placed at the perpendicular cardinal of the glyph:

| Position | Diacritic | Visual |
|----------|-----------|--------|
| UnDecSub5 | Two waning moons | Openings toward Base — furthest from Axis |
| UnDecSub4 | One waning moon | Opening toward Base |
| UnDecSub3 | Full circle | Midpoint of Sub arc |
| UnDecSub2 | One waxing moon | Opening toward Axis |
| UnDecSub1 | Two waxing moons | Openings toward Axis — closest to Base |
| Base | Undecorated | — |
| UnDecSup1 | Two waxing moons | Mirror of Sub1 |
| UnDecSup2 | One waxing moon | Mirror of Sub2 |
| UnDecSup3 | Full circle | Midpoint of Sup arc |
| UnDecSup4 | One waning moon | Mirror of Sub4 |
| UnDecSup5 | Two waning moons | Mirror of Sub5 |

**Waxing/waning direction encodes proximity:** moons opening toward Axis = closer to center; moons opening toward Base = further from center. The full circle at Sub3/Sup3 is the natural midpoint anchor. No conflict with Sep circles or Qui crosses — moon forms are geometrically distinct.

**Boundary note:** UnDecSub5 at −90.91¢ is the first position of any solfège symbol. Its moon openings gesture toward the previous symbol's Axis — directionally honest at the boundary.

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

All family denominators taken together:

**LCM(6, 4, 5, 7, 11) = 4620 units per semitone**

Including Fractal Du ÷32: **LCM × 32/4 = 9240 units per semitone**

Every family's positions land exactly on the 4620 grid:

| Family | Grid units per step |
|--------|-------------------|
| DuTri (÷6) | 770 |
| Fractal Du ÷4 | 1155 |
| Qui (÷5) | 924 |
| Sep (÷7) | 660 |
| UnDec (÷11) | 420 |

### Cross-Family Arithmetic and Remainders

Within-family arithmetic is always closed and exact — n/p ± m/p = (n±m)/p, always the same prime family.

Cross-family arithmetic (e.g. a Qui point ± a Sep point) produces exact rationals on the 4620 grid but with denominators (e.g. 35, 55, 77) not covered by any single diacritic family. These residuals are **PPT commas** — irreducible gaps between prime families, exact and nameable.

**Named commas identified:**
- **Sep/UnDec comma**: 100/77¢ (≈1.30¢) — appears twice symmetrically around 50¢
- **Sep/DuTri comma**: 100/42¢ (≈2.38¢)

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
- **Algebraic layer**: 9240-grid remainders for exact cross-family arithmetic

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
- Complete glyph design specifications for Qui, Sep diacritics (tick variants)
- FontForge implementation: GSUB lookup structure, GPOS axis-relative mark attachment anchors
- PUA codepoint block allocation for MusiCoil

---

*See also: [Geometric Basis](geometric-basis.md) for glyph architecture (three-zone structure, axis-relative remainder placement, rotational identity of the four arc families).*
