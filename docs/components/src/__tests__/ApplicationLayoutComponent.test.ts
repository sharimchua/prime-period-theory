import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApplicationLayoutComponent } from '../ApplicationLayoutComponent.js';

describe('ApplicationLayoutComponent', () => {
  let element: ApplicationLayoutComponent;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
    vi.stubGlobal('getBaseUrl', () => '/'); // Mock getBaseUrl

    // Check if element is already registered to avoid errors in multiple tests
    if (!customElements.get('ppt-application')) {
      customElements.define('ppt-application', ApplicationLayoutComponent);
    }
    element = document.createElement('ppt-application') as ApplicationLayoutComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should initialize and render correctly', async () => {
    await new Promise(r => setTimeout(r, 0));
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.innerHTML).toContain('ppt-app-container');
  });
});
