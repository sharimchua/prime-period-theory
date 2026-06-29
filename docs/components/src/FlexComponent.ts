import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';

export class FlexComponent extends WithResizable(WithInteractive(BasePPTComponent)) {
  static override get componentDef() {
    return {
      displayName: 'Flex Layout',
      familyColor: '#94a3b8',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      direction: { type: 'string', default: 'row', description: 'Flex direction (row, column, etc.)' },
      justify: { type: 'string', default: 'flex-start', description: 'Justify content' },
      align: { type: 'string', default: 'stretch', description: 'Align items' },
      wrap: { type: 'string', default: 'nowrap', description: 'Flex wrap' },
      gap: { type: 'string', default: '0', description: 'Gap between items' },
      flex: { type: 'string', default: '0 1 auto', description: 'Flex shorthand property' },
      padding: { type: 'string', default: '0', description: 'Internal padding' },
      width: { type: 'string', default: 'auto', description: 'Width of the flex container' },
      height: { type: 'string', default: 'auto', description: 'Height of the flex container' },
      'min-height': { type: 'string', default: '0', description: 'Minimum height' }
    };
  }

  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      'direction', 'justify', 'align', 'wrap', 'gap', 'flex', 'padding', 'width', 'height', 'min-height'
    ];
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
    this.updateStyles();
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (FlexComponent.observedAttributes.includes(name)) {
      this.updateStyles();
    }
  }

  private updateStyles() {
    this.style.display = 'flex';
    this.style.flexDirection = this.getAttribute('direction') || 'row';
    this.style.justifyContent = this.getAttribute('justify') || 'flex-start';
    this.style.alignItems = this.getAttribute('align') || 'stretch';
    this.style.flexWrap = this.getAttribute('wrap') || 'nowrap';
    this.style.gap = this.getAttribute('gap') || '0';
    this.style.flex = this.getAttribute('flex') || '0 1 auto';
    this.style.padding = this.getAttribute('padding') || '0';
    this.style.width = this.getAttribute('width') || 'auto';
    this.style.height = this.getAttribute('height') || 'auto';
    
    const minHeight = this.getAttribute('min-height');
    if (minHeight) {
      this.style.minHeight = minHeight;
    } else {
      this.style.removeProperty('min-height');
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          box-sizing: border-box;
          position: relative;
        }

        /* Outline visible only in edit mode */
        :host([edit-mode="true"]) {
          border: 1px dashed rgba(148, 163, 184, 0.4);
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('ppt-flex', FlexComponent);
