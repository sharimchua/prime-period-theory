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
    return [...super.observedAttributes];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata
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
      .row-header {
        display: flex;
        align-items: stretch;
        border-right: 1px solid #e2e8f0;
        background: #f8fafc;
      }
      .row-content {
        flex: 1;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        min-height: 40px;
        overflow-x: auto;
      }
      @media print {
        :host {
          border: none !important;
          background: transparent !important;
        }
        .row-header {
          display: none !important;
        }
        .row-content {
          padding: 0;
        }
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="row-header">
          <slot name="header"></slot>
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
