---
type: concept
title: Metric DuPeriod
description: >
  The Metric DuPeriod system is PPT's unified period-length coordinate system,
  anchored at the Periodicity Limen (20Hz / Metric DuPeriod 0) and extending
  in both directions: negative offsets into pitch space, positive offsets
  into rhythmic space. Solfège positions within each DuPeriod band name
  period-length ratios continuously across the auditory boundary, making
  the cross-scale cadential operator numerically explicit.
tags:
  - foundations
  - metric-duperiod
  - periodicity-limen
  - auditory-horizon
  - uniform-solfege
  - rhythm
  - pitch
  - prime-period-theory
timestamp: 2026-06-29
---

# Metric DuPeriod

## Overview

The **Metric DuPeriod** system is a unified period-length coordinate system
that extends continuously from deep pitch space through the Periodicity
Limen and into rhythmic space. It provides a single logarithmic ruler —
anchored at a perceptually meaningful zero point and graduated in solfège
positions — that names any period length in musical terms without reference
to conventional time units.

**Note: Pitch Octave vs. Macro DuPeriod**

While the sub-20Hz pitch space colloquially uses the term "Octave" due to entrenched historical convention, PPT formally designates this periodic doubling in the macro/rhythmic space as the **DuPeriod**. This explicitly grounds the coordinate system in the 2-limit prime family (Du) and provides a scalable nomenclature for exploring form and structure through higher prime lenses (e.g., the TriPeriod or QuiPeriod).


The system has three components:

- **The anchor**: Metric DuPeriod 0, defined as the Periodicity Limen
  (20Hz / 50ms period)
- **The DuPeriod offset**: a signed integer indicating which doubling band
  the period falls in; negative for pitch space, positive for rhythmic
  space
- **The solfège position**: one of the 12 Uniform Solfège syllables
  (Do through Ti) indicating the period's ratio position within the band

A complete address takes the form **[Syllable][offset]** — for example,
**So+4** denotes the So position within Metric DuPeriod +4, a period of
approximately 600ms, corresponding to approximately 100 BPM.

## The anchor: Metric DuPeriod 0

Metric DuPeriod 0 is not a band but a point: the Periodicity Limen at
20Hz / 50ms. It is the Do of the entire system — the tonic from which
all offsets are measured.

This anchor is chosen because it is intrinsic to the perceptual structure
of the system rather than historically contingent. See
[Periodicity Limen](../perception/periodicity-limen.md) for the full argument.

## DuPeriod bands

Each Metric DuPeriod band spans one 2-prime doubling of period length from
its Do floor to its Do ceiling (which is the floor of the next band).
Negative offsets are in pitch space; positive offsets are in rhythmic
space.

### Pitch space (negative offsets)

```
Offset  Period range        Frequency range     Domain
−10     0.050ms → 0.100ms  20kHz → 10kHz       Upper Auditory Horizon
−9      0.100ms → 0.200ms  10kHz → 5kHz        Pitch (high)
−8      0.200ms → 0.400ms  5kHz → 2.5kHz       Pitch (high-mid)
−7      0.400ms → 0.800ms  2.5kHz → 1.25kHz    Pitch (mid-high)
−6      0.800ms → 1.600ms  1.25kHz → 625Hz     Pitch (mid)
−5      1.600ms → 3.200ms  625Hz → 312Hz       Pitch (mid-low)
−4      3.200ms → 6.250ms  312Hz → 160Hz       Pitch (low-mid)
−3      6.250ms → 12.500ms 160Hz → 80Hz        Pitch (low)
−2      12.500ms → 25ms    80Hz → 40Hz         Pitch (very low)
−1      25ms → 50ms        40Hz → 20Hz         Pitch (sub)
 0      50ms               20Hz                PERIODICITY LIMEN (AH)
```

The full audible pitch range is contained within Metric DuPeriods −10 to 0.
Uniform Solfège, Prime Period Diacritics, and 72-EDO already operate in
this space. The Metric DuPeriod system provides those existing systems with
an explicit coordinate address relative to the Periodicity Limen anchor.

### Rhythmic space (positive offsets)

```
Offset  Period range          Approximate BPM   Domain
+1      50ms → 100ms          600+ BPM          Fast subdivision
+2      100ms → 200ms         300–600 BPM       Subdivision
+3      200ms → 400ms         150–300 BPM       Fast tempo
+4      400ms → 800ms         75–150 BPM        Tempo
+5      800ms → 1600ms        37–75 BPM         Slow tempo
+6      1600ms → 3200ms       19–37 BPM         Bar / slow bar
+7      3200ms → 6400ms       —                 Phrase
+8      6400ms → 12800ms      —                 Section boundary
+9      12800ms → 25600ms     —                 Long section
+10     25600ms → 51200ms     —                 Movement boundary
```

## Solfège positions within a metric DuPeriod

Within any DuPeriod band, the 12 solfège positions of Uniform Solfège name
the 12-TET period-length ratios in exactly the same way they name
frequency ratios in pitch space. The Do of any band is its floor period;
the Do of the next band (one octave up) is its ceiling.

For Metric DuPeriod +4 (400ms → 800ms, the comfortable tempo range):

```
Do   400ms   (~150 BPM)   — DuPeriod floor
Ra   423ms
Re   449ms
Me   476ms
Mi   504ms
Fa   533ms
Fi   565ms                — rhythmic tritone (maximum metric tension)
So   599ms   (~100 BPM)   — 3:2 ratio above floor
Le   635ms
La   672ms
Te   712ms
Ti   755ms
Do   800ms   (~75 BPM)    — DuPeriod ceiling / next DuPeriod floor
```

The So position at approximately 600ms / 100 BPM is not incidental — it
is the 3-prime landmark, the same structural position as the perfect fifth
in pitch space, arising from the same 3:2 ratio relationship.

## The Do→So relationship in rhythmic space

In pitch space, Do and So are a perfect fifth apart — a 3:2 frequency
ratio. The interval is consonant because the LCM of the two frequencies
is small: 3 cycles of the upper note coincide with 2 of the lower after
a short period, and the combined waveform returns to its starting point
quickly.

In rhythmic space within a metric DuPeriod, Do and So stand in the same
3:2 ratio — but now it is **period lengths** that are in 3:2 relationship,
not frequencies. The Do pulse and So pulse produce 3 cycles and 2 cycles
respectively in the same span of time. This is a **3:2 polyrhythm**, and
it feels stable and consonant for exactly the same reason a perfect fifth
does: the LCM is small and the resolution point arrives quickly.

This is not an analogy. The Do→So relationship in rhythmic space is the
same mathematical object as the Do→So relationship in pitch space,
projected onto a slower timescale.

The full set of solfège interval relationships within a metric DuPeriod
describes the complete set of polyrhythmic relationships available in
that band:

| Interval | Ratio | Rhythmic meaning |
|----------|-------|-----------------|
| Do → Re  | 9:8   | Fine subdivision shift |
| Do → Mi  | 5:4   | 5-against-4 polyrhythm |
| Do → Fa  | 4:3   | 4-against-3 polyrhythm |
| Do → Fi  | √2:1  | Maximum metric tension — rhythmic tritone |
| Do → So  | 3:2   | Standard hemiola / triplet feel |
| Do → La  | 5:3   | 5-against-3 polyrhythm |

## The rhythmic tritone

The tritone (Fi, position 6) is maximally distant from Do on the circle
of fifths and produces an irrational ratio (square root of 2 over 1) whose LCM never cleanly
resolves. In pitch space this is heard as maximal harmonic tension. In
rhythmic space, a pulse or tempo sitting at the Fi position within a
metric DuPeriod creates **maximum metric instability** — the point of
greatest displacement from the metric tonic, implying resolution toward
So (metric dominant) or Do (metric tonic). A composed passage that introduces a Fi-ratio cross-pulse against the
established metric Do and then resolves through So to a clean LCM
coincidence is a **rhythmic tritone resolution**. The ti-hai in Indian
classical music is a composed instance of this: maximum metric
displacement engineered to land precisely on the sam.

### Multi-Domain Structural Defense
When scaled to macro dimensions (rhythm, form, envelopes), the choice of an irrational midpoint (square root of 2) instead of a split rational pitch pair is uniquely defensible:
1. **Universal Symbology**: It guarantees that a single visual character remains the absolute "Geometric Center of the Period" across all parameters of music, preventing the symbol from splitting into separate over/under characters in non-pitch domains.
2. **The Boundary of Precision**: While natural acoustics spiral infinitely through prime ratios, human structural architecture demands a closed frame. Using the square root of 2 as the ultimate "comma tamer" at the axis caps the system, providing a clean boundary line where geometry and prime-limit arithmetic shake hands.

## The cross-scale cadential operator

In pitch space, a 2-5-1 cadence is a walk from Re (supertonic tension)
through So (dominant pull) to Do (tonic resolution) — a directed motion
toward LCM coincidence along the circle of fifths.

In rhythmic space within a metric DuPeriod, the same walk describes a
**rhythmic cadence**:

1. **Metric supertonic** — introduce a cross-family polyrhythm (5-prime
   or 7-prime against the established grid); complex LCM, slow resolution,
   maximum metric tension
2. **Metric dominant** — collapse to a 3:2 hemiola against the pulse;
   simple LCM, fast resolution implied, forward motion toward coincidence
3. **Metric tonic** — full LCM coincidence; all streams land on the
   downbeat together

With pitch content locked (static chord or drone), this produces
**cadential motion implied entirely through rhythmic means**. The listener
experiences tension and resolution as a purely metric phenomenon, with no
harmonic movement.

In the Metric DuPeriod system, a pitch 2-5-1 and a rhythmic 2-5-1 are the
same sequence of solfège positions (Re → So → Do) within the same
coordinate system, projected onto different regions of the period-length
space. The cadential operator is scale-invariant; the perceptual
experience differs because the projection timescale differs.

## Perceptual landmarks in rhythmic space

The meaningful boundaries in positive metric DuPeriod space are predominantly
cognitive and physiological rather than acoustic. This is a genuine
structural asymmetry between pitch space (where boundaries are determined
by acoustic physics) and upper rhythmic space (where boundaries are
determined by memory, attention, and biological oscillation).

| Offset range | Period range  | Landmark | Source |
|-------------|---------------|----------|--------|
| 0           | 50ms          | Periodicity Limen — pitch/rhythm phase transition | Auditory neurology |
| +1 to +2    | 50–200ms      | Subdivision — felt as texture rather than pulse | Temporal resolution |
| +3 to +4    | 200–800ms     | Beat — primary pulse; comfortable tempo range | Motor entrainment |
| +5 to +6    | 800–3200ms    | Bar — metric grouping above beat | Rhythmic cognition |
| +7          | 3200–6400ms   | Working memory ceiling — ~4–8 seconds | Auditory working memory |
| +9 to +10   | 12800–51200ms | Gestalt boundary — ~15–50 seconds; expectation resets | Music cognition |
| −10         | 0.05–0.1ms    | Upper Auditory Horizon (UPL) — 20kHz upper pitch limit | Auditory neurology |

## Diacritic precision across the range

Prime Period Diacritics are available throughout the Metric DuPeriod system,
but their practical necessity varies with the timescale:

- **Pitch space (negative offsets)**: full 72-EDO diacritic precision is
  needed and already specified in the PPD system; the ear is sensitive to
  small deviations at audio rates
- **Rhythmic space +1 to +3**: diacritics are useful for fine subdivision
  specification; timing deviations of a few milliseconds are perceptible
  at fast tempos
- **Rhythmic space +4 and above**: the 12 base solfège positions are
  sufficient; perceptual timing tolerance at beat and bar level is wide
  enough that diacritic precision adds no practical value
- **Rhythmic space +8 and above**: solfège position is approximate;
  the relevant unit of description is the DuPeriod band itself rather than
  the position within it

The precision requirement naturally relaxes as the timescale lengthens —
a structurally meaningful feature of the system rather than a limitation.

## Conventional units as derived measures

BPM and Hz are translation layers for interfacing with conventional
instruments, notation systems, and tools. They are not primary
descriptions within the Metric DuPeriod system.

| Conventional | Metric DuPeriod address | Note |
|-------------|----------------------|------|
| 60 BPM (1 beat/sec) | Re+4 (≈449ms) | Near but not on a prime-ratio landmark |
| 120 BPM | Re+3 (≈449ms in +3 band) | Common reference tempo — not structurally significant |
| 440Hz (A4) | La−4 (672Hz band) | Standard pitch reference — not on prime-ratio landmark |
| 432Hz ("natural" tuning) | Between Le−4 and La−4 | No prime-ratio significance |

The clustering of common reference values near but not on prime-ratio
landmarks confirms that conventional anchors are approximations of
perceptually convenient positions rather than structurally grounded ones.

## See also

- [Periodicity Limen](../perception/periodicity-limen.md) — the anchor definition and
  the argument for grounding measurement in auditory neurology
- [Periodicity](../foundations/periodicity.md) — the perceptual rate
  boundary as a property of human perception
- [Prime Families](../foundations/prime-families.md) — the ratio
  relationships that the solfège positions within each octave encode
- [Rhythm](../domains/rhythm.md) — domain-level context for the positive
  metric DuPeriod space
- [Uniform Solfège](../uniform-solfege/index.md) — the solfège position
  system used within each metric DuPeriod band
- [Rhythmic Grammar](../related/rhythmic-grammar.md) — the cadential
  chain system whose structure the metric DuPeriod formalises
- [Metric DuPeriod — Extended Range](../extended/metric-duperiod-extended.md) — the
  stratospheric positive metric DuPeriod space above musical form
