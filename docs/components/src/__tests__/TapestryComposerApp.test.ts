import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TapestryComposerApp } from '../TapestryComposerApp.js';

describe('TapestryComposerApp', () => {
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
    expect(customElements.get('ppt-tapestry-composer-app')).toBe(TapestryComposerApp);
  });

  it('should render standard elements', async () => {
    const el = document.createElement('ppt-tapestry-composer-app') as TapestryComposerApp;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).toBeTruthy();

    // TapestryComposerApp uses a direct div.root approach, not ppt-application.
    const layout = el.shadowRoot!.querySelector('.root');
    expect(layout).toBeTruthy();

    const title = el.shadowRoot!.querySelector('.app-name');
    expect(title).toBeTruthy();
    expect(title!.textContent).toBe('Tapestry Composer');

    document.body.removeChild(el);
  });
});
