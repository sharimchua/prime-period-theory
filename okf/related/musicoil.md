---
type: concept
title: MusiCoil
description: >
  The spatial notation system and visual representation of PPT. This document
  currently contains integration details with Three-Layer Coil Notation; the
  full specification is forthcoming.
tags:
  - musicoil
  - notation
  - spatial-notation
  - coil
  - prime-period-theory
related:
  - related/coil-notation.md
  - related/melodic-grammar.md
  - uniform-solfege/index.md
timestamp: 2026-06-29
---

# MusiCoil

> [!NOTE]
> This is a skeleton page. The full formal specification of MusiCoil is forthcoming. The sections below describe its integration with recently developed notation layers.

## Overview

MusiCoil is the spatial notation system and visual representation of the Prime Period Theory (PPT) framework. It provides a non-linear, cyclical compositional grammar based on normalisation and coil reuse.

## Compaction Layer

Three-Layer Coil Notation serves as the **compaction layer** that MusiCoil previously lacked. The MusiCoil digital representation is the *expansion* form of a musical idea; Three-Layer Coil Notation is the *compact written form* of the same idea. 

The full pipeline is:

> Sketch on paper (Three-Layer Coil Notation) → expand digitally (MusiCoil representation) → normalise into Coils → reference compositionally

This pipeline gives the PPT framework a zero-device entry point for the first time.

## Barline Removal Connection

MusiCoil's barline removal principle connects directly to the Coil boundary model in Three-Layer Coil Notation. Barlines in standard notation force phrase boundaries to align with metrical boundaries — syncopation requires ties, and odd-length phrases look cluttered. 

Coil boundaries replace barlines entirely: a Coil ends where a musical phrase ends, regardless of metrical position. This decouples phrase and metre at the notational level.

## See also

- [Three-Layer Coil Notation](coil-notation.md) — the paper-writable surface syntax
- [Melodic Grammar](melodic-grammar.md) — the melodic layer convention for Three-Layer Coil Notation, inheriting MusiCoil node/path concepts
- [Uniform Solfège](../uniform-solfege/index.md) — the symbol vocabulary
