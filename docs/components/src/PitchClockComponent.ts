import { BasePPTComponent } from './BasePPTComponent.js';

// Canonical Uniform Solfège SVG Path data (from assets/svg/base.svg, sharp.svg, flat.svg)
const PATH_BASE = 'M 26.2,80.6 L 38.9,67.4 L 55.9,49.8 L 75,30.2 L 84.8,0 L 75,-30.2 L 71.4,-41.2 L 68.6,-49.8 L 40.5,-70.2 L 26.2,-80.6 L 0,-84.8 L -26.2,-80.6 L -40.5,-70.2 L -68.6,-49.8 L -71.4,-41.2 L -75,-30.2 L -84.8,0 L -75,30.2 L -55.9,49.8 L -38.9,67.4 L -26.2,80.6 L -25,43.2 L -33,38.1 L -40.7,29.2 L -44,25.4 L -47.3,21.6 L -48.3,14.2 L -50.4,0 L -48.3,-14.2 L -44.5,-22.6 L -39.3,-34 L -33,-38.1 L -25,-43.2 L -20.9,-45.8 L -14.7,-49.8 L 0,-50.4 L 14.7,-49.8 L 20.9,-45.8 L 25,-43.2 L 33,-38.1 L 39.3,-34 L 44.5,-22.6 L 48.3,-14.2 L 50.4,0 L 48.3,14.2 L 47.3,21.6 L 44,25.4 L 40.7,29.2 L 33,38.1 L 25,43.2 Z';
const PATH_SHARP = 'M 0,100 L 0,80.7 L 0.1,80.6 L 26.2,80.6 L 38.9,67.4 L 44.7,61.5 L 46.2,59.9 L 55.9,49.8 L 28.8,49.8 L 14.8,74 L 11,80.6 L 0,80.6 L 0,52 L 7.2,49.9 L 14.6,49.9 L 14.7,49.8 L 7.3,49.8 L 20.9,45.8 L 25,43.2 L 33,38.1 L 40.7,29.2 L 42.4,27.2 L 44,25.4 L 47.3,21.6 L 48,16.5 L 48.3,14.2 L 50.4,0 L 51.4,-7.4 L 48.3,-14.2 L 44.5,-22.6 L 43.4,-25 L 42.4,-27.2 L 39.3,-34 L 37.1,-35.4 L 33,-38.1 L 25,-43.2 L 20.9,-45.8 L 14.7,-49.8 L 14.6,-49.9 L -14.6,-49.9 L -14.7,-49.8 L -20.9,-45.8 L -25,-43.2 L -33,-38.1 L -37.1,-35.4 L -39.3,-34 L -42.4,-27.2 L -43.4,-25 L -44.5,-22.6 L -48.3,-14.2 L -51.4,-7.4 L -50.4,0 L -48.3,14.2 L -48,16.5 L -47.3,21.6 L -44,25.4 L -42.4,27.2 L -40.7,29.2 L -33,38.1 L -25,43.2 L -25.7,44.4 L -28.8,49.8 L -56,49.8 L -66.8,38.6 L -69.7,35.6 L -75,30.2 L -84.8,0 L -75,-30.2 L -71.4,-41.2 L -68.6,-49.8 L -40.5,-70.2 L -26.2,-80.6 L 26.2,-80.6 L 11,-80.6 L 26.2,-80.6 L 40.5,-70.2 L 68.6,-49.8 L 71.4,-41.2 L 75,-30.2 L 84.8,0 L 75,30.2 L 81.1,40.8 L 86.3,49.8 L 86.6,50 A 100,100 0 0 1 58.8,80.9 A 100,100 0 0 1 50,86.6 A 100,100 0 0 1 0,100 Z';
const PATH_FLAT = 'M 0,100 A 100,100 0 0 1 -50,86.6 A 100,100 0 0 1 -58.8,80.9 A 100,100 0 0 1 -86.6,50 L -86.3,49.8 L -81.1,40.8 L -75,30.2 L -84.8,0 L -75,-30.2 L -71.4,-41.2 L -68.6,-49.8 L -40.5,-70.2 L -26.2,-80.6 L 26.2,-80.6 L 11,-80.6 L 26.2,-80.6 L 40.5,-70.2 L 68.6,-49.8 L 71.4,-41.2 L 75,-30.2 L 84.8,0 L 75,30.2 L 69.7,35.6 L 66.8,38.6 L 55.9,49.8 L 28.8,49.8 L 25.7,44.4 L 25,43.2 L 33,38.1 L 40.7,29.2 L 42.4,27.2 L 44,25.4 L 47.3,21.6 L 48,16.5 L 48.3,14.2 L 50.4,0 L 51.4,-7.4 L 48.3,-14.2 L 44.5,-22.6 L 43.4,-25 L 42.4,-27.2 L 39.3,-34 L 37.1,-35.4 L 33,-38.1 L 25,-43.2 L 20.9,-45.8 L 14.7,-49.8 L 14.6,-49.9 L -14.6,-49.9 L -14.7,-49.8 L -20.9,-45.8 L -25,-43.2 L -33,-38.1 L -37.1,-35.4 L -39.3,-34 L -42.4,-27.2 L -43.4,-25 L -44.5,-22.6 L -48.3,-14.2 L -51.4,-7.4 L -50.4,0 L -48.3,14.2 L -48,16.5 L -47.3,21.6 L -44,25.4 L -42.4,27.2 L -40.7,29.2 L -33,38.1 L -25,43.2 L -20.9,45.8 L -7.3,49.8 L -14.7,49.8 L -14.6,49.9 L -7.2,49.9 L 0,52 L 0,80.6 L -11,80.6 L -14.8,74 L -28.8,49.8 L -56,49.8 L -46.3,59.9 L -44.7,61.5 L -38.9,67.5 L -26.2,80.6 L -0.1,80.6 L 0,80.7 L 0,99.7 Z';

// Canonical Uniform Solfège Rotations:
// 0° (Top / 12 o'clock): Do (Base), Ra/Di (Sharp), Ti (Flat)
// 90° (Right / 3 o'clock): Re (Flat), Me/Ri (Base), Mi (Sharp)
// 180° (Bottom / 6 o'clock): Fa (Flat), Fi/Se (Base), So/Si (Sharp)
// 270° (Left / 9 o'clock): Le (Flat), La/Li (Base), Te (Sharp)
export const UNIFORM_SOLFEGE_SPECS: Record<string, { glyphType: 'base' | 'sharp' | 'flat'; rotation: number; colorHex: string }> = {
  Do: { glyphType: 'base', rotation: 0, colorHex: '#E13610' },
  Ra: { glyphType: 'sharp', rotation: 0, colorHex: '#EA580C' },
  Di: { glyphType: 'sharp', rotation: 0, colorHex: '#EA580C' },
  Re: { glyphType: 'flat', rotation: 90, colorHex: '#EA580C' },
  Me: { glyphType: 'base', rotation: 90, colorHex: '#CA8A04' },
  Ri: { glyphType: 'base', rotation: 90, colorHex: '#CA8A04' },
  Mi: { glyphType: 'sharp', rotation: 90, colorHex: '#CA8A04' },
  Fa: { glyphType: 'flat', rotation: 180, colorHex: '#16A34A' },
  Fi: { glyphType: 'base', rotation: 180, colorHex: '#334155' },
  Se: { glyphType: 'base', rotation: 180, colorHex: '#334155' },
  So: { glyphType: 'sharp', rotation: 180, colorHex: '#0284C7' },
  Le: { glyphType: 'flat', rotation: 270, colorHex: '#7C3AED' },
  Si: { glyphType: 'flat', rotation: 270, colorHex: '#7C3AED' },
  La: { glyphType: 'base', rotation: 270, colorHex: '#7C3AED' },
  Te: { glyphType: 'sharp', rotation: 270, colorHex: '#DB2777' },
  Li: { glyphType: 'sharp', rotation: 270, colorHex: '#DB2777' },
  Ti: { glyphType: 'flat', rotation: 0, colorHex: '#DB2777' }
};

export const PITCH_NAMES_DUAL = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
export const PITCH_NAMES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const PITCH_NAMES_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
export const SOLFEGE_SYLLABLES = ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Fi', 'So', 'Le', 'La', 'Te', 'Ti'];
export const SCALE_DEGREES = ['1', '♭2', '2', '♭3', '3', '4', '♯4/♭5', '5', '♭6', '6', '♭7', '7'];

// Piano Triangle Topography (Down, Left, Up, Right)
export const PITCH_CLASS_TO_PIANO_TRIANGLE: Record<number, { triangle: 'D' | 'L' | 'U' | 'R'; point: 1 | 2 | 3 }> = {
  0: { triangle: 'R', point: 3 },  // C
  1: { triangle: 'D', point: 1 },  // C#
  2: { triangle: 'D', point: 2 },  // D
  3: { triangle: 'D', point: 3 },  // D#
  4: { triangle: 'L', point: 1 },  // E
  5: { triangle: 'L', point: 2 },  // F
  6: { triangle: 'L', point: 3 },  // F#
  7: { triangle: 'U', point: 1 },  // G
  8: { triangle: 'U', point: 2 },  // G#
  9: { triangle: 'U', point: 3 },  // A
  10: { triangle: 'R', point: 1 }, // A# / Bb
  11: { triangle: 'R', point: 2 }, // B
};

export const TRIANGLE_COORDINATES: Record<string, { path: string; points: Record<number, { x: number; y: number }> }> = {
  D: {
    path: 'M 18 25 L 82 25 L 50 82 Z',
    points: { 1: { x: 18, y: 25 }, 2: { x: 50, y: 82 }, 3: { x: 82, y: 25 } }
  },
  L: {
    path: 'M 18 82 L 82 82 L 82 18 Z',
    points: { 1: { x: 18, y: 82 }, 2: { x: 82, y: 82 }, 3: { x: 82, y: 18 } }
  },
  U: {
    path: 'M 18 82 L 50 18 L 82 82 Z',
    points: { 1: { x: 18, y: 82 }, 2: { x: 50, y: 18 }, 3: { x: 82, y: 82 } }
  },
  R: {
    path: 'M 18 18 L 18 82 L 82 82 Z',
    points: { 1: { x: 18, y: 18 }, 2: { x: 18, y: 82 }, 3: { x: 82, y: 82 } }
  }
};

export function parseTonic(tonic: string | number): number {
  if (typeof tonic === 'number') {
    return ((Math.floor(tonic) % 12) + 12) % 12;
  }
  if (!tonic) return 0;
  const rawStr = String(tonic).trim();
  const directNum = parseInt(rawStr, 10);
  if (!isNaN(directNum) && /^\d+$/.test(rawStr)) {
    return ((directNum % 12) + 12) % 12;
  }

  let str = rawStr.toLowerCase();
  // Strip trailing octave numbers (e.g. C4 -> c, Eb4 -> eb, F#3 -> f#)
  str = str.replace(/\d+$/, '');
  const pitchMap: Record<string, number> = {
    c: 0, 'c#': 1, 'c♯': 1, db: 1, 'd♭': 1,
    d: 2, 'd#': 3, 'd♯': 3, eb: 3, 'e♭': 3,
    e: 4,
    f: 5, 'f#': 6, 'f♯': 6, gb: 6, 'g♭': 6,
    g: 7, 'g#': 8, 'g♯': 8, ab: 8, 'a♭': 8,
    a: 9, 'a#': 10, 'a♯': 10, bb: 10, 'b♭': 10,
    b: 11
  };
  if (pitchMap[str] !== undefined) return pitchMap[str];
  return 0;
}

export const PRESET_SCALES: Record<string, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  ionian: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  melodic_minor: [0, 2, 3, 5, 7, 9, 11],
  pentatonic_major: [0, 2, 4, 7, 9],
  pentatonic_minor: [0, 3, 5, 7, 10],
  whole_tone: [0, 2, 4, 6, 8, 10],
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],
  triad_major: [0, 4, 7],
  triad_minor: [0, 3, 7],
  triad_diminished: [0, 3, 6],
  triad_augmented: [0, 4, 8],
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10]
};

export class PitchClockComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Pitch Clock',
      familyColor: '#3B82F6',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel', 'ppt-box', 'ppt-flex']
    };
  }

  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      'tonic',
      'representations',
      'scale',
      'active-pitches',
      'orientation',
      'accidental-style',
      'interactive'
    ];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      tonic: { type: 'string', default: 'C', description: 'Root/Tonic pitch class (e.g. C, D, F#, 0)' },
      representations: {
        type: 'string',
        default: 'pitch-names,solfege,scale-degrees,solfege-glyphs,piano-triangles',
        description: 'Comma-separated representations: pitch-names, solfege, scale-degrees, solfege-glyphs, piano-triangles'
      },
      scale: { type: 'string', default: '', description: 'Scale/chord preset (e.g. major, dorian, dom7)' },
      'active-pitches': { type: 'string', default: '', description: 'Comma/space-separated pitch classes to highlight' },
      orientation: {
        type: 'enum',
        options: ['tonic-top', 'c-top'],
        default: 'tonic-top',
        description: 'Whether 12 o\'clock position is the active Tonic or fixed C'
      },
      'accidental-style': {
        type: 'enum',
        options: ['dual', 'sharp', 'flat'],
        default: 'dual',
        description: 'Pitch naming convention: dual (C♯/D♭), sharp (C♯), or flat (D♭)'
      },
      interactive: { type: 'boolean', default: true, description: 'Enable clicking pitch nodes' }
    };
  }

  private _resizeObserver: ResizeObserver | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.render();
    this.setupResizeObserver();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  override attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue !== newValue) {
      this.render();
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => {
      // Responsive layout
    });
    this._resizeObserver.observe(this);
  }

  private getActivePitches(tonicIdx: number): Set<number> {
    const active = new Set<number>();
    const scaleAttr = (this.getAttribute('scale') || '').trim().toLowerCase().replace(/[-\s]+/g, '_');
    if (scaleAttr && PRESET_SCALES[scaleAttr]) {
      for (const semitone of PRESET_SCALES[scaleAttr]) {
        active.add((tonicIdx + semitone) % 12);
      }
    }

    const pitchesAttr = this.getAttribute('active-pitches') || '';
    if (pitchesAttr.trim()) {
      pitchesAttr.split(/[,\s]+/).filter(Boolean).forEach(token => {
        const num = parseInt(token, 10);
        if (!isNaN(num)) {
          active.add(((num % 12) + 12) % 12);
        } else {
          active.add(parseTonic(token));
        }
      });
    }
    return active;
  }

  private getPitchNamesArray(): string[] {
    const style = this.getAttribute('accidental-style') || 'dual';
    if (style === 'sharp') return PITCH_NAMES_SHARP;
    if (style === 'flat') return PITCH_NAMES_FLAT;
    return PITCH_NAMES_DUAL;
  }

  private render() {
    if (!this.shadowRoot) return;

    const tonicAttr = this.getAttribute('tonic') || 'C';
    const tonicIdx = parseTonic(tonicAttr);
    const orientation = this.getAttribute('orientation') || 'c-top';
    const reprAttr = this.getAttribute('representations') || 'pitch-names,solfege,scale-degrees,solfege-glyphs,piano-triangles';
    const reprSet = new Set(reprAttr.split(',').map(s => s.trim().toLowerCase()));

    const activePitches = this.getActivePitches(tonicIdx);
    const pitchNames = this.getPitchNamesArray();

    const nodes = [];
    const radius = 37.5;
    const centerX = 50;
    const centerY = 50;

    for (let pos = 0; pos < 12; pos++) {
      const angleRad = (pos * 30 - 90) * (Math.PI / 180);
      const cx = centerX + radius * Math.cos(angleRad);
      const cy = centerY + radius * Math.sin(angleRad);

      const pitchClass = orientation === 'tonic-top' ? (tonicIdx + pos) % 12 : pos;
      const semitone = ((pitchClass - tonicIdx) % 12 + 12) % 12;
      const isTonic = semitone === 0;
      const isActive = activePitches.has(pitchClass);
      const solfege = SOLFEGE_SYLLABLES[semitone];
      const spec = UNIFORM_SOLFEGE_SPECS[solfege] || UNIFORM_SOLFEGE_SPECS['Do'];
      const ptInfo = PITCH_CLASS_TO_PIANO_TRIANGLE[pitchClass];

      // Uniform Solfege SVG
      let pathD = PATH_BASE;
      if (spec.glyphType === 'sharp') pathD = PATH_SHARP;
      else if (spec.glyphType === 'flat') pathD = PATH_FLAT;

      const glyphSvg = `
        <svg viewBox="-120 -120 240 240" class="solfege-glyph-svg" style="transform: rotate(${spec.rotation}deg);">
          <path d="${pathD}" fill="${spec.colorHex}" stroke="#0f172a" stroke-width="6" transform="scale(1, -1)" />
        </svg>
      `;

      // Piano Triangle Mini SVG
      const triGeom = TRIANGLE_COORDINATES[ptInfo.triangle];
      const triCircles = [1, 2, 3].map(pt => {
        const coords = triGeom.points[pt];
        const isPointActive = pt === ptInfo.point;
        return `<circle cx="${coords.x}" cy="${coords.y}" r="${isPointActive ? 11 : 6.5}" fill="${isPointActive ? spec.colorHex : '#ffffff'}" stroke="${isPointActive ? '#0f172a' : '#64748b'}" stroke-width="${isPointActive ? 3 : 1.5}" opacity="${isPointActive ? 1 : 0.6}" />`;
      }).join('');

      const triangleSvg = `
        <div class="piano-tri-wrapper">
          <svg viewBox="0 0 100 100" class="piano-tri-svg">
            <path d="${triGeom.path}" fill="none" stroke="#475569" stroke-width="3.5" stroke-linejoin="round" />
            ${triCircles}
          </svg>
        </div>
      `;

      nodes.push({
        pos,
        pitchClass,
        semitone,
        isTonic,
        isActive,
        cx,
        cy,
        pitchName: pitchNames[pitchClass],
        solfege,
        colorHex: spec.colorHex,
        degree: SCALE_DEGREES[semitone],
        glyphSvg,
        triangleSvg
      });
    }

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}

        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 100%;
          aspect-ratio: 1;
          background: transparent;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          user-select: none;
        }

        .clock-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        svg.clock-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .clock-ring-outer {
          fill: none;
          stroke: #475569;
          stroke-width: 1.5;
          stroke-dasharray: 2 4;
          opacity: 0.4;
        }

        .clock-ring-main {
          fill: none;
          stroke: #64748b;
          stroke-width: 2;
          opacity: 0.5;
        }

        .center-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: max(42px, 14cqi);
          height: max(42px, 14cqi);
          border-radius: 50%;
          background: #ffffff;
          border: 2.5px solid #2563eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          z-index: 5;
          cursor: pointer;
          text-align: center;
        }

        .hub-title {
          font-size: max(6px, 1.8cqi);
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: 0.05em;
        }

        .hub-value {
          font-size: max(11px, 3.6cqi);
          font-weight: 800;
          color: #1d4ed8;
          line-height: 1.1;
        }

        .pitch-node {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: max(8px, 2.5cqi);
          padding: max(3px, 0.8cqi) max(6px, 1.4cqi);
          background: #ffffff;
          border: 2px solid var(--node-color, #94a3b8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
          z-index: 10;
          min-width: max(32px, 10cqi);
          text-align: center;
          gap: max(1px, 0.3cqi);
        }

        .pitch-node:hover {
          transform: translate(-50%, -50%) scale(1.18);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          z-index: 20;
          border-color: #2563eb;
        }

        .pitch-node.is-tonic {
          border-width: 3px;
          border-color: #E13610 !important;
          box-shadow: 0 0 0 3.5px rgba(225, 54, 16, 0.3), 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .pitch-node.is-active {
          background: #f0fdf4;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.35);
        }

        .node-glyph-box {
          width: max(16px, 4.4cqi);
          height: max(16px, 4.4cqi);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .solfege-glyph-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .node-solfege {
          font-size: max(8px, 2.7cqi);
          font-weight: 800;
          color: var(--node-color, #0f172a);
          line-height: 1;
        }

        .node-pitch-name {
          font-size: max(8px, 2.5cqi);
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }

        .node-degree {
          font-size: max(6px, 1.9cqi);
          font-weight: 700;
          color: #475569;
          line-height: 1;
        }

        .piano-tri-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }

        .piano-tri-svg {
          width: max(16px, 4.2cqi);
          height: max(16px, 4.2cqi);
          overflow: visible;
        }
      </style>

      <div class="clock-container">
        <svg class="clock-canvas" viewBox="0 0 100 100">
          <circle class="clock-ring-outer" cx="50" cy="50" r="46" />
          <circle class="clock-ring-main" cx="50" cy="50" r="${radius}" />
        </svg>

        <div class="center-hub" title="Tonic: ${pitchNames[tonicIdx]} (Click to advance)">
          <span class="hub-title">TONIC</span>
          <span class="hub-value">${pitchNames[tonicIdx]}</span>
        </div>

        ${nodes.map(node => `
          <div 
            class="pitch-node ${node.isTonic ? 'is-tonic' : ''} ${node.isActive ? 'is-active' : ''}"
            style="left: ${node.cx.toFixed(2)}%; top: ${node.cy.toFixed(2)}%; --node-color: ${node.colorHex};"
            data-pitch-class="${node.pitchClass}"
            data-semitone="${node.semitone}"
            data-is-tonic="${node.isTonic}"
            title="${node.pitchName} • Solfège: ${node.solfege} • Degree: ${node.degree}"
          >
            ${reprSet.has('solfege-glyphs') ? `<div class="node-glyph-box">${node.glyphSvg}</div>` : ''}
            ${reprSet.has('solfege') ? `<span class="node-solfege">${node.solfege}</span>` : ''}
            ${reprSet.has('pitch-names') ? `<span class="node-pitch-name">${node.pitchName}</span>` : ''}
            ${reprSet.has('scale-degrees') ? `<span class="node-degree">${node.degree}</span>` : ''}
            ${reprSet.has('piano-triangles') ? node.triangleSvg : ''}
          </div>
        `).join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('.pitch-node').forEach(el => {
      const pitchClass = parseInt(el.getAttribute('data-pitch-class') || '0', 10);
      const semitone = parseInt(el.getAttribute('data-semitone') || '0', 10);
      const isTonic = el.getAttribute('data-is-tonic') === 'true';

      el.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('ppt-pitch-selected', {
          bubbles: true,
          composed: true,
          detail: { pitchClass, pitchName: pitchNames[pitchClass], solfege: SOLFEGE_SYLLABLES[semitone], degree: SCALE_DEGREES[semitone], isTonic }
        }));
      });

      el.addEventListener('dblclick', () => {
        this.setAttribute('tonic', String(pitchClass));
        this.dispatchEvent(new CustomEvent('ppt-tonic-changed', {
          bubbles: true,
          composed: true,
          detail: { tonicIndex: pitchClass, tonicName: pitchNames[pitchClass] }
        }));
      });
    });

    const hub = this.shadowRoot.querySelector('.center-hub');
    if (hub) {
      hub.addEventListener('click', () => {
        const next = (tonicIdx + 1) % 12;
        this.setAttribute('tonic', String(next));
        this.dispatchEvent(new CustomEvent('ppt-tonic-changed', {
          bubbles: true,
          composed: true,
          detail: { tonicIndex: next, tonicName: pitchNames[next] }
        }));
      });
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ppt-pitch-clock')) {
  customElements.define('ppt-pitch-clock', PitchClockComponent);
}
