---
type: concept
title: Rhythmic Phase Coherence
description: >
  Phase coherence is a measure of how stably a performed rhythm's inter-onset
  ratios cluster within their intended prime families across time. It is the
  macro-domain equivalent of phase coherence in a complex tone — describing
  not whether a performer is on the grid, but whether their internal ratio
  relationships are internally consistent. This distinguishes it from both
  absolute timing accuracy and rhythmic tuning.
tags:
  - rhythm
  - phase-coherence
  - inter-onset-ratio
  - prime-families
  - expressive-timing
  - diacritics
  - periodicity-limen
  - prime-period-theory
timestamp: 2026-06-29
---

# Rhythmic Phase Coherence

## The core claim

A performing musician does not produce mathematically exact inter-onset ratios.
Every beat lands at a measurable distance from its notated position; every
interval between beats is slightly longer or shorter than the pure prime ratio
it represents. This is not failure — it is the texture of human music-making.

The question PPT asks is not *how far from the grid* but *how stable is the
deviation*. A deviation that is consistent — that lands reliably at the same
fractional distance from a pure prime ratio, time after time — constitutes an
expressive choice. A deviation that fluctuates — that sometimes overshoot and
sometimes undershoots, without settling — constitutes instability.

**Phase coherence** is the degree to which a performed rhythm's inter-onset
ratios are stable and consistent within their intended prime families across
successive cycles of the phrase.

It is named by direct analogy with its pitch-domain counterpart: in a complex
tone, phase coherence describes the stability of phase relationships between
partials. When partials drift in phase relationship relative to each other, the
result is beating, instability, and perceived roughness. When they are stable,
the tone is clear and clean. The rhythmic case is structurally identical.

## Three independent metrics

PPT distinguishes three metrics for describing rhythmic performance. They are
conceptually independent — a performance may score any combination of high or
low on each.

### Absolute timing accuracy

**What it measures:** deviation from a fixed external reference, typically a
click track, metronome, or notated grid position.

**Reference frame:** external. The grid exists independently of the performance.

**Temporal scope:** point-by-point. Each onset is measured against its target
position individually.

**The question it answers:** *Is this beat landing where the notation says it
should?*

A metronome or click track is the canonical absolute timing reference. Click-
track-locked performance achieves high absolute accuracy. Deliberate rubato
necessarily produces lower absolute accuracy — not because anything is wrong,
but because the performer is intentionally moving away from the external grid.

### Rhythmic tuning

**What it measures:** the position of the fundamental pulse on the Metric
DuPeriod axis — whether the tempo is at the intended BPM target or whether
it is sharp (faster) or flat (slower) than the nominal value.

**Reference frame:** external but perceptual. Rhythmic tuning is analogous to
pitch tuning: the performer can be sharp or flat relative to a target tempo the
way a singer can be sharp or flat relative to concert pitch.

**Temporal scope:** phrase- or section-level. It measures the rate of the
fundamental period, not the positions of individual onsets within it.

**The question it answers:** *Is the fundamental pulse running at the intended
rate?*

Rhythmic tuning uses the same diacritic vocabulary as pitch tuning: a tempo
running slightly faster than the target is described as rhythmically sharp; one
running slightly slower is rhythmically flat. The [Metric DuPeriod](../reference/metric-duperiod.md)
coordinate system provides the continuous axis on which both pitch and rhythmic
tuning are described. See [Rhythmic Grammar](../related/rhythmic-grammar.md) for
how DuPeriod positions interact with rhythmic phrase encoding.

### Phase coherence

**What it measures:** the stability of internal inter-onset ratio relationships
across time — whether the spectrum of the [Rhythmic Overtone Series](rhythmic-overtone-series.md)
is consistently clustered in predictable prime-family positions, or whether it
is drifting and unstable.

**Reference frame:** internal. The ratios are measured between onsets within the
performance itself, not relative to any external grid.

**Temporal scope:** multi-phrase, extending over the time required to observe
ratio consistency across repetitions. A single phrase does not reveal coherence;
it requires multiple passes through the same rhythmic material.

**The question it answers:** *Are the internal ratio relationships of this
phrase stable across time?*

### The independence of the three metrics

| Scenario | Absolute accuracy | Rhythmic tuning | Phase coherence |
|---|---|---|---|
| Click-locked, robotic | High | High | High |
| Deliberate rubato, consistent | Low | Variable | High |
| Rushing unevenly | Low | Sharp | Low |
| On the grid, but "rubbery" | High | High | Low |
| Steadily swung at wrong BPM | High | Flat | High |
| Organic pocket, perfect feel | Low | High | High |

The scenario *on the grid but rubbery* is the most counterintuitive: a
performer can be clicking every beat on the downbeat of the click track and
still produce phase-incoherent internal ratios between non-adjacent beats.
Click-lock measures absolute accuracy only; it says nothing about the internal
ratio spectrum of the phrase.

The scenario *organic pocket, perfect feel* — familiar from great rhythm
section playing — is precisely where absolute accuracy is not the operative
metric. The groove is not measured against an external clock; it is the
internal consistency of the ensemble's shared ratio field.

## Formal definition

Given a rhythmic phrase of `n` beats with onset times `t1, t2, ... tn`,
the **inter-onset ratio** at distance `d` between beats `i` and `j = i + d` is:

```
r(i, d) = (t[i+d] − t[i]) / (t[i+1] − t[i])
```

This expresses the span of `d` beats as a ratio to the unit beat span at that
local position.

For a perfectly even phrase, `r(i, d) = d` for all `i` and all `d`. In
performance, `r(i, d)` will deviate from integer values, residing at a
diacritic position within the [Prime Period Diacritic](../ppd/index.md) system
relative to the nearest pure prime ratio.

**Phase coherence at distance `d`** is the variance of `r(i, d)` across all
positions `i` and across successive repetitions of the phrase. Low variance =
high coherence. High variance = low coherence.

The **phase coherence profile** of a performance is the set of coherence
values across all distances `d` in the phrase's [Rhythmic Overtone Series](rhythmic-overtone-series.md).

## Diacritic deviation: coherent vs incoherent

The [Diacritic System](../uniform-solfege/diacritic-system.md) provides the
vocabulary for naming the fractional displacement of a performed ratio from
its nearest pure prime landmark. A ratio landing at $3/2 + \epsilon$ (slightly
above the 3-prime landmark) receives a HalfSup diacritic description; one
landing at $3/2 - \epsilon$ receives a HalfSub.

This vocabulary enables a precise distinction:

**Coherent diacritic deviation:** the displacement $\epsilon$ is consistent
across repetitions. The performer reliably lands at the same fractional offset
from the pure landmark. The deviation is a stable, describable diacritic
position — not Base, but a specific Sub or Sup that characterises the phrase.

**Incoherent diacritic deviation:** the displacement $\epsilon$ varies
erratically across repetitions. On one pass the ratio is HalfSub; on the next
it is HalfSup; on the third it is near Base. There is no stable diacritic
position to assign — the phrase has no characteristic deviation profile,
only noise.

**Expressive timing is coherent diacritic deviation.** Swing feel, laid-back
grooves, pushed feels, and characteristic ethnic rhythmic vocabulary are all
stable diacritic deviation profiles — they deviate from pure prime ratios in
consistent, reproducible directions. The swing ratio (approximately 2:1 at
the eighth-note level in jazz, often landing near the Tri HalfSup position)
is not a failure to play the triplet exactly; it is a characteristic, stable,
culturally transmitted diacritic offset.

The phase coherence framework makes this distinction formal and measurable: a
swing performance is coherent with diacritic deviation. A rushed or unsteady
performance is incoherent.

## The perceptual correlate

What does phase incoherence sound like?

The perceptual vocabulary for phase-incoherent rhythm includes: *loose*,
*rubbery*, *unsteady*, *not in the pocket*, *rushed*, *dragging*, *falling
apart*. These terms are not describing absolute timing — they are describing
the felt quality of the internal ratio field.

This is directly analogous to the pitch domain:

| Pitch analogy | Rhythmic analogue |
|---|---|
| Out-of-tune ensemble (beating partials) | Phase-incoherent rhythm section |
| Vibrato (stable, regular deviation) | Consistent swing feel (coherent diacritic profile) |
| Nervous wobble (unstable pitch) | Rushes and drags (incoherent ratio drift) |
| Chorus effect (random phase drift between two instruments) | Two drummers with incompatible internal ratio fields |

The perceptual mechanism is the same: the auditory system tracks the stability
of ratio relationships over time and registers instability as roughness,
beating, or incoherence. The Periodicity Limen separates the perceptual
register (pitch vs rhythm) but not the underlying mechanism.

A useful pedagogical frame: *phase coherence is the groove-metre*. It measures
not how close you are to the click, but how consistent you are with yourself.

## The consistency mirror concept

Phase coherence analysis functions as a **consistency mirror** — it reflects
the music's internal ratio structure rather than measuring it against an
external reference.

A conventional metronome or DAW grid is a *standard mirror*: it shows the
musician how far their onsets deviate from a pre-existing external structure.
This is useful but incomplete. It tells the performer how well they match the
template, not how internally consistent their own rhythmic voice is.

A phase coherence analysis is a *consistency mirror*: it shows the musician
the stability of their own inter-onset ratio field over time. It reflects
the music's internal logic — the prime spectral profile of the phrase as
actually performed, and whether that profile is stable or drifting.

This reorientation has practical consequences:

- A rubato performance that uses deliberate deceleration can be phase-coherent
  even as every beat deviates from the fixed grid — because the *ratios between
  beats* can remain stable through the deceleration
- A click-locked performance can be phase-incoherent if the performer's
  internal ratio field is drifting while the downbeats happen to land correctly
- Ensemble coherence is about the matching of ratio fields between players,
  not their individual accuracy to an external reference

The consistency mirror framing is also pedagogically honest: it does not
evaluate the performer against an external standard of "correct" rhythm. It
reveals the structure that is already there in the performance. PPT is
descriptive, not prescriptive — the consistency mirror is its natural
measurement instrument.

## Worked example: swing vs rush

Consider a musician playing a two-bar phrase with a consistent eighth-note
swing feel, then, under pressure, rushing the phrase unevenly.

### Swung phrase (coherent with diacritic deviation)

The phrase is played with a steady swing ratio of approximately 2.1:1 at the
eighth-note level (slightly above the pure 2-prime 2:1, landing near HalfSup
in diacritic terms — the characteristic jazz swing offset).

```
Ideal pure ratios:   1:1  2:1  1:1  2:1  1:1  2:1  ...
Performed ratios:    1:1  2.1:1  1:1  2.1:1  1:1  2.1:1  ...
Diacritic profile:   Base  HalfSup  Base  HalfSup  Base  HalfSup  ...
```

Every repetition of the phrase lands at the same diacritic positions.
The ratio spectrum has a stable, characteristic deviation from pure 2-prime
values. Phase coherence is high. Absolute accuracy against a straight eighth-
note grid is low — and intentionally so.

### Rushed phrase (incoherent deviation)

Under pressure, the musician's ratio field becomes unstable. The swing offset
drifts: some pairs are at 2.3:1 (Sup), others snap back to 1.8:1 (HalfSub),
and occasionally reach close to pure 2:1 (Base). There is no stable diacritic
position to describe the inter-onset ratios at distance d=2.

```
Phrase 1:    Base  2.3:1  Base  1.8:1  Base  2.1:1  ...
Phrase 2:    Base  1.9:1  Base  2.4:1  Base  1.7:1  ...
Phrase 3:    Base  2.0:1  Base  2.0:1  Base  2.3:1  ...
Diacritic:   Base  Sup    Base  HalfSub Base  HalfSup ...
             (different each time)
```

The ratio field is drifting between diacritic positions. Phase coherence is
low. A listener would describe this as *rushed* or *unsteady* — not because
the beats are late or early against a grid, but because the internal ratio
relationships are fluctuating.

**The perceptual difference is clear:** a steadily swung phrase at any tempo
feels settled and intentional. A rushed phrase feels unsettled even when the
downbeats are correct — because it is the internal ratio spectrum, not the
downbeat positions, that creates the felt quality of the groove.

## Relationship to expressive timing

A stable diacritic deviation profile is not merely describable — it is
**reproducible and transmissible**. This is what it means for an expressive
timing choice to be a *choice* rather than an accident.

Characteristic rhythmic signatures in performance practice — the specific swing
ratio of a particular drummer, the pushed-feel of a specific musical tradition,
the laid-back quality of a specific bassist — are stable diacritic deviation
profiles. They can be described in PPT terms, transmitted pedagogically, and
recognised by trained listeners.

The diacritic vocabulary provides precision that performance instruction
traditionally lacks. "Play it with more swing" is a direction with no defined
endpoint. "Aim for HalfSup at the eighth-note 2-prime position" describes a
specific, reachable target in the inter-onset ratio field.

Phase coherence provides the quality metric for that description: the deviation
profile is only a meaningful expressive choice if it is coherently executed.
High coherence + characteristic diacritic offset = expressive style.
Low coherence + characteristic *average* diacritic offset = aspiring to a style
but not yet executing it consistently.

## See also

- [Rhythmic Overtone Series](rhythmic-overtone-series.md) — the inter-onset
  ratio spectrum whose stability phase coherence measures; the prerequisite
  concept
- [Prime Period Diacritics](../ppd/index.md) — the diacritic system for naming
  fractional ratio deviation from pure prime landmarks
- [Diacritic System](../uniform-solfege/diacritic-system.md) — the full
  diacritic suffix specification (Sub, HalfSub, Base, HalfSup, Sup, Axis)
  used to describe diacritic deviation profiles
- [Periodicity Limen](../perception/periodicity-limen.md) — the perceptual
  boundary that separates rhythm from pitch; the anchor for the pitch/rhythm
  identity claim that motivates the phase coherence analogy
- [Rhythmic Grammar](../related/rhythmic-grammar.md) — the formal encoding
  system for rhythmic grouping structure that phase coherence analysis extends
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate system
  on which rhythmic tuning (as distinct from phase coherence) is measured
- Rhythmic Tuner *(forthcoming)* — a proposed tool for measuring and displaying
  phase coherence profiles in real-time performance
