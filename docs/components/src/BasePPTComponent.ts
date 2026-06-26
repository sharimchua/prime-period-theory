export class BasePPTComponent extends HTMLElement {
  protected _interactive: boolean = true;

  static get observedAttributes() {
    return ['interactive'];
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

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'interactive') {
      const isInteractive = newValue !== null && newValue !== 'false';
      this._interactive = isInteractive;
      this.updateInteractivity();
      this.propagateInteractivity(isInteractive);
    }
  }

  connectedCallback() {
    // Read initial interactive attribute state
    this._interactive = this.getAttribute('interactive') !== 'false';
    this.updateInteractivity();
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
      }
      *, *::before, *::after {
        box-sizing: inherit;
      }
    `;
  }
}
