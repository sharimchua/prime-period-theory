---
type: concept
title: Prime Lattice
description: >
  The mathematical space that the PPT comma system navigates. The prime
  lattice is a multi-dimensional coordinate space where each prime family
  defines an independent axis. Comma sequences are ordered, rational paths
  through this space from a local anchor. Covers path dependence, inter-prime
  non-coincidence, comma complements, and enharmonic equivalence as an
  application-layer relation. Also establishes the boundary between comma
  paths (rational, navigational) and JI ratio space (log2-defined, generally
  irrational in path-relative terms), and corrects prior claims of lineage
  to monzos and the Stern-Brocot tree.
tags:
  - foundations
  - prime-period-theory
  - just-intonation
  - prime-families
  - comma
  - microtonality
  - lattice
timestamp: 2026-07-07
revision: "2026-07-07 (rev 2): separated comma-sequence paths from JI ratio/log2 space; anchors are now independently defined (see Anchors and Prime Lattice Coordinates); corrected 'nearest approach' causality; corrected Confluence justification; removed monzo/Stern-Brocot lineage claim in favour of an explicit distinction"
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
(e.g., 2 for Du, 3 for Tri, 5 for Qui, 7 for Sep, 11 for Undec). Du (`2`) is the only 
entry that can appear at the coarsest open frame *or* at an interior depth.
 
**A comma sequence produces a rational position, always.** This is not a
precision limitation — it is a closure property of the arithmetic described
below. It is the single most important fact about the prime lattice, and it
determines everything in the "Prime lattice paths are rational" section
further down: how paths relate to JI ratios, why anchors are defined
independently of paths, and what a comma actually measures.
 
## Lattice coordinates and comma sequences
 
A comma sequence is an ordered list of steps along prime axes, written natively in `±x/y` format. Each entry
moves from the current position to a new position in the lattice. The
sequence starts from a local anchor (defined by its parent boundary), and each step 
refines the position within the subperiod local to that anchor. Note that the 
use of the twelve chromatic solfège positions as anchors is a specific 
implementation detail of Uniform Solfège, not a native constraint of the prime lattice itself.
Anchors themselves are *not* produced by comma sequences — see
[Anchors and Prime Lattice Coordinates](anchors-and-prime-lattice-coordinates.md)
for how they are defined.
 
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
 
`position = Σᵢ aᵢ / Pᵢ`, where `Pᵢ = ∏ⱼ₌₁ⁱ pⱼ` (where every `pⱼ` in a valid path is a true prime: 2, 3, 5, 7, or 11)
 
Every term in this sum is a rational number (an integer divided by a product
of integer primes), and a finite sum of rationals is rational. This is the
formal source of the closure property stated above.
 
Importantly, the zero index (`0`) is a valid and crucial operator in the underlying math, acting as a **Sustain**. A zero over a prime family does not displace position; rather, it performs a period space reduction for the next level. The scale of the next level is determined by the product of the next level's prime family and the prime family where the zero index was applied.
 
If the zero index is applied over another zero (an axis descent on zero), the reduction is determined by the exponent of the next prime family descent — structurally akin to carrying over the multiplier from a strike in bowling. This ensures the theoretical space has no unreachable gaps ("Cantor gaps"), even if the current visual writing system does not yet map all these internal routes.
 
## No exact inter-prime coincidence
 
Within a single prime family, the subdivision grid is regular and
non-overlapping. Du steps halve the subperiod at each level; Tri steps
divide it by 3; and so on. These grids are clean trees with no internal
intersections.
 
When navigating exclusively via pure, single-prime descents (e.g., a pure Tri path versus a pure Qui path), exact coincidence across different families is mathematically impossible. This follows from the fundamental theorem of arithmetic: a pure `p`-family position always reduces to a fraction whose denominator is a power of `p`, and a pure `q`-family position always reduces to a fraction whose denominator is a power of `q`. For two such fractions to be equal (other than at 0), a power of `p` would have to equal a power of `q` — impossible for distinct primes.
 
The practical consequence: every distinct, single-family comma sequence describes a
distinct lattice position. (Note that this non-coincidence applies strictly to pure paths; as noted below, paths built from *mixed* prime families can incidentally coincide — see Confluence).
 
## Prime lattice paths are rational; JI ratios are logarithmic
 
This section states explicitly what the rest of the document implies: **the
prime lattice's native position formula and a Just Intonation ratio's true
geometric position are two different kinds of number, and no path in this
grammar can produce the second from the first.**
 
A JI ratio's geometric position (its angle around the period, or
equivalently its distance in cents from the origin) is:
 
`cents = 1200 × log2(ratio)`
 
`log2(ratio)` is irrational for every ratio except a pure power of 2 — this
follows from the same fundamental theorem of arithmetic invoked above.
Meanwhile, a comma sequence of any finite length is, by the closure property
established earlier, always rational. A rational number cannot equal an
irrational one. This means:
 
- No finite comma sequence can land *exactly* on the true position of a
  ratio like 6/5, 5/4, or 16/15 (all irrational in cents-from-origin terms).
- A comma sequence can only ever get arbitrarily *close* — closer as depth
  increases, the same way a longer decimal expansion gets closer to an
  irrational number without ever reaching it.
- The residual gap between a finite comma sequence's actual position and a
  ratio's true log2 position is a genuine, quantifiable **comma** in the
  ordinary sense of the word — not an error to eliminate, but the natural
  unit of "how far off" a rational approximation sits.
This is also why the twelve solfège anchors are **not** derived by walking a
comma sequence from Do. Each anchor is independently defined by its own
`1200 × log2(ratio)` value (or, for Fi, directly as the irrational point
±600¢ = 1200 × log2(√2)). Comma sequences instead do what they are
structurally suited for: **navigating and refining position relative to an
anchor**, at whatever rational precision the depth of the sequence provides.
See [Anchors and Prime Lattice Coordinates](anchors-and-prime-lattice-coordinates.md)
for the full anchor definitions and how paths relate to them as refinements.
 
## Nearest approach and rational approximation of simple ratios
 
Although prime family grids never exactly coincide, they approach each other
arbitrarily closely as depth increases, and — separately — a pure single-family
comma path approaches a *given target ratio's* true log2 position
arbitrarily closely as depth increases. Both statements describe convergence,
not identity, consistent with the previous section.
 
At depth 1, a single Tri step's position is 1/3 of the period — 400¢ in a
1200¢ octave. The true position of the 3-limit fifth, 3:2, is `1200 ×
log2(3/2) = 701.96¢`; a single *negative* Du half-step paired with Tri
(reaching the octave-reduced 3/2) still leaves a residual: the classic
Pythagorean comma, ≈23.46¢, is exactly this kind of gap, expressed as a
frequency-ratio residue (`3¹²/2¹⁹`) rather than as a position-formula
residue. It is the discrepancy between twelve compounded pure fifths and
seven compounded octaves.
 
At depth 4, four compounded Qui-generated major thirds and four
compounded Tri-generated fifths produce positions that are nearly, but not
exactly, the same frequency ratio; the residue is the syntonic comma,
≈21.51 cents (81:80).
 
The pattern is general: simple integer ratios are already-known targets
(defined independently, by their own small-integer construction) that happen
to be well-approximated by shallow nearest-approach constructions between
prime grids. **The ratio is not produced by the approach — it is what the
approach is being measured against.** This is the corrected version of a
claim in earlier revisions of this document, which stated the reverse
(that ratios are derived from, and posterior to, comma paths). That
direction of causality does not hold: ratios and their log2 positions are
prior and independent; comma paths can approximate them but not generate them
exactly.
 
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
 
Crucially, Axis and Base define the boundary of the subperiod, with Axis acting as the reflection of Base across the local space. Axis is not a separate family. It is simply Du's own first-step digit (`±1/2`), viewed relative to whichever local anchor's frame is currently open, landing exactly on this shared boundary.
 
The comma complement relationship is internal to each local anchor. It does
not extend across anchors. The complement of a position near a given anchor is another
position near that same anchor.
 
### Boundary Routing and Transient Excursions
 
In a strictly hierarchical lattice, pathing near the boundaries can create dead zones where an additive step would exceed local space limits (e.g., reaching Fa from Do). To resolve this, the pathing engine supports **Transient Excursions** (or Boundary Reflections). 
 
This allows navigation to use the Du digit that represents the edge of the coarsest still-open frame as a non-terminal pivot; interior Du digits may not. By assuming an infinite tiling of the local space, a path can step to this edge and then cast a negative vector backward into the defined local bounds. As long as the *terminal* step resolves to a coordinate inside the known macro-bounds, the path is valid.
 
For the formal implementation details and mathematical foundations, see the [Prime Lattice Boundary Routing](../specifications/prime-lattice-boundary-routing.md) specification.
 
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
 
Position depends on the product of primes used at each depth of a path
(through the `Pᵢ` denominators in the position formula), and different
orderings of the same set of prime steps generally produce *different*
`Pᵢ` sequences and therefore different positions — path dependence, as
established above, is the default. Occasionally, however, two differently
ordered paths land on the same rational value anyway, purely as an
arithmetic coincidence of the particular digits and primes involved (not
because of any general commutative law over the position formula itself,
which is not a multiplicative structure). This incidental collision is a
structural feature of the lattice worth naming, not a problem to engineer
around. It forms the basis of the **Confluence** relation — a documented
equivalence between distinct decision-paths that happen to arrive at the
same location. For more details, see
[Path Equivalence and Confluence](../extended/path-equivalence.md).
 
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
renders. Solfège anchors are the fixed points PPD's glyphs sit closest to;
comma-sequence refinements (and their diacritic renderings) describe
*distance and direction from* an anchor, never a derivation *of* one. See
[Prime Period Diacritics — Overview](../ppd/index.md) and
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
 
## Relationship to established number-theoretic structures
 
Earlier revisions of this document claimed the prime lattice traced lineage
to Regular Temperament Theory monzos and to the Stern-Brocot tree. On
closer inspection, that lineage claim does not hold, and it's worth being
precise about why, since the surface resemblance is real even though the
underlying structures are not the same:
 
- **Not a monzo.** A monzo is a prime-exponent vector describing a ratio
  by *multiplication*: `ratio = ∏ pᵢ^eᵢ`. It is order-independent by
  construction, because multiplication commutes. A comma sequence is
  order-*dependent* by construction (see "Why path dependence is
  required," above) and is built from *division of a bounded period*, not
  multiplication of exponents. These are different operations producing
  different kinds of object — one an exact (possibly irrational) frequency
  ratio, the other a rational tree-address within a bounded space. Confluence
  (immediately above) is the closest point of contact between the two ideas,
  and even that is a coincidental collision rather than the general
  commutative equivalence a monzo would guarantee.
- **Not a Stern-Brocot tree.** The Stern-Brocot tree is generated by a fixed
  mediant operation and a fixed radix (it enumerates *all* rationals via
  binary mediant descent). The prime lattice's fractal descent instead lets
  the navigator choose which prime's radix to apply at each depth, and
  supports the zero-index Sustain as a first-class period-reduction
  operator with no Stern-Brocot equivalent. The prime lattice is better
  described as its own variable-radix, signed-digit, author-directed
  positional system — related in spirit to balanced base-`p` signed-digit
  systems (e.g., balanced ternary) at any single depth, but not equivalent
  to either monzos or Stern-Brocot once mixed primes and Sustains are in
  play.
- **What is genuinely shared:** the balanced signed-digit convention within
  a single prime family, and the general idea (common to all three
  structures) of representing a continuous space via nested, boundary-aware
  subdivision. That resemblance motivated the original comparison; it just
  doesn't extend to the full mixed-prime, order-sensitive system PPT
  actually uses.
## See also
 
- [Anchors and Prime Lattice Coordinates](anchors-and-prime-lattice-coordinates.md)
  — how the 12 solfège anchors are independently defined via log2(ratio),
  and how comma-sequence paths relate to them as refinements
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
  can incidentally resolve to the same point
