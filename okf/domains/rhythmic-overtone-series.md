---
type: concept
title: Rhythmic Overtone Series
description: >
  A rhythmic phrase of n evenly spaced beats generates a spectrum of
  inter-onset ratio relationships across all beat distances, not just
  adjacent ones. This spectrum mirrors the structure of the harmonic
  overtone series — not by analogy, but as the same mathematical structure
  appearing on the macro side of the Periodicity Limen.
tags:
  - rhythm
  - overtone-series
  - periodicity
  - prime-families
  - periodicity-limen
  - inter-onset-ratio
  - prime-period-theory
timestamp: 2026-06-29
---

# Rhythmic Overtone Series

## The core claim

A pitched tone has a **harmonic spectrum** — a structured set of partial
frequencies standing in integer ratios to a fundamental. Their amplitudes
decrease as the partial number increases: the fundamental is loudest, the
second partial (2:1) is next, the third (3:1) next, and so on. The prime
complexity of the partials increases as their frequency of occurrence decreases.

A rhythmic phrase of n evenly spaced beats has an **inter-onset ratio spectrum**
with the same structure — not approximately, not analogously, but as the same
mathematical object expressed at a different timescale.

This is a direct consequence of [Prime Period Theory's](../foundations/periodicity.md)
core thesis: the [Periodicity Limen](../perception/periodicity-limen.md) is a
perceptual boundary, not a structural one. The same mathematical relationships
that generate the harmonic series at audio rates generate an equivalent
structure at rhythmic rates.

## Formal definition

Given a phrase of **n evenly spaced beats**, label each onset position
1, 2, 3, ... n. For any two onset positions i and j where j > i, the
**inter-onset ratio** at distance d = j − i is:

```
ratio(d) = d : 1   (inter-onset span of d beats relative to 1 beat)
```

The full set of inter-onset ratios in a phrase is the collection of all
such ratios for d = 1, 2, 3, ... n−1.

The **occurrence count** of ratio d within a phrase of n beats is:

```
count(d, n) = n − d
```

That is: a distance of d=1 (adjacent beats) occurs n−1 times; a distance
of d=2 occurs n−2 times; and so on. Larger distances are less frequent —
exactly as higher partials are lower in amplitude in the harmonic series.

The **rhythmic overtone spectrum** of a phrase of n beats is therefore:

| Distance d | Ratio  | Prime family | Occurrences in n-beat phrase |
|-----------|--------|--------------|------------------------------|
| 1         | 1:1    | 2-prime (unison / 2-prime octave equivalence) | n − 1 |
| 2         | 2:1    | 2-prime      | n − 2 |
| 3         | 3:1    | 3-prime      | n − 3 |
| 4         | 4:1    | 2-prime (2²) | n − 4 |
| 5         | 5:1    | 5-prime      | n − 5 |
| ...       | ...    | ...          | ... |
| n−1       | (n−1):1 | Depends on n−1 | 1 |

The pattern is precise: **prime complexity increases as occurrence frequency
decreases**. The most common relationship is the simplest (d=1, 2-prime);
the least common is the most complex (d=n−1, depends on the prime
factorisation of n−1).

## Worked example: 4-beat phrase

Consider four evenly spaced beats: positions 1, 2, 3, 4.

All inter-onset pairs, grouped by distance:

**Distance d = 1** (adjacent pairs: 1–2, 2–3, 3–4) — ratio **1:1** — 3 occurrences
```
●   ●   ●   ●
|→1→|   |   |
    |→1→|   |
        |→1→|
```

**Distance d = 2** (pairs: 1–3, 2–4) — ratio **2:1** — 2 occurrences
```
●   ●   ●   ●
|——→2——→|   |
    |——→2——→|
```

**Distance d = 3** (pair: 1–4) — ratio **3:1** — 1 occurrence
```
●   ●   ●   ●
|————→3————→|
```

Summary table:

| Distance | Ratio | Prime family | Count | Relative frequency |
|----------|-------|--------------|-------|--------------------|
| d = 1    | 1:1   | 2-prime      | 3     | Most frequent      |
| d = 2    | 2:1   | 2-prime      | 2     | Less frequent      |
| d = 3    | 3:1   | 3-prime      | 1     | Least frequent     |

This is structurally identical to the first three partials of the harmonic
series: the fundamental (1:1), the first overtone (2:1), and the second
overtone (3:1) — with amplitude decreasing as partial number increases, and
prime complexity increasing as amplitude decreases.

## The identity with the harmonic overtone series

In the harmonic series, the k-th partial stands in ratio k:1 to the
fundamental, and its amplitude is (in the idealised case of a sawtooth
wave) proportional to 1/k. The prime factorisation of k determines which
prime family the partial belongs to.

In the rhythmic overtone series of a phrase of n beats:

- The d-th ratio class stands in ratio d:1 to the unit beat
- Its occurrence count is n − d, which decreases linearly as d increases
- The prime factorisation of d determines which prime family the ratio belongs to

The structural parallel is exact:

| Property | Harmonic overtone series | Rhythmic overtone series |
|----------|--------------------------|--------------------------|
| Ratios   | k:1 for k = 1, 2, 3, ...| d:1 for d = 1, 2, ..., n−1 |
| Amplitude / frequency | Decreases with k | Decreases with d (n − d occurrences) |
| Prime family | Determined by prime factorisation of k | Determined by prime factorisation of d |
| First new prime introduced | 3-prime at k=3 | 3-prime at d=3 |
| 2-prime dominance | k=1, 2, 4, 8 most prominent | d=1, 2, 4 most frequent |

This is not a loose analogy or a heuristic likeness. The [Periodicity Limen](../perception/periodicity-limen.md)
establishes that pitch and rhythm are the same phenomenon at different
timescales. The harmonic series is the spectrum of inter-period ratios
generated by a resonant vibrating body at audio rates. The rhythmic
overtone series is the spectrum of inter-onset ratios generated by an
evenly spaced rhythmic phrase at rhythmic rates. They are both generated
by the same underlying structure — integer ratio relationships between
periodic signals — and their profiles mirror one another for the same
reason that a perfect fifth and a 3:2 polyrhythm feel related: they are
the same mathematical object.

## Prime spectral profiles

Every rhythmic phrase — whether even or uneven — has a **prime spectral
profile**: a characteristic distribution of prime families across its
inter-onset ratio set.

**Even spacing** produces the simplest possible profile. All inter-onset
ratios are of the form d:1 with d ∈ {1, 2, ..., n−1}. The profile is
dominated by 2-prime ratios (d = 1, 2, 4, 8 ...) with each new prime
family introduced at the corresponding prime distance. This is the
rhythmic equivalent of a pure harmonic series with all partials present.

**Uneven spacing** shifts the profile. If the beats are not equidistant,
the inter-onset distances d are no longer consecutive integers; the ratio
set changes, and so does its prime distribution. A 2+1 grouping (hard
swing, triplet feel) introduces a 2:1 relationship at adjacent beats where
an even phrase would have 1:1, bringing 2-prime character into the local
texture. A 3+2+2 grouping (Balkan asymmetric metre) produces a profile
containing 5-prime and 7-prime relationships that a standard 4/4 phrase
does not.

**Polyrhythm** between simultaneous phrases creates a composite spectrum
from both phrase profiles together. The interference between those spectra
is the perceptual experience of the polyrhythm. Phrases whose spectra
share prime families will feel related; phrases with non-overlapping
prime families will feel more independent and complex.

## Relationship to Prime Period Diacritics

[Prime Period Diacritics (PPD)](../ppd/index.md) provide notation for
fractional deviations from pure prime ratios in pitch space. The same
system applies to rhythmic inter-onset ratios.

A phrase whose beats deviate slightly from perfect integer ratios — as
is the case in all live performance, and as is cultivated intentionally in
groove and swing — has inter-onset ratios that are not exactly d:1 but
slightly displaced from those positions. The PPD diacritic system provides
the vocabulary for naming those displacements at any precision level.

This is the same operation as applying diacritics to pitch intervals
deviating from pure just intonation ratios. The diacritic system is
indifferent to timescale: it names fractional ratio displacement from a
pure prime landmark, whether that landmark is a pitch interval or a
rhythmic inter-onset span.

See [Diacritic System](../uniform-solfege/diacritic-system.md) for the
full specification of the suffix states (Sub, HalfSub, Base, HalfSup,
Sup, Axis).

## Implications

**Every rhythm has a prime spectral profile.** This profile is not a
post-hoc description imposed on the rhythm; it is generated by the
inter-onset structure of the phrase itself. A rhythmist working within PPT
can ask of any pattern: what is its prime spectral distribution? Which
prime families dominate? Which are absent?

**Even spacing is a special case, not a default.** The even phrase
produces the simplest, most regular spectral profile — the rhythmic
equivalent of a pure tone. All rhythmic complexity can be understood as
a deviation from this baseline toward more complex prime profiles.

**Rhythmic consonance and dissonance follow from spectral overlap.** Two
rhythmic patterns played simultaneously will feel more consonant when their
prime spectral profiles share families and more dissonant or complex when
they do not. This is the same mechanism as harmonic consonance.

**The overtone series is bidirectional across the Periodicity Limen.**
A spectrum of integer-ratio partials is not only something that happens
inside a pitched tone. It happens at every scale at which a periodic
pattern generates sub-patterns at integer multiples — including the
rhythmic phrase scale. The Periodicity Limen separates the perceptual
mode, not the underlying structure.

## See also

- [Periodicity Limen](../perception/periodicity-limen.md) — the perceptual
  boundary at which pitch and rhythm diverge; the anchor for the identity claim
- [Periodicity](../foundations/periodicity.md) — the unifying thesis: pitch,
  rhythm, and timbre as one phenomenon at different timescales
- [Prime Families](../foundations/prime-families.md) — the prime generators
  that classify inter-onset ratios
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate system
  that places both pitch and rhythmic periods on the same continuous axis
- [Rhythm](rhythm.md) — the macro-periodicity domain; metre, polyrhythm,
  swing understood through prime-ratio interference
- [Rhythmic Grammar](../related/rhythmic-grammar.md) — the formal encoding
  system for rhythmic grouping structure that this spectral framing extends
- [Timbre](timbre.md) — the micro-periodicity domain; the harmonic overtone
  series whose structure the rhythmic overtone series mirrors
