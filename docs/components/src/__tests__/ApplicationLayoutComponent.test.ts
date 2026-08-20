import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    // Stub localStorage
    const store: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        for (const key in store) {
          delete store[key];
        }
      }
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render and initialize with default title', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('PPT Application');
  });

  it('should reflect app-title attribute', async () => {
    const el = document.createElement('ppt-application');
    el.setAttribute('app-title', 'My Custom App');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('My Custom App');
  });

  it('should toggle theme on button click', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const themeToggleBtn = el.shadowRoot!.querySelector('#theme-toggle') as HTMLButtonElement;
    const container = el.shadowRoot!.querySelector('.ppt-app-container');

    // Default light mode
    expect(container?.classList.contains('dark')).toBe(false);

    // Click to toggle
    themeToggleBtn.click();
    expect(container?.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ppt-theme')).toBe('dark');

    // Click to toggle back
    themeToggleBtn.click();
    expect(container?.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('ppt-theme')).toBe('light');
  });

  it('should toggle solfege glyphs on button click', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const solfegeToggleBtn = el.shadowRoot!.querySelector('#solfege-glyph-toggle') as HTMLButtonElement;

    // Default false
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    // Click to toggle
    solfegeToggleBtn.click();
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('true');

    // Click to toggle back
    solfegeToggleBtn.click();
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('false');
  });
});
