import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../TextComponent.js';

describe('TextComponent', () => {
  let element: any;

  beforeEach(() => {
    // Create a new instance before each test
    element = document.createElement('ppt-text');
    document.body.appendChild(element);
  });

  afterEach(() => {
    // Clean up
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });

  it('should render a shadow DOM with a slot', () => {
    expect(element.shadowRoot).not.toBeNull();
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).not.toBeNull();
  });

  it('should have default component definition properties', () => {
    expect(element.constructor.componentDef.displayName).toBe('Text (Inline Proxy)');
    expect(element.constructor.componentDef.familyColor).toBe('#888888');
    expect(element.constructor.componentDef.acceptsChildren).toContain('*');
    expect(element.constructor.componentDef.canNestIn).toContain('*');
  });

  it('should have expected observed attributes', () => {
    const observed = element.constructor.observedAttributes;
    expect(observed).toContain('color');
    expect(observed).toContain('size');
    expect(observed).toContain('weight');
    expect(observed).toContain('text');
  });

  it('should have expected pptMetadata properties', () => {
    const meta = element.constructor.pptMetadata;
    expect(meta.text.default).toBe('Text');
    expect(meta.color.default).toBe('#333333');
    expect(meta.size.default).toBe('1em');
    expect(meta.weight.default).toBe('normal');
  });

  it('should update style when color attribute changes', () => {
    element.setAttribute('color', 'red');
    expect(element.style.color).toBe('red');
  });

  it('should update style when size attribute changes', () => {
    element.setAttribute('size', '2em');
    expect(element.style.fontSize).toBe('2em');
  });

  it('should update style when weight attribute changes', () => {
    element.setAttribute('weight', 'bold');
    expect(element.style.fontWeight).toBe('bold');
  });

  it('should update textContent when text attribute changes', () => {
    element.setAttribute('text', 'Hello World');
    expect(element.textContent).toBe('Hello World');
  });
});
