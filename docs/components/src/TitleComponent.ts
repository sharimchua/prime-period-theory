import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';

export class TitleComponent extends WithInteractive(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Title',
      familyColor: '#2ecc71',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'text'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      text: { type: 'string', default: 'Title', description: 'The text displayed as the title.' }
    };
  }

  get text() {
    return this.getAttribute('text') || 'Title';
  }

  set text(value: string) {
    this.setAttribute('text', value);
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    if (name === 'text') {
      const titleEl = this.shadowRoot?.querySelector('.title');
      if (titleEl) titleEl.textContent = newValue;
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
          display: block;
          font-family: var(--ppt-font-family, system-ui, sans-serif);
          color: var(--ppt-text-color, #333);
          margin-bottom: var(--ppt-title-margin, 1rem);
          /* Override 100% height from base styles so it fits content */
          height: auto;
          width: 100%;
          text-align: center;
        }

        .title {
          font-size: var(--ppt-title-size, 1.5rem);
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
      </style>

      <h2 class="title">${this.text}</h2>
    `;
  }
}

customElements.define('ppt-title', TitleComponent);
