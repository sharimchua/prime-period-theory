---
type: concept
title: Tone Atlas
description: >
  The comprehensive visual map of the chromatic clock space. Details the subclock
  navigation system, moveable-do reading conventions, and the fractal clock property.
tags:
  - tone-atlas
  - geometry
  - notation
  - interval
  - prime-period-theory
timestamp: 2026-07-01
---

# Tone Atlas

## What it is

The Musical Tone Atlas is a comprehensive visual map of pitch relationships, designed to put every key, chord, interval, and scale degree into one cohesive, navigable clock-like space. 

Its core pedagogical premise is that music is about relationships, not memorisation. By fixing any note at the "Do" (12 o'clock) position, you can see exactly how the relationships change as you move to other tones, without needing to memorise transposition formulas. 

## The Subclock Navigation System

The Tone Atlas is constructed around a central "master clock" with twelve **subclocks** arranged around its perimeter. 
- The master clock maps the 12 chromatic positions as intervals from the tonic.
- The subclocks map the absolute pitch names (A, B, C#, etc.) onto the same geometric structure.

This design enables a powerful physical interaction: you can rotate the inner pitch ring to align any absolute pitch with the 12 o'clock (Do) position on the master clock. 
- The master clock provides the constant structural relationship (e.g., "What is the perfect fifth?").
- The subclock at that position instantly reveals the absolute pitch name for the current key (e.g., "The perfect fifth of D is A").

## Moveable-Do Convention

The Tone Atlas assumes a **moveable-do** reading convention by default. 
- "Do" is not a fixed pitch like C; it is the structural tonic of whatever key or mode you are exploring. 
- The geometry of the clock dictates that the structural relationships remain identical regardless of which absolute pitch is placed at the Do position. 

## Enharmonic Naming and Preference Hierarchy

As you move around the clock, you inevitably encounter positions where the standard 12-tone grid requires a choice between enharmonically equivalent names (e.g., C# vs. Db). The Tone Atlas uses the **primary naming hierarchy** established in Uniform Solfège to resolve these ambiguities cleanly:

- b2: `Ra` (preferred over `Di` in harmonic contexts)
- b3: `Me`
- #4: `Fi` 
- b6: `Le` 
- b7: `Te`

The preference for `Le` over `Si` at position 8 ensures that the perfect 5th phoneme ('S' for `So`) remains unique within the primary naming set, providing a clearer phonetic landscape when reading the clock aloud.

## The Fractal Clock Property

The Tone Atlas exhibits a fractal-like self-similarity. Reading the same clock position provides the notes in the scale (where the note at Do is the tonic), while simultaneously revealing the absolute pitch names within the corresponding subclock. 
- The macro-scale (master clock) shows the interval structure.
- The micro-scale (subclock) shows the specific pitch implementation.
- Both scales obey the exact same base-12 clock arithmetic. 

## Clock Arithmetic and Base-12 Algebra

The geometry of the Tone Atlas is driven entirely by base-12 arithmetic (see [Base-12 Algebra](../uniform-solfege/base-12-algebra.md)). 
- Interval calculation is simply addition modulo 12. 
- To find a major third (4 steps) above a perfect fifth (7 steps), you calculate `7 + 4 = 11` (Ti, the major seventh). 
- To find a perfect fourth (5 steps) above a minor seventh (10 steps), you calculate `10 + 5 = 15 mod 12 = 3` (Me, the minor third).

The visual geometry of the Tone Atlas allows you to navigate this arithmetic spatially, replacing mathematical calculation with spatial movement around the circle.

## See also

- [Chromatic Clock Geometry](chromatic-clock.md) — the mathematical properties of the circle
- [Base-12 Algebra](../uniform-solfege/base-12-algebra.md) — the arithmetic rules governing interval combination
- [Uniform Solfège](../uniform-solfege/index.md) — the syllable and symbol system mapping the 12 positions
