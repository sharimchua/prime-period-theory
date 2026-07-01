---
type: concept
title: Notation Input
description: >
  How the MIDI to Solfège Input Specification serves as an input mechanism
  for PPT tools and components. Covers the relationship between the input
  spec and notation editors, text expander and macro patterns, generative
  MIDI input, and the design principles for tools that consume Solfège
  Output objects.
tags:
  - applications
  - midi
  - input
  - notation
  - uniform-solfege
  - prime-period-theory
timestamp: 2026-07-01
---

# Notation Input

## The input spec as a stable target

The [MIDI to Solfège Input Specification](../specifications/midi-solfege-input.md)
defines a contract that any PPT tool consuming musical input can build
against: a stream of Solfège Output objects, each carrying a syllable and
an ordered comma sequence. Tools that accept this contract are automatically
compatible with any upstream source that produces it — a keyboard controller,
a MIDI guitar, a DAW clip, a generative algorithm, or a hardware synthesiser.

This decoupling is the central design principle for PPT notation input. A
tool that processes Solfège Output objects does not need to know whether the
input came from a human performing in real time or from a pre-computed MIDI
sequence. The tool's input interface is the spec; the spec's input interface
is the MIDI stream; what produces the MIDI stream is unconstrained.

## What a notation tool receives

A notation tool consuming Solfège Output objects receives a stream of
discrete, committed, fully-resolved notational events. Each event carries:

- A solfège syllable — the chromatic position of the glyph.
- A commas array — the ordered comma sequence describing its lattice position.

Everything else — register, layer assignment, half-size status, rhythmic
position — is context that the tool maintains. The input event does not carry
application state; it carries only the notational content of one glyph.

This is the same model as keyboard input to a text editor. A keypress event
carries a character; the editor maintains cursor position, selection state,
formatting context, and document structure. The keypress does not encode
those things. The same principle applies here: the Solfège Output object is
the character; the notation tool is the editor.

## Layer assignment

The solfège syllable and comma system are used across all three layers of
[Three-Layer Coil Notation](../related/coil-notation.md): the pitch layer,
the rhythmic layer, and the register layer. The input spec does not specify
which layer a given Solfège Output object targets — that is application
context.

A notation tool may implement layer selection as a mode (the user switches
the active layer before entering glyphs), as a binding profile convention
(specific MIDI channels or CC values signal layer identity), or as an
inference from context (the tool determines layer from the position in the
notation structure being edited). All of these are valid; none belong in
the input spec.

In the rhythmic layer, solfège syllables encode rhythmic grammar entries
rather than pitch positions. Do and Di mark subperiod boundaries; the
syllable set is the same enumeration, applied to a different domain. The
input mechanism is identical. Only the application's interpretation changes.

## Text expander and macro input

The MIDI chain between physical instrument and notation tool can include
any MIDI processing device or software. This opens a class of input
patterns analogous to text expander or stenographic input:

**Single-commit multi-glyph:** A pre-built MIDI clip or hardware preset
fires a sequence of bundles — each containing note-on events and a COMMIT
signal — on a single physical action. The notation tool receives a stream
of Solfège Output objects and enters them in sequence. One physical gesture
produces multiple notational tokens. Common phrases, motifs, rhythmic grammar
patterns, or diacritic-heavy glyphs that are awkward to enter in real time
can be assigned to presets.

**Chord memory for complex commas:** Sep and Undec comma entries require
specific chord structures that may be difficult to form on a small keyboard.
A hardware chord memory or DAW MIDI effect can store these chord structures
and fire them on a single keypress, with the COMMIT signal appended
automatically. The notation tool sees a normal Solfège Output object with
the full comma array; the complexity of producing it is absorbed upstream.

**Rhythmic grammar phrase input:** A looped MIDI sequence representing a
complete rhythmic grammar phrase — DoDiDoRe or similar — can be routed
through the input spec to enter a full rhythmic layer phrase in one action.
The loop fires each syllable as a separate committed bundle. The notation
tool enters them in sequence into the rhythmic layer.

These patterns require no modification to the input spec or the notation
tool. They are upstream MIDI processing choices that the tool is unaware of.

## Generative and algorithmic input

A generative algorithm producing MIDI output is a valid input source for
the same reason. The algorithm's output is a MIDI stream; the mapping layer
converts it to Solfège Output objects; the notation tool receives normal
input. Possible applications:

**Prime-family sequence generation:** An algorithm generates a sequence of
lattice positions exploring a specific prime family — a Tri-based harmonic
sequence or a Sep-based melodic motif — and routes it to the notation tool
as a sequence of Solfège Output objects. The composer receives a notated
phrase derived from the algorithm's output, which they can then edit, extend,
or contextualise.

**Temperament exploration:** An algorithm generates all positions within
a specified comma range from a given solfège anchor and presents them as
a navigable sequence. The composer steps through them, committing the ones
they want to retain. The notation tool enters each committed position
normally.

**Transcription assistance:** Audio analysis software estimates the pitch
class and comma deviation of performed notes and outputs them as MIDI with
pitch bend data. The mapping layer resolves the bend to comma values. The
notation tool receives Solfège Output objects that represent the performed
pitch with its microtonal character. Human review and correction can happen
within the notation tool after the fact.

## Design principles for tools consuming Solfège Output

A PPT notation tool that accepts Solfège Output objects as input should
follow these principles:

**Receive, do not negotiate.** The tool accepts any valid Solfège Output
object. It does not attempt to validate or correct the musical content of
the input — that is the user's responsibility. The tool's job is to place
the glyph in the correct position in the notation structure.

**Maintain context separately.** Register, layer, rhythmic position, and
document structure are tool state, not input state. The input event updates
the tool's state; it does not carry the state itself.

**Preserve the comma array.** The ordered comma sequence is the precise
lattice position of the glyph. The tool stores it in full. Rendering choices
(which PPD glyph form to display, which tuning approximation to use for
playback) are made at render time from the stored array, not by collapsing
the array at input time.

**Separate input from playback.** The notation tool is not required to
produce audio at input time. Playback is a separate concern that reads the
stored notation and applies a tuning system. The input path and the playback
path share the stored comma array as their common data, but they are
independently implemented.

## Relationship to Three-Layer Coil Notation

Three-Layer Coil Notation defines three distinct notational layers, each
of which accepts solfège input. The MIDI to Solfège Input Specification
provides a uniform input mechanism for all three layers without modification.
The layer-specific meaning of each Solfège Output object — solfège syllable in
the pitch layer, rhythmic grammar entry in the rhythmic layer, coil position
in the register layer — is determined by the layer context at the time of
input, not by the input object itself.

See [Three-Layer Coil Notation](../related/coil-notation.md) for the layer
structure and [Rhythmic Grammar](../related/rhythmic-grammar.md) for the
rhythmic layer's use of the solfège enumeration.

## See also

- [MIDI to Solfège Input Specification](../specifications/midi-solfege-input.md)
  — the input contract this document describes applications of
- [MIDI to Solfège Mapping](../specifications/midi-solfege-mapping.md)
  — the mapping layer that produces Solfège Output objects from MIDI
- [Three-Layer Coil Notation](../related/coil-notation.md) — the notation
  system that consumes Solfège Output objects
- [Rhythmic Grammar](../related/rhythmic-grammar.md) — the rhythmic layer's
  use of the solfège enumeration as input
- [Prime Lattice](../foundations/prime-lattice.md) — the mathematical space
  the comma array navigates
- [Component Philosophy](component-philosophy.md) — the broader design
  principles for PPT-native tools