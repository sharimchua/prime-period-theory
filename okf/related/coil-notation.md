---
type: concept
title: Three-Layer Coil Notation
description: >
  A paper-writable surface syntax unifying Uniform Solfège, Rhythmic Grammar,
  and MusiCoil into a three-layer grid notation for harmony, melody, and rhythm.
  The handwriting register of the PPT framework.
tags:
  - notation
  - coil
  - uniform-solfege
  - rhythmic-grammar
  - musicoil
  - harmony
  - melody
  - polyrhythm
  - paper-notation
related:
  - related/musicoil.md
  - related/rhythmic-grammar.md
  - uniform-solfege/index.md
  - foundations/prime-families.md
timestamp: 2026-06-26
---

# Three-Layer Coil Notation

## Overview

Three-Layer Coil Notation is the paper-writable surface syntax of the Prime Period Theory (PPT) framework. It organises music into a three-layer semantic grid where each layer has its own appropriate resolution. Complexity is additive — simple music collapses to minimal symbols, while full arrangements expand naturally. The system is entirely device-free: once the conventions are understood, all that is needed is a pen and paper.

Unlike standard Western notation, which can be too precise, overly Eurocentric, and requires specialist training to write quickly, or Nashville numbering / lead sheets, which capture only harmony and ignore rhythm and melodic contour, Three-Layer Coil Notation sits between these extremes. It provides "just enough precision" at each layer for rapid capture and comprehensive communication.

## The Three Layers

### Harmony Layer
- **Indicator**: Marked with a single open circle (○) in the left margin.
- **Function**: Shows harmonic progression using movable-tonic Uniform Solfège (Do = 1, Re = 2, Mi = 3, Fa = 4, So = 5, La = 6, Te/Ti = 7).
- **Voicing**: Default assumed voicing is a major triad (root, M3, P5), which is not explicitly written.
- **Alterations**: Alterations and extensions are written as subscript (half-height) Uniform Solfège symbols modifying the M3 and P5 from the root. 
  - *Example*: Do with Te subscript = dominant 7th chord (C7 if Do = C).
  - *Example*: Do with Me subscript = minor triad (Cmin).
- **Anchoring**: Harmonic changes anchor to Do and Di columns in the rhythm grid.
- **Purpose**: The "assumed" convention keeps the notation clean for diatonic music while remaining extensible for complex harmony.

### Melody Layer
- **Indicator**: Written above the harmony layer.
- **Function**: One or more voice lines, each showing melodic contour via Uniform Solfège pitch symbols.
- **Precision**: Does not prescribe every note. It uses signpost pitches only — the key notes that define the shape of the phrase.
- **Interpretation**: The performer interprets freely between signposts, consistent with the harmonic and rhythmic context.
- **Flexibility**: Multiple melody lines serve several purposes: polyphony (e.g. vocal harmony), multiple instrument parts, or analytical comparison (e.g. vocal melody vs guitar riff showing rhythmic unison vs call-and-response relationships).
- **Anchoring**: Melody lines align to the rhythm grid columns — signpost notes naturally place at Do/Di accent columns or at Axis-marked positions.

### Rhythm Layer
- **Indicator**: Written below the harmony layer.
- **Function**: Uses Rhythmic Grammar syllables (see [Rhythmic Grammar](rhythmic-grammar.md) for full specification) to define the horizontal column grid that all three layers align to.
- **Structure**: Each syllable occupies exactly one column — the grid is semantic, not metronomic.
- **Pillars**: Do and Di are the structural pillars (primary and secondary accents, the only dental consonants in the system).
- **Block Lengths**: Expressed via Uniform Solfège interval names:
  - *2-multiple family*: DoSo (2), DoLa (4), DoSi (6), DoRa (8), DoMe (10)
  - *Other prime lengths*: DoRe (3), DoMi (5), DoFi (7), DoLe (9), DoLi (11)
- **Polyrhythm**: Multiple rhythm lines support polyrhythm notation. Stacking two rhythm lines allows the phase relationship between their Do/Di markers to be read directly from visual alignment, making polyrhythm structure visually legible in a way standard notation cannot achieve.

## The Monospaced Grid

A core principle of Three-Layer Coil Notation is **column alignment**. Each Rhythmic Grammar syllable corresponds to exactly one column, and all layers are written in strict vertical alignment. Timing information is carried by the column position, not by physical spacing on the page.

This makes the notation **self-timing**. A reader scanning vertically at any column can simultaneously see:
- What the rhythm is doing.
- What harmony is active.
- What melodic signpost (if any) falls at that exact moment.

The **Do** and **Di** columns function as crucial structural join points — the positions where:
- Harmonic changes are anchored (harmony layer changes align here by default).
- Melody signposts naturally cluster.
- Polyrhythmic lines can be compared for phase relationships.
- Coil boundaries are defined.

## Coils

A **Coil** is the atomic composable unit of Three-Layer Coil Notation — a named block of the three-layer grid representing a musical phrase, section, or motif.

- **Reuse**: A Coil is defined once and can be referenced by its label rather than re-notated (e.g., label "Chorus" defined at first occurrence, referenced by name thereafter).
- **Boundary replacement**: Coil boundaries replace barlines. Phrases and metre are decoupled, eliminating the need for ties across barlines.
- **Length**: A Coil can be of any length, determined by its rhythmic content rather than a fixed time signature.
- **Assembly**: Coils can be assembled linearly (e.g., verse → chorus → verse) or cyclically (repeating loop structures).
- **Bridge to digital**: The Coil concept bridges directly to MusiCoil's normalisation model. On paper, a Coil is the compact written form; in a digital MusiCoil representation, the same Coil is the expanded structured form.

*Note: The word "Coil" carries forward the MusiCoil design philosophy — cyclical, reusable, containing musical energy that can be released or referenced — even though Three-Layer Coil Notation is a linear written form rather than the circular graphical form of MusiCoil.*

## Relationship to Other Systems

Three-Layer Coil Notation is not a separate system but the **handwriting register** of the integrated PPT framework. It is the zero-device entry point to a pipeline: sketch on paper → expand digitally → normalise into MusiCoil coils → reference compositionally.

| System | Role in Three-Layer Coil Notation |
|---|---|
| **PPT** | Theoretical foundation — prime-ratio periodicity explains why the rhythmic block lengths, harmonic intervals, and melodic relationships are structurally the same objects at different timescales. |
| **Uniform Solfège** | Symbol vocabulary for pitch, harmony roots, subscript alterations, and microtonal extensions. |
| **Rhythmic Grammar** | Rhythm syllables and block-length logic that define the column grid. |
| **MusiCoil** | Compositional grammar — normalisation, coil reuse, non-Eurocentric structure. |

## Non-Eurocentric Design

The system was explicitly designed to escape the constraints of Western staff notation:
- **Transposition**: A movable tonic (Do = whatever the tonal centre is) makes the notation inherently transposable by nature, not by convention.
- **Metre freedom**: No fixed time signature or barlines — rhythmic feel is expressed through prime-family block lengths.
- **Co-equal layers**: Layers are semantic streams of equal importance; melody and rhythm are not subordinate to harmony.
- **Universal compatibility**: It can represent Indian classical (raga melodic contour + tala rhythmic structure), blues, gamelan patterns, and Western diatonic music in the same notation without forcing any of them into a foreign metrical or harmonic frame.
- **Microtonality**: Microtonal inflections (e.g., raga gamaka, maqam nuance, just intonation voicings) are expressible via Uniform Solfège diacritics without changing notation conventions.

## Practical Use Cases

1. **Transcription** — Capturing an arrangement skeleton by ear, faster than standard notation, providing more information than chord symbols alone (validated with transcription of "Waving Through a Window").
2. **Composition sketching** — Writing structural motifs as Coils before filling in detail; the normalisation model encourages thinking in reusable units.
3. **Teaching and pedagogy** — Students can read at their own level (beginner: rhythm layer; intermediate: + harmony layer; advanced: all three simultaneously).
4. **Session preparation** — A compact reference that fits on a page alongside lyrics; more precise than chord charts, less cluttered than a full score.
5. **Polyrhythm analysis** — Stacking multiple rhythm lines makes phase relationships between rhythmic cycles visually explicit in a way standard notation cannot.
6. **Arrangement comparison** — Multiple melody lines allow visual comparison of how two parts relate rhythmically and intervallically at each anchor point.

## See also

- [MusiCoil](musicoil.md) — The spatial notation system and digital expansion counterpart
- [Rhythmic Grammar](rhythmic-grammar.md) — The foundation for the rhythm layer
- [Uniform Solfège Overview](../uniform-solfege/index.md) — Symbol vocabulary for pitch and harmony
- [Prime Families](../foundations/prime-families.md) — The generating intervals behind the framework
