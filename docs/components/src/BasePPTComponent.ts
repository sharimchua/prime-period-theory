export class BasePPTComponent extends HTMLElement {
  protected _interactive: boolean = true;

  static get observedAttributes() {
    return ['interactive', 'resizable'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  get interactive() {
    return this._interactive;
  }

  set interactive(value: boolean) {
    this._interactive = value;
    if (value) {
      this.setAttribute('interactive', 'true');
    } else {
      this.removeAttribute('interactive');
    }
    this.updateInteractivity();
    this.propagateInteractivity(value);
  }

  get resizable() {
    return this.hasAttribute('resizable') && this.getAttribute('resizable') !== 'false';
  }

  set resizable(value: boolean) {
    if (value) {
      this.setAttribute('resizable', 'true');
    } else {
      this.removeAttribute('resizable');
    }
    this.updateResizability();
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'interactive') {
      const isInteractive = newValue !== null && newValue !== 'false';
      this._interactive = isInteractive;
      this.updateInteractivity();
      this.propagateInteractivity(isInteractive);
    } else if (name === 'resizable') {
      this.updateResizability();
    }
  }

  protected _resizeObserver: ResizeObserver | null = null;
  protected _isCompromised: boolean = false;

  connectedCallback() {
    // Read initial attributes
    this._interactive = this.getAttribute('interactive') !== 'false';
    this.updateInteractivity();
    this.updateResizability();
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

  protected updateInteractivity() {
    if (!this.shadowRoot) return;
    
    // Default interactivity logic applied to the host
    if (!this._interactive) {
      this.style.setProperty('pointer-events', 'none');
      this.style.setProperty('user-select', 'none');
      this.style.setProperty('--ppt-interactive-opacity', '0.6');
    } else {
      this.style.removeProperty('pointer-events');
      this.style.removeProperty('user-select');
      this.style.setProperty('--ppt-interactive-opacity', '1');
    }
  }

  protected updateResizability() {
    const isResizable = this.hasAttribute('resizable') && this.getAttribute('resizable') !== 'false';
    if (isResizable) {
      this.style.setProperty('resize', 'both');
      this.style.setProperty('overflow', 'auto');
    } else {
      this.style.removeProperty('resize');
      this.style.removeProperty('overflow');
    }
  }

  // Propagate interactivity flag to child PPT components within slots or light DOM
  protected propagateInteractivity(isInteractive: boolean) {
    // Propagate to slotted elements
    const slots = this.shadowRoot?.querySelectorAll('slot');
    slots?.forEach(slot => {
      const assignedNodes = slot.assignedNodes({ flatten: true });
      assignedNodes.forEach(node => {
        if (node instanceof BasePPTComponent) {
          node.interactive = isInteractive;
        }
      });
    });

    // Propagate to direct children that are PPT components
    Array.from(this.children).forEach(child => {
      if (child instanceof BasePPTComponent) {
        child.interactive = isInteractive;
      }
    });
  }

  // Helper method for applying base styles
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
