import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApplicationLayoutComponent } from '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should register as a custom element', () => {
    expect(customElements.get('ppt-application')).toBe(ApplicationLayoutComponent);
  });

  it('should render standard elements with default properties', async () => {
    const el = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).toBeTruthy();

    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl!.textContent).toBe('PPT Application');

    const container = el.shadowRoot!.querySelector('.ppt-app-container');
    expect(container).toBeTruthy();

    const themeToggleBtn = el.shadowRoot!.querySelector('#theme-toggle');
    expect(themeToggleBtn).toBeTruthy();

    const solfegeToggleBtn = el.shadowRoot!.querySelector('#solfege-glyph-toggle');
    expect(solfegeToggleBtn).toBeTruthy();

    document.body.removeChild(el);
  });

  it('should update the title when app-title attribute changes', async () => {
    const el = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    el.setAttribute('app-title', 'My Custom Title');

    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl!.textContent).toBe('My Custom Title');

    document.body.removeChild(el);
  });

  it('should handle theme toggle and dispatch event', async () => {
    const el = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const themeToggleBtn = el.shadowRoot!.querySelector('#theme-toggle') as HTMLButtonElement;
    const container = el.shadowRoot!.querySelector('.ppt-app-container') as HTMLElement;

    // Listen for the custom event on window
    const spy = vi.fn();
    window.addEventListener('ppt-theme-changed', spy);

    expect(container.classList.contains('dark')).toBe(false);

    themeToggleBtn.click();

    expect(container.classList.contains('dark')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'dark');
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ isDark: true });

    // Click again to toggle back
    themeToggleBtn.click();
    expect(container.classList.contains('dark')).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'light');
    expect(spy.mock.calls[1][0].detail).toEqual({ isDark: false });

    window.removeEventListener('ppt-theme-changed', spy);
    document.body.removeChild(el);
  });

  it('should handle solfege toggle and dispatch event', async () => {
    const el = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const solfegeToggleBtn = el.shadowRoot!.querySelector('#solfege-glyph-toggle') as HTMLButtonElement;

    // Listen for the custom event on window
    const spy = vi.fn();
    window.addEventListener('ppt-solfege-preference-changed', spy);

    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    solfegeToggleBtn.click();

    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'true');
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].detail).toEqual({ showGlyphs: true });

    // Click again to toggle back
    solfegeToggleBtn.click();
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'false');
    expect(spy.mock.calls[1][0].detail).toEqual({ showGlyphs: false });

    window.removeEventListener('ppt-solfege-preference-changed', spy);
    document.body.removeChild(el);
  });
});
