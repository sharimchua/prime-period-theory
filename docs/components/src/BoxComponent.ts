import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';

export class BoxComponent extends WithResizable(WithInteractive(BasePPTComponent)) {
  static override get componentDef() {
    return {
      displayName: 'Box (Layout Proxy)',
      familyColor: '#888888',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: flex;
          flex-direction: column;
          position: relative;
          width: 100%;
          min-height: 20px;
          border: 1px dashed rgba(200, 200, 200, 0.2);
          box-sizing: border-box;
          padding: var(--ppt-box-padding, 8px);
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define('ppt-box', BoxComponent);
