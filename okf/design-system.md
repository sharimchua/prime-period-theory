---
type: concept
title: Design System & Color Semantics
description: >
  Formal specification of the visual design language used across Prime Period Theory documentation and components.
tags:
  - design
  - color-theory
  - styling
timestamp: 2026-06-27
---

# PPT Design System

Prime Period Theory (PPT) utilises a strict, semantically meaningful design system. Visual styling is not purely decorative; it mathematically and acoustically encodes the underlying theory. 

## Global Brand Colors

The foundational brand colors anchor the documentation and generic structural elements.

- **Primary Brand (Red)**: `#E13610`
- **Secondary Brand (Orange)**: `#E17013`
- **Accent (Bright Red)**: `#E20415`

## Uniform Solfège Interval Palette

The Solfège color palette maps specific hues to interval categories. The exact hex values are reverse-engineered to encode core acoustic, mathematical, and tuning references.

| Interval Category | Syllables | CSS Variable | Hex Code | Semantic Rationale |
|---|---|---|---|---|
| **Unison** | Do | `--solfege-do` | `#E13010` | Earth resonance (130.10Hz) |
| **Seconds** | Ra, Re | `--solfege-re` | `#E2C432` | **E2 C 432**: Represents the E2 octave, the C root, and the philosophical 432Hz tuning standard |
| **Thirds** | Me, Mi | `--solfege-mi` | `#F54321` | **F 5:4 3:2 1**: Encodes the foundational harmonic ratios (Major Third 5:4, Perfect Fifth 3:2, Unison 1) |
| **Fourths** | Fa | `--solfege-fa` | `#43A440` | **4:3 A440**: Encodes the Perfect Fourth ratio (4:3) and international standard pitch A440 |
| **Tritone** | Fi | `--solfege-fi` | `#141414` | **1.414**: The square root of 2, the exact mathematical center of the octave in equal temperament |
| **Fifths** | So | `--solfege-so` | `#0032A4` | **3:2 A4**: Encodes the Perfect Fifth ratio (3:2) anchored to A4 |
| **Sixths** | Le, La | `--solfege-la` | `#5300A4` | **5:3 A4**: Encodes the Major Sixth ratio (5:3) anchored to A4 |
| **Sevenths**| Te, Ti | `--solfege-ti` | `#F158A4` | **F 15:8 A4**: Encodes the Major Seventh ratio (15:8) anchored to A4 |

## Prime Family Identity Palette

When discussing abstract prime-limit ratios outside of Solfège notation, the following palette is used to uniquely identify prime factors:

| Prime Family | CSS Variable | Hex Code | Visual Association |
|---|---|---|---|
| **2-Prime** (Octave) | `--prime-2` | `#6b7280` | Grey |
| **3-Prime** (Fifths) | `--prime-3` | `#3b82f6` | Blue |
| **5-Prime** (Thirds) | `--prime-5` | `#22c55e` | Green |
| **7-Prime** (Septimal) | `--prime-7` | `#f59e0b` | Amber |
| **11-Prime** (Neutral) | `--prime-11` | `#a855f7` | Purple |
| **Axis / Midpoint** | `--axis` | `#ec4899` | Pink |
