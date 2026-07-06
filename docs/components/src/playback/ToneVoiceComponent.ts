import { BasePPTComponent } from '../BasePPTComponent.js';
import * as Tone from 'tone';
import { EventBus } from '../features/EventBus.js';

export class ToneVoiceComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Tone Voice',
      familyColor: '#ef4444',
      acceptsChildren: [],
      canNestIn: ['ppt-coil']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'voice-id'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'voice-id': { type: 'string', default: 'default', description: 'Identifier for this voice to receive targeted play commands' }
    };
  }

  private _synth: Tone.PolySynth | null = null;
  private _initialized = false;
  private handlePlayNote = this.onPlayNote.bind(this);
  private handleStopNote = this.onStopNote.bind(this);

  private initSynth() {
    if (this._initialized) return;
    this._synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this._initialized = true;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none'; // Headless/Audio only component
    
    const vId = this.getAttribute('voice-id') || 'default';
    EventBus.subscribe(`play-note-${vId}`, this.handlePlayNote);
    EventBus.subscribe(`stop-note-${vId}`, this.handleStopNote);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    const vId = this.getAttribute('voice-id') || 'default';
    EventBus.unsubscribe(`play-note-${vId}`, this.handlePlayNote);
    EventBus.unsubscribe(`stop-note-${vId}`, this.handleStopNote);
    if (this._synth) {
      this._synth.dispose();
      this._synth = null;
      this._initialized = false;
    }
  }

  private async onPlayNote(payload: any) {
    if (!payload || payload.freq === undefined) return;
    this.initSynth();
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    const time = payload.time !== undefined ? payload.time : Tone.now();
    const duration = payload.duration !== undefined ? payload.duration : 0.5;
    this._synth?.triggerAttackRelease(payload.freq, duration, time);
  }

  private onStopNote(payload: any) {
    if (this._synth) {
      if (payload && payload.freq !== undefined) {
        const time = payload.time !== undefined ? payload.time : Tone.now();
        this._synth.triggerRelease(payload.freq, time);
      } else {
        // generic stop all
        this._synth.releaseAll();
      }
    }
  }
}

if (!customElements.get('ppt-tone-voice')) {
  customElements.define('ppt-tone-voice', ToneVoiceComponent);
}
