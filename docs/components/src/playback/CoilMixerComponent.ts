import { BasePPTComponent } from '../BasePPTComponent.js';
import { EventBus } from '../features/EventBus.js';

export class CoilMixerComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Mixer',
      familyColor: '#64748b',
      acceptsChildren: [],
      canNestIn: ['ppt-container']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'coil-selector'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'coil-selector': { type: 'string', default: 'ppt-coil', description: 'Selector for the target coil to control.' }
    };
  }

  private mutedRows: Set<string> = new Set();
  private soloedRows: Set<string> = new Set();

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: block;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 1rem;
        min-width: 200px;
      }
      .mixer-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: #334155;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
      }
      .layer-group {
        margin-bottom: 1rem;
      }
      .layer-title {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #64748b;
        margin-bottom: 0.5rem;
      }
      .row-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        margin-bottom: 0.5rem;
      }
      .row-label {
        font-size: 0.9rem;
        color: #475569;
        font-weight: 500;
      }
      .btn-group {
        display: flex;
        gap: 0.25rem;
      }
      button {
        border: 1px solid #cbd5e1;
        background: #f1f5f9;
        color: #64748b;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      button:hover {
        background: #e2e8f0;
      }
      button.active.mute {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
      }
      button.active.solo {
        background: #eab308;
        color: white;
        border-color: #eab308;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    // Wait a tick for the coil to render its rows
    setTimeout(() => {
      // Find layers with muted attribute initially
      const selector = this.getAttribute('coil-selector') || 'ppt-coil';
      const coil = document.querySelector(selector);
      if (coil) {
        const layers = Array.from(coil.querySelectorAll('ppt-coil-layer'));
        layers.forEach(layer => {
          if (layer.hasAttribute('muted')) {
            const layerContext = layer.getAttribute('layer') || 'unknown';
            const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
            rows.forEach((_, rowIndex) => {
              this.mutedRows.add(`${layerContext}-${rowIndex}`);
              EventBus.publish('mixer-mute', { layer: layerContext, rowIndex, active: true });
            });
          }
        });
      }
      this.renderMixer();
    }, 0);

    EventBus.subscribe('mixer-batch-update', this.onBatchUpdate.bind(this));
    EventBus.subscribe('coil-layer-added', () => this.renderMixer());
  }

  private onBatchUpdate(payload: any) {
    if (payload.action === 'solo-layer') {
      const targetLayer = payload.layer;
      this.soloedRows.clear();
      this.mutedRows.clear();

      const selector = this.getAttribute('coil-selector') || 'ppt-coil';
      const coil = document.querySelector(selector);
      if (!coil) return;

      const layers = Array.from(coil.querySelectorAll('ppt-coil-layer'));
      layers.forEach(layer => {
        const layerContext = layer.getAttribute('layer') || 'unknown';
        const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
        rows.forEach((_, rowIndex) => {
          const rowKey = `${layerContext}-${rowIndex}`;
          if (layerContext === targetLayer) {
            this.soloedRows.add(rowKey);
            EventBus.publish(`mixer-solo`, { layer: layerContext, rowIndex, active: true });
          } else {
             // Let solo take precedence, no need to explicitly mute if something is soloed.
             // But for UI visual, we could mute them.
             EventBus.publish(`mixer-mute`, { layer: layerContext, rowIndex, active: false });
          }
        });
      });
      this.renderMixer(); // full re-render
    } else if (payload.action === 'reset') {
      this.soloedRows.clear();
      this.mutedRows.clear();
      
      const selector = this.getAttribute('coil-selector') || 'ppt-coil';
      const coil = document.querySelector(selector);
      if (coil) {
        const layers = Array.from(coil.querySelectorAll('ppt-coil-layer'));
        layers.forEach(layer => {
          const layerContext = layer.getAttribute('layer') || 'unknown';
          const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
          rows.forEach((_, rowIndex) => {
            EventBus.publish(`mixer-solo`, { layer: layerContext, rowIndex, active: false });
            EventBus.publish(`mixer-mute`, { layer: layerContext, rowIndex, active: false });
          });
        });
      }
      this.renderMixer();
    }
  }

  private toggleMute(layer: string, rowIndex: number) {
    const key = `${layer}-${rowIndex}`;
    if (this.mutedRows.has(key)) {
      this.mutedRows.delete(key);
      EventBus.publish('mixer-mute', { layer, rowIndex, active: false });
    } else {
      this.mutedRows.add(key);
      // Solo and Mute are mutually exclusive on the same row
      if (this.soloedRows.has(key)) {
        this.soloedRows.delete(key);
        EventBus.publish('mixer-solo', { layer, rowIndex, active: false });
      }
      EventBus.publish('mixer-mute', { layer, rowIndex, active: true });
    }
    this.renderMixer();
  }

  private toggleSolo(layer: string, rowIndex: number) {
    const key = `${layer}-${rowIndex}`;
    if (this.soloedRows.has(key)) {
      this.soloedRows.delete(key);
      EventBus.publish('mixer-solo', { layer, rowIndex, active: false });
    } else {
      this.soloedRows.add(key);
      if (this.mutedRows.has(key)) {
        this.mutedRows.delete(key);
        EventBus.publish('mixer-mute', { layer, rowIndex, active: false });
      }
      EventBus.publish('mixer-solo', { layer, rowIndex, active: true });
    }
    this.renderMixer();
  }

  private renderMixer() {
    const selector = this.getAttribute('coil-selector') || 'ppt-coil';
    const coil = document.querySelector(selector);
    
    let contentHtml = '';
    
    if (!coil) {
      contentHtml = `<p style="color: #94a3b8; font-size: 0.9rem;">No coil found.</p>`;
    } else {
      const layers = Array.from(coil.querySelectorAll('ppt-coil-layer'));
      
      // Render in reverse to match bottom-to-top DOM order visual conceptually, or keep DOM order (top-to-bottom visually)
      layers.forEach((layer) => {
        const layerContext = layer.getAttribute('layer') || 'unknown';
        const layerLabel = layer.getAttribute('label') || layerContext;
        const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
        
        if (rows.length === 0) return;
        
        let rowsHtml = rows.map((r, rowIndex) => {
          const key = `${layerContext}-${rowIndex}`;
          const isMuted = this.mutedRows.has(key);
          const isSoloed = this.soloedRows.has(key);
          
          return `
            <div class="row-controls">
              <span class="row-label">Row ${rowIndex + 1}</span>
              <div class="btn-group">
                <button class="mute ${isMuted ? 'active' : ''}" data-action="mute" data-layer="${layerContext}" data-row="${rowIndex}">M</button>
                <button class="solo ${isSoloed ? 'active' : ''}" data-action="solo" data-layer="${layerContext}" data-row="${rowIndex}">S</button>
              </div>
            </div>
          `;
        }).join('');
        
        contentHtml += `
          <div class="layer-group">
            <div class="layer-title">${layerLabel} Layer</div>
            ${rowsHtml}
          </div>
        `;
      });
    }

    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>${this.getBaseStyles()}</style>
      <div class="mixer-title">Mixer</div>
      ${contentHtml}
    `;

    // Attach listeners
    this.shadowRoot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        const layer = btn.getAttribute('data-layer');
        const rowIndex = parseInt(btn.getAttribute('data-row') || '0', 10);
        
        if (layer) {
          if (action === 'mute') this.toggleMute(layer, rowIndex);
          if (action === 'solo') this.toggleSolo(layer, rowIndex);
        }
      });
    });
  }
}

if (!customElements.get('ppt-coil-mixer')) {
  customElements.define('ppt-coil-mixer', CoilMixerComponent);
}
