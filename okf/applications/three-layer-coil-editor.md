---
type: concept
title: Three-Layer Coil Editor — Component Architecture
description: >
  Component design for a MIDI- and text-driven Three-Layer Coil editor in the
  Composer: atomic grammar interpreters, phrase editing surfaces, MIDI/text
  input bridges, and a playback engine that derives harmony and melody timing
  from the Rhythmic Grammar layer. Built as compositions of atomic primitives,
  consistent with the existing PPT Component Philosophy.
tags:
  - applications
  - components
  - coil-notation
  - rhythmic-grammar
  - melodic-grammar
  - musicoil
  - midi
  - prime-period-theory
timestamp: 2026-07-06
---

# Three-Layer Coil Editor — Component Architecture

## Design constraints taken from the OKF

Before proposing components, four existing commitments in the OKF constrain
the design and are treated as non-negotiable:

1. **One primitive, many interpretations** (Component Philosophy). No
   component should encode "this is for rhythm" or "this is for melody" if
   that choice can instead be supplied by composition. A row is a row; a
   phrase is a phrase. What differs between a rhythm row and a melody row is
   *which interpreter is attached*, not the editing surface itself.
2. **Composition over configuration.** There is no `<coil-editor>` monolith.
   The coil is assembled from atomic pieces the same way the Tonal Clock and
   Metronome are both just `<ppt-period>` compositions.
3. **Declarative interaction via EventBus.** Transport controls, tempo
   sliders, and MIDI input all emit named events; editing/playback
   components declare what they listen for via `listen-id`. No component
   directly calls into another component's internals.
4. **Relative-before-absolute.** Grammar interpreters work entirely in
   scale-degree / solfège-token space. Nothing about tonal centre, absolute
   Hz, or wall-clock time is allowed to leak into a `Phrase` until it hits
   the tuning/timing resolution boundary at playback time. This is what
   keeps a coil transposable and tempo-independent by construction.

The three grammars — **Rhythmic Grammar**, **Melodic Grammar**, and the
implied **Harmonic Grammar** (stacked/simultaneous solfège reads, per the
tetrachord-pair and tertian-stacking conventions in the tuning docs) — are
theory-owned. The components below are deliberately thin wrappers that defer
to those specifications rather than reimplementing grammar rules in UI code.

## Layered summary

```
┌─────────────────────────────────────────────────────────────┐
│ <ppt-coil>                                                   │
│   ┌───────────────────────────────────────────────────────┐ │
│   │ <ppt-coil-layer layer="melody">    (top)                │ │
│   │   <ppt-coil-row> × N   (polyphony)                     │ │
│   ├───────────────────────────────────────────────────────┤ │
│   │ <ppt-coil-layer layer="harmony">   (middle)             │ │
│   │   <ppt-coil-row> × N   (polychords)                    │ │
│   ├───────────────────────────────────────────────────────┤ │
│   │ <ppt-coil-layer layer="rhythm">    (bottom)             │ │
│   │   <ppt-coil-row> × N   (polyrhythm)                    │ │
│   └───────────────────────────────────────────────────────┘ │
│   <ppt-coil-transport>  <ppt-tonal-centre>  <ppt-tempo-control> │
└─────────────────────────────────────────────────────────────┘
```

Each `<ppt-coil-row>` contains one `<ppt-phrase-editor>`, which is the actual
editable Solfège Phrase surface, fed by either the MIDI bridge or the text
input bridge — both producing the same `glyph-input` event shape, so the
phrase editor genuinely does not know or care which input method was used.

---

## A. Shared data model (headless)

These are not visual components. They are the vocabulary every layer,
interpreter, and renderer shares — the direct software analogue of Uniform
Solfège being "one deck, played as different games."

### `GlyphToken`
The atomic unit. A single Uniform Solfège syllable plus its modifiers:

```typescript
interface GlyphToken {
  syllable: string;               // Do, Re, Mi, ... (12 base tokens)
  diacritic: string;              // Sub | HalfSub | Base | HalfSup | Sup | Axis
  octaveOffset: number;           // register displacement
  durationWeight?: number;        // used only when interpreted rhythmically
}
```

A `GlyphToken` has no opinion about whether it's a pitch, a beat, or a chord
tone — that meaning is assigned by whichever `GrammarInterpreter` reads it.
This mirrors the OKF's point that the diacritic vocabulary is "indifferent
to timescale."

### `Phrase`
An ordered array of `GlyphToken`s, plus a reference to which grammar context
it was authored under (rhythm / melody / harmony). A `Phrase` is what a
`<ppt-phrase-editor>` edits and what gets serialized per row.

### `CoilModel`
The full addressable state of one coil: three `Layer`s (rhythm, harmony,
melody), each holding an ordered list of `Row`s, each `Row` holding a
`Phrase` plus row metadata (label, register offset, mute/solo, voice colour).
This is the unit that gets serialized to/from **PPT-CF** (see §G).

---

## B. Grammar interpreters (headless services)

Three small, independently testable modules. Each takes a `Phrase` (and,
where needed, contextual state like tonal centre) and produces a structured,
domain-specific result. None of them touch the DOM, MIDI, or audio.

### `RhythmicGrammarInterpreter`
Validates a rhythm-layer `Phrase` against Rhythmic Grammar rules (legal
token sequences, Axis-marked block boundaries via `Dox`/`Dix`, descending-
fifths cadential chain structure) and produces an **onset spec**: a
sequence of relative beat positions and durations, expressed purely as
ratios — no BPM, no wall-clock time. Multiple rhythm rows within a layer are
independent onset specs at this stage; combining them into one polyrhythmic
grid is the `TimingGridResolver`'s job (§D), not the interpreter's.

### `MelodicGrammarInterpreter`
Resolves a melody-layer `Phrase` into a sequence of **scale-degree
positions** — absolute or intervallic movement per Melodic Grammar
conventions — still relative to an unspecified tonal centre. Handles
diacritic-based microtonal offsets as fractional degree displacement.

### `HarmonicGrammarInterpreter`
Resolves a harmony-layer `Phrase` (or a *simultaneous read across multiple
harmony rows* — a polychord) into a **chord-tone set** per the tertian/
tetrachord-pair stacking conventions in the tuning docs. This is the one
place multiple rows in a layer combine at the grammar level rather than
staying independent, since a polychord is defined by its rows sounding
together, unlike polyphony/polyrhythm which are independent strands.

All three interpreters share the same `GlyphToken` vocabulary and the same
diacritic state machine — they differ only in what question they ask of the
tokens, exactly as the OKF's "two different games, same deck" framing for
Rhythmic Grammar vs. pitch space predicts.

---

## C. Structural containers (visual, DOM)

### `<ppt-coil>`
Top-level composition. Positions three `<ppt-coil-layer>` children bottom
(rhythm) to top (melody) — geometry emerges from layer order and count, not
from hardcoded CSS per layer, consistent with declarative geometry. Owns no
grammar logic itself; it is a layout and event-routing shell.

### `<ppt-coil-layer layer="rhythm|harmony|melody">`
Holds one or more `<ppt-coil-row>` children. The `layer` attribute is the
*only* thing that determines which `GrammarInterpreter` gets attached to
child phrase editors — this is the composition-over-configuration hinge
point of the whole design. Swapping `layer="harmony"` for `layer="melody"`
on an otherwise identical subtree changes its behaviour entirely, the same
way changing a `<ppt-period>`'s child count changes a Tonal Clock into a
pentatonic clock.

### `<ppt-coil-row>`
One voice/strand: a polyphonic melody line, a polychord voice, or a
polyrhythm strand. Contains exactly one `<ppt-phrase-editor>` plus row
chrome: label, register offset control, mute/solo toggle (this is what the
play-along simplification ladder needs — muting all melody rows but one, or
soloing the rhythm layer, should be a row/layer-level control, not a
playback-engine special case).

### `<ppt-phrase-editor>`
The actual editable Solfège Phrase surface for one row. Renders
`<ppt-coil-glyph>` tokens in sequence with a `<ppt-coil-cursor>` for
selection/insertion point. Accepts `glyph-input` events from whichever
input bridge is active and forwards them to the interpreter selected by its
parent `<ppt-coil-layer>`'s `layer` attribute for live validation feedback
(e.g., flagging an illegal token sequence in-line) — but does not itself
know MIDI or text parsing rules.

This directly satisfies "each row can be selected and then edited as a
Solfège Phrase, using conventions contextual to each grammar" — the
contextuality lives entirely in which interpreter the parent layer selected,
not in the editor.

---

## D. Timing and tonal context (headless services + thin controls)

### `<ppt-tonal-centre>`
A declarative control (not unlike the existing tempo slider pattern)
declaring the coil's current tonal centre / reference degree. Emits
`tonal-centre-change`. This is the single point where "what note is Do
right now" enters the system — everything upstream of it stays relative.

### `<ppt-tempo-control>`
Declares tempo (BPM, or a Metric DuPeriod address) and emits
`tempo-change`, following the exact EventBus pattern already used for the
Metronome's control components.

### `TimingGridResolver` (headless)
Takes the `RhythmicGrammarInterpreter` output from **all** rhythm rows in
the coil (i.e., the full polyrhythmic stack) plus the current tempo, and
produces the master absolute-time onset grid: resolves inter-row LCM
alignment, applies coarse-graining/grid-reduction so playback doesn't
quantize to needlessly fine subdivisions, and hands out an ordered list of
absolute onset timestamps. **This is the component that makes "the
Rhythmic Grammar phrase defines the timing for both the Harmony and
Melodic layer" literally true** — Harmony and Melody layers never generate
their own timeline; they only ever consume onset slots handed to them by
this resolver.

### `TuningResolver` (headless)
Converts a resolved scale-degree + diacritic + octave + current tonal
centre into an absolute frequency in Hz, using the prime-ratio/just-
intonation math from the tuning docs (with the Periodicity Limen Reference
Tuning as the absolute anchor). This is the *only* place absolute pitch
exists in the whole system — swappable, so a 12TET-fallback resolver can sit
alongside a full-JI resolver without touching anything upstream, honoring
the framework's explicit non-12TET-privileging stance.

---

## E. Input bridges

### `<ppt-midi-input-bridge>`
Wraps the Web MIDI API. Listens for note-on/note-off/CC and hands raw events
to a pluggable `MidiToSolfegeMapper`, then emits `glyph-input` events scoped
to whichever `<ppt-phrase-editor>` currently holds selection focus. Two
mapper implementations are needed, selected by the focused row's layer:

- **Pitch mapper** (melody/harmony rows): MIDI note number → scale degree +
  diacritic relative to the current `<ppt-tonal-centre>`.
- **Rhythm mapper** (rhythm rows): note-on timing/velocity on a designated
  pad/key range → Rhythmic Grammar tokens, including Axis-marked (`Dox`/
  `Dix`) boundary detection from strong-beat velocity.

This is exactly the surface the MIDI-to-Solfège spec thread already in
progress needs to land on — the bridge should consume that spec directly
rather than the coil editor inventing its own mapping table.

### `<ppt-solfege-text-input>`
Plain text fallback. A `SolfegeTextParser` turns typed shorthand (`Do Re
Mi`, `DoxReSoDix`) into the identical `GlyphToken` stream and emits the same
`glyph-input` event shape as the MIDI bridge. Parity between the two input
paths is enforced by both terminating in the same event contract — the
phrase editor has no idea which one fired.

---

## F. Playback engine

### `<ppt-coil-transport>`
Play/pause/stop/seek control surface. Purely declarative — emits `play`,
`stop`, `seek` events. No scheduling logic lives here, matching the
existing "control emits, component listens" split.

### `PlaybackScheduler` (headless)
Subscribes to `play`. Walks the `TimingGridResolver`'s onset grid; at each
onset, asks `MelodicGrammarInterpreter` / `HarmonicGrammarInterpreter` for
the pitch(es) due at that slot, resolves them to Hz via `TuningResolver`,
and schedules note-on/off on the relevant `<ppt-tone-voice>` using standard
Web Audio lookahead scheduling.

### `<ppt-tone-voice>`
One playable voice per row: oscillator + envelope. Driven entirely by
`PlaybackScheduler`; has no knowledge of grammars or coils. Envelope shaping
can defer to the ADSR-to-macrospace mapping work already underway rather
than inventing a separate envelope model.

### `<ppt-coil-mixer>`
Per-row/per-layer gain and mute/solo panel. This is what turns the
play-along simplification ladder from a documented philosophy into an
actual feature: soloing the melody layer, or muting all rhythm rows but
one, is just mixer state, not a special playback mode.

---

## G. Rendering and serialization

### `<ppt-coil-glyph>`
The individual rendered Uniform Solfège glyph — geometric character plus
diacritic mark. Used inside `<ppt-phrase-editor>`, in read-only coil
previews, and in a future print/export view that mirrors the paper-writable
Three-Layer Coil Notation aesthetic. Keeping this atomic means the
"handwriting register" and the "digital editor register" can share one
rendering primitive instead of diverging.

### `<ppt-coil-cursor>`
Selection/insertion caret, atomic enough that `<ppt-phrase-editor>` doesn't
need to own caret-rendering logic itself.

### PPT-CF extension
Rather than inventing a new save format, propose a `coil` shape under the
existing **PPT Composition Format** spec: layers → rows → phrases (as
`GlyphToken` arrays) → tonal centre → tempo. This is what the Composer
would read/write, and what an agent-raised PR against the OKF repo would
attach as a worked example alongside the spec update.

## See also

- [[Component Philosophy]](component-philosophy.md) — the primitive/composition/EventBus principles this design extends
- [[Three-Layer Coil Notation]](../structure/coil-notation.md) — the paper syntax this editor makes interactive
- [[Rhythmic Grammar]](../structure/rhythmic-grammar.md) / [[Melodic Grammar]](../structure/melodic-grammar.md) — the theory each interpreter defers to
- [[Play-Along Feedback]](play-along.md) — the simplification ladder the mixer/row-mute design is built to serve
- [[PPT Composition Format (PPT-CF)]](../specifications/composition-format.md) — proposed home for the `coil` serialization shape
