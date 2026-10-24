import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../HarmonicProfilerApp';

describe('HarmonicProfilerApp', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Mock ResizeObserver
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should render correctly', () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });
});
