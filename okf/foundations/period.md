---
type: concept
title: Period
description: >
  The general bounded-space object underlying every coordinate system in
  PPT — pitch octaves, rhythmic bars, dynamic ranges, and any other
  range-bounded musical parameter are all instances of a Period. Defines
  the default minima/midpoint/maxima anchor structure, the Base/Reel
  coordinate-relationship distinction (a real geometric property that
  survives resolution) and the Cast operation between them, and the
  general form of deferred resolution.
tags:
  - foundations
  - prime-period-theory
  - period
  - anchors
  - reel
  - cast
  - metric-duperiod
timestamp: 2026-07-10
---

# Period

## What a Period is

A **Period** is a continuous, bounded range with a lower bound (its
**minima**), an origin (its **midpoint**), and an upper bound (its
**maxima**). Every Period has these three anchors by default. This is
the single object PPT uses to represent any range-bounded musical
parameter — a pitch octave, a rhythmic bar, a dynamic swell, an effect
envelope — rather than a different bespoke structure per domain.

The midpoint is the Period's origin and is conventionally named **Do**.
The minima and maxima are the same physical boundary approached from
opposite directions (a Period is circular/octave-equivalent by default,
the same way pitch space wraps at the octave), and are named **±Fi** in
Solfège anchor terms or **±Axis** in Prime Lattice anchor terms. This
dual naming of a single point is intentional, not redundant — see
[Anchors and Prime Lattice Coordinates](anchors.md) for why Fi/Axis
sitting at exactly the midpoint's antipode is a structural necessity of
a Do-centred circular space, not a coincidence requiring separate
justification per domain.

This single model generalises two concepts that appear in more specific
forms elsewhere in PPT. The external absolute that binds a rhythm
hierarchy to clock time (a BPM, a reference tempo) and the one that
pins a pitch hierarchy to audible frequency (a reference pitch) are
both instances of the same structural requirement: every Period needs
its midpoint-anchor supplied from outside — described fully under
Deferred Resolution below. Equally, the reference point around which
pitch comma sequences navigate is the midpoint-anchor of a pitch-octave
Period. Both are the same structural role; they appear as distinct
concepts only because the domains in which they appear were originally
described separately.

## Base vs. Reel: a real geometric property, not an authoring choice

A Period's coordinate relationship to its parent is either:

- **Base** — the Period's coordinates are direct linear multiples of the
  parent's. A rhythmic subdivision (a bar divided into four beats) is
  Base: beat 2 sits at exactly twice the position of beat 1.
- **Reel** — the Period's coordinates are a *logarithm* of the parent's,
  with a named prime base. **DuReel** means the coordinate space is
  `log2` relative to the parent — this is the existing pitch-cents
  convention (`cents = 1200 × log2(ratio)`), now named and generalised
  rather than treated as a special pitch-only rule. **TriReel**,
  **QuiReel**, and so on name the analogous relationship using `log3`,
  `log5`, etc. as the base — these are exact (`logₚ(x) = log2(x)/log2(p)`
  is a lossless change of base) but are notational conveniences for
  reasoning in a prime-native frame; they add no expressive power beyond
  what DuReel already provides, since any quantity expressed in one Reel
  base converts losslessly to any other.

The test for whether a property belongs in a foundational description of
a Period — rather than in a discussion of how periods are specified or
authored — is whether it **survives resolution**: whether the claim
remains true of a fully-resolved coordinate structure with no memory of
how it was built. Base/Reel passes this test. A resolved pitch position
genuinely stands in a logarithmic relationship to its parent octave —
that is a fact about auditory perception and periodicity (equal-sounding
intervals are equal ratios), not a residue of how the position was
specified. It would still be true if every mechanism that produced it
were erased and only the final coordinates remained.

## Cast: returning to the parent's linear space

**Cast** is the operation that takes a Reel-typed coordinate and returns
it to the parent's linear (Base) space for a multiplicative step, before
re-entering Reel space. Mechanically, Cast and its inverse are
exponentiation and logarithm — exact inverses of each other. A
DuReel-typed Period performing a **DuCast** computes `2^(position/N)` to
drop into linear ratio-space, applies an ordinary multiplicative step
(e.g. "multiply by 4/3"), and returns via `log2` — landing on exactly
`log2(4/3)` in the DuReel coordinate, identical to adding that log value
directly. Cast is a notational convenience for reasoning about a step
the way a musician thinks about it ("multiply the frequency"), sitting
on top of arithmetic that is exact either way — not a separate operation
that could reintroduce approximation.

**Implementation caveat:** Cast is only lossless if it uses the true
irrational value (e.g. the full-precision `log2(3)`) rather than a
rounded rational stand-in. An implementation that rounds a Cast'd
position to a fixed-precision rational before the next operation
reintroduces approximation error — the same rational-versus-irrational
gap that separates a Base-mode path from the exact JI position it
approximates. This is a correctness requirement for any Cast
implementation, not a theoretical nicety.

## Deferred resolution

A Period cannot supply its own external absolute. Nothing in a Period
hierarchy is bound to an absolute unit until some point outside the
hierarchy — a BPM, a reference pitch, a reference dynamic level —
supplies one. This is a real constraint on what a Period *is*, not a
convention about how one is authored: a ratio, by construction, has
nothing internal to it that could fix its own register. This property
is sometimes stated as the **Principle of Local Closure**: a period's
own ratio mathematics can never resolve its own anchor.

## Generalisation across domains

The bounded-space structure, the Base/Reel distinction, and deferred
resolution all apply uniformly whether the range being described is a
pitch octave, a rhythmic bar, a dynamic swell, or any other
range-bounded parameter — only the top-level Anchor's identity (a BPM,
a pitch, a reference level) and whether a given domain's internal
relationships are Base or Reel differ per domain.

## See also

- [Periodicity](periodicity.md) — the underlying physical phenomenon
  that a Period formalises as a bounded coordinate space
- [Prime Families](../foundations/prime-families.md) — the prime-generated ratio
  relationships that operate within and between Periods
- [Anchors and Prime Lattice Coordinates](anchors.md) — the pitch-domain
  instance of this model: a DuReel-typed octave and its twelve solfège
  Anchors
- [Prime Lattice](../foundations/prime-lattice.md) — the Base/Reel coordinate-mode
  distinction as it applies to comma-sequence navigation specifically
- [Metric DuPeriod](../reference/metric-duperiod.md) — the timescale
  axis, understood as a chain of DuReel-typed Periods anchored at
  the Temporal-Place Limen
