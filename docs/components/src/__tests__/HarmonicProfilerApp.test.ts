import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../HarmonicProfilerApp.js';

describe('HarmonicProfilerApp', () => {
  beforeEach(() => {
    // Basic setup
    vi.stubGlobal('ResizeObserver', class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should define component properties', () => {
    const ProfilerApp = customElements.get('ppt-harmonic-profiler-app') as any;
    expect(ProfilerApp).toBeDefined();

    // Check componentDef
    expect(ProfilerApp.componentDef.displayName).toBe('Prime Harmonic Profiler');
    expect(ProfilerApp.componentDef.familyColor).toBe('#4f46e5');
    expect(ProfilerApp.componentDef.acceptsChildren).toEqual([]);
    expect(ProfilerApp.componentDef.canNestIn).toEqual(['*']);
  });

  it('should render basic layout', async () => {
    const instance = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(instance);

    await Promise.resolve(); // Allow render tick

    expect(instance.shadowRoot).not.toBeNull();

    // Check for some main elements in the app
    const container = instance.shadowRoot.querySelector('.app-container');
    expect(container).not.toBeNull();

    const settingsBtn = instance.shadowRoot.querySelector('#toggle-settings-btn');
    expect(settingsBtn).not.toBeNull();

    const guideBtn = instance.shadowRoot.querySelector('#toggle-guide-btn');
    expect(guideBtn).not.toBeNull();
  });

  it('should initialize chords array to empty', async () => {
    const instance = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(instance);

    await Promise.resolve(); // Allow render tick

    // Test the internal state if accessible or the UI state
    // By default, the chords list is empty so the message should be visible
    const preambles = instance.shadowRoot.querySelectorAll('.preamble-panel');
    expect(preambles.length).toBeGreaterThan(0);

    // Initially compare mode is off
    expect(instance._compareMode).toBe(false);
  });
});
