import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';
import { ParsedToken, expandRhythmPhrase } from './solfegeUtils.js';

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
        border-radius: 4px;
        transition: background-color 0.2s, box-shadow 0.2s;
      }
      :host(:hover) {
        background: rgba(0,0,0,0.02);
      }
      :host(.active-editor) {
        background: rgba(16, 185, 129, 0.1);
        box-shadow: inset 0 0 0 1px #10b981;
      }
      @media print {
        :host {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          padding: 0;
        }
        ppt-coil-cursor {
          display: none !important;
        }
      }
    `;
  }

  private _tokens: any[] = [];
  private _rawText: string = '';
  private isActiveEditor = false;
  private beatMap: number[] = [];
  private handleGlyphInput = this.onGlyphInput.bind(this);
  private handleFocus = this.onFocus.bind(this);
  private handleActiveEditorChanged = this.onActiveEditorChanged.bind(this);
  private handleGridBeatMap = this.onGridBeatMap.bind(this);

  public get tokens(): any[] {
    return this._tokens;
  }

  public get rawText(): string {
    return this._rawText;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0; // Make it focusable
    
    this.addEventListener('focus', this.handleFocus);
    this.addEventListener('click', () => this.focus());

    const listenId = this.getAttribute('listen-id') || 'glyph-input';
    EventBus.subscribe(listenId, this.handleGlyphInput);
    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.subscribe('grid-beat-map', this.handleGridBeatMap);

    // Request the latest beat map in case we are mounted late
    EventBus.publish('request-beat-map', {});

    this.render();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this.handleFocus);
    
    const listenId = this.getAttribute('listen-id') || 'glyph-input';
    EventBus.unsubscribe(listenId, this.handleGlyphInput);
    EventBus.unsubscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
    EventBus.unsubscribe('grid-beat-map', this.handleGridBeatMap);
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
    EventBus.publish('active-phrase-editor-changed', {
      editor: this,
      rawText: this.rawText
    });
    
    const layerComponent = this.closest('ppt-coil-layer');
    const layerType = layerComponent?.getAttribute('layer') || 'melody';
    EventBus.publish('layer-focus-changed', { layerType });

    this.render(); // Show active state
  }

  private onActiveEditorChanged(payload: any) {
    if (payload && payload.editor !== this && this.isActiveEditor) {
      this.isActiveEditor = false;
      this.render(); // Hide active state
    }
  }

  private onGridBeatMap(payload: any) {
    if (payload && Array.isArray(payload.beatMap)) {
      this.beatMap = payload.beatMap;
      const rowComponent = this.closest('ppt-coil-row');
      const layerComponent = rowComponent?.closest('ppt-coil-layer');
      const layerContext = layerComponent?.getAttribute('layer') || 'rhythm';
      if (layerContext !== 'rhythm') {
        this.render();
      }
    }
  }

  private onGlyphInput(payload: any) {
    // Only accept input if we are the globally active editor
    if (!this.isActiveEditor) return;

    if (payload && payload.type === 'phrase') {
      this._tokens = payload.tokens || [];
      this._rawText = payload.text || '';
      
      this.render();
      
      const rowComponent = this.closest('ppt-coil-row');
      const layerComponent = rowComponent?.closest('ppt-coil-layer');
      const layerContext = layerComponent?.getAttribute('layer') || 'rhythm';
      // e.g. validate against grammar Core
    }
  }

  private render() {
    if (!this.shadowRoot) return;
    
    let html = `<style>
      ${this.getBaseStyles()}
      .token-container {
        display: flex;
        align-items: baseline;
        gap: 2px;
      }
      .modifier {
        opacity: 0.8;
      }
      .implicit {
        opacity: 0.5;
        filter: grayscale(100%);
      }
      .pad-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #94a3b8;
        margin-left: 0.6em; /* Align to the visual center of a 1.5em glyph */
      }
      .hold-line {
        height: 2px;
        background-color: #cbd5e1;
        width: 100%;
        margin: auto 0;
      }
      :host([justify="grid"]) {
        display: grid;
        grid-template-columns: var(--ppt-grid-template, repeat(auto-fill, minmax(3em, 1fr)));
        gap: 0.25rem;
      }
    </style>`;
    
    if (this.isActiveEditor) {
      this.classList.add('active-editor');
    } else {
      this.classList.remove('active-editor');
    }
    
    const rowComponent = this.closest('ppt-coil-row');
    const layerComponent = rowComponent?.closest('ppt-coil-layer');
    const layerContext = layerComponent?.getAttribute('layer') || 'rhythm';

    let renderTokens = this.tokens;
    if (layerContext === 'rhythm') {
      renderTokens = expandRhythmPhrase(this.tokens);
      // Calculate beat map
      const newBeatMap: number[] = [];
      let c = 0;
      for (const t of renderTokens) {
        if (t.type === 'glyph') {
          if (t.solfege === 'Do' || t.solfege === 'Di') newBeatMap.push(c);
          c++;
        } else if (t.type === 'padding') {
          c += (t.paddingLength || 1);
        } else if (t.type === 'hold') {
          c += 1; // Assuming hold on rhythm layer spans 1
        }
      }
      // Always broadcast so others know the current structure
      EventBus.publish('grid-beat-map', { beatMap: newBeatMap });
      this.beatMap = newBeatMap;
    }
    
    let currentCol = 0;

    for (const token of renderTokens) {
      if (token.type === 'padding') {
        const span = token.paddingLength || 1;
        for (let i = 0; i < span; i++) {
          html += `<div style="grid-column: span 1; display: flex; align-items: center; justify-content: flex-start;"><div class="pad-dot"></div></div>`;
        }
        currentCol += span;
      } else if (token.type === 'hold') {
        let span = 1;
        const nextBeat = this.beatMap.find(b => b > currentCol);
        if (nextBeat) {
          span = nextBeat - currentCol;
        }
        html += `<div style="grid-column: span ${span}; display: flex; align-items: center; justify-content: stretch; padding: 0 4px;"><div class="hold-line"></div></div>`;
        currentCol += span;
      } else if (token.type === 'glyph') {
        const diacriticAttr = token.diacritic ? `diacritic="${token.diacritic}"` : '';
        const implicitCls = token.isImplicit ? 'implicit' : '';
        
        html += `<div class="token-container ${implicitCls}" style="grid-column: span 1;">`;
        html += `<ppt-uniform-solfege solfege="${token.raw || token.solfege}" ${diacriticAttr} size="1.5em"></ppt-uniform-solfege>`;
        
        if (token.modifiers && token.modifiers.length > 0) {
          for (const mod of token.modifiers) {
             const modDiacritic = mod.diacritic ? `diacritic="${mod.diacritic}"` : '';
             html += `<ppt-uniform-solfege class="modifier" solfege="${mod.raw || mod.solfege}" ${modDiacritic} size="0.8em"></ppt-uniform-solfege>`;
          }
        }
        
        html += `</div>`;
        currentCol += 1;
      }
    }

    if (this.tokens.length === 0) {
      html += `<span style="color:#cbd5e1;font-size:0.8em;user-select:none;">Click to edit</span>`;
    }

    this.shadowRoot.innerHTML = html;
  }
}

if (!customElements.get('ppt-phrase-editor')) {
  customElements.define('ppt-phrase-editor', PhraseEditorComponent);
}
