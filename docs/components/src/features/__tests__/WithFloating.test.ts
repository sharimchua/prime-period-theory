import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithFloating } from '../WithFloating.js';

describe('WithFloating', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = '<div class="panel-inner"></div>';
    }
  }

  const FloatingElementClass = WithFloating(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-floating-element')) {
      customElements.define('mock-floating-element', FloatingElementClass);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize and apply styles when floating is true', () => {
    const instance = document.createElement('mock-floating-element') as any;
    instance.setAttribute('floating', 'true');
    document.body.appendChild(instance);

    expect(instance.floating).toBe(true);
    expect(instance.style.getPropertyValue('position')).toBe('absolute');
    expect(instance.style.getPropertyValue('z-index')).toBe('10');
    expect(instance.style.getPropertyValue('transform')).toBe('translate3d(0px, 0px, 0)');
  });

  it('should remove styles when floating is set to false', () => {
    const instance = document.createElement('mock-floating-element') as any;
    document.body.appendChild(instance);

    instance.floating = true;
    instance.floating = false;

    expect(instance.floating).toBe(false);
    expect(instance.style.getPropertyValue('position')).toBe('');
    expect(instance.style.getPropertyValue('z-index')).toBe('');
  });

  it('should call onFloatingChanged if defined', () => {
    const instance = document.createElement('mock-floating-element') as any;
    const msgMock = vi.fn();
    instance.onFloatingChanged = msgMock;

    document.body.appendChild(instance);
    instance.floating = true;

    expect(msgMock).toHaveBeenCalledWith(true);
  });

  it('should dispatch ppt-panel-updated event', () => {
    const instance = document.createElement('mock-floating-element') as any;
    const eventMock = vi.fn();
    instance.addEventListener('ppt-panel-updated', eventMock);

    document.body.appendChild(instance);
    instance.floating = true;

    expect(eventMock).toHaveBeenCalled();
  });

  it('should handle dragging', () => {
    const instance = document.createElement('mock-floating-element') as any;
    instance.setAttribute('floating', 'true');
    document.body.appendChild(instance);

    const panel = instance.shadowRoot.querySelector('.panel-inner');

    const mousedown = new MouseEvent('mousedown', { clientX: 10, clientY: 10 });
    panel.dispatchEvent(mousedown);

    const mousemove = new MouseEvent('mousemove', { clientX: 30, clientY: 40 });
    document.dispatchEvent(mousemove);

    expect(instance.style.getPropertyValue('transform')).toBe('translate3d(20px, 30px, 0)');

    const mouseup = new MouseEvent('mouseup');
    document.dispatchEvent(mouseup);

    // Another drag
    const mousedown2 = new MouseEvent('mousedown', { clientX: 30, clientY: 40 });
    panel.dispatchEvent(mousedown2);

    const mousemove2 = new MouseEvent('mousemove', { clientX: 40, clientY: 40 });
    document.dispatchEvent(mousemove2);
    expect(instance.style.getPropertyValue('transform')).toBe('translate3d(30px, 30px, 0)');
  });

  it('should ignore dragging if target is input or button', () => {
    const instance = document.createElement('mock-floating-element') as any;
    instance.setAttribute('floating', 'true');
    document.body.appendChild(instance);

    const panel = instance.shadowRoot.querySelector('.panel-inner');
    const btn = document.createElement('button');
    panel.appendChild(btn);

    const mousedown = new MouseEvent('mousedown', { clientX: 10, clientY: 10, bubbles: true });
    Object.defineProperty(mousedown, 'target', { value: btn });
    panel.dispatchEvent(mousedown);

    const mousemove = new MouseEvent('mousemove', { clientX: 30, clientY: 40 });
    document.dispatchEvent(mousemove);

    expect(instance.style.getPropertyValue('transform')).toBe('translate3d(0px, 0px, 0)'); // unchanged
  });

  it('should handle touch drag events', () => {
    const instance = document.createElement('mock-floating-element') as any;
    instance.setAttribute('floating', 'true');
    document.body.appendChild(instance);

    const panel = instance.shadowRoot.querySelector('.panel-inner');

    const touchstart = new TouchEvent('touchstart', {
      touches: [{ clientX: 10, clientY: 10 } as Touch]
    });
    panel.dispatchEvent(touchstart);

    const touchmove = new TouchEvent('touchmove', {
      touches: [{ clientX: 30, clientY: 40 } as Touch]
    });
    document.dispatchEvent(touchmove);

    expect(instance.style.getPropertyValue('transform')).toBe('translate3d(20px, 30px, 0)');

    const touchend = new TouchEvent('touchend');
    document.dispatchEvent(touchend);
  });

  it('should reflect attribute changes', () => {
    const instance = document.createElement('mock-floating-element') as any;
    document.body.appendChild(instance);

    instance.attributeChangedCallback('floating', 'false', 'true');
    expect(instance.floating).toBe(true);

    instance.attributeChangedCallback('floating', 'true', 'false');
    expect(instance.floating).toBe(false);
  });

  it('should call base connected/disconnected/attributeChanged', () => {
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

    const CustomFloating = WithFloating(MockBaseWithCallbacks);
    if (!customElements.get('mock-floating-callbacks')) {
      customElements.define('mock-floating-callbacks', CustomFloating);
    }

    const instance = document.createElement('mock-floating-callbacks') as any;
    document.body.appendChild(instance);
    expect(baseConnected).toHaveBeenCalled();

    instance.attributeChangedCallback('floating', 'false', 'true');
    expect(baseAttrChanged).toHaveBeenCalledWith('floating', 'false', 'true');

    document.body.removeChild(instance);
    expect(baseDisconnected).toHaveBeenCalled();
  });
});
