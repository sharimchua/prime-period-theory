import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ControlIntegerComponent } from '../ControlIntegerComponent.js';

describe('ControlIntegerComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(ControlIntegerComponent.componentDef.displayName).toBe('Integer Control');
    expect(ControlIntegerComponent.pptMetadata.label).toBeDefined();
    expect(ControlIntegerComponent.pptMetadata.value).toBeDefined();
    expect(ControlIntegerComponent.pptMetadata.min).toBeDefined();
    expect(ControlIntegerComponent.pptMetadata.max).toBeDefined();
  });

  it('should render and update label, value, min, max', () => {
    const instance = document.createElement('ppt-control-integer') as any;
    document.body.appendChild(instance);

    const labelEl = instance.shadowRoot.querySelector('.control-label');
    const inputEl = instance.shadowRoot.querySelector('input');

    expect(labelEl.textContent).toBe('Number');
    expect(inputEl.value).toBe('0');
    expect(inputEl.min).toBe('0');
    expect(inputEl.max).toBe('100');

    instance.label = 'New Label';
    expect(labelEl.textContent).toBe('New Label');
    expect(instance.label).toBe('New Label');

    instance.value = 5;
    expect(inputEl.value).toBe('5');
    expect(instance.value).toBe(5);

    instance.min = 2;
    expect(inputEl.min).toBe('2');
    expect(instance.min).toBe(2);

    instance.max = 10;
    expect(inputEl.max).toBe('10');
    expect(instance.max).toBe(10);
  });

  it('should handle input events', () => {
    const instance = document.createElement('ppt-control-integer') as any;
    document.body.appendChild(instance);

    const inputEl = instance.shadowRoot.querySelector('input');

    inputEl.value = '42';
    inputEl.dispatchEvent(new Event('input'));

    expect(instance.value).toBe(42);

    inputEl.value = 'invalid';
    inputEl.dispatchEvent(new Event('change'));
    expect(instance.value).toBe(42);
  });
});
