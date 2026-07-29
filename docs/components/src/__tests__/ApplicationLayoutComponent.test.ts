import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../ApplicationLayoutComponent';
import { getBaseUrl } from '../BasePPTComponent';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render correctly with default attributes', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
    const title = el.shadowRoot.querySelector('.app-title');
    expect(title.textContent).toBe('PPT Application');
  });

  it('should update app-title when attribute changes', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    el.setAttribute('app-title', 'New Title');
    const title = el.shadowRoot.querySelector('.app-title');
    expect(title.textContent).toBe('New Title');
  });

  it('should toggle dark theme', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    let eventFired = false;
    let isDark = false;
    window.addEventListener('ppt-theme-changed', (e: any) => {
        eventFired = true;
        isDark = e.detail.isDark;
    });

    const themeToggleBtn = el.shadowRoot.querySelector('#theme-toggle');
    themeToggleBtn.click();

    expect(eventFired).toBe(true);
    expect(isDark).toBe(true);
    expect(localStorage.getItem('ppt-theme')).toBe('dark');
    expect(el.shadowRoot.querySelector('.ppt-app-container').classList.contains('dark')).toBe(true);

    // Toggle again
    themeToggleBtn.click();
    expect(localStorage.getItem('ppt-theme')).toBe('light');
    expect(el.shadowRoot.querySelector('.ppt-app-container').classList.contains('dark')).toBe(false);
  });

  it('should toggle solfege glyphs', async () => {
    const el = document.createElement('ppt-application') as any;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    let eventFired = false;
    let showGlyphs = false;
    window.addEventListener('ppt-solfege-preference-changed', (e: any) => {
        eventFired = true;
        showGlyphs = e.detail.showGlyphs;
    });

    const solfegeToggleBtn = el.shadowRoot.querySelector('#solfege-glyph-toggle');

    // Default is false
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    solfegeToggleBtn.click();

    expect(eventFired).toBe(true);
    expect(showGlyphs).toBe(true);
    expect(localStorage.getItem('ppt-show-solfege-glyphs')).toBe('true');
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
  });

  it('should apply initial theme from localStorage', async () => {
      localStorage.setItem('ppt-theme', 'dark');
      localStorage.setItem('ppt-show-solfege-glyphs', 'true');

      const el = document.createElement('ppt-application') as any;
      document.body.appendChild(el);
      await new Promise(r => setTimeout(r, 0));

      expect(el.shadowRoot.querySelector('.ppt-app-container').classList.contains('dark')).toBe(true);
      expect(el.shadowRoot.querySelector('#solfege-glyph-toggle').getAttribute('aria-pressed')).toBe('true');
  });
});
