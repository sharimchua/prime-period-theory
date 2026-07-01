---
type: concept
title: MusiCoil
description: >
  The spatial notation system and compositional environment built on PPT
  principles. MusiCoil makes pitch, rhythm, harmony, voice leading, and
  form directly readable as geometry — each a consequence of PPT's
  underlying periodicity structure rather than a symbolic convention.
  Version 10 introduces the layered Rhythm Coil / Tonal Coil architecture,
  a fully declarative inheritance hierarchy, and a complete emergent
  analytical infrastructure.
tags:
  - musicoil
  - notation
  - spatial-notation
  - coil
  - relative-before-absolute
  - emergent-analysis
  - form
  - prime-period-theory
related:
  - related/coil-notation.md
  - related/melodic-grammar.md
  - related/spatial-harmony.md
  - uniform-solfege/index.md
  - reference/emergent-analysis.md
  - domains/form.md
  - applications/component-philosophy.md
timestamp: 2026-07-02
---

# MusiCoil

MusiCoil is the spatial notation and compositional environment for Prime
Period Theory. Where Three-Layer Coil Notation is the paper-writable
compaction of PPT ideas, MusiCoil is the full digital expansion — the
environment in which every PPT structural relationship has a geometric
home and can be composed, read, and analysed without decoding a symbol
system.

Version 10 is the current architecture. Three interconnected advances
define it: the separation of temporal and harmonic layers into
independently-seamed Rhythm Coils and Tonal Coils; a fully declarative
inheritance hierarchy with no implicit application state; and a complete
emergent analytical infrastructure in which mark heads, rest spans,
palette spans, interval spans, and ghost marks are read-only geometric
objects computed from composed content.

---

## Core architecture

### The Music Coil as container

A **Music Coil** is the top-level compositional unit — a container for
two independently-seamed layer types. This is the central architectural
departure from earlier versions and from all standard notation systems:
temporal structure and harmonic structure are separated into genuinely
independent layers, each with its own seam logic.

**Rhythm Coils** carry the temporal structure. A Rhythm Coil's period
is the unit of time within which musical events occur. Its circumference
(in ring form) represents that period; arc length is duration. Rhythm
Coils contain rhythm tracks, Rhythm Courses (voice-group containers),
and one or more Tonal Coils as sub-spans.

**Tonal Coils** carry the harmonic context. A Tonal Coil is a sub-span
within a Rhythm Coil's period, carrying the Active Palette, Scale Palette,
and Tonal Palette for its arc of the timeline. Multiple Tonal Coils
within a single Rhythm Coil express harmonic rhythm — the rate at which
harmony changes within a phrase — without forcing a phrase boundary at
each chord change.

This layer separation is the structural encoding of what jazz lead sheet
practice achieves through convention: harmonic rhythm and phrase rhythm
coexist on the same timeline as independent streams. In MusiCoil the
independence is architectural. See [Three-Layer Coil Notation](coil-notation.md)
for the paper-writable surface syntax of the same separation, and
Form as Macro-Periodicity for how this independence
propagates to the level of musical form.

### Seams

A **seam** is a boundary point where declarations take effect. Two types
exist, belonging to their respective layers:

A **tonal seam** marks the boundary between two Tonal Coils within a
Rhythm Coil. A harmonic change is always a tonal seam event. Tonal seams
generate Palette Spans (emergent voice-leading objects) and carry
forward-applying harmonic declarations.

A **rhythm seam** marks the boundary between two Rhythm Coils. A phrase
boundary is a rhythm seam event. Rhythm seams generate Rhythm Spans
(emergent period-transition objects) and carry forward-applying temporal
declarations.

When a tonal seam and a rhythm seam fall at the same angular position —
common at section boundaries — both span types are generated at the same
point, radially separated. A reader can see at a glance whether harmony
changes here, whether phrase structure changes, or both. These are
different events that happen to coincide; MusiCoil keeps them distinct.

---

## The palette system and PPT harmony

MusiCoil's palette system is the direct implementation of PPT's
harmonic hierarchy. Three nested pitch palettes correspond to three
analytical levels:

**Tonal Palette** — the full pitch space available to the coil,
distributed by the active EDO value. In 12-TET this is twelve positions;
in 24-EDO it is twenty-four; any positive integer EDO is valid.

**Scale Palette** — the in-context pitch set: the scale, mode, maqam,
pathet, or any other subset of the Tonal Palette defining the active
modal context. Generates **scale spans** between adjacent points —
the step structure of the scale made visible as geometry. The source
for diatonic path step types.

**Active Palette** — the subset of Tonal Points active in the current
harmonic moment (the chord). Generates the **tonal polygon** through
chord spans connecting adjacent Active Palette points. See
Spatial Harmony for the full account of chord
quality as polygon geometry and the prime-family basis for span thickness.

The three palettes form a visual weight hierarchy: Active Palette at
full weight, Scale Palette at reduced weight, Tonal Palette at further
reduced weight. A musician reading any coil sees three simultaneous
layers of harmonic context — what is harmonically active, what is modally
available, and what is chromatically possible — from the luminosity
distribution of a single object.

### The Tuning Palette and EDO

The **Tuning Palette** defines the pitch grid: EDO (Equal Divisions per
Equivalence Interval), Equivalence Interval (the frequency ratio at which
the pitch cycle repeats, default 2:1), and Tuning System. Any positive
integer EDO is valid. The Equivalence Interval parameter makes non-octave
systems first-class: 2.03:1 for Javanese gamelan slendro, 3:1 for
Bohlen-Pierce. This is PPT's anti-privilege stance toward Western tuning
encoded as an architectural parameter.

All interval ratio calculations reference the active Equivalence Interval.
The tonal polygon's edge lengths and thicknesses — encoding prime-family
interval quality — are computed relative to the active tuning structure,
not hardcoded to 12-TET ratios.

---

## The reference period system

The first Rhythm Coil in an arrangement establishes the **reference
period** — a purely relative temporal unit. All subsequent Rhythm Coil
periods are expressed as ratios against it: 2:1 for a coil twice as long,
3:4 for a coil three-quarters as long. Any rational ratio is valid.

This is the temporal equivalent of the relative-before-absolute principle
(see [Context — Tenets](../context/tenets.md)): absolute clock duration
is a declaration, not an intrinsic property of the period. Tempo is set
at the origin seam or at any subsequent rhythm seam and resolves the
reference period to a specific clock duration. The music is the ratio
structure; the tempo declaration converts it to time.

The reference period system makes odd metre genuinely first-class. A
three-beat metre is a Rhythm Coil with ratio 3:4 relative to a four-beat
reference — or simply the first coil, with all others expressing ratios
relative to it. There is no time signature mechanism, no special
accommodation. The geometry is the metre.

This also dissolves the tie problem: a motivic figure that in standard
notation requires a tie across a barline simply lives inside a single
Rhythm Coil whose length is set to contain the complete figure. The coil
length is the compositional decision about phrase completion.

**Duration as arc.** A mark's arc length encodes its duration as a
proportion of its Rhythm Coil's period. The **mark head** at each
NoteOn position encodes duration as a clockwise arc against the reference
period — a half-arc for half the reference period, a three-quarter arc
for a dotted half equivalent, a nested sub-circle for tuplets. Any
rational proportion is representable without special notation. Duration
is a first-class geometric property, not a secondary symbol.

This directly operationalises the [Metric DuPeriod](../reference/metric-duperiod.md)
framework in notation: each Rhythm Coil occupies a specific position on
the Metric DuPeriod axis, and the arc encoding of duration expresses
the logarithmic period relationships of that axis in spatial form.

---

## The declarative system

Every property of a coil's behaviour and presentation is expressed as a
**glyph declaration** in a unified inheritance hierarchy anchored at the
arrangement's origin seam. There is no implicit application state. Two
users opening the same arrangement see and hear identical results.

The inheritance chain from most general to most specific:

**Origin seam** — baseline declarations from which everything inherits.
Implicit defaults (12-TET, 2:1 equivalence interval, A4=440Hz) render
at reduced weight; explicit declarations render at full weight.

**Seam declarations** — forward-applying overrides at any tonal or
rhythm seam. A modulation glyph at a tonal seam is a key change. A
tempo glyph at a rhythm seam is a tempo marking. All such changes use
the same declarative mechanism.

**Transformation Strip** — persistent declarations scoped to a specific
Music Coil, Rhythm Coil, or Tonal Coil. Independently tetherable and
normalisable.

**Thread-level glyphs** — most local scope, applying to a specific track
or relationship.

Inheritance is strictly substitutional at every level. Most local scope
wins. No additive combining.

### Glyph families

**Arc glyphs** encode scalar values as circumference arcs using the same
geometric vocabulary as mark heads — clockwise for positive/louder/more,
counter-clockwise for negative/softer/less, arc length for magnitude.
Key arc glyphs: Dynamic (replaces the entire pp–ff vocabulary with a
continuous scale), Swing (encodes swing percentage as arc length; makes
swing a visible score element rather than a Feel Palette parameter),
Tempo (relative tempo relationships), Simplification (level 1–5 as arc
length), and the full ADSR amplitude envelope family (Attack, Decay,
Sustain, Release — each a separate arc glyph operating at any scope
from arrangement to thread).

**Pitch envelope arc glyphs** extend the ADSR model into the pitch
dimension: Pitch Attack (initial displacement resolving to nominal —
upward or downward approach), Pitch Release (departure from nominal
toward NoteOff — fall-off or upward bend), Vibrato (depth as arc length,
rate as nested sub-circle ratio), Pitch Bend (smooth pitch transition
between marks on the same track). These replace pitch bend events in the
notation with geometric declarations in the same vocabulary as all other
glyphs.

**Qualitative glyphs** encode categorical properties: Step type (chromatic,
diatonic, harmonic path traversal), Modulation (tonal centre shift as
interval at a tonal seam).

---

## The emergent analytical infrastructure

MusiCoil distinguishes between authored content (placed by a composer)
and emergent objects (computed from authored content, never placed,
always read-only). The emergent layer is a continuous analytical portrait
of the arrangement at every zoom level. See
Emergent Analysis for the full
theoretical account of this distinction.

**Mark heads** — at every NoteOn, a clockwise arc encoding duration as
a ratio against the reference period. Dot inside for point events
(staccato). No mark head for duration unspecified (sketch state).
Overflow ring for durations exceeding one reference period. The mark
head is always present and is the natural compacted form of the mark
as zoom decreases.

**Rest spans** — the arc between a NoteOff and the next NoteOn on the
same track. Silence is a positive visual object, carrying its own mark
head encoding rest duration. Rendered at reduced visual weight. Never
authored.

**Chord spans and the tonal polygon** — spans between adjacent Active
Palette points on the Tonal Course, forming the polygon whose shape
encodes chord quality. Span thickness encodes interval dissonance
relative to active prime-family ratios. See Spatial Harmony.

**Scale spans** — spans between adjacent Scale Palette points, encoding
scale step widths. Render at reduced visual weight relative to chord
spans.

**Track interval spans** — perpendicular spans between adjacent rhythm
tracks within a Rhythm Course, encoding the fixed intervallic distance
between neighbouring tonal identities. Always present; form-invariant
(perpendicular to track direction in both ring and linear form). The
stable harmonic infrastructure of the arrangement.

**Mark interval spans** — spans connecting temporally adjacent NoteOn
positions across tracks, encoding melodic intervals actually traversed.
View-scoped. Many-to-many adjacency resolved by pitch proximity. Makes
voice leading continuously visible without a separate analytical act.

**Palette spans** — spans on the Tonal Course at every tonal seam,
encoding the absolute voice-leading motion from one Tonal Coil to the
next. Always present at every tonal seam; null (near-zero) when the
chord does not change. Carries Palette Span Points — one per palette
position — with size (shift magnitude), direction indicator, and octave
displacement marker. Four geometric properties encode different
aspects of the transition: band length (aggregate shift magnitude),
curvature (number of voices in simultaneous motion), luminosity (overall
register), thickness (octave displacement / inversion). The null Palette
Span at a same-chord seam is still always present — the Tonal Course
is fully populated.

**Rhythm spans** — spans at every Rhythm Coil seam encoding the
transition between two Rhythm Coil states: length ratio change and
tempo change. Null when no change occurs.

**Ghost marks and ghost paths** — when a path's pitch content intersects
a rhythm track's tonal identity at some angular position, a ghost mark
appears on that track at that position, connected to the corresponding
path mark by a thread. A ghost path extends forward from the ghost mark
showing the remaining path trajectory. Both are read-only and render
at reduced visual weight. Ghost marks participate in mark interval span
generation, making ornamental pitch content visible in the main track
coordinate system.

**Path interval spans** — spans between consecutive path marks, encoding
step-by-step intervallic movement through the same colour vocabulary as
all other interval spans.

---

## Paths: ornament and glissando unified

A **path** is a sequence of marks in sub-track position, attached to
one or two anchor marks on a rhythm track. Three configurations:

**Leading path** — leads into an anchor mark. Covers portamento
approaches, anticipations, any pitch gesture that arrives at a note.

**Trailing path** — extends from an anchor mark. Covers trills, turns,
mordents, fall-offs, any pitch gesture departing from a note.

**Connecting path** — runs between two anchor marks. Covers glissandi
and any connecting pitch gesture.

The ornament / glissando distinction was always positional rather than
structural — the path expresses this by anchor configuration rather than
by type. All standard ornament figures (trill, mordent, turn, tremolo)
emerge from the combination of **step type glyph** (chromatic / diatonic
/ harmonic traversal through the Tonal, Scale, or Active Palette) and
**direction** (ascending, descending, ascending-descending,
descending-ascending) without those figure names needing to exist in
the system's vocabulary. The vocabulary is the geometry.

---

## Normalisation and the arrangement graph

The arrangement is a graph of objects connected by tether threads. Music
Coils, Rhythm Coils, Tonal Coils, palette objects, Transformation Strips,
and Lyric Tracks are nodes; tether threads are edges.

**Normalisation** is the user-driven practice of defining a shared object
once and tethering it to multiple coils that reference it. A Scale Palette
tethered to twelve coils is one node with twelve incoming edges; when the
scale changes, one object changes and twelve coils update. Normalisation
is always explicit — the system never detects shared content and silently
merges it. The tether is the structural declaration of shared identity.

When an object is tethered externally, it fully replaces the local
definition for that scope. Complete substitution, no inheritance with
overrides.

The **normalisation visibility toggle** renders all active tether threads
as visible connectors. A Scale Palette shared across a section appears
as a single persistent ring with threads radiating to each coil — the
modal architecture of the arrangement made visible as first-class geometry
rather than as redundant annotation at every system.

**Form as graph topology.** Formal structure (AABA, ABA, strophic, rondo,
through-composed) is readable from the arrangement graph without hearing
the arrangement — incoming edge count per normalised node encodes formal
weight; the arrangement sequence of node references gives the formal
label; shared versus local Tonal Course nodes encode harmonic variation
within formal repetition. See Form as Macro-Periodicity
for the full account.

The **definition view** shows unique coil definitions and their reference
relationships. The **arrangement view** (splat operation) resolves all
references into a linear sequence of concrete joined instances. Both
are non-destructive view toggles of the same underlying graph.

---

## Simplification and pedagogical scaffolding

Simplification is a global declaration expressed as an arc glyph in the
inheritance hierarchy. It operates simultaneously on visual rendering
and playback output. Simplified tracks render at reduced visual weight
rather than disappearing — the student sees the full arrangement while
playing a subset.

| Level | Content |
|---|---|
| 1 — Melody | Melody line decorated tracks only |
| 2 — Melody + Bass | Adds lowest active harmony track |
| 3 — Melody + Chord | Adds essential Active Palette tones as long marks |
| 4 — Melody + Arpeggio | Adds Active Palette tones as arpeggiated figures |
| 5 — Full | Complete arrangement |

The simplification ladder is the notational implementation of the
progressive complexity principle in [Pedagogy](../pedagogy/index.md).
The same arrangement serves a beginner (Level 1) and an advanced
student (Level 5); only the layer of responsibility changes. Level 1
requires melody line declarations — a composer obligation for original
works that makes compositional intent a first-class score property.

Play-along feedback operates on the active simplification level. See
[Play-Along Feedback](../applications/play-along.md) for the three
feedback models.

---

## Relationship to Three-Layer Coil Notation

The compaction pipeline from the original stub is preserved and expanded:

> Sketch on paper (Three-Layer Coil Notation) → expand digitally
> (MusiCoil representation) → normalise into Coils → reference
> compositionally

Three-Layer Coil Notation is the paper-writable surface syntax —
the compaction of MusiCoil's digital representation into mark-able
form. MusiCoil is the expansion: every concept in Three-Layer Coil
Notation has a full digital counterpart in MusiCoil with emergent
analytical infrastructure, declarative glyphs, and normalisation
relationships that paper cannot express.

The barline removal principle is one consequence of this: Coil
boundaries replace barlines entirely. A Coil ends where a musical
phrase ends, regardless of metrical position. Phrase structure and
metric structure are decoupled. In MusiCoil terms, this is the rhythm
seam / tonal seam independence: a phrase boundary (rhythm seam) and
a harmonic boundary (tonal seam) are different events in different
layers, neither constrained by the other.

---

## Projection and output

MusiCoil is a relative structure. Output is always the projection of
that structure through a **Projection Profile** specifying which
declarative layers are included. No output format is privileged.

MIDI — scale degrees plus tonal centre plus register resolve to
absolute note numbers; angular position plus arc length plus tempo plus
swing resolve to timestamps; ADSR arc glyphs produce velocity envelope
and controller data; pitch envelope arc glyphs produce pitch bend data.

Staff notation — resolves via MusicXML for import into standard notation
software. Melody line declarations drive voice separation. This is one
projection among equals.

Visual assets — SVG, animated video loop, QR code embedding the full
arrangement data for scan-to-open.

---

## See also

- [Three-Layer Coil Notation](coil-notation.md) — the paper-writable
  compaction layer; surface syntax for the same structural model
- [Melodic Grammar](melodic-grammar.md) — the melodic layer convention,
  inheriting MusiCoil node/path concepts
- Spatial Harmony — chord quality as geometry;
  tonal polygon and palette span theory
- Emergent Analysis — the authored
  vs. computed distinction; the read-only analytical layer
- Form as Macro-Periodicity — arrangement graph
  topology as formal analysis
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate
  system that the reference period system operationalises
- [Uniform Solfège](../uniform-solfege/index.md) — the symbol vocabulary
  for pitch labels within MusiCoil's Label Palette
- [Component Philosophy](../applications/component-philosophy.md) — the
  PPT component library's architectural expression of the same
  pitch-rhythm unification principle
- [Play-Along Feedback](../applications/play-along.md) — the three
  feedback models operating on simplification levels
- [PPT Components](../implementations/ppt-components.md) — current
  canonical implementation status