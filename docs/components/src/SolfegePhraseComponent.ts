import { BasePPTComponent } from './BasePPTComponent.js';
import { isValidSolfegeToken } from './solfegeUtils.js';

export class SolfegePhraseComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Solfege Phrase',
      familyColor: '#8e44ad',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }
  
  static override get observedAttributes() {
    return [...super.observedAttributes, 'phrase', 'size', 'grid-width', 'grid-spacing', 'color', 'diacritic-color', 'annotation-align', 'annotation-padding', 'justify'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'phrase': { type: 'string', default: '', description: 'The space-separated phrase of solfege syllables.' },
      'size': { type: 'string', default: '2em', description: 'The font size of the phrase.' },
      'grid-width': { type: 'string', default: '1em', description: 'Width of each glyph cell' },
      'grid-spacing': { type: 'string', default: '0.2em', description: 'Space between glyph cells' },
      color: { type: 'color', default: '', description: 'Override base color for all glyphs' },
      'diacritic-color': { type: 'color', default: '', description: 'Override diacritic color for all glyphs' },
      'annotation-align': { type: 'enum', options: ['none', 'top', 'bottom'], default: 'none', description: 'Alignment of the solfege annotation text' },
      'annotation-padding': { type: 'string', default: '', description: 'Padding for annotations' },
      justify: { type: 'enum', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'], default: 'flex-start', description: 'Horizontal justification of phrase' }
    };
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (['phrase', 'size', 'grid-width', 'grid-spacing', 'color', 'diacritic-color', 'annotation-align', 'annotation-padding', 'justify'].includes(name)) {
      this.render();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    const phrase = this.getAttribute('phrase') || '';
    const size = this.getAttribute('size') || '2rem';
    const gridWidth = this.getAttribute('grid-width') || '1em';
    const gridSpacing = this.getAttribute('grid-spacing') || '0.2em';
    const globalColor = this.getAttribute('color');
    const diacriticColor = this.getAttribute('diacritic-color');
    const annotationAlign = this.getAttribute('annotation-align');
    const annotationPadding = this.getAttribute('annotation-padding');

    const tokens = phrase.split(' ').filter(t => t.trim().length > 0);
    
    // Group up to 2 consecutive half-size tokens
    const cells = [];
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      const isHalf = t.startsWith('[') && t.endsWith(']');
      
      if (isHalf) {
        const nextT = tokens[i + 1];
        const nextIsHalf = nextT && nextT.startsWith('[') && nextT.endsWith(']');
        if (nextIsHalf) {
          cells.push([t, nextT]);
          i++; // Skip the next token since we paired it
        } else {
          cells.push([t]);
        }
      } else {
        cells.push([t]);
      }
    }

    const cellsCount = cells.length;
    // Each cell takes gridWidth, plus gap is gridSpacing.
    // However gridWidth is a string like "1em". Let's assume standard units.
    // If we use standard CSS calc, we can just say the phrase width is `calc(${cellsCount} * ${gridWidth} + ${cellsCount - 1} * ${gridSpacing})`
    // And height is roughly 1.5em to account for annotations.
    
    // Instead of fixed font-size, we will use a container query if size="auto", or just make it responsive by default.
    // We will apply the size attribute as the base size, but allow it to be constrained by container size.
    
    const html = `
      <div class="phrase-container" style="gap: ${gridSpacing};">
        ${cells.map(cellTokens => {
          return `
          <div class="phrase-cell" style="width: ${gridWidth};">
            ${cellTokens.map(t => {
              let tokenStr = t;
              let sizeMod = '';
              let alignMod = annotationAlign ? `annotation-align="${annotationAlign}"` : '';
              if (t.startsWith('[') && t.endsWith(']')) {
                tokenStr = t.slice(1, -1);
                sizeMod = `size="0.5em"`;
                alignMod = `annotation-align="none"`; // disable annotation for half size
              }
              if (isValidSolfegeToken(tokenStr)) {
                return `
                <ppt-uniform-solfege 
                  solfege="${tokenStr}"
                  ${sizeMod}
                  ${globalColor ? `color="${globalColor}"` : ''}
                  ${diacriticColor ? `diacritic-color="${diacriticColor}"` : ''}
                  ${alignMod}
                  ${annotationPadding ? `annotation-padding="${annotationPadding}"` : ''}
                ></ppt-uniform-solfege>
                `;
              } else {
                return `<span class="invalid-token" style="font-size: ${sizeMod ? '0.5em' : '1em'}; display: inline-flex; align-items: center; justify-content: center; height: 100%; color: var(--brand-primary, #1e293b); font-family: inherit;">${tokenStr}</span>`;
              }
            }).join('')}
          </div>
          `;
        }).join('')}
      </div>
    `;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: flex;
          align-items: center;
          justify-content: ${this.getAttribute('justify') || 'flex-start'};
          width: 100%;
          height: 100%;
          font-family: inherit;
        }

        .phrase-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          justify-content: ${this.getAttribute('justify') || 'flex-start'};
          /* Base size requested */
          --requested-size: ${size};
          
          /* We use custom variables updated by ResizeObserver for maximum robustness across browsers */
          --cq-width: 1000px; /* default before measure */
          --cq-height: 1000px;
          
          --max-w-size: calc(var(--cq-width) / (${cellsCount} * 1.2));
          --max-h-size: calc(var(--cq-height) / 1.5);
          
          /* The actual font-size is the minimum of requested size, and what fits in width/height */
          font-size: min(var(--requested-size), var(--max-w-size), var(--max-h-size));
          
          /* Provide a fallback in case container is 0 height */
          min-height: 1em;
          width: 100%;
        }

        .phrase-cell {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      </style>

      ${html}
    `;

    // Ensure ResizeObserver is setup to track our host dimensions
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            const container = this.shadowRoot?.querySelector('.phrase-container') as HTMLElement;
            if (container) {
              container.style.setProperty('--cq-width', `${width}px`);
              container.style.setProperty('--cq-height', `${height}px`);
            }
          }
        }
      });
      this._resizeObserver.observe(this);
    } else {
      // Force an immediate update if already observing
      const rect = this.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const container = this.shadowRoot.querySelector('.phrase-container') as HTMLElement;
        if (container) {
          container.style.setProperty('--cq-width', `${rect.width}px`);
          container.style.setProperty('--cq-height', `${rect.height}px`);
        }
      }
    }
  }

  private _resizeObserver: ResizeObserver | null = null;

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }
}

customElements.define('ppt-solfege-phrase', SolfegePhraseComponent);

