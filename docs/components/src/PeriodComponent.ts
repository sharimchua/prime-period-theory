import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';

export class PeriodComponent extends WithInteractive(BasePPTComponent) {
  static override get observedAttributes() {
    return [...super.observedAttributes, 'shape', 'starting-angle'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      shape: { type: 'enum', options: ['circle', 'line-horizontal', 'line-vertical'], default: 'circle' },
      'starting-angle': { type: 'number', default: -90 }
    };
  }

  get shape() {
    return this.getAttribute('shape') || 'circle';
  }

  set shape(value: string) {
    this.setAttribute('shape', value);
  }

  get startingAngle() {
    const val = this.getAttribute('starting-angle');
    return val ? parseFloat(val) : -90;
  }

  set startingAngle(value: number) {
    this.setAttribute('starting-angle', value.toString());
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'shape' || name === 'starting-angle') {
      this.render();
      this.layoutSteps();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  private layoutSteps() {
    if (!this.shadowRoot) return;
    const slot = this.shadowRoot.querySelector('slot[name="step"]') as HTMLSlotElement;
    if (!slot) return;

    const steps = slot.assignedElements() as HTMLElement[];
    if (steps.length === 0) return;

    const count = steps.length;
    const shape = this.shape;

    steps.forEach((step, i) => {
      // Ensure step is positioned absolutely within the peripheral container
      step.style.position = 'absolute';

      if (shape === 'circle') {
        const angleDeg = this.startingAngle + (i * 360 / count);
        const angleRad = angleDeg * (Math.PI / 180);
        
        const x = 50 + 50 * Math.cos(angleRad);
        const y = 50 + 50 * Math.sin(angleRad);
        
        step.style.left = `${x}%`;
        step.style.top = `${y}%`;
      } else {
        const percent = count === 1 ? 50 : (i / (count - 1)) * 100;
        
        if (shape === 'line-horizontal') {
          step.style.left = `${percent}%`;
          step.style.top = `50%`;
        } else {
          step.style.left = `50%`;
          step.style.top = `${percent}%`;
        }
      }
    });
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
          /* The period acts as a CSS container so children can size relative to it */
          container-type: size;
          width: 100%;
          height: 100%;
          font-family: var(--ppt-font-family, system-ui, sans-serif);
          color: var(--ppt-text-color, #333);
          margin: var(--ppt-period-margin, 0 auto);
        }

        :host([shape^="line"]) {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .container {
          position: relative;
          /* Subtract marker size to prevent overflow bleeding */
          width: calc(100% - max(32px, 10cqmin));
          height: calc(100% - max(32px, 10cqmin));
          max-width: calc(100% - max(32px, 10cqmin));
          max-height: calc(100% - max(32px, 10cqmin));
          background: var(--ppt-period-bg, transparent);
          border: var(--ppt-period-border, 2px solid #ccc);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        /* Default Circle Styles */
        :host(:not([shape^="line"])) .container {
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          max-width: calc(100cqh - max(32px, 10cqmin));
          max-height: calc(100cqw - max(32px, 10cqmin));
        }

        /* Line Styles */
        :host([shape^="line"]) .container {
          aspect-ratio: auto;
          height: var(--ppt-period-height, 4px); /* Slimmer for line */
          border-radius: var(--ppt-period-radius, 2px);
          width: calc(100% - max(32px, 10cqmin));
        }
        
        :host([shape="line-vertical"]) .container {
          width: var(--ppt-period-height, 4px);
          height: calc(100% - max(32px, 10cqmin));
        }

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
        <div class="peripheral">
          <slot name="step"></slot>
          <slot name="peripheral"></slot>
        </div>
      </div>
    `;

    // Re-bind slot change
    const slot = this.shadowRoot.querySelector('slot[name="step"]') as HTMLSlotElement;
    if (slot) {
      slot.addEventListener('slotchange', () => this.layoutSteps());
    }
  }
}

customElements.define('ppt-period', PeriodComponent);
