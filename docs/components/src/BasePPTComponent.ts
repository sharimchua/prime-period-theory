export class BasePPTComponent extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['min-width', 'min-height'];
  }

  static get pptMetadata(): Record<string, any> {
    return {
      'min-width': { type: 'number', default: 100, description: 'Minimum width before the component signals it is compromised visually.' },
      'min-height': { type: 'number', default: 100, description: 'Minimum height before the component signals it is compromised visually.' }
    };
  }

  static get componentDef(): Record<string, any> {
    return {
      displayName: 'Base Component',
      familyColor: '#888888',
      acceptsChildren: ['*'],
      canNestIn: ['*']
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    // Override in subclasses
  }

  protected _resizeObserver: ResizeObserver | null = null;
  protected _isCompromised: boolean = false;

  connectedCallback() {
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  protected setupResizeObserver() {
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use contentRect for inner size, or target.getBoundingClientRect() for outer size
        // We will use borderBoxSize if available, otherwise fallback to contentRect
        const width = entry.borderBoxSize ? entry.borderBoxSize[0].inlineSize : entry.contentRect.width;
        const height = entry.borderBoxSize ? entry.borderBoxSize[0].blockSize : entry.contentRect.height;
        this.checkCompromiseState(width, height);
      }
    });
    this._resizeObserver.observe(this);
  }

  protected checkCompromiseState(width: number, height: number) {
    // Default to 100px minimum threshold unless specified
    const minW = Number(this.getAttribute('min-width')) || 100;
    const minH = Number(this.getAttribute('min-height')) || 100;
    
    const compromised = width > 0 && height > 0 && (width < minW || height < minH);
    
    if (compromised && !this._isCompromised) {
      this._isCompromised = true;
      this.dispatchEvent(new CustomEvent('ppt-compromised', { 
        detail: { width, height, minWidth: minW, minHeight: minH },
        bubbles: true,
        composed: true // Allows event to pass through Shadow DOM boundaries
      }));
    } else if (!compromised && this._isCompromised) {
      this._isCompromised = false;
      this.dispatchEvent(new CustomEvent('ppt-restored', {
        detail: { width, height },
        bubbles: true,
        composed: true
      }));
    }
  }


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
    `;
  }
}
