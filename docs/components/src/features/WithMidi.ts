import { MidiOrchestrator, type MidiNoteEvent } from './MidiOrchestrator';

import { type CustomElement } from './WithInteractive.js';
type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface MidiElement extends HTMLElement {
  onMidiMessage?(event: MidiNoteEvent): void;
}

export function WithMidi<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements MidiElement {
    private _midiUnsubscribe?: () => void;

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
      
      const orchestrator = MidiOrchestrator.getInstance();
      orchestrator.initialize(); // Async, but that's fine
      
      this._midiUnsubscribe = orchestrator.subscribe((event) => {
        if (typeof (this as any).onMidiMessage === 'function') {
          (this as any).onMidiMessage(event);
        }
      });
    }

    disconnectedCallback() {
      if (typeof (Base.prototype as any).disconnectedCallback === 'function') {
        (Base.prototype as any).disconnectedCallback.call(this);
      }
      if (this._midiUnsubscribe) {
        this._midiUnsubscribe();
      }
    }
  };
}
