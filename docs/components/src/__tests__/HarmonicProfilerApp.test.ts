import { describe, it, expect } from 'vitest';
import { HarmonicProfilerApp } from '../HarmonicProfilerApp';

describe('HarmonicProfilerApp', () => {
  it('should be defined', () => {
    expect(HarmonicProfilerApp).toBeDefined();
  });

  it('should render and attach shadow root', () => {
    const el = document.createElement('ppt-harmonic-profiler-app') as HarmonicProfilerApp;
    document.body.appendChild(el);
    expect(el.shadowRoot).not.toBeNull();
    document.body.removeChild(el);
  });
});
