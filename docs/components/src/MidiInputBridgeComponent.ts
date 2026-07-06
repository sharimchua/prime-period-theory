import { EventBus } from './features/EventBus.js';
import type { MidiToSolfegeMapper } from './midi/MidiToSolfegeMapper.js';
import { PitchMapper } from './midi/PitchMapper.js';
import { RhythmMapper } from './midi/RhythmMapper.js';
import { HarmonyMapper } from './midi/HarmonyMapper.js';
import { tokenizePhrase } from './solfegeUtils.js';

export class MidiInputBridgeComponent extends HTMLElement {
  private _emitId: string | null = null;
  private midiAccess: WebMidi.MIDIAccess | null = null;
  private activeMapper: MidiToSolfegeMapper | null = null;
  private mappers = {
    melody: new PitchMapper(),
    rhythm: new RhythmMapper(),
    harmony: new HarmonyMapper()
  };
  
  // Track currently focused layer type via global selection or explicit EventBus message
  private currentRawText: string = '';
  private currentLayerType: 'melody' | 'rhythm' | 'harmony' | null = null;
  private _emitId: string | null = null;

  // Track raw MIDI notes to detect structural combos (C3 + B4)
  private bridgeActiveNotes: Set<number> = new Set();
  private readonly STRUCT_MOD_1 = 48; // C3
  private readonly STRUCT_MOD_2 = 71; // B4

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.handleMidiMessage = this.handleMidiMessage.bind(this);
    this.connectMidi = this.connectMidi.bind(this);
    
    // Listen for layer focus changes so we know which mapper to route to
    EventBus.subscribe('layer-focus-changed', this.handleFocusChange.bind(this));
    // Listen for the active editor so we can append to its text
    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged.bind(this));
  }

  static get observedAttributes() {
    return ['emit-id'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'emit-id') {
      this._emitId = newValue;
    }
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this.midiAccess) {
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = null;
      });
    }
  }

  private handleFocusChange(payload: any) {
    if (payload && payload.layerType) {
      this.currentLayerType = payload.layerType;
      this.activeMapper = this.mappers[this.currentLayerType];
      this.activeMapper.reset();
      this.render();
    }
  }

  private handleActiveEditorChanged(event: Event) {
    const customEvent = event as CustomEvent<{ editor: any, rawText: string }>;
    if (customEvent.detail && customEvent.detail.editor) {
      this.currentRawText = customEvent.detail.rawText || '';
    } else {
      this.currentRawText = '';
    }
  }

  private async connectMidi() {
    try {
      if (!navigator.requestMIDIAccess) {
        throw new Error('Web MIDI API not supported in this browser.');
      }

      this.midiAccess = await navigator.requestMIDIAccess();
      
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = this.handleMidiMessage;
      });

      this.midiAccess.onstatechange = (event) => {
        if (event.port.type === 'input') {
          const input = event.port as WebMidi.MIDIInput;
          if (input.state === 'connected') {
            input.onmidimessage = this.handleMidiMessage;
          }
        }
        this.render(); // re-render to update connected devices list
      };

      // Set default mapper if none selected
      if (!this.activeMapper) {
        this.activeMapper = this.mappers.melody;
      }

      this.render();
    } catch (err) {
      console.error('MIDI connection failed:', err);
      const errPanel = this.shadowRoot?.querySelector('.error');
      if (errPanel) {
        errPanel.textContent = 'MIDI connection failed: ' + err;
      }
    }
  }

  private handleMidiMessage(event: WebMidi.MIDIMessageEvent) {
    if (!this.activeMapper || !this._emitId) return;

    const [command, note, velocity] = event.data;
    const isNoteOn = (command === 144 && velocity > 0);
    const isNoteOff = (command === 128 || (command === 144 && velocity === 0));

    if (isNoteOn) this.bridgeActiveNotes.add(note);
    if (isNoteOff) this.bridgeActiveNotes.delete(note);

    // Structural command combo (C3 + B4)
    if (this.bridgeActiveNotes.has(this.STRUCT_MOD_1) && this.bridgeActiveNotes.has(this.STRUCT_MOD_2)) {
      if (isNoteOn) {
        if (note === 52) { // E3
          this.currentRawText = ''; // Clear locally in case it's the last row
          EventBus.publish('coil-layer-delete', null);
          return;
        }
        if (note === 55) { // G3
          EventBus.publish('coil-layer-add', null);
          return;
        }
        if (note === 54) { // F#3
          EventBus.publish('coil-nav-up', null);
          return;
        }
        if (note === 51) { // D#3
          EventBus.publish('coil-nav-down', null);
          return;
        }
      }
      
      // If the structural chord is held, we suppress passing *any* other keys to the mapper
      // EXCEPT note-offs, so the mapper doesn't get stuck keys.
      if (isNoteOn && note !== this.STRUCT_MOD_1 && note !== this.STRUCT_MOD_2) {
        return;
      }
    }

    const result = this.activeMapper.processMidiEvent(event);

    if (result === 'DELETE') {
      const parts = this.currentRawText.trim().split(' ');
      if (parts.length > 0) {
        parts.pop();
        this.currentRawText = parts.join(' ');
        this.publishPhrase();
      }
    } else if (result && result.length > 0) {
      const newTokens = result.map(r => r.raw).join(' ');
      this.currentRawText = this.currentRawText ? `${this.currentRawText} ${newTokens}` : newTokens;
      this.publishPhrase();
    }
  }

  private publishPhrase() {
    if (!this._emitId) return;
    const tokens = tokenizePhrase(this.currentRawText);
    EventBus.publish(this._emitId, {
      type: 'phrase',
      tokens,
      text: this.currentRawText
    });
  }

  private render() {
    let statusText = 'Disconnected';
    let devices = 0;
    
    if (this.midiAccess) {
      devices = Array.from(this.midiAccess.inputs.values()).length;
      statusText = `Connected (${devices} inputs)`;
    }

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
        }
        .container {
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
        }
        button {
          padding: 0.4rem 0.8rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #1d4ed8;
        }
        button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        .status {
          color: #475569;
        }
        .error {
          color: #ef4444;
          font-size: 0.8rem;
        }
      </style>
      <div class="container">
        <button id="connect-btn" ${this.midiAccess ? 'disabled' : ''}>
          ${this.midiAccess ? 'MIDI Active' : 'Connect MIDI'}
        </button>
        <span class="status">Status: ${statusText}</span>
        <span class="error"></span>
      </div>
    `;

    const btn = this.shadowRoot!.getElementById('connect-btn');
    if (btn && !this.midiAccess) {
      btn.addEventListener('click', this.connectMidi);
    }
  }
}

customElements.define('ppt-midi-input-bridge', MidiInputBridgeComponent);
