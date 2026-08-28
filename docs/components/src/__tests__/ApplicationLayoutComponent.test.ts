import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should render with default title', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const titleEl = el.shadowRoot.querySelector('.app-title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toBe('PPT Application');
  });

  it('should respect app-title attribute', async () => {
    const el = document.createElement('ppt-application') as any;
    el.setAttribute('app-title', 'Test App');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const titleEl = el.shadowRoot.querySelector('.app-title');
    expect(titleEl.textContent).toBe('Test App');
  });

  it('should load initial solfege glyph preference from localStorage', async () => {
    localStorage.setItem('ppt-show-solfege-glyphs', 'true');
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const solfegeToggleBtn = el.shadowRoot.querySelector('#solfege-glyph-toggle');
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('should toggle solfege glyphs and update localStorage/aria-pressed', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const solfegeToggleBtn = el.shadowRoot.querySelector('#solfege-glyph-toggle');
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    solfegeToggleBtn.click();

    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('true');
  });

  it('should load initial theme preference from localStorage', async () => {
    localStorage.setItem('ppt-theme', 'dark');
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const container = el.shadowRoot.querySelector('.ppt-app-container');
    expect(container.classList.contains('dark')).toBe(true);
  });

  it('should toggle theme and update localStorage/DOM', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const themeToggleBtn = el.shadowRoot.querySelector('#theme-toggle');
    const container = el.shadowRoot.querySelector('.ppt-app-container');

    expect(container.classList.contains('dark')).toBe(false);

    themeToggleBtn.click();

    expect(container.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('ppt-theme')).toBe('dark');
  });
});
