# Implementations — Agent Instructions

## Purpose

This directory is a register of existing PPT-related tools and
implementations. It records what has been built, what PPT concepts
each tool covers, and the tool's current status and relationship to
the canonical OKF.

This is not implementation documentation — do not duplicate the tool's
own docs here. It is a pointer registry: enough information for an
agent to understand what exists, what it covers, and whether it is
canonical PPT or a precursor tool that will eventually be superseded.

## Current pages

| File | Status | Description |
|---|---|---|
| `index.md` | Draft | Overview register of all implementations |
| `harmonic-geometry.md` | Draft | Harmonic Geometry app |
| `note-navigation.md` | Draft | Note Navigation app |
| `frequency-perception.md` | Draft | Frequency Perception app |
| `ppt-components.md` | Draft | ppt.midlifemuso.com component library |

## Key distinction: precursor vs. canonical

**Precursor tools** (harmonic-geometry, note-navigation,
frequency-perception) were built before PPT was formalised. They
implement related ideas — geometric harmony, staff/instrument mapping,
psychoacoustics — but not using PPT vocabulary or the OKF framework.
They are useful teaching tools and will eventually be superseded by
PPT-native components.

**Canonical implementations** (ppt-components) are built explicitly
on PPT principles using the OKF as their design reference. They use
PPT vocabulary, PPT colour semantics, and the component architecture
described in [Component Philosophy](../applications/component-philosophy.md).

When adding new implementation entries, classify them as precursor or
canonical in the page frontmatter.