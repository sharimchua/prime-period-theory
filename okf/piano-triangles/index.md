---
type: concept
title: Piano Triangle Notation
description: >
  An ergonomic keyboard notation system dividing the twelve-tone octave into four
  three-note triangle groups anchored to D, encoding scales as tetrachord chains
  and voicings through geometric segment ordering.
tags:
  - notation
  - keyboard
  - piano-triangles
  - ergonomics
  - tetrachord
  - uniform-solfege
  - prime-period-theory
status: experimental
timestamp: 2026-08-28
depends_on:
  - pedagogy/default-do.md
  - tuning/tetrachord-pairs.md
  - related/chromatic-clock.md
  - pedagogy/axis-fan-pedagogy.md
extends:
  - structure/rhythmic-grammar.md
contrasts_with:
  - uniform-solfege/index.md
used_by:
  - piano-triangles/fretboard-leaps.md
---

# Piano Triangle Notation

## Status

This is an experimental, actively developing notation layer within Prime Period
Theory. It explores physical keyboard topography and hand-shape ergonomics
rather than replacing the abstract algebraic layers of the framework. Several
design areas — including non-heptatonic set encodings, multi-octave skip markers,
and chord shape taxonomies — remain open questions under active investigation.

## The problem this solves

The standard 12TET piano keyboard is fundamentally non-isomorphic: its black-key
layout alternates between groups of two and three keys across the twelve-tone
octave. Consequently, no single geometric glyph shape can represent all twelve
pitch classes isomorphically while remaining legible at a glance regarding
which specific keys are black or white under the hand.

[Uniform Solfège](../uniform-solfege/index.md) addresses the algebraic and
intervallic challenge by rotating a single glyph family across four quadrants,
ensuring strict geometric isomorphism across pitch, rhythm, and timbre.

Piano Triangle Notation solves a complementary problem: **piano-hand legibility
and physical topography**. Where Uniform Solfège trades immediate physical
legibility for structural isomorphism, Piano Triangle Notation trades
isomorphism for direct, tactile legibility on the keyboard. These are two
distinct tools designed for different purposes, sitting side by side within the
broader PPT framework.

## The four triangles

The twelve chromatic pitches from C# to C are partitioned into four consecutive
three-key groups, anchored centrally around D as the primary tonic axis (as
developed in [Default Do (12TET Keyboard)](../pedagogy/default-do.md)):

| Name | Alias | Pitches | Geometric Shape | Apex Direction |
|---|---|---|---|---|
| **Down** | D | C#, D, D# | Inverted equilateral triangle | Points down (into the central white key) |
| **Left** | L | E, F, F# | Right triangle (right angle on right) | Points up |
| **Up** | U | G, G#, A | Equilateral triangle | Points up |
| **Right** | R | A#, B, C | Right triangle (right angle on left) | Points up |

### Geometric and topological rationale

The geometry of these four groups reflects the physical topography of the
keyboard and its mapping onto the chromatic pitch circle:

1. **Equilateral axes (Down and Up):** The Down (C#, D, D#) and Up (G, G#, A)
   triangles sit on the vertical axis of the chromatic circle (see
   [Chromatic Clock Geometry](../related/chromatic-clock.md)). On the physical
   keybed, each consists of one raised black key symmetrically flanked by two
   flat white keys.
2. **Truncated right triangles (Left and Right):** Left (E, F, F#) and Right
   (A#, B, C) occupy the horizontal positions. On the piano, E–F and B–C are the
   two locations where no black key intervenes. The black-key-flanked-by-white
   symmetry is truncated at these seams; Left and Right are geometrically "half"
   of what would otherwise be equilateral clusters.
3. **Continuous zigzag contour:** The hypotenuse of each right triangle runs at
   the exact same slope as the adjacent edge of the neighbouring equilateral
   triangle. Across the entire twelve-tone octave, the four-triangle chain
   traces a single continuous zigzag contour across the keybed tops.
4. **Apex orientation:** The apex of each triangle corresponds to the raised
   black key (or the truncated black-key corner). "Up" and "Down" designate
   orientation along the pitch clock's primary vertical axis.

## Prior art: US Patent US4054079

In 1976, US Patent US4054079 ("Keyboard and Notation System", invented by
Clinton S. Beman, filed as a continuation of abandoned 1975 application Ser. No.
557,592) independently proposed grouping the twelve piano keys into four
symmetrical three-key groups (each comprising one raised key flanked by two flat
keys). 

While addressing the same fundamental asymmetry of the traditional keyboard,
there are fundamental structural differences:
- **Physical re-engineering vs notational overlay:** US Patent US4054079
  redesigns the physical instrument by manufacturing custom, uniform-width keys.
  Piano Triangle Notation requires no physical modification, functioning as an
  ergonomic mental map and notational layer on standard keyboards.
- **C-anchor vs D-anchor / tritone symmetry:** The 1976 patent anchors its
  groups to C for traditional staff-notation compatibility. Piano Triangle
  Notation anchors centrally to D and the vertical tritone axis, integrating
  directly with PPT's tetrachord-pair generation and generative grammar.

## Point numbering

Each triangle contains three points, numbered `1`, `2`, and `3` in ascending
pitch order within that triangle:

| Triangle | Point 1 | Point 2 | Point 3 |
|---|---|---|---|
| **Down (D)** | C# | D | D# |
| **Left (L)** | E | F | F# |
| **Up (U)** | G | G# | A |
| **Right (R)** | A# | B | C |

- A **single note** is written as the triangle letter followed by the point digit
  (e.g., `D2` = D, `U1` = G, `R3` = C).
- A **cluster of notes** within the same triangle is written as the triangle
  letter followed by concatenated digits in ascending pitch order (e.g., `D12` =
  C# + D, `L13` = E + F#).

## Scale encoding: tetrachord chaining around the tonic

Scale encoding directly renders the principles established in
[Tetrachord-Pair Generation of Heptatonic Scales](../tuning/tetrachord-pairs.md).
Rather than listing pitches as an arbitrary set, a heptatonic scale is
constructed by chaining the dominant tetrachord into the tonic tetrachord
around the tonal centre:

```
[5, 6, 7] + [1] + [2, 3, 4]
```

To encode a scale:
1. Write the scale in tonic-centred order: `[5, 6, 7]` (dominant fragment),
   `[1]` (tonic), and `[2, 3, 4]` (tonic fragment).
2. Transcribe each note into its triangle-point representation.
3. Merge adjacent notes that fall within the same triangle into a single
   concatenated segment.

### Worked examples

#### D Major
- **Pitches:** D (1), E (2), F# (3), G (4), A (5), B (6), C# (7)
- **Tonic-centred sequence:** `[A, B, C#] + [D] + [E, F#, G]`
- **Unmerged segments:** `A (U3)`, `B (R2)`, `C# (D1)`, `D (D2)`, `E (L1)`, `F# (L3)`, `G (U1)`
- **Merged encoding:** `U3R2D12L13U1`

Here, `C# (D1)` and `D (D2)` merge into `D12`, while `E (L1)` and `F# (L3)` merge
into `L13`.

#### C Major
- **Pitches:** C (1), D (2), E (3), F (4), G (5), A (6), B (7)
- **Tonic-centred sequence:** `[G, A, B] + [C] + [D, E, F]`
- **Unmerged segments:** `G (U1)`, `A (U3)`, `B (R2)`, `C (R3)`, `D (D2)`, `E (L1)`, `F (L2)`
- **Merged encoding:** `U13R23D2L12`

Here, `G` and `A` merge into `U13`, `B` and `C` merge into `R23`, `D` stands
alone as `D2`, and `E` and `F` merge into `L12`.

### Emergent structural properties

Whether the tonic merges with an adjacent leading tone (as `C#+D` forming `D12`
in D major) or remains an isolated segment (as `D2` in C major) is an emergent
structural property of the scale's position relative to the keyboard's triangle
boundaries. The notation visually reveals the topographical "hand-feel" of the
scale without requiring secondary fingering annotations.

## Chord encoding and voicings

Chords follow the same triangle-point syntax. However, chord shapes are not
isomorphic across transpositions on the piano; the notation reflects exact
physical topography rather than abstract chord quality.

### Triad examples
- **C major triad (C, E, G):** `R3L1U1` (three distinct triangles, skipping Down).
- **Observation on triad distributions:** Major and minor triads typically
  engage three separate triangles while skipping one. Diminished triads (whose
  notes are spaced by minor thirds, 3 semitones) frequently repeat or cluster
  within triangles.

### Voicings and inversions

Segment ordering and adjacency encode register and voicing layout:
- **Dm7 close position (D, F, A, C):** `D2L2U3R3` (strict ascending sequence
  across all four triangles).
- **Dmaj7 root position (D, F#, A, C#):** `D2L3U3D1` (C# appears at the end,
  indicating it sits in the upper register of the Down triangle).
- **Dmaj7 with 7th in the bass (C#, D, F#, A):** `D12L3U3` (C# and D merge into
  `D12` at the front of the voicing).

A strict `D -> L -> U -> R` sequence with no repeated triangle indicates close
four-part voicing. A repeated or merged triangle identifies intervals within a
minor third, constraining voicing register without requiring separate octave
tags.

## Octave-skip marker

When a voicing or melody skips an octave across a triangle boundary, a bare
triangle letter (with no trailing point digits) denotes an octave leap. This
directly adapts the axis-diacritic and token-extension conventions established
in [Rhythmic Grammar](../structure/rhythmic-grammar.md).

- **Worked example:** `L3DD1` encodes `F# (L3)`, followed by an octave skip at
  the Down triangle (`D`), landing on `C# (D1)` in the higher octave.

### Self-disambiguation property

Because every substantive pitch segment contains at least one numeric digit
(`1`, `2`, or `3`), a bare alphabetic character (`D`, `L`, `U`, `R`) is
unambiguously parsed as an octave skip marker.

## Naming systems and collision warning

Two naming schemes exist for the four triangles:

1. **Primary / Pedagogical Scheme: Down / Left / Up / Right (`D`, `L`, `U`, `R`)**
   Prioritises tactile hand-shape and keyboard orientation. Recommended for all
   introductory teaching and practical execution.
2. **Alternate / Mnemonic Scheme: Do / Me / Fi / La (`D`, `M`, `F`, `L`)**
   Semantically grounded in solfège syllables spaced at equal minor-third
   intervals (0, 3, 6, 9 semitones from tonic D).

> [!WARNING]
> ### Letter Collision Warning
> In the primary scheme, **`L`** represents the **Left** triangle (E, F, F#).
> In the alternate solfège scheme, **`L`** represents **La** (the Right triangle,
> A#, B, C).
> 
> These two letter sets must **never** be silently mixed within the same
> document or dataset. When both schemes are presented together, the alternate
> solfège syllables must be written in lower-case (`d`, `m`, `f`, `l`) or
> spelled out in full (`Do`, `Me`, `Fi`, `La`).

*(Note: As an incidental mnemonic, `D` aligns pleasantly with Do, Down, and
Dorian when anchored on D.)*

## Encoding grammar summary

The formal grammar for Piano Triangle strings is defined as follows:

```
encoding        := (segment | skip-marker)+
segment         := triangle-letter point-digits
triangle-letter := "D" | "L" | "U" | "R"
point-digits    := [1-3]+  /* in strictly ascending pitch order */
skip-marker     := triangle-letter
```

## Open questions

1. **Non-heptatonic scale sets:** Whether pentatonic, whole-tone, and octatonic
   scales fit naturally into tetrachord chaining syntax or are better expressed
   as raw lit-point sets.
2. **Chord family taxonomy:** Systematic verification of triangle skipping and
   repetition patterns across extended chord families (9ths, 11ths, altered chords).
3. **Multi-octave skip markers:** Formalising the syntax for skips greater than
   one octave (e.g., whether `DD` represents a two-octave skip or collapses to a
   single skip).

## See also

- [Default Do (12TET Keyboard)](../pedagogy/default-do.md) — the pedagogical foundation for D-centred keyboard symmetry
- [Tetrachord-Pair Generation of Heptatonic Scales](../tuning/tetrachord-pairs.md) — the mathematical scale-generation theory rendered by triangle strings
- [Chromatic Clock Geometry](../related/chromatic-clock.md) — geometric axes and interval rotations on the 12-tone circle
- [Rhythmic Grammar](../structure/rhythmic-grammar.md) — generative token chaining and skip-marker precedent
- [Uniform Solfège — Overview](../uniform-solfege/index.md) — the isomorphic notation layer contrasted with ergonomic notation
- [Axis-Fan Pedagogy](../pedagogy/axis-fan-pedagogy.md) — tritone-first harmonic pedagogy aligned with the vertical axis
- [Fretboard Leaps and Seam Crossing](fretboard-leaps.md) — extending skip-marker grammar to guitar string crossings
