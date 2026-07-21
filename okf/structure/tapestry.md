---
type: concept
title: "Musical Tapestry: Compositional Structure Layer"
description: >
  The compositional graph layer of PPT that sits on top of Three-Layer Coil
  Notation. Defines Coils (extended with composition and inheritance), Weaves
  (sequencing containers with layout modes), Threads (typed connectors carrying
  relative pitch and time offsets), and Knots (absolute pitch and tempo anchors),
  forming a directed graph for assembling phrases, sections, and full compositions.
tags:
  - composition
  - structure
  - coil
  - weave
  - thread
  - knot
  - notation
  - musicoil
related:
  - structure/coil-notation.md
  - structure/musicoil.md
  - structure/rhythmic-grammar.md
  - structure/melodic-grammar.md
  - foundations/anchors.md
status: stable
timestamp: 2026-07-08
used_by:
  - structure/coil-notation.md
  - uniform-solfege/index.md
  - structure/rhythmic-grammar.md
  - foundations/anchors.md
  - structure/musicoil.md
  - structure/melodic-grammar.md
---

# Musical Tapestry: Compositional Structure Layer

The **Tapestry** is PPT's compositional structure layer — the graph that sits above [Three-Layer Coil Notation](coil-notation.md) and organises individual musical ideas into larger forms. Where a Coil captures an atomic musical thought (a melody, a harmonic progression, a rhythmic pattern), the Tapestry provides the vocabulary for assembling those thoughts into phrases, sections, and full compositions.

This page describes the structural and resolution semantics of the Tapestry. It does not prescribe a single correct way to compose — it offers a formal vocabulary for describing how musical ideas relate to one another, how they inherit and override content, and how relative offsets resolve to absolute values. Like the rest of PPT, the Tapestry is a lens for making compositional structure legible, not a constraint on creative freedom.

Notation and graphical/UI representation are intentionally treated as implementation-layer concerns, out of scope for this page. How a given Tapestry is rendered, notated, or displayed is left open for separate discussion.

## Overview

A **Tapestry** is a collection of **Coils** (extended with composition and inheritance), **Weaves** (sequencing containers), and **Knots** (absolute pitch/tempo anchors), connected by **Threads** (typed connectors carrying relative offsets). Together these form a directed graph — which may be cyclic — constituting the compositional layer of PPT.

Two core principles govern the design:

**Deterministic resolution.** Every node resolves deterministically given full knowledge of its own dependency graph — everything it requires as input to resolve. A node needs no knowledge of its consumers (nodes that reference it downstream) or of any node outside its dependency graph. This is what allows an arbitrary subtree — a single motif, a phrase, a whole section — to be played or reasoned about in isolation, provided its own dependencies are present.

**Relative primacy.** The graph has no privileged absolute root. Any node can be designated the current **primary node**, and traversal, resolution, and playback occur relative to that vantage point. This mirrors the relative-over-absolute stance already present in PPT's pitch and rhythm theory.

## Coil Refinements

A Coil retains its three layers — Melody, Harmony, Rhythm — each independently specifiable. See [Three-Layer Coil Notation](coil-notation.md) for the base Coil definition.

### Single-layer defaults

- **Melody alone**: assumed even beat subdivision.
- **Harmony alone**: chord changes split evenly across the period, based on chord count.
- **Rhythm alone**: played as even beats, pitch taken from [Uniform Solfège](../uniform-solfege/index.md).

### Cross-layer alignment (within one Coil)

- **Melody + Harmony**: total beat count follows whichever layer has more detail (typically Melody). The sparser layer (typically Harmony) is split evenly across the denser layer's beats — e.g. 8-syllable Melody vs 4-chord Harmony → 2 melodic syllables per chord.
- **Melody/Harmony + Rhythm**: same subdivision logic, extended so Dot/Dash indenting grammar aligns melodic/harmonic content to rhythmic attack points.
- **Default resolution mode**: **stretch** — the sparser or shorter layer is proportionally stretched to fill the space. This is the same behaviour that applies to single-Coil mismatches generally, and is inherited as the default for Thread resolution elsewhere in the Tapestry (see § Threads and Thread Attributes).

### Dot/Dash Grammar — Independence from Rhythm

Melody and Harmony may each define their own Dot/Dash timing grammar independently of the Rhythm layer, particularly relevant under Coil inheritance where a Melody or Harmony is authored without a Rhythm present at all. See [Rhythmic Grammar](rhythmic-grammar.md) for the full grammar specification.

- **Dot**: fixed length of exactly one beat.
- **Dash**: variable length, 0–n beats, extending the preceding token to the next strong beat in the Rhythm layer. If no rhythm layer is specified then this is considered 0 length.
- **Double-dash** (`==`): a "fill to end of Coil" operator — extends to consume all remaining space to the end of the Coil's period. Functionally a left-align of the preceding content (content is placed at the start, the double-dash absorbs the remainder).
  - Placed at the **start** of a phrase instead, a double-dash has the effect of a right-align — remaining space is absorbed before the content, pushing it to the end of the Coil.

> *Note: this grammar is a Coil-notation-level detail rather than strictly a Tapestry-level concern, and may be more properly homed in the [Three-Layer Coil Notation](coil-notation.md) document. Captured here since it surfaced in the context of inheritance.*

### Coil Composition and Inheritance

A Coil may inherit from an ordered list of one or more parent Coils, and may also explicitly define any of its own layers directly. Layer resolution, per layer, follows a single unified rule:

1. **Explicit local definition wins outright.** If the Coil itself explicitly defines a layer, that definition is used regardless of any parents.
2. **Otherwise, resolve by declaration priority across the ordered parent list.** The first parent (in list order) that defines the layer claims it; subsequent parents only fill layers left unclaimed by earlier parents.

This single rule covers both patterns: a single-parent "child overrides parent" case (child's own explicit definition wins per rule 1) and a multi-parent "priority-fill" case (ordered list of parents, first-to-define wins per rule 2) — they are the same mechanism at different list lengths, not two separate rules.

Typical use: an ordered parent list where the first Coil defines Rhythm only; a child inherits it while explicitly defining Harmony (Harmony resolves from the child, Rhythm passes through from the parent); further sibling children each explicitly define a different Melody, auditioning multiple motifs against the same shared Rhythm/Harmony base.

**This composition/inheritance mechanism belongs to Coils only. Weaves have no equivalent mechanism** — see § Weaves below.

## Weaves

A **Weave** is an ordered list of node references (Coil or Weave). Weaves are the sequencing and graph-structure primitive of the Tapestry.

### Structure

- **Input**: ordered list of nodes (Coils and/or Weaves).
- **Output**: the concatenated resolved M/H/R stream of its children, in order, subject to its layout attribute.
- **No inheritance**: Weaves have no inheritance and no priority-fill mechanism of their own. Each composed child node's already-resolved layers pass through into the Weave's output unchanged — a Weave does not reassign or reclaim layers between its children. The only fallback mechanism a Weave provides is Default-Coil injection (see below).

### Weave Layout

A Weave has a single **layout** attribute governing how its children's timing relates to one another. Layout is singular per Weave (no mixing within one container) — a region needing mixed treatment is expressed as nested Weaves instead, preserving independent reasoning at every scope.

| Mode | Behaviour | Flexbox analogy |
|---|---|---|
| **Concatenate** (default) | No resampling; each child keeps its native duration; outputs are summed in sequence. | — |
| **Equal period** | Every child is stretched/compressed to occupy an identical total duration, regardless of native beat count. | `flex: 1 1 0` |
| **Equal beat** | Beat duration is held fixed across children; a child with more beats simply occupies proportionally more time, preserving tempo/feel across the sequence. | Fixed flex-basis |
| **Per-child weight** | Optional, applies within equal-period mode; allows one child to occupy a larger share of the equalised space than its neighbours. | `flex-grow` |

Layout is a property of the **container**, not the content — the same Coil/Weave sequence can be reused under different layouts in different parent Weaves (e.g. a rubato intro reusing the same three motifs as a strict equal-beat verse elsewhere). Identity and timing-in-context are distinct.

### Default-Coil Injection (Dependency Injection)

A Weave may declare a **default coil** supplying fallback content for any Melody/Harmony/Rhythm layer left unfilled by its composed children.

- Injection is a property **on the Weave**, applied to the compositional elements within its scope — not smuggled into a child Coil's own definition.
- A Coil or Weave viewed/played standalone (outside the Weave that would have injected into it) resolves purely against its own declared scope; no injection occurred in that context, and no external default applies.
- **Nested Weaves — nearest-scope wins.** If a Weave is nested inside another Weave that also declares a default coil, an unfilled layer is resolved from the *closest enclosing* Weave's default coil first. Only if that Weave has no default coil (or does not cover the layer) does resolution continue outward to the next enclosing Weave's default, and so on.
- Resolution is **resolve-once, feed-forward**: DI resolves in a single pass down the specific dependency chain established from the current primary node, rather than each level independently re-querying ancestors. Unresolved layers pick up whatever default was fed forward at the point they entered scope.
- For cyclic/self-referential Weaves: DI resolves once for the traversal (no per-iteration variation in the base spec). Iteration-dependent injection (e.g. a different melody per loop pass) is a deferred extension, to be handled via edge attributes if/when needed, not by DI itself.

### Knots (Absolute Anchors)

A **Knot** is an optional metadata property a Weave (or the Tapestry itself) may carry, establishing an absolute reference point: Do's absolute pitch and the absolute tempo, against which all upstream relative offsets (pitch-modification and time-modification, carried by Threads) are ultimately realised. See [Anchors](../foundations/anchors.md) for the broader anchor framework in PPT.

- Threads carry only *relative* offsets — a pitch-modification shifts where Do is anchored relative to whatever it was already anchored to; a time-modification scales duration relative to whatever the prevailing tempo already was. Neither is meaningful in absolute terms on its own.
- As content flows downstream through a chain of Threads, their relative offsets **compose** (stack) rather than resolve individually.
- Composed offsets are only realised as actual absolute pitch/tempo values when traversal reaches a node whose scope resolves to a Knot.
- **Nested Weaves — nearest-scope wins**, following the same resolution pattern as Default-Coil injection above: if a Weave has no Knot of its own, resolution walks outward to the nearest enclosing Weave's Knot. A Tapestry-level Knot serves as the ultimate fallback, ensuring every node resolves to *some* absolute anchor.

## Threads and Thread Attributes

A **Thread** is the connector between nodes — a Coil composition/inheritance connection, or a Weave input connection — carrying output from one node into input on another. A Thread is a typed relationship carrying attributes, not a bare reference:

- **source**, **target** — the two nodes the Thread connects.
- **resolution-mode** — governs how mismatched syllable/beat counts between connected layers are reconciled:

| Resolution mode | Behaviour |
|---|---|
| `stretch` (default) | The shorter/sparser layer is proportionally stretched to fill the space of the longer/denser layer. |
| `tile` | The shorter layer is repeated (tiled) to fill the longer layer's space. |
| `custom-map` | A user-defined mapping between source and target positions (formal grammar deferred — see Open Items). |

The same shared vocabulary applies whether the Thread connects a Coil composition or a Weave input, though the two may carry the attribute independently.

- **time-modification** — an explicit, deliberate temporal scaling applied as content crosses the Thread, expressed as a lattice-path ratio consistent with existing `n/p` path notation (e.g. `-1/2` for half-time — adding space/beats relative to the source). Distinct from resolution-mode: resolution-mode implicitly reconciles a *mismatch* between connected layers, while time-modification is a deliberate scaling the composer applies regardless of whether a mismatch exists.

  **Order of operations is fixed: modify, then reconcile.** Time-modification is applied first; resolution-mode then reconciles whatever mismatch remains against the already-modified content. This keeps resolution strictly forward-flowing — a downstream Weave never needs to reach back and re-derive an upstream Thread's behaviour.

- **pitch-modification** — a relative offset to where Do is anchored for the Melody/Harmony layers of content crossing the Thread, expressed via [Uniform Solfège](../uniform-solfege/index.md) / diacritic naming (e.g. `Ra` for a semitone shift) rather than raw interval arithmetic, consistent with PPT's broader commitment to notation grounded in path logic. This is **not** a per-note absolute shift — it moves the anchor point itself, relative to wherever it was already anchored upstream.

  As content flows through successive Threads, these offsets compose (stack) rather than resolve individually; the offset only becomes an actual absolute pitch once traversal reaches a node whose scope resolves to a Knot. This allows a single Coil's melodic/harmonic content to be reused across multiple Threads at different relative pitch centres — e.g. modulating the same motif into a new key context — without authoring a duplicate Coil. This mirrors the existing principle that identity and in-context behaviour are separate (as with Weave layout): the same Coil, threaded differently, behaves differently.

- **repeat-condition** (for cyclic Threads) — the condition under which a cycle breaks. Typically performer-discretion at this stage; open for future formalisation.

Reserved for future extension: iteration-indexed overrides, per-pass content variation, further modification types (e.g. dynamics/articulation) if the need arises.

## Cycles

Weaves may be cyclic, including self-cyclic, gated by a repeat-condition on the Thread. The break condition is typically left to performer discretion rather than a fixed count. How a cycle is represented — in notation, on a graph, or in a player UI — is an implementation-layer decision, out of scope here; the structural requirement is only that a cyclic Thread carries a repeat-condition attribute.

## Typical Workflow

1. Author independent Coils covering Melody, Harmony, and/or Rhythm ideas — starting point is arbitrary; no layer is privileged as an entry point.
2. Use Coil composition/inheritance to build layered variations (e.g. one Rhythm/Harmony base, multiple melodic motif children).
3. Assemble Coils/motifs into Weaves (e.g. phrases → verses/choruses → sections), choosing layout mode per Weave scope.
4. Compose Weaves into higher-level Weaves up to one or more top-level compositions ("final weaves"), each representing a full version of the piece.
5. Any node at any depth — a single motif, a phrase, a section, the whole piece — remains independently playable/viewable via its own dependency subgraph, enabling isolated review, comparison, and reuse without duplicating dependent material.

## Open Items

> The following items are draft concerns under active development. They represent areas where the Tapestry specification is intentionally incomplete, awaiting further design work or implementation experience before being formalised.

- Formalise repeat-condition vocabulary (beyond "performer discretion") for both notation and playback engines.
- Determine where Dot/Dash/double-dash grammar should formally live — likely the [Three-Layer Coil Notation](coil-notation.md) document rather than Tapestry.
- Extension spec for iteration-indexed Thread overrides, if per-pass variation in cyclic Weaves becomes necessary.
- Formal grammar for `custom-map` resolution-mode (currently placeholder alongside stretch/tile).
- Formal grammar for time-modification ratio notation (confirming alignment with existing `n/p` lattice path notation) and pitch-modification naming (confirming which solfège/diacritic terms are valid modifiers and how compound/multi-step shifts are expressed).
- Confirm whether a Knot anchors pitch and tempo together as a single unit, or whether a Weave could anchor one without the other (e.g. fixing tempo at a section boundary while pitch continues to resolve from a more distant Knot).
- Confirm behaviour if no Knot exists anywhere in the traversed graph up to and including the Tapestry level (undefined/error vs. an implicit universal default, e.g. Do = middle C, tempo = 120).
- Terminology settled: Tapestry (collection of Coils, Weaves, and Knots), Coil (atomic idea), Weave (sequencing container), Thread (relative connector between nodes, reused from [MusiCoil](musicoil.md)), Knot (absolute pitch/tempo anchor).

## See also

- [Three-Layer Coil Notation](coil-notation.md) — the base Coil definition and paper-writable surface syntax
- [MusiCoil](musicoil.md) — spatial notation system; visual representation of PPT
- [Rhythmic Grammar](rhythmic-grammar.md) — formal encoding system for rhythmic grouping structure
- [Melodic Grammar](melodic-grammar.md) — the melodic layer convention for Three-Layer Coil Notation
- [Anchors](../foundations/anchors.md) — the broader anchor framework in PPT
- [Uniform Solfège](../uniform-solfege/index.md) — the base-12 notation layer of PPT
