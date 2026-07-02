import { describe, it, expect } from 'vitest';
import { WithHidden } from '../WithHidden.js';

describe('WithHidden', () => {
  it('should add isHiddenComponent property that returns true', () => {
    // Create a mock base class that extends HTMLElement but can be instantiated
    class MockBaseElement extends HTMLElement {
      constructor() {
        super();
      }
    }

    // Apply the mixin
    const HiddenElementClass = WithHidden(MockBaseElement);

    // Define the custom element to allow instantiation
    customElements.define('mock-hidden-element', HiddenElementClass);

    // Instantiate the class via document.createElement
    const instance = document.createElement('mock-hidden-element') as any;

    // Verify the property exists and is true
    expect(instance.isHiddenComponent).toBe(true);
  });
});
