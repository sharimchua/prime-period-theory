import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';

export class CoilComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Coil',
      familyColor: '#60a5fa',
      acceptsChildren: ['ppt-coil-layer'],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        flex-direction: column-reverse; /* Bottom to top: rhythm, harmony, melody */
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }
    `;
  }

  private activeEditor: HTMLElement | null = null;
  private handleActiveEditorChanged = this.onActiveEditorChanged.bind(this);
  private handleNavUp = this.onNavUp.bind(this);
  private handleNavDown = this.onNavDown.bind(this);
  private handleLayerAdd = this.onLayerAdd.bind(this);
  private handleLayerDelete = this.onLayerDelete.bind(this);

  override connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot?.innerHTML) {
      this.shadowRoot!.innerHTML = `
        <style>${this.getBaseStyles()}</style>
        <div class="coil-container">
          <slot></slot>
        </div>
      `;
    }

    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.subscribe('coil-nav-up', this.handleNavUp);
    EventBus.subscribe('coil-nav-down', this.handleNavDown);
    EventBus.subscribe('coil-layer-add', this.handleLayerAdd);
    EventBus.subscribe('coil-layer-delete', this.handleLayerDelete);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    EventBus.unsubscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.unsubscribe('coil-nav-up', this.handleNavUp);
    EventBus.unsubscribe('coil-nav-down', this.handleNavDown);
    EventBus.unsubscribe('coil-layer-add', this.handleLayerAdd);
    EventBus.unsubscribe('coil-layer-delete', this.handleLayerDelete);
  }

  private onActiveEditorChanged(payload: any) {
    if (payload && payload.editor) {
      this.activeEditor = payload.editor;
    }
  }

  private onNavUp() {
    if (!this.activeEditor) return;
    const editors = Array.from(this.querySelectorAll('ppt-phrase-editor'));
    const idx = editors.indexOf(this.activeEditor as any);
    if (idx > 0) {
      (editors[idx - 1] as HTMLElement).focus();
    }
  }

  private onNavDown() {
    if (!this.activeEditor) return;
    const editors = Array.from(this.querySelectorAll('ppt-phrase-editor'));
    const idx = editors.indexOf(this.activeEditor as any);
    if (idx !== -1 && idx < editors.length - 1) {
      (editors[idx + 1] as HTMLElement).focus();
    }
  }

  private onLayerAdd() {
    if (!this.activeEditor) return;
    const currentRow = this.activeEditor.closest('ppt-coil-row');
    const currentLayer = currentRow?.closest('ppt-coil-layer');
    if (currentLayer) {
      const newRow = document.createElement('ppt-coil-row');
      const newEditor = document.createElement('ppt-phrase-editor');
      newEditor.setAttribute('justify', 'grid');
      newEditor.setAttribute('listen-id', 'coil-glyph-input');
      newRow.appendChild(newEditor);
      currentLayer.appendChild(newRow);
      // Let it render then focus
      setTimeout(() => newEditor.focus(), 50);
    }
  }

  private onLayerDelete() {
    if (!this.activeEditor) return;
    const currentRow = this.activeEditor.closest('ppt-coil-row');
    const currentLayer = currentRow?.closest('ppt-coil-layer');
    if (currentRow && currentLayer) {
      const rows = Array.from(currentLayer.querySelectorAll('ppt-coil-row'));
      if (rows.length > 1) {
        // Find which one to focus next
        const idx = rows.indexOf(currentRow as any);
        const nextFocusRow = rows[idx > 0 ? idx - 1 : idx + 1];
        
        currentLayer.removeChild(currentRow);
        
        const nextEditor = nextFocusRow.querySelector('ppt-phrase-editor') as HTMLElement;
        if (nextEditor) nextEditor.focus();
      } else {
        // If it's the last row, just clear the text
        // Instead of directly setting properties, emit an empty phrase to it?
        // Since we know the activeEditor, we can just reset its internal state by dispatching an empty phrase
        EventBus.publish('coil-glyph-input', { type: 'phrase', text: '', tokens: [] });
      }
    }
  }
}

if (!customElements.get('ppt-coil')) {
  customElements.define('ppt-coil', CoilComponent);
}
