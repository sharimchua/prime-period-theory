import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HarmonicProfilerApp } from '../HarmonicProfilerApp.js';

describe('HarmonicProfilerApp', () => {
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
    expect(customElements.get('ppt-harmonic-profiler-app')).toBe(HarmonicProfilerApp);
  });

  it('should render standard elements', async () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as HarmonicProfilerApp;
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).toBeTruthy();

    // Smoke test to make sure something renders.
    // BasePPTComponent renders the inner slot, and HarmonicProfilerApp renders standard things inside it.
    // Check for container
    const container = el.shadowRoot!.querySelector('.app-container');
    expect(container).toBeTruthy();

    document.body.removeChild(el);
  });
});
