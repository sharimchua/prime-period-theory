import { CustomElement } from './WithInteractive.js';
import { EventBus } from './EventBus.js';

type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface ListenElement extends HTMLElement {
  listenId: string;
  onStateMessage?(id: string, value: any): void;
}

export function WithListen<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements ListenElement {
    private _boundListener = this._handleBusMessage.bind(this);
    
    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'listen-id'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        'listen-id': { type: 'string', default: '', description: 'Comma-separated string IDs to listen to from control components.' }
      };
    }

    get listenId() {
      return this.getAttribute('listen-id') || '';
    }

    set listenId(value: string) {
      this.setAttribute('listen-id', value);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (typeof (Base.prototype as any).attributeChangedCallback === 'function') {
        (Base.prototype as any).attributeChangedCallback.call(this, name, oldValue, newValue);
      }
      if (name === 'listen-id') {
        this._updateSubscriptions(newValue);
      }
    }

    connectedCallback() {
      if (typeof (Base.prototype as any).connectedCallback === 'function') {
        (Base.prototype as any).connectedCallback.call(this);
      }
      this._updateSubscriptions(this.listenId);
    }

    disconnectedCallback() {
      if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
        (Base.prototype as any).disconnectedCallback.call(this);
      }
      this._unsubscribeAll();
    }

    private _listenerMap: Map<string, (v: any) => void> = new Map();

    private _updateSubscriptions(idsString: string | null) {
      this._unsubscribeAll();
      if (!idsString) return;
      
      const ids = idsString.split(',').map(id => id.trim()).filter(id => id.length > 0);
      ids.forEach(id => {
        const callback = (value: any) => this._boundListener(id, value);
        this._listenerMap.set(id, callback);
        EventBus.subscribe(id, callback);
      });
    }

    private _unsubscribeAll() {
      this._listenerMap.forEach((callback, id) => {
        EventBus.unsubscribe(id, callback);
      });
      this._listenerMap.clear();
    }

    private _handleBusMessage(id: string, value: any) {
      if (typeof (this as any).onStateMessage === 'function') {
        (this as any).onStateMessage(id, value);
      }
    }
  };
}
