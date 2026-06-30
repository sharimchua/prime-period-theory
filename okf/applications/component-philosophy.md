---
type: concept
title: Component Philosophy — One Primitive, Two Domains
description: >
  The design philosophy behind the PPT component library: a single
  Period primitive drives both pitch-space and rhythmic-space
  representations, embodying PPT's core thesis that pitch and rhythm
  are the same structure at different timescales. Composition over
  configuration as the architectural principle.
tags:
  - applications
  - components
  - design-philosophy
  - periodicity
  - prime-period-theory
timestamp: 2026-06-30
---

# Component Philosophy — One Primitive, Two Domains

## The central design decision

The PPT component library is built around a single foundational
primitive: the `<ppt-period>` container. This is not an implementation
convenience — it is a direct architectural expression of PPT's core
thesis.

The thesis: pitch and rhythm are the same phenomenon — periodic
recurrence — operating at different timescales. If this is true, then
a software primitive designed to represent "a period of some kind" should
work equally well for a pitch-class period (the twelve chromatic
positions arranged in an octave) and a rhythmic period (four beats
arranged in a bar). The same container, the same auto-positioning logic,
the same step components — only the semantic content of each step
differs.

The Tonal Clock (twelve chromatic pitch positions on a circular period)
and the Metronome (four beats on a circular period with a sequencer
that advances through them at a tempo-driven rate) are both compositions
of `<ppt-period>` with `<ppt-period-step-circle>` children. They look
similar because they *are* similar — structurally, they are the same
object. The period is twelve steps in one case and four in the other.
The interpretation of each step (pitch class vs. beat position) is
supplied by the content, not by the container.

This is PPT's thesis made executable. A component library that required
a separate "TonalClock" and "Metronome" component — two different
primitives for what PPT claims is one structure — would be
architecturally contradicting the theory it is meant to demonstrate.

## Composition over configuration

The second design principle follows directly from the first. No single
component is "the tonal clock" or "the metronome" — these are
*compositions* of atomic components. The tonal clock is a period
container configured with twelve pitch-labelled, colour-coded step
components. The metronome is a period container configured with beat-
labelled steps and a sequencer component that drives their timing.

This means the component library is not a collection of music theory
tools with fixed meanings. It is a vocabulary of structural primitives
from which a tool builder can compose any periodic structure they need:
a pentatonic clock (five steps), a polyrhythmic display (two nested
periods with different step counts), a Metric DuPeriod navigator (a
period scaled logarithmically across the full pitch-rhythm axis).

The design constraint this places on component authors: every component
must be genuinely atomic. A component that encodes the assumption "this
is for pitch" or "this is for rhythm" is too large. It has already made
a domain choice that the composition layer should make.

## Declarative geometry

The third principle: geometry should emerge from structure, not from
layout arithmetic. A `<ppt-period>` container with twelve children
positions them at equal angles automatically — the twelve positions of
the tonal clock emerge from the number of children, not from twelve
explicit coordinate calculations. A `<ppt-period>` with five children
produces a pentatonic arrangement without any code change.

This mirrors the emergent analysis principle in the OKF
(Emergent Analysis): the geometry
is a consequence of the structure, not a separately specified overlay.
In the notation system, a mark head emerges from the mark's duration.
In the component library, the step positions emerge from the step count.
Both encode the same design commitment: structure should be intrinsically
visible, not manually annotated.

## The EventBus pattern: declarative interaction

The PPT component library uses a shared EventBus pattern for interaction
between components. A control (a play toggle, a tempo slider) emits
a named event; a component (the sequencer) declares which events it
listens for via a `listen-id` attribute. The binding is purely in HTML
— no JavaScript event wiring is required.

This pattern embodies the declarative principle from MusiCoil's fully
declarative model: every property of a component's behaviour is expressed
as a declaration in the markup, not in imperative code. Two users opening
the same HTML see and hear identical results, because all behaviour is
declared in the markup rather than configured in application state.

The pedagogical consequence: a learner or educator can modify a component
composition — changing the tempo, adjusting the step count, rewiring
which controls drive which components — by editing the HTML directly,
without understanding JavaScript. The system is learnable at the markup
level.

## Relationship to the Metric DuPeriod

The component architecture maps directly onto the Metric DuPeriod axis.
A `<ppt-period>` represents a specific period length — a specific position
on the Metric DuPeriod axis. Its steps divide that period into equal
sub-periods. Nesting one `<ppt-period>` inside another represents a
sub-period within a parent period — exactly the relationship between
a beat and a bar, or between a bar and a phrase.

A complete PPT-native tool — a full notation environment, a transcription
workspace, a cross-domain ratio visualiser — would be a composition of
nested `<ppt-period>` containers at different Metric DuPeriod positions,
from the micro (individual note periods, Metric DuPeriod −5 to 0) through
the macro (phrase and form periods, Metric DuPeriod +8 to +14). The
component library is designed to make this composition tractable.

## See also

- [Periodicity](../foundations/periodicity.md) — the theoretical basis
  for treating pitch and rhythm with the same primitive
- [Metric DuPeriod](../reference/metric-duperiod.md) — the coordinate
  system that the component nesting hierarchy maps onto
- Emergent Analysis — the parallel
  principle in notation: structure generates its own analytical portrait
- [PPT Components](../implementations/ppt-components.md) — the current
  state of the component library implementation
- Visualisation — PPT ratio visualisation as a
  specific application of the component architecture