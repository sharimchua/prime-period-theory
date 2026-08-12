import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../HarmonicProfilerApp';

describe('HarmonicProfilerApp', () => {
  beforeEach(() => {
    //
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should have componentDef', () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as any;
    expect(el.constructor.componentDef).toBeDefined();
    expect(el.constructor.componentDef.displayName).toBe('Prime Harmonic Profiler');
  });

  it('should render successfully', () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as any;
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
  });
});
