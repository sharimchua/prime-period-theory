import { BasePanelComponent } from './BasePanelComponent.js';

export class ControlPanelComponent extends BasePanelComponent {
  static override get componentDef() {
    return {
      displayName: 'Control Panel',
      familyColor: '#f39c12',
      acceptsChildren: ['ppt-control-boolean', 'ppt-control-integer', 'ppt-control-text'],
      canNestIn: ['ppt-container']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'label'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      label: { type: 'string', default: 'Control Panel', description: 'Label for the control panel.' }
    };
  }

  get label() {
    return this.getAttribute('label') || 'Control Panel';
  }

  set label(value: string) {
    this.setAttribute('label', value);
  }



  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'label') {
      const title = this.shadowRoot?.querySelector('.panel-title');
      if (title) title.textContent = this.label;
    }
  }

  protected override getPanelStyles() {
    return `
      .panel-title {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 1.1rem;
        color: var(--brand-primary, #1e293b);
        border-bottom: 2px solid var(--brand-secondary, #3b82f6);
        padding-bottom: 0.5rem;
        font-weight: 600;
      }
      .controls-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `;
  }

  protected override getPanelContent() {
    return `
      <div class="panel-title">${this.label}</div>
      <div class="controls-container">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('ppt-control-panel', ControlPanelComponent);
