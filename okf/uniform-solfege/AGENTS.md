# Uniform Solfège — Agent Instructions

## Purpose

Documentation for the notation layer of PPT. These pages are more technical and reference-oriented than foundations pages. They should be precise enough that a musician could implement the system from the docs alone.

## Current pages

|File|Status|Description|
|---|---|---|
|`index.md`|Complete|System overview, 12 positions, arithmetic examples|
|`diacritic-system.md`|Complete|Six-state suffix system, 31/72 EDO mapping|
|`geometric-basis.md`|Complete|Five-family nested polygon construction; the Do glyph; the PPT mark|
|`base-12-algebra.md`|Missing|Clock arithmetic, interval composition, prime generators|

## Critical conventions — do not change

The diacritic suffix system is **fixed**. Do not introduce new suffixes or modify the existing ones:

|Suffix|State|Direction|
|---|---|---|
|`b`|Sub2|−2 steps (double flat)|
|`eb`|Sub1|−1 step (flat)|
|_(none)_|Base|0 (12TET anchor)|
|`p`|Sup1|+1 step (sharp)|
|`ep`|Sup2|+2 steps (double sharp)|
|`x`|Axis|+3 steps (50 cent midpoint)|

The mnemonic reasoning (B = notehead up = lower; P = notehead down = higher; X = crossing point) is part of the system design and should be referenced when explaining the suffixes.

The geometric construction for the five prime families is also **fixed**, documented in `geometric-basis.md`:

- 2-prime = outer circle (container, not a polygon)
- 3-prime = triangle, 5-prime = pentagon, sharing an apex on the outer circle
- 7-prime = irregular mirror-symmetric heptagon, constructed from pentagon edges as alignment guides (NOT from triangle/pentagon intersection — that only produces 5–6 points, never 7)
- 11-prime = comma-perturbed near-regular 11-gon, nested innermost
- The Do glyph is the emergent overlap of the enlarged 11-gon and the triangle — do not change this construction without checking the geometric-basis.md rationale first

## Priority pages to create

### `base-12-algebra.md`

The arithmetic system. Should cover:

- Solfège syllables as base-12 digits (Do=0 through Ti=11)
- Addition mod 12 as interval stacking
- The circle of fifths as repeated +7 (Sol) operations mod 12
- Prime generators as arithmetic operations
- Worked examples: building scales, transposing, finding complements
- Extension into 31 EDO using diacritic arithmetic

## Note on the character set

The hand-drawn 31 EDO diagram (in the repository's `/assets/` folder once added) is the primary visual reference for the geometric basis. The PPT mark / logo (SVG, see project root or `/assets/` once added) is built from the same construction documented in `geometric-basis.md` and should be treated as a worked example of that page's content, not a separate design artefact.