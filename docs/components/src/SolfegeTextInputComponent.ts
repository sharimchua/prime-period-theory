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
      input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: monospace;
      }
      button {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background: #2563eb;
      }
    `;
  }

  private inputEl: HTMLInputElement | null = null;
  private buttonEl: HTMLButtonElement | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>${this.getBaseStyles()}</style>
      <div class="input-container">
        <input type="text" placeholder="Type solfege e.g. Do Re Mi DoxRe" />
        <button>Send</button>
      </div>
    `;

    this.inputEl = this.shadowRoot.querySelector('input');
    this.buttonEl = this.shadowRoot.querySelector('button');

    this.buttonEl?.addEventListener('click', () => this.handleSend());
    this.inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
  }

  private handleSend() {
    if (!this.inputEl) return;
    const text = this.inputEl.value.trim();
    if (!text) return;

    // A simple regex to split tokens by space. Real implementation might need more robust tokenization.
    const tokensStr = text.split(/\s+/);
    const emitId = this.getAttribute('emit-id') || 'glyph-input';

    for (const tokenStr of tokensStr) {
      if (isValidSolfegeToken(tokenStr)) {
        const parsed = parseSolfegeToken(tokenStr);
        EventBus.publish(emitId, {
          type: 'glyph',
          solfege: parsed.solfege,
          diacritic: parsed.diacritic,
          // Handle superscript mapping if necessary, leaving basic for now
          octaveOffset: 0
        });
      }
    }
    
    this.inputEl.value = '';
  }
}

if (!customElements.get('ppt-solfege-text-input')) {
  customElements.define('ppt-solfege-text-input', SolfegeTextInputComponent);
}
