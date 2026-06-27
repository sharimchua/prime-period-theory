import { BasePPTComponent } from './BasePPTComponent.js';

export class TextComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Text (Inline Proxy)',
      familyColor: '#888888',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
  }
  
  static override get observedAttributes() {
    return [...super.observedAttributes, 'color', 'size', 'weight'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      textContent: { type: 'string', default: 'Text', description: 'The inner text content of this element.' },
      color: { type: 'color', default: '#333333', description: 'Text color.' },
      size: { type: 'string', default: '1em', description: 'Font size.' },
      weight: { type: 'enum', options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'], default: 'normal', description: 'Font weight.' }
    };
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'color') this.style.color = _newValue;
    if (name === 'size') this.style.fontSize = _newValue;
    if (name === 'weight') this.style.fontWeight = _newValue;
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
          display: inline;
          font-family: inherit;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define('ppt-text', TextComponent);
