import { BasePPTComponent } from '../BasePPTComponent.js';
import { EventBus } from '../features/EventBus.js';

export class PlayalongPresetsComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Play-Along Presets',
      familyColor: '#8b5cf6',
      acceptsChildren: [],
      canNestIn: ['ppt-container']
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: block;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
      }
      .presets-title {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: #334155;
      }
      .preset-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      button {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        font-weight: 500;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s;
      }
      button:hover {
        background: #e2e8f0;
      }
      button:active {
        transform: translateY(1px);
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="presets-title">Simplification Ladder</div>
        <div class="preset-buttons">
          <button id="btn-full">Full Track</button>
          <button id="btn-solo-melody">Solo Melody</button>
          <button id="btn-solo-harmony">Solo Harmony</button>
          <button id="btn-solo-rhythm">Rhythm Only</button>
        </div>
      `;

      this.shadowRoot!.getElementById('btn-full')?.addEventListener('click', () => {
        EventBus.publish('mixer-batch-update', { action: 'reset' });
      });
      
      this.shadowRoot!.getElementById('btn-solo-melody')?.addEventListener('click', () => {
        EventBus.publish('mixer-batch-update', { action: 'solo-layer', layer: 'melody' });
      });
      
      this.shadowRoot!.getElementById('btn-solo-harmony')?.addEventListener('click', () => {
        EventBus.publish('mixer-batch-update', { action: 'solo-layer', layer: 'harmony' });
      });
      
      this.shadowRoot!.getElementById('btn-solo-rhythm')?.addEventListener('click', () => {
        EventBus.publish('mixer-batch-update', { action: 'solo-layer', layer: 'rhythm' });
      });
    }
  }
}

if (!customElements.get('ppt-playalong-presets')) {
  customElements.define('ppt-playalong-presets', PlayalongPresetsComponent);
}
