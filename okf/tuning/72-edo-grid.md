---
type: concept
title: 72 EDO Grid
description: >
  Seventy-two equal divisions of the octave, its history, and its function
  as the high-resolution reference grid for the Prime Period Diacritic system.
tags:
  - tuning
  - 72-edo
  - microtonality
  - diacritic-system
timestamp: 2026-06-28
---

# 72 EDO Grid

## Historical context

72 Equal Divisions of the Octave (72 EDO), dividing the octave into 72 equal steps of exactly 16.66 cents, has historical roots spanning multiple musical traditions and experimental eras.

In the early 20th century, avant-garde composers sought to escape the confines of 12TET. Alois Hába and Ivan Wyschnegradsky prominently explored quarter-tones (24 EDO), third-tones (18 EDO), and sixth-tones (72 EDO). Hába composed extensive theoretical works and music for custom-built 1/6th-tone harmoniums, recognising that 72 EDO acts as the lowest common denominator for 12, 18, 24, and 36 EDO, making it a powerful "meta-tuning" that could host many different microtonal subsystems simultaneously.

Furthermore, 72 EDO has been extensively used by modern theorists to approximate the complex intervallic structures of Byzantine chant and classical maqam. Its high resolution allows for fine, ~16.6-cent distinctions between neutral intervals, Pythagorean tunings, and pure Just Intonation ratios. Because a Syntonic comma is ~21.5 cents, a single step of 72 EDO (16.66 cents) is an excellent perceptual approximation of a comma shift, making it highly useful for mapping out the comma drift of Just Intonation.

## Role in Prime Period Theory

In Prime Period Theory (PPT), 72 EDO is not primarily conceived as a performative tuning for acoustic instruments; rather, it functions as the **mathematical reference grid** for the entire diacritic system.

PPT uses **Prime Period Diacritics (PPD)** to denote microtonal inflections away from standard 12TET anchor positions. These inflections are conceptually derived from prime-ratio subdivisions (such as the 11-limit and 7-limit), but to be communicable and digitizable, they must be mapped to a stable, reproducible coordinate space.

72 EDO provides the perfect underlying grid for PPD because:
1. **Granularity:** At ~16.6 cents per step, it is near the threshold of human pitch discrimination, providing enough resolution to accurately plot 7-limit and 11-limit relationships without excessive, imperceptible clutter.
2. **Symmetry:** As a multiple of 12, it perfectly embeds the standard 12TET grid. Each 12TET semitone contains exactly six 72 EDO steps (or 1/6th tones).
3. **Diacritic Mapping:** The six states of the PPT diacritic system correspond precisely to the internal divisions of the 72 EDO grid between any two 12TET anchors. From a natural note, the inflections are:
    - **Base:** The 12TET anchor (0 steps)
    - **HalfSup / HalfSub:** ±1 step (~16.6 cents)
    - **Sup / Sub:** ±2 steps (~33.3 cents)
    - **Axis:** ±3 steps (Exactly +50 cents, the quarter-tone midpoint)

While a musician may interpret a diacritic freely by ear according to pure Just Intonation or their own cultural background, the 72 EDO grid ensures that notation software, digital synthesizers, and analytical tools share a unified, exact specification for how that diacritic modifies the base pitch.
