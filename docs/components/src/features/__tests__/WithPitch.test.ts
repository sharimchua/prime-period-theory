import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WithPitch } from '../WithPitch.js';

describe('WithPitch', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const PitchElementClass = WithPitch(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-pitch-element')) {
      customElements.define('mock-pitch-element', PitchElementClass);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize with default pitch C4', () => {
    const instance = document.createElement('mock-pitch-element') as any;
    document.body.appendChild(instance);

    expect(instance.pitch).toBe('C4');
  });

  it('should update pitch via property and attribute', () => {
    const instance = document.createElement('mock-pitch-element') as any;
    document.body.appendChild(instance);

    instance.pitch = 'A4';
    expect(instance.pitch).toBe('A4');
    expect(instance.getAttribute('pitch')).toBe('A4');

    instance.setAttribute('pitch', 'G3');
    expect(instance.pitch).toBe('G3');
  });

  it('should read pitch from attribute on connect', () => {
    const instance = document.createElement('mock-pitch-element') as any;
    instance.setAttribute('pitch', 'F#4');
    document.body.appendChild(instance);

    expect(instance.pitch).toBe('F#4');
  });
});
