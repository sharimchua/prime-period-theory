import { type CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface PitchElement extends HTMLElement {
  pitch: string;
}

export function WithPitch<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements PitchElement {
    private _pitch: string = 'C4';

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'pitch'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        pitch: { type: 'string', default: 'C4', description: 'The musical pitch assigned to this component (e.g. C4, A#3)' }
      };
    }

    get pitch() {
      return this._pitch;
    }

    set pitch(value: string) {
      if (this._pitch === value) return;
      this._pitch = value;
      this.setAttribute('pitch', value);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (typeof (Base.prototype as any).attributeChangedCallback === 'function') {
        (Base.prototype as any).attributeChangedCallback.call(this, name, oldValue, newValue);
      }
      
      if (name === 'pitch') {
        if (newValue !== null && this._pitch !== newValue) {
          this._pitch = newValue;
        }
      }
    }

    connectedCallback() {
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      const pitchAttr = this.getAttribute('pitch');
      if (pitchAttr) {
        this._pitch = pitchAttr;
      }
    }
  };
}
