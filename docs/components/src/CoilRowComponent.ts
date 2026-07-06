import { BasePPTComponent } from './BasePPTComponent.js';

export class CoilRowComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Row',
      familyColor: '#fcd34d',
      acceptsChildren: ['ppt-phrase-editor'],
      canNestIn: ['ppt-coil-layer']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'label', 'register-offset', 'muted', 'soloed'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      label: { type: 'string', default: 'Voice 1', description: 'Row label' },
      'register-offset': { type: 'number', default: 0, description: 'Register/octave offset' },
      muted: { type: 'boolean', default: false, description: 'Mute this row' },
      soloed: { type: 'boolean', default: false, description: 'Solo this row' }
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }
      .row-chrome {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        padding: 0.5rem;
        min-width: 80px;
      }
      .row-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #334155;
      }
      .row-controls {
        display: flex;
        gap: 0.25rem;
        margin-top: 0.25rem;
        font-size: 0.7rem;
      }
      .btn {
        background: #e2e8f0;
        border: none;
        border-radius: 2px;
        padding: 2px 4px;
        cursor: pointer;
        color: #475569;
      }
      .btn.active {
        background: #94a3b8;
        color: #fff;
      }
      .row-content {
        flex: 1;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        min-height: 40px;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (['label', 'register-offset', 'muted', 'soloed'].includes(name)) {
      this.render();
    }
  }

  private render() {
    const label = this.getAttribute('label') || 'Voice';
    const muted = this.hasAttribute('muted') && this.getAttribute('muted') !== 'false';
    const soloed = this.hasAttribute('soloed') && this.getAttribute('soloed') !== 'false';
    const registerOffset = parseInt(this.getAttribute('register-offset') || '0', 10);

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="row-chrome">
          <div class="row-label">${label}</div>
          <div class="row-controls">
            <button class="btn ${muted ? 'active' : ''}">M</button>
            <button class="btn ${soloed ? 'active' : ''}">S</button>
            <span style="margin-left:auto">${registerOffset > 0 ? '+' : ''}${registerOffset}</span>
          </div>
        </div>
        <div class="row-content">
          <slot></slot>
        </div>
      `;
    }
  }
}

if (!customElements.get('ppt-coil-row')) {
  customElements.define('ppt-coil-row', CoilRowComponent);
}
