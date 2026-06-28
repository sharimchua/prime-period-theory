import { BasePPTComponent } from './BasePPTComponent.js';
import { WithEmit } from './features/WithEmit.js';

export class ControlIntegerComponent extends WithEmit(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Integer Control',
      familyColor: '#3498db',
      acceptsChildren: [],
      canNestIn: ['ppt-control-panel']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'label', 'value', 'min', 'max'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      label: { type: 'string', default: 'Number', description: 'Label for the integer control.' },
      value: { type: 'number', default: 0, description: 'The current integer value.' },
      min: { type: 'number', default: 0, description: 'Minimum allowed value.' },
      max: { type: 'number', default: 100, description: 'Maximum allowed value.' }
    };
  }

  get label() {
    return this.getAttribute('label') || 'Number';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  get value() {
    const val = parseInt(this.getAttribute('value') || '0', 10);
    return isNaN(val) ? 0 : val;
  }

  set value(val: number) {
    this.setAttribute('value', Math.round(val).toString());
  }

  get min() {
    const val = parseInt(this.getAttribute('min') || '0', 10);
    return isNaN(val) ? 0 : val;
  }

  set min(val: number) {
    this.setAttribute('min', Math.round(val).toString());
  }

  get max() {
    const val = parseInt(this.getAttribute('max') || '100', 10);
    return isNaN(val) ? 100 : val;
  }

  set max(val: number) {
    this.setAttribute('max', Math.round(val).toString());
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    
    if (name === 'value') {
      this.emitState(this.value);
    }

    if (!this.shadowRoot) return;
    
    if (name === 'label') {
      const labelEl = this.shadowRoot.querySelector('.control-label');
      if (labelEl) labelEl.textContent = this.label;
    } else if (name === 'value') {
      const input = this.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
      if (input) input.value = this.value.toString();
    } else if (name === 'min') {
      const input = this.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
      if (input) input.min = this.min.toString();
    } else if (name === 'max') {
      const input = this.shadowRoot.querySelector('input[type="number"]') as HTMLInputElement;
      if (input) input.max = this.max.toString();
    }
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseInt(target.value, 10);
    if (!isNaN(val)) {
      this.value = val;
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        :host {
          display: block;
          font-family: var(--ppt-font-family, system-ui, sans-serif);
        }
        .control-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        input[type="number"] {
          width: 60px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .control-label {
          font-size: 0.95rem;
          color: #334155;
          user-select: none;
        }
      </style>
      <label class="control-wrapper">
        <span class="control-label">${this.label}</span>
        <input type="number" value="${this.value}" min="${this.min}" max="${this.max}">
      </label>
    `;

    const input = this.shadowRoot.querySelector('input[type="number"]');
    input?.addEventListener('change', this._onChange.bind(this));
    input?.addEventListener('input', this._onChange.bind(this)); // update as you type
  }
}

customElements.define('ppt-control-integer', ControlIntegerComponent);
