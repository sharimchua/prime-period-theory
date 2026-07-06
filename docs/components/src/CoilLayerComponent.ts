import { BasePPTComponent } from './BasePPTComponent.js';

export class CoilLayerComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Layer',
      familyColor: '#4ade80',
      acceptsChildren: ['ppt-coil-row'],
      canNestIn: ['ppt-coil']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'layer'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      layer: { type: 'enum', options: ['rhythm', 'harmony', 'melody'], default: 'rhythm', description: 'The grammar layer context' }
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem;
        border-left: 4px solid var(--layer-color, #ccc);
        background: rgba(255, 255, 255, 0.5);
      }
      .layer-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--layer-color, #888);
        font-weight: bold;
        margin-bottom: 0.25rem;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === 'layer') {
      this.render();
    }
  }

  private render() {
    const layerType = this.getAttribute('layer') || 'rhythm';
    
    let color = '#94a3b8'; // default rhythm color
    if (layerType === 'harmony') color = '#fbbf24'; // yellow for harmony
    if (layerType === 'melody') color = '#60a5fa'; // blue for melody

    this.style.setProperty('--layer-color', color);

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="layer-label">${layerType} Layer</div>
        <slot></slot>
        <div class="add-row" style="cursor:pointer; color: var(--layer-color, #888); font-size: 0.8rem; font-weight: bold; margin-top: 0.25rem;">+ Add Row</div>
      `;

      const addBtn = this.shadowRoot.querySelector('.add-row');
      addBtn?.addEventListener('click', () => {
        const row = document.createElement('ppt-coil-row');
        row.innerHTML = `<ppt-phrase-editor listen-id="glyph-input"></ppt-phrase-editor>`;
        this.appendChild(row);
      });
    }
  }
}

if (!customElements.get('ppt-coil-layer')) {
  customElements.define('ppt-coil-layer', CoilLayerComponent);
}
