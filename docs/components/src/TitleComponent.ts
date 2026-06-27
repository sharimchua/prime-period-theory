import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';

export class TitleComponent extends WithResizable(WithInteractive(BasePPTComponent)) {
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
          display: block;
          font-family: var(--ppt-font-family, system-ui, sans-serif);
          color: var(--ppt-text-color, #333);
          margin-bottom: var(--ppt-title-margin, 1rem);
          /* Override 100% height from base styles so it fits content */
          height: auto;
          width: 100%;
          text-align: center;
        }

        .title {
          font-size: var(--ppt-title-size, 1.5rem);
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
      </style>

      <h2 class="title">
        <slot></slot>
      </h2>
    `;
  }
}

customElements.define('ppt-title', TitleComponent);
