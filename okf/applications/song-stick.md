---
type: concept
title: Song Stick Instrument — Concept Note
description: >
  Concept note and design rationale for a guitar-shaped variant of the
  self-powered chorded digital instrument (Song Stick).
tags:
  - instrument-design
  - hardware
  - prime-period-theory
  - uniform-solfege
  - microtonality
timestamp: 2026-07-21
---

# Song Stick — Concept Note

Guitar-shaped variant of the self-powered chorded instrument concept (see `song-sphere.md` for the shared origin problem, three-role architecture, power/storage/output principles, and the "don't occupy channels the body already uses" design principle — all of which apply here too).

## Form factor

Where Song Sphere realises the concept as a handheld ball played bimanually with mirrored controls, Song Stick realises the same underlying architecture (fingers = pitch/micro-space, expression/lever controls = onset/rhythm/macro-space) as something closer to a guitar in shape and playing posture.

## Controls

- **Fretting hand**: four cardinals (Do/Me/Fi/La) on the front "fretboard" face, same evenly-spaced chromatic-tiling logic as Song Sphere. Sharp/flat modifier button under the thumb (same PPT-directional Sharp/Flat vocabulary as the glyph system — loop-right/loop-left — not a separate naming scheme).
- **Strumming hand**: a lever, middle finger through a ring (shotgun-reload-action analogy), moves toward/away from the body across **six notches** (string-analogues). Crossing a notch produces sound depending on register/pattern — direct guitar strum/pick analogy.
- **Power generation**: lever motion itself generates power — continuous trickle-charge during normal play, closer to a self-winding watch's automatic rotor than Song Sphere's discrete squeeze-then-spend cycle. Confirmed: motion generates power even during silent/disengaged repositioning (see below), so charging is entirely passive and never requires separate deliberate action.
- **Proximity axis (toward/away from body)**: has mechanical "give," and its function is **silent repositioning / register reset**, not a mute gate. Disengaging lets the player move the lever back across notches without triggering sound — the same function as a guitarist lifting a pick off the strings to reposition for the next stroke, avoiding being locked into strict alternating up/down strum motion.
- **Notch tactile feedback**: mechanical grooves/detents are likely sufficient — passive, no power or electronics cost, reliable physical confirmation of position for playing by feel.
- **Mute button**: thumb-operated, near the strumming hand.

## Open questions

- Does disengaged (silent) lever travel still pass through physical notch detents (i.e. is muting purely an audio-logic gate over an unchanged physical feel), or does disengaging also change the lever's physical travel/feel?
- Do all six notches always re-articulate whatever's currently fretted (simple, direct 1:1 strum analogy), or does each notch address something more specific — e.g. a register-scoped voice within the held chord, producing a genuine spread voicing per strum rather than repetition? (Same open question as Song Sphere's two scroll wheels and their register distribution.)

## Mute / Express pairing

Strumming hand gets a thumb-operated pair alongside the lever: **Mute** (immediate silence of active output, palm-mute analogy) and **Express**. Configurable/context-dependent role across variants rather than fixed identically: on Song Sphere, Express is the primary voice-trigger/latch, since the squeeze gesture has no other job. On Song Stick, the lever already does double duty (power generation + sound production as it crosses notches), so Express as *also* the primary trigger would be a third job stacked onto an already-busy gesture — instead, **Express on Song Stick functions as a mode button arming post-onset expression** (crush/slide/role-targeting, same post-onset-window mechanism as Song Sphere), governing what happens to sound already triggered by the lever rather than competing with the lever for triggering duty. General design principle: which control does which job should follow from what's already doing work in that gesture in a given variant, not be forced identical across variants for its own sake. Mute and Express are independent rather than mutually exclusive — a player could have a muted strum happening over a still-sounding latched drone.

**Resulting control layout**: fretting hand = cardinals + sharp/flat rocker (what sounds — pitch/chord, micro-space); strumming hand = lever/notches + mute/express pair (when and how it sounds, plus post-onset expression — macro-space/articulation). Mirrors the micro/macro-space split established for Song Sphere, distributed across hands differently.

## Expression: gyroscope / accelerometer

Onboard IMU (gyroscope + accelerometer) as continuous expression input, alongside the lever/notch mechanism — power cost negligible (single-digit mW) against the strum-generated power budget.

- **Tilt (gyroscope, sustained angle)**: neck angle mapped to a continuous, held parameter — pitch bend depth, or filter/brightness — akin to a wah pedal or held whammy bar position.
- **Shake (accelerometer, oscillating motion)**: quick back-and-forth motion mapped to vibrato rate/depth, an electronic equivalent of finger vibrato performed with the whole instrument.
- **Sudden accelerometer spike**: a sharp jolt/flick could trigger a one-off effect (e.g. a quick pitch drop, "dive-bomb" style), distinct from sustained tilt.

**Open problem**: the strumming lever's own motion will register on an accelerometer, since normal play is continuous hand movement (also the power source). Deliberate expressive shake/tilt needs to be separated from ordinary strum vibration — likely via reading gyroscope/sustained-orientation rather than raw accelerometer shake, or filtering by gesture frequency range distinct from strum cadence. Needs real bench-testing with the lever in motion before assuming clean separation is achievable.

## Left/right-handed reconfigurability

Because the "strings" are software-addressed notches read by sensors (not physical strings under asymmetric tension/order like an acoustic guitar), handedness support is likely much simpler here than on a real instrument — no physical restringing or mirrored build should be needed.

**Proposed approach**: an orientation sensor (simple accelerometer, or even a physical flip-switch) detects how the stick is being held, and software remaps notch numbering (which notch = high vs. low register) and cardinal-to-finger mapping accordingly. Physical grooves/detents stay fixed; only their logical meaning flips. This avoids needing any internal mechanism that physically reverses a track or notch order.

Two distinct physical actions were raised and should likely be treated as separate configuration axes rather than conflated into one "rotate around the middle" gesture:

1. **Long-axis spin** — the stick rotates along its length, so cardinal positions that faced one way now face the other. Relevant if the fretting hand approaches from a different angle when held reversed.
2. **End-for-end swap** — the two ends (cardinal/fretting end vs. lever/strumming end) trade which hand holds which. Relevant for players who want the more actively energetic role (the lever/strum) in their dominant hand specifically, independent of which way the stick is spun along its axis.

Both should be solvable via the same sensor-detects-orientation/software-remaps principle; worth confirming during prototyping whether one combined sensor reading can disambiguate both axes, or whether two independent signals are needed.

## Relationship to Song Sphere

Same underlying three-role architecture and pitch/chord grammar (cardinal + rocker, PPT-directional sharp/flat, micro/macro-space split). Differences are primarily ergonomic: Song Stick trades Song Sphere's bimanual mirrored-hand symmetry and hemisphere-twist parallel-instrument mechanism for a single continuous strum gesture and a guitar-like posture, which may suit players coming from guitar technique more directly. Worth keeping both variants live rather than converging early — they may end up serving different player preferences rather than one superseding the other.
