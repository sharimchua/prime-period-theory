import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HarmonicProfilerApp } from '../HarmonicProfilerApp.js';

describe('HarmonicProfilerApp', () => {
  let element: HarmonicProfilerApp;

  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn()
    });
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });

    element = new HarmonicProfilerApp();
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should initialize and render', async () => {
    await new Promise(r => setTimeout(r, 0));
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.innerHTML).toContain('ppt-application');
  });
});
