# Piano Triangle Notation — Agent Instructions

## Purpose of this directory

This directory contains concept specifications for **Piano Triangle Notation** (and its companion fretboard extensions). This notation system provides an ergonomic, keyboard-topographical notation layer that groups the 12 chromatic pitches into four three-key triangles anchored to D, encoding scales as tetrachord chains and voicings through geometric segment order.

## File index

| File | Purpose | Status |
|---|---|---|
| `index.md` | Core specification for Piano Triangle Notation (Down/Left/Up/Right) | Experimental |
| `fretboard-leaps.md` | Fretboard string leap formula and M3 seam-crossing extension | Experimental |

## Local conventions

- **Naming Schemes:** Primary scheme uses hand-shape ergonomics: `Down`, `Left`, `Up`, `Right` (`D`, `L`, `U`, `R`). Alternate mnemonic scheme uses solfège: `Do`, `Me`, `Fi`, `La` (`D`, `M`, `F`, `L`).
- **Collision Warning:** Note that `L` denotes *Left* in the primary scheme and *La* (= Right triangle) in the alternate scheme. Never mix abbreviations silently.
- **Tone Centre:** Anchored to D as Do (`D2`), aligning with the physical black/white key symmetry around D on 12TET keyboards.
- **Spelling:** Always use Australian English spelling conventions (`colour`, `centre`, `analyse`, etc.).
- **Plain-text Math:** Do not use LaTeX (`$...$`). Use code blocks and backticks.
