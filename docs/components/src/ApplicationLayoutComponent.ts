import { BasePPTComponent } from './BasePPTComponent.js';

// Get the base URL from the environment or default to '/'
const getBaseUrl = () => {
  try {
    // @ts-ignore
    return (import.meta.env?.BASE_URL || '/').replace(/\/$/, '') + '/';
  } catch (e) {
    return '/';
  }
};

export class ApplicationLayoutComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Application Layout',
      familyColor: '#3b82f6',
      acceptsChildren: ['*'],
      canNestIn: []
    };
  }
  
  static override get observedAttributes() {
    return [...super.observedAttributes, 'app-title'];
  }

  static override get pptMetadata() {
    return {
      ...super.pptMetadata,
      'app-title': { type: 'string', default: 'PPT Application', description: 'The title of the application to display in the header.' }
    };
  }

  private _isRendered = false;
  private _showGlyphs = false;
  private _isDark = false;

  override connectedCallback() {
    super.connectedCallback();
    
    this._showGlyphs = localStorage.getItem('ppt-show-solfege-glyphs') === 'true';
    this._isDark = localStorage.getItem('ppt-theme') === 'dark';

    if (!this._isRendered) {
      this.render();
      this._isRendered = true;
    }
    
    this.bindEvents();
    this.dispatchThemeEvent();
    this.dispatchSolfegeEvent();
  }

  override attributeChangedCallback(name: string, _oldValue: string, _newValue: string) {
    super.attributeChangedCallback(name, _oldValue, _newValue);
    if (name === 'app-title' && this._isRendered) {
      const titleEl = this.shadowRoot?.querySelector('.app-title');
      if (titleEl) titleEl.textContent = _newValue || 'PPT Application';
    }
  }

  private bindEvents() {
    const solfegeToggleBtn = this.shadowRoot?.querySelector('#solfege-glyph-toggle');
    const themeToggleBtn = this.shadowRoot?.querySelector('#theme-toggle');

    solfegeToggleBtn?.addEventListener('click', () => {
      this._showGlyphs = !this._showGlyphs;
      localStorage.setItem('ppt-show-solfege-glyphs', this._showGlyphs ? 'true' : 'false');
      
      solfegeToggleBtn.setAttribute('aria-pressed', this._showGlyphs ? 'true' : 'false');
      this.dispatchSolfegeEvent();
    });

    themeToggleBtn?.addEventListener('click', () => {
      this._isDark = !this._isDark;
      localStorage.setItem('ppt-theme', this._isDark ? 'dark' : 'light');
      
      this.updateThemeDOM();
      this.dispatchThemeEvent();
    });
  }

  private updateThemeDOM() {
    const container = this.shadowRoot?.querySelector('.ppt-app-container');
    if (this._isDark) {
      container?.classList.add('dark');
    } else {
      container?.classList.remove('dark');
    }
  }

  private dispatchSolfegeEvent() {
    const ev = new CustomEvent('ppt-solfege-preference-changed', {
      detail: { showGlyphs: this._showGlyphs },
      bubbles: true,
      composed: true
    });
    window.dispatchEvent(ev);
  }

  private dispatchThemeEvent() {
    const ev = new CustomEvent('ppt-theme-changed', {
      detail: { isDark: this._isDark },
      bubbles: true,
      composed: true
    });
    window.dispatchEvent(ev);
  }

  private render() {
    const title = this.getAttribute('app-title') || 'PPT Application';
    const base = getBaseUrl();

    this.shadowRoot!.innerHTML = `
      <style>
        ${this.getBaseStyles()}
        
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .ppt-app-container {
          /* Light Theme Variables */
          --brand-primary: #e13610;
          --brand-secondary: #e17013;
          --brand-accent: #e20415;
          --bg-color: #fcfaf9;
          --text-color: #1c1917;
          --link-color: var(--brand-primary);
          --border-color: #e7e5e4;
          --panel-bg: #ffffff;
          --header-bg: #ffffff;
          --button-bg: #f3f4f6;
          --button-hover: #e5e7eb;

          --prime-2: #6b7280;
          --prime-3: #3b82f6;
          --prime-5: #22c55e;
          --prime-7: #f59e0b;
          --prime-11: #a855f7;
          --axis: #ec4899;

          /* Uniform Solfege Palette */
          --solfege-do: #e13610;
          --solfege-re: #f98016;
          --solfege-mi: #f5d432;
          --solfege-fa: #43a440;
          --solfege-fi: #141414;
          --solfege-so: #0032a4;
          --solfege-la: #5300a4;
          --solfege-ti: #f158a4;

          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background-color: var(--bg-color);
          color: var(--text-color);
          transition: background-color 0.3s, color 0.3s;
        }

        .ppt-app-container.dark {
          /* Dark Theme Variables */
          --bg-color: #0f172a;
          --text-color: #f8fafc;
          --border-color: #334155;
          --panel-bg: #1e293b;
          --header-bg: #0f172a;
          --button-bg: #334155;
          --button-hover: #475569;
          
          /* Solfege Palette (Lighter/pastel for dark mode contrast) */
          --solfege-do: #f87171;
          --solfege-re: #fb923c;
          --solfege-mi: #fde047;
          --solfege-fa: #4ade80;
          --solfege-fi: #f8fafc;
          --solfege-so: #60a5fa;
          --solfege-la: #c084fc;
          --solfege-ti: #f472b6;

          /* Prime Families (Lighter for dark mode contrast) */
          --prime-2: #94a3b8;
          --prime-3: #60a5fa;
          --prime-5: #4ade80;
          --prime-7: #fbbf24;
          --prime-11: #c084fc;
          --axis: #f472b6;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: var(--header-bg);
          border-bottom: 3px solid var(--brand-secondary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          flex-shrink: 0;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          height: 32px;
          width: auto;
          display: block;
        }

        .site-title {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--text-color);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .app-title {
          font-weight: 600;
          color: var(--brand-primary);
        }

        .divider {
          color: var(--border-color);
          margin: 0 0.5rem;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        button.icon-btn {
          background: var(--button-bg);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        button.icon-btn:hover {
          background: var(--button-hover);
        }

        #solfege-glyph-toggle {
          position: relative;
          width: 40px;
          height: 32px;
        }

        .glyph-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        #solfege-glyph-toggle[aria-pressed="false"] .glyph-do { display: none; }
        #solfege-glyph-toggle[aria-pressed="false"] .glyph-fi { display: block; }
        
        #solfege-glyph-toggle[aria-pressed="true"] .glyph-do { display: block; }
        #solfege-glyph-toggle[aria-pressed="true"] .glyph-fi { display: none; }

        .main-content {
          flex: 1;
          overflow: auto;
          position: relative;
        }

      </style>

      <div class="ppt-app-container ${this._isDark ? 'dark' : ''}">
        <header>
          <div class="logo-container">
            <a href="${base}" title="Back to Prime Period Theory">
              <img src="${base}logo.svg" alt="Prime Period Theory" class="logo" />
            </a>
            <span class="divider">/</span>
            <span class="app-title">${title}</span>
          </div>
          
          <div class="controls">
            <slot name="header-controls"></slot>
            <button id="theme-toggle" class="icon-btn" title="Toggle Light/Dark Mode">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>

            <button id="solfege-glyph-toggle" class="icon-btn" aria-pressed="${this._showGlyphs ? 'true' : 'false'}" title="Toggle Uniform Solfège notation (Fi: text, Do: glyphs)">
              <div class="glyph-wrapper">
                <ppt-uniform-solfege class="toggle-glyph glyph-fi" solfege="Fi" size="1.2em" aria-hidden="true"></ppt-uniform-solfege>
                <ppt-uniform-solfege class="toggle-glyph glyph-do" solfege="Do" size="1.2em" aria-hidden="true" color="var(--solfege-do)"></ppt-uniform-solfege>
              </div>
            </button>
          </div>
        </header>

        <main class="main-content">
          <slot></slot>
        </main>
      </div>
    `;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ppt-application')) {
  customElements.define('ppt-application', ApplicationLayoutComponent);
}
