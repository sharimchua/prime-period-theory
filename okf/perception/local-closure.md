---
type: concept
title: Perception-Period Local Closure & Residue Triangulation
description: >
  A general method for deriving a Period's anchor (Do) from empirical edge behavior
  of its child periods, rather than stipulating the anchor's coordinate in advance.
tags:
  - perception
  - local-closure
  - triangulation
  - temporal-place-limen
  - prime-period-theory
timestamp: 2026-07-13
---

# Perception-Period Local Closure & Residue Triangulation

## Local Closure

A Period is **locally closed** if its own Do and its ±Cast degradation profile can be fully specified using only empirical data generated within that period, with no reference to any parent coordinate.

Under local closure, a period may still legitimately expose an **edge** — the point where its internal data stops being self-consistent (e.g., stops following a Weber-constant relationship) and signals a change of underlying mechanism. Edges are locally detectable facts about a period; they require no knowledge of what lies on the other side.

This applies recursively: any Period's Do can, in principle, be treated as inferable from child-edge convergence rather than requiring top-down specification, making the Period/Anchor hierarchy buildable bottom-up.

## Residue-as-Period Triangulation

Given two adjacent, locally-closed periods P1 and P2 with self-detected edges E1 (P1's bound closest to the shared boundary) and E2 (P2's bound closest to the shared boundary), the span between E1 and E2 is itself an unclaimed residue. Because "Do = geometric center of a bounded span" is a scale-invariant PPT rule, it applies recursively to this residue:

```
Do_parent(candidate) = √(E1 × E2)
```

This produces a **tethered, not accurate** candidate for the parent Do — built entirely from two independently-observable edges, valid as a structural default until the parent period accumulates enough direct data of its own to override it.

**Built-in confidence signal:** the width of the residue in octaves,

```
confidence_width = log2(E2 / E1)
```

is a natural precision indicator. A narrow residue suggests a well-tethered candidate; a wide residue should be read as low-confidence triangulation rather than a wrong number — the method degrades gracefully by exposing its own uncertainty instead of hiding it.

## Worked Instance: Temporal-Place Limen

A worked instance of this method applies to the [Temporal-Place Limen](temporal-place-limen.md) (TS Limen). Using click-train inter-click-interval discrimination study data (Weber fraction vs. ICI, 5–300 ms range), both edges are self-reported within a single study.

- **Macro-side edge (E2):** interval-based mechanism ceases to function ≈ 20 Hz → T ≈ 50 ms
- **Micro-side edge (E1):** spectrum-based (pitch) mechanism takes over ≈ 33 Hz → T ≈ 30 ms

```
Do_limen(candidate) = √(30 ms × 50 ms) ≈ 38.7 ms ≈ 25.8 Hz
confidence_width = log2(50/30) ≈ 0.74 octaves
```

This produces fairly narrow confidence width (~0.74 octaves) — indicating a reasonably tight tether.

### Candidate Values for Downstream Periods

The following values are currently considered provisional:

| Period | Do (provisional) | Basis |
|---|---|---|
| Micro Perception Period (pitch) | ≈ 1500 Hz (T ≈ 0.667 ms) | Flattest cents-JND zone, literature-typical |
| Macro Perception Period (rhythm) | ≈ 490 ms | Lowest Weber-fraction zone (300–800 ms), literature-typical |
| **TS Limen (meta Do)** | **≈ 38.7 ms (≈ 25.8 Hz)** | **Triangulated via Local Closure** |

The value ≈ 25.8 Hz (T ≈ 38.7 ms) is the provisional, triangulated, single-source candidate for the Temporal-Place Limen, derived rather than selected for decimal convenience.
