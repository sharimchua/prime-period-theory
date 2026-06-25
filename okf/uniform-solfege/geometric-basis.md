---
type: concept
title: Uniform Solfège — Geometric Basis
description: >
  How the Uniform Solfège character set and the Prime Period Theory mark
  derive from a single geometric construction — nested regular and irregular
  polygons sharing a circumcircle, one per prime family, with the family
  overlaps producing emergent figures including the Do glyph.
tags:
  - uniform-solfege
  - geometric-basis
  - prime-families
  - notation
  - logo
  - prime-period-theory
timestamp: 2026-06-20
---

# Geometric Basis

## Why geometry, not just glyphs

Most notation systems use symbols by arbitrary convention — the symbol for a
pitch is agreed upon, not derived. Uniform Solfège instead derives its
character set from explicit geometric construction on the chromatic circle,
so that **reading the symbol is simultaneously reading the underlying
interval geometry**. This is a different pedagogical mechanism from
convention-based notation: a student who spends time writing and reading the
symbols absorbs the geometry of prime-family relationships through the act
of using the notation, without needing to separately memorise a rulebook.

This page documents the specific geometric construction — both as the basis
for the character set and as the basis for the Prime Period Theory mark
(logo) itself, which were developed from the same underlying geometry.

## The base construction: one circle per prime family

Each of the five [prime families](../foundations/prime-families.md) is
represented by a shape inscribed on its own concentric circle, all sharing
a common centre:

- **2-prime** — the outermost circle itself. The circle, rather than a
  polygon, represents 2-prime because the octave (2/1) is what makes the
  pitch space circular in the first place — octave equivalence collapses
  an infinite line of pitches into a loop. The container *is* the 2-prime
  relationship, not a shape sitting inside it.
- **3-prime** — an equilateral triangle, inscribed on the outer circle.
- **5-prime** — a regular pentagon, inscribed on the same outer circle,
  sharing its apex vertex with the triangle.
- **7-prime** — an irregular, mirror-symmetric heptagon, constructed on its
  own smaller circle nested inside the triangle/pentagon figure.
- **11-prime** — a near-regular hendecagon (11-sided figure), nested inside
  the heptagon, small enough to be visually indistinguishable from a plain
  circle at most sizes.

This nesting is not arbitrary. For regular polygons sharing one circumradius,
more sides means the polygon's edges sit closer to the circle (the apothem
grows with side count). A triangle's edges cut in to 50% of the radius; a
pentagon's to 81%; a heptagon's to 90%; an 11-gon's to 96%. The result is
that higher prime families naturally nest more closely against the circle —
the 11-prime family, the most subtle and least commonly used, is correctly
the family that is hardest to visually distinguish from the 2-prime circle
itself, echoing its status as the most perceptually marginal of the five
families admitted into PPT (see [Prime Families](../foundations/prime-families.md)
for the reasoning behind the 11-limit ceiling).

## Triangle and pentagon: a shared apex

The triangle (3-prime) and pentagon (5-prime) are both drawn point-up,
sharing the same apex vertex on the outer circle. This shared apex is the
construction's anchor point — both shapes are referenced from a single
origin direction, rather than independently rotated.

## The heptagon: constructed from pentagon edges, not regular

A regular heptagon does not arise naturally from the triangle/pentagon
overlay — direct intersection of a triangle and pentagon only ever produces
five or six points, never seven, regardless of relative rotation. The
heptagon is instead **constructed deliberately**, using the pentagon's own
edges as alignment guides:

- The heptagon's base (its lowest mirrored vertex pair) is set to lie along
  the pentagon's own base edge.
- The next vertex pair up on each side is solved to fall exactly on the
  pentagon's upper edges (the two edges adjacent to the shared apex).
- The remaining vertex pair, and the top vertex, are positioned at regular
  angular spacing but with radii interpolated from the solved pairs.

The result is a heptagon with **mirror symmetry only** — left-right
reflectional symmetry about the vertical axis — but not full rotational
regularity. Its side lengths are not equal. This irregularity is
intentional and meaningful: 7 is not a Fermat prime, and does not tile or
resolve as cleanly against 12-based or 5-based structure as 3 and 5 do. An
irregular heptagon, constructed from — but not equal to — the regularity of
its neighbouring families, is a visually honest representation of that fact.

## The 11-gon: comma-perturbed near-circle

The innermost figure, representing 11-prime, is built as a near-regular
11-sided polygon. Its vertices are perturbed from a perfectly regular
hendecagon by a small amount tied directly to the **Pythagorean comma** —
the ratio by which twelve justly-tuned fifths overshoot seven octaves,
approximately 1.36%:

```
comma = (3/2)^12 / 2^7 − 1  ≈  0.01364
```

This perturbation is applied as a small radius modulation per vertex,
rather than as an arbitrary irregularity. The result is a shape that reads
as a plain circle at small sizes or from a distance, and only reveals its
asymmetry on close inspection — a literal visual encoding of the comma
itself: a discrepancy so small it is inaudible in most contexts, but real
and structurally present once you look closely enough. This mirrors the
11-prime family's role in PPT generally: the most subtle of the five
admitted families, perceptible only with attention.

## Fractal reading

Because each tier of the construction (circle → triangle/pentagon →
heptagon → 11-gon) uses the same underlying logic — a shape constructed
with reference to the shapes outside it, nested on its own circle — zooming
into the innermost 11-gon and re-running the same construction process at
that smaller scale would, in principle, reveal another nested set of
prime-family shapes. The construction does not formally repeat at smaller
scales in the current mark, but the *reading* of the figure as a fractal —
zoom in, find another layer — is a deliberate and accurate way to view it,
consistent with the [self-similarity across scales](../foundations/amplitude-time.md#self-similarity-across-scales)
that is foundational to PPT generally.

## The emergent Do glyph

One property of this construction was not designed in advance but emerged
from it, and was kept because it is genuinely meaningful: scaling the
11-gon outward until its lowest extent just touches the triangle's base
edge, then taking the overlap region of the 11-gon and the triangle,
produces a shape that is rounded across the top and sides but flattened
along the bottom — a cup or "U" profile. This matches the existing
hand-drawn glyph for **Do** in the Uniform Solfège character set (see
[Diacritic System](diacritic-system.md) for the base character set this
glyph belongs to).

This is treated as a meaningful coincidence rather than an engineered
outcome: the same geometric logic used to encode the prime families
independently produces the system's own notation for the tonic, the
anchor point of the whole notation system. It is not used as justification
for the construction, but it is recorded here because it reinforces that
the geometry is doing real representational work, not just decorative
arrangement.

## Relationship to the Prime Period Theory mark

This construction is also the basis for the PPT project mark (logo). The
full version — outer circle, triangle, pentagon, heptagon, and 11-gon all
visible together — serves as the construction diagram and full mark. A
minimal version uses only the outer circle and the filled Do-glyph overlap
shape, suitable for a favicon or small-scale use.

## See also

- [Diacritic System](diacritic-system.md) — the six-state microtonal
  extension built on top of the base character set
- [Uniform Solfège Overview](index.md) — the notation system as a whole
- [Prime Families](../foundations/prime-families.md) — the classification
  this geometry represents
- [Periodicity](../foundations/periodicity.md) — the underlying phenomenon
  the five families organise
