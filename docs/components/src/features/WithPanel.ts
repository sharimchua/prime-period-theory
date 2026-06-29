import { type CustomElement } from './WithInteractive.js';
import { WithFloating } from './WithFloating.js';
import { WithResizable } from './WithResizable.js';
import { WithInteractive } from './WithInteractive.js';

type Constructor<T = CustomElement> = new (...args: any[]) => T;

export function WithPanel<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  const FloatingResizableInteractiveBase = WithFloating(WithResizable(WithInteractive(Base)));
  
  return class extends FloatingResizableInteractiveBase {
    override connectedCallback() {
      super.connectedCallback();
      this.renderPanel();
    }

    protected getPanelStyles(): string {
      return '';
    }

    protected getPanelContent(): string {
      return '<slot></slot>';
    }

    private renderPanel() {
      if (!this.shadowRoot) return;

      this.shadowRoot.innerHTML = `
        <style>
          ${(this as any).getBaseStyles ? (this as any).getBaseStyles() : ''}
          
          :host {
            display: block;
            font-family: var(--ppt-font-family, system-ui, sans-serif);
            color: var(--ppt-text-color, #333);
          }

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

          ${this.getPanelStyles()}
        </style>

        <div class="panel-inner">
          ${this.getPanelContent()}
        </div>
      `;
    }
  };
}
