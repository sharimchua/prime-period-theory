import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';

export class CoilCursorComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Cursor',
      familyColor: '#ef4444',
      acceptsChildren: [],
      canNestIn: ['ppt-phrase-editor']
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: inline-block;
        width: 2px;
        height: 1.5em;
        background-color: var(--ppt-cursor-color, #ef4444);
        margin: 0 2px;
        animation: blink 1s step-start infinite;
        vertical-align: middle;
      }
      @keyframes blink {
        50% { opacity: 0; }
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `<style>${this.getBaseStyles()}</style>`;
    }
  }
}

if (!customElements.get('ppt-coil-cursor')) {
  customElements.define('ppt-coil-cursor', CoilCursorComponent);
}
