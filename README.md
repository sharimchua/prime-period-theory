# Prime Period Theory

<table width="100%">
  <tr>
    <td bgcolor="white" align="center">
      <img src="resources/Logo.svg" alt="Prime Period Theory Logo" width="300" />
    </td>
  </tr>
</table>

A descriptive framework for musical structure, grounded in the physics of
amplitude and time, organised through the mathematics of prime-generated
periodic relationships.

## What this is

Prime Period Theory (PPT) proposes that the structural relationships within
music — across pitch, rhythm, and timbre — are all expressions of a single
underlying phenomenon: **periodic signals in time, organised through prime
ratios**.

It is offered as a lens, not a law. A vocabulary for making musical structure
more legible and intentional — in the same way that geometry and colour theory
serve visual artists — without constraining what music can be or mean.

## Repository structure

This repository houses the entire PPT ecosystem:

```text
okf/                    # The Open Knowledge Format bundle (AI-readable semantic core)
├── index.md            # Entry point and concept map
├── foundations/        # Core theoretical claims (periodicity, prime families, etc.)
├── uniform-solfege/    # The base-12 notation layer
├── domains/            # Application domains (pitch, rhythm, timbre)
├── tuning/             # Tuning systems (31 EDO, 72 EDO, just intonation)
├── pedagogy/           # Pedagogy and learning paths
├── applications/       # Unified tool architecture philosophy
├── implementations/    # Interactive tool registry
└── related/            # Connected systems (MusiCoil, Rhythmic/Melodic Grammar)

docs/                   # The Astro-powered Documentation Website
├── components/         # Independent Vanilla JS Web Components (the PPT toolkit)
│   └── src/            # Component source files (Period, Title, Panel, etc.)
├── src/                # Astro site source code
│   ├── layouts/        # Global page layouts and CSS variables
│   ├── pages/          # Site routes (Home, Components, Reference, Topics)
│   └── content/        # Markdown collections for the site
└── public/             # Static assets

resources/              # Brand assets and logos
AGENTS.md               # DOX instruction rules for autonomous AI agents
```

## Interactive Web Components & Composer

Beyond static theory, PPT provides a library of framework-agnostic **Web Components** built with Vanilla JavaScript and encapsulated using Shadow DOM. These components allow anyone to build interactive musical diagrams (like Tonal Clocks and Harmonic Geometries) by simply writing semantic HTML tags like `<ppt-period>` and `<ppt-period-step-circle>`.

To make building these diagrams even easier, the repository includes a visual **Component Composer** (`/components/designer` in the docs). This tool offers a drag-and-drop workspace, properties panel, DOM tree editor, and real-time HTML/Payload generation, allowing you to design diagrams without writing code by hand.

See the `docs/components/` directory for the source code, or explore the [interactive component showcase](https://ppt.midlifemuso.com/components) on the live documentation site.

## The OKF Bundle

The `okf/` directory is a conformant [Open Knowledge Format (OKF) v0.1](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) bundle. 

Each file is a markdown concept document with YAML frontmatter. The documents link to each other, forming a semantic knowledge graph that is both human-readable and designed to be effortlessly ingested by AI agents. Start at [`okf/index.md`](okf/index.md).

## Local Development

If you'd like to run the interactive documentation site and component sandbox locally:

```bash
cd docs
npm install
npm run dev
```

## Licensing & Open Source

This project uses a dual-licensing model to keep the framework open and accessible while allowing free integration of the tools:

- **Theoretical Framework & OKF Bundle**: Licensed under **[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)**. You are free to use, share, adapt, and build upon these concepts for any purpose, provided you give appropriate attribution.
- **Web Components & Site Source Code**: Licensed under the **[MIT License](https://opensource.org/licenses/MIT)**, allowing you to freely integrate the interactive tools into your own projects.

## Status

**Active Development.** This is an evolving, living project that continuously refines the theoretical concepts while expanding the interactive toolset.

## Author

**Sharim Chua** — Melbourne, Australia  
[Midlife Muso](https://midlifemuso.com/) | [Respec.work](https://respec.work/)
