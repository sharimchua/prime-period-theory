import { BasePPTComponent } from './BasePPTComponent.js';

export class CoilComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil',
      familyColor: '#60a5fa',
      acceptsChildren: ['ppt-coil-layer'],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        flex-direction: column-reverse; /* Bottom to top: rhythm, harmony, melody */
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="coil-container">
          <slot></slot>
        </div>
      `;
    }
  }
}

if (!customElements.get('ppt-coil')) {
  customElements.define('ppt-coil', CoilComponent);
}
