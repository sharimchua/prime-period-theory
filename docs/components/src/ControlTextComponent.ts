import { BasePPTComponent } from './BasePPTComponent.js';
import { WithEmit } from './features/WithEmit.js';

export class ControlTextComponent extends WithEmit(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Text Control',
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
      label: { type: 'string', default: 'Text', description: 'Label for the text control.' },
      value: { type: 'string', default: '', description: 'The current string value of the control.' }
    };
  }

  get label() {
    return this.getAttribute('label') || 'Text';
  }

  set label(val: string) {
    this.setAttribute('label', val);
  }

  get value() {
    return this.getAttribute('value') || '';
  }

  set value(val: string) {
    this.setAttribute('value', val);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    
    if (name === 'value') {
      this.emitState(newValue);
    }

    if (!this.shadowRoot) return;
    
    if (name === 'label') {
      const labelEl = this.shadowRoot.querySelector('.control-label');
      if (labelEl) labelEl.textContent = newValue;
    }
    
    if (name === 'value') {
      const inputEl = this.shadowRoot.querySelector('input') as HTMLInputElement;
      if (inputEl && inputEl.value !== newValue) {
        inputEl.value = newValue;
      }
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: #2a2a2a;
          border-radius: 4px;
          border-left: 4px solid ${ControlTextComponent.componentDef.familyColor};
          width: 100%;
          box-sizing: border-box;
          gap: 10px;
        }

        .control-label {
          font-family: inherit;
          font-size: 0.9em;
          color: #e0e0e0;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .control-input {
          flex-grow: 1;
          background: #1e1e1e;
          border: 1px solid #444;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 3px;
          font-family: inherit;
          font-size: 0.9em;
          outline: none;
        }

        .control-input:focus {
          border-color: ${ControlTextComponent.componentDef.familyColor};
        }
      </style>

      <span class="control-label">${this.label}</span>
      <input type="text" class="control-input" value="${this.value}">
    `;

    const input = this.shadowRoot.querySelector('input') as HTMLInputElement;
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.setAttribute('value', target.value);
    });
  }
}

customElements.define('ppt-control-text', ControlTextComponent);
