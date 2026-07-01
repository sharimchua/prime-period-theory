---
type: reference
title: MIDI to Solfège Input Specification
description: >
  The canonical contract for translating a stream of MIDI events into a
  PPT Solfège Output object. Defines the output type, its enumerations,
  and the COMMIT signal. Instrument handling and transformation logic are
  explicitly out of scope — those belong to a mapping layer above this spec.
tags:
  - specifications
  - midi
  - uniform-solfege
  - input
  - prime-period-theory
timestamp: 2026-07-01
---

# MIDI to Solfège Input Specification

## Purpose and scope

This specification defines a single transformation contract: a stream of MIDI
events is consumed, and a **Solfège Output object** is emitted. The spec is
concerned only with what that output object looks like and what triggers its
emission. It is not concerned with which physical instrument produced the MIDI
stream, how chords or gestures are interpreted, how diacritics are encoded in
MIDI terms, or what the receiving application does with the output.

Those concerns belong to the **mapping layer** described in
[MIDI to Solfège Mapping](midi-solfege-mapping.md). The strict separation
between this spec and the mapping layer is intentional: the output type defined
here is stable and instrument-agnostic. Mappings are creative, instrument-
specific, and user-configurable. Multiple mappings can target this same spec.

## Output type

A single Solfège Output object has the following structure:

```
{
  solfege: Solfegesyllable,
  commas: Array<Comma>
}
```

Where:

```
SolfegeSyllable = "Do" | "Ra" | "Re" | "Me" | "Mi" | "Fa"
               | "Fi" | "So" | "Le" | "La" | "Te" | "Ti"

CommaPrime = "Du" | "Tri" | "Qui" | "Sep" | "Undec"

Comma = {
  prime: CommaPrime,
  step: integer
}
```

### SolfegeSyllable

The twelve syllables of Uniform Solfège, representing the twelve solfège syllables
of the chromatic period. They are an enumeration — a closed, ordered set of
labels. They do not encode absolute pitch, register, or octave. Those are
application-layer concerns.

The syllables in chromatic order:

| Syllable | Chromatic position |
|---|---|
| Do | 0 |
| Ra | 1 |
| Re | 2 |
| Me | 3 |
| Mi | 4 |
| Fa | 5 |
| Fi | 6 |
| So | 7 |
| Le | 8 |
| La | 9 |
| Te | 10 |
| Ti | 11 |

### CommaPrime

The five prime families recognised by PPT up to the 11-limit. They are an
enumeration. Du corresponds to prime 2, Tri to prime 3, Qui to prime 5,
Sep to prime 7, Undec to prime 11.

### Comma

A single comma entry specifies a prime family and a signed integer step count.
The step is a direction and magnitude in that prime family's subdivision space:

- A **positive step** compresses the subperiod — the equivalent of a sharper
  deviation in pitch terms, or a shorter duration in rhythmic terms.
- A **negative step** expands the subperiod — the equivalent of a flatter
  deviation in pitch terms, or a longer duration in rhythmic terms.

The step is an integer. The magnitude of one step is defined by the prime
family: one Tri step is one Pythagorean comma's worth of deviation, one Qui
step is one syntonic comma, one Sep step is one septimal comma, and so on.
Du steps subdivide the period by 2 at each level.

### The commas array

The commas array is an **ordered sequence**. Order is meaningful. Each entry
in the array represents one navigational step through the prime lattice, taken
in sequence from the solfège anchor. The position described by a commas array
is the result of applying each comma entry in order, not the sum of their
magnitudes.

Order significance is required because Du fractal navigation is inherently
path-dependent: each Du step specifies which half of the current subperiod to
enter, and the sequence of those decisions is what locates a position in the
subdivision tree. The same requirement is extended to all prime families for
consistency and to permit mixed-prime fractal navigation in future use.

An empty commas array is valid and common. It indicates the solfège syllable
at its unmodified 12TET anchor position.

## COMMIT

COMMIT is the signal that causes a Solfège Output object to be emitted. It
is always an explicit MIDI event — never implicit, never inferred from silence,
note release, or decay. What MIDI event constitutes COMMIT is determined by
the mapping layer, not by this spec.

This spec requires only that:

1. COMMIT is a designated, explicit MIDI event.
2. All MIDI events received since the previous COMMIT belong to the current
   **bundle** — the unit of input that resolves to one Solfège Output object.
3. COMMIT causes the current bundle to be evaluated and one output object
   to be emitted, then the bundle resets.
4. A COMMIT with an empty bundle is a no-op.

## Bundle

A bundle is the set of MIDI events accumulated between two COMMIT signals.
It has no minimum size beyond being non-empty at the time of COMMIT. A bundle
containing a single note-on event is valid. A bundle containing many note-on
events with pitch bend data and continuous controller messages is equally valid.

This spec does not define how a bundle is interpreted — that is the mapping
layer's responsibility. The spec only defines that the bundle is the unit of
evaluation and that its result is one Solfège Output object.

## What this spec does not define

The following are explicitly out of scope and belong to the mapping layer or
the receiving application:

- Which MIDI note numbers correspond to which SolfegeSyllables
- How chords (multiple simultaneous note-on events) are resolved to a single
  syllable
- How pitch bend data is resolved to Comma values
- How continuous controller data is interpreted
- What COMMIT looks like as a physical gesture on any instrument
- Register, octave, and coil-layer assignment
- Half-size glyph status
- Layer assignment (pitch layer, rhythmic layer, register layer)
- Temperament and tuning system application
- Enharmonic equivalence decisions

## Relationship to Prime Period Diacritics

The comma system defined in this spec is the abstract mathematical layer of
which Prime Period Diacritics (PPD) is the writing system rendering. PPD glyph
forms encode specific comma values as visual marks on a solfège character. The
output object here carries the same information in a form that is readable by
software rather than by eye.

See [Prime Period Diacritics — Overview](../ppd/index.md) and
[Prime Lattice](../foundations/prime-lattice.md) for the mathematical
relationship between comma values and their written representations.

## See also

- [MIDI to Solfège Mapping](midi-solfege-mapping.md) — reference mapping
  implementations; instrument-specific conventions; chord and bend resolution
- [Prime Lattice](../foundations/prime-lattice.md) — the mathematical space
  the comma array navigates
- [Prime Period Diacritics — Overview](../ppd/index.md) — the writing system
  rendering of comma values
- [Notation Input](../applications/notation-input.md) — how this spec is used
  as an input mechanism for PPT tools and components
- [Uniform Solfège — Overview](../uniform-solfege/index.md) — the notation
  system the SolfegeSyllable enumeration belongs to