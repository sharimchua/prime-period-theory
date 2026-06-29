import { type CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface FloatingElement extends HTMLElement {
  floating: boolean;
  onFloatingChanged?(isFloating: boolean): void;
}

export function WithFloating<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements FloatingElement {
    private _floating: boolean = false;
    private _isDragging = false;
    private _currentX = 0;
    private _currentY = 0;
    private _initialX = 0;
    private _initialY = 0;
    private _xOffset = 0;
    private _yOffset = 0;

    private _onDragStart = this._dragStart.bind(this);
    private _onDrag = this._drag.bind(this);
    private _onDragEnd = this._dragEnd.bind(this);

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'floating'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        floating: { type: 'boolean', default: false, description: 'If true, the element floats as a draggable overlay instead of being placed inline.' }
      };
    }

    get floating() {
      return this._floating;
    }

    set floating(value: boolean) {
      if (this._floating === value) return;
      this._floating = value;
      if (value) {
        this.setAttribute('floating', 'true');
      } else {
        this.removeAttribute('floating');
      }
      this._triggerFloatingUpdate(value);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (typeof (Base.prototype as any).attributeChangedCallback === 'function') {
        (Base.prototype as any).attributeChangedCallback.call(this, name, oldValue, newValue);
      }
      
      if (name === 'floating') {
        const isFloating = newValue !== null && newValue !== 'false';
        if (this._floating !== isFloating) {
          this._floating = isFloating;
          this._triggerFloatingUpdate(isFloating);
        }
      }
    }

    connectedCallback() {
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      this._floating = this.hasAttribute('floating') && this.getAttribute('floating') !== 'false';
      this._triggerFloatingUpdate(this._floating);
    }

    disconnectedCallback() {
      if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
        (Base.prototype as any).disconnectedCallback.call(this);
      }
      this._teardownDragging();
    }

    private _triggerFloatingUpdate(isFloating: boolean) {
      if (isFloating) {
        this.style.setProperty('position', 'absolute');
        this.style.setProperty('z-index', '10');
        this.style.setProperty('transform', `translate3d(${this._xOffset}px, ${this._yOffset}px, 0)`);
        this._setupDragging();
      } else {
        this.style.removeProperty('position');
        this.style.removeProperty('z-index');
        this.style.removeProperty('transform');
        this.style.removeProperty('top');
        this.style.removeProperty('left');
        this._teardownDragging();
      }

      if (typeof (this as any).onFloatingChanged === 'function') {
        (this as any).onFloatingChanged(isFloating);
      }
      this.dispatchEvent(new CustomEvent('ppt-panel-updated', { bubbles: true, composed: true }));
    }

    private _setupDragging() {
      const panel = this.shadowRoot?.querySelector('.panel-inner') as HTMLElement || this;
      
      panel.removeEventListener('mousedown', this._onDragStart);
      panel.removeEventListener('touchstart', this._onDragStart);

      panel.addEventListener('mousedown', this._onDragStart);
      panel.addEventListener('touchstart', this._onDragStart, { passive: true });
    }

    private _teardownDragging() {
      const panel = this.shadowRoot?.querySelector('.panel-inner') as HTMLElement || this;
      panel.removeEventListener('mousedown', this._onDragStart);
      panel.removeEventListener('touchstart', this._onDragStart);
      
      document.removeEventListener('mousemove', this._onDrag);
      document.removeEventListener('touchmove', this._onDrag);
      document.removeEventListener('mouseup', this._onDragEnd);
      document.removeEventListener('touchend', this._onDragEnd);
    }

    private _dragStart(e: MouseEvent | TouchEvent) {
      if (!this._floating || (e.target as HTMLElement).closest('input, select, textarea, button')) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      this._initialX = clientX - this._xOffset;
      this._initialY = clientY - this._yOffset;
      this._isDragging = true;

      document.addEventListener('mousemove', this._onDrag);
      document.addEventListener('touchmove', this._onDrag, { passive: false });
      document.addEventListener('mouseup', this._onDragEnd);
      document.addEventListener('touchend', this._onDragEnd);
    }

    private _dragEnd() {
      if (this._isDragging) {
        this._initialX = this._currentX;
        this._initialY = this._currentY;
        this._isDragging = false;

        document.removeEventListener('mousemove', this._onDrag);
        document.removeEventListener('touchmove', this._onDrag);
        document.removeEventListener('mouseup', this._onDragEnd);
        document.removeEventListener('touchend', this._onDragEnd);
      }
    }

    private _drag(e: MouseEvent | TouchEvent) {
      if (!this._isDragging) return;
      
      if ('touches' in e) {
        e.preventDefault();
      }

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      this._currentX = clientX - this._initialX;
      this._currentY = clientY - this._initialY;

      this._xOffset = this._currentX;
      this._yOffset = this._currentY;
      this.style.setProperty('transform', `translate3d(${this._currentX}px, ${this._currentY}px, 0)`);
    }
  };
}
