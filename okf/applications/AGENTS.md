# Applications — Agent Instructions

## Purpose

This directory covers the philosophy and intent behind PPT-native tools
and interactive implementations. It is not implementation documentation
(that lives in implementations/ or in the component library itself) —
it is the *why*: what does a tool built on PPT principles do, and why
does it do it that way?

Pages here bridge the abstract theory (foundations/, perception/) and
the concrete tools (implementations/). They are written for tool
builders and educators who want to understand the design rationale,
not for end users of specific tools.

## Current pages

| File | Status | Description |
|---|---|---|
| `index.md` | Draft | Overview of the applications layer |
| `component-philosophy.md` | Draft | The ppt-period primitive; unified pitch/rhythm component architecture |
| `visualisation.md` | Draft | PPT ratio visualisation across Metric DuPeriods; the solfège showcase intent |
| `play-along.md` | Draft | Play-along feedback philosophy; three feedback models |
| `transcription.md` | Draft | Melody-first → progressive specification workflow |
| `notation-input.md` | Complete | How the MIDI to Solfège Input Specification serves as input for PPT tools |

## Tone guidance

Applications pages should be concrete and design-oriented. They explain
why a tool works the way it does, what PPT principle it implements, and
what a learner or user gains from that design. Avoid general theory
statements — link to the OKF pages that carry those. Focus on the
*translation* from theory to tool.