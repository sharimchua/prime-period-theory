---
type: concept
title: Base-12 Algebra
description: >
  The algebraic properties of Uniform Solfège. Explains interval stacking as ratio multiplication,
  clock arithmetic for octave equivalence, and the LCM as a measure of periodicity and consonance.
tags:
  - uniform-solfege
  - base-12
  - clock-arithmetic
  - interval
  - prime-period-theory
timestamp: 2026-06-26
---

# Base-12 Algebra

## Interval stacking as multiplication

In standard music theory, we often talk about "adding" intervals — a major third plus a minor third equals a perfect fifth. But physically, interval combination is **multiplication of ratios**, not addition. 

When you stack intervals, you are applying successive frequency multipliers:
- A perfect fifth is a frequency ratio of `3/2`.
- A perfect fourth is a frequency ratio of `4/3`.
- Stacking them: `(3/2) × (4/3) = 12/6 = 2/1` (an octave).

The only reason we can "add" semitones or cents is because they are logarithmic measures. Cents convert multiplicative ratio space into additive geometric space. Uniform Solfège uses base-12 arithmetic to map this multiplicative reality onto an additive integer grid (the 12 chromatic positions) via modular arithmetic.

## String length vs. frequency ratio

It is crucial to distinguish between string length ratios and frequency ratios. They are inverse properties:
- Halving a string length (`1/2`) doubles its frequency (`2/1`).
- Dividing a string into three parts (`1/3`) produces a frequency three times as fast (`3/1`, or an octave + a fifth).

Prime Period Theory prioritizes the **frequency ratio** because it directly relates to periodicity and the interference patterns that our ears perceive as consonance, rhythm, and timbre.

## LCM as a measure of periodicity

When two periodic signals interact, they create an interference pattern. The time it takes for that pattern to complete one full cycle and realign is governed by their **Lowest Common Multiple (LCM)**.

- **Consonance**: Ratios with a smaller LCM realign frequently. For example, a perfect fifth (`3:2`) realigns every 6 cycles of the underlying grid. The frequent realignment is perceived as smooth and consonant.
- **Dissonance**: Ratios with a larger LCM realign infrequently. A major seventh (`15:8`) requires 120 cycles to realign. The resulting interference is perceived as rough and dissonant.

The LCM provides a rigorous, mathematical basis for understanding consonance and dissonance as a continuous spectrum of periodic realignment, directly bridging pitch and rhythm.

## Equal Temperament deviations

Why do we still hear a 12-Tone Equal Temperament (12TET) major third as a 5-limit ratio (`5:4`), even though it is physically out of tune (about 14 cents sharp)?

The answer is that **ET deviations do not change the underlying ratio hierarchy**. The human auditory system is an active pattern-matching engine. It hears the closest simple integer ratio and categorises the incoming signal as an approximation of that ideal. 

12TET is a grid of compromises. It bends the pure prime-limit ratios slightly out of shape so they close the circle at the octave. But our brains still interpret the structure *as if* the pure ratios were present. The 12-position clock arithmetic of Uniform Solfège works perfectly because it describes the topological structure of these relationships, regardless of the slight tuning deviations introduced by the temperament.

## See also

- [Geometric Basis](geometric-basis.md) — how symbols encode interval geometry
- [Tone Atlas](../related/tone-atlas.md) — the clock-face diagram of base-12 interval space
- [Periodicity](../foundations/periodicity.md) — the unifying phenomenon of frequency realignment
