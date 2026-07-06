import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';

export class PhraseEditorComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Phrase Editor',
      familyColor: '#a855f7',
      acceptsChildren: ['ppt-coil-cursor', 'ppt-uniform-solfege'],
      canNestIn: ['ppt-coil-row']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'listen-id'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'listen-id': { type: 'string', default: 'glyph-input', description: 'EventBus ID to listen for new tokens' }
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
        min-height: 2em;
        width: 100%;
        padding: 0 0.5rem;
        cursor: text;
        outline: none;
      }
      :host(:focus) {
        background: rgba(0,0,0,0.02);
        box-shadow: inset 0 0 0 1px #cbd5e1;
      }
    `;
  }

  private tokens: any[] = [];
  private isActiveEditor = false;
  private handleGlyphInput = this.onGlyphInput.bind(this);
  private handleFocus = this.onFocus.bind(this);
  private handleActiveEditorChanged = this.onActiveEditorChanged.bind(this);

  override connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0; // Make it focusable
    
    this.addEventListener('focus', this.handleFocus);
    this.addEventListener('click', () => this.focus());

    const listenId = this.getAttribute('listen-id') || 'glyph-input';
    EventBus.subscribe(listenId, this.handleGlyphInput);
    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);

    this.render();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this.handleFocus);
    
    const listenId = this.getAttribute('listen-id') || 'glyph-input';
    EventBus.unsubscribe(listenId, this.handleGlyphInput);
    EventBus.unsubscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
  }

  override attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === 'listen-id' && oldVal !== newVal) {
      if (oldVal) EventBus.unsubscribe(oldVal, this.handleGlyphInput);
      if (newVal) EventBus.subscribe(newVal, this.handleGlyphInput);
    }
  }

  private onFocus() {
    this.isActiveEditor = true;
    EventBus.publish('active-phrase-editor-changed', this);
    this.render(); // Show cursor
  }

  private onActiveEditorChanged(activeEditor: any) {
    if (activeEditor !== this && this.isActiveEditor) {
      this.isActiveEditor = false;
      this.render(); // Hide cursor
    }
  }

  private onGlyphInput(payload: any) {
    // Only accept input if we are the globally active editor
    if (!this.isActiveEditor) return;

    if (payload && payload.type === 'glyph') {
      this.tokens.push(payload);
      // Let's manually trigger a render and add the new element
      this.render();
      
      // In a real implementation, we would dispatch an event to the grammar interpreter here
      // and highlight invalid sequences if necessary.
      const rowComponent = this.closest('ppt-coil-row');
      const layerComponent = rowComponent?.closest('ppt-coil-layer');
      const layerContext = layerComponent?.getAttribute('layer') || 'rhythm';
      // e.g. validate against grammar Core
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    
    let html = `<style>${this.getBaseStyles()}</style>`;
    
    // Render existing tokens using ppt-uniform-solfege
    for (const token of this.tokens) {
      const diacriticAttr = token.diacritic ? `diacritic="${token.diacritic}"` : '';
      html += `<ppt-uniform-solfege solfege="${token.solfege}" ${diacriticAttr} size="1.5em"></ppt-uniform-solfege>`;
    }

    // Render cursor if active
    if (this.isActiveEditor) {
      html += `<ppt-coil-cursor></ppt-coil-cursor>`;
    } else if (this.tokens.length === 0) {
      html += `<span style="color:#cbd5e1;font-size:0.8em;user-select:none;">Click to edit</span>`;
    }

    this.shadowRoot.innerHTML = html;
  }
}

if (!customElements.get('ppt-phrase-editor')) {
  customElements.define('ppt-phrase-editor', PhraseEditorComponent);
}
