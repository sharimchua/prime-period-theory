---
type: concept
title: Period Declaration Mechanics
description: >
  Specification mechanism for declaring a Period hierarchy before resolution,
  covering Anchored and Floating subperiods, Adjacency, Anchor Equivalence,
  and Scaled Concatenation.
tags:
  - specifications
  - prime-period-theory
  - period
  - anchors
  - floating
  - tuplet
timestamp: 2026-07-11
---

# Period Declaration Mechanics

This specification details how a Period hierarchy is *specified before resolution*.
A fully resolved Period hierarchy (where every subperiod has actual coordinates) gives no way to answer whether a period was originally declared as Anchored or Floating — both produce an identical result once resolved. The concepts here describe the authoring format and specification logic, not foundational claims about periodicity (for which, see [Period](../foundations/period.md)).

## Anchored and Floating subperiods

A Period's children (subperiods) are each declared as either:

- **Anchored** — declared at an explicit coordinate in the parent's space. An Anchored child is itself a full Period and may have its own explicit width, not merely a point.
- **Floating** — declared as adjacent to another period (an Anchor, or another Floating period), rather than at an explicit coordinate.

**Floating position is a Set relation, not an ordering.** A Floating period declares which period it is adjacent to; it does not declare or require a numeric position relative to any other child. This deliberate structural choice removes an entire category of validation problem: there is no way to declare two children whose stated numeric order contradicts their declared coordinates, because Floating children never state numeric coordinates at all.

This adjacency structure is valid exactly when both of the following hold:

1. **Every anchor or floating period is the referenced neighbour of at most one Floating period, per side.** This prevents two Floating periods from competing for the same neighbour on the same side, and prevents a single Floating period from branching toward two different neighbours on the same side. Together these guarantee the whole adjacency structure decomposes into disjoint linear chains.
2. **Every such chain terminates in an anchor at each end.** This is guaranteed automatically given the foundational fact (see [Period](../foundations/period.md)) that every Period has its own minima/maxima anchors by default: a chain of Floating periods with no interior Anchor still terminates at the parent's own inherent boundary anchors. A run where every child is Floating is the degenerate case of exactly one such chain, bounded by the parent's own minima and maxima.

**Mixing Anchored and Floating children in the same Period is fully supported and does not require picking one mode for all children of a given parent.** What it does require is that the *parent's own extent* already be determined by the time resolution runs. Since a Period genuinely cannot resolve without something outside it fixing an extent somewhere up the chain (per the foundational Deferred Resolution principle), this isn't a special restriction on mixed anchoring — it's the same requirement every Period is already subject to, just visible here because a placed Anchor coordinate has nothing to be stated relative to until it exists.

## Anchor Equivalence

The means of declaration for Floating subperiods must not result in ambiguity. This is formalised through **Anchor Equivalence** — stating that one period's anchor is geometrically equivalent to another.

For **sequential anchoring** (where one period immediately follows another), this equivalence is declared by stating that the `+Axis` (maxima) of the preceding period is equal to the `-Axis` (minima) of the following period.

When anchors are **stretched to meet a boundary** — for example, declaring that a period is the first in its parent's set and must align with the parent's start — this is achieved by stating that the period's `-Axis` is equivalent to the parent's `-Axis`. The analogous rule applies for the final period bounding to the parent's `+Axis`.

In this way, Adjacency is strictly defined as shared geometric anchor points, eliminating ambiguous spacing.

## Scaled concatenation: the resolution mechanism

Every maximal chain of Floating periods between two bounding anchors resolves the same way, whether the chain spans a whole Period (all children Floating, bounded by the parent's own minima/maxima) or an interior run between two explicit Anchors:

1. Sum the natural (self-declared) lengths of every Floating period in the chain.
2. Compute a single scale factor: the space available between the chain's two bounding anchors, divided by that sum.
3. Apply that one scale factor uniformly across every period in the chain.

This is a pure Base (linear) operation on the whole chain — it changes how much of the parent's space the chain occupies without touching the proportions between the children inside it. This is exactly what a notated tuplet already means (three notes compressed into the space of two, each remaining equal to the others), generalised to be the same mechanism used for ordinary concatenation with no imposed target length at all (scale factor of 1, when the chain's natural sum already equals the available space).

### Worked example: mixed subdivisions under a shared parent

Two Floating groups — one naturally 3 units long, one naturally 5 units long — sit under a parent whose own extent is fixed. The parent can compose them two ways, and the coordinate system expresses both without ambiguity:

- **Parent extent = 8** (the sum of the two groups' natural lengths): each group's scale factor is 1; the triplet occupies 3 units and the quintuplet occupies 5, unmodified.
- **Parent extent = 2** (a fixed duple container): the two groups together must compress into 2 units total. Each group's internal scale factor is derived independently from its own natural length against whatever share of the 2-unit space it is assigned. This is the traditional "triplet against a duple beat" and "quintuplet against a duple beat" case, and it is why triplets and quintuplets read as compressed relative to their natural length rather than as a different subdivision system entirely.

In both cases, navigating *down into* either subperiod from its own Do still makes sense entirely locally — the compression is a property of how the group sits in its parent's space, not of the internal relationships between the group's own children.
