---
type: concept
title: Prime Lattice
description: >
  The mathematical space that the PPT comma system navigates. The prime
  lattice is a multi-dimensional coordinate space where each prime family
  defines an independent axis. Comma sequences are ordered paths through
  this space from a local anchor. Covers path dependence, inter-prime
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
required to reach it from a reference point. The comma system native to the lattice
encodes those coordinates as an ordered list of `±x/y` steps, where `x` is the 
index step (as a balanced parity magnitude around 0) and `y` is the bounded prime family 
(e.g., 1 for Boundary/Axis, 2 for Du, 3 for Tri, 5 for Qui, 7 for Sep, 11 for Undec).

The prime lattice is not a PPT invention. It is the natural mathematical
structure underlying just intonation theory, where it is typically
visualised as a two- or three-dimensional grid for the 5-limit (Tri and Qui
axes) or 7-limit (Tri, Qui, and Sep axes). PPT extends this to the 11-limit
by including the Undec axis, and treats Du (the octave axis) explicitly
rather than as a convention of equivalence.

## Lattice coordinates and comma sequences

A comma sequence is an ordered list of steps along prime axes, written natively in `±x/y` format. Each entry
moves from the current position to a new position in the lattice. The
sequence starts from a local anchor (defined by its parent boundary), and each step 
refines the position within the subperiod local to that anchor. Note that the 
use of the twelve chromatic solfège positions as anchors is a specific 
implementation detail of Uniform Solfège, not a native constraint of the prime lattice itself.

The coordinates of a lattice point are determined by the complete path taken
to reach it, not by any single entry. Two comma sequences that traverse the
same axes in different orders may arrive at different positions. This path
dependence is a requirement of the system, not an inconvenience.

### Why path dependence is required

Du fractal navigation makes path dependence unavoidable. Each Du step
specifies which half of the current subperiod to enter — positive for the
upper half, negative for the lower half. A sequence of Du steps is a binary
tree path, and the sequence of decisions is precisely what locates the
position. Du's two choices at any depth are branch-selectors, not point-labels.
Collapsing a Du sequence to a single net value would destroy the
tree structure entirely.

Once path dependence is required for Du, it is extended to all prime families
for consistency and to permit mixed-prime fractal navigation. A sequence that
interleaves Tri and Qui steps describes a path through the lattice that
carries more information than the sum of its Tri and Qui components.

### Generalised Fractal Descent and the Zero Index (Sustain)

For an odd prime `p`, the signed digit set is `{±1, ±2, …, ±(p−1)/2}`.
The formula for the position reached by a path of digits `a_i` with associated primes `p_i` is:

`position = Σᵢ aᵢ / Pᵢ`, where `Pᵢ = ∏ⱼ₌₁ⁱ pⱼ`

Importantly, the zero index (`0`) is a valid and crucial operator in the underlying math, acting as a **Sustain**. A zero over a prime family does not displace position; rather, it performs a period space reduction for the next level. The scale of the next level is determined by the product of the next level's prime family and the prime family where the zero index was applied.

If the zero index is applied over another zero (an axis descent on zero), the reduction is determined by the exponent of the next prime family descent — structurally akin to carrying over the multiplier from a strike in bowling. This ensures the theoretical space has no unreachable gaps ("Cantor gaps"), even if the current visual writing system does not yet map all these internal routes.

## No exact inter-prime coincidence

Within a single prime family, the subdivision grid is regular and
non-overlapping. Du steps halve the subperiod at each level; Tri steps
divide it by 3; and so on. These grids are clean trees with no internal
intersections.

When navigating exclusively via pure, single-prime descents (e.g., a pure Tri path versus a pure Qui path), exact coincidence across different families is mathematically impossible. This follows from the fundamental theorem of arithmetic: for
any two distinct primes p and q, the equation p^m = q^n has no solution
in positive integers m and n. There is no depth at which a grid of pure
Du subdivisions and a grid of pure Tri subdivisions share a common point.

The practical consequence: every distinct, single-family comma sequence describes a
distinct lattice position. (Note that this non-coincidence applies strictly to pure paths; as noted below, paths built from *mixed* prime families can exhibit Confluence).

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

## Comma complements and the Axis

Each local anchor defines a local subperiod — a bounded region of the
lattice centred on that anchor. The commas array navigates within this region.
It cannot cross into an adjacent anchor's region; that would require
selecting a different base reference, not adding a comma entry.

Within a local subperiod, every position has a **comma complement**: the
position arrived at by inverting the sign of every step in the comma sequence.
The complement is the mirror of the original path, reflected about the
subperiod's centre. The complement of a compression path is an expansion path
of equal magnitude; the complement of a Du positive path is a Du negative path
of the same depth.

Complement positions always sum to the full subperiod length — they are
equidistant from opposite sides of the anchor's local space. This is a direct
consequence of the subperiod being a closed bounded interval with an origin
(the Base) and a shared topological boundary (the Axis). 

Crucially, **Axis and Base are part of the same boundary family**, because Axis is simply the reflection of Base across the subperiod. For Du, the recursive bisection process happens to land exactly on this shared boundary at the first step (`±1/2`), which is why Axis is often introduced alongside Du, but its topological role is prime-agnostic.

The comma complement relationship is internal to each local anchor. It does
not extend across anchors. The complement of a position near a given anchor is another
position near that same anchor.

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

### Path Equivalence and Confluence

Because position depends on the product of primes used across a path, and multiplication commutes, different prime orders can sometimes resolve to the same physical address (e.g., a Tri-then-Qui path vs a Qui-then-Tri path resolving to the same fraction of the period). This commutativity collision across mixed primes is a structural feature of the lattice, not a problem to engineer around. It forms the basis of the **Confluence** relation — a documented equivalence between distinct decision-paths that arrive at the same location. For more details, see [Path Equivalence and Confluence](../extended/path-equivalence.md).

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

## Mathematical Lineage

The mathematical structures described here build on established number-theoretic and tuning-theoretic machinery:
- The multi-dimensional coordinate space of prime families is the established representation in **Regular Temperament Theory (RTT)**, commonly known as **monzos** (prime-exponent vectors), formalised by Gene Ward Smith, Adriaan Fokker, and Joe Monzo.
- The boundary family and compactification logic shares deep intuitions with the **Stern-Brocot tree** and **Erv Wilson's Scale Tree**, which seeds its construction with `0/1` and `1/0`.
- Uniqueness within a single prime is governed by the mathematics of **balanced base-p signed-digit systems** (e.g., balanced ternary).

PPT synthesises these existing tools, generalises balanced descent across mixed primes, maps it to a period-operator grammar, and applies it identically across pitch and rhythm.

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
- [Path Equivalence and Confluence](../extended/path-equivalence.md) — how different paths
  can resolve to the same point