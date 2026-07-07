---
type: concept
title: Anchors and Prime Lattice Coordinates
description: >
  Defines the concept of local anchors within a period space and establishes
  the specific prime lattice coordinate derivations for the 12 solfège positions
  within the Du period space (the octave) up to the 11-limit. Positions are
  resolved by nearest-address (symmetric) reduction around Do, consistent with
  Fi as the Boundary of Do's local period space.
tags:
  - foundations
  - prime-period-theory
  - just-intonation
  - prime-families
  - uniform-solfege
  - coordinates
timestamp: 2026-07-07
revision: corrected symmetric reduction around Do; Base/Boundary notation aligned to Boundary Family grammar; collapsed Boundary/Axis into Du
---

# Anchors and Prime Lattice Coordinates

## The Concept of a Local Anchor

In Prime Period Theory, a **period space** is a continuous bounded space mapped to a specific perceptual phenomenon (e.g., a pitch octave, a rhythmic bar). To navigate this space meaningfully using the prime lattice, we require reference points. These reference points are **local anchors**.

A local anchor serves as the **Base** for a local subperiod — the terminal, unlabelled origin of that subperiod's own fractal descent. An anchor's own coordinate needs no explicit digit: termination of a path at length zero *is* the Base declaration. (The same applies following a neighbour-frame edge re-basing; path length zero at the new anchor is simply its Base). From an anchor, the comma system navigates outward via fractal descent to locate any micro-position.

## Reduction convention: symmetric around Do

Do's local period space is bounded on both sides by its neighbouring anchors, and Fi sits at its Boundary (Axis) — the shared edge between Do's space and its neighbour's, at exactly half the period. This forces every other anchor's coordinate to be resolved by **nearest-address reduction**, `(−600¢, +600¢]` around Do, not by ascending reduction across the full `[0, 1200¢)` octave. An anchor whose raw prime-lattice path exceeds 600¢ has a shorter path to Do going the other way around the period, and that shorter path is its correct address.

Concretely, this means five of the twelve traditional ascending-solfège anchors — **So, Le, La, Te, Ti** — sit *below* Do in this coordinate system, not above it. **This is a real, intended consequence of treating Fi as a true boundary rather than a convenience marker at the top of an ascending scale: the conventional ascending octave (Do up to Ti) is, in ratio-space, actually anchored starting from So — the octave "begins" a fifth below Do and Do sits inside it, not at its root.** Traditional ascending pedagogical order is a *register convention* layered on top of this ratio structure; it is not the ratio structure itself. The prime lattice coordinates below describe position relative to Do; how that maps to a specific octave of absolute pitch is a separate, deliberate convention (illustrated for Do = C4 below), not a mathematical necessity.

## Prime Lattice Coordinates of the 12 Anchors

The prime lattice coordinates for an anchor describe the exact path taken from the origin (Do) to reach that position, using nearest-address reduction. The notation uses the native comma format `±x/y`, where `x` is the step magnitude and `y` is the prime family. Because this is a Du period space, any movement along an odd-prime axis requires a counterbalancing movement along the Du axis to bring the result to its nearest address relative to Do — not merely within `[0, 1200¢)`, but within `(−600¢, +600¢]`.

| Solfège | Traditional Ratio | Prime Lattice Coordinates (`±x/y`) | Cents | Register (Do = C4) | Derivation Path |
|---------|-------------------|-------------------------------------|-------|---------------------|-----------------|
| **Do**  | 1:1   | `0` | 0.00 | C4 | The origin. |
| **Ra**  | 16:15 | `+1/Tri, −1/Qui` | +111.73 | Db4 | Descending a major third and a perfect fifth from the Du ceiling. |
| **Re**  | 9:8   | `+1/Tri, +1/Tri` | +203.91 | D4 | Ascending two perfect fifths (Tri). |
| **Me**  | 6:5   | `+1/Du` | +315.64 | Eb4 | The pure 5-limit minor third. |
| **Mi**  | 5:4   | `+1/Qui` | +386.31 | E4 | Ascending one pure major third (Qui). |
| **Fa**  | 4:3   | `+1/Tri` | +498.04 | F4 | Descending one perfect fifth from the Du ceiling. |
| **Fi**  | √2:1  | `+1/2` | ±600.00 | F#4 *(by convention — see note)* | Du's coarsest-frame edge — the shared upper boundary of Do's local period space. |
| **So**  | 3/4   | `−1/Tri` | **−498.04** | **G3** | Ascending one perfect fifth (Tri), reduced to nearest address — one octave *below* the traditional ascending position. |
| **Le**  | 4/5   | `−1/Qui` | **−386.31** | **Ab3** | Descending one major third, reduced to nearest address. |
| **La**  | 5/6   | `−1/Du` | **−315.64** | **A3** | Ascending a major third and descending a fifth, reduced to nearest address. |
| **Te**  | 7/8   | `−1/Sep` | **−231.17** | **Bb3** *(flat)* | The 7-limit harmonic seventh, reduced to nearest address. |
| **Ti**  | 15/16 | `−1/Tri, +1/Qui` | **−111.73** | **B3** | Ascending a major third and a perfect fifth, reduced to nearest address. |

### Characteristics of the Map

1. **Nearest-address symmetry, not ascending order.** Every non-Do anchor resolves to whichever direction gives the shorter path — this is what produces the So–Ti-below-Do result, and it is the direct consequence of taking Fi's role as Boundary literally rather than as a top-of-scale marker.

2. **Reciprocal pairing falls out of the correction, unforced.** Once resolved to nearest address, four of the five re-mapped anchors are exact reciprocals of anchors already on the positive side: So (3/4) = 1/Fa (4/3); Le (4/5) = 1/Mi (5/4); La (5/6) = 1/Me (6/5); Ti (15/16) = 1/Ra (16/15). Their prime-lattice paths mirror by negating every exponent. This did not have to happen — it is a consequence of the underlying 3-limit and 5-limit anchors already being placed as inverse pairs around Do, now made visible by consistent reduction. Te (7-limit) has no such mirror in this 12-anchor set, which is expected: there is no second 7-limit anchor on the positive side to pair against.

3. **Fi's dual address is structural, not an oversight.** Fi sits at exactly ±600¢ — equidistant from Do in both directions, the one point in this table where nearest-address reduction does not force a unique answer. This is the same ambiguity that appears generally at any Axis: a boundary point admits two equally valid framings (this anchor's supremum, or the next anchor's infimum), the way `+1/2` (read from the current anchor's frame) and the same physical point read as the neighbour's own `+1/2` name the same address from two different anchors' frames. Convention resolves Fi to the positive spelling (F#4) rather than the negative one (F#3) — consistent with Axis conventionally being read as *this* anchor's own boundary — but the negative spelling is not wrong, merely unconventional. This dual address logic is further leveraged in Transient Excursions; see [Prime Lattice Boundary Routing](../specifications/prime-lattice-boundary-routing.md).

4. **The 7-Limit Inclusion.** Te is defined natively via the Sep family (7:4 raw, 7/8 reduced), ensuring the foundational blue notes and harmonic sevenths have a direct, single-step lattice path independent of the reduction convention.

This coordinate map is the exact mathematical bridge between the continuous prime lattice and the discrete 12-anchor writing system of Uniform Solfège. Every diacritic applied to these syllables is simply a further fractal descent added to the anchor's base coordinates. Absolute register (which octave a syllable sounds in for a given Do) is a separate convention layered on top of this ratio structure, illustrated above for Do = C4 but not fixed by the lattice itself.
