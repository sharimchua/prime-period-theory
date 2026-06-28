import { CustomElement } from './WithInteractive.js';
import { EventBus } from './EventBus.js';

type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface EmitElement extends HTMLElement {
  bindId: string;
  emitState(value: any): void;
}

export function WithEmit<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements EmitElement {
    
    static get observedAttributes() {
      return [...((Base as any).observedAttributes || []), 'bind-id'];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {}),
        'bind-id': { type: 'string', default: '', description: 'String ID to bind this control to an equivalent listen-id on a target component.' }
      };
    }

    get bindId() {
      return this.getAttribute('bind-id') || '';
    }

    set bindId(value: string) {
      this.setAttribute('bind-id', value);
    }

    emitState(value: any) {
      if (this.bindId) {
        EventBus.publish(this.bindId, value);
      }
    }
  };
}
