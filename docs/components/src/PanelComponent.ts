import { BasePPTComponent } from './BasePPTComponent.js';
import { WithInteractive } from './features/WithInteractive.js';
import { WithResizable } from './features/WithResizable.js';

export class PanelComponent extends WithResizable(WithInteractive(BasePPTComponent)) {
  static override get componentDef() {
    return {
      displayName: 'Panel',
      familyColor: '#e67e22',
      acceptsChildren: [],
      canNestIn: ['ppt-container']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'panel-align', 'ratio'];
  }

  get panelAlign() {
    return this.getAttribute('panel-align') || 'right';
  }

  set panelAlign(value: string) {
    this.setAttribute('panel-align', value);
  }

  get ratio() {
    return this.getAttribute('ratio') || '50%';
  }

  set ratio(value: string) {
    this.setAttribute('ratio', value);
  }

  private isDragging = false;
  private currentX = 0;
  private currentY = 0;
  private initialX = 0;
  private initialY = 0;
  private xOffset = 0;
  private yOffset = 0;

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'panel-align' || name === 'ratio') {
      this.updateStyles();
      // Notify parent container that layout might need recalculation
      this.dispatchEvent(new CustomEvent('ppt-panel-updated', { bubbles: true, composed: true }));
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();
    this.updateStyles();
    this.setupDragging();
  }

  private updateStyles() {
    if (this.panelAlign === 'floating') {
      this.style.setProperty('position', 'absolute');
      this.style.setProperty('z-index', '10');
      this.style.removeProperty('flex');
      this.style.removeProperty('width');
      this.style.removeProperty('height');
      // Reset transform if switching back to floating
      this.style.setProperty('transform', `translate3d(${this.xOffset}px, ${this.yOffset}px, 0)`);
    } else {
      this.style.removeProperty('position');
      this.style.removeProperty('z-index');
      this.style.removeProperty('transform');
      this.style.removeProperty('top');
      this.style.removeProperty('left');
      
      // Inline flex sizing
      this.style.setProperty('flex', `0 0 ${this.ratio}`);
      if (this.panelAlign === 'left' || this.panelAlign === 'right') {
        this.style.setProperty('height', '100%');
        this.style.setProperty('width', this.ratio);
      } else {
        this.style.setProperty('width', '100%');
        this.style.setProperty('height', this.ratio);
      }
    }
  }

  private setupDragging() {
    const panel = this.shadowRoot?.querySelector('.panel-inner') as HTMLElement;
    if (!panel) return;

    panel.addEventListener('mousedown', this.dragStart.bind(this));
    document.addEventListener('mouseup', this.dragEnd.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
  }

  private dragStart(e: MouseEvent) {
    if (this.panelAlign !== 'floating' || !this.interactive) return;

    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;
    this.isDragging = true;
  }

  private dragEnd() {
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.isDragging = false;
  }

  private drag(e: MouseEvent) {
    if (!this.isDragging) return;
    e.preventDefault();

    this.currentX = e.clientX - this.initialX;
    this.currentY = e.clientY - this.initialY;

    // Constrain to parent boundaries
    const parent = this.parentElement;
    if (parent) {
      // Future implementation for strict boundary checking
    }

    this.xOffset = this.currentX;
    this.yOffset = this.currentY;
    this.style.setProperty('transform', `translate3d(${this.currentX}px, ${this.currentY}px, 0)`);
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
        }

        .panel-inner {
          background: var(--ppt-panel-bg, rgba(255, 255, 255, 0.95));
          border: var(--ppt-panel-border, 1px solid #e2e8f0);
          border-radius: var(--ppt-panel-radius, 8px);
          padding: var(--ppt-panel-padding, 1rem);
          box-shadow: var(--ppt-panel-shadow, 0 4px 6px rgba(0,0,0,0.1));
          width: 100%;
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
        }

        :host([panel-align="floating"]) .panel-inner {
          cursor: grab;
          height: auto;
          width: max-content;
          min-width: 200px;
        }

        :host([panel-align="floating"]) .panel-inner:active {
          cursor: grabbing;
        }
      </style>

      <div class="panel-inner">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('ppt-panel', PanelComponent);
