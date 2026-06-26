import { BasePPTComponent } from './BasePPTComponent.js';

export class PeriodComponent extends BasePPTComponent {
  static override get observedAttributes() {
    return [...super.observedAttributes, 'shape', 'panel-align'];
  }

  get shape() {
    return this.getAttribute('shape') || 'circle';
  }

  set shape(value: string) {
    this.setAttribute('shape', value);
  }

  get panelAlign() {
    return this.getAttribute('panel-align') || 'floating';
  }

  set panelAlign(value: string) {
    this.setAttribute('panel-align', value);
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'shape' || name === 'panel-align') {
      this.render();
    }
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
          position: relative;
          width: var(--ppt-period-size, 300px);
          height: var(--ppt-period-size, 300px);
          margin: var(--ppt-period-margin, 2rem auto);
          font-family: var(--ppt-font-family, system-ui, sans-serif);
          color: var(--ppt-text-color, #333);
        }

        :host([shape="line"]) {
          width: var(--ppt-period-width, 100%);
          height: var(--ppt-period-height, 100px);
          flex-direction: row;
          align-items: center;
        }

        .container {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--ppt-period-bg, transparent);
          border: var(--ppt-period-border, 2px solid #ccc);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: ${this.shape === 'circle' ? '50%' : 'var(--ppt-period-radius, 8px)'};
          transition: all 0.3s ease;
        }

        .content {
          text-align: center;
          z-index: 2;
        }

        .title {
          font-size: var(--ppt-title-size, 1.2rem);
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .body {
          font-size: var(--ppt-body-size, 1rem);
        }

        .panel {
          position: absolute;
          z-index: 10;
          background: var(--ppt-panel-bg, rgba(255, 255, 255, 0.9));
          border: var(--ppt-panel-border, 1px solid #eee);
          border-radius: var(--ppt-panel-radius, 4px);
          padding: var(--ppt-panel-padding, 0.5rem);
          box-shadow: var(--ppt-panel-shadow, 0 4px 6px rgba(0,0,0,0.1));
        }

        /* Panel Alignment */
        :host([panel-align="floating"]) .panel {
          top: 100%;
          left: 50%;
          transform: translate(-50%, 10px);
        }
        :host([panel-align="top"]) .panel {
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, -10px);
        }
        :host([panel-align="bottom"]) .panel {
          top: 100%;
          left: 50%;
          transform: translate(-50%, 10px);
        }
        :host([panel-align="left"]) .panel {
          right: 100%;
          top: 50%;
          transform: translate(-10px, -50%);
        }
        :host([panel-align="right"]) .panel {
          left: 100%;
          top: 50%;
          transform: translate(10px, -50%);
        }

        /* Peripheral attachment point (for clocks, etc) */
        .peripheral {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none; /* Let clicks pass through to container if empty */
        }
        
        .peripheral ::slotted(*) {
          pointer-events: auto; /* Re-enable pointer events for slotted content */
        }

      </style>

      <div class="container">
        <div class="content">
          <div class="title"><slot name="title"></slot></div>
          <div class="body"><slot name="body"></slot></div>
        </div>
        
        <div class="peripheral">
          <slot name="peripheral"></slot>
        </div>

        <div class="panel">
          <slot name="panel"></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('ppt-period', PeriodComponent);
