---
type: concept
title: Tetrachord-Pair Generation of Heptatonic Scales
description: >
  A combinatorial method for generating heptatonic scales by pairing two
  three-interval fragments across a join interval, complementing the
  3-limit fifth-stacking method. Covers the symmetric perfect-fourth case
  (the Western/Carnatic mode space), the asymmetric-span extension using
  a semitone join, and the correspondence between the resulting scale set
  and the Carnatic melakarta system.
tags:
  - tuning
  - scales
  - heptatonic
  - tetrachord
  - uniform-solfege
  - combinatorics
  - melakarta
  - prime-period-theory
timestamp: 2026-07-01
---

# Tetrachord-Pair Generation of Heptatonic Scales

## Overview

[Pentatonic and Heptatonic Structures](pentatonic-heptatonic.md) derives the
diatonic scale set by stacking 3-limit perfect fifths. This page develops a
second, complementary generative method: building a heptatonic scale by
joining two three-interval fragments — **tetrachords** in the classical
sense — across a connecting interval. Where the fifth-stacking method
generates scales from a single repeated 3-prime operation, the
tetrachord-pair method generates them from local interval composition,
using the interval primitives of [Uniform Solfège](../uniform-solfege/index.md)
directly. The two methods converge on overlapping but not identical
scale sets, and the tetrachord-pair method extends naturally into
territory the fifth-stacking method does not reach.

This is offered as a worked combinatorial structure within PPT's
descriptive frame, not as a claim that any tetrachord-pair theory is novel
in itself — tetrachord-based scale construction has a long history in
Western, Greek, and Indian theory (see Historical context, below). What
this page formalises is the **exhaustive combinatorial space** of
tetrachord pairs under a small set of explicit construction rules, expressed
in Uniform Solfège notation, and the observation that this space — once
extended beyond the symmetric perfect-fourth case — substantially
recovers the Carnatic melakarta system from first principles.

## Definitions

A **tetrachord** in this context is a sequence of exactly three intervals
spanning some total distance in semitones, generating four notes (the root,
two internal notes, and the span boundary). This is the classical Greek
sense of the term, not a 4-note pitch-class set in the post-tonal sense.

A **tetrachord pair** consists of a **lower tetrachord**, a **join
interval**, and an **upper tetrachord**, concatenated to produce seven
intervals — six notes plus octave closure — a heptatonic scale.

```
lower tetrachord (3 intervals) + join (1 interval) + upper tetrachord (3 intervals)
= 7 intervals = heptatonic scale
```

For octave closure, the three components must sum to 12 semitones.

## The symmetric case: perfect-fourth tetrachords

### Span constraint

The classical tetrachord spans a **perfect fourth** (5 semitones, **Fa**
in Uniform Solfège). Two Fa-span tetrachords plus a join must sum to 12,
which forces the join to be **Re** (2 semitones, a whole tone): 5 + 2 + 5 = 12.
This is the structural reason the classical tetrachord-pair system
universally uses a whole-tone join — it is the only join value that
permits two symmetric perfect-fourth tetrachords to close the octave.

### Valid Fa-span fills

Restricting individual intervals within a tetrachord to **Ra** (1
semitone) and **Re** (2 semitones) — the two smallest Uniform Solfège
primitives — the compositions of Fa (5) into three parts give six
permutations, falling into three structurally distinct forms (each form
and its rotations):

| Form | Intervals | Name |
|---|---|---|
| Re-Re-Ra | 2-2-1 | Major tetrachord |
| Re-Ra-Re | 2-1-2 | Minor tetrachord |
| Ra-Re-Re | 1-2-2 | Phrygian tetrachord |

A fourth family, built from **Me** (3 semitones, minor third) and **Ra**,
also spans Fa: Me-Ra-Ra, Ra-Me-Ra, Ra-Ra-Me. Of these three permutations,
only **Ra-Me-Ra** (the augmented second flanked symmetrically by
semitones) produces named scales in combination with the Re-Re-Ra family
under a Re join — it functions as the generative "harmonic" tetrachord.
Me-Ra-Ra and Ra-Ra-Me, with the augmented second at an edge rather than
centred, do not combine productively under a Re join (see Combinatorial
results, below).

### Combinatorial results

Pairing all six forms above (lower × upper, 36 combinations) under a Re
join produces every diatonic mode, every standard derived-minor scale, and
several scales with established names outside the Western canon:

| Lower | Upper | Scale |
|---|---|---|
| Re-Re-Ra | Re-Re-Ra | Ionian (major) |
| Re-Re-Ra | Re-Ra-Re | Mixolydian |
| Re-Ra-Re | Re-Re-Ra | Melodic minor (ascending) |
| Re-Ra-Re | Re-Ra-Re | Dorian |
| Re-Ra-Re | Ra-Re-Re | Aeolian (natural minor) |
| Ra-Re-Re | Ra-Re-Re | Phrygian |
| Re-Re-Ra | Ra-Me-Ra | Acoustic / Lydian dominant |
| Re-Ra-Re | Ra-Me-Ra | Harmonic minor |
| Ra-Me-Ra | Re-Re-Ra | Neapolitan major |
| Ra-Me-Ra | Ra-Re-Re | Phrygian dominant |
| Ra-Me-Ra | Ra-Me-Ra | Double harmonic major (Byzantine / Hijaz Kar) |
| Ra-Re-Re | Re-Re-Ra | Neapolitan minor |

Lydian and Locrian do not appear in this table. Both have a tritone (six
semitones) before their first semitone step, meaning the natural
bisection point of either mode does not land on a perfect-fourth boundary
— they resist tetrachord-pair construction under the Fa-span constraint
entirely. This is a genuine structural property of those two modes, not a
gap in the enumeration.

### Correspondence with the Carnatic melakarta system

The full 36-combination space (all six tetrachord forms paired against all
six, under a Re join) was cross-checked against the 72 Carnatic
**melakarta** scales. Every combination not already named in Western
theory corresponds to a documented melakarta (or a mode of one),
including the combinations using **Ma-Ra-Ra** and **Ra-Ra-Ma**, which
produce no Western-named result. This is a striking convergence: the
melakarta system, developed independently within Carnatic theory using
its own generative logic (fixing the lower tetrachord and varying the
upper across all permutations of the 12-tone gamut), exhaustively covers
essentially the same combinatorial space that the tetrachord-pair method
with a Re join derives from first principles. Scales without a Western
name are not "uncharted" — they are uncharted only in Western nomenclature.

This is independent corroborating evidence for the structural validity of
the tetrachord-pair method as a generative frame, in the same spirit as
the tala/ti-hai correspondence documented in [Periodicity](../foundations/periodicity.md):
a tradition with no exposure to the other's formal system converges on
the same underlying mathematical structure.

## The asymmetric case: variable spans with a Ra join

### Why Ra join requires asymmetric spans

A **Ra join** (1 semitone) cannot pair two Fa-span (5-semitone)
tetrachords, since 5 + 1 + 5 = 11, not 12. For a Ra join to close the
octave, the two tetrachord spans must be **asymmetric** and sum to 11.
The three structurally meaningful asymmetric span pairs, named using
Uniform Solfège interval syllables, are:

| Lower span | Upper span | Sum + Ra join |
|---|---|---|
| Me (3) | Le (8) | 3 + 1 + 8 = 12 |
| Mi (4) | So (7) | 4 + 1 + 7 = 12 |
| Fa (5) | Fi (6) | 5 + 1 + 6 = 12 |

(Each pair also has its mirror: Le+Me, So+Mi, Fi+Fa.)

### Fill enumeration

Holding the constraint at exactly three intervals per tetrachord (to keep
the result heptatonic) and requiring each individual interval to be at
least Ra (1 semitone), the number of valid three-interval fills for a span
of N semitones is the number of ordered compositions of N into three
positive integer parts, which equals **C(N−1, 2)** — a triangular number:

| Span | Semitones | Valid fills |
|---|---|---|
| Me | 3 | 1 |
| Mi | 4 | 3 |
| Fa | 5 | 6 |
| Fi | 6 | 10 |
| So | 7 | 15 |
| Le | 8 | 21 |

This produces 252 total combinations across the six asymmetric span pairs
(18 + 18 for Mi/So, 42 + 42 for Fa/Fi, 3 + 3 for Me/Le). Critically, this
enumeration does not restrict individual fill intervals to {Ra, Re, Me} —
once a span exceeds Fa, larger single intervals (Mi, Fa, Fi themselves)
become valid components of a fill. A Le-span tetrachord of **Fi-Ra-Ra**
(6+1+1=8) is as structurally valid as **Re-Me-Me** (2+3+3=8); both are
three-interval compositions of Le with a minimum part of Ra.

### Status and relationship to existing systems

A literature check (see Historical context, below) finds no existing
formalisation of heptatonic scale generation via asymmetric tetrachord
spans with a parameterised join interval. The closest precedents — the
Carnatic melakarta system, the 2018 "Classification of Seven Tone Scales"
enumeration of 66 ET heptatonic formulas, and Slonimsky's *Thesaurus of
Scales and Melodic Patterns* — either assume symmetric perfect-fourth
tetrachords, enumerate exhaustively without a tetrachord-pair generative
structure, or organise around equal octave division rather than paired
fragments. The asymmetric-span, parameterised-join formalisation
documented on this page is, as far as can currently be established,
original combinatorial groundwork rather than a restatement of an
existing system. This status note should be revisited if contradicting
prior art surfaces — the framework's commitment to first-principles
derivation over inherited convention (see [Core Tenets](../context/tenets.md))
makes this an open rather than closed claim.

The asymmetric-span combinations have not yet been exhaustively
cross-referenced against named scale systems (Carnatic, maqam, or
otherwise) the way the symmetric case has. This is flagged as further
work.

## Historical context

Tetrachord-based heptatonic construction is not new to PPT — it has a
documented lineage in ancient Greek theory (the diatonic, chromatic, and
enharmonic genera), medieval Guidonian theory, and is recognised in
several non-Western traditions. What this page adds within the PPT frame
is: (1) a complete enumeration of the symmetric perfect-fourth case
expressed in Uniform Solfège syllables rather than Western interval
names, (2) the explicit cross-check against the Carnatic melakarta system
demonstrating near-total combinatorial overlap, and (3) the asymmetric-span
generalisation with a parameterised join interval, which appears to be
unformalised territory.

## Relationship to the fifth-stacking method

The tetrachord-pair method and the fifth-stacking method described in
[Pentatonic and Heptatonic Structures](pentatonic-heptatonic.md) are not
competing derivations of the same scale set — they are different
generative operations that happen to produce overlapping output. Fifth-stacking
is a single repeated 3-prime operation; tetrachord-pairing is local
interval composition followed by a single join. The diatonic modes
(Ionian through Locrian, excepting the two tetrachord-resistant modes
noted above) are reachable by both methods. Harmonic minor, melodic
minor, and the double harmonic family are reachable by tetrachord-pairing
but not by simple fifth-stacking, since they are not contiguous
fifth-chains. This makes tetrachord-pairing the more general of the two
methods for heptatonic scale generation within PPT, while fifth-stacking
retains its own explanatory value for *why* the diatonic set in particular
is so widespread (see Pentatonic and Heptatonic Structures for the
3-limit acoustic argument).

## Pedagogical application

The tetrachord-pair structure has a direct pedagogical use independent of
its theoretical completeness: a tetrachord is a single physical shape
(fixed internal intervals) that a student can learn once and then slide to
different starting positions. This makes it usable as a **diagnostic probe**
for identifying the key of a piece by ear — testing whether a given
tetrachord shape fits a passage narrows the key candidates to two (the
lower-half or upper-half position of that tetrachord within the octave),
after which one or two further notes resolve the ambiguity. Different
tetrachord forms (major, minor, phrygian, the Ra-Me-Ra harmonic form) act
as probes with different false-positive risk profiles depending on the
repertoire — the major tetrachord, for instance, also appears
non-diagnostically inside harmonic minor and is therefore a weaker probe
for material using a raised seventh. This application connects the
tetrachord-pair structure to [Music as Language](../context/music-as-language.md)'s
broader case for PPT as a vocabulary that supports ear-first rather than
notation-first learning.

## See also

- [Pentatonic and Heptatonic Structures](pentatonic-heptatonic.md) — the
  3-limit fifth-stacking generative method; the complementary derivation
  this page extends
- [Uniform Solfège — Overview](../uniform-solfege/index.md) — the
  interval syllable system (Ra, Re, Me, Mi, Fa, Fi, So, Le) used
  throughout this page
- [Base-12 Algebra](../uniform-solfege/base-12-algebra.md) — the clock
  arithmetic underlying span and join summation
- [Melodic Grammar](../related/melodic-grammar.md) — how tetrachord
  positions are notated as absolute or intervallic melodic movement
- [Periodicity](../foundations/periodicity.md) — the tala/ti-hai
  cross-tradition convergence that the melakarta correspondence here
  parallels
- [Core Tenets](../context/tenets.md) — first principles over inherited
  convention; the methodological commitment this page's status note
  reflects
- [Just Intonation](just-intonation.md) — the ratio-based tuning context
  within which these scales may be realised
