import { type CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface ResizableElement extends HTMLElement {
  resizable: boolean;
  onResizableChanged?(isResizable: boolean): void;
}

export function WithResizable<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements ResizableElement {
    private _resizable: boolean = false;
    private _isResizing = false;
    private _initialWidth = 0;
    private _initialHeight = 0;
    private _startX = 0;
    private _startY = 0;

    private _onStartResizeBind = this._onStartResize.bind(this);
    private _onResizeBind = this._onResize.bind(this);
    private _onEndResizeBind = this._onEndResize.bind(this);

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'resizable'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        resizable: { type: 'boolean', default: false, description: 'Allows the user to resize this component interactively by dragging its bottom-right corner.' }
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
      if (typeof (Base.prototype as any).attributeChangedCallback === 'function') {
        (Base.prototype as any).attributeChangedCallback.call(this, name, oldValue, newValue);
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
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      this._resizable = this.hasAttribute('resizable') && this.getAttribute('resizable') !== 'false';
      this._triggerResizableUpdate(this._resizable);

      this.addEventListener('mousedown', this._onStartResizeBind);
      this.addEventListener('touchstart', this._onStartResizeBind, { passive: false });
    }

    disconnectedCallback() {
      if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
        (Base.prototype as any).disconnectedCallback.call(this);
      }
      this.removeEventListener('mousedown', this._onStartResizeBind);
      this.removeEventListener('touchstart', this._onStartResizeBind);
      
      document.removeEventListener('mousemove', this._onResizeBind);
      document.removeEventListener('touchmove', this._onResizeBind);
      document.removeEventListener('mouseup', this._onEndResizeBind);
      document.removeEventListener('touchend', this._onEndResizeBind);
    }

    private _onStartResize(e: MouseEvent | TouchEvent) {
      if (!this._resizable) return;

      const rect = this.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // Check if click/touch is in bottom-right corner (within 24px touch target)
      const handleSize = 24;
      const isBottomRight = (clientX >= rect.right - handleSize) && (clientY >= rect.bottom - handleSize);

      if (isBottomRight) {
        e.preventDefault();
        e.stopPropagation();

        this._isResizing = true;
        this._initialWidth = rect.width;
        this._initialHeight = rect.height;
        this._startX = clientX;
        this._startY = clientY;

        document.addEventListener('mousemove', this._onResizeBind);
        document.addEventListener('touchmove', this._onResizeBind, { passive: false });
        document.addEventListener('mouseup', this._onEndResizeBind);
        document.addEventListener('touchend', this._onEndResizeBind);
      }
    }

    private _onResize(e: MouseEvent | TouchEvent) {
      if (!this._isResizing) return;

      if ('touches' in e) {
        e.preventDefault(); // Prevent scrolling
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this._startX;
      const deltaY = clientY - this._startY;

      const newWidth = Math.max(50, this._initialWidth + deltaX);
      const newHeight = Math.max(50, this._initialHeight + deltaY);

      this.style.width = `${newWidth}px`;
      this.style.height = `${newHeight}px`;

      this.dispatchEvent(new CustomEvent('ppt-resized', {
        detail: { width: newWidth, height: newHeight },
        bubbles: true,
        composed: true
      }));
    }

    private _onEndResize() {
      if (this._isResizing) {
        this._isResizing = false;
        document.removeEventListener('mousemove', this._onResizeBind);
        document.removeEventListener('touchmove', this._onResizeBind);
        document.removeEventListener('mouseup', this._onEndResizeBind);
        document.removeEventListener('touchend', this._onEndResizeBind);
      }
    }

    private _triggerResizableUpdate(isResizable: boolean) {
      if (typeof (this as any).onResizableChanged === 'function') {
        (this as any).onResizableChanged(isResizable);
      } else {
        if (isResizable) {
          this.style.setProperty('overflow', 'auto');
        } else {
          this.style.removeProperty('overflow');
        }
      }

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
