---
type: concept
title: Temporal-Place Limen Reference Tuning
description: >
  Derives pitch anchor values from PPT first principles using the Metric DuPeriod
  coordinate system. Establishes that conventional pitch references (A440, A432,
  C256) are not structurally grounded in PPT's framework, identifies the
  prime-ratio landmark positions in pitch space that correspond to structurally
  meaningful tuning anchors, and defines the relationship between the Temporal-Place
  Limen and absolute pitch as a single late-binding projection step.
tags:
  - tuning
  - metric-duperiod
  - temporal-place-limen
  - just-intonation
  - pitch
  - uniform-solfege
  - prime-period-theory
status: stable
timestamp: 2026-07-13
used_by:
  - perception/temporal-place-limen.md
  - reference/metric-duperiod.md
  - tuning/just-intonation.md
  - tuning/31-edo.md
  - tuning/72-edo-grid.md
  - uniform-solfege/index.md
---

# Temporal-Place Limen Reference Tuning

## Purpose and scope

This document is not a foundational page. It is a tuning reference that
applies the foundational principles established in
[Temporal-Place Limen](../perception/temporal-place-limen.md) and
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

To locate any of these values in the Metric DuPeriod system (using the provisional anchor ~25.8Hz / ~38.7ms), the formula is:

```
Metric DuPeriod address of a frequency f:
  period = 1000 / f  (milliseconds)
  offset = log2(period / 38.7)
  position within band = round(12 × log2(period / floor of that band))
```

Applying this to common references:

| Reference | Period | Offset | Position | Address |
|-----------|--------|--------|----------|---------|
| A4 = 440Hz | 2.273ms | −4.09 | 1.1 (≈ Ra) | Ra−5 |
| A4 = 432Hz | 2.315ms | −4.06 | 0.7 (≈ Ra/Do) | Do−5 / Ra−5 |
| A4 = 415Hz | 2.410ms | −4.00 | 0.1 (≈ Do) | Do−5 |
| C4 = 256Hz | 3.906ms | −3.31 | 8.3 (≈ Le) | Le−4 |
| C4 = 261.6Hz | 3.822ms | −3.34 | 8.0 (≈ Le) | Le−4 |

Three observations follow immediately:

**First**, A440 and A432 land at virtually the same Metric DuPeriod address. The debate between them is structurally
irrelevant — neither is a prime-ratio landmark. This confirms that the
argument for A432 on "natural" or "mathematical" grounds has no basis
in PPT's framework.

**Second**, none of the conventional references land exactly on a prime-ratio
landmark, though historical A415 is surprisingly close to Do−5 (~412.8Hz).

**Third**, the various historical pitch standards all fall within a few
solfège steps of each other in Metric DuPeriod space.

## Structurally grounded anchor candidates

If Do in pitch space is defined as a Metric DuPeriod address rather than
a Hz value, the structurally meaningful candidates are positions that
fall on prime-ratio landmarks — specifically the Do, So, Mi, and Fa
positions of the negative metric DuPeriod bands.

### Candidate 1: Do−5 = 412.8Hz

```
Do−5 = 38.7ms × 2^(−4) = 2.419ms → 413.4Hz (Due to rounding, exact is 25.8Hz * 16 = 412.8Hz)
```

This is the **tonic floor of Metric DuPeriod −5** — a pure 2-prime
position, the most structurally grounded choice in that band. It places
the tonal centre at a clean power-of-two relationship to the Temporal-Place
Limen: 25.8Hz × 2^4 = 412.8Hz.

A complete scale from Do−5:

```
Do   412.8Hz    Do−5     (tonic floor)
Ra   437.3Hz    Ra−5
Re   463.3Hz    Re−5
Me   490.9Hz    Me−5
Mi   520.1Hz    Mi−5
Fa   551.1Hz    Fa−5
Fi   583.8Hz    Fi−5     (tritone)
So   618.5Hz    So−5     (3-prime dominant)
Le   655.3Hz    Le−5
La   694.3Hz    La−5     
Te   735.6Hz    Te−5
Ti   779.3Hz    Ti−5
Do   825.6Hz    Do−4     (octave above, 2-prime)
```

Note: Do−5 at 412.8Hz is extremely close to the historical Baroque pitch of A415. 
This is a fascinating coincidence, where the structurally derived "C" (Do) 
is near historical A, completely reframing the tuning foundation.

### Candidate 2: Do−4 = 206.4Hz as mid-low anchor

```
Do−4: period = 38.7ms / 2^3 = 4.8375ms → 206.4Hz
```

Let me restate the band structure clearly:

```
Band    Floor period    Floor frequency
−1      19.35ms         51.6Hz
−2      9.675ms         103.2Hz
−3      4.838ms         206.4Hz       ← mid-low register
−4      2.419ms         412.8Hz       ← mid register  
−5      1.209ms         825.6Hz       ← upper-mid register
−6      0.605ms         1651.2Hz      ← high register
```

So **Do−3 = 103.2Hz** is the bass anchor — the tonic floor of the bass
register band.

```
Do−3 = 103.2Hz    (bass tonic floor)
Do−4 = 206.4Hz    (mid-low tonic floor)
Do−5 = 412.8Hz    (mid tonic floor — primary vocal/instrument range)
```

The most practical primary anchor for a complete musical system is
**Do−5 = 412.8Hz**, as it sits in the centre of the most common
instrument and vocal range.

## The single projection step

In PPT's framework, the complete derivation of absolute pitch from
first principles requires exactly one external input and one
projection step:

**The one external input**: the Temporal-Place Limen at ~25.8Hz. This is
not arbitrary — it is a provisional perceptual constant grounded in human auditory
neurology via Local Closure triangulation (see [Temporal-Place Limen](../perception/temporal-place-limen.md)).
It is the only value in the system that must be taken as given rather
than derived.

**The projection step**: choose a Metric DuPeriod address for Do. The
recommended choice is **Do−5**, giving Do = 412.8Hz. This choice is
grounded in PPT structure rather than historical convention.

**All other values follow**: once the Temporal-Place Limen and the Do
address are fixed, every other pitch in the system — every scale
degree, every interval, every octave — is fully determined by the
prime-ratio structure of Uniform Solfège and the Metric DuPeriod
coordinate system. No further external inputs are needed.

The full derivation chain:

```
Perceptual constant:    ~25.8Hz (Temporal-Place Limen) — neurologically grounded
         ↓
Coordinate system:      Metric DuPeriod addresses — ratio space, logarithmic
         ↓
Anchor choice:          Do−5 — structurally grounded (tonic floor, mid band)
         ↓
Absolute pitch:         Do = 412.8Hz — derived, not stipulated
         ↓
Interface translation:  BPM values (for metronome/DAW)
                         Hz values (for instrument tuning)
```

## Relationship to existing tuning systems

This derivation does not replace the tuning systems documented elsewhere
in this directory. It provides a principled account of *why* those
systems relate to PPT as they do.

**Just Intonation** (see [Just Intonation](just-intonation.md)):
JI defines intervals as pure prime ratios. Do−5 = 412.8Hz with JI intervals gives
So−5 = 619.2Hz (exact 3:2 ratio), Mi−5 = 516Hz (exact 5:4 ratio), and
so on. The PPT-derived anchor makes JI values exact rather than
approximate.

**31-EDO** (see [31 EDO](31-edo.md)): 31-EDO provides excellent
5-limit approximations and maps cleanly onto Uniform Solfège's
diacritic system. The PPT-derived anchor does not change 31-EDO's
internal structure — it simply provides a principled absolute value
for where Do sits in Hz, derived from the Temporal-Place Limen rather
than from convention.

**72-EDO** (see [72 EDO Grid](72-edo-grid.md)): 72-EDO is PPT's
reference grid for diacritic placement. The PPT-derived anchor
similarly provides a principled Do value without altering 72-EDO's
internal structure.

In all cases, the existing tuning systems describe *relationships*
between pitches. This document describes where to *place* those
relationships in absolute frequency space.

## Practical implications

**For a PPT-native instrument or software**: tune Do to 412.8Hz (Do−5).
All other pitches follow from the chosen tuning system applied from that anchor. 

**For compatibility with conventional ensembles**: the interface
translation layer accepts A440 as an input and derives the offset
from Do−5. 

**For the PPT metronome**: the tempo anchor follows the same logic.
The metronome's primary interface is Metric DuPeriod address; BPM is
a derived display value calculated from the address and the
Temporal-Place Limen (~38.7ms). No BPM value is stored as a primary
parameter.

## Summary

| Question | Answer |
|----------|--------|
| What is the PPT pitch anchor? | Do−5 in the Metric DuPeriod system |
| What Hz value does this produce? | Do = 412.8Hz |
| Is A440 structurally significant? | No |
| Is A432 structurally significant? | No |
| What is the single external input? | The Temporal-Place Limen at ~25.8Hz — neurologically grounded |
| What follows from first principles? | Everything else — all pitches, all intervals, all octave positions |

## See also

- [Temporal-Place Limen](../perception/temporal-place-limen.md) — the
  perceptual anchor and its derivation
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate
  system from which pitch addresses are derived
- [Just Intonation](just-intonation.md) — pure prime-ratio intervals
  applied from the PPT-derived anchor
- [31 EDO](31-edo.md) — the primary practical tuning system
- [72 EDO Grid](72-edo-grid.md) — the diacritic reference grid
- [Uniform Solfège](../uniform-solfege/index.md) — the notation
  system whose positions the Metric DuPeriod addresses name
