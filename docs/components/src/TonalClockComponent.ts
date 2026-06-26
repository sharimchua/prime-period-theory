import { BasePPTComponent } from './BasePPTComponent.js';
import './PeriodComponent.js';

export class TonalClockComponent extends BasePPTComponent {
  
  static override get observedAttributes() {
    return [...super.observedAttributes, 'radius'];
  }

  get radius() {
    return Number(this.getAttribute('radius')) || 150;
  }

  set radius(value: number) {
    this.setAttribute('radius', value.toString());
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'radius') {
      this.style.setProperty('--ppt-period-size', `${this.radius * 2}px`);
      this.render();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.style.setProperty('--ppt-period-size', `${this.radius * 2}px`);
    this.render();
  }

  private getDegrees() {
    // 12 chromatic degrees
    const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'E'];
    let html = '';
    
    for (let i = 0; i < 12; i++) {
      // 0 is at the top, so we start at -90 degrees.
      // Each hour is 30 degrees.
      const angle = (i * 30 - 90) * (Math.PI / 180);
      
      // Calculate position relative to center (50%, 50%)
      const x = 50 + 50 * Math.cos(angle);
      const y = 50 + 50 * Math.sin(angle);
      
      html += `
        <div class="degree-marker" style="left: ${x}%; top: ${y}%;">
          <div class="degree-label">${labels[i]}</div>
        </div>
      `;
    }
    return html;
  }

  private render() {
    if (!this.shadowRoot) return;

    // Use slotted elements to pass content to the inner period component
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: block;
        }

        .degree-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          width: var(--ppt-marker-size, 24px);
          height: var(--ppt-marker-size, 24px);
          background: var(--ppt-marker-bg, #fff);
          border: var(--ppt-marker-border, 1px solid #999);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--ppt-marker-font-size, 0.8rem);
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }

        .degree-marker:hover {
          transform: translate(-50%, -50%) scale(1.2);
          background: var(--ppt-marker-hover-bg, #e0e0e0);
        }

        /* If interactive is false, the base component handles pointer-events none */
      </style>

      <ppt-period shape="circle" interactive="${this.interactive ? 'true' : 'false'}">
        <slot name="title" slot="title"></slot>
        <slot name="body" slot="body"></slot>
        
        <div slot="peripheral" style="width: 100%; height: 100%; position: relative;">
          ${this.getDegrees()}
          <slot name="peripheral"></slot>
        </div>

        <slot name="panel" slot="panel"></slot>
      </ppt-period>
    `;
  }
}

customElements.define('ppt-tonal-clock', TonalClockComponent);
