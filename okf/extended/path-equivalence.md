---
type: concept
title: Path Equivalence and Confluence
description: >
  Details the structural feature of path equivalence within the prime lattice,
  where different navigational paths through mixed prime families can resolve
  to the same physical point, and introduces the concept of Confluence.
tags:
  - foundations
  - prime-lattice
  - comma
  - prime-period-theory
timestamp: 2026-07-07
---

# Path Equivalence and Confluence

## The limits of path uniqueness

In the [Prime Lattice](prime-lattice.md), every point is defined by an ordered sequence of steps along prime axes, descending recursively into smaller subdivisions of a period. 

As stated in the prime lattice definition, within a **single prime family**, the subdivision grid is regular and every path maps to a unique position. The mathematics of balanced base-p signed-digit systems guarantees that no two different paths of pure Tri digits, or pure Qui digits, can arrive at the same fractional position.

However, when paths mix different prime families (e.g., interleaving Tri and Qui steps), this uniqueness property breaks down.

## Commutativity collision

This lack of uniqueness across mixed primes is not an edge case or a bug — it is a mathematically guaranteed structural feature of the system. 

The physical position of any point in the lattice is determined by the formula:

`position = Σᵢ aᵢ / Pᵢ`, where `Pᵢ = ∏ⱼ₌₁ⁱ pⱼ`

Because the denominator `Pᵢ` relies on the *product* of all primes used so far, and multiplication commutes (i.e., `3 × 5 = 5 × 3`), different sequences of prime choices can yield the same denominator, and ultimately the same position. 

### A concrete example

Consider a depth-2 path aiming for the fractional position `4/15`:

**Path 1 (Tri then Qui):**
- Step 1: Tri, digit +1 (position `1/3`)
- Step 2: Qui, digit −1 (position `1/3 - 1/15 = 4/15`)

**Path 2 (Qui then Tri):**
- Step 1: Qui, digit +1 (position `1/5`)
- Step 2: Tri, digit +1 (position `1/5 + 1/15 = 4/15`)

These are two structurally distinct decision sequences, in different prime orders, that resolve to the exact same physical address in the period space.

## Confluence

We do not frame this commutativity collision as a problem to be solved. Rather, it is an observation of how the lattice behaves. In PPT, this relationship is known as **Confluence**.

Confluence is the comma-space analogue to enharmonic equivalence in pitch space (e.g., G♯ and A♭ being different spellings of the same pitch). It documents an equivalence class between distinct decision-paths — whether they use the same or different prime orders, at the same or different depths — that arrive at the same location. 

Recognising Confluence allows a composer or theorist to treat the *path taken* as a meaningful choice (a compositional decision about how a period is recursively subdivided) even when the *final destination* is identical to another route. Furthermore, because there is no longer a separate Boundary family, a coarsest-frame Du digit (licensed pivot) and an interior Du digit now participate in Confluence relations on the exact same footing as any other prime's digits.

## See also

- [Prime Lattice](prime-lattice.md) — the full mathematical space
- [Prime Families](prime-families.md) — the prime generators
