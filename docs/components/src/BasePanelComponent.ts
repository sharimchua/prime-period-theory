import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';
import { WithFloating } from './features/WithFloating.js';

export class BasePanelComponent extends WithFloating(WithResizable(WithInteractive(BasePPTComponent))) {
  static override get componentDef() {
    return {
      displayName: 'Base Panel',
      familyColor: '#e67e22',
      acceptsChildren: [] as string[],
      canNestIn: ['ppt-container']
    };
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata
    };
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  protected getPanelStyles() {
    return `
      :host {
        display: block;
        font-family: var(--ppt-font-family, system-ui, sans-serif);
        color: var(--ppt-text-color, #333);
      }
    `;
  }

  protected getPanelContent() {
    return `<slot></slot>`;
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        ${this.getPanelStyles()}

        .panel-inner {
          background: var(--ppt-panel-bg, rgba(255, 255, 255, 0.95));
          border: var(--ppt-panel-border, 1px solid #e2e8f0);
          border-radius: var(--ppt-panel-radius, 8px);
          padding: var(--ppt-panel-padding, 1rem);
          box-shadow: var(--ppt-panel-shadow, 0 4px 6px rgba(0,0,0,0.1));
          width: 100%;
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
        }

        :host([floating]) .panel-inner {
          cursor: grab;
          height: auto;
          width: max-content;
          min-width: 200px;
        }

        :host([floating]) .panel-inner:active {
          cursor: grabbing;
        }
      </style>

      <div class="panel-inner">
        ${this.getPanelContent()}
      </div>
    `;
  }
}
