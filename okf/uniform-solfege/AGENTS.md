# Uniform Solfège — Agent Instructions

## Purpose

Documentation for the notation layer of PPT. These pages are more technical and reference-oriented than foundations pages. They should be precise enough that a musician could implement the system from the docs alone.

## Current pages

|File|Status|Description|
|---|---|---|
|`index.md`|Complete|System overview, 12 positions, arithmetic examples|
|`diacritic-system.md`|Complete|Prime family diacritics (Du, Tri, Qui, Sep, UnDec), 4620 LCM grid|
|`geometric-basis.md`|Complete|Five-family nested polygon construction; the Do glyph; the PPT mark|
|`base-12-algebra.md`|Complete|Clock arithmetic, interval composition, string vs frequency ratio, LCM|

## Critical conventions — do not change

The diacritic suffix system is **fixed** based on exact prime families (Du, Tri, Qui, Sep, UnDec). Do not introduce new suffixes or revert to the legacy system:

| Family | Subdivisions | Diacritic Root |
|---|---|---|
| Du (2) | Approximation bitmask | `x` (Axis crossbar) |
| Tri (3) | ÷6 | `Sub`, `HalfSub`, `Base`, `HalfSup`, `Sup`, `Axis` |
| Qui (5) | ÷5 | `QuiSub`, `QuiSup` (tick variants) |
| Sep (7) | ÷7 | `SepSub`, `SepSup` (circle variants) |
| UnDec (11) | ÷11 | `UnDecSub`, `UnDecSup` (moon variants) |

The precise geometric and logical construction of these diacritics is defined in `diacritic-system.md` and `geometric-basis.md`.

The geometric construction for the five prime families is also **fixed**, documented in `geometric-basis.md`:

- 2-prime = outer circle (container, not a polygon)
- 3-prime = triangle, 5-prime = pentagon, sharing an apex on the outer circle
- 7-prime = irregular mirror-symmetric heptagon, constructed from pentagon edges as alignment guides (NOT from triangle/pentagon intersection — that only produces 5–6 points, never 7)
- 11-prime = comma-perturbed near-regular 11-gon, nested innermost
- The Do glyph is the emergent overlap of the enlarged 11-gon and the triangle — do not change this construction without checking the geometric-basis.md rationale first

## Note on the character set

The hand-drawn 31 EDO diagram (in the repository's `/assets/` folder once added) is the primary visual reference for the geometric basis. The PPT mark / logo (SVG, see project root or `/assets/` once added) is built from the same construction documented in `geometric-basis.md` and should be treated as a worked example of that page's content, not a separate design artefact.