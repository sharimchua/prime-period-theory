import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithResizable } from '../WithResizable.js';

describe('WithResizable', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = '<slot></slot>';
    }
  }

  const ResizableElementClass = WithResizable(MockBaseElement);

  class MockChildElement extends HTMLElement {
    resizable: boolean = false;
    constructor() {
      super();
    }
  }

  beforeEach(() => {
    if (!customElements.get('mock-resizable-element')) {
      customElements.define('mock-resizable-element', ResizableElementClass);
    }
    if (!customElements.get('mock-resizable-child')) {
      customElements.define('mock-resizable-child', MockChildElement);
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

  it('should remove resizable style when resizable becomes false', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    document.body.appendChild(instance);

    instance.resizable = true;
    expect(instance.style.getPropertyValue('overflow')).toBe('auto');

    instance.resizable = false;
    expect(instance.style.getPropertyValue('overflow')).toBe('');
  });

  it('should handle touch events for resize', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    instance.setAttribute('resizable', 'true');
    document.body.appendChild(instance);

    instance.getBoundingClientRect = () => ({
      width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100
    });

    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 90, clientY: 90 } as Touch]
    });
    instance.dispatchEvent(touchStart);

    const touchMove = new TouchEvent('touchmove', {
      touches: [{ clientX: 110, clientY: 110 } as Touch]
    });

    let resizedTriggered = false;
    instance.addEventListener('ppt-resized', () => { resizedTriggered = true; });
    document.dispatchEvent(touchMove);

    expect(resizedTriggered).toBe(true);

    const touchEnd = new TouchEvent('touchend');
    document.dispatchEvent(touchEnd);
  });

  it('should ignore mousemove if not resizing', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    instance.setAttribute('resizable', 'true');
    document.body.appendChild(instance);

    let resizedTriggered = false;
    instance.addEventListener('ppt-resized', () => { resizedTriggered = true; });

    const moveEvent = new MouseEvent('mousemove', { clientX: 120, clientY: 120 });
    document.dispatchEvent(moveEvent);
    // Since we never started resizing, it shouldn't do anything
    expect(resizedTriggered).toBe(false);
  });

  it('should ignore mousedown if not in the resize handle area', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    instance.setAttribute('resizable', 'true');
    document.body.appendChild(instance);

    instance.getBoundingClientRect = () => ({
      width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100
    });

    const event = new MouseEvent('mousedown', {
      clientX: 50, // NOT within 24px of right
      clientY: 50  // NOT within 24px of bottom
    });

    instance.dispatchEvent(event);

    const moveEvent = new MouseEvent('mousemove', { clientX: 120, clientY: 120 });
    let resizedTriggered = false;
    instance.addEventListener('ppt-resized', () => { resizedTriggered = true; });
    document.dispatchEvent(moveEvent);
    expect(resizedTriggered).toBe(false);
  });

  it('should not start resize if resizable is false', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    document.body.appendChild(instance); // resizable is false

    instance.getBoundingClientRect = () => ({
      width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100
    });

    const event = new MouseEvent('mousedown', { clientX: 90, clientY: 90 });
    instance.dispatchEvent(event);

    const moveEvent = new MouseEvent('mousemove', { clientX: 120, clientY: 120 });
    let resizedTriggered = false;
    instance.addEventListener('ppt-resized', () => { resizedTriggered = true; });
    document.dispatchEvent(moveEvent);

    expect(resizedTriggered).toBe(false);
  });

  it('should propagate resizable to children', () => {
    const instance = document.createElement('mock-resizable-element') as any;
    const child = document.createElement('mock-resizable-child') as any;
    instance.appendChild(child);
    document.body.appendChild(instance);

    instance.resizable = true;

    expect(child.resizable).toBe(true);

    instance.resizable = false;
    expect(child.resizable).toBe(false);
  });

  it('should propagate resizable to slotted children', async () => {
    const instance = document.createElement('mock-resizable-element') as any;
    const child = document.createElement('mock-resizable-child') as any;
    instance.appendChild(child);
    document.body.appendChild(instance);

    // Wait for slot to be populated
    await new Promise(resolve => setTimeout(resolve, 0));

    instance.resizable = true;
    expect(child.resizable).toBe(true);
  });

  it('should trigger base attributeChangedCallback and connectedCallback/disconnectedCallback', () => {
    const baseConnected = vi.fn();
    const baseDisconnected = vi.fn();
    const baseAttrChanged = vi.fn();

    class MockBaseWithCallbacks extends HTMLElement {
      connectedCallback() { baseConnected(); }
      disconnectedCallback() { baseDisconnected(); }
      attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        baseAttrChanged(name, oldVal, newVal);
      }
    }

    const CustomResizable = WithResizable(MockBaseWithCallbacks);
    if (!customElements.get('mock-resizable-callbacks')) {
      customElements.define('mock-resizable-callbacks', CustomResizable);
    }

    const instance = document.createElement('mock-resizable-callbacks') as any;
    document.body.appendChild(instance);
    expect(baseConnected).toHaveBeenCalled();

    instance.attributeChangedCallback('resizable', 'false', 'true');
    expect(baseAttrChanged).toHaveBeenCalledWith('resizable', 'false', 'true');
    expect(instance.resizable).toBe(true);

    document.body.removeChild(instance);
    expect(baseDisconnected).toHaveBeenCalled();
  });
});
