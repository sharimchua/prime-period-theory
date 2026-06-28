import { BasePPTComponent } from './BasePPTComponent.js';
import { WithHidden } from './features/WithHidden.js';
import { WithListen } from './features/WithListen.js';

export class PeriodSequencerComponent extends WithListen(WithHidden(BasePPTComponent)) {
  private _tempo = 120;
  private _isPlaying = false;
  private _intervalId: number | null = null;
  private _currentSiblingIndex = 0;

  static override get componentDef() {
    return {
      displayName: 'Sequencer',
      familyColor: '#e74c3c',
      acceptsChildren: [],
      canNestIn: ['ppt-period']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'tempo', 'is-playing'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      tempo: { type: 'number', default: 120, description: 'Playback tempo in BPM.' },
      'is-playing': { type: 'boolean', default: false, description: 'Toggle to start/stop playback.' }
    };
  }

  get tempo() {
    return this._tempo;
  }

  set tempo(value: number) {
    this.setAttribute('tempo', value.toString());
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(value: boolean) {
    if (value) {
      this.setAttribute('is-playing', 'true');
    } else {
      this.removeAttribute('is-playing');
    }
  }

  override attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    if (name === 'tempo') {
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed) && parsed > 0) {
        this._tempo = parsed;
        if (this._isPlaying) {
          this.stop();
          this.start();
        }
      }
    } else if (name === 'is-playing') {
      const playing = newValue !== null && newValue !== 'false';
      if (playing !== this._isPlaying) {
        this._isPlaying = playing;
        if (playing) {
          this.start();
        } else {
          this.stop();
        }
      }
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    const tempoAttr = this.getAttribute('tempo');
    if (tempoAttr) {
      const parsed = parseFloat(tempoAttr);
      if (!isNaN(parsed) && parsed > 0) this._tempo = parsed;
    }
    this._isPlaying = this.getAttribute('is-playing') !== null && this.getAttribute('is-playing') !== 'false';
    
    this.render();
    if (this._isPlaying) {
      this.start();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  private start() {
    this.stop();
    const intervalMs = 60000 / this._tempo;
    this._currentSiblingIndex = 0;
    
    this._intervalId = window.setInterval(() => {
      this.playNextSibling();
    }, intervalMs);
  }

  private stop() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private playNextSibling() {
    const parent = this.parentElement;
    if (!parent) return;

    // Filter siblings to only those that can play sound (have playSound method)
    const siblings = Array.from(parent.children).filter(child => 
      child !== this && typeof (child as any).playSound === 'function'
    );

    if (siblings.length === 0) return;

    if (this._currentSiblingIndex >= siblings.length) {
      this._currentSiblingIndex = 0;
    }

    const currentSibling = siblings[this._currentSiblingIndex] as any;
    
    // Play sound and temporarily highlight
    currentSibling.playSound(currentSibling.pitch || 'C4');
    if (typeof currentSibling.highlight === 'function') {
      currentSibling.highlight();
      setTimeout(() => currentSibling.unhighlight(), 200);
    }

    this._currentSiblingIndex++;
  }

  onStateMessage(id: string, value: any) {
    if (id === 'metronome-play' && typeof value === 'boolean') {
      this.isPlaying = value;
    } else if (id === 'metronome-tempo' && typeof value === 'number') {
      this.tempo = value;
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        :host {
          display: none;
        }
        :host([designer-mode="true"]) {
          display: inline-flex;
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: sans-serif;
          font-size: 10px;
        }
      </style>
      <div class="sequencer-badge">Seq: ${this._tempo} BPM</div>
    `;
  }
}

customElements.define('ppt-period-sequencer', PeriodSequencerComponent);
