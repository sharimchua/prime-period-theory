import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';
import { tokenizePhrase } from './solfegeUtils.js';
import type { MidiToSolfegeMapper } from './midi/MidiToSolfegeMapper.js';
import { PitchMapper } from './midi/PitchMapper.js';
import { RhythmMapper } from './midi/RhythmMapper.js';
import { HarmonyMapper } from './midi/HarmonyMapper.js';
export class SolfegeTextInputComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Solfege Text Input',
      familyColor: '#10b981',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'emit-id'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'emit-id': { type: 'string', default: 'glyph-input', description: 'EventBus ID to emit parsed tokens' }
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: block;
        padding: 0.5rem;
      }
      .input-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .input-wrapper {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
      }
      .status-indicator {
        position: absolute;
        left: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #cbd5e1;
        transition: background-color 0.3s;
      }
      .status-indicator.active {
        background-color: #10b981;
        box-shadow: 0 0 5px #10b981;
      }
      input {
        flex: 1;
        padding: 0.5rem 0.5rem 0.5rem 24px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: monospace;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }
      .midi-btn {
        background: transparent;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.4rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        transition: all 0.2s;
        position: relative;
      }
      .midi-btn:hover {
        background: #f1f5f9;
        color: #334155;
      }
      .midi-btn.connected {
        border-color: #10b981;
        color: #10b981;
      }
      .midi-btn svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
    `;
  }

  private inputEl: HTMLInputElement | null = null;
  private statusEl: HTMLElement | null = null;
  private midiBtn: HTMLButtonElement | null = null;
  private handleActiveEditorChanged = this.onActiveEditorChanged.bind(this);
  private handleGlyphInput = this.onGlyphInput.bind(this);
  private handleLayerFocusChanged = this.onLayerFocusChanged.bind(this);
  private isBound = false;

  // MIDI properties
  private midiAccess: WebMidi.MIDIAccess | null = null;
  private activeMapper: MidiToSolfegeMapper | null = null;
  private mappers = {
    melody: new PitchMapper(),
    rhythm: new RhythmMapper(),
    harmony: new HarmonyMapper()
  };
  private currentLayerType: 'melody' | 'rhythm' | 'harmony' | null = null;
  private bridgeActiveNotes: Set<number> = new Set();
  private readonly STRUCT_MOD_1 = 48; // C3
  private readonly STRUCT_MOD_2 = 71; // B4

  override connectedCallback() {
    super.connectedCallback();
    this.render();
    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.subscribe('layer-focus-changed', this.handleLayerFocusChanged);
    const emitId = this.getAttribute('emit-id') || 'glyph-input';
    EventBus.subscribe(emitId, this.handleGlyphInput);
  }
  
  override disconnectedCallback() {
    super.disconnectedCallback();
    EventBus.unsubscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.unsubscribe('layer-focus-changed', this.handleLayerFocusChanged);
    const emitId = this.getAttribute('emit-id') || 'glyph-input';
    EventBus.unsubscribe(emitId, this.handleGlyphInput);
    
    if (this.midiAccess) {
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = null;
      });
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${this.getBaseStyles()}</style>
      <div class="input-container">
        <div class="input-wrapper">
          <div class="status-indicator"></div>
          <input type="text" placeholder="Select a phrase to edit..." />
        </div>
        <button class="midi-btn ${this.midiAccess ? 'connected' : ''}" title="${this.midiAccess ? 'MIDI Connected' : 'Connect MIDI'}">
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M6 10v4M10 10v4M14 10v4M18 10v4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    `;

    this.inputEl = this.shadowRoot.querySelector('input');
    this.statusEl = this.shadowRoot.querySelector('.status-indicator');
    this.midiBtn = this.shadowRoot.querySelector('.midi-btn');

    this.inputEl?.addEventListener('input', () => this.handleInput());
    if (this.midiBtn && !this.midiAccess) {
      this.midiBtn.addEventListener('click', () => this.connectMidi());
    }
  }

  private onActiveEditorChanged(payload: any) {
    if (payload && payload.editor) {
      this.isBound = true;
      if (this.inputEl) {
        this.inputEl.value = payload.rawText || '';
        this.inputEl.focus();
      }
      if (this.statusEl) {
        this.statusEl.classList.add('active');
      }
    } else {
      this.isBound = false;
      if (this.statusEl) {
        this.statusEl.classList.remove('active');
      }
    }
  }

  private handleInput() {
    if (!this.inputEl || !this.isBound) return;
    const text = this.inputEl.value;
    
    const parsedTokens = tokenizePhrase(text);
    const emitId = this.getAttribute('emit-id') || 'glyph-input';
    
    EventBus.publish(emitId, {
      type: 'phrase',
      text: text,
      tokens: parsedTokens
    });
  }

  private onGlyphInput(payload: any) {
    if (this.isBound && this.inputEl && payload && payload.type === 'phrase') {
      if (this.inputEl.value !== payload.text) {
        this.inputEl.value = payload.text || '';
      }
    }
  }

  private onLayerFocusChanged(payload: any) {
    if (payload && payload.layerType) {
      this.currentLayerType = payload.layerType;
      this.activeMapper = this.mappers[this.currentLayerType!];
      this.activeMapper.reset();
    }
  }

  private async connectMidi() {
    try {
      if (!navigator.requestMIDIAccess) {
        throw new Error('Web MIDI API not supported in this browser.');
      }

      this.midiAccess = await navigator.requestMIDIAccess();
      
      this.midiAccess.inputs.forEach(input => {
        input.onmidimessage = this.handleMidiMessage.bind(this);
      });

      this.midiAccess.onstatechange = (event) => {
        if (event.port.type === 'input') {
          const input = event.port as WebMidi.MIDIInput;
          if (input.state === 'connected') {
            input.onmidimessage = this.handleMidiMessage.bind(this);
          }
        }
        this.render(); // re-render to update connected status
      };

      if (!this.activeMapper) {
        this.activeMapper = this.mappers.melody;
      }

      this.render();
    } catch (err) {
      console.error('MIDI connection failed:', err);
    }
  }

  private handleMidiMessage(event: WebMidi.MIDIMessageEvent) {
    if (!this.activeMapper || !this.inputEl || !this.isBound) return;
    const emitId = this.getAttribute('emit-id') || 'glyph-input';

    const [command, note, velocity] = event.data;
    const isNoteOn = (command === 144 && velocity > 0);
    const isNoteOff = (command === 128 || (command === 144 && velocity === 0));

    if (isNoteOn) this.bridgeActiveNotes.add(note);
    if (isNoteOff) this.bridgeActiveNotes.delete(note);

    if (this.bridgeActiveNotes.has(this.STRUCT_MOD_1) && this.bridgeActiveNotes.has(this.STRUCT_MOD_2)) {
      if (isNoteOn) {
        if (note === 52) { // E3
          this.inputEl.value = '';
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
      if (isNoteOn && note !== this.STRUCT_MOD_1 && note !== this.STRUCT_MOD_2) return;
    }

    const result = this.activeMapper.processMidiEvent(event);
    let currentRawText = this.inputEl.value;

    if (result === 'DELETE') {
      const parts = currentRawText.trim().split(' ');
      if (parts.length > 0) {
        parts.pop();
        currentRawText = parts.join(' ');
      }
    } else if (result && result.length > 0) {
      const newTokens = result.map(r => r.raw).join(' ');
      currentRawText = currentRawText ? `${currentRawText} ${newTokens}` : newTokens;
    } else {
      return;
    }

    this.inputEl.value = currentRawText;
    const tokens = tokenizePhrase(currentRawText);
    EventBus.publish(emitId, {
      type: 'phrase',
      tokens,
      text: currentRawText
    });
  }
}

if (!customElements.get('ppt-solfege-text-input')) {
  customElements.define('ppt-solfege-text-input', SolfegeTextInputComponent);
}
