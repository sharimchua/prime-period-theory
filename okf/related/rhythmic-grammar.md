---
type: concept
title: Rhythmic Grammar
description: >
  A formal system for encoding rhythmic grouping structure as compact,
  speakable, machine-parsable strings. Uses the 12 base solfège syllables
  of Uniform Solfège as tokens, with a circle-of-fifths cadential chain as
  the generative principle and tritone displacement as the accent mechanism.
tags:
  - rhythmic-grammar
  - rhythm
  - solfege
  - polyrhythm
  - metronome
  - solkattu
  - prime-period-theory
timestamp: 2026-07-01
---

# Rhythmic Grammar

## Overview

Rhythmic Grammar is a formal encoding system for rhythmic grouping structure.
It uses the twelve base syllables of Uniform Solfège as a finite token set,
governed by a small set of production rules, to produce strings that are:

- **Speakable** — the string voiced rhythmically is the rhythm itself
- **Writable** — compact enough for annotations, messages, and score markings
- **Machine-parsable** — deterministic grammar; every valid string has exactly
  one parse tree
- **Self-naming** — the string is simultaneously the chain's name,
  description, and execution instruction

The system draws direct inspiration from **Solkattu** (konnakol), the South
Indian vocal percussion tradition, where speaking the syllable pattern trains
the body in the rhythm without requiring conscious counting. In Rhythmic
Grammar, pitch contour replaces syllabic texture as the carrier of
grouping information.

## Terminology

- **Chain** — the top-level repeatable structure. A chain contains exactly one
  primary block followed by zero or more secondary blocks. Chains are cyclical:
  the end of the last block resolves back to the opening Do of the chain on
  the next cycle.
- **Primary block** — opens with Do. There is exactly one primary block per
  chain, and it is always first.
- **Secondary block** — opens with Dix. A chain may contain any number of
  secondary blocks.
- **Block** — the atomic unit shared by both types: opener (Dox or Dix) +
  interior chain tokens in descending-fifths order + <span class="solfege">So</span> closer (explicit or
  implied by shorthand expansion).

## The generative principle

Every rhythm block is a **descending-fifths cadential chain** ending on Do.

The circle of fifths, ascending in fourths toward Do, provides a natural
sense of harmonic gravity — each step feels pulled toward the next, and Do
feels like resolution. A sequence of N beats is constructed by taking the
last N steps of that chain:

- Step 1 before Do: **So**
- Step 2 before Do: **Re**
- Step 3 before Do: **La**
- Step 4 before Do: **Mi**
- Step 5 before Do: **Si** (where `Si` is preferred over `Ti`; see [Token conventions](#token-conventions))
- Step 6 before Do: **Fi**
- Step 7 before Do: **Ra**

The rule for any N-beat uniform block:

1. **Beat 1** = Do (always; the tonic anchor)
2. **Beat N** = So (always; the cadential penultimate)
3. **Beats 2 through N-1** = the descending-fifths chain, working inward
   from So toward Do

| Beats | Uniform sequence     |
| ----- | -------------------- |
| 1     | Do                   |
| 2     | Do – So              |
| 3     | Do – Re – So         |
| 4     | Do – La – Re – So    |
| 5     | Do – Mi – La – Re – So |
| 6     | Do – Si – Mi – La – Re – So |
| 7     | Do – Fi – Si – Mi – La – Re – So |

Blocks of 7 beats or fewer cover the practical range of most musical
contexts. Longer chains are better expressed as **chained blocks** (see
[Chaining](#chaining)).

## The accent mechanism: Dix as tritone displacement

Secondary accents — strong beats that are not the global downbeat — are
encoded by **tritone displacement**. The tritone of **Dox** is **Dix** (#1)
(spoken `Do` and `Di` respectively). Dix is maximally distant from Dox
on the circle of fifths and maximally harmonically distant as an interval.

Dix displaces Dox as the tonic anchor of a secondary block. A secondary block
follows the same generative rules as a primary block, but opens on Dix rather
than Dox.

The key structural rule:

> **<span class="solfege">So</span> is always followed by Dox or Dix.**

- **<span class="solfege">So</span> → Dox** = cadential resolution; cycle or block boundary
- **<span class="solfege">So</span> → Dix** = cadential diversion; secondary accent block begins

<span class="solfege">So</span> is the **decision point** in the grammar. Every <span class="solfege">So</span> carries forward
tension that resolves in one of exactly two ways.

## Token roles

| Token | Role | Followed by |
| ----- | ---- | ----------- |
| Dox   | Primary tonic anchor (Sam / "1"); block opener | Interior chain tokens or <span class="solfege">So</span> |
| Dix   | Secondary tonic anchor (tritone sub); accent opener | Interior chain tokens or <span class="solfege">So</span> or Dox or Dix |
| <span class="solfege">So</span> | Cadential penultimate; block closer | Dox or Dix only |
| Re, La, Mi, Si, Fi, Ra, ... | Interior chain tokens | Next step in chain toward <span class="solfege">So</span> |

### Dental Isolation Principle

Accent syllables (spoken `Do`, `Di`) use dental consonants. All other Rhythmic Grammar syllables use labial, velar, or lateral consonants. This is a deliberate phonetic design: when vocalising rhythm (analogous to konnakol), the accent markers are perceptually salient against the background of non-dental syllables. A performer or teacher can dictate a rhythm verbally and the accent structure is immediately audible.

## Production rules

A valid rhythm string is generated by these rules:

```
chain       ::= primary secondary*
primary     ::= "Do" interior "So"
secondary   ::= "Di" interior "So"
interior    ::= token*
token       ::= "Re" | "La" | "Mi" | "Si" | "Fi" | "Ra" | "Le" | "Me"
```

Additional rules:

1. **<span class="solfege">So</span> must be followed by Dox or Dix** (or end of chain, resolving to the
   next cycle's Dox)
2. **Dix may resolve directly to Dox** (backdoor resolution, without a
   following <span class="solfege">So</span>) — this is a special case for single-beat secondary accents
3. **Consecutive Dix** tokens are grammatical: each Dix is a backdoor resolving
   to whatever follows it
4. **Dox alone** is the degenerate 1-beat block — no interior chain, no <span class="solfege">So</span>

## Shorthand expansion

Rhythm strings may be written in shorthand, omitting the <span class="solfege">So</span> that must
precede a Dix boundary. The parser expands these automatically:

- A Dix not preceded by <span class="solfege">So</span> implies a missing <span class="solfege">So</span> for the preceding block
- A chain that does not end with <span class="solfege">So</span> implies a missing <span class="solfege">So</span> before the
  next cycle's Dox

Examples:

| Shorthand   | Expanded form         | Grouping |
| ----------- | --------------------- | -------- |
| DoReDiSo    | Do–Re–**So**–Di–So    | 3+2      |
| DoSoDiRe    | Do–So–Di–Re–**So**    | 2+3      |
| DoReDi      | Do–Re–So–Di–(**Do**) | 3+1 (backdoor) |
| DoReDiDi    | Do–Re–So–Di–Di–(**Do**) | 3+1+1  |
| DoSoDiSo    | Do–So–Di–So           | 2+2      |

The shorthand rule: **write only the meaningful accent points; the grammar
fills in the obligatory So boundaries.**

## Chain reference

### Block Length Families

The Rhythmic Grammar encodes block lengths using Uniform Solfège interval names in two wholetone-scale families:

- **2-multiple family (wholetone scale 1):** DoSo (2), DoLa (4), DoSi (6), DoRa (8), DoMe (10)
- **Other prime lengths (wholetone scale 2):** DoRe (3), DoMi (5), DoFi (7), DoLe (9), DoLi (11)

*Note: The 2-multiple family mapping to the wholetone scale is not incidental — it reflects PPT's core thesis that equal temporal division and equal pitch division are expressions of the same prime-2 periodicity.*

### Shorthand Expansion Rule

Given `DoX` or `DiX`, expand by filling the descending-fifths interior from X to Re, then append So.

The block length shorthand `Do` + [first interior token] is deterministically
expandable to the full block, because:

1. The interior chain is always the descending-fifths sequence ending at So.
2. The first interior token determines how many steps before So we begin.
3. So is always the penultimate token of the block.

Therefore: given `DoX`, the full expansion is `Do [all descending-fifths
tokens from X to Re] So`. The beat count equals the number of tokens in
the expanded block.

Examples:
- `DoRe` → `Do Re So` (3 beats): Re is one step before So.
- `DoLa` → `Do La Re So` (4 beats): La is two steps before So.
- `DoMi` → `Do Mi La Re So` (5 beats): Mi is three steps before So.
- `DoSi` → `Do Si Mi La Re So` (6 beats).
- `DoFi` → `Do Fi Si Mi La Re So` (7 beats).

The same rule applies to Di-opened secondary blocks: `DiRe` → `Di Re So`
(3-beat secondary block).

### Uniform blocks

| String        | Grouping | Notes                        |
| ------------- | -------- | ---------------------------- |
| Do            | 1        | Atomic; pure downbeat        |
| DoSo          | 2        | Primary 2-beat               |
| DiSo          | 2        | Secondary 2-beat             |
| DoReSo        | 3        | Uniform triple               |
| DoLaReSo      | 4        | Uniform quadruple            |
| DoMiLaReSo    | 5        | Uniform quintuple            |
| DoSiMiLaReSo  | 6        | Uniform sextuple             |
| DoFiSiMiLaReSo | 7       | Uniform septuple             |

### Asymmetric blocks (common blocks)

| String      | Expanded             | Grouping | Musical context              |
| ----------- | -------------------- | -------- | ---------------------------- |
| DoReDiSo    | Do–Re–So–Di–So       | 3+2      | Soft swing, 5/8 Balkan feel  |
| DoSoDiRe    | Do–So–Di–Re–So       | 2+3      | 5/8 reverse                  |
| DoSoDiSo    | Do–So–Di–So          | 2+2      | Symmetric double accent      |
| DoReSoDi    | Do–Re–So–Di–(Do)     | 3+1      | Enclosure; backdoor cadence  |
| DoReSoDiDi  | Do–Re–So–Di–Di–(Do)  | 3+1+1    | Double enclosure             |
| DoLaReSoDi  | Do–La–Re–So–Di–(Do)  | 4+1      | Quadruple with tail          |

## Chaining

Chains longer than 7 beats, or compound chains with multiple distinct
accent regions, are expressed as **chains of blocks** rather than single
long sequences. Each block retains its own opener (Do or Di) and So closer.

A **4+3+4 compound chain** chains three blocks. Crucially, only one primary accent (Dox) should exist for a chain, located at the start. Subsequent blocks in the chain use the secondary accent (Dix) as their opener:

```
DoLaReSo – DiReSo – DiLaReSo
```

Written as a continuous string, this is: `DoLaReSoDiReSoDiLaReSo`.

This is both more legible and more musically meaningful than an 11-beat
uniform string — each block is a named cadential gesture that the body can
feel independently.

The **Dox reservation rule** ensures that Dox only appears at the start of a chain. Hearing Dox mid-sequence always signals the opening of a completely new chain or cycle, making continuous chains self-parsing even without visual delimiters.

## Polyrhythm encoding

Polyrhythms are expressed by **chunking the LCM grid** into blocks that
mark each stream's accent boundaries, then voicing the full chunk sequence
while applying volume accents at each stream's downbeats.

For a **3:2 polyrhythm** (LCM = 6 beats):

```
DoRe / SoDo / ReSo
```

This chunks the 6-beat grid into three 2-beat units (marking the 3-stream)
while volume accents on the opening of each chunk mark the 2-stream's
downbeats. A single voiced phrase carries both streams.

Polyrhythm volume accents are a **solfège-wise AND operation** across layers:
a beat receives maximum volume when it is a block boundary (Dox or Dix) in
multiple simultaneous layers.

### Polyrhythm in Three-Layer Coil Notation

When multiple rhythm lines are stacked in Three-Layer Coil Notation, all Axis-marked Dox/Dix symbols across all lines serve as structural comparison points. The visual horizontal alignment of these markers across lines makes the phase relationship between rhythmic cycles directly readable — a 3-against-2 polyrhythm, for example, shows its Dox markers offset by one column, making the hemiola structure visible without calculation.

## Written notation: the Axis diacritic

In written Rhythmic Grammar, the structural anchor tokens Dox and Dix are
marked with the Axis diacritic (`x`) to visually distinguish them from
interior chain tokens:

- **Dox** — primary tonic anchor (written); `Do` (spoken)
- **Dix** — secondary tonic anchor / tritone accent (written); `Di` (spoken)

The Axis diacritic is already defined in the [Diacritic System](../uniform-solfege/diacritic-system.md)
as a structural marker (the crossing point, equidistant between territories).
Its use here as a block-boundary marker is consistent with that semantics —
Dox and Dix are crossing points between rhythmic blocks.

The spoken form drops the Axis suffix entirely. The diacritic is a notational
aid, not a phonetic instruction.

Example: `Dox–Re–Dix–So` written; `Do–Re–Di–So` spoken.

Scanning a rhythm string for `x` characters immediately reveals the block
architecture without parsing the full chain — a property useful for both
human readers and parsers.

## Enharmonic conventions and token choices

Rhythmic Grammar uses only the 12 base solfège syllables, with the following
conventions chosen for phonetic clarity:

- `Si` preferred over `Ti` for the ♮7 degree — `Si` uses a fricative
  (soft), while `Ti` uses a dental stop that could be confused with `Do`/`Di`
  (the reserved accent consonant class)
- `Di` preferred over `Ra` as the tritone accent marker — `Di` (#1) implies
  upward chromatic tension away from `Do`, whereas `Ra` (♭2) implies descending
  resolution toward `Do`; for an accent marker, tension is correct
- `Di` preferred over `Se` as the tritone marker — `Se` is already defined
  as ♭5 in Uniform Solfège; `Di` preserves enharmonic semantic clarity
- `Li` (♯6) used for step 7 of the chain if required — this is rare in
  practice (patterns of 8 beats or more are typically chained); `Ra` (♭2)
  appearing at step 7 is accepted as a compromise to preserve phonetic
  separation from `Do`/`Di`

### The Li/Te Homoglyph

`Li` and `Te` share the same Uniform Solfège glyph. In pitch solfège context, `Te` is used (the minor 7th). In Rhythmic Grammar context, `Li` is used to avoid introducing a dental consonant into the non-accent syllable stream. The notation is identical; the phonetic realisation is context-dependent.

The phonetic hierarchy:

| Class | Tokens | Consonant type | Grammatical role |
| ----- | ------ | -------------- | ---------------- |
| Accent | `Do`, `Di` | Dental stop (D) | Block openers |
| Penultimate | <span class="solfege">So</span> | Fricative (S) | Block closer / decision point |
| Interior | Re, La, Mi, Si, Fi, Ra | Liquids and nasals | Chain fill |

## Relationship to Uniform Solfège

Rhythmic Grammar is a **game played with a subset of the Uniform Solfège
deck**. It uses only the 12 base syllables — no diacritics, no microtonal
extensions — and applies a completely different rule set (CoF cadential
chains and tritone displacement) to produce rhythmic rather than pitch
descriptions.

The same string can theoretically be read as a pitch sequence or a rhythmic
grammar string. In practice these contexts are distinct enough that ambiguity
does not arise. A string following the <span class="solfege">So</span>→Dox/Dix grammar reads as rhythm; a
pitch sequence without that grammar reads as harmony or melody.

The **Axis diacritic** is the sole point of contact between the two systems:
`x` used in rhythmic notation on `Do` and `Di` marks structural boundaries (its
semantic role in the diacritic system) rather than a +3-step microtonal
inflection (its pitch-space role). The two uses are contextually distinct.

## Applications

**Metronome / practice tool**: A metronome implementing Rhythmic Grammar
accepts a chain string (e.g. `DoReDiSo`), maps each token on the CoF cadential chain, and fires that pitch at the specified BPM. The resulting pitch sequence makes grouping structure immediately audible. The tool supports listening mode (pitched clicks) and voicing mode (the player speaks the string along with the metronome).

**Pedagogy**: Chain strings serve as compact lesson briefs. "This week
we are working on `DoReDiSo`" is a complete, unambiguous instruction that a
student can look up, hear, practice, and internalise independently.

**Notation annotation**: Rhythm strings can annotate scores or lead sheets
as a compact feel indicator more expressive than a time signature alone.

**Communication**: Chain strings are speakable in conversation, writable
in a text message, and tweetable — resolving the longstanding problem that
rhythm feel has no compact natural-language vocabulary.

## See also

- [Rhythm](../domains/rhythm.md) — domain-level context and PPT grounding
- [Prime Families](../foundations/prime-families.md) — the 2-prime and 3-prime families underlying swing and metre
- [Diacritic System](../uniform-solfege/diacritic-system.md) — Axis diacritic definition and its secondary role in rhythmic notation
- [Uniform Solfège Overview](../uniform-solfege/index.md) — the parent symbol system
- [Three-Layer Coil Notation](coil-notation.md) — paper-writable surface syntax representing rhythmic layers
- [Melodic Grammar](melodic-grammar.md) — parallel grammar system for the melody layer
- [MusiCoil](musicoil.md) — the spatial notation layer; Rhythmic Grammar as a companion rhythmic encoding
