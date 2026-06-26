---
type: reference
title: Prime Period Diacritics — Glyph Forms
description: >
  Visual specifications for the Prime Period Diacritics (PPD) character forms, mapping positions to visual representations.
tags:
  - prime-period-diacritics
  - notation
  - visual-grammar
  - prime-period-theory
timestamp: 2026-06-26
---

# Glyph Forms

This file specifies the visual form of each diacritic. The base figure (a circle in generic PPD; the rotated U with decorated arms in Uniform Solfège) is treated as a clock face. Orientation is from 12 o'clock (base position). 3 o'clock = positive deviation. 9 o'clock = negative deviation.

## Du family

**Axis** — a horizontal stroke passing through the base character.

Fractal Du depth is encoded as small triangle offsets on the Axis stroke:
- Depth 1 (±1/2): plain stroke, no triangles
- Depth 2 (±1/4): one small triangle on stroke, pointing toward nearer pole
- Depth 3 (±1/8): two small triangles
- Depth 4 (±1/16): three small triangles

## Tri family

Glyph: equilateral triangle attached at the base character perimeter.

- **Tri** (+1/3): point-up triangle, 2 ticks on either side of base character
- **TriInv** (−1/3): point-down (inverted) triangle, 2 ticks

Tick count encodes magnitude: 2 ticks = full Tri distance from base.

## DuTri family (fractal compound)

Glyph: same triangle forms as Tri, with 1 tick (half the distance).

- **DuTri** (+1/6): point-up triangle, 1 tick
- **DuTriInv** (−1/6): point-down triangle, 1 tick

## Qui family

Glyph: triangle (same orientation encoding as Tri) with an outward-facing T-cross (capital T shape) on the diacritic, pointing away from the base character. Tick count encodes magnitude.

- **Qui** (+1/5): point-up triangle + T-cross, 1 tick
- **QuiInv** (−1/5): point-down triangle + T-cross, 1 tick
- **Qui2** (+2/5): point-up triangle + T-cross, 2 ticks
- **QuiInv2** (−2/5): point-down triangle + T-cross, 2 ticks

## Sep family

Glyph: tick(s) or Axis stroke capped with a circle, placed on the 3 o'clock side (positive/clockwise) or 9 o'clock side (negative/withershins). The Axis stroke variant makes the Axis-proximity principle visually explicit.

Clockwise configurations (mirror for withershins):

- **Sep** (+1/7): 1 tick, capped with circle
- **Sep2** (+2/7): 2 ticks, capped with circle
- **Sep3** (+3/7): full horizontal stroke (Axis-inherited form), capped with circle

Note: Sep3 deliberately shares visual grammar with the Axis glyph, reflecting its positional proximity to +1/2.

## Undec family

Glyph: moon-phase forms placed at the cardinal points (3 o'clock for positive, 9 o'clock for negative). Two poles of gravity: Base (0) and Axis (+1/2). Half-circle (crescent) forms lean toward the nearer pole.

Full moon appears at the cardinal point and represents the centre of the positive or negative field (+3/11 or −3/11). Half-moons offset by Undec steps toward Base or Axis.

Clockwise (positive) configurations (mirror for withershins):

| Glyph | Position | Form |
|-------|----------|------|
| Undec1 | +1/11 | Double moon leaning toward Base |
| Undec2 | +2/11 | Moon leaning toward Base |
| Undec3 | +3/11 | Full moon at cardinal (3 o'clock) |
| Undec4 | +4/11 | Moon leaning toward Axis |
| Undec5 | +5/11 | Double moon leaning toward Axis |

"Double moon" = two half-circle forms; signals proximity to an extreme (Base or Axis). Undec4 and Undec5 visually inherit Axis-proximity grammar consistent with the design principle.
