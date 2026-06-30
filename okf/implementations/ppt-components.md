---
type: reference
title: PPT Component Library
description: >
  The canonical PPT interactive component library at
  ppt.midlifemuso.com/components — framework-agnostic Web Components
  implementing PPT visual and interactive primitives. Current showcases,
  component families, and development status.
tags:
  - implementations
  - components
  - canonical
  - prime-period-theory
timestamp: 2026-07-01
---

# PPT Component Library

**URL:** https://ppt.midlifemuso.com/components  
**Type:** Canonical  
**Status:** Active development

## What it is

The PPT Component Library is a set of framework-agnostic Web Components
designed to make PPT concepts interactive and visually concrete. Components
are atomic, composable, and independently distributable. The library is
built on the principle that composition of small primitives — not
configuration of large components — is the right architecture for a
system meant to demonstrate PPT's structural ideas.

The design philosophy is documented in full at
[Component Philosophy](../applications/component-philosophy.md).

## Current component families

**Foundational Primitives** — Base component, Title, Container, Text Panels.
The structural scaffolding for all compositions.

**Notation Components** — Uniform Solfège glyph renderer; Solfège Phrase Panel.
These render the visual character set of Uniform Solfège as web components,
making the notation system available in any browser context.

**Geometric Containers** — Period container (`<ppt-period>`), Period Step
(`<ppt-period-step-circle>`), Sequencer. The core primitive: a period
container that auto-positions its children at equal angular or linear
intervals, driving both pitch-space and rhythmic-space representations
from the same underlying component.

**Interactive Controls and EventBus** — Control Panel, Boolean Toggle,
Integer Input. A declarative interaction layer: controls emit named
events; components declare which events they listen for via `listen-id`
attributes. No JavaScript event wiring required.

## Current showcases

**Tonal Clock** — Twelve chromatic pitch positions on a circular `<ppt-period>`,
colour-coded by Uniform Solfège prime family. Demonstrates pitch-class space
as a period with equal step distribution. Interactive: click any position
to hear its pitch.

**Metronome** — A circular or linear `<ppt-period>` with a Sequencer component
driving tempo-paced step advance. Demonstrates rhythmic periodicity using the
same container as the Tonal Clock. Controls: Play toggle, Tempo (BPM) integer.

**Solfège Writer** — Interactive environment for exploring Uniform Solfège
glyph kerning and layout. Supports the MusiCoil font development work.

**Designer Studio** — Drag-and-drop workspace for composing PPT components
visually. Enables non-code exploration of component compositions and serves
as a live documentation environment.

## PPT concepts implemented

| Concept | Component / Showcase |
|---|---|
| Pitch and rhythm as the same primitive | `<ppt-period>` used for both Tonal Clock and Metronome |
| Prime family colour encoding | Tonal Clock step colours via `--solfege-*` CSS variables |
| Uniform Solfège chromatic syllables | Tonal Clock labels (Do, Ra, Re, Me, Mi, Fa, Fi, So, Le, La, Te, Ti) |
| Declarative geometry (emergent positioning) | `<ppt-period>` auto-positioning from step count |
| Declarative interaction (no imperative wiring) | EventBus pattern via `listen-id` / `bind-id` attributes |
| Metric DuPeriod (period as structural primitive) | `<ppt-period>` as the universal period container |

## Planned

- Metric DuPeriod navigator (logarithmic period axis, spanning pitch to form)
- Polyrhythm display (nested `<ppt-period>` with different step counts)
- Play-along feedback interface (relative pitch assessment, three models)
- Transcription workspace (melody-first contour capture + modal hypothesis)
- Phase coherence visualiser (inter-onset ratio stability display)

## See also

- [Component Philosophy](../applications/component-philosophy.md) —
  design rationale for the one-primitive architecture
- Visualisation — the broader
  visualisation philosophy that the component library serves
- [PPT Topics Site](https://ppt.midlifemuso.com/topics) — the learner-
  facing documentation that uses these components