export interface CustomElement extends HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface InteractiveElement extends HTMLElement {
  interactive: boolean;
  onInteractiveChanged?(isInteractive: boolean): void;
}

export function WithInteractive<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements InteractiveElement {
    private _interactive: boolean = true;

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'interactive'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        interactive: { type: 'boolean', default: true, description: 'Controls whether the component responds to mouse/touch events. Disabling this applies 60% opacity and pointer-events: none.' }
      };
    }

    get interactive() {
      return this._interactive;
    }

    set interactive(value: boolean) {
      if (this._interactive === value) return;
      this._interactive = value;
      if (value) {
        this.setAttribute('interactive', 'true');
      } else {
        this.removeAttribute('interactive');
      }
      this._triggerInteractiveUpdate(value);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (typeof (Base.prototype as any).attributeChangedCallback === 'function') {
        (Base.prototype as any).attributeChangedCallback.call(this, name, oldValue, newValue);
      }
      
      if (name === 'interactive') {
        const isInteractive = newValue !== null && newValue !== 'false';
        if (this._interactive !== isInteractive) {
          this._interactive = isInteractive;
          this._triggerInteractiveUpdate(isInteractive);
        }
      }
    }

    connectedCallback() {
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      this._interactive = this.getAttribute('interactive') !== 'false';
      this._triggerInteractiveUpdate(this._interactive);
    }

    private _triggerInteractiveUpdate(isInteractive: boolean) {
      // 1. Let component define its own behavior
      if (typeof (this as any).onInteractiveChanged === 'function') {
        (this as any).onInteractiveChanged(isInteractive);
      } else {
        // Default behavior if not defined
        if (!isInteractive) {
          this.style.setProperty('pointer-events', 'none');
          this.style.setProperty('user-select', 'none');
          this.style.setProperty('--ppt-interactive-opacity', '0.6');
        } else {
          this.style.removeProperty('pointer-events');
          this.style.removeProperty('user-select');
          this.style.setProperty('--ppt-interactive-opacity', '1');
        }
      }

      // 2. Cascade to children
      this.propagateInteractivity(isInteractive);
    }

    private propagateInteractivity(isInteractive: boolean) {
      const slots = this.shadowRoot?.querySelectorAll('slot');
      slots?.forEach(slot => {
        const assignedNodes = slot.assignedNodes({ flatten: true });
        assignedNodes.forEach(node => {
          if ('interactive' in node) {
            (node as any).interactive = isInteractive;
          }
        });
      });

      Array.from(this.children).forEach(child => {
        if ('interactive' in child) {
          (child as any).interactive = isInteractive;
        }
      });
    }
  };
}
