import { BasePPTComponent } from './BasePPTComponent.js';
import { WithPanel } from './features/WithPanel.js';

export class SolfegePhrasePanelComponent extends WithPanel(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Solfege Phrase Panel',
      familyColor: '#8e44ad',
      acceptsChildren: [],
      canNestIn: ['ppt-container']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'phrase', 'size', 'grid-width', 'grid-spacing', 'color', 'annotation-align', 'annotation-padding'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      phrase: { type: 'string', default: '', description: 'Phrase like "Do Re(w_tri) Fi^Ti(axis)"' },
      size: { type: 'string', default: '2rem', description: 'Font size of the phrase' },
      'grid-width': { type: 'string', default: '1em', description: 'Width of each monospaced cell' },
      'grid-spacing': { type: 'string', default: '0.2em', description: 'Gap between cells' },
      color: { type: 'color', default: '', description: 'Default color override' },
      'annotation-align': { type: 'enum', options: ['none', 'top', 'bottom'], default: 'none', description: 'Alignment of the solfege annotation text' },
      'annotation-padding': { type: 'string', default: '', description: 'Padding for annotations' }
    };
  }

  get phrase() { return this.getAttribute('phrase') || ''; }
  get size() { return this.getAttribute('size') || '2rem'; }
  get gridWidth() { return this.getAttribute('grid-width') || '1em'; }
  get gridSpacing() { return this.getAttribute('grid-spacing') || '0.2em'; }
  get color() { return this.getAttribute('color') || ''; }
  get annotationAlign() { return this.getAttribute('annotation-align') || 'none'; }
  get annotationPadding() { return this.getAttribute('annotation-padding') || ''; }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    if (['phrase', 'size', 'grid-width', 'grid-spacing', 'color', 'annotation-align', 'annotation-padding'].includes(name)) {
      const phraseEl = this.shadowRoot?.querySelector('ppt-solfege-phrase');
      if (phraseEl) {
        if (newValue === null) {
          phraseEl.removeAttribute(name);
        } else {
          phraseEl.setAttribute(name, newValue);
        }
      }
    }
  }

  protected override getPanelContent() {
    return `
      <div style="display: flex; justify-content: center; width: 100%; height: 100%; align-items: center;">
        <ppt-solfege-phrase
          phrase="${this.phrase}"
          size="${this.size}"
          grid-width="${this.gridWidth}"
          grid-spacing="${this.gridSpacing}"
          color="${this.color}"
          annotation-align="${this.annotationAlign}"
          annotation-padding="${this.annotationPadding}"
        ></ppt-solfege-phrase>
      </div>
    `;
  }
}

customElements.define('ppt-solfege-phrase-panel', SolfegePhrasePanelComponent);
