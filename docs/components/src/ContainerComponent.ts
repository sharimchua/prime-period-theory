import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';

export class ContainerComponent extends WithResizable(WithInteractive(BasePPTComponent)) {
  override connectedCallback() {
    super.connectedCallback();
    this.render();
    this.setupLayout();
    
    // Re-run layout if panels update their align/ratio
    this.addEventListener('ppt-panel-updated', () => this.setupLayout());
  }

  private setupLayout() {
    // In a shadow DOM slot, we can't easily style slotted elements based on their attributes from the parent CSS.
    // However, the atomic components handle their own widths via the 'ratio' attribute.
    // The container's job is simply to provide the Flexbox context and boundaries.
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: stretch;
          position: relative; /* Crucial for containing floating panels */
          overflow: hidden; /* Restrict floating panels from escaping visually */
          width: 100%;
          height: 100%;
          gap: var(--ppt-container-gap, 1rem);
        }

        .layout-wrapper {
          display: flex;
          flex-direction: inherit;
          flex-wrap: inherit;
          align-items: inherit;
          width: 100%;
          height: 100%;
          position: relative;
        }

        /* We use a slot to render the developer's composed elements */
        ::slotted(ppt-title) {
          width: 100%;
          flex: 0 0 auto;
        }

        ::slotted(ppt-period), ::slotted(ppt-tonal-clock) {
          flex: 1 1 0; /* Take up all remaining space */
          min-width: 0;
          min-height: 0;
        }

        ::slotted(ppt-panel[panel-align="left"]) {
          order: -1;
        }
        ::slotted(ppt-panel[panel-align="right"]) {
          order: 1;
        }

        /* If developer puts a panel with panel-align="top" or "bottom", we should probably 
           switch to column layout if they want a vertical stack */
        :host([layout="vertical"]) {
          flex-direction: column;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define('ppt-container', ContainerComponent);
