import { type CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface HighlightElement extends HTMLElement {
  highlight(): void;
  unhighlight(): void;
}

export function WithHighlight<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements HighlightElement {
    
    static get observedAttributes() {
      return [...((Base as any).observedAttributes || [])];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {})
      };
    }

    connectedCallback() {
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      
      if (!document.getElementById('ppt-highlight-styles')) {
        const style = document.createElement('style');
        style.id = 'ppt-highlight-styles';
        style.innerHTML = `
          .ppt-highlighted {
            scale: 1.08;
            filter: brightness(1.2) drop-shadow(0 0 5px rgba(255,255,255,0.5));
            transition: scale 0.1s ease-out, filter 0.1s ease-out !important;
            z-index: 10;
          }
        `;
        document.head.appendChild(style);
      }
    }

    highlight() {
      this.classList.add('ppt-highlighted');
    }

    unhighlight() {
      this.classList.remove('ppt-highlighted');
    }
  };
}
