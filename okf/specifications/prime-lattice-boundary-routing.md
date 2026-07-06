---
type: reference
title: Architecture Specification - Prime Lattice Boundary Routing
description: >
  Defines the boundary routing rules for the Prime Lattice, addressing the 
  Tritone Dead Zone through Transient Excursions. Details the mathematical 
  foundations using Mixed-Radix Balanced Number Systems, Interval Arithmetic, 
  and Projective Geometry, along with implementation directives for path evaluation.
tags:
  - specifications
  - prime-period-theory
  - prime-lattice
  - boundary-routing
  - note-navigator
timestamp: 2026-07-04
---

# Architecture Specification: Prime Lattice Boundary Routing

## 1. The Core Routing Problem: The Tritone Dead Zone

In a strictly hierarchical, prime-factor lattice (bases 2, 3, 2) describing 12-Tone Equal Temperament (12TET), every navigation step is not merely an additive interval, but a restriction of the addressable local subspace. 

Under strict original routing rules, any navigation that touched the global supremum (the Tritone Axis / Fi, coordinate `+1/0`) was required to be **terminal**, because the boundary to the next region was considered an unknowable address space. 

However, building paths to boundary-adjacent nodes—specifically **Fa** (5) and **So** (7)—from the origin (Do) upwards creates a mathematical "dead zone." Because each prime division tightens the bounds (Interval Arithmetic), reaching Fa requires bounding the local space adjacent to the Axis. If bounded at the Axis, a subsequent Base-2 step violates the strict terminal-boundary rule, making Fa impossible to reach without fundamentally breaking the local space constraints.

## 2. The Solution: Transient Excursions

To resolve this, the pathing engine rules must be updated to support **Transient Excursions** (or Boundary Reflections). This allows the algorithm to safely bypass dead zones by stepping backward from the supremum.

### Updated Path Validation Rules:
1. **Non-Terminal Supremum Navigation:** The global supremum (the Axis / Fi) may be used as a non-terminal pivot node. 
2. **Infinite Tiling Assumption:** While parked on the supremum boundary, the engine assumes an infinite tiling of the local space (i.e., it assumes an equal-width neighbor space exists beyond the boundary).
3. **The Rule of Terminal Escapes (Validation):** A path is only considered an invalid "Boundary Escape" if the *terminal* (final) step resolves to a coordinate outside the known local address space. If the cumulative vector sum of the path pulls the final address back into the defined bounds (stepping back from infinity), the path is strictly valid.

### Example: Pathing to Fa (5)
* **Step 1 (+1/0):** Jump directly to the supremum (Axis/Fi).
* **Step 2 (0/3):** Hold position, inheriting the Base-3 finer subdivision.
* **Step 3 (-1/2):** Step backward by -1/12 of the total space into the known, bounded local region.
* *Result:* A valid, precise address for Fa without zero-width dead zone conflicts.

## 3. Mathematical Foundations

This routing logic is not a mere workaround; it is grounded in three established mathematical frameworks. Implementations of the Note Navigator engine and related pathing logic should use these principles to structure their logic.

### A. Mixed-Radix Balanced Number Systems
The lattice utilizes prime divisions of 2, 3, and 2, making it a **Mixed-Radix** system. By allowing paths like `+1/0, 0/3, -1/2`, the engine leverages a **Balanced Numeral System** (similar to Balanced Ternary). Instead of only adding upwards from zero, the system can utilize negative vectors to step backward from a higher bound. This completely eliminates dead zones caused by strictly additive algorithms.

### B. Interval Arithmetic & Multi-Resolution Analysis
Every step in the path does not just add value; it tightens the boundaries of the addressable space. This is the definition of **Interval Arithmetic**. 
* **Macro-space:** The Octave.
* **Subsequent steps:** Increase the resolution, zooming into a tighter bounded subspace. 

The transient excursion rule is required because, without it, the interval bounds collapse to zero-width near the supremum. Over-shooting and subtracting is mathematically required to maintain resolution.

### C. Projective Geometry (Points at Infinity)
In standard Euclidean space, a boundary is an edge. In **Projective Geometry**, the boundary (the point at infinity) is treated as a perfectly valid, functional coordinate. The Tritone Axis (`+1/0`) acts as this projective point. The engine casts a vector out to it, anchors onto it, and draws a precise vector back into localized space. The tritone is an acoustic mirror, not a wall.

## 4. Implementation Directives for Tools

When integrating this logic into the lattice pathing engine, ensure the following state management principles are applied:

1. **State Evaluation:** Implement path evaluation as a stack or cumulative vector state. Do not throw an `OutOfBounds` exception during intermediate steps just because the coordinate hits `+1/0` or `-1/0`.
2. **Final Validation:** Move the boundary validation logic to the *end* of the path evaluation sequence. Only fail the path if the final calculated state falls strictly outside the `-1/0` to `+1/0` macro-bounds.
3. **Interval Tracking:** Maintain variables for `current_lower_bound` and `current_upper_bound` during path evaluation. Ensure that a negative step (like `-1/2`) correctly calculates its absolute spatial value based on the *inherited subdivision* of the previous step.

## See also

- [Prime Lattice](../foundations/prime-lattice.md) — the mathematical space the boundary routing operates within
- [Note Navigation](../implementations/note-navigation.md) — an active implementation utilizing these routing rules
