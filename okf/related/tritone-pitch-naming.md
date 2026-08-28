---
type: concept
title: Tri Pitch-Class Notation
description: >
  A tritone-based pitch-class naming scheme providing unambiguous, closed-noun
  letter-names for the five chromatic accidentals based on tritone relationships to natural notes.
tags:
  - pitch-naming
  - tritone
  - notation
  - accidentals
  - chromatic-clock
  - 12-tet
status: draft
timestamp: 2026-08-28
contrasts_with:
  - uniform-solfege/index.md
  - piano-triangles/index.md
depends_on:
  - related/chromatic-clock.md
  - related/tone-atlas.md
  - tuning/12-tet.md
  - pedagogy/axis-fan-pedagogy.md
---

# Tri Pitch-Class Notation

## What it is

**Tri pitch-class notation** is an absolute pitch-class naming scheme for twelve-tone equal temperament (12TET). It assigns each of the five chromatic accidentals a single, unambiguous letter-name derived from its tritone relationship to a diatonic natural note.

```
       Tri-C (F#/Gb)
             ^
             |  (6 semitones)
             v
             C
```

### Distinction from Uniform Solfège

It is important to distinguish Tri notation from [Uniform Solfège](../uniform-solfege/index.md):

- **Uniform Solfège** is a **relative interval and scale-degree numeral system** operating in base-12 (Do, Ra, Re, Me, Mi, Fa, Fi, So, Le, La, Te, Ti), describing relational distance from a moveable or fixed tonic.
- **Tri Pitch-Class Notation** is an **absolute pitch-class naming layer** using letter symbols. It identifies specific chromatic pitch classes without altering or replacing the functional degree system.

The two systems are complementary: Uniform Solfège calculates structural intervals across pitch, rhythm, and timbre, while Tri notation provides a concise, absolute pitch vocabulary when interacting with 12TET instruments and traditional letter-name contexts.

## Core definition: The five Tri pairs

For any natural note `X`, `Tri(X)` names the pitch class exactly one tritone (6 semitones, or half an octave) above `X`.

The twelve chromatic pitches in 12TET divide into seven natural notes (white keys on a keyboard) and five accidentals (black keys). Every accidental possesses exactly one natural tritone partner, producing five canonical Tri pairs:

| Natural Note (`X`) | Tri Pitch Name | Enharmonic Equivalent | Mod-12 Offset (`X + 6`) |
|---|---|---|---|
| **C** | **Tri-C** | F&#9839; / G&#9837; | 0 + 6 = 6 |
| **D** | **Tri-D** | G&#9839; / A&#9837; | 2 + 6 = 8 |
| **E** | **Tri-E** | A&#9839; / B&#9837; | 4 + 6 = 10 |
| **G** | **Tri-G** | C&#9839; / D&#9837; | 7 + 6 = 1 (13 mod 12) |
| **A** | **Tri-A** | D&#9839; / E&#9837; | 9 + 6 = 3 (15 mod 12) |

### The B and F exclusion boundary

The natural notes **B** and **F** are excluded from the Tri naming scheme. 

B and F are separated by 6 semitones and form the only **natural-to-natural tritone pair** within the diatonic collection — the historical *diabolus in musica* among the white notes. Because B and F are already both natural letter names, neither qualifies as an accidental, and neither takes a Tri prefix.

This exclusion is not an edge case; it is a foundational boundary condition of the 7+5 chromatic partition. As detailed below, this boundary recurs across scale-spelling mechanics and circle-of-fifths mnemonics.

## Notation and pronunciation

### Written form
In written notation, Tri pitch classes are represented by drawing a symmetrical triangle glyph around or above the natural letter (e.g. `△A` or an enclosed `A` within a triangle), matching playing-card iconography. Because equilateral and isosceles triangles can be drawn orientation-symmetrically, the symbol reads identically when rotated 180&deg;.

### Spoken form
In spoken usage, the prefix **"Tri-"** is simply prepended to the natural letter name:
- `Tri-C` (*"try-see"*)
- `Tri-D` (*"try-dee"*)
- `Tri-E` (*"try-ee"*)
- `Tri-G` (*"try-jee"*)
- `Tri-A` (*"try-ay"*)

A dedicated phonetic marker (such as a dental-fricative prefix) was evaluated during development and rejected in favour of plain, clear pronunciation.

## Relationship to sharps and flats

The central design principle of Tri notation is a clean separation of roles between pitch identity and functional voice leading:

1. **Sharps and flats are functional operators on natural letters.** They modify a natural pitch while preserving its specific letter slot in a heptatonic scale. For instance, in G&#9837; major, the fourth scale degree is spelled C&#9837; (rather than B) because every heptatonic scale requires exactly one instance of each letter from A to G in sequence.
2. **Tri names are closed nouns.** A Tri name designates a concrete pitch-class identity on equal footing with the natural letters A–G. Because there are exactly five Tri names mapping 1:1 to the five accidentals, there is no letter-slot redundancy, and therefore no structural need or allowance for stacking an accidental onto a Tri name.

```
Functional operator:   Natural Letter (C) + Flat (b)  -> Cb (preserves 4th degree slot in Gb major)
Closed noun:          Tri-E                           -> Absolute pitch class (A#/Bb)
```

Expressions such as *"Tri-C-Sharp"* are invalid in the syntax. While it is an algebraic curiosity that `Tri(X)` and a semitone shift commute under modulo-12 addition — meaning `Tri(C#)` and `(Tri-C)#` both evaluate to 7 (G) — stacking accidentals onto Tri names was discarded to keep the five accidental nouns closed and unambiguous.

## Compact scale shorthand

Tri notation provides a compact single-character shorthand for transcribing scales and melodies using a lower-case `t` prefix:

- **G Major**: `G A B C D E tC` (F&#9839; = `Tri-C`)
- **D Major**: `D E tC G A B tG` (F&#9839; = `Tri-C`, C&#9839; = `Tri-G`)
- **F Major**: `F G A tE C D E` (B&#9837; = `Tri-E`)
- **A Major**: `A B tG D E tC tA` (C&#9839; = `Tri-G`, F&#9839; = `Tri-C`, G&#9839; = `Tri-D` — where `tA` = D&#9839;/E&#9837;, `tG` = C&#9839;/D&#9837;, `tC` = F&#9839;)

### Structural vs carried-over accidentals

When reading multi-accidental scales in Tri shorthand, an important structural distinction applies:
- In any major scale, scale degree 4 and scale degree 7 form the essential diatonic tritone that drives dominant-to-tonic resolution (the active tritone in the `V7` chord).
- In compact Tri spelling, only the **final accidental** introduced before the octave represents this structural 4th-to-7th tritone partner for that key.
- Any earlier accidental in the string is a **carried-over key-signature accidental** from preceding fifth-cycle steps, not a unique structural interval of that specific mode.

For example, in D Major (`D E tC G A B tG`), `tG` (C&#9839;) is the leading tone forming the structural tritone with `G` (degree 4). The earlier `tC` (F&#9839;) is a carried-over accidental from G Major.

## Circle of fifths relationships

### Mnemonic generation
Around the circle of fifths, Tri notation provides a direct algebraic mnemonic for key signature progression among natural keys:

1. **Sharp-wise progression (+7 semitones):** Moving up by a fifth from tonic `X`, the newly introduced sharp accidental is always `Tri(X)` (the Tri name of the previous tonic).
   - `C Major` &rarr; `G Major`: new accidental is `Tri-C` (F&#9839;).
   - `G Major` &rarr; `D Major`: new accidental is `Tri-G` (C&#9839;).
   - `D Major` &rarr; `A Major`: new accidental is `Tri-D` (G&#9839;).
   - `A Major` &rarr; `E Major`: new accidental is `Tri-A` (D&#9839;).
   - `E Major` &rarr; `B Major`: new accidental is `Tri-E` (A&#9839;).

   *Algebraic proof:* In 12TET, the leading tone of key `(X + 7)` is `(X + 7 - 1) = (X + 6) mod 12`. By definition, `Tri(X) = (X + 6) mod 12`. Thus, `Tri(old tonic)` identically computes the leading tone of the new fifth-step key.

2. **Flat-wise progression (-7 / +5 semitones):** Moving down by a fifth to new tonic `Y`, the newly introduced flat accidental is removed or identified via `Tri(Y)`:
   - `C Major` &rarr; `F Major`: new accidental is `Tri-E` (B&#9837;), the subdominant degree.

### Breakdown at the B/F boundary
This mnemonic operates seamlessly across natural heptatonic roots but breaks at the **B/F seam**:
- When moving from `B Major` to `F# Major`, the newly raised seventh is spelled `E#` rather than a Tri-name, because `F` is already claimed as the letter name of the new tonic itself (`F#`).
- This breakdown stems from the same structural boundary condition that excludes B and F from having Tri names.

### Visual symmetry on the circle of fifths

When the circle of fifths is oriented with **D** at the top (12 o'clock) and its tritone partner **Tri-D / A&#9837;** at the bottom (6 o'clock):

```
                     D (12:00)
             G               A
         C                       E
      F                             B (3:00)  <-- B-F Mirror Axis
   Tri-E                           Tri-G
      Tri-A                     Tri-C
             Tri-D / Ab (6:00)
```

1. **Mirror symmetry across the B–F horizontal axis:**
   - Reflecting across the horizontal axis passing through B (3 o'clock) and F (9 o'clock) maps natural notes to natural notes (`D` &harr; `Tri-D`, `G` &harr; `Tri-A`, `C` &harr; `Tri-E`, `A` &harr; `Tri-C`, `E` &harr; `Tri-G`) and accidentals to accidentals.
2. **Antipodal (180&deg; rotational) symmetry:**
   - Across any orientation, diametrically opposite notes on the circle of fifths are tritone pairs.
   - *Precision note:* Mirror reflection across the B-F axis and 180&deg; antipodal rotation are distinct geometric operations. Only the `D` / `Tri-D` pair simultaneously coincides under both transformations in this orientation.

## See also

- [Chromatic Clock Geometry](chromatic-clock.md) — 12-tone circle geometry and tritone antipodal axes
- [Tone Atlas](tone-atlas.md) — visual mapping of pitch relationships and subclock navigation
- [12-Tone Equal Temperament (12TET)](../tuning/12-tet.md) — the 12-tone anchor grid
- [Axis-Fan Pedagogy](../pedagogy/axis-fan-pedagogy.md) — tritone-first pedagogical harmony sequence
- [Uniform Solfège Overview](../uniform-solfege/index.md) — base-12 relational interval notation
- [Piano Triangle Notation](../piano-triangles/index.md) — base-3 ergonomic keyboard notation
