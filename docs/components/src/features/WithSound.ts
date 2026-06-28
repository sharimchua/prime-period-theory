import * as Tone from 'tone';
import { type CustomElement } from './WithInteractive.js';

type Constructor<T = CustomElement> = new (...args: any[]) => T;

export interface SoundElement extends HTMLElement {
  playSound(pitch?: string, duration?: string): void;
}

export function WithSound<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base implements SoundElement {
    private _synth: Tone.PolySynth | null = null;
    private _initialized = false;

    static get observedAttributes() {
      return [...((Base as any).observedAttributes || [])];
    }

    static get pptMetadata() {
      return {
        ...((Base as any).pptMetadata || {})
      };
    }

    private initSynth() {
      if (this._initialized) return;
      this._synth = new Tone.PolySynth(Tone.Synth).toDestination();
      this._initialized = true;
    }

    playSound(pitch: string = 'C4', duration: string = '8n') {
      this.initSynth();
      if (Tone.context.state !== 'running') {
        Tone.start();
      }
      this._synth?.triggerAttackRelease(pitch, duration);
    }
  };
}
