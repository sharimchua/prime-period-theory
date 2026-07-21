---
type: concept
title: Anchors and Prime Lattice Coordinates
description: >
  Defines the concept of local anchors within a period space and establishes
  the 12 solfège positions within the Du period space (the octave) up to the
  11-limit, defined independently by log2(ratio) rather than by comma-sequence
  path. Positions are resolved by nearest-address (symmetric) reduction
  around Do, consistent with Fi as the Boundary of Do's local period space.
tags:
  - foundations
  - prime-period-theory
  - just-intonation
  - prime-families
  - uniform-solfege
  - coordinates
status: stable
timestamp: 2026-07-11
revision: "2026-07-10 (rev 3): scoped the 'no finite comma sequence can
  land exactly on a non-Do/Fi anchor' claim to Base-mode sequences
  specifically; noted that the existing Prime Factorization column is
  already each anchor's exact Reel-mode address, per the Base/Reel
  distinction introduced in Prime Lattice.
  2026-07-11 (rev 4): added 'Solfège frames and the diacritic
  space,' verifying that dividing N=27,720 into the 12 Solfège
  frames yields exactly 2,310 = the radical of 27,720."
used_by:
  - foundations/prime-lattice.md
  - foundations/period.md
  - ppd/index.md
  - tuning/just-intonation.md
---
 
# Anchors and Prime Lattice Coordinates
 
## The Concept of a Local Anchor
 
In Prime Period Theory, a **period space** is a continuous bounded space mapped to a specific perceptual phenomenon (e.g., a pitch octave, a rhythmic bar). To navigate this space meaningfully using the prime lattice, we require reference points. These reference points are **local anchors**.
 
A local anchor serves as the **Base** for a local subperiod — the terminal, unlabelled origin of that subperiod's own fractal descent. An anchor's own coordinate needs no explicit digit: termination of a path at length zero *is* the Base declaration. (The same applies following a neighbour-frame edge re-basing; path length zero at the new anchor is simply its Base). From an anchor, the comma system navigates outward via fractal descent to locate any micro-position.
 
## Anchors as a 12-Interval Even Grid (Base-Mode)
 
The twelve solfège anchors below are defined as exactly evenly-spaced divisions of the period. This provides a versatile, domain-agnostic grid: in pitch, it precisely yields 12TET (100 cent increments); in rhythm, it creates a pure 1/12th snapping grid. 

Because they divide the period into equal rational fractions, these anchors are navigated entirely in **Base-mode**. Each position can be reached exactly using a Prime Lattice Path of fractal descent. For example, dividing the space into 1/12ths requires splitting by 2, then by 3, and then taking a step by 2 again (e.g. `[0/2, 0/3, +1/2]` for Ra). 

This represents a conceptual shift: the anchors are the even scaffolding of the space itself. Commas and diacritics are then used to measure *outward* from these fixed grid lines to locate exact microtonal or Just Intonation (JI) positions.
 
## Reduction convention: symmetric around Do
 
Do's local period space is bounded on both sides by its neighbouring anchors, and Fi sits at its Boundary (Axis) — the shared edge between Do's space and its neighbour's, at exactly half the period. This forces every other anchor's coordinate to be resolved by **nearest-address reduction**, `(−600¢, +600¢]` around Do, not by ascending reduction across the full `[0, 1200¢)` octave. An anchor whose position exceeds 600¢ has a shorter distance to Do going the other way around the period, and that shorter distance is its correct address.
 
Concretely, this means five of the twelve traditional ascending-solfège anchors — **So, Le, La, Te, Ti** — sit *below* Do in this coordinate system, not above it. **This is a real, intended consequence of treating Fi as a true boundary rather than a convenience marker at the top of an ascending scale: the conventional ascending octave (Do up to Ti) is actually anchored starting from So — the octave "begins" a fifth below Do and Do sits inside it, not at its root.** Traditional ascending pedagogical order is a *register convention* layered on top of this structure; it is not the structure itself. The values below describe position relative to Do; how that maps to a specific octave of absolute pitch is a separate, deliberate convention (illustrated for Do = C4 below), not a mathematical necessity.
 
## The 12 Anchors
 
The table below specifies each anchor as an exact Base-mode path. Cents are precisely 12TET (100¢ increments). 
 
| Solfège | Period Fraction | Prime Lattice Path (Base) | Cents (12TET) | Register (Do = C4) | Composition |
|---------|-----------------|---------------------------|---------------|---------------------|-------------|
| **Do**  | 0/12 | `[0/2]` | 0 | C4 | The origin. |
| **Ra**  | 1/12 | `[0/2, 0/3, +1/2]` | +100 | Db4 | 1/12th of the period. |
| **Re**  | 2/12 | `[0/2, +1/3]` | +200 | D4 | 1/6th of the period; one whole step. |
| **Me**  | 3/12 | `[0/2, +1/2]` | +300 | Eb4 | 1/4th of the period. |
| **Mi**  | 4/12 | `[+1/2, -1/3]` | +400 | E4 | 1/3rd of the period. |
| **Fa**  | 5/12 | `[+1/2, 0/3, -1/2]` | +500 | F4 | 5/12ths of the period. |
| **Fi**  | 6/12 | `[+1/2]` | ±600 | F#4 *(by convention — see note)* | The geometric half-period boundary. |
| **So**  | −5/12 | `[-1/2, 0/3, +1/2]` | −500 | **G3** | Nearest-address reduction; perfectly mirrors Fa. |
| **Le**  | −4/12 | `[-1/2, +1/3]` | −400 | **Ab3** | Perfectly mirrors Mi. |
| **La**  | −3/12 | `[0/2, -1/2]` | −300 | **A3** | Perfectly mirrors Me. |
| **Te**  | −2/12 | `[0/2, -1/3]` | −200 | **Bb3** | Perfectly mirrors Re. |
| **Ti**  | −1/12 | `[0/2, 0/3, -1/2]` | −100 | **B3** | Perfectly mirrors Ra. |
 
### Characteristics of the Map
 
1. **Nearest-address symmetry, not ascending order.** Every non-Do anchor resolves to whichever direction gives the shorter path — this is what produces the So–Ti-below-Do result, and it is the direct consequence of taking Fi's role as Boundary literally rather than as a top-of-scale marker.
2. **Perfect Mirroring.** Because the grid is evenly spaced, the Base-mode paths on the negative side are exact inversions of the positive side. `So` is the direct negative reflection of `Fa`, `La` reflects `Me`, and so on.
3. **Fi's dual address is structural, not an oversight.** Fi sits at exactly ±600¢ — equidistant from Do in both directions, the one point in this table where nearest-address reduction does not force a unique answer. Convention resolves Fi's *register* to the positive spelling (F#4) rather than the negative one (F#3) — consistent with Axis conventionally being read as *this* anchor's own boundary — but the negative spelling `[-1/2]` is not wrong, merely unconventional.
4. **Base-mode Navigation.** The Prime Lattice Path shown is the actual, exact location of each anchor. There is no residual comma and no approximation here — this is a mathematically perfect subdivision of the period space.

### Solfège frames and the diacritic space

Dividing the canonical resolution constant `N = 27,720` (see
[Prime Lattice](prime-lattice.md#the-canonical-resolution-constant))
into twelve equal Solfège frames — the evenly spaced divisions of the
octave described above — gives exactly:

`27,720 / 12 = 2,310 = 2 × 3 × 5 × 7 × 11`

This is a direct consequence of `27,720`'s factorization, not a
coincidence requiring separate justification. `2,310` is the
**radical** of `27,720` — the product of its distinct prime factors,
each to the first power — because `27,720 = 2³ × 3² × 5 × 7 × 11` needs
exactly one extra factor of 2 (beyond the first power, to cover
divisibility by 8) and one extra factor of 3 (beyond the first power,
to cover divisibility by 9). That excess is `2² × 3 = 12` exactly, and
dividing by it strips the excess and leaves the radical.

The consequence for the Prime Diacritics system: each of the twelve
Solfège frames has a **local** resolution of exactly 2,310 points,
precisely enough to give an exact Base-mode address to any squarefree
(first-power-only) 11-limit adjustment entirely within that one frame —
a diacritic combining `±1` steps of 2, 3, 5, 7, and 11 — without needing
to borrow resolution from a neighbouring frame. This gives Prime
Diacritics a clean, principled local budget rather than an arbitrary
fixed precision.

This does **not** extend to every comma of interest. Adjustments
requiring a prime to a *second* power or higher — the syntonic comma
(`81/80 = 3⁴/(5·2⁴)`), the Pythagorean comma (`3¹²/2¹⁹`) — need more
depth in a single prime than the local 2,310-point budget carries, and
correspondingly draw on the "excess" 12-fold structure that separates
`27,720` from its radical — i.e., they reach outside a single Solfège
frame. This is the same distinction already drawn in
[Prime Lattice](prime-lattice.md#where-real-commas-belong-once-reel-mode-is-available):
squarefree, single-frame adjustments are what the local diacritic space
is for; the classic higher-power commas are a cross-frame phenomenon,
consistent with their being a cross-route (not single-target) fact
about the lattice.

## Pure Ratios and Cast()

While this 12-interval Base-mode grid serves as the foundational scaffolding for Prime Period Theory, certain applications may specifically require representing the anchors as exact, pure Just Intonation (JI) ratios (e.g. 4:3, 3:4, 5:4).

When an exact JI ratio is required as an anchor, the position is no longer a rational fraction of the period (Base-mode), but rather a logarithmic one (Reel-mode). In this case, one can define the anchor by wrapping a Prime Lattice step in the `Cast()` function (which translates a Reel-mode position back into linear space for a multiplicative operation). 

For example, a true JI **Fa** (4:3) can be reached exactly via `Cast(+1/3)`, and its reciprocal **So** (3:4) via `Cast(-1/3)`. 

However, for general Prime Period Theory applications, the even 12TET Base-mode scaffold provides a universally compatible grid from which all exact comma refinements can subsequently be measured.

This table is the exact bridge between the continuous period space and the discrete 12-anchor writing system of Uniform Solfège. Prime lattice paths and their diacritic renderings are a separate, additional layer: refinements measured *outward from* these fixed anchors. Absolute register (which octave a syllable sounds in for a given Do) is a separate convention layered on top of this structure, illustrated above for Do = C4 but not fixed by the coordinates themselves.
 
## See also
 
- [Period](period.md) — the general model this page's local-anchor
  concept is a pitch-domain instance of
- [Prime Lattice](prime-lattice.md) — the comma-sequence path system that
  navigates and refines position relative to these anchors, and why it
  cannot exactly reproduce them
- [Prime Period Diacritics — Overview](../ppd/index.md) — the writing system
  rendering comma-sequence refinements from these anchors
- [Just Intonation](../tuning/just-intonation.md) — the tuning theory context
  for the ratios in this table
