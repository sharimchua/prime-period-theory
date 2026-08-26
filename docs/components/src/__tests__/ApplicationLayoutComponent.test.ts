import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../ApplicationLayoutComponent';

describe('ApplicationLayoutComponent', () => {
  let element: any;

  beforeEach(async () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    element = document.createElement('ppt-application');
    document.body.appendChild(element);
    await new Promise(r => setTimeout(r, 0));
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render and display default title', () => {
    expect(element.shadowRoot).not.toBeNull();
    const title = element.shadowRoot?.querySelector('.app-title');
    expect(title?.textContent).toBe('PPT Application');
  });

  it('should update title when attribute changes', async () => {
    element.setAttribute('app-title', 'New Title');
    await new Promise(r => setTimeout(r, 0));
    const title = element.shadowRoot?.querySelector('.app-title');
    expect(title?.textContent).toBe('New Title');
  });

  it('should toggle theme on button click', async () => {
    const themeBtn = element.shadowRoot?.querySelector('#theme-toggle');
    expect(themeBtn).not.toBeNull();
    themeBtn?.click();
    await new Promise(r => setTimeout(r, 0));

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'dark');
    expect(element.shadowRoot?.querySelector('.ppt-app-container')?.classList.contains('dark')).toBe(true);

    themeBtn?.click();
    await new Promise(r => setTimeout(r, 0));
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'light');
    expect(element.shadowRoot?.querySelector('.ppt-app-container')?.classList.contains('dark')).toBe(false);
  });

  it('should toggle solfege glyphs on button click', async () => {
    const solfegeBtn = element.shadowRoot?.querySelector('#solfege-glyph-toggle');
    expect(solfegeBtn).not.toBeNull();
    solfegeBtn?.click();
    await new Promise(r => setTimeout(r, 0));

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'true');
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('true');

    solfegeBtn?.click();
    await new Promise(r => setTimeout(r, 0));
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'false');
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('false');
  });
});
