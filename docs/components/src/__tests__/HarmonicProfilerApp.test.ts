import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';

describe('HarmonicProfilerApp', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('should render and initialize properly', async () => {
    const el = document.createElement('ppt-harmonic-profiler-app');
    document.body.appendChild(el);
    await new Promise(r => setTimeout(r, 0));

    expect(el.shadowRoot).not.toBeNull();
  });
});
