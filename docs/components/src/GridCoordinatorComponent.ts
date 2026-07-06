import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';

export class GridCoordinatorComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Grid Coordinator',
      familyColor: '#94a3b8',
      acceptsChildren: [],
      canNestIn: ['ppt-coil']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'column-width'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'column-width': { type: 'string', default: '3.5em', description: 'Standard width of a grid column' }
    };
  }

  private beatMap: number[] = [];

  override connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none'; // Non-UI component
    this.updateGridVariables();
    
    EventBus.subscribe('grid-beat-map', (payload: any) => {
      if (payload && payload.beatMap) {
        this.beatMap = payload.beatMap;
      }
    });
    
    EventBus.subscribe('request-beat-map', (payload: any) => {
      if (this.beatMap.length > 0) {
        EventBus.publish('grid-beat-map', { beatMap: this.beatMap });
      }
    });
  }

  override attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === 'column-width') {
      this.updateGridVariables();
    }
  }

  private updateGridVariables() {
    const colWidth = this.getAttribute('column-width') || '3.5em';
    // Inject the grid template custom property into the closest coil container
    // so that all descendant phrase editors inherit it.
    const container = this.closest('ppt-coil') || document.body;
    (container as HTMLElement).style.setProperty('--ppt-grid-template', `repeat(auto-fill, minmax(${colWidth}, 1fr))`);
  }
}

if (!customElements.get('ppt-grid-coordinator')) {
  customElements.define('ppt-grid-coordinator', GridCoordinatorComponent);
}
