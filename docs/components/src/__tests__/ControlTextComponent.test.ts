import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ControlTextComponent } from '../ControlTextComponent.js';

describe('ControlTextComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(ControlTextComponent.componentDef.displayName).toBe('Text Control');
    expect(ControlTextComponent.pptMetadata.label).toBeDefined();
    expect(ControlTextComponent.pptMetadata.value).toBeDefined();
  });

  it('should render and update label and value', () => {
    const instance = document.createElement('ppt-control-text') as any;
    document.body.appendChild(instance);

    const labelEl = instance.shadowRoot.querySelector('.control-label');
    const inputEl = instance.shadowRoot.querySelector('input');

    expect(labelEl.textContent).toBe('Text');
    expect(inputEl.value).toBe('');

    instance.label = 'New Label';
    expect(labelEl.textContent).toBe('New Label');
    expect(instance.label).toBe('New Label');

    instance.value = 'New Value';
    expect(inputEl.value).toBe('New Value');
    expect(instance.value).toBe('New Value');
  });

  it('should handle input events', () => {
    const instance = document.createElement('ppt-control-text') as any;
    document.body.appendChild(instance);

    const inputEl = instance.shadowRoot.querySelector('input');

    inputEl.value = 'Input Value';
    inputEl.dispatchEvent(new Event('input'));

    expect(instance.value).toBe('Input Value');
  });
});
