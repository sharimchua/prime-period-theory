import { BasePPTComponent } from './BasePPTComponent.js';
import { WithEmit } from './features/WithEmit.js';

export class ControlBooleanComponent extends WithEmit(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Boolean Control',
      familyColor: '#9b59b6',
      acceptsChildren: [],
      canNestIn: ['ppt-control-panel']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'label', 'value'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      label: { type: 'string', default: 'Toggle', description: 'Label for the boolean control.' },
      value: { type: 'boolean', default: false, description: 'The current boolean value of the control.' }
    };
  }

  get label() {
    return this.getAttribute('label') || 'Toggle';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  get value() {
    return this.hasAttribute('value') && this.getAttribute('value') !== 'false';
  }

  set value(val: boolean) {
    if (val) {
      this.setAttribute('value', 'true');
    } else {
      this.removeAttribute('value');
    }
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
      const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) checkbox.checked = this.value;
    }
  }

  private _onChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.checked;
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
        input[type="checkbox"] {
          width: 1.2rem;
          height: 1.2rem;
          cursor: pointer;
        }
        .control-label {
          font-size: 0.95rem;
          color: #334155;
          user-select: none;
          cursor: pointer;
        }
      </style>
      <label class="control-wrapper">
        <input type="checkbox" ${this.value ? 'checked' : ''}>
        <span class="control-label">${this.label}</span>
      </label>
    `;

    const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]');
    checkbox?.addEventListener('change', this._onChange.bind(this));
  }
}

customElements.define('ppt-control-boolean', ControlBooleanComponent);
