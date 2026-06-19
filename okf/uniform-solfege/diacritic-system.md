---
type: concept
title: Uniform Solfège — Diacritic System
description: >
  The six-state diacritic system extends Uniform Solfège into microtonal
  space, tiling the 31 EDO and 72 EDO grids from 12TET anchor positions
  using suffixes that are visually self-documenting.
tags:
  - uniform-solfege
  - diacritics
  - microtonality
  - 31-edo
  - 72-edo
  - notation
  - prime-period-theory
timestamp: 2026-06-19
---

# Diacritic System

## Purpose

The twelve base positions of Uniform Solfège anchor the 12TET chromatic
scale. To reach microtonal positions — the intervals of 31 EDO, 72 EDO, or
just intonation ratios that fall between 12TET steps — a systematic diacritic
system extends each base position into a local neighbourhood of six states.

The design requirement was that the diacritics be **visually self-documenting**:
the suffix character itself should suggest its function, so that a musician
encountering an unfamiliar inflected symbol can make an educated guess without
consulting a reference.

## The six states

Each base solfège position can take one of six states, indicated by a suffix:

| Suffix | State name | Direction | Semitone offset | Visual mnemonic |
|---|---|---|---|---|
| `b` | Sub2 | ↓↓ | −2 steps | B = notehead with upward tail → sits lower on staff |
| `eb` | Sub1 | ↓ | −1 step | Between base and Sub2 |
| *(none)* | Base | — | 0 | The 12TET anchor position |
| `p` | Sup1 | ↑ | +1 step | P = notehead with downward tail → sits higher on staff |
| `ep` | Sup2 | ↑↑ | +2 steps | Between base and Axis |
| `x` | Axis | ⊕ | +3 steps | X = crossing point, equidistant between two 12TET positions |

### On the mnemonic design

The three suffix characters are not arbitrary:

**`b` (Sub2 / double-flat):** The letter B, when written, resembles a
notehead with a stem pointing upward — the typographic convention for a note
positioned *lower* on a staff. The sub- (flattening) direction is encoded
in the letterform.

**`p` (Sup1 / sharp):** The letter P, when written, resembles a notehead
with a stem pointing downward — conventionally *higher* on a staff. The
sup- (sharpening) direction is encoded in the letterform.

**`x` (Axis):** The letter X suggests a crossing point, an intersection,
a boundary between two territories. The axis position is exactly equidistant
between two adjacent 12TET positions — it belongs to neither, and crosses
between them. The X also visually suggests a multiplication or modular
intersection in the arithmetic sense.

This means the suffix letters are **iconically motivated** — they depict their
function — rather than arbitrarily assigned. A musician reading `Solb` can
infer "Sol, lowered" from the letterform before knowing the formal rule.

## Naming convention

A fully inflected position is written as `[base][suffix]`:

```
Dob    — Do, Sub2 (two steps flat of Do)
Doeb   — Do, Sub1 (one step flat of Do)
Do     — Do, Base (standard 12TET position)
Dop    — Do, Sup1 (one step sharp of Do)
Doep   — Do, Sup2 (two steps sharp of Do)
Dox    — Do, Axis (midpoint between Do and Dop/Re)
```

The same pattern applies to every base position:

```
Reb  Reeb  Re  Rep  Reep  Rex
Mib  Mieb  Mi  Mip  Miep  Mix
Fab  Faeb  Fa  Fap  Faep  Fax
...
```

## Mapping to 31 EDO

In 31 EDO, the octave is divided into 31 equal steps. The 12TET chromatic
scale maps onto 31 EDO with each semitone spanning either 2 or 3 steps
(since 31 ÷ 12 ≈ 2.58). The diacritic system tiles these steps as follows:

The 31 EDO grid, organised by 12TET interval category:

| Interval | 12TET position | 31 EDO steps | Diacritic states used |
|---|---|---|---|
| Tonic | Do (0) | 0 | Do |
| | | 1 | Dop |
| Minor 2nd | Dop/Reb (1) | 2 | Re / Dox |
| | | 3 | Rep |
| Major 2nd | Re (2) | 4 | Reep / Re |
| | | 5 | Rip |
| Minor 3rd | Meb (3) | 7 | Meb |
| ... | ... | ... | ... |

*A complete 31-position table appears in [31 EDO](../tuning/31-edo.md).*

The key property is that the six diacritic states are **sufficient** to reach
every 31 EDO position from the nearest 12TET anchor, without needing
additional suffixes or a separate naming scheme.

## Mapping to 72 EDO

72 EDO divides each 12TET semitone into exactly 6 equal steps. This maps
perfectly onto the six diacritic states:

```
[base]b   →  −2/6 semitone  (−33 cents)
[base]eb  →  −1/6 semitone  (−17 cents)
[base]    →   0              (0 cents)
[base]p   →  +1/6 semitone  (+17 cents)
[base]ep  →  +2/6 semitone  (+33 cents)
[base]x   →  +3/6 semitone  (+50 cents, the axis)
```

6 states × 12 positions = **72 positions** — exactly the 72 EDO grid.

This is why 72 EDO serves as the reference grid for the diacritic system.
The six-state system was designed to tile 72 EDO completely, with 31 EDO
as the primary practical target and 72 EDO as the theoretical reference frame.

## The axis position

The axis (suffix `x`) deserves special attention. At +50 cents from the base
position, it sits at the exact midpoint between two adjacent 12TET semitones.
It is not a sharpened version of the base note, nor a flattened version of the
next note — it is equidistant from both.

This interval is musically significant:

- In 31 EDO, the axis positions correspond to the **neutral intervals** —
  neutral second, neutral third, neutral sixth, neutral seventh — that appear
  in Arabic maqam, Turkish makam, and some Indian ragas
- In just intonation, neutral intervals arise from the **11-prime family**
  (ratios involving the prime 11, such as 11/8 and 12/11)
- The axis is therefore the point where the 11-prime family enters the system

The X suffix encoding this as a "crossing point" is therefore theoretically
precise: the axis is where the 5-limit diatonic world crosses into the
11-limit neutral world.

## Relationship to the geometric character set

The diacritics are designed to integrate with the geometric base characters.
When a base character is inflected:

- The **sub- inflections** (b, eb) visually lower or diminish the base form
- The **sup- inflections** (p, ep) visually raise or augment the base form  
- The **axis** (x) adds a crossing or intersection to the base form

This means the *written form* of an inflected note encodes both the interval
family (from the base character's geometry) and the direction and degree of
inflection (from the suffix). A trained reader of Uniform Solfège can parse
both dimensions of information from the written symbol simultaneously.

See [Geometric Basis](geometric-basis.md) for the full account of how base
character geometry encodes interval relationships.

## 31 EDO as illustrated

The diagram below shows the full 31 EDO grid as drawn in the original
hand notation, organised into five interval rows:

```
Row 1 — Tonic / Second   (positions  0– 6):  Do family
Row 2 — Third            (positions  7–12):  Mi/Meb family  
Row 3 — Fourth/Tritone/Fifth (positions 13–19): Fa/Sol family
Row 4 — Sixth            (positions 20–25):  La family
Row 5 — Seventh          (positions 26–30):  Ti/Te family
```

The visual mirroring between Row 1 (Tonic/Second) and Row 5 (Seventh)
reflects interval complementarity: sevenths and seconds sum to the octave
(Do). The arch shapes of Row 3 (Fourth/Tritone/Fifth) reflect the
symmetric position of the tritone as the axis of the chromatic octave.
This complementarity is a **by-product of the geometric derivation**, not
an explicit design decision — the geometry of the chromatic circle produces
these symmetries naturally in the character forms.

## See also

- [Uniform Solfège Overview](index.md)
- [Geometric Basis](geometric-basis.md) — how the base characters encode geometry
- [31 EDO](../tuning/31-edo.md) — complete position mapping
- [72 EDO Grid](../tuning/72-edo-grid.md) — the reference grid
- [Prime Families](../foundations/prime-families.md) — especially the 11-prime / axis relationship
