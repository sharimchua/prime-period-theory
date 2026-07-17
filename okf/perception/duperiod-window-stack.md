---
type: concept
title: DuPeriod Window Stack
description: >
  An analytical framework where a fixed rhythmic fundamental defines a
  cascade of analysis window sizes across all DuPeriod bands, from macro
  rhythm to micro pitch, scaled in prime-coherent ratios.
tags:
  - perception
  - metric-duperiod
  - rhythm
  - analysis
  - spectral
timestamp: 2026-07-17
---

# DuPeriod Window Stack

The **DuPeriod Window Stack** is a principled analytical framework and perceptual model within Prime Period Theory. It defines a cascade of analysis window sizes across all Metric DuPeriod bands — from macro rhythm down to micro pitch — anchored by a specific rhythmic fundamental.

Rather than selecting arbitrary window sizes for spectral or rhythmic analysis, the window stack ensures that all observation windows exist in prime-coherent ratio relationships (specifically 2:1) to both each other and the musical content being analysed.

## Core mechanism and derivation

Given a rhythmic fundamental located at a specific positive DuPeriod position (above the Temporal-Place Limen), each successive DuPeriod step downward toward and through the Limen defines a natural analysis window by the same 2:1 ratio progression. 

The window size for any target DuPeriod band is derived strictly from the rhythmic anchor using the following formula:

```text
W(target) = T_fund * 2^(target - fund)
```

Where:
- `W(target)` is the analysis window duration at the target DuPeriod band.
- `T_fund` is the period duration of the rhythmic fundamental.
- `fund` is the Metric DuPeriod index of the fundamental.
- `target` is the Metric DuPeriod index of the band being analysed.

Because the progression is strictly 2-prime generated, the window stack is internally coherent. Every window is precisely half or double the duration of its immediate neighbours.

## Tempo rescaling property

A critical property of the DuPeriod Window Stack is its behaviour under tempo changes. When the tempo changes, the entire stack rescales simultaneously. Harmonic and melodic analysis windows stretch or contract proportionally with the rhythmic fundamental.

This models a key phenomenon in human hearing: tempo-relative spectral analysis. Our perception couples rhythmic and harmonic processing, adjusting the time-scale of our auditory integration windows based on the surrounding rhythmic context. 

### Worked examples

Consider two different rhythmic fundamentals to illustrate how the window stack rescales. The Limen (DP0) is conceptually anchored around 20 Hz (50 ms).

**Example 1: Pulse at ~150 BPM (2.5 Hz)**
A 150 BPM pulse has a period of 400 ms. In the DuPeriod grid, this aligns with DP+3 (three octaves below the 20 Hz Limen: 20 Hz → 10 Hz → 5 Hz → 2.5 Hz).

**Example 2: Pulse at ~75 BPM (1.25 Hz)**
A 75 BPM pulse has a period of 800 ms, aligning with DP+4. 

| DuPeriod Band | Description | Window at 150 BPM (Anchor DP+3) | Window at 75 BPM (Anchor DP+4) |
|---|---|---|---|
| **DP+4** | Macro-phrase | 800 ms | 800 ms (Fundamental) |
| **DP+3** | Phrase/Bar level | 400 ms (Fundamental) | 400 ms |
| **DP+2** | Beat/Sub-beat level | 200 ms | 200 ms |
| **DP+1** | Fast subdivision | 100 ms | 100 ms |
| **DP0** | Limen (Crossover) | 50 ms | 50 ms |
| **DP-1** | Harmonic partials | 25 ms | 25 ms |
| **DP-2** | Finer spectral | 12.5 ms | 12.5 ms |
| **DP-3** | Micro-spectral | 6.25 ms | 6.25 ms |

*(Note: In reality, as the fundamental drops from 150 BPM to 75 BPM, the "beat" perception might shift from DP+3 to DP+4, keeping the relative perceptual window sizes invariant relative to the perceived beat, while doubling the absolute time of the windows).*

## Window change velocity

When tracking a live performance, the tempo is rarely perfectly static. The rate at which the window stack rescales over linear time is a measurable quantity known as **window change velocity**.

Window change velocity is a perceptual model variable representing how quickly a listener updates their internal reference frame. It is **not** an arbitrary free parameter. Instead, it is bounded by physiological and cognitive constraints (perceptual inertia). A listener cannot instantaneously update their temporal expectation framework; it requires a few cycles of evidence to pull the internal tracking mechanism to the new tempo. Modelling window change velocity must respect these principled bounds.

## Analytical tool vs. Perceptual model

It is important to distinguish between the two modes in which the DuPeriod Window Stack operates:

1. **As an analytical tool**: A fixed stack can be applied statically to a piece of audio (e.g., in a DSP context) to extract multi-resolution structural data that guarantees phase-coherence across all layers.
2. **As a perceptual model**: It describes the dynamic, continuously updating schema by which human listeners parse a musical stream. 

## Self-adjusting stack

When the rhythmic fundamental is estimated continuously from live performance data rather than set as a fixed parameter, the window stack becomes self-adjusting. The analytical frame tracks the music's own centre of gravity, rather than an externally imposed, rigid metronome. This tracking mechanism, combining the window stack with bounded window change velocity, forms the basis of the self-adjusting pipeline.

## Related concepts

- [Metric DuPeriod](../reference/metric-duperiod.md) — The logarithmic coordinate system underlying the stack.
- [Temporal-Place Limen](temporal-place-limen.md) — The biological crossover point (DP0) anchoring the bands.
- [Rhythmic Overtone Series](../domains/rhythmic-overtone-series.md) — The fractional ratios that populate the windows.
- Self-Adjusting Pipeline *(Future)* — The continuous implementation of the stack.
