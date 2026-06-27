---
type: concept
title: Periodicity Limen Reference Tuning
description: >
  Derives pitch anchor values from PPT first principles using the Metric DuPeriod
  coordinate system. Establishes that conventional pitch references (A440, A432,
  C256) are not structurally grounded in PPT's framework, identifies the
  prime-ratio landmark positions in pitch space that correspond to structurally
  meaningful tuning anchors, and defines the relationship between the Periodicity
  Limen and absolute pitch as a single late-binding projection step.
tags:
  - tuning
  - metric-duperiod
  - periodicity-limen
  - just-intonation
  - pitch
  - uniform-solfege
  - prime-period-theory
timestamp: 2026-06-27
---

# Periodicity Limen Reference Tuning

## Purpose and scope

This document is not a foundational page. It is a tuning reference that
applies the foundational principles established in
[Periodicity Limen](../perception/periodicity-limen.md) and
[Metric DuPeriod](../reference/metric-duperiod.md) to derive structurally
grounded pitch anchor values from PPT first principles.

Its central question is: **if you refused to accept any conventional pitch
reference as given — no A440, no C256, no historical diapason — and
derived an absolute pitch anchor purely from PPT's coordinate system,
where would it land?**

The answer reveals that all conventional pitch references are historically
contingent approximations of no prime-ratio significance, and that PPT's
framework points toward a small set of structurally meaningful alternatives.
It also establishes the correct relationship between the framework's
coordinate system and the absolute Hz values required for physical
performance: one is primary, the other is derived.

## The problem with conventional pitch references

Standard Western pitch is anchored to **A4 = 440Hz**, established by ISO
16 in 1955. Before that, pitch references varied enormously across
historical periods and geographical regions — A415 (Baroque), A430
(Classical), A435 (late Romantic), A440 (modern), with A432 proposed
periodically as an alternative on various grounds.

None of these values are structurally grounded in any acoustic or
perceptual principle. They are historical conventions, adopted for
practical reasons of instrument manufacture and ensemble coordination.
In PPT terms, they are arbitrary projection parameters — the equivalent
of choosing 60 BPM as a tempo reference because it matches the second.

To locate any of these values in the Metric DuPeriod system, the formula is:

```
Metric DuPeriod address of a frequency f:
  period = 1000 / f  (milliseconds)
  offset = log2(period / 50)
  position within band = round(12 × log2(period / floor of that band))
```

Applying this to common references:

| Reference | Period | Offset | Position | Address |
|-----------|--------|--------|----------|---------|
| A4 = 440Hz | 2.273ms | −4.46 | 9.5 (≈ La) | La−4 |
| A4 = 432Hz | 2.315ms | −4.43 | 9.3 (≈ La) | La−4 |
| A4 = 415Hz | 2.410ms | −4.38 | 8.9 (≈ Le) | Le−4 |
| C4 = 256Hz | 3.906ms | −3.68 | 8.1 (≈ Le) | Le−3 |
| C4 = 261.6Hz | 3.822ms | −3.71 | 8.5 (≈ Le) | Le−3 |

Three observations follow immediately:

**First**, A440 and A432 land at virtually the same Metric DuPeriod address
(both approximately La−4). The debate between them is structurally
irrelevant — neither is a prime-ratio landmark, and they are
indistinguishable in the coordinate system. This confirms that the
argument for A432 on "natural" or "mathematical" grounds has no basis
in PPT's framework.

**Second**, none of the conventional references land on a prime-ratio
landmark. They cluster between La and Le in their respective bands —
positions with no special structural significance.

**Third**, the various historical pitch standards (A415, A430, A435,
A440, A432) all fall within less than one solfège step of each other
in Metric DuPeriod space. The perceived enormity of the historical pitch
variation is an artefact of linear Hz thinking; in ratio space, these
references are clustered tightly together and all equally arbitrary.

## Structurally grounded anchor candidates

If Do in pitch space is defined as a Metric DuPeriod address rather than
a Hz value, the structurally meaningful candidates are positions that
fall on prime-ratio landmarks — specifically the Do, So, Mi, and Fa
positions of the negative metric DuPeriod bands, since these carry the
tonic, dominant, mediant, and subdominant structural roles.

### Candidate 1: Do−4 = 320Hz

```
Do−4 = 50ms × 2^(−4) = 50ms × 0.0625 = 3.125ms → 320Hz
```

This is the **tonic floor of Metric DuPeriod −4** — a pure 2-prime
position, the most structurally grounded choice in that band. It places
the tonal centre at a clean power-of-two relationship to the Periodicity
Limen: 20Hz × 2^4 = 320Hz.

A complete scale from Do−4:

```
Do   320.0Hz    Do−4     (tonic floor)
Ra   338.9Hz    Ra−4
Re   359.2Hz    Re−4
Me   380.5Hz    Me−4
Mi   403.2Hz    Mi−4
Fa   427.2Hz    Fa−4
Fi   452.6Hz    Fi−4     (tritone)
So   479.6Hz    So−4     (3-prime dominant)
Le   508.2Hz    Le−4
La   538.6Hz    La−4     (close to A4 = 440Hz one octave up... wait)
Te   570.9Hz    Te−4
Ti   604.9Hz    Ti−4
Do   640.0Hz    Do−3     (octave above, 2-prime)
```

Note: La−4 = 538.6Hz is not A4 — it is A5 transposed down. The La
position of this system does not correspond to conventional A4. This
is expected: the system is not derived from A440 and has no obligation
to produce it.

The So position (So−4 = 479.6Hz) is close to B4 in conventional
tuning (493.9Hz) but not identical. No conventional pitch name
corresponds cleanly to a PPT structural landmark — again, expected.

### Candidate 2: So−5 as concert A

If practical compatibility with orchestral convention is desired —
specifically, retaining a structurally meaningful value near the A
position as a reference — the So position of Metric DuPeriod −5 offers
an interesting alternative:

```
So−5 = 50ms × 2^(−5) × 2^(7/12)
     = 50ms × 0.03125 × 1.4983
     = 2.341ms → 427.2Hz
```

So−5 ≈ **427Hz** — close to the historical Baroque pitch (A415 is
somewhat lower; A430 is closer) and within range of the A432 proposal,
but grounded in PPT structure rather than historical convention or
numerological preference.

In this system, the concert A is not Do but **So** — the dominant
position of its metric DuPeriod band. This means the conventional
orchestral tuning reference is structurally a dominant, not a tonic.
Whether this is a meaningful observation or a curiosity depends on
how much weight one places on the tuning note's structural role.

### Candidate 3: Do−5 = 160Hz as bass anchor

```
Do−5 = 50ms × 2^(−5) = 50ms × 0.03125 = 1.5625ms → 640Hz
```

Wait — that's wrong direction. Recalculating:

```
Do−5: period = 50ms / 2^5 = 50ms / 32 = 1.5625ms → 640Hz
```

That places Do−5 at 640Hz, which is in the soprano range. The negative
offset means *shorter* period (higher frequency). Let me restate the
band structure clearly:

```
Band    Floor period    Floor frequency
−1      25ms            40Hz
−2      12.5ms          80Hz
−3      6.25ms          160Hz       ← bass register
−4      3.125ms         320Hz       ← mid register  
−5      1.5625ms        640Hz       ← upper-mid register
−6      0.78125ms       1280Hz      ← high register
```

So **Do−3 = 160Hz** is the bass anchor — the tonic floor of the bass
register band. This is close to the E2 on a standard guitar (82.4Hz
is closer to Do−2) but more precisely:

```
Do−3 = 160Hz    (bass tonic floor)
Do−4 = 320Hz    (mid tonic floor — primary vocal/instrument range)
Do−5 = 640Hz    (upper tonic floor)
```

The most practical primary anchor for a complete musical system is
**Do−4 = 320Hz**, as it sits in the centre of the most common
instrument and vocal range, with Do−3 and Do−5 as its octave
neighbours.

## The single projection step

In PPT's framework, the complete derivation of absolute pitch from
first principles requires exactly one external input and one
projection step:

**The one external input**: the Periodicity Limen at 20Hz. This is
not arbitrary — it is a perceptual constant grounded in human auditory
neurology (see [Periodicity Limen](../perception/periodicity-limen.md)).
It is the only value in the system that must be taken as given rather
than derived.

**The projection step**: choose a Metric DuPeriod address for Do. The
recommended choice is **Do−4**, giving Do = 320Hz. This choice is
grounded in PPT structure (it is the tonic floor of the band containing
the primary instrument and vocal range) rather than historical
convention.

**All other values follow**: once the Periodicity Limen and the Do
address are fixed, every other pitch in the system — every scale
degree, every interval, every octave — is fully determined by the
prime-ratio structure of Uniform Solfège and the Metric DuPeriod
coordinate system. No further external inputs are needed.

The full derivation chain:

```
Perceptual constant:    20Hz (Periodicity Limen) — neurologically grounded
         ↓
Coordinate system:      Metric DuPeriod addresses — ratio space, logarithmic
         ↓
Anchor choice:          Do−4 — structurally grounded (tonic floor, mid band)
         ↓
Absolute pitch:         Do = 320Hz — derived, not stipulated
         ↓
Interface translation:  A = So−4 ≈ 427Hz (for orchestral coordination)
                        BPM values (for metronome/DAW)
                        Hz values (for instrument tuning)
```

## Relationship to existing tuning systems

This derivation does not replace the tuning systems documented elsewhere
in this directory. It provides a principled account of *why* those
systems relate to PPT as they do.

**Just Intonation** (see [Just Intonation](just-intonation.md)):
JI defines intervals as pure prime ratios — exactly what the Metric
Octave address system encodes. Do−4 = 320Hz with JI intervals gives
So−4 = 480Hz (exact 3:2 ratio), Mi−4 = 400Hz (exact 5:4 ratio), and
so on. The PPT-derived anchor makes JI values exact rather than
approximate.

**31-EDO** (see [31 EDO](31-edo.md)): 31-EDO provides excellent
5-limit approximations and maps cleanly onto Uniform Solfège's
diacritic system. The PPT-derived anchor does not change 31-EDO's
internal structure — it simply provides a principled absolute value
for where Do sits in Hz, derived from the Periodicity Limen rather
than from convention.

**72-EDO** (see [72 EDO Grid](72-edo-grid.md)): 72-EDO is PPT's
reference grid for diacritic placement. The PPT-derived anchor
similarly provides a principled Do value without altering 72-EDO's
internal structure.

In all cases, the existing tuning systems describe *relationships*
between pitches. This document describes where to *place* those
relationships in absolute frequency space — and the answer is: place
them at the Metric DuPeriod address that PPT's coordinate system
identifies as structurally meaningful, with the Periodicity Limen
as the single external anchor.

## Practical implications

**For a PPT-native instrument or software**: tune Do to 320Hz (Do−4).
All other pitches follow from the chosen tuning system (JI, 31-EDO,
72-EDO, 12-TET) applied from that anchor. The concert A equivalent
(So−4) is approximately 427Hz for JI, or 426.7Hz for 12-TET from
this anchor.

**For compatibility with conventional ensembles**: the interface
translation layer accepts A440 as an input and derives the offset
from Do−4. The offset is approximately 0.55 semitones (A440 / So−4
= 440 / 426.7 = 1.031, or about 53 cents). This is a fixed transposition
constant for any ensemble interaction, not a change to the underlying
system.

**For the PPT metronome**: the tempo anchor follows the same logic.
The metronome's primary interface is Metric DuPeriod address; BPM is
a derived display value calculated from the address and the
Periodicity Limen (50ms). No BPM value is stored as a primary
parameter.

## Summary

| Question | Answer |
|----------|--------|
| What is the PPT pitch anchor? | Do−4 in the Metric DuPeriod system |
| What Hz value does this produce? | Do = 320Hz |
| What is the concert A equivalent? | So−4 ≈ 427Hz (JI) / 426.7Hz (12-TET) |
| Is A440 structurally significant? | No — it falls between La and Te in Metric DuPeriod −4 with no prime-ratio significance |
| Is A432 structurally significant? | No — it falls at virtually the same address as A440 |
| What is the single external input? | The Periodicity Limen at 20Hz — neurologically grounded |
| What follows from first principles? | Everything else — all pitches, all intervals, all octave positions |

## See also

- [Periodicity Limen](../perception/periodicity-limen.md) — the
  perceptual anchor and its derivation
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate
  system from which pitch addresses are derived
- [Just Intonation](just-intonation.md) — pure prime-ratio intervals
  applied from the PPT-derived anchor
- [31 EDO](31-edo.md) — the primary practical tuning system
- [72 EDO Grid](72-edo-grid.md) — the diacritic reference grid
- [Uniform Solfège](../uniform-solfege/index.md) — the notation
  system whose positions the Metric DuPeriod addresses name
