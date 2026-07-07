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
timestamp: 2026-07-07
revision: "2026-07-07 (rev 2): anchors are now stated as independently defined by 1200×log2(ratio), not as comma-sequence derivations; replaced the ±x/y 'Prime Lattice Coordinates' column with a monzo-style prime factorization, since comma paths cannot exactly reach non-dyadic ratios (see Prime Lattice, 'Prime lattice paths are rational; JI ratios are logarithmic'); replaced journey-style derivation language with compositional language; added explicit note on how comma-sequence paths relate to these anchors"
---
 
# Anchors and Prime Lattice Coordinates
 
## The Concept of a Local Anchor
 
In Prime Period Theory, a **period space** is a continuous bounded space mapped to a specific perceptual phenomenon (e.g., a pitch octave, a rhythmic bar). To navigate this space meaningfully using the prime lattice, we require reference points. These reference points are **local anchors**.
 
A local anchor serves as the **Base** for a local subperiod — the terminal, unlabelled origin of that subperiod's own fractal descent. An anchor's own coordinate needs no explicit digit: termination of a path at length zero *is* the Base declaration. (The same applies following a neighbour-frame edge re-basing; path length zero at the new anchor is simply its Base). From an anchor, the comma system navigates outward via fractal descent to locate any micro-position.
 
## Anchors are defined independently of comma-sequence paths
 
The twelve solfège anchors below are each defined directly by their own
ratio, at the position `cents = 1200 × log2(ratio)`. They are **not**
derived by walking a comma sequence outward from Do.
 
This is a deliberate correction from earlier drafts of this document, which
presented a `±x/y` comma-sequence column as though it were the mechanism
producing each anchor's position. It cannot be, for a structural reason
established in [Prime Lattice](prime-lattice.md#prime-lattice-paths-are-rational-ji-ratios-are-logarithmic):
a comma sequence of any finite length always resolves to a rational number,
while `log2(ratio)` is irrational for every ratio here except Do and Fi.
No finite comma sequence can land exactly on Ra, Re, Me, Mi, Fa, So, Le, La,
Te, or Ti — it can only approach them. Fi was already handled correctly in
every prior revision (defined directly as `√2:1`, no path claimed); the
change here is generalising that same treatment to the other eleven anchors,
rather than treating Fi as a special case.
 
Prime lattice paths still have an essential role relative to these anchors —
just not a defining one. A comma sequence starting from an anchor is a
**navigational refinement**: it moves away from that anchor's fixed position
by a further, rational amount, with whatever residual gap remains from a
true JI target expressed as a comma (see Prime Lattice, "Nearest approach
and rational approximation of simple ratios"). Diacritics render exactly
these refinements. The anchor itself, however, is fixed independently, by
the ratio in the table below.
 
## Reduction convention: symmetric around Do
 
Do's local period space is bounded on both sides by its neighbouring anchors, and Fi sits at its Boundary (Axis) — the shared edge between Do's space and its neighbour's, at exactly half the period. This forces every other anchor's coordinate to be resolved by **nearest-address reduction**, `(−600¢, +600¢]` around Do, not by ascending reduction across the full `[0, 1200¢)` octave. An anchor whose defining ratio's log2 position exceeds 600¢ has a shorter distance to Do going the other way around the period, and that shorter distance — and the reciprocal ratio that produces it — is its correct address.
 
Concretely, this means five of the twelve traditional ascending-solfège anchors — **So, Le, La, Te, Ti** — sit *below* Do in this coordinate system, not above it. **This is a real, intended consequence of treating Fi as a true boundary rather than a convenience marker at the top of an ascending scale: the conventional ascending octave (Do up to Ti) is, in ratio-space, actually anchored starting from So — the octave "begins" a fifth below Do and Do sits inside it, not at its root.** Traditional ascending pedagogical order is a *register convention* layered on top of this ratio structure; it is not the ratio structure itself. The ratios and cents values below describe position relative to Do; how that maps to a specific octave of absolute pitch is a separate, deliberate convention (illustrated for Do = C4 below), not a mathematical necessity.
 
## The 12 Anchors
 
Cents are computed directly as `1200 × log2(ratio)`, independent of any
comma-sequence path. The prime factorization column is a standard monzo-style
exponent vector over (2, 3, 5, 7) — a statement of which primes compose the
ratio, not a navigable sequence of steps. Order carries no meaning in this
column; `2⁴·3⁻¹·5⁻¹` is the same object regardless of how you'd choose to
write its factors.
 
| Solfège | Ratio (rel. to Do) | Prime Factorization | Cents | Register (Do = C4) | Composition |
|---------|--------------------|----------------------|-------|---------------------|-------------|
| **Do**  | 1:1   | — | 0.00 | C4 | The origin. |
| **Ra**  | 16:15 | 2⁴·3⁻¹·5⁻¹ | +111.73 | Db4 | 5-limit; the reciprocal of Ti. |
| **Re**  | 9:8   | 2⁻³·3² | +203.91 | D4 | 3-limit; two compounded pure fifths, octave-reduced. |
| **Me**  | 6:5   | 2¹·3¹·5⁻¹ | +315.64 | Eb4 | 5-limit; the reciprocal of La. |
| **Mi**  | 5:4   | 2⁻²·5¹ | +386.31 | E4 | 5-limit; a pure major third, the reciprocal of Le. |
| **Fa**  | 4:3   | 2²·3⁻¹ | +498.04 | F4 | 3-limit; a pure fifth's reciprocal, the reciprocal of So. |
| **Fi**  | √2:1  | 2^(1/2) | ±600.00 | F#4 *(by convention — see note)* | The unique irrational anchor by construction; Du's coarsest-frame edge, equidistant from Do in both directions. |
| **So**  | 3:4   | 2⁻²·3¹ | **−498.04** | **G3** | 3-limit; a pure fifth, reduced to nearest address — one octave *below* the traditional ascending position. The reciprocal of Fa. |
| **Le**  | 4:5   | 2²·5⁻¹ | **−386.31** | **Ab3** | 5-limit; the reciprocal of Mi. |
| **La**  | 5:6   | 2⁻¹·3⁻¹·5¹ | **−315.64** | **A3** | 5-limit; the reciprocal of Me. |
| **Te**  | 7:8   | 2⁻³·7¹ | **−231.17** | **Bb3** *(flat)* | 7-limit; the harmonic seventh, native to the Sep family. |
| **Ti**  | 15:16 | 2⁻⁴·3¹·5¹ | **−111.73** | **B3** | 5-limit; the reciprocal of Ra. |
 
### Characteristics of the Map
 
1. **Nearest-address symmetry, not ascending order.** Every non-Do anchor resolves to whichever direction gives the shorter path — this is what produces the So–Ti-below-Do result, and it is the direct consequence of taking Fi's role as Boundary literally rather than as a top-of-scale marker.
2. **Reciprocal pairing is a designed property of the ratio set, not a coincidence of any path arithmetic.** Once resolved to nearest address, four of the five re-mapped anchors are exact reciprocals of anchors already on the positive side: So (3/4) = 1/Fa (4/3); Le (4/5) = 1/Mi (5/4); La (5/6) = 1/Me (6/5); Ti (15/16) = 1/Ra (16/15). Their monzos mirror by negating every exponent — a direct consequence of one ratio being the multiplicative inverse of the other, nothing more. This did not have to happen — it is a consequence of the underlying 3-limit and 5-limit anchors already being chosen as inverse pairs around Do. Te (7-limit) has no such mirror in this 12-anchor set, which is expected: there is no second 7-limit anchor on the positive side to pair against.
3. **Fi's dual address is structural, not an oversight.** Fi sits at exactly ±600¢ — equidistant from Do in both directions, the one point in this table where nearest-address reduction does not force a unique answer. Fi is also the one anchor whose defining exponent (2^(1/2)) is itself irrational rather than a ratio of integers — every other anchor in this table is a genuine JI ratio (p/q, both integers), while Fi is defined directly as the geometric half-period point. This dual address logic is further leveraged in Transient Excursions; see [Prime Lattice Boundary Routing](../specifications/prime-lattice-boundary-routing.md). Convention resolves Fi's *register* to the positive spelling (F#4) rather than the negative one (F#3) — consistent with Axis conventionally being read as *this* anchor's own boundary — but the negative spelling is not wrong, merely unconventional.
4. **The 7-Limit Inclusion.** Te is native to the Sep family (7:4 raw, 7:8 as its nearest-address reduction), ensuring the foundational blue notes and harmonic sevenths have a direct, independently-defined position, rather than being reached only as an approximation of a 3- or 5-limit construction.
5. **What the factorization column is for.** It records which primes compose each anchor's ratio — useful for grouping anchors by limit (3-limit: Re, Fa, So; 5-limit: Ra, Me, Mi, Le, La, Ti; 7-limit: Te) and for seeing the reciprocal-pairing structure at a glance. It is not a set of instructions for reaching the anchor by comma sequence, and it carries no order — see "Anchors are defined independently of comma-sequence paths," above.
This table is the exact bridge between JI ratio space and the discrete 12-anchor writing system of Uniform Solfège. Prime lattice paths and their diacritic renderings are a separate, additional layer: refinements measured *outward from* these fixed anchors, not the mechanism that produces them. Absolute register (which octave a syllable sounds in for a given Do) is a separate convention layered on top of this ratio structure, illustrated above for Do = C4 but not fixed by the ratios themselves.
 
## See also
 
- [Prime Lattice](prime-lattice.md) — the comma-sequence path system that
  navigates and refines position relative to these anchors, and why it
  cannot exactly reproduce them
- [Prime Period Diacritics — Overview](../ppd/index.md) — the writing system
  rendering comma-sequence refinements from these anchors
- [Just Intonation](../tuning/just-intonation.md) — the tuning theory context
  for the ratios in this table
