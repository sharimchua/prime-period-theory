import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../ApplicationLayoutComponent';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render and initialize with default values', () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);

    expect(el.shadowRoot).toBeTruthy();

    // Title
    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('PPT Application');

    // Container should exist
    const container = el.shadowRoot!.querySelector('.ppt-app-container');
    expect(container).toBeTruthy();
  });

  it('should reflect app-title attribute', async () => {
    const el = document.createElement('ppt-application');
    el.setAttribute('app-title', 'My Custom App');
    document.body.appendChild(el);

    const titleEl = el.shadowRoot!.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('My Custom App');

    el.setAttribute('app-title', 'Another Title');
    expect(titleEl?.textContent).toBe('Another Title');
  });

  it('should toggle theme and dispatch event', () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);

    const themeToggleBtn = el.shadowRoot!.querySelector('#theme-toggle') as HTMLButtonElement;
    expect(themeToggleBtn).toBeTruthy();

    const container = el.shadowRoot!.querySelector('.ppt-app-container');
    expect(container?.classList.contains('dark')).toBe(false);

    let eventFired = false;
    let isDark = false;
    window.addEventListener('ppt-theme-changed', ((e: CustomEvent) => {
      eventFired = true;
      isDark = e.detail.isDark;
    }) as EventListener);

    themeToggleBtn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'dark');
    expect(container?.classList.contains('dark')).toBe(true);
    expect(eventFired).toBe(true);
    expect(isDark).toBe(true);

    themeToggleBtn.click();
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'light');
    expect(container?.classList.contains('dark')).toBe(false);
  });

  it('should toggle solfege glyphs and dispatch event', () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);

    const solfegeToggleBtn = el.shadowRoot!.querySelector('#solfege-glyph-toggle') as HTMLButtonElement;
    expect(solfegeToggleBtn).toBeTruthy();
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');

    let eventFired = false;
    let showGlyphs = false;
    window.addEventListener('ppt-solfege-preference-changed', ((e: CustomEvent) => {
      eventFired = true;
      showGlyphs = e.detail.showGlyphs;
    }) as EventListener);

    solfegeToggleBtn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'true');
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
    expect(eventFired).toBe(true);
    expect(showGlyphs).toBe(true);

    solfegeToggleBtn.click();
    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'false');
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('should load preferences from localStorage on init', () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'ppt-theme') return 'dark';
      if (key === 'ppt-show-solfege-glyphs') return 'true';
      return null;
    });

    const el = document.createElement('ppt-application');
    document.body.appendChild(el);

    const container = el.shadowRoot!.querySelector('.ppt-app-container');
    expect(container?.classList.contains('dark')).toBe(true);

    const solfegeToggleBtn = el.shadowRoot!.querySelector('#solfege-glyph-toggle') as HTMLButtonElement;
    expect(solfegeToggleBtn.getAttribute('aria-pressed')).toBe('true');
  });
});
