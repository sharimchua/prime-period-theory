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
timestamp: 2026-07-01
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

The twelve chromatic positions, their primary solfège names, and colour conventions mapped to base-12 numeral values. The bolded syllables represent the **primary naming hierarchy** (b2: Ra, b3: Me, #4: Fi, b6: Le, b7: Te), establishing a principled convention across the system. 

The colour convention assigns a specific hue to each interval class, aligning with the visual design of the Musical Tone Atlas. Do is anchored to Red (using the primary colour from the project logo).

| Position | Syllable | Variations | Colour | Interval from tonic | Prime family |
|---|---|---|---|---|---|
| 0 | <span class="solfege-append">**Do**</span> | | Red (`#E13610`) | Unison | 2-prime (octave axis) |
| 1 | <span class="solfege-append">**Ra**</span> | <span class="solfege-append">Di</span> | Orange (`#F98016`) | Minor 2nd | — |
| 2 | <span class="solfege-append">**Re**</span> | | Orange (`#F98016`) | Major 2nd | 3-prime (two fifths) |
| 3 | <span class="solfege-append">**Me**</span> | <span class="solfege-append">Ri</span> | Yellow (`#F5D432`) | Minor 3rd | — |
| 4 | <span class="solfege-append">**Mi**</span> | | Yellow (`#F5D432`) | Major 3rd | 5-prime |
| 5 | <span class="solfege-append">**Fa**</span> | | Green (`#43A440`) | Perfect 4th | 3-prime (inverse fifth) |
| 6 | <span class="solfege-append">**Fi**</span> | <span class="solfege-append">Se</span> | Black (`#141414`) | Tritone | Axis of symmetry |
| 7 | <span class="solfege-append">**So**</span> | | Blue (`#0032A4`) | Perfect 5th | 3-prime |
| 8 | <span class="solfege-append">**Le**</span> | <span class="solfege-append">Si</span> | Purple (`#5300A4`) | Minor 6th | — |
| 9 | <span class="solfege-append">**La**</span> | | Purple (`#5300A4`) | Major 6th | 5-prime (inverse third) |
| 10 | <span class="solfege-append">**Te**</span> | <span class="solfege-append">Li</span> | Magenta (`#F158A4`) | Minor 7th | 7-prime (approximation) |
| 11 | <span class="solfege-append">**Ti**</span> | <span class="solfege-append">Si</span> | Magenta (`#F158A4`) | Major 7th | — |

### Colour Semantics

The colour palette uses seven distinct hues to visually map the interval categories. While designed for visual clarity and harmony, the exact hex values are reverse-engineered to encode core acoustic, mathematical, and tuning references. This grounds the visual styling deeply into the Prime Period Theory philosophy:

- **Red (Do)**: `#E13610` — Earth resonance (136.10Hz).
- **Orange (Seconds)**: `#F98016` — **F 9:8 0 16**: Encodes the foundational ratios for seconds: the Major Second (9:8) and references the Minor Second (16:15).
- **Yellow (Thirds)**: `#F5D432` — **F5 D4 32**: Encodes the Major Third (5:4) and Perfect Fifth (3:2) which make up the major triad.
- **Green (Fourths)**: `#43A440` — **4:3 A440**: Encodes the Perfect Fourth ratio (4:3) alongside the international standard pitch A440.
- **Black (Tritone)**: `#141414` — **1.414**: The square root of 2, which is the exact mathematical centre of the octave defining the tritone in equal temperament.
- **Blue (Fifths)**: `#0032A4` — **3:2 A4**: Encodes the Perfect Fifth ratio (3:2) anchored to the A4 pitch class.
- **Purple (Sixths)**: `#5300A4` — **5:3 A4**: Encodes the Major Sixth ratio (5:3) anchored to A4.
- **Magenta (Sevenths)**: `#F158A4` — **F 15:8 A4**: Encodes the Major Seventh ratio (15:8) anchored to A4.

*Note: Chromatic positions 1, 3, 6, 8, 10 fall between prime-family generators. Their prime-family membership depends on the tuning system and harmonic context.*

### Context-specific naming variations

While the primary names above are the default, phonetically different options are used in specific contexts. For example, in **Rhythmic Grammar**:
- The syllable `Di` (a variation of `Ra`, the flat 2) is used as an accent marker, often functioning as a tritone resolution from the upbeat (`So`).
- The syllable `Si` replaces `Ti` to avoid the use of fricatives (dental T).

The preference for `Le` over `Si` at position 8 keeps the perfect 5th phoneme ('S' for `So`) unique within the primary naming set, and aligns visually with the purple colour identity of the sixths.

## As a numeral system

In base-12, the solfège syllables function exactly as digits. Arithmetic
operates as normal, with modular reduction at 12 (Do) for octave equivalence:

```
So (7) + Fa (5) = Do (12 mod 12 = 0)   — fifth + fourth = octave
Mi  (4) + Mi (4) = Le (8)              — third + third = minor sixth
So (7) + So (7) = Re (14 mod 12 = 2)  — fifth + fifth = major second
```

This means interval arithmetic is clock arithmetic. The Tone Atlas (clock-face
diagram) is a direct visual representation of this arithmetic — adding
intervals is rotation around the clock face.

**The prime generators as arithmetic operations:**

| Prime | Generator interval | Solfège | Value | Operation |
|---|---|---|---|---|
| 2 | Octave | Do | 0 (mod 12) | Identity / modular reset |
| 3 | Fifth | So | 7 | +7 mod 12 |
| 5 | Major third | Mi | 4 | +4 mod 12 |
| 7 | Harmonic seventh | Te | 10 | +10 mod 12 (approx) |
| 11 | Neutral third | — | ~5.5 | Requires microtonal extension |

Repeated application of a generator cycles through its prime family. So
applied 12 times visits all 12 chromatic positions (the circle of fifths) —
because 7 and 12 are coprime.

## Geometric encoding

The character set is not arbitrary. Each symbol is derived from geometric
principles related to the chromatic circle, so that:

- **Complementary interval pairs** share visual roots or are mirror images
  (intervals that sum to 12 are visually related)
- **The tritone** (Fi, position 6) has a visually distinctive symbol
  reflecting its unique role as the axis of symmetry
- **Interval families** (seconds, thirds, fourths/fifths, sixths, sevenths)
  share visual family characteristics within their rows

A musician who spends time with the character set absorbs the interval
geometry through the act of reading and writing — the notation teaches the
theory implicitly.

See [Geometric Basis](geometric-basis.md) for a full account of the
derivation principles.

## Microtonal extension

Uniform Solfège extends into microtonal space through a **prime-family diacritic system**. The microtonal extension layer uses [Prime Period Diacritics](../ppd/index.md), a system specified independently of Uniform Solfège and applicable across pitch, rhythm, and other periodic parameters. It comprises two functionally distinct families:

- **Approximation family**: Du (prime 2), a recursive binary subdivision system (e.g. `x` Axis bitmasks).
- **Exact families**: Tri, Qui, Sep, UnDec (primes 3, 5, 7, 11) — providing exact rational targets.

Each prime family uses distinct marks to subdivide the 100¢ semitone space. The system natively supports **3, 5, 7, and 11 limit divisions** between each solfège step. This yields a non-uniform but extremely high-resolution pitch lattice:

- **Non-uniformity**: Prime-ratio spacing mirrors harmonic series density (intervals are not equally spaced).
- **Resolution**: Total addressable pitch points across a full octave exceed 4,000 (12 chromatic positions × multi-limit divisions per step).
- **Expressiveness**: This allows representation of 12-EDO (no diacritics), 72-EDO (verified multi-limit optimum), just intonation ratios directly, and points between all of these — within a single coherent symbol system.

For example, the Tri (prime 3) family provides a 6-state system (÷6) that tiles the 72 EDO grid:

```
[base]Sub      →  −33.33¢
[base]HalfSub  →  −16.67¢
[base]         →   0¢
[base]HalfSup  →  +16.67¢
[base]Sup      →  +33.33¢
[base]Axis     →  +50¢
```

This precise geometric and logical framework provides perceptually exact notation up to the 11-limit and algebraically complete remainder structures on the 4620 LCM grid.

See [Diacritic System](diacritic-system.md) for the full specification.

## Triple-Context Symbol Usage

Uniform Solfège symbols serve three distinct contextual roles:

1. **Pitch solfège** — standard movable-tonic pitch naming.
2. **Harmonic notation** — chord roots and subscript alterations in the Three-Layer Coil Notation harmony layer.
3. **Rhythmic Grammar syllables** — block-length naming (DoSo, DoRe, etc.) with phonetic conventions that diverge from pitch context.

Two key principles govern this multi-context use:

- **Dental isolation principle**: In Rhythmic Grammar, the syllables `Do` and `Di` are the only dental-consonant syllables. They are chosen deliberately so that accent markers pop out of the syllable stream when vocalised (analogous to konnakol). All other rhythmic syllables use labial, velar, or lateral consonants.
- **The Li/Te homoglyph**: These share the same Uniform Solfège glyph but use different phonemes in rhythmic vs pitch context (`Li` in rhythmic grammar to avoid the dental T sound; `Te` in pitch solfège). The same glyph, different register.

## Relationship to existing solfège traditions

Uniform Solfège is not a replacement for existing traditions but a
generalisation. It is designed to be recognisable to practitioners of:

- **Western moveable-do** solfège (`Do Re Mi Fa So La Ti`)
- **Indian sargam** (`Sa Re Ga Ma Pa Dha Ni`) — the interval relationships
  are equivalent; the syllables differ
- **Fixed-do** traditions — Uniform Solfège can operate in fixed-do mode
  (where `Do` always = C) or moveable-do mode (where `Do` always = tonic)

The algebraic properties work in either mode; the choice is a matter of
context and preference.

## See also

- [Three-Layer Coil Notation](../related/coil-notation.md) — paper-writable surface syntax for the full PPT framework
- [Melodic Grammar](../related/melodic-grammar.md) — absolute vs intervallic melodic navigation in Uniform Solfège
- [Diacritic System](diacritic-system.md) — microtonal inflection
- [Geometric Basis](geometric-basis.md) — how symbols encode interval geometry
- [Base-12 Algebra](base-12-algebra.md) — clock arithmetic and interval composition
- [31 EDO](../tuning/31-edo.md) — the primary microtonal application
- [Prime Families](../foundations/prime-families.md) — the generators the system names
