import { BasePPTComponent } from './BasePPTComponent.js';

import doSvgRaw from '../../src/assets/solfege-svgs/solfege_glyph_do.svg?raw';
import raSvgRaw from '../../src/assets/solfege-svgs/solfege_glyph_ra.svg?raw';
import tiSvgRaw from '../../src/assets/solfege-svgs/solfege_glyph_ti.svg?raw';

import axisSvgRaw from '../../src/assets/solfege-svgs/solfege_diacritic_axis.svg?raw';
import dDutriSvgRaw from '../../src/assets/solfege-svgs/solfege_diacritic_d_dutri.svg?raw';
import dTriSvgRaw from '../../src/assets/solfege-svgs/solfege_diacritic_d_tri.svg?raw';
import wDutriSvgRaw from '../../src/assets/solfege-svgs/solfege_diacritic_w_dutri.svg?raw';
import wTriSvgRaw from '../../src/assets/solfege-svgs/solfege_diacritic_w_tri.svg?raw';

const SVG_MAP: Record<string, { svg: string, rot: number }> = {
  do: { svg: doSvgRaw, rot: 0 },
  di: { svg: raSvgRaw, rot: 0 },
  ra: { svg: raSvgRaw, rot: 0 },
  re: { svg: tiSvgRaw, rot: 90 },
  ri: { svg: doSvgRaw, rot: 90 },
  me: { svg: doSvgRaw, rot: 90 },
  mi: { svg: raSvgRaw, rot: 90 },
  fa: { svg: tiSvgRaw, rot: 180 },
  fi: { svg: doSvgRaw, rot: 180 },
  so: { svg: raSvgRaw, rot: 180 },
  le: { svg: tiSvgRaw, rot: 270 },
  la: { svg: doSvgRaw, rot: 270 },
  se: { svg: raSvgRaw, rot: 270 },
  te: { svg: raSvgRaw, rot: 270 },
  si: { svg: tiSvgRaw, rot: 0 },
  ti: { svg: tiSvgRaw, rot: 0 }
};

const DIACRITIC_MAP: Record<string, string> = {
  w_tri: wTriSvgRaw,
  w_dutri: wDutriSvgRaw,
  d_dutri: dDutriSvgRaw,
  d_tri: dTriSvgRaw,
  axis: axisSvgRaw
};

function processSvg(raw: string) {
  if (!raw) return '';
  return raw
    .replace(/fill="#000000"/gi, 'fill="currentColor"')
    .replace(/fill:#000000/gi, 'fill:currentColor')
    .replace(/stroke="#000000"/gi, 'stroke="currentColor"')
    .replace(/stroke:#000000/gi, 'stroke:currentColor')
    .replace(/width="\d+"/gi, 'width="100%"')
    .replace(/height="\d+"/gi, 'height="100%"');
}

import { parseSolfegeToken } from './solfegeUtils.js';

export class UniformSolfegeComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Solfege Glyph',
      familyColor: '#f39c12',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel', 'ppt-solfege-phrase']
    };
  }
  
  static override get observedAttributes() {
    return [...super.observedAttributes, 'solfege', 'color', 'diacritic-color', 'annotation-align', 'annotation-color', 'annotation-padding', 'superscript-offset-x', 'superscript-offset-y', 'size'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      solfege: { type: 'string', default: 'Do', description: 'Base solfege string (e.g., Do, ReSub, Dox^MiSup)' },
      color: { type: 'color', default: '', description: 'Override base color' },
      'diacritic-color': { type: 'color', default: '', description: 'Override diacritic color' },
      'annotation-align': { type: 'enum', options: ['none', 'top', 'bottom'], default: 'none', description: 'Alignment of the solfege annotation text' },
      'annotation-color': { type: 'color', default: '', description: 'Override annotation color' },
      'annotation-padding': { type: 'string', default: '-0.4em', description: 'Padding between glyph and annotation' },
      'superscript-offset-x': { type: 'string', default: '0.25em', description: 'Horizontal offset for superscript' },
      'superscript-offset-y': { type: 'string', default: '-0.4em', description: 'Vertical offset for superscript' },
      'size': { type: 'string', default: '1em', description: 'Size of the solfege glyph' }
    };
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (['solfege', 'color', 'diacritic-color', 'annotation-align', 'annotation-color', 'annotation-padding', 'superscript-offset-x', 'superscript-offset-y', 'size'].includes(name)) {
      this.render();
    }
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

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => {
      this.adjustAnnotationScale();
    });
    this._resizeObserver.observe(this);
  }

  private adjustAnnotationScale() {
    if (!this.shadowRoot) return;
    const annotation = this.shadowRoot.querySelector('.solfege-annotation') as HTMLElement;
    const core = this.shadowRoot.querySelector('.solfege-core') as HTMLElement;
    if (!annotation || !core) return;

    annotation.style.transform = '';

    const annoWidth = annotation.getBoundingClientRect().width;
    const coreWidth = core.getBoundingClientRect().width;

    if (annoWidth > 0 && coreWidth > 0 && annoWidth > coreWidth) {
      let scale = coreWidth / annoWidth;
      
      // Enforce a minimum visual font size of 9px to keep it legible
      const computedStyle = window.getComputedStyle(annotation);
      const computedFontSize = parseFloat(computedStyle.fontSize);
      if (computedFontSize > 0) {
        const minScale = 9 / computedFontSize;
        if (scale < minScale) {
          scale = minScale;
        }
      }
      annotation.style.transform = `scale(${scale})`;
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const solfegeStr = this.getAttribute('solfege') || 'Do';
    const annotationAlign = this.getAttribute('annotation-align') || 'none';
    
    const parsed = parseSolfegeToken(solfegeStr);
    const solfege = parsed.solfege;
    const diacritic = parsed.diacritic;
    const superscriptObj = parsed.superscript;

    const normalized = solfege.toLowerCase();
    const info = SVG_MAP[normalized] || { svg: doSvgRaw, rot: 0 };
    
    // Determine which diacritics to render
    const diacriticSvgs: string[] = [];
    if (diacritic === 'w_tri') {
      diacriticSvgs.push(DIACRITIC_MAP['w_tri']);
      diacriticSvgs.push(DIACRITIC_MAP['w_dutri']);
    } else if (diacritic === 'd_tri') {
      diacriticSvgs.push(DIACRITIC_MAP['d_tri']);
      diacriticSvgs.push(DIACRITIC_MAP['d_dutri']);
    } else if (diacritic && DIACRITIC_MAP[diacritic]) {
      diacriticSvgs.push(DIACRITIC_MAP[diacritic]);
    }

    const colorFamilyMap: Record<string, string> = {
      do: 'do', di: 'do',
      ra: 're', re: 're', ri: 're',
      me: 'mi', mi: 'mi',
      fa: 'fa', fi: 'fi',
      so: 'so',
      le: 'la', la: 'la', se: 'la',
      te: 'ti', si: 'ti', ti: 'ti'
    };
    const family = colorFamilyMap[normalized] || 'fi';

    const defaultColor = this.getAttribute('color') || `var(--solfege-${family}, var(--solfege-fi, #141414))`;
    const diacriticColor = this.getAttribute('diacritic-color');
    const annotationColor = this.getAttribute('annotation-color');
    const defaultPadding = annotationAlign === 'top' ? '-0.2em' : '-0.4em';
    const annotationPadding = this.getAttribute('annotation-padding') || defaultPadding;
    const superscriptOffsetX = this.getAttribute('superscript-offset-x') || '0.25em';
    const superscriptOffsetY = this.getAttribute('superscript-offset-y') || '-0.4em';
    const size = this.getAttribute('size') || '1em';

    const annotationText = solfegeStr;

    let html = `
      <div class="solfege-container ${annotationAlign !== 'none' ? 'has-annotation' : ''}" style="font-size: ${size};">
        ${annotationAlign === 'top' ? `<div class="solfege-annotation align-top" style="color: ${annotationColor || defaultColor}; margin-bottom: ${annotationPadding};">${annotationText}</div>` : ''}
        <div class="solfege-core" style="--glyph-color: ${defaultColor}; ${diacriticColor ? `--diacritic-color: ${diacriticColor};` : ''}">
          <div class="svg-container" style="transform: rotate(${info.rot}deg);">
            <div class="base-glyph">${processSvg(info.svg)}</div>
            ${diacriticSvgs.map(svg => `<div class="diacritic-glyph">${processSvg(svg)}</div>`).join('')}
          </div>
          ${superscriptObj ? `
            <div class="superscript-wrapper" style="top: ${superscriptOffsetY}; right: ${superscriptOffsetX};">
              <ppt-uniform-solfege 
                solfege="${parsed.superscriptStr || ''}" 
                ${diacriticColor ? `diacritic-color="${diacriticColor}"` : ''}
                color="${defaultColor}"
              ></ppt-uniform-solfege>
            </div>
          ` : ''}
        </div>
        ${annotationAlign === 'bottom' ? `<div class="solfege-annotation align-bottom" style="color: ${annotationColor || defaultColor}; margin-top: ${annotationPadding};">${annotationText}</div>` : ''}
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: inline-block;
          font-family: inherit;
        }

        .solfege-container {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .solfege-annotation {
          position: absolute;
          font-size: 0.4em;
          text-align: center;
          font-family: inherit;
          white-space: nowrap;
        }

        .solfege-annotation.align-top {
          bottom: 100%;
          transform-origin: bottom center;
        }

        .solfege-annotation.align-bottom {
          top: 100%;
          transform-origin: top center;
        }

        .solfege-core {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1em;
          height: 1em;
        }

        .svg-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: center center;
          display: grid;
        }

        .base-glyph, .diacritic-glyph {
          grid-area: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .base-glyph {
          color: var(--glyph-color);
          fill: currentColor;
        }

        .diacritic-glyph {
          color: var(--diacritic-color, var(--glyph-color));
          fill: currentColor;
        }

        .superscript-wrapper {
          position: absolute;
          font-size: 0.4em;
          pointer-events: none;
        }
      </style>

      ${html}
    `;

    requestAnimationFrame(() => {
      this.adjustAnnotationScale();
    });
  }
}

customElements.define('ppt-uniform-solfege', UniformSolfegeComponent);
