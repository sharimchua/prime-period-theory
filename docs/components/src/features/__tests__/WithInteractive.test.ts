import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithInteractive } from '../WithInteractive.js';

describe('WithInteractive', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const InteractiveElementClass = WithInteractive(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-interactive-element')) {
      customElements.define('mock-interactive-element', InteractiveElementClass);
    }
  });

  it('should initialize to interactive true and apply properties', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    document.body.appendChild(instance);

    expect(instance.interactive).toBe(true);
    expect(instance.style.getPropertyValue('--ppt-interactive-opacity')).toBe('1');
    expect(instance.style.getPropertyValue('pointer-events')).toBe('');

    document.body.removeChild(instance);
  });

  it('should apply styles when interactive is false', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    document.body.appendChild(instance);

    instance.interactive = false;

    expect(instance.interactive).toBe(false);
    expect(instance.getAttribute('interactive')).toBeNull();
    expect(instance.style.getPropertyValue('--ppt-interactive-opacity')).toBe('0.6');
    expect(instance.style.getPropertyValue('pointer-events')).toBe('none');
    expect(instance.style.getPropertyValue('user-select')).toBe('none');

    document.body.removeChild(instance);
  });

  it('should call onInteractiveChanged if defined', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    const msgMock = vi.fn();
    instance.onInteractiveChanged = msgMock;

    document.body.appendChild(instance);

    instance.interactive = false;
    expect(msgMock).toHaveBeenCalledWith(false);

    document.body.removeChild(instance);
  });
});
