---
type: concept
title: Melodic Grammar
description: >
  The melodic layer convention for Three-Layer Coil Notation: a flexible
  system encoding melody as either absolute solfège position or intervallic
  movement from the previous note, switchable per character via mode-marker
  neumes. Gesture neumes specify ornamental approach, contour, and
  microtonal path type.
tags:
  - melodic-grammar
  - three-layer-coil
  - uniform-solfege
  - neumes
  - melody
  - interval
  - microtonality
  - notation
timestamp: 2026-06-29
---

# Melodic Grammar

## Overview

Melodic Grammar is the notation convention governing the melody layer of
**Three-Layer Coil Notation**. It defines how Uniform Solfège syllables in
the melody layer are interpreted — whether as **absolute pitch positions**
within the solfège space, or as **interval movements** from the previously
sounded note — and provides a vocabulary of **gesture neumes** for
ornamental and microtonal articulation.

The system is designed to be flexible rather than prescriptive. Composers
and analysts may choose whichever default mode better suits the musical
material, marking the exception explicitly. This mirrors the design
philosophy of Rhythmic Grammar, where compacted and expanded forms coexist
and context determines which is in use.

## The two interpretive modes

Every solfège syllable in the melody layer carries one of two meanings
depending on the mode in which it is read:

**Absolute mode**: the syllable names a position in the chromatic solfège
clock — Do at the tonic, Ra a semitone above, Re a whole tone above, and
so on through the 12-position system. The syllable tells you *where you
are*.

**Interval mode**: the syllable names a movement from the previously
sounded pitch. Do means unison (no movement), Ra means up one semitone,
Te means down a minor seventh, and so on. The direction is encoded in
the syllable itself — the sharp-side syllables (Ra, Di, Ri, Fi, Si, Li)
ascend; the flat-side syllables (Te, Le, Se, Me, Ra descending context)
descend. Superscript numerals indicate multi-octave transpositions of the
interval. The syllable tells you *how far you moved*.

The two modes share the same syllable set. A mode-marker neume placed
above the syllable resolves any ambiguity.

## Mode-marker neumes

Two purpose-built neumes mark mode explicitly when the default is overridden
or when clarity requires it. Both are placed above the solfège character,
consistent with the position of other neume marks in the layer.

**Circle ◯** — absolute position marker. A small open circle above the
syllable indicates that this character names a fixed position in solfège
space, regardless of what mode the surrounding passage is in. Visually,
the circle evokes a node: a fixed point on the coil. This is the same
primitive used for position nodes in MusiCoil spatial notation, making the
cross-system meaning consistent.

**Horizontal line —** — interval movement marker. A short horizontal
stroke above the syllable indicates that this character names an interval
movement from the previous pitch. The horizontal line evokes a path
segment: directed travel along an axis. Again this is consistent with
the path-segment visual language of MusiCoil.

Neither neume modifies the sound of the note — they are purely
interpretive markers telling the reader which coordinate space the
syllable operates in.

## Default mode and re-anchoring

In practice, a passage will establish a working default and use the mode
markers only at transitions. Two natural defaults emerge from the musical
material:

**Interval-default passages** suit melodic material where contour and
movement are primary — flowing lines, ornamental phrases, sequences, and
situations where the structural pitches only matter at phrase boundaries.
Absolute-mode exceptions are marked with ◯.

**Absolute-default passages** suit melodic material where specific pitch
positions are primary — motifs defined by their scale-degree identity,
structural melodic anchors, or analysis contexts where tonic-relative
position is the object of interest. Interval-mode exceptions are marked
with —.

### Re-anchoring at chord changes

A natural re-anchoring convention applies in harmonised contexts: the
first melodic syllable at each chord change is interpreted as absolute
position, providing a fresh fixed point from which subsequent interval
movements are measured. This aligns the melody layer's coordinate resets
with harmonic rhythm, since chord changes typically fall on strong beats
already marked in the rhythmic layer. Between chord changes, the melody
flows freely in interval mode.

This convention reflects a structural claim: harmonic rhythm and melodic
re-anchoring are the same perceptual event. The ear uses the chord change
as a positional fix, and the melody's intervallic path between fixes
carries the melodic identity.

When melody and harmony desynchronise — melody anticipated a beat early,
or sustained across a chord change — the composer may mark the re-anchor
explicitly with ◯ at the intended fix point rather than relying on the
chord-change convention.

### First note of a phrase

Regardless of default mode, the first note of any new phrase is treated
as absolute by convention, providing the dead-reckoning origin from which
subsequent interval movements are computed. This mirrors GPS dead-reckoning:
establish a fix, then track displacement.

## The mode choice as compositional statement

The choice of default mode for a passage is not merely notational
convenience — it is a declaration about how the melody is conceived.

A passage written in absolute-default mode asserts: *these scale degrees
are the structure*. The melody's identity is its position within the tonal
field.

A passage written in interval-default mode asserts: *this contour is the
structure*. The melody's identity is its shape and movement, independent
of where it sits in pitch space.

This distinction maps onto a real perceptual difference: melodic memory
is largely contour- and interval-based, while harmonic recognition is more
position-based. Melodic Grammar encodes each layer in the mode that matches
its perceptual reality.

## Gesture neumes

Gesture neumes modify how a note or movement is approached and articulated.
Unlike mode-marker neumes, they do not change the coordinate interpretation
of the syllable — they describe the ornamental path taken to or from it.
All gesture neumes are placed above the solfège character.

### Approach gestures

These describe the approach to the marked note from an unspecified
neighbouring pitch:

| Neume | Name | Description |
|---|---|---|
| `/` | Approach from below | Slide or step into the note from a lower pitch |
| `\` | Approach from above | Slide or step into the note from a higher pitch |
| `^` | Enclosure from below | Approach target from below, having come from above |
| `v` | Enclosure from above | Approach target from above, having come from below |

### Sustain gestures

These describe pitch behaviour during the duration of the note:

| Neume | Name | Description |
|---|---|---|
| `~` | Vibrato | Undifferentiated vibrato ornament |
| `~` + ◯ | Vibrato by ½ period | Vibrato with depth specified as half-period of interval |

### Tracking gestures (contextual)

Tracking neumes describe a continuous movement *from* the previous note to
the current one — a glide, bend, or meend rather than a discrete step. They
are inherently interval-mode gestures: they specify the *path* between two
pitches, not a destination.

| Neume | Name | Description |
|---|---|---|
| `⊢` | Track from previous note | Continuous movement originating at previous pitch |
| `⊢~` | Meend from previous note | Smooth continuous glide from previous pitch (Indian meend/glissando) |

Track neumes may be combined sequentially with approach or enclosure neumes
to describe compound gestures (approach, then enclose; track, then resolve).

### Track type diacritics

When a tracking gesture is used, a diacritic on the track neume specifies
the pitch grammar of the movement — what pitches are traversed in the slide:

| Diacritic | Track type | Description |
|---|---|---|
| (plain) | Smooth / glissando | Continuous pitch movement, no discrete steps |
| single dot | Chromatic track | Movement through 12TET semitone steps |
| double slash | Diatonic track | Movement through scale steps of the operative mode |
| colon (two dots) | Harmonic track | Movement through chord tones of the operative harmony |

This diacritic sub-grammar means a track neume carries two pieces of
information: the gesture class (approach, sustain, glide) and the
intervallic grammar of the movement. The combination is compact and
consistent with the diacritic layering used elsewhere in PPT notation.

## Microtonal precision: Prime Period Diacritics on interval neumes

When interval-mode movement requires microtonal precision beyond 12TET
step sizes — for blues bends, gamaka ornaments, maqam inflections, or
composed microtonal gestures — Prime Period Diacritics (PPD) may be
applied to the solfège syllable to specify the exact prime-ratio interval
of the movement.

This is distinct from applying PPD to an absolute-mode syllable (which
specifies a comma-adjusted scale degree). In interval mode, the diacritic
specifies the *size of the movement itself* as a prime ratio. The bend
is the object; the diacritic quantifies it.

### Precision spectrum

Three levels of precision are available in interval mode, and composers
select the level appropriate to the musical context:

**Unmarked interval** — free contour gesture. The solfège syllable gives
approximate direction and size; the exact pitch is left to performer
interpretation. Appropriate for ornamental passages, improvisation
frameworks, and stylistic gestures where over-specification would
constrain the music.

**Neume-marked interval** — structural gesture. The horizontal line neume
flags this movement as structurally significant without specifying its
exact ratio. Appropriate for distinctive intervallic ideas that define the
melodic character of a phrase.

**PPD-diacriticised interval** — ratio-precise microtonal movement.
The interval is specified to prime-ratio precision. Appropriate for
composed microtonal gestures, gamaka specifications, and analytical
transcription of ratio-specific intonation practices.

### Blues and gamaka as canonical cases

The blues bend is not well described as "a flattened third" — that is a
Western-theoretical retrofit. In interval mode with a septimal diacritic,
it is a movement of a specific 7-limit ratio: a gesture toward the harmonic
seventh partial. The notation encodes the phenomenology correctly — the
bend *is* the thing, not a deviation from a scale degree.

The Carnatic gamaka extends this further. Many gamakas are defined by their
oscillation path: how far above and below the central pitch the ornament
moves, at what speed, and with what contour. Interval-mode notation with
PPD diacritics and tracking neumes can specify a gamaka's shape — the
interval gesture — in a way that absolute-position notation cannot, because
the shape is the musical content.

## Relationship to other layers

The melody layer sits above the harmony layer in the Three-Layer Coil
grid. Vertical alignment across layers is structurally significant: a
melodic syllable vertically aligned with a harmonic root change is a
re-anchor candidate. A melodic syllable between harmonic events is in
free interval space.

The melody layer does not duplicate the harmony layer's function. Harmony
specifies the vertical pitch field; melody specifies movement through
(or against, or above) that field. In interval-default mode, the melody
layer is entirely independent of the harmonic coordinate system until a
re-anchor event explicitly connects them.

## Relationship to MusiCoil

Melodic Grammar inherits two foundational concepts from MusiCoil spatial
notation:

**Nodes** — fixed positions in pitch space — correspond to absolute-mode
syllables, marked with the circle neume. The circle is the same primitive
used for coil nodes in MusiCoil.

**Paths** — directed movements between nodes — correspond to interval-mode
syllables, marked with the horizontal line neume. The line is the same
primitive used for path segments in MusiCoil.

Melodic Grammar is therefore MusiCoil's spatial logic made available in
linear notation: the same concepts of anchored position and directed travel,
expressed in a handwritable sequential form.

## See also

- [Three-Layer Coil Notation](coil-notation.md) — the parent notation system
- [Rhythmic Grammar](rhythmic-grammar.md) — parallel grammar system for the rhythm layer
- [Uniform Solfège — Overview](../uniform-solfege/index.md) — the solfège syllable system
- [Prime Period Diacritics — Overview](../ppd/index.md) — microtonal diacritic system
- [MusiCoil](musicoil.md) — spatial notation; origin of node and path concepts
- [Pitch](../domains/pitch.md) — pitch as micro periodicity in PPT
