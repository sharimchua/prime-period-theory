import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithFloating } from '../WithFloating.js';

describe('WithFloating', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
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
});
