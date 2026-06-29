export class BasePPTComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get componentDef() {
    return {
      displayName: 'Base Component',
      familyColor: '#888888',
      acceptsChildren: ['*'] as string[],
      canNestIn: ['*'] as string[]
    };
  }

  static get observedAttributes(): string[] {
    return [];
  }

  static get pptMetadata(): Record<string, any> {
    return {};
  }

  // Fallback lifecycle methods so subclasses can safely call super
  attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) {}
  connectedCallback() {}
  disconnectedCallback() {}

  protected getBaseStyles(): string {
    return `
      :host {
        display: block;
        box-sizing: border-box;
        opacity: var(--ppt-interactive-opacity, 1);
        transition: opacity 0.2s ease;
        container-type: inline-size;
        width: 100%;
        height: 100%;
      }
      *, *::before, *::after {
        box-sizing: inherit;
      }
      :host([resizable]) {
        position: relative !important;
      }
      :host([resizable])::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        cursor: se-resize;
        background: linear-gradient(135deg, transparent 40%, #94a3b8 40%, #94a3b8 50%, transparent 50%, transparent 60%, #94a3b8 60%);
        z-index: 9999;
        pointer-events: none;
      }
    `;
  }
}
