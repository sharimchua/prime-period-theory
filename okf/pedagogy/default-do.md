---
type: concept
title: "Default Do: The Case for D on 12TET Keyboards"
description: A proposal to use D, rather than C, as the default pitch-class anchor for Do when teaching Uniform Solfège on 12TET keyboard instruments — grounded in the unique black/white key symmetry around D and its alignment with the A440 tuning standard.
tags: [pedagogy, uniform-solfege, keyboard, default-do, mnemonics]
status: stable
timestamp: 2026-07-18
---

# Default Do: The Case for D on 12TET Keyboards

## Status

This is a proposed pedagogical convention, not a change to PPT's underlying
mathematics. Do remains the arbitrary ratio-1 reference point in every part of
the framework. Reassigning the *default* pitch class used to introduce Do on a
keyboard is a pure relabelling. Nothing downstream moves.

## The problem this solves

Uniform Solfège's relative structure is translation-invariant: it holds
regardless of which pitch class is called Do. On an isomorphic instrument like
guitar, this invariance is transparent — every fingering shape is identical
under transposition, so there is no "problem" to solve.

The 12TET piano keyboard is not isomorphic. Its black/white key pattern is a
fixed, asymmetric artefact of the instrument's design history. When Do is
anchored to C — the conventional default — that asymmetry actively works
against the student. A minor third above C (Eb) is a black key; its
reflection, a minor third below C (A), is white. Two interval classes related
by inversion look structurally unrelated on the instrument — exactly the kind
of confusion Uniform Solfège is meant to dissolve, not reproduce.

## The discovery: D as the axis of symmetry

D is a fixed point of the keyboard's colour pattern. For every semitone
distance `n`, the pitch classes D+n and D−n share the same key colour — the
entire twelve-tone pattern reflects symmetrically about D.

This is provable directly from the layout: D sits at the midpoint of the
two-note black-key cluster (C#, D#), rather than at a boundary of the
three-note cluster the way G or A does. Reflection about the centre of a
symmetric black-key group preserves colour on both sides.

D and its tritone partner Ab are the *only* two pitch classes with this
property. Anchoring Do to either produces the same underlying symmetry. D is
the correct choice of the two because it is the white-key member of the pair,
keeping Do itself on a natural note.

## Pedagogical advantages of Do = D

When D is positioned as Do, the symmetrical properties of the keyboard align
with the symmetrical structure of intervals around the root. This produces
several immediate benefits for learners orienting themselves on the piano.

### 1. Kinesthetic symmetry in contrary motion

D is the topographical centre of the keyboard's black/white pattern. If a
student places both thumbs on D and plays outward in contrary motion, the left
and right hands strike the exact same sequence of black and white keys
simultaneously. An interval and its inversion become physically obvious in the
hands — a theoretical symmetry turned into a kinesthetic sensation.

### 2. Ergonomic pentascale

The five-note major pentascale from D (D, E, F#, G, A) fits the natural anatomy
of the hand. The middle — and longest — finger rests on the elevated black key
(F#) while the shorter fingers sit on white keys, producing a relaxed,
ergonomic arch from the very first lesson.

### 3. Interval colour symmetry

Interval classes mirror perfectly around D in terms of key colour:

| Distance | Syllables | Pitch classes | Key colour |
|---|---|---|---|
| ±1 | Di / Ti | D# / Db | Both black |
| ±2 | Re / Te | E / C | Both white |
| ±3 | Me / La | F / B | Both white |
| ±4 | Mi / Le | F# / Bb | Both black |
| ±5 | Fa / So | G / A | Both white |
| ±6 | Fi | Ab / G# | Black (single axis point) |

No other white-key anchor produces this complete colour symmetry.

### 4. Dissolving the "white key bias"

Conventional pedagogy anchors on C, establishing a subconscious hierarchy where
white keys are "natural" and black keys are "deviations". Anchoring on D places
the tonic inside the symmetric "U" shape (Db, D, D#), treating black and white
keys as equal structural coordinates from day one. This helps dissolve the
historical artefact of "naturals vs accidentals" before it takes root.

### 5. Consistent black key naming

D as the centre produces clear, directional principles for naming the black
keys:

- The tonic is immediately flanked by **D#** (+1) and **Db** (−1).
- Moving upward (to the right), black keys take sharps: **F#** (+4).
- Moving downward (to the left), black keys take flats: **Bb** (−4).
- The one exception is the tritone at **Ab** (±6), which naturally takes an
  extra flat — reinforced by the "A Fi-lat" mnemonic (see below).

### 6. Symmetrical diminished 7th

The fully diminished 7th chord built on D radiates symmetrically across the
keyboard: the minor thirds on both sides of D land on white keys (**B** and
**F**), while the tritone directly opposite is the only black key in the
structure (**Ab**). The visual shape of this chord is immediately legible.

### 7. Cardinal cluster mirroring

The three-note clusters adjacent to D's nearest white-key neighbours exhibit
a mirrored contour:

- Moving up from Re (+2): **E, F, F#** — White, White, Black
- Moving down from Te (−2): **C, B, Bb** — White, White, Black

Both clusters curve outward into a black key at the ±4 semitone mark,
physically mirroring each other on the keyboard.

## Mnemonic value

Three incidental mnemonics support first internalisation of the mapping. They
carry no theoretical weight, but they are pedagogically useful as entry points:

- **D is Do** — the letter name and the syllable name align directly.
- **"A Fi-lat"** — Fi sits on Ab (A-flat), giving beginners a spoken bridge
  between the Uniform Solfège syllable and the conventional accidental name.
- **The "Do-Re-Mi" song** — if D is Do and students learn the chromatic
  solfège syllables, the famous "Do-Re-Mi" melody traces D major
  (D, E, F#, G, A, B, C#) directly. Students get the major scale shape on the
  keyboard for free, as a mnemonic side-effect of learning the syllable
  sequence.

## What the symmetry highlights

Two features of the Do = D mapping are worth calling out separately, because
they connect to structures defined elsewhere in the framework:

- **Fi at Ab** — Fi's position is forced by the existing ±600¢ symmetric
  window; it lands on the tritone regardless of which Do is picked. What D
  specifically contributes is that Fi's neighbours (G, Ab, A) form a visually
  legible inverted U, mirroring the U formed by Do's own neighbours
  (Db, D, D#).
- **So at A** — So marks the lower boundary of the period, and A is the
  ISO 16 / A440 international tuning reference. Do = D gives Uniform Solfège
  a non-arbitrary bridge to that universally recognised physical anchor — a
  genuine coincidence of the ±5 semitone position, not a designed feature.

## Scope

This convention is recommended specifically for teaching contexts that use a
12TET keyboard as the primary reference instrument — where the asymmetry of
the black/white layout is the obstacle being addressed. It has no bearing on
isomorphic instruments (guitar and similar grid-based layouts), where every Do
choice is already equivalent by construction.

## Open questions

- Whether this should become the default keyboard anchor across all PPT
  teaching materials, or remain an optional convention alongside C-anchored
  Do for continuity with conventional solfège pedagogy.
- Whether the keyboard component in `docs/components/keyboard/` should
  support a togglable Do anchor to let students see both symmetric and
  asymmetric framings directly.
