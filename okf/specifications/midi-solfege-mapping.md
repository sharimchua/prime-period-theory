---
type: reference
title: MIDI to Solfège Mapping
description: >
  Reference mapping implementations for the MIDI to Solfège Input Spec.
  Covers keyboard chord conventions, MIDI guitar interpretation, bundle
  construction, COMMIT signal design, and the principles for building
  custom mappings. Non-normative but canonical reference.
tags:
  - specifications
  - midi
  - mapping
  - uniform-solfege
  - input
  - prime-period-theory
timestamp: 2026-07-01
---

# MIDI to Solfège Mapping

## Purpose and relationship to the input spec

The [MIDI to Solfège Input Specification](midi-solfege-input.md) defines
what a Solfège Output object looks like and what triggers its emission. It
does not define how to get there. This document defines the mapping layer:
the transformation logic that sits between a raw MIDI event stream and the
input spec's contract.

Mappings are not part of the spec. They are implementations of it. A mapping
is instrument-specific, user-configurable, and shareable. Multiple valid
mappings can produce the same Solfège Output from different physical gestures.
The mapping layer is where creative, instrument-specific, and ergonomic
decisions live.

## Core mapping concepts

### The bundle

A bundle is the set of MIDI events accumulated between two COMMIT signals.
The mapping's first responsibility is to define what COMMIT looks like for a
given instrument and configuration. Once COMMIT is defined, everything between
two COMMITs is a bundle and will be evaluated together.

COMMIT must always be an explicit MIDI event. Common choices:

- A designated note-on at a specific pitch (the "return key" convention —
  the rightmost key on a controller, a dedicated pad, or any note outside
  the active mapping range)
- A specific CC value on a designated controller
- A specific program change message
- A SysEx message for extended configurations

Silence, note release, and note decay are not valid COMMIT signals. They are
not explicit and cannot be reliably distinguished from natural instrument
behaviour.

### The sustain accumulation pattern

When a sustain pedal or equivalent hold signal is active, MIDI events
accumulate into the bundle without committing. The pedal-off event does not
commit either — it closes the accumulation window and returns to the normal
bundle state. Only COMMIT emits output.

The practical effect: a user can build a chord slowly by pressing and releasing
notes while the pedal is held, then commit the accumulated set as a single
bundle. This removes the physical constraint of simultaneous key pressing for
complex diacritics, making the full comma space accessible without demanding
keyboard technique.

### Ordering within a bundle

When a bundle contains multiple note-on events, their temporal order is
preserved. The mapping uses this ordering to distinguish between chord input
(near-simultaneous, treated as a set) and sequential input (deliberate
temporal separation, treated as a sequence). The threshold for "near-
simultaneous" is mapping-configurable and typically 30–80ms.

## Keyboard mapping

A standard two-octave MIDI controller (25 keys) provides a natural surface
for the full Solfège Output type: one octave for base syllable selection and
one octave for comma modifier selection.

### Base syllable register (lower octave)

The lower twelve keys map directly to the twelve SolfegeSyllables in chromatic
order. The physical solfège syllable of the key pressed is the solfège syllable —
no lookup required. Pressing the C key in the lower octave selects Do.
Pressing F# selects Fi. The instrument is already a chromatic selector; the
mapping honours that directly.

A single key pressed and committed with no upper octave activity produces a
Solfège Output with the corresponding syllable and an empty commas array.

### Modifier register (upper octave)

The upper twelve keys form a modifier palette. A simultaneous press of a lower
key and one or more upper keys builds a bundle that the mapping resolves to
a syllable plus comma entries.

Simultaneity is the unambiguity mechanism. A held lower key combined with a
held upper key is unambiguously intentional — no timing window or lookback
ambiguity. The sustain accumulation pattern (above) extends this to sequential
presses when simultaneous pressing is impractical.

**Recommended upper octave layout:**

The layout follows two principles: prime families increase in complexity from
left to right, and direction pairs (compression/expansion) are adjacent.

| Upper key | Assignment | Comma value |
|---|---|---|
| C | Du depth 2 expansion (Sub) | `{ prime: "Du", step: 1 }, { prime: "Du", step: -1 }` |
| C# | Axis (Du step) | `{ prime: "Du", step: 1 }` |
| D | Du depth 2 compression (Sup) | `{ prime: "Du", step: 1 }, { prime: "Du", step: 1 }` |
| D# | Tri expansion | `{ prime: "Tri", step: -1 }` |
| E | Tri compression | `{ prime: "Tri", step: 1 }` |
| F | Qui expansion | `{ prime: "Qui", step: -1 }` |
| F# | Qui compression | `{ prime: "Qui", step: 1 }` |
| G | Sep / Undec expansion zone | family determined by magnitude key |
| G# | Sep / Undec compression zone | family determined by magnitude key |
| A | Sep family flag | combined with G/G# selects Sep |
| A# | Undec family flag | combined with G/G# selects Undec |
| B | Magnitude 2 | step value 2 when combined with family key |

**Magnitude encoding:** When a family key in the G–A# zone is pressed, the
default step magnitude is 1. Adding the B key raises magnitude to 2. For
families with higher magnitudes (Sep up to 3, Undec up to 5), a second
simultaneous lower-octave key acts as a magnitude selector while any upper
modifier key is held — at that point the lower octave is in magnitude mode
rather than syllable mode.

**Qui2:** Lower key + F (Qui expansion) + B (magnitude 2) = Qui step -2.

**Sep3:** Lower key + A (Sep flag) + G (expansion zone) + B = Sep step -3.

**Undec5:** Lower key + A# (Undec flag) + G# (compression zone) + lower D#
(magnitude 4 or 5 per user config) = Undec step 4 or 5.

This layout is a recommended default, not a normative requirement. Users are
expected to customise it for their instrument and workflow.

### COMMIT on a keyboard controller

The recommended COMMIT key is the first key above the two-octave range —
the 26th key if present, or a dedicated pad. If neither is available, a
specific CC value (CC 64 momentary, CC 123, or similar) on a dedicated
physical control works equally well.

## MIDI guitar mapping

MIDI guitar offers different affordances from a keyboard and those affordances
map to PPT concepts more directly in some respects.

### Base syllable from fretted pitch

The fretted solfège syllable of the primary note in the bundle determines the
SolfegeSyllable, as with keyboard mapping. Open strings, harmonics, and fretted
notes all contribute solfège syllable information in the normal way.

### Continuous pitch bend as comma input

Guitar pitch bend data (pitch bend MIDI messages) captures string bending,
vibrato, and slide gestures as a continuous deviation from the fretted pitch.
At COMMIT time, the accumulated pitch bend value is resolved against the
nearest PPD position and converted to the corresponding comma entry.

Resolution logic: the cents deviation from the fretted solfège syllable is compared
against the expected deviation for each comma value at each prime family. The
closest match within a configurable tolerance window (default ±15 cents) is
selected. If no comma falls within the window, the output carries no comma
entry and the deviation is treated as expressive rather than notational.

This is the most direct encoding of microtonality available in this input
system — the guitarist physically performs the comma rather than selecting it
from a palette.

### Strum direction as ordering signal

MIDI guitar controllers typically report notes in strum order. A downstroke
produces notes from the lowest string to the highest in rapid sequence; an
upstroke reverses this. The mapping preserves this ordering as the bundle's
note sequence, which an application can interpret as ascending or descending
melodic direction.

### String channel as layer signal

Most MIDI guitar controllers assign each string to a separate MIDI channel
(channels 1–6 per the GK convention). The mapping can use channel identity
as a layer selector: low strings (channels 5–6) targeting the register layer,
middle strings (channels 3–4) targeting the rhythmic layer, high strings
(channels 1–2) targeting the pitch layer. This is a suggested convention;
applications that consume the Solfège Output object handle layer assignment
themselves.

### COMMIT on MIDI guitar

A mute chord (all strings damped simultaneously), a specific tap on a non-
fretted string, or a dedicated MIDI footswitch are all viable COMMIT signals
for guitar. String release is not a valid COMMIT signal for the same reason
note release is not valid on keyboard — it is a natural consequence of playing
technique, not a deliberate notational gesture.

## Binding profiles

A binding profile is a user-owned, shareable configuration that maps a
specific instrument's MIDI output to Solfège Output objects. It specifies:

- Which MIDI events constitute COMMIT
- The base syllable register (note range and root note)
- The modifier register or bend resolution parameters
- Magnitude key assignments
- Sustain accumulation behaviour

Default binding profiles for common instruments ship with the spec as
reference implementations. Users create and share custom profiles to fit
their instrument, playing style, and notation workflow. A binding profile
requires no code — it is a declarative configuration over the mapping
conventions defined in this document.

## MIDI chain input

Because the mapping layer only requires a valid MIDI stream, the upstream
source of that stream is unconstrained. The following use cases are all valid:

**DAW clip playback:** A pre-built MIDI clip containing a chord or sequence
fires on a single keypress. The clip contains the note-on events and a
designated COMMIT message. The mapping receives this as a normal bundle and
emits the corresponding Solfège Output. This is the MIDI equivalent of a
text expander — one physical action produces multiple output tokens.

**Hardware arpeggiator or chord memory:** A device generates the chord
structure for a specific comma automatically when the root note is selected.
Complex Undec or Sep commas that are difficult to chord manually can be
assigned to chord memory presets.

**Generative sequence:** An algorithmic or generative MIDI source produces
a stream of bundles describing a complete solfège phrase. The mapping and
spec are the receiving contract; the generator is unconstrained.

**Synthesiser patch:** A synthesiser's internal modulation routing produces
MIDI output (via MIDI out or loopback) that encodes comma information as
pitch bend or CC data. The performer's physical gesture drives the synthesis;
the MIDI output encodes the PPT notation.

In all cases the spec and mapping layer are identical. Only the upstream
MIDI source changes.

## Building a custom mapping

A valid custom mapping must satisfy the following:

1. COMMIT is defined as an explicit MIDI event.
2. Every bundle produces exactly one Solfège Output object or is a no-op
   (empty bundle).
3. The SolfegeSyllable in the output is one of the twelve enumerated values.
4. Every entry in the commas array has a CommaPrime from the enumerated set
   and an integer step value.
5. The commas array preserves order — entries appear in the sequence they
   were determined during bundle evaluation.

Beyond these constraints, a mapping may use any MIDI data available in
the bundle — note-on events, pitch bend, CC messages, aftertouch, velocity,
channel identity, or timing — to determine the output.

## See also

- [MIDI to Solfège Input Specification](midi-solfege-input.md) — the output
  type and contract this mapping targets
- [Prime Lattice](../foundations/prime-lattice.md) — the mathematical space
  comma steps navigate
- [Prime Period Diacritics — Glyph Forms](../ppd/glyph-forms.md) — the
  written forms corresponding to comma values
- [Notation Input](../applications/notation-input.md) — how mapped output
  is consumed by PPT tools and components