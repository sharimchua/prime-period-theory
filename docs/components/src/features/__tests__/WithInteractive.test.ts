import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithInteractive } from '../WithInteractive.js';

describe('WithInteractive', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = '<slot></slot>';
    }
  }

  const InteractiveElementClass = WithInteractive(MockBaseElement);

  class MockChildElement extends HTMLElement {
    interactive: boolean = true;
    constructor() {
      super();
    }
  }

  beforeEach(() => {
    if (!customElements.get('mock-interactive-element')) {
      customElements.define('mock-interactive-element', InteractiveElementClass);
    }
    if (!customElements.get('mock-interactive-child')) {
      customElements.define('mock-interactive-child', MockChildElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should initialize to interactive true and apply properties', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    document.body.appendChild(instance);

    expect(instance.interactive).toBe(true);
    expect(instance.style.getPropertyValue('--ppt-interactive-opacity')).toBe('1');
    expect(instance.style.getPropertyValue('pointer-events')).toBe('');
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
  });

  it('should call onInteractiveChanged if defined', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    const msgMock = vi.fn();
    instance.onInteractiveChanged = msgMock;

    document.body.appendChild(instance);

    instance.interactive = false;
    expect(msgMock).toHaveBeenCalledWith(false);
  });

  it('should propagate interactivity to children', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    const child = document.createElement('mock-interactive-child') as any;
    instance.appendChild(child);
    document.body.appendChild(instance);

    instance.interactive = false;

    expect(child.interactive).toBe(false);

    instance.interactive = true;
    expect(child.interactive).toBe(true);
  });

  it('should propagate interactivity to slotted children', async () => {
    const instance = document.createElement('mock-interactive-element') as any;
    const child = document.createElement('mock-interactive-child') as any;
    instance.appendChild(child);
    document.body.appendChild(instance);

    // Wait for slot to be populated
    await new Promise(resolve => setTimeout(resolve, 0));

    instance.interactive = false;

    expect(child.interactive).toBe(false);
  });

  it('should reflect attribute changes', () => {
    const instance = document.createElement('mock-interactive-element') as any;
    document.body.appendChild(instance);

    instance.setAttribute('interactive', 'false');
    // In Happy DOM, attributeChangedCallback needs manual trigger if not fully supported, but let's test if we can call it
    instance.attributeChangedCallback('interactive', 'true', 'false');
    expect(instance.interactive).toBe(false);

    instance.attributeChangedCallback('interactive', 'false', 'true');
    expect(instance.interactive).toBe(true);
  });

  it('should trigger base connectedCallback and attributeChangedCallback if they exist', () => {
    const baseConnected = vi.fn();
    const baseAttrChanged = vi.fn();

    class MockBaseWithCallbacks extends HTMLElement {
      connectedCallback() {
        baseConnected();
      }
      attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        baseAttrChanged(name, oldVal, newVal);
      }
    }

    const CustomInteractive = WithInteractive(MockBaseWithCallbacks);
    if (!customElements.get('mock-interactive-callbacks')) {
      customElements.define('mock-interactive-callbacks', CustomInteractive);
    }

    const instance = document.createElement('mock-interactive-callbacks') as any;
    document.body.appendChild(instance);

    expect(baseConnected).toHaveBeenCalled();

    instance.attributeChangedCallback('interactive', 'true', 'false');
    expect(baseAttrChanged).toHaveBeenCalledWith('interactive', 'true', 'false');
  });
});
