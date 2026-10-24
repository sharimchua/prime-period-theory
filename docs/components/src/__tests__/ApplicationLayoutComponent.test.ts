import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should define component properties', () => {
    const LayoutComponent = customElements.get('ppt-application') as any;
    expect(LayoutComponent).toBeDefined();
    expect(LayoutComponent.componentDef.displayName).toBe('Application Layout');
    expect(LayoutComponent.pptMetadata['app-title'].default).toBe('PPT Application');
  });

  it('should render and set initial title', () => {
    const instance = document.createElement('ppt-application') as any;
    instance.setAttribute('app-title', 'My Test App');
    document.body.appendChild(instance);

    const titleEl = instance.shadowRoot.querySelector('.app-title');
    expect(titleEl).not.toBeNull();
    expect(titleEl.textContent).toBe('My Test App');
  });

  it('should update title on attribute change', () => {
    const instance = document.createElement('ppt-application') as any;
    document.body.appendChild(instance);

    const titleEl = instance.shadowRoot.querySelector('.app-title');
    expect(titleEl.textContent).toBe('PPT Application');

    instance.setAttribute('app-title', 'New Title');
    expect(titleEl.textContent).toBe('New Title');
  });

  it('should toggle theme and update localStorage', () => {
    const instance = document.createElement('ppt-application') as any;
    document.body.appendChild(instance);

    // Test initial state
    const container = instance.shadowRoot.querySelector('.ppt-app-container');
    expect(container.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('ppt-theme')).toBeNull();

    const themeToggleBtn = instance.shadowRoot.querySelector('#theme-toggle');
    expect(themeToggleBtn).not.toBeNull();

    // Toggle to dark mode
    let themeEventDispatched = false;
    let isDarkValue = false;
    window.addEventListener('ppt-theme-changed', (e: any) => {
      themeEventDispatched = true;
      isDarkValue = e.detail.isDark;
    }, { once: true });

    themeToggleBtn.click();

    expect(container.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ppt-theme')).toBe('dark');
    expect(themeEventDispatched).toBe(true);
    expect(isDarkValue).toBe(true);

    // Toggle back to light mode
    themeEventDispatched = false;
    window.addEventListener('ppt-theme-changed', (e: any) => {
      themeEventDispatched = true;
      isDarkValue = e.detail.isDark;
    }, { once: true });

    themeToggleBtn.click();

    expect(container.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('ppt-theme')).toBe('light');
    expect(themeEventDispatched).toBe(true);
    expect(isDarkValue).toBe(false);
  });

  it('should toggle solfege glyphs and update localStorage', () => {
    const instance = document.createElement('ppt-application') as any;
    document.body.appendChild(instance);

    const solfegeToggleBtn = instance.shadowRoot.querySelector('#solfege-glyph-toggle');
    expect(solfegeToggleBtn).not.toBeNull();
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    let solfegeEventDispatched = false;
    let showGlyphsValue = false;
    window.addEventListener('ppt-solfege-preference-changed', (e: any) => {
      solfegeEventDispatched = true;
      showGlyphsValue = e.detail.showGlyphs;
    }, { once: true });

    solfegeToggleBtn.click();

    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('true');
    expect(solfegeEventDispatched).toBe(true);
    expect(showGlyphsValue).toBe(true);

    solfegeEventDispatched = false;
    window.addEventListener('ppt-solfege-preference-changed', (e: any) => {
      solfegeEventDispatched = true;
      showGlyphsValue = e.detail.showGlyphs;
    }, { once: true });

    solfegeToggleBtn.click();

    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('false');
    expect(solfegeEventDispatched).toBe(true);
    expect(showGlyphsValue).toBe(false);
  });
});
