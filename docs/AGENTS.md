# GitHub Pages / Components — Agent Instructions

## Purpose

Static site and interactive components served via GitHub Pages. This directory
is the *output layer* — it presents PPT concepts in interactive and visual form.
Content here is derived from and linked to the OKF bundle in `../okf/`.

## Architecture

- **Framework:** Static HTML + vanilla JS (no build step required for GitHub Pages)
- **Styling:** CSS custom properties for theming; no external CSS framework
- **Components:** Self-contained in their own subdirectory with an `index.html`
- **Shared assets:** `assets/` for fonts, the Uniform Solfège character set SVGs,
  and shared CSS

## Component index

| Directory | Status | Description |
|---|---|---|
| `components/circle-of-fifths/` | Stub | Interactive circle of fifths with prime family highlighting |
| `components/tone-atlas/` | Stub | Clock-face pitch relationship diagram |
| `components/keyboard/` | Stub | Piano keyboard with Uniform Solfège labels |
| `components/fretboard/` | Stub | Guitar fretboard with interval visualisation |
| `components/harmonic-geometry/` | Stub | Harmonic geometry / interval lattice explorer |

## Component conventions

Each component directory must contain:
- `index.html` — self-contained component (CSS and JS inline or in same dir)
- `README.md` — links to the OKF concept page(s) this component illustrates

Every component must link back to the relevant OKF concept page. Example:
```html
<a href="../../okf/uniform-solfege/index.md">About Uniform Solfège →</a>
```

## Priority components to build

### `circle-of-fifths/`
Core interactive tool. Requirements:
- 12 positions on a circle, labelled with Uniform Solfège syllables
- Click a position to highlight its prime family (colour-coded: 2=grey,
  3=blue, 5=green, 7=amber, 11=purple)
- Show interval distance from selected root
- Toggle between 12TET and 31 EDO modes (showing diacritic positions)

### `tone-atlas/`
The clock-face diagram that is central to PPT. Requirements:
- Clock face with 12 chromatic positions
- Selectable root; intervals shown as arcs
- Prime family colour coding consistent with circle-of-fifths component

## Shared design tokens

```css
--prime-2: #6b7280;   /* grey — octave/duple */
--prime-3: #3b82f6;   /* blue — fifths/triple */
--prime-5: #22c55e;   /* green — thirds/quintal */
--prime-7: #f59e0b;   /* amber — septimal */
--prime-11: #a855f7;  /* purple — neutral/undecimal */
--axis: #ec4899;      /* pink — axis / 50-cent midpoint */
```

These colours must be used consistently across all components.
