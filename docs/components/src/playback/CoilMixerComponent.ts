import { BasePPTComponent } from '../BasePPTComponent.js';
import { EventBus } from '../features/EventBus.js';

export class CoilMixerComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil Mixer',
      familyColor: '#64748b',
      acceptsChildren: ['ppt-coil'],
      canNestIn: ['ppt-container']
    };
  }

  private mutedRows: Set<string> = new Set();
  private soloedRows: Set<string> = new Set();
  private observer: MutationObserver | null = null;

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: block;
        width: 100%;
      }
      .mixer-wrapper {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.render();

    // Observe Light DOM for new coil rows
    this.observer = new MutationObserver(() => this.syncHeaders());
    this.observer.observe(this, { childList: true, subtree: true });

    // Initial sync
    setTimeout(() => {
      this.initDefaultMutes();
      this.syncHeaders();
    }, 0);

    EventBus.subscribe('mixer-batch-update', this.onBatchUpdate.bind(this));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.observer) this.observer.disconnect();
  }

  private initDefaultMutes() {
    const layers = Array.from(this.querySelectorAll('ppt-coil-layer'));
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

  private onBatchUpdate(payload: any) {
    if (payload.action === 'solo-layer') {
      const targetLayer = payload.layer;
      this.soloedRows.clear();
      this.mutedRows.clear();

      const layers = Array.from(this.querySelectorAll('ppt-coil-layer'));
      layers.forEach(layer => {
        const layerContext = layer.getAttribute('layer') || 'unknown';
        const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
        rows.forEach((_, rowIndex) => {
          const rowKey = `${layerContext}-${rowIndex}`;
          if (layerContext === targetLayer) {
            this.soloedRows.add(rowKey);
            EventBus.publish(`mixer-solo`, { layer: layerContext, rowIndex, active: true });
          } else {
             EventBus.publish(`mixer-mute`, { layer: layerContext, rowIndex, active: false });
          }
        });
      });
      this.syncHeaders();
    } else if (payload.action === 'reset') {
      this.soloedRows.clear();
      this.mutedRows.clear();
      
      const layers = Array.from(this.querySelectorAll('ppt-coil-layer'));
      layers.forEach(layer => {
        const layerContext = layer.getAttribute('layer') || 'unknown';
        const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
        rows.forEach((_, rowIndex) => {
          EventBus.publish(`mixer-solo`, { layer: layerContext, rowIndex, active: false });
          EventBus.publish(`mixer-mute`, { layer: layerContext, rowIndex, active: false });
        });
      });
      this.syncHeaders();
    }
  }

  private toggleMute(layer: string, rowIndex: number) {
    const key = `${layer}-${rowIndex}`;
    if (this.mutedRows.has(key)) {
      this.mutedRows.delete(key);
      EventBus.publish('mixer-mute', { layer, rowIndex, active: false });
    } else {
      this.mutedRows.add(key);
      if (this.soloedRows.has(key)) {
        this.soloedRows.delete(key);
        EventBus.publish('mixer-solo', { layer, rowIndex, active: false });
      }
      EventBus.publish('mixer-mute', { layer, rowIndex, active: true });
    }
    this.syncHeaders();
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
    this.syncHeaders();
  }

  private syncHeaders() {
    const layers = Array.from(this.querySelectorAll('ppt-coil-layer'));
    layers.forEach((layer) => {
      const layerContext = layer.getAttribute('layer') || 'unknown';
      const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
      
      rows.forEach((row, rowIndex) => {
        const key = `${layerContext}-${rowIndex}`;
        const isMuted = this.mutedRows.has(key);
        const isSoloed = this.soloedRows.has(key);
        
        let header = row.querySelector('.mixer-track-header');
        if (!header) {
          header = document.createElement('div');
          header.slot = 'header';
          header.className = 'mixer-track-header';
          header.innerHTML = `
            <style>
              .mixer-track-header {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0.5rem;
                gap: 0.25rem;
                height: 100%;
                width: 100px;
                box-sizing: border-box;
                font-family: system-ui, sans-serif;
              }
              .mixer-track-header input {
                width: 100%;
                font-size: 0.75rem;
                padding: 0.2rem;
                border: 1px solid transparent;
                background: transparent;
                text-align: center;
                color: #475569;
                font-weight: 600;
                transition: all 0.2s;
              }
              .mixer-track-header input:hover, .mixer-track-header input:focus {
                background: white;
                border-color: #cbd5e1;
                outline: none;
                border-radius: 4px;
              }
              .btn-row {
                display: flex;
                gap: 0.25rem;
              }
              .mixer-track-header button {
                width: 32px;
                height: 24px;
                border: 1px solid #cbd5e1;
                background: #f1f5f9;
                color: #64748b;
                border-radius: 4px;
                font-size: 0.7rem;
                font-weight: bold;
                cursor: pointer;
              }
              .mixer-track-header button:hover {
                background: #e2e8f0;
              }
              .mixer-track-header button.active.mute-btn {
                background: #ef4444;
                color: white;
                border-color: #ef4444;
              }
              .mixer-track-header button.active.solo-btn {
                background: #eab308;
                color: white;
                border-color: #eab308;
              }
            </style>
            <input type="text" value="${layerContext.charAt(0).toUpperCase() + layerContext.slice(1)}" class="track-label" />
            <div class="btn-row">
              <button class="mute-btn">M</button>
              <button class="solo-btn">S</button>
            </div>
          `;
          row.appendChild(header);

          const muteBtn = header.querySelector('.mute-btn') as HTMLButtonElement;
          const soloBtn = header.querySelector('.solo-btn') as HTMLButtonElement;
          
          muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute(layerContext, rowIndex);
          });
          
          soloBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSolo(layerContext, rowIndex);
          });
        }
        
        // Update state classes
        const muteBtn = header.querySelector('.mute-btn') as HTMLButtonElement;
        const soloBtn = header.querySelector('.solo-btn') as HTMLButtonElement;
        
        if (isMuted) muteBtn.classList.add('active'); else muteBtn.classList.remove('active');
        if (isSoloed) soloBtn.classList.add('active'); else soloBtn.classList.remove('active');
      });
    });
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="mixer-wrapper">
          <slot></slot>
        </div>
      `;
    }
  }
}

customElements.define('ppt-coil-mixer', CoilMixerComponent);
