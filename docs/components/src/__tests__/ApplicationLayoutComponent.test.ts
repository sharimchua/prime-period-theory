import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  let element: any;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    document.body.innerHTML = '';
    element = document.createElement('ppt-application');
    document.body.appendChild(element);
    // Wait a tick for connectedCallback render
    await new Promise(r => setTimeout(r, 0));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render the component with default app-title', () => {
    const titleEl = element.shadowRoot?.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('PPT Application');
  });

  it('should reflect app-title attribute changes', async () => {
    element.setAttribute('app-title', 'New Title');
    const titleEl = element.shadowRoot?.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('New Title');
  });

  it('should toggle theme and update localStorage and DOM', () => {
    const themeBtn = element.shadowRoot?.querySelector('#theme-toggle');
    const container = element.shadowRoot?.querySelector('.ppt-app-container');

    // Initial state
    expect(container?.classList.contains('dark')).toBe(false);

    // Click to toggle
    themeBtn?.click();
    expect(container?.classList.contains('dark')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'dark');

    // Click to toggle back
    themeBtn?.click();
    expect(container?.classList.contains('dark')).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'light');
  });

  it('should toggle solfege glyphs and update localStorage and ARIA', () => {
    const solfegeBtn = element.shadowRoot?.querySelector('#solfege-glyph-toggle');

    // Initial state
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('false');

    // Click to toggle
    solfegeBtn?.click();
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'true');

    // Click to toggle back
    solfegeBtn?.click();
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'false');
  });

  it('should dispatch custom events on toggles', () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
    const themeBtn = element.shadowRoot?.querySelector('#theme-toggle');
    const solfegeBtn = element.shadowRoot?.querySelector('#solfege-glyph-toggle');

    themeBtn?.click();
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ppt-theme-changed' })
    );

    solfegeBtn?.click();
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ppt-solfege-preference-changed' })
    );
  });
});
