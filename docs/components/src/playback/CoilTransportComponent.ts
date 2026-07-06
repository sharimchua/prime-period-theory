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
      button.stop {
        background: #ef4444;
      }
      button.stop:hover {
        background: #b91c1c;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <button id="btn-play">Play</button>
        <button id="btn-stop" class="stop">Stop</button>
      `;

      this.shadowRoot!.getElementById('btn-play')?.addEventListener('click', () => {
        EventBus.publish('coil-play', {});
      });

      this.shadowRoot!.getElementById('btn-stop')?.addEventListener('click', () => {
        EventBus.publish('coil-stop', {});
      });
    }
  }
}

if (!customElements.get('ppt-coil-transport')) {
  customElements.define('ppt-coil-transport', CoilTransportComponent);
}
