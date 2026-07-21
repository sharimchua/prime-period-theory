---
type: concept
title: Three-Layer Coil Editor Design Rationale
description: >
  The conceptual foundation for the interactive Three-Layer Coil Editor.
  Explores how the Component Philosophy and EventBus declarative
  architecture manifest in a functional, input-agnostic notation
  environment that preserves the descriptive stance of Prime Period Theory.
tags:
  - applications
  - components
  - coil-notation
  - rhythmic-grammar
  - melodic-grammar
  - musicoil
status: stable
timestamp: 2026-07-08
used_by:
  - structure/coil-notation.md
  - applications/component-philosophy.md
  - applications/play-along.md
  - implementations/ppt-components.md
---

# Three-Layer Coil Editor Design Rationale

The Three-Layer Coil Editor is the interactive manifestation of [Three-Layer Coil Notation](../structure/coil-notation.md). More than just a digital replica of a paper format, it serves as the primary authoring environment for Prime Period Theory (PPT) phrases within the Composer.

This document outlines the *why* behind its architecture, grounded in the [Component Philosophy](component-philosophy.md).

## One Primitive, Many Interpretations

At the core of PPT is the assertion that rhythm and pitch share the same geometric substrate: periodicity. The Three-Layer Coil Editor honours this by ensuring its fundamental editing surface — the `<ppt-phrase-editor>` — is entirely ignorant of whether it is editing rhythm, harmony, or melody.

A row is simply a row; a phrase is simply a sequence of `GlyphToken`s. The meaning of those tokens is injected purely by composition. By placing a row within a `<ppt-coil-layer layer="melody">`, the row's tokens are interpreted via the Melodic Grammar. By moving that exact same row into a `layer="rhythm"`, it instantly submits to Rhythmic Grammar validation.

The UI does not branch; the theory branches.

## Composition Over Configuration

The `<ppt-coil>` is not a monolith. It is an empty layout shell that coordinates child layers. This ensures that a single-layer coil (for isolated rhythmic practice) and a massive orchestral multi-coil setup share the exact same code paths.

Geometry and behaviour emerge from the DOM structure, consistent with the broader PPT approach to [Declarative Geometry](component-philosophy.md#declarative-geometry).

## Relative-Before-Absolute

A persistent challenge in music software is the premature binding of absolute values (BPM, 440Hz tuning). PPT is a descriptive framework built on ratios. 

The editor maintains this relative purity:
1. **The Phrase Editor** deals only in `GlyphToken`s (Solfège syllables and diacritics).
2. **The Grammar Interpreters** resolve these tokens into abstract scale degrees and relative onsets.
3. **The Resolvers (`TimingGridResolver`, `TuningResolver`)** are the final boundary where relative ratios are squashed into absolute Hz and milliseconds for Web Audio playback.

This ensures a phrase authored in the editor is transposable, retunable, and re-scalable by definition.

## Input Agnosticism

By abstracting inputs through "Bridges" (`<ppt-midi-input-bridge>`, `<ppt-solfege-text-input>`), the editor surface remains clean. Whether a user is typing `DoxReMi` on a QWERTY keyboard or playing a sequence of keys on a MIDI controller, both pathways collapse into a uniform `glyph-input` event on the shared EventBus.

## The Simplification Ladder

The editor's mixer architecture is deeply tied to the [Play-Along Feedback](play-along.md) philosophy. By treating mute/solo not as edge-case playback hacks but as core state in a `<ppt-coil-mixer>`, the interface naturally supports the "Simplification Ladder". A user struggling with a complex polyphonic passage can instantly drop the UI into "Solo Rhythm" mode, muting all pitch information and reducing cognitive load, without altering the underlying data model.

## See Also
- [Three-Layer Coil Notation](../structure/coil-notation.md) — the paper syntax this editor makes interactive.
- [Component Philosophy](component-philosophy.md) — the primitive and EventBus principles this design extends.
- [PPT Components](../implementations/ppt-components.md) — the canonical implementation status of the component library.
