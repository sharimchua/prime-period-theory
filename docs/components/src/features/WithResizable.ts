type Constructor<T = {}> = new (...args: any[]) => T;

export interface ResizableElement extends HTMLElement {
  resizable: boolean;
  onResizableChanged?(isResizable: boolean): void;
}

export function WithResizable<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements ResizableElement {
    private _resizable: boolean = false;

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'resizable'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        resizable: { type: 'boolean', default: false }
      };
    }

    get resizable() {
      return this._resizable;
    }

    set resizable(value: boolean) {
      if (this._resizable === value) return;
      this._resizable = value;
      if (value) {
        this.setAttribute('resizable', 'true');
      } else {
        this.removeAttribute('resizable');
      }
      this._triggerResizableUpdate(value);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (super['attributeChangedCallback']) {
        (super['attributeChangedCallback'] as any)(name, oldValue, newValue);
      }
      
      if (name === 'resizable') {
        const isResizable = newValue !== null && newValue !== 'false';
        if (this._resizable !== isResizable) {
          this._resizable = isResizable;
          this._triggerResizableUpdate(isResizable);
        }
      }
    }

    connectedCallback() {
      if (super['connectedCallback']) {
        (super['connectedCallback'] as any)();
      }
      this._resizable = this.hasAttribute('resizable') && this.getAttribute('resizable') !== 'false';
      this._triggerResizableUpdate(this._resizable);
    }

    private _triggerResizableUpdate(isResizable: boolean) {
      // 1. Let component define its own behavior
      if (typeof (this as any).onResizableChanged === 'function') {
        (this as any).onResizableChanged(isResizable);
      } else {
        // Default behavior if not defined
        if (isResizable) {
          this.style.setProperty('resize', 'both');
          this.style.setProperty('overflow', 'auto');
        } else {
          this.style.removeProperty('resize');
          this.style.removeProperty('overflow');
        }
      }

      // 2. Cascade to children (resizability might not strictly cascade logically like interactive, 
      // but we adhere to the contract "functionality and features should be cascaded").
      this.propagateResizability(isResizable);
    }

    private propagateResizability(isResizable: boolean) {
      const slots = this.shadowRoot?.querySelectorAll('slot');
      slots?.forEach(slot => {
        const assignedNodes = slot.assignedNodes({ flatten: true });
        assignedNodes.forEach(node => {
          if ('resizable' in node) {
            (node as any).resizable = isResizable;
          }
        });
      });

      Array.from(this.children).forEach(child => {
        if ('resizable' in child) {
          (child as any).resizable = isResizable;
        }
      });
    }
  };
}
