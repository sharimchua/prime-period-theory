# Uniform Solfège — Agent Instructions

## Purpose

Documentation for the notation layer of PPT. These pages are more technical
and reference-oriented than foundations pages. They should be precise enough
that a musician could implement the system from the docs alone.

## Current pages

| File | Status | Description |
|---|---|---|
| `index.md` | Complete | System overview, 12 positions, arithmetic examples |
| `diacritic-system.md` | Complete | Six-state suffix system, 31/72 EDO mapping |
| `geometric-basis.md` | Missing | How character forms encode interval geometry |
| `base-12-algebra.md` | Missing | Clock arithmetic, interval composition, prime generators |

## Critical conventions — do not change

The diacritic suffix system is **fixed**. Do not introduce new suffixes or
modify the existing ones:

| Suffix | State | Direction |
|---|---|---|
| `b` | Sub2 | −2 steps (double flat) |
| `eb` | Sub1 | −1 step (flat) |
| *(none)* | Base | 0 (12TET anchor) |
| `p` | Sup1 | +1 step (sharp) |
| `ep` | Sup2 | +2 steps (double sharp) |
| `x` | Axis | +3 steps (50 cent midpoint) |

The mnemonic reasoning (B = notehead up = lower; P = notehead down = higher;
X = crossing point) is part of the system design and should be referenced
when explaining the suffixes.

## Priority pages to create

### `geometric-basis.md`
How the character set is derived from chromatic circle geometry. Should cover:
- The design principle: symbols encode the geometry they describe
- Interval families and their visual characteristics (U-family, C-family,
  arch-family, D-family, reversed-U-family)
- Complementary pair mirroring (intervals summing to 12 are visually related)
- The tritone as visual axis of symmetry
- How diacritic inflection modifies base forms directionally

### `base-12-algebra.md`
The arithmetic system. Should cover:
- Solfège syllables as base-12 digits (Do=0 through Ti=11)
- Addition mod 12 as interval stacking
- The circle of fifths as repeated +7 (Sol) operations mod 12
- Prime generators as arithmetic operations
- Worked examples: building scales, transposing, finding complements
- Extension into 31 EDO using diacritic arithmetic

## Note on the character set

The hand-drawn 31 EDO diagram (in the repository's `/assets/` folder once
added) is the primary visual reference for the geometric basis. When writing
`geometric-basis.md`, reference this diagram explicitly.
