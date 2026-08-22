import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should render default title', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const titleEl = el.shadowRoot?.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('PPT Application');
  });

  it('should render custom title attribute', async () => {
    const el = document.createElement('ppt-application');
    el.setAttribute('app-title', 'My Custom App');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const titleEl = el.shadowRoot?.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('My Custom App');
  });

  it('should update title on attribute change', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    el.setAttribute('app-title', 'New Title');
    const titleEl = el.shadowRoot?.querySelector('.app-title');
    expect(titleEl?.textContent).toBe('New Title');
  });

  it('should toggle theme and dispatch event', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const eventSpy = vi.fn();
    window.addEventListener('ppt-theme-changed', eventSpy);

    const btn = el.shadowRoot?.querySelector('#theme-toggle') as HTMLButtonElement;
    btn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-theme', 'dark');
    expect(eventSpy).toHaveBeenCalled();
    const eventArg = eventSpy.mock.calls[0][0] as CustomEvent;
    expect(eventArg.detail.isDark).toBe(true);

    const container = el.shadowRoot?.querySelector('.ppt-app-container');
    expect(container?.classList.contains('dark')).toBe(true);

    window.removeEventListener('ppt-theme-changed', eventSpy);
  });

  it('should toggle solfege glyphs and dispatch event', async () => {
    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const eventSpy = vi.fn();
    window.addEventListener('ppt-solfege-preference-changed', eventSpy);

    const btn = el.shadowRoot?.querySelector('#solfege-glyph-toggle') as HTMLButtonElement;
    btn.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('ppt-show-solfege-glyphs', 'true');
    expect(eventSpy).toHaveBeenCalled();
    const eventArg = eventSpy.mock.calls[0][0] as CustomEvent;
    expect(eventArg.detail.showGlyphs).toBe(true);

    window.removeEventListener('ppt-solfege-preference-changed', eventSpy);
  });

  it('should read from localStorage on connect', async () => {
    vi.mocked(localStorage.getItem).mockImplementation((key) => {
      if (key === 'ppt-theme') return 'dark';
      if (key === 'ppt-show-solfege-glyphs') return 'true';
      return null;
    });

    const el = document.createElement('ppt-application');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    const container = el.shadowRoot?.querySelector('.ppt-app-container');
    expect(container?.classList.contains('dark')).toBe(true);

    const solfegeBtn = el.shadowRoot?.querySelector('#solfege-glyph-toggle');
    expect(solfegeBtn?.getAttribute('aria-pressed')).toBe('true');
  });

  it('should expose metadata', () => {
    const Component = customElements.get('ppt-application') as any;
    expect(Component.componentDef).toBeDefined();
    expect(Component.pptMetadata).toBeDefined();
    expect(Component.observedAttributes.includes('app-title')).toBe(true);
  });
});
