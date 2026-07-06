import { BasePPTComponent } from './BasePPTComponent.js';
import { EventBus } from './features/EventBus.js';
import { parseSolfegeToken, isValidSolfegeToken } from './solfegeUtils.js';

export class SolfegeTextInputComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Solfege Text Input',
      familyColor: '#10b981',
      acceptsChildren: [],
      canNestIn: ['ppt-container', 'ppt-panel']
    };
  }

  static override get observedAttributes() {
    return [...super.observedAttributes, 'emit-id'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'emit-id': { type: 'string', default: 'glyph-input', description: 'EventBus ID to emit parsed tokens' }
    };
  }

  override getBaseStyles() {
    return `
      ${super.getBaseStyles()}
      :host {
        display: block;
        padding: 0.5rem;
      }
      .input-container {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .input-wrapper {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;
      }
      .status-indicator {
        position: absolute;
        left: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #cbd5e1; /* Inactive */
        transition: background-color 0.3s;
      }
      .status-indicator.active {
        background-color: #10b981; /* Active/Bound */
        box-shadow: 0 0 5px #10b981;
      }
      input {
        flex: 1;
        padding: 0.5rem 0.5rem 0.5rem 24px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: monospace;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }
    `;
  }

  private inputEl: HTMLInputElement | null = null;
  private statusEl: HTMLElement | null = null;
  private handleActiveEditorChanged = this.onActiveEditorChanged.bind(this);
  private isBound = false;

  override connectedCallback() {
    super.connectedCallback();
    this.render();
    EventBus.subscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
  }
  
  override disconnectedCallback() {
    super.disconnectedCallback();
    EventBus.unsubscribe('active-phrase-editor-changed', this.handleActiveEditorChanged);
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${this.getBaseStyles()}</style>
      <div class="input-container">
        <div class="input-wrapper">
          <div class="status-indicator"></div>
          <input type="text" placeholder="Select a phrase to edit..." />
        </div>
      </div>
    `;

    this.inputEl = this.shadowRoot.querySelector('input');
    this.statusEl = this.shadowRoot.querySelector('.status-indicator');

    this.inputEl?.addEventListener('input', () => this.handleInput());
  }

  private onActiveEditorChanged(payload: any) {
    if (payload && payload.editor) {
      this.isBound = true;
      if (this.inputEl) {
        this.inputEl.value = payload.rawText || '';
        this.inputEl.focus();
      }
      if (this.statusEl) {
        this.statusEl.classList.add('active');
      }
    } else {
      this.isBound = false;
      if (this.statusEl) {
        this.statusEl.classList.remove('active');
      }
    }
  }

  private handleInput() {
    if (!this.inputEl || !this.isBound) return;
    const text = this.inputEl.value;
    
    const tokensStr = text.split(/\s+/).filter(Boolean);
    const emitId = this.getAttribute('emit-id') || 'glyph-input';
    
    const parsedTokens = [];

    for (const tokenStr of tokensStr) {
      if (isValidSolfegeToken(tokenStr)) {
        const parsed = parseSolfegeToken(tokenStr);
        parsedTokens.push({
          type: 'glyph',
          solfege: parsed.solfege,
          diacritic: parsed.diacritic,
          octaveOffset: 0
        });
      }
    }
    
    EventBus.publish(emitId, {
      type: 'phrase',
      text: text,
      tokens: parsedTokens
    });
  }
}

if (!customElements.get('ppt-solfege-text-input')) {
  customElements.define('ppt-solfege-text-input', SolfegeTextInputComponent);
}
