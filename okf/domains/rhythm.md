---
type: concept
title: Rhythm
description: >
  Rhythm as macro periodicity in PPT — metre, polyrhythm, swing, and groove
  understood through prime-ratio interference at the beat and phrase scale.
  Entry point to the Rhythmic Grammar system.
tags:
  - rhythm
  - polyrhythm
  - metre
  - swing
  - prime-families
  - rhythmic-grammar
  - prime-period-theory
timestamp: 2026-06-26
---

# Rhythm

## Rhythm as macro periodicity

In Prime Period Theory, rhythm is not categorically different from pitch —
it is the same phenomenon (periodic interference between signals) operating
at a slower timescale, where individual cycles are long enough to be
perceived as distinct beats rather than as a continuous frequency.

The perceptual boundary between pitch and rhythm is a property of human
perception, not of the underlying structure. A 2:3 ratio between two pitches
and a 2-against-3 polyrhythm are both expressions of **3-prime interference
with a 2-prime grid**. The interval character of a perfect fifth and the
feel of a swing triplet share the same prime-family origin.

See [Periodicity](../foundations/periodicity.md) and [Prime Families](../foundations/prime-families.md)
for the full development of this claim.

## Metre as prime-family choice

A time signature is, in PPT terms, a declaration of which prime family
governs the primary subdivision of the beat:

| Feel               | Prime family | LCM structure             |
| ------------------ | ------------ | ------------------------- |
| Duple (2/4, 4/4)   | 2            | Binary subdivision        |
| Triple (3/4, 6/8)  | 3            | Ternary subdivision       |
| Quintuple (5/4)    | 5            | First cross-family layer  |
| Septuple (7/8)     | 7            | Balkan / Carnatic feel    |

Compound metres (6/8, 9/8, 12/8) are not new prime families — they are
powers and combinations of 2 and 3, which is why they feel related to
both duple and triple metre.

Standard time signatures are a limited vocabulary for this. They name the
container (how many beats, what note value) but say nothing about internal
accentuation, feel, or the prime-family relationships at play within a beat.
**Rhythmic Grammar** (see below) addresses this directly.

## Polyrhythm as LCM interference

Two simultaneous periodic streams from different prime families produce a
polyrhythm. The LCM of their periods defines the grid within which both
streams are contained and at which they periodically realign.

A **3:2 polyrhythm** produces an LCM of 6 ticks. Within that grid:

| Tick | 1 | 2 | 3 | 4 | 5 | 6 |
| ---- | - | - | - | - | - | - |
| 2-grid (every 3 ticks) | ● | | | ● | | |
| 3-grid (every 2 ticks) | ● | | ● | | ● | |

Both streams coincide at tick 1 (the downbeat) and at tick 7 (the next
cycle). Between those points the streams are independent, and the
interference between them is the perceptual experience of polyrhythm.

The prime-family framing predicts perceptual complexity: streams from
**the same prime family** resolve quickly (their LCM is small relative to
their period); streams from **different prime families** take longer to
resolve, producing the characteristic tension of polyrhythm.

## Swing as 3-prime lean against a 2-prime grid

Swing feel arises from the tension between two simultaneous grids:

- **The 2-prime grid** (straight eighth notes, binary subdivision)
- **The 3-prime grid** (triplet subdivision, 2+1 grouping within 3)

A 4:3 polyrhythm over two beats gives an LCM grid of 12 ticks. The melody
and harmony largely inhabit the **4-grid** (straight eighth notes), while
the swing lilt is produced by placing notes with a lean toward the **3-grid**.

Hard swing (full triplet) commits entirely to the 3-grid — the long note
lands on tick 1, the short note on tick 9 of a 12-tick LCM, producing a
clean 2:1 ratio. Soft swing stays closer to the 4-grid with only a slight
pull toward the 3-grid. Real-world swing is a **continuous variable** between
these poles — a differential rather than a fixed ratio.

The **limit condition** of swing is the requirement that, over a full phrase
or cycle, all periodic streams — musicians, dancers, rhythm section — realign
at the LCM boundary. Local swing feel can be flexible; global periodicity
must close. This is identical in principle to the freedom granted by tala in
Indian classical music: broad melodic flexibility within a cycle that must
land on the sam.

In PPT terms, swing occupies a **bounded region in ratio space** — somewhere
between 4:3 and 2:1 (or 3:2 as a softer bound) — with the constraint that
the LCM periodicity closes cleanly at the phrase level.

## Polyrhythm verbalisation and chunking

A useful practice technique for internalising polyrhythms is to voice the
LCM grid as a single sequence, with natural accent boundaries marking each
stream's downbeats. For a **3:2 polyrhythm** (LCM = 6):

```
DoRe / SoDo / ReSo
```

This chunks the 6-beat LCM into three 2-beat groups (for the 3-grid) while
volume accents on `Do`, `So`, and `Do` mark the 2-grid's downbeats. A
single voiced phrase carries both rhythmic streams simultaneously.

This approach is inspired by Solkattu (konnakol), the South Indian vocal
percussion system, where speaking the subdivision pattern trains the body
in the rhythm without requiring conscious counting of both streams.

The voiced chunks use the **Rhythmic Grammar** encoding — see below.

## Rhythmic Grammar

Rhythmic Grammar is a formal system for encoding rhythmic grouping structure
as compact, speakable, machine-parsable strings using the 12 base solfège
syllables of Uniform Solfège.

A rhythm string like `DoReDiSo` is simultaneously:

- A **name** for the pattern (3+2 swing / soft quintuplet grouping)
- A **description** of its internal structure (primary block of 3, secondary accent block of 2)
- A **performance instruction** (the pitch sequence tells the body the feel)
- A **machine-executable encoding** for a metronome or notation tool

This is a more expressive grid definition than a standard time signature.
`DoLaReSo` and `DoSoDiRe` are both four-beat patterns, but they encode
entirely different accentuation structures and grooves.

See [Rhythmic Grammar](../related/rhythmic-grammar.md) for the full specification.

## Relationship to Uniform Solfège

Rhythmic Grammar uses the **12 base syllables** of Uniform Solfège as its
token set, with no diacritics required. The same symbol vocabulary describes
both pitch space (with diacritics, across 72 EDO) and rhythmic grammar
(without diacritics, as a CoF cadential chain). These are two different
games played with the same deck.

The one point of contact is the **Axis diacritic** (`x`): in Rhythmic
Grammar notation, the structural anchor tokens Do and Di are written with
the Axis diacritic (Dox, Dix) to visually mark block boundaries. This is
a secondary use of the Axis suffix distinct from its microtonal pitch role.
See [Diacritic System](../uniform-solfege/diacritic-system.md#axis-in-rhythmic-grammar).

## See also

- [Periodicity](../foundations/periodicity.md) — the unifying phenomenon across scales
- [Prime Families](../foundations/prime-families.md) — especially the 2-prime and 3-prime rhythm entries
- [Rhythmic Grammar](../related/rhythmic-grammar.md) — full grammar specification
- [Rhythmic Overtone Series](rhythmic-overtone-series.md) — the inter-onset ratio spectrum of a phrase; identity with the harmonic series
- [Pitch](pitch.md) — the micro-periodicity domain; pitch and rhythm as the same structure at different scales
- [Diacritic System](../uniform-solfege/diacritic-system.md) — Axis diacritic in rhythmic notation context
