import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithResizable } from '../WithResizable.js';

describe('WithResizable', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const ResizableElementClass = WithResizable(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-resizable-element')) {
      customElements.define('mock-resizable-element', ResizableElementClass);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize and apply properties when resizable is true', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    instance.setAttribute('resizable', 'true');
    document.body.appendChild(instance);

    expect(instance.resizable).toBe(true);
    expect(instance.style.getPropertyValue('overflow')).toBe('auto');
  });

  it('should call onResizableChanged if defined', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    const msgMock = vi.fn();
    instance.onResizableChanged = msgMock;

    document.body.appendChild(instance);
    instance.resizable = true;

    expect(msgMock).toHaveBeenCalledWith(true);
  });

  it('should listen to start resize event', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    instance.setAttribute('resizable', 'true');
    document.body.appendChild(instance);

    // Mock getBoundingClientRect
    instance.getBoundingClientRect = () => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100
    });

    const event = new MouseEvent('mousedown', {
      clientX: 90, // Within 24px of right
      clientY: 90  // Within 24px of bottom
    });

    instance.dispatchEvent(event);

    // Test that dragging has started by dispatching a mousemove on the document
    const moveEvent = new MouseEvent('mousemove', {
      clientX: 120,
      clientY: 120
    });

    let resizedEventTriggered = false;
    instance.addEventListener('ppt-resized', (e: any) => {
      resizedEventTriggered = true;
      expect(e.detail.width).toBe(130);
      expect(e.detail.height).toBe(130);
    });

    document.dispatchEvent(moveEvent);

    expect(resizedEventTriggered).toBe(true);
    expect(instance.style.width).toBe('130px');
    expect(instance.style.height).toBe('130px');

    const upEvent = new MouseEvent('mouseup');
    document.dispatchEvent(upEvent);
  });
});
