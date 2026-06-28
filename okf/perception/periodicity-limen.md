---
type: concept
title: Periodicity Limen
description: >
  The Periodicity Limen (colloquially: Auditory Horizon) is the perceptual
  phase transition at approximately 20Hz / 50ms period, at which periodic
  signals cross the boundary between rhythmic and pitched perception. It
  serves as the anchor point — Metric DuPeriod 0 — for PPT's unified
  period-length coordinate system, grounded in human auditory neurology
  rather than conventional time measurement.
tags:
  - foundations
  - periodicity-limen
  - auditory-horizon
  - metric-duperiod
  - psychoacoustics
  - prime-period-theory
timestamp: 2026-06-27
---

# Periodicity Limen

## What it is

The **Periodicity Limen** (colloquially: the **Auditory Horizon**) is the
perceptual phase transition at approximately 20Hz — a period length of 50ms
— at which periodic signals cross the boundary between two distinct modes
of human auditory perception: rhythm and pitch.

Below 20Hz, the ear tracks individual events. The repeating pattern is
perceived as **rhythm** — discrete pulses with felt intervals between them.
Above 20Hz, the ear fuses repetitions into a continuous sensation. The
pattern is perceived as **pitch** — a sustained frequency with a
recognisable tonal character.

This boundary is not a hard cliff. Psychoacoustic research identifies a
transition zone between approximately 10Hz and 40Hz, characterised by two
intermediate perceptual states:

- **Flutter** (~10–20Hz): events too fast to track individually but not
  yet fused into a stable pitch; a rapid flickering sensation
- **Roughness** (~20–40Hz): fusion beginning, pitch emerging but unstable,
  perceived as a coarse or buzzing tone

The Periodicity Limen is defined at 20Hz as the midpoint of this transition
zone — the point at which perceptual mode is most evenly balanced between
rhythm and pitch, and therefore the most structurally meaningful single
value to use as an anchor.

## Why this is the correct anchor

Standard measures of musical time — Hz for frequency, BPM for tempo — are
derived from the **second**, which is itself a fraction of Earth's rotation
period: an astronomical unit that became a time unit by historical
convention. It has no relationship to human perception, acoustic physics,
or musical structure. The second is to musical time measurement what
Fahrenheit is to temperature: a unit whose reference points are determined
by historical contingency rather than the phenomenon being measured.

The Periodicity Limen is determined instead by **human auditory neurology**
— specifically the temporal resolution limits of the basilar membrane and
auditory nerve firing rates. It is:

- Not a convention — it is a property of the biological instrument that
  receives music
- Not culturally contingent — it is stable across humans regardless of
  musical tradition or training
- Not astronomically derived — it is grounded in the perceptual system
  that music is addressed to
- Intrinsic to PPT's theoretical structure — the framework already treats
  the pitch/rhythm boundary as theoretically significant; the Periodicity
  Limen is the precise location of that boundary

This makes it the correct choice for an anchor in the same sense that
absolute zero is the correct anchor for temperature measurement in physics:
it is the structurally meaningful zero point of the phenomenon being
described, not a convenient approximation of it.

## Relationship to conventional measures

The Periodicity Limen can be expressed in conventional units — 20Hz,
50ms period, 1200 BPM — but these are **interface translations**, not
primary descriptions. The theoretical status of 20Hz as an anchor does
not depend on seconds; the second is available as a translation layer
when interfacing with conventional tools, instruments, and notation
systems.

The relationship is analogous to Kelvin and Celsius: Celsius remains
useful for everyday temperature description, but Kelvin is the
theoretically correct system because its zero point is grounded in
molecular physics rather than water's behaviour. BPM and Hz remain
useful for performance and notation, but the Periodicity Limen coordinate
system is theoretically correct because its anchor is grounded in
auditory perception rather than Earth's rotation.

## The upper boundary

A second physiological boundary exists at approximately 20kHz — the upper
limit of human pitch perception, also determined by basilar membrane
resolution. This is designated the **Upper Periodicity Limen**
(colloquially: the **Upper Auditory Horizon**).

The full audible pitch range spans from the Periodicity Limen (20Hz) to
the Upper Periodicity Limen (20kHz). This range is:

```
log2(20000 / 20) = log2(1000) ≈ 9.97 octaves
```

Approximately **10 octaves** — a near-exact decade in base-2 logarithmic
space. This spans Metric DuPeriods −10 to 0 in PPT's unified coordinate
system. See [Metric DuPeriod](../reference/metric-duperiod.md) for the full coordinate
definition.

## Dual register

The term **Periodicity Limen** is used in formal, academic, and
psychoacoustic contexts, consistent with established psychoacoustic
vocabulary (*limen*: Latin for threshold; cf. absolute limen, difference
limen).

The colloquial name **Auditory Horizon** is used in pedagogical,
explanatory, and cross-reference contexts. The horizon metaphor captures
the character of the boundary: it is not that periodicity ceases to exist
on either side, but that the *nature of perception* changes — just as a
horizon changes what can be seen, not what exists.

This dual-register convention follows the pattern established elsewhere
in PPT: formal specification paired with an accessible working name.

| Register | Term | Abbreviation |
|----------|------|--------------|
| Formal / academic | Periodicity Limen | PL |
| Colloquial / pedagogical | Auditory Horizon | AH |
| Upper boundary (formal) | Upper Periodicity Limen | UPL |
| Upper boundary (colloquial) | Upper Auditory Horizon | UAH |

## See also

- [Amplitude and Time](../foundations/amplitude-time.md) — the physical grounding;
  the second as astronomical convention
- [Periodicity](../foundations/periodicity.md) — the perceptual rate boundary as
  a property of human perception, not underlying structure
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate system anchored
  to the Periodicity Limen
- [Metric DuPeriod — Extended Range](../extended/metric-duperiod-extended.md) — the
  stratospheric positive metric DuPeriod space above musical form
