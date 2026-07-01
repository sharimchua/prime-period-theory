---
type: concept
title: Prime Lattice
description: >
  The mathematical space that the PPT comma system navigates. The prime
  lattice is a multi-dimensional coordinate space where each prime family
  defines an independent axis. Comma sequences are ordered paths through
  this space from a solfège anchor. Covers path dependence, inter-prime
  non-coincidence, comma complements, and enharmonic equivalence as an
  application-layer relation.
tags:
  - foundations
  - prime-period-theory
  - just-intonation
  - prime-families
  - comma
  - microtonality
  - lattice
timestamp: 2026-07-01
---

# Prime Lattice

## What the prime lattice is

The five prime families recognised by PPT — Du (2), Tri (3), Qui (5),
Sep (7), Undec (11) — are mathematically independent. No combination of
steps along one prime family's axis can exactly reach a position on another
prime family's axis, because powers of distinct primes share no common
factors. This independence means the families define genuinely separate
dimensions of a multi-dimensional space. That space is the **prime lattice**.

Any musical position that can be described in PPT terms — any pitch, any
rhythmic duration, any timbral partial — is a point in the prime lattice.
Its coordinates are determined by how many steps along each prime axis are
required to reach it from a reference point. The [comma system](../specifications/midi-solfege-input.md)
encodes those coordinates as an ordered array of `{ prime, step }` entries.

The prime lattice is not a PPT invention. It is the natural mathematical
structure underlying just intonation theory, where it is typically
visualised as a two- or three-dimensional grid for the 5-limit (Tri and Qui
axes) or 7-limit (Tri, Qui, and Sep axes). PPT extends this to the 11-limit
by including the Undec axis, and treats Du (the octave axis) explicitly
rather than as a convention of equivalence.

## Lattice coordinates and comma sequences

A comma sequence is an ordered list of steps along prime axes. Each entry
moves from the current position to a new position in the lattice. The
sequence starts from the solfège anchor — one of the twelve chromatic
positions — and each step refines the position within the subperiod local
to that anchor.

The coordinates of a lattice point are determined by the complete path taken
to reach it, not by any single entry. Two comma sequences that traverse the
same axes in different orders may arrive at different positions. This path
dependence is a requirement of the system, not an inconvenience.

### Why path dependence is required

Du fractal navigation makes path dependence unavoidable. Each Du step
specifies which half of the current subperiod to enter — positive for the
upper half, negative for the lower half. A sequence of Du steps is a binary
tree path, and the sequence of decisions is precisely what locates the
position. Collapsing a Du sequence to a single net value would destroy the
tree structure entirely.

Once path dependence is required for Du, it is extended to all prime families
for consistency and to permit mixed-prime fractal navigation. A sequence that
interleaves Tri and Qui steps describes a path through the lattice that
carries more information than the sum of its Tri and Qui components.

## No exact inter-prime coincidence

Within a single prime family, the subdivision grid is regular and
non-overlapping. Du steps halve the subperiod at each level; Tri steps
divide it by 3; and so on. These grids are clean trees with no internal
intersections.

Across different prime families, exact coincidence is mathematically
impossible. This follows from the fundamental theorem of arithmetic: for
any two distinct primes p and q, the equation p^m = q^n has no solution
in positive integers m and n. There is no depth at which a grid of pure
Du subdivisions and a grid of pure Tri subdivisions share a common point.

The practical consequence: every distinct comma sequence describes a
distinct lattice position. The representation is injective — no two
different paths arrive at exactly the same point.

## Nearest approach and the origin of simple ratios

Although prime family grids never exactly coincide, they approach each other
arbitrarily closely as depth increases. The points of nearest approach are
where the familiar simple integer ratios of just intonation arise.

At depth 1, the nearest approach between the Du grid (which divides by 2)
and the Tri grid (which divides by 3) is the ratio 3:2 — the perfect fifth.
This is not the point where the two grids meet; it is the most compact
description of the gap between them at their first level of subdivision. The
gap itself — the residue that prevents exact coincidence — is the Pythagorean
comma, approximately 23.46 cents.

At depth 4, the nearest approach between Tri and Qui grids produces the ratio
81:80 — the syntonic comma, approximately 21.51 cents. Four Qui steps and
four Tri steps arrive at positions that are nearly but not exactly the same.

The pattern is general: simple integer ratios emerge as the most
mathematically compact descriptions of nearest approach between prime family
grids at a given depth. The simpler the ratio, the shallower the convergence
depth, and the larger the residual comma. Ratios are derived from the lattice
structure; they are not the primitive objects. The comma path is prior.

## Comma complements

Each solfège anchor defines a local subperiod — a bounded region of the
lattice centred on that anchor. The commas array navigates within this region.
It cannot cross into an adjacent solfège anchor's region; that would require
selecting a different syllable, not adding a comma entry.

Within a local subperiod, every position has a **comma complement**: the
position arrived at by inverting the sign of every step in the comma sequence.
The complement is the mirror of the original path, reflected about the
subperiod's centre. The complement of a compression path is an expansion path
of equal magnitude; the complement of a Du positive path is a Du negative path
of the same depth.

Complement positions always sum to the full subperiod length — they are
equidistant from opposite sides of the anchor's local space. This is a direct
consequence of the subperiod being a closed bounded interval with a centre
point (the Axis, at Du step 1 or -1 from the anchor midpoint).

The comma complement relationship is internal to each solfège anchor. It does
not extend across anchors. The complement of a position near Do is another
position near Do, not a position near Fi.

## Enharmonic equivalence

Enharmonic equivalence — two distinct representations describing the same
musical position — exists at two levels in the prime lattice.

**Within the spec:** No two distinct `(solfege, commas[])` pairs describe the
same lattice position. The representation is injective as established above.
There are no enharmonic equivalents at the level of the spec output type.

**Across the spec:** Enharmonic equivalence is a **relation** between spec
output objects, not a property of any single object. It is defined by a
function that takes two output objects and a temperament description and
returns whether they resolve to the same position under that temperament.

Different temperaments define different equivalence relations over the same
set of spec outputs:

- **12-TET** declares a large number of equivalences simultaneously, collapsing
  the full lattice onto twelve points. Under 12-TET, many distinct comma
  sequences are equivalent because the temperament rounds them all to the
  nearest semitone.
- **31 EDO** declares fewer equivalences, distinguishing Qui-based positions
  from their Tri-based neighbours while collapsing Sep and Undec positions
  that 12-TET also collapses.
- **72 EDO** declares still fewer, distinguishing positions that 31 EDO
  treats as equivalent, covering the full comma space with fine
  resolution.
- **Just intonation** declares no equivalences — every distinct comma path
  is a distinct pitch.

Temperament is therefore an application-layer decision about which
near-coincidences to declare exact. The spec carries the full lattice
information. The application chooses its resolution.

## Relationship to Prime Period Diacritics

Prime Period Diacritics (PPD) is the **writing system rendering** of comma
values. It provides visual glyph forms for a practical subset of the lattice
positions most relevant to musical use. The PPD system is necessarily finite —
a glyph set has a fixed number of members — while the lattice is infinite.

The relationship is analogous to decimal notation and real numbers: the
decimal system can represent any rational number to arbitrary precision by
adding digits, but cannot represent irrational numbers exactly. PPD can
represent any lattice position to practical musical precision by combining
glyph forms, but the lattice itself is finer than any finite glyph set.

PPD does not define the lattice. The lattice defines the space that PPD
renders. See [Prime Period Diacritics — Overview](../ppd/index.md) and
[Glyph Forms](../ppd/glyph-forms.md) for the visual specification.

## Relationship to the Metric DuPeriod

The prime lattice applies equally across all timescales. A pitch position
and a rhythmic duration occupy the same mathematical space — they differ only
in their position along the [Metric DuPeriod](../reference/metric-duperiod.md)
axis, which locates them at the micro or macro scale of periodic recurrence.

The subperiod concept is universal: a subperiod is any subdivision of a
containing period, whether that period is a pitch octave or a rhythmic bar.
The comma system navigates subperiods at any timescale without modification.
Period-fixed and subperiod-fixed relationships (the mathematical basis for
polyrhythm and polymeter respectively) are both naturally described in
lattice terms — see [Rhythm](../domains/rhythm.md).

## See also

- [Prime Families](prime-families.md) — the five generators and their
  perceptual properties
- [Periodicity](periodicity.md) — the underlying phenomenon the lattice
  describes
- [MIDI to Solfège Input Specification](../specifications/midi-solfege-input.md)
  — the formal output type that encodes lattice positions
- [Prime Period Diacritics — Overview](../ppd/index.md) — the writing system
  that renders lattice positions visually
- [Just Intonation](../tuning/just-intonation.md) — the tuning theory context
  for prime lattice positions
- [72 EDO Grid](../tuning/72-edo-grid.md) — a practical finite approximation
  of the lattice used for diacritic placement
- [Metric DuPeriod](../reference/metric-duperiod.md) — the timescale axis
  across which the lattice applies
- [Rhythm](../domains/rhythm.md) — period-fixed and subperiod-fixed
  relationships in rhythmic terms