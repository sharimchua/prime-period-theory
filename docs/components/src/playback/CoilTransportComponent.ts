import { BasePPTComponent } from '../BasePPTComponent.js';
import { EventBus } from '../features/EventBus.js';

export class CoilTransportComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Transport',
      familyColor: '#10b981',
      acceptsChildren: [],
      canNestIn: ['ppt-coil', 'ppt-container']
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #2563eb;
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: background-color 0.2s;
      }
      button:hover {
        background: #1d4ed8;
      }
      button.playing {
        background: #ef4444;
      }
      button.playing:hover {
        background: #b91c1c;
      }
      .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: monospace;
        font-size: 0.9rem;
      }
      input[type="number"] {
        width: 60px;
        padding: 0.25rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <button id="btn-play">Play</button>
        <div class="control-group">
          <label for="bpm-input">BPM:</label>
          <input type="number" id="bpm-input" value="120" min="40" max="300" />
          <input type="checkbox" id="loop-input" style="margin-left: 0.5rem;" />
          <label for="loop-input">Loop</label>
        </div>
      `;

      let isPlaying = false;
      const playBtn = this.shadowRoot!.getElementById('btn-play') as HTMLButtonElement;
      
      playBtn.addEventListener('click', () => {
        if (isPlaying) {
          EventBus.publish('coil-stop', {});
          playBtn.textContent = 'Play';
          playBtn.classList.remove('playing');
        } else {
          const bpmInput = this.shadowRoot!.getElementById('bpm-input') as HTMLInputElement;
          const loopInput = this.shadowRoot!.getElementById('loop-input') as HTMLInputElement;
          EventBus.publish('coil-play', { 
            bpm: parseInt(bpmInput.value) || 120,
            loop: loopInput.checked
          });
          playBtn.textContent = 'Stop';
          playBtn.classList.add('playing');
        }
        isPlaying = !isPlaying;
      });
      
      EventBus.subscribe('coil-stop', () => {
        // Handle external stop (e.g. from Tone js if we emit it)
        isPlaying = false;
        playBtn.textContent = 'Play';
        playBtn.classList.remove('playing');
      });
    }
  }
}

if (!customElements.get('ppt-coil-transport')) {
  customElements.define('ppt-coil-transport', CoilTransportComponent);
}
