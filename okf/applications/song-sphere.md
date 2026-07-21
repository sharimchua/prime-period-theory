---
type: concept
title: Self-Powered PPT Native Instrument — Concept Note
description: >
  Concept note and design rationale for a self-powered, digital chorded
  instrument (working name Song Sphere) built on PPT principles.
tags:
  - instrument-design
  - hardware
  - prime-period-theory
  - uniform-solfege
  - microtonality
status: stable
timestamp: 2026-07-20
---

# Self-Powered PPT Native Instrument — Concept Note

## Origin problem

Existing "easy access" harmony instruments force a trade-off:

- **Kalimba** — real-time expressive control, but little harmonic movement (near-fixed diatonic set, mostly monophonic).
- **Tanpura / drone instruments** — sustained harmonic richness, but static; a reference, not something you play changes on.
- **Autoharp / Omnichord** — solves harmonic movement with near-zero technique, but chord vocabulary is locked to fixed Western major/minor presets.

None let one person experience real harmonic *motion* — chord to chord — without either a keyboard's worth of technique, years on guitar, or being boxed into 12-TET triads.

## Core architecture: three roles

Modeled on the bagpipe, where power, sound production, and control are already separable in an acoustic instrument:

| Role | Bagpipe analogue | This instrument |
|---|---|---|
| **Power** | Blowing | Squeeze / grip (gross motor, large muscle groups) |
| **Storage / production** | Bag | Capacitor buffer + synth engine, decoupled in time from the power action |
| **Control** | Fingered holes | Chorded buttons/frets (fine motor, independent finger articulation) |

The separation of palm/grip (power) from fingertip (control) is biomechanically sound — different muscle groups and joints, so simultaneous squeeze-and-finger action is plausible rather than self-competing.

Power generation is deliberately **disconnected** from sound production: charge accumulates in a buffer; output timing and content depend only on button/fret state at the moment of triggering, not on power state.

## Why digital, not mechanical

An acoustic instrument's tuning is physically fixed by its construction (reed length, string length, fret placement). Retuning means rebuilding. Here, the same physical fingering can output entirely different tuning systems in software — EDO, JI, or PPT's prime-family framework — with zero mechanical change. This is the central value proposition: a category of tuning flexibility no acoustic or mechanical instrument can offer, achieved by treating chord *voicing* (finger position) and chord *tuning/colour* (software mapping) as independent layers. A natural first mapping: prime families (Du/Tri/Qui/Sep/Undec) as selectable harmonic colours in place of fixed major/minor triads.

## Two output modes (acoustic-electric guitar model)

- **Unplugged / intimate mode**: internal transducer driving a small resonant soundboard or membrane, not a bare speaker cone. The board's own resonant modes colour the sound the way a guitar top does — natural, physically-informed timbre "for free," at parlour-guitar volume. This is the default, always-ready mode — no charging, no plugging in.
- **Plugged / performance mode**: line-out into an amp or interface, same model as an acoustic-electric guitar. Removes the volume ceiling of the internal transducer; routes into a wider production chain (Coil, StoryStreams, etc.).

Loudness, not digital processing, is the real power cost — compute (fret sensing, synth engine, tuning tables) is negligible by comparison.

## Power budget (rough working numbers, unvalidated)

- Squeeze energy in: ~1.25–2.5 J per firm squeeze (50–100N over ~2.5cm travel)
- Conversion losses (gearing + generator + regulation): ~40% efficient → ~0.5–1 J usable
- Capacitor: ~0.08–0.2 F at 3.3–5V logic rail
- Compute + sensing load: ~20–50mW continuous — effectively free
- **Internal transducer/soundboard mode**: ~230mW–1W → single squeeze good for ~4–5s at parlour volume
- **Line-out only mode**: ~30–50mW → single squeeze good for roughly 60–90+ seconds of continuous play

Biggest unvalidated variable: real low-speed hand-generator conversion efficiency (the 40% figure is a plausible estimate, not a measurement). This should be the first thing bench-tested, since it scales every other number in the budget.

## Design principle: don't occupy channels the body already uses

Breath was considered as a possible expressive input (ocarina/EWI-style breath sensor) and rejected. Breath and voice share a physiological pathway — an instrument that requires breath control competes directly with singing rather than augmenting it. Power and control for this instrument should route entirely through channels otherwise idle during vocalising: grip/squeeze for power, fingers for control. This keeps the mouth and voice fully free, so the instrument can be played *while* singing — chordal accompaniment under a vocal line, from the hands alone. General principle for future iteration: never require a channel the body already uses for primary musical expression.

## Design philosophy note

The appeal case: an instrument for people who don't like electronic instruments — because power is invisible (no charging, no plugging in required for daily use), the unplugged mode is genuinely satisfying on its own, and the "plugged in" option is additive rather than a dependency. The three-role architecture (power / storage / control) is the invariant; specific form factors (handheld sphere with bilateral buttons, one-handed clench device, etc.) are just different hardware realisations of the same three sockets, and multiple forms could coexist.

## Sound envelope: pluck-and-decay model

Mental model: a guitar pluck (or hammer-on) — discrete energy input, then natural decay, not an abrupt stop. Achievable without giving up software control over timbre: the MCU reads remaining capacitor charge in real time and uses it as an input to the amplitude envelope. This keeps the decay *curve* fully designed (exponential, percussive, sustained, etc. — whatever tests best) while the overall arc still genuinely tracks energy remaining, so it reads as physical rather than arbitrary. Bonus: squeeze force → charge delivered could map to pluck dynamics (harder squeeze = louder/longer decay), giving touch-sensitive dynamics similar to an acoustic string instrument.

## Working name

**Song Sphere** — placeholder, no conflicting product/trademark use found in casual search. Worth a proper trademark check (IP Australia ATMOSS) and domain/handle check before committing commercially.

## Prior art / inspirations (not direct fits)

- **Artiphon Orba** — spherical handheld, capacitive touch pads + accelerometer/gyroscope for gesture control (tap, press, tilt, shake, spin, vibrato). Closest existing form-factor precedent. Gaps vs. this project: rechargeable (not self-powered), fixed/sample-based tuning (not retunable to arbitrary systems).
- **Roli Seaboard / LinnStrument / isomorphic hex keyboards (Lumatone etc.)** — continuous-pitch or isomorphic grid controllers, popular in the microtonal/xenharmonic community, often paired with Scala tuning files. Considered and set aside: these encode pitch as *spatial location* (consistent geometric distance = interval). PPT's solfège+diacritic model is a *grammar* (anchor + modification), not a coordinate system, so a spatial grid doesn't match how PPT is structured, even though it's a legitimate and well-precedented approach for other tuning-flexible playing.
- **Near-term parallel path**: an MPE controller (Seaboard/LinnStrument) plus a Scala file encoding PPT's prime-family ratios would let PPT tunings be heard and performed today, on existing hardware, well ahead of any Song Sphere prototype — worth doing in parallel to validate how PPT intervals feel to perform.

## Control-layer architecture

**Design philosophy**: fingers define pitch/harmony in *micro-space* (discrete — which syllable, which register); expression controls generate the *macro-space* waveform (continuous — when a note fires, how hard, how it decays, its rhythm over time). Rhythm is not a third parallel mode — it emerges from the temporal pattern of expression-control use, governed by the same rhythmic grammar already developed for Coil notation.

**Cardinal + rocker pitch selection**: four trigger fingers per hand address the cardinal solfège points Do/Me/Fi/La (0/3/6/9 semitones — evenly spaced, tiling the chromatic circle with no gaps or overlaps). A paired ±1 rocker (thumb or pinky, whichever is free) shifts the held cardinal to its flat or sharp neighbour, reaching all 12 solfège syllables from 4 triggers + 1 rocker. Cardinals chosen partly for grip ergonomics under simultaneous modification (e.g. Me preferred over Mi as the quartal/modifier-adjacent syllable, since Mi is more awkward to hold while also operating a rocker).

**No separate modes needed**: melody, harmony, and (tentatively) rhythm all reduce to the same input — fingering always selects a full chromatic pitch/chord anchor. The *button* determines whether the full implied chord sounds (harmony) or the wheel isolates a single voice (melody becomes the degenerate case of harmony, not a separate mode). This removes any need for a mode-switch control.

**Register via press depth**: cardinal triggers are analogue (gamepad-style), supporting half-press (lower register) and full-press (upper register) by default. This gives real open/spread voicing (e.g. one hand half-press Do + other hand full-press Mi = a spread triad across two octaves), not just a fuller chord. Velocity/dynamics is a separate, continuous reading layered within each press state (analogous to a synth key reporting both "which key" and "how hard"), not conflated with register.

**Expression button = onset + latch**: a light articulation triggers a note/chord (guitar-pluck model — discrete onset, natural decay, see envelope section above). A full press latches it as a sustained, independent voice, freeing the fingering hand to move on to the next chord/note while the previous one keeps sounding — analogous to a live-looper "layer while the last layer still plays," but built into a single sustained gesture rather than a separate record/loop step. A light touch on an already-latched expression button releases everything latched on that button. Mirrored per hand — either hand's chord can be locked in while the other plays independently over it (e.g. hold a chord, sing or play melody over it with the other hand — see body-channel principle above).

**Accumulate vs. replace**: default behaviour is *replace* — full-press a new chord, it takes over from the last one (e.g. playing a I–IV–V–vi progression one chord at a time on one hand, cardinal + rocker per chord). *Accumulate* (stacking additional notes onto an already-latched button without clearing it) is an optional, non-default technique for building up chords/voicings across sequential gestures.

**Scroll wheels (thumb-adjacent, one per hand)**: directional cursor through the currently-held chord's tone set — analogous to a guitar strum/arpeggio, direction = arpeggio direction. Right wheel conventionally scoped to the bass/root voice, left wheel to the upper voicing; reversing direction retraces the ordered sequence (doesn't repeat a note — repetition of the *same* note is instead the expression button's job, since wheel = cursor position, button = strike/re-articulation, two orthogonal primitives). Two independently-steppable wheels enable Alberti-bass-style picking patterns and other broken-chord figures without needing per-pattern pre-programming — the player shapes the pattern by choosing which chord tones live in which wheel's register via fingering. "Inward/outward" (toward/away from sphere centre) is likely clearer directional language than "left/right," which is ambiguous across mirrored hands. Open question: how a chord with more than 3 tones (7ths, PPT extensions beyond a triad) distributes across two wheels — fixed hierarchy vs. player-configurable.

**Beginner floor**: full-press an expression button with a fingered cardinal (no rocker, no wheel) sounds a complete major-triad-default chord. This alone is the entire beginner instrument — everything else (rocker modifiers, wheels, latch stacking, timing windows, role-targeting) is strictly additive, never required. Matches the "harmony-only should always be possible" and depth-before-breadth design goals.

**Timing windows around the expression event** — the digital advantage a mechanical instrument structurally can't offer, used deliberately rather than left ambiguous:
- *Pre-onset window*: two hands' fingerings arriving within a short window (rough target ~150–200ms, needs playtesting) are read as simultaneous chord construction, order-independent — the equivalent of forming a guitar chord shape before strumming. Outside that window, later arrivals are sequential/deliberate rather than part of the same chord.
- *Anchor determination*: when two hands each finger a symbol for one chord, earliest arrival within the simultaneity window sets the anchor (root); the other hand's symbol is the modifier. This uses the same underlying rule as the simultaneity window rather than being a separate timing system.
- *Post-onset window*: modifiers arriving shortly *after* express has already fired are read as live modification of the sounding note/chord rather than a new event. Short window = ornament (crush note, e.g. voicing Me then applying the sharp rocker immediately after expressing bends m3→M3, a real idiomatic ornament in blues/gospel/country playing). Long or unbounded window = deliberate live harmonic morph (e.g. a held major triad recoloured to minor mid-drone by bringing in a modifier from the other hand well after onset). Both are the same mechanism at different timescales, not different features. Speed of arrival within the window could map to bend/slide *speed* (fast flick vs. slow deliberate slide) — untested, needs playtesting to see if it reads as natural or fiddly under real finger speed.
- By default, post-onset articulation applies to *all* currently-latched notes (e.g. a global semitone shift via the rocker acts like a capo — moves an entire held chord shape while preserving its internal intervals, the "barre chord slide" move that's easy on guitar and impossible on piano because piano fingerings aren't uniform across all twelve semitones). The other hand's cardinal can be used post-onset to *target* a specific chord tone instead of shifting everything — see role-targeting below. Open question: when a note already carries an individual post-onset modification (e.g. a crush) and a global transpose is then applied on top, does the individual modification travel with the transpose (stays "sticky") or reset? Needs a documented default rule.

**Role-targeting (post-onset, cross-hand)**: after an express event, the four cardinal positions on the *opposite* hand can be reused — not as pitches, but as role labels within the already-sounding chord (Do = root, Me = 3rd, Fi = 5th, La = 7th), letting a player target and bend a specific chord tone (e.g. just the 3rd) rather than shifting the whole chord. This reuses the same four physical controls and finger positions a player already knows from pitch-fingering, just reinterpreted by context (pre- vs. post-express) — no new control needed. Disambiguation from "add a new note": a bare cardinal touch in the post-onset window (no full press) reads as a targeting pointer; a full press would still add a genuinely new independent voice. Open question: does "3rd" etc. mean "the middle-ish note of whatever chord is currently latched" generically, or does role-targeting need an extended scheme once PPT chords go beyond simple triads/sevenths — needs documenting once PPT's extended-chord vocabulary is finalised.

**Hemisphere twist — parallel instrument states**: rotating the two hemispheres out of alignment doesn't alter pitch — it switches which of five addressable states the hands are playing in: **Joined** (default, aligned — both hands' cross-hand behaviours active: anchor determination, role-targeting, etc.), **SharpL/SharpR** and **FlatL/FlatR** (twisted clockwise or counterclockwise — each hand becomes a fully independent one-handed instrument, identical in what every control does, just with no "other hand" to interact with). Sharp/Flat naming for the twist directions is consistent with, not a collision with, existing PPT vocabulary: the base solfège glyph is already modified directionally (loop right = sharp/Ra, loop left = flat/Ti), so "sharp/flat" in PPT was always a directional concept, not a pitch-only label — twist reuses the same directional grammar rather than introducing a parallel one. Because each state is independently latchable (same latch-and-move-on mechanism used for hand reassignment), a player can build up to 6 simultaneous sustained voices sequentially: latch both hands in Joined (2), twist to Sharp and latch both hands there (2 more), twist to Flat and latch both hands there (2 more) — without needing to hold multiple twist positions at once. Open question: does Joined state's cross-hand grammar (anchor/modifier determination, post-onset role-targeting) specifically depend on alignment, i.e. is twist effectively the on/off switch for two-hand interaction as well as an instrument-slot selector?

**Other open ergonomic/sensing directions raised, not yet resolved**:
- Palm pressure sensor for percussive articulation (slap/tap transient, distinct channel from finger-based pitch, akin to percussive-guitar technique)
- Onboard gyroscope/accelerometer for pitch bend and hemisphere-twist gestures (precedented directly by Orba's tilt/shake/spin vocabulary)
- Velocity (rate of press travel) vs. sustained pressure are different physical quantities with different sensing hardware implications (encoder/accelerometer vs. FSR) and different musical uses (onset dynamics vs. ongoing shaping of a held note) — likely want both eventually, velocity-at-onset is the more essential to get right first given the pluck-and-decay envelope model

**Worked examples** (useful as reference/test cases for any future prototype):
- I–IV–V–vi (1-4-5-6) pop progression, one hand: Do+express (I) → Fi+flat+express, resolving to IV → Fi+sharp+express, resolving to V → La on one hand + Me on the other (minor modifier) + express (vi, minor requires the modifier since a bare cardinal defaults to major).
- Crush note: voice Me (minor 3rd), express, then apply the sharp rocker within the fast end of the post-onset window → bends m3 to M3, idiomatic blues/gospel ornament.
- DoMeFiLa fingered as four simultaneous pitches (no modifiers) produces a symmetric stack of minor thirds (0-3-6-9 semitones) — the same interval structure as a diminished seventh chord, not a quartal voicing. A true quartal voicing would need modifiers.

## Open questions / next steps

- Bench-test real hand-squeeze-speed generator efficiency
- Prototype and listen-test: soundboard material and thickness for the internal-transducer mode
- Decide control model: one-shot "charge then trigger" (music-box-like) vs. continuous reservoir with squeeze cadence as an expressive input (accordion-like, closer to breath control)
- Physical mockup of squeeze travel/force on a candidate form factor before committing to a generator mechanism
- Playtest pre-/post-onset window lengths (target ~150-200ms starting point) for simultaneity, ornament, and morph to feel right rather than fussy or unpredictable
- Document sticky-vs-reset rule for individually modified notes under a global transpose
- Extend role-targeting scheme for PPT chords beyond simple triads/sevenths once that vocabulary is finalised
- Decide fixed vs. player-configurable register distribution across the two scroll wheels for chords with more than 3 tones
- Get hands-on with an Orba to test tilt/gyro pitch-bend and gesture ergonomics before designing this project's own version
