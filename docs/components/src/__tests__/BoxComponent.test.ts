import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BoxComponent } from '../BoxComponent.js';

describe('BoxComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(BoxComponent.componentDef.displayName).toBe('Box (Layout Proxy)');
  });

  it('should render correctly', () => {
    const instance = document.createElement('ppt-box') as any;
    document.body.appendChild(instance);

    expect(instance.shadowRoot).not.toBeNull();
    expect(instance.shadowRoot.querySelector('slot')).not.toBeNull();
  });

  it('should not throw if shadowRoot is somehow null during connectedCallback', () => {
    const instance = document.createElement('ppt-box') as any;

    // Stub attachShadow to simulate environments where shadow DOM attachment fails or is overwritten
    const originalAttachShadow = instance.attachShadow;
    instance.attachShadow = () => {
      // Intentionally not creating shadowRoot or mocking it to test the null check
      return null;
    };

    // We can also try overriding shadowRoot property directly if attachShadow trick doesn't work in happy-dom
    Object.defineProperty(instance, 'shadowRoot', {
      get: () => null,
      configurable: true
    });

    expect(() => {
      // Simulate connectedCallback without a valid shadowRoot
      instance.connectedCallback();
    }).not.toThrow();
  });
});
