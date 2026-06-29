import { BasePPTComponent } from './BasePPTComponent.js';
import { WithPanel } from './features/WithPanel.js';

export class TextPanelComponent extends WithPanel(BasePPTComponent) {
  static override get componentDef() {
    return {
      displayName: 'Text Panel',
      familyColor: '#e67e22',
      acceptsChildren: [] as string[],
      canNestIn: ['ppt-container']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'content'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      content: { type: 'string', default: 'Text Content', description: 'Text content to display inside the panel.' }
    };
  }

  get content() {
    return this.getAttribute('content') || 'Text Content';
  }

  set content(val: string) {
    this.setAttribute('content', val);
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    if (name === 'content') {
      const contentEl = this.shadowRoot?.querySelector('.text-content');
      if (contentEl) contentEl.textContent = this.content;
    }
  }

  protected override getPanelContent() {
    return `<div class="text-content">${this.content}</div>`;
  }
}

customElements.define('ppt-text-panel', TextPanelComponent);
