import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ControlBooleanComponent } from '../ControlBooleanComponent.js';

describe('ControlBooleanComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(ControlBooleanComponent.componentDef.displayName).toBe('Boolean Control');
    expect(ControlBooleanComponent.pptMetadata.label).toBeDefined();
    expect(ControlBooleanComponent.pptMetadata.value).toBeDefined();
  });

  it('should render and update label and value', () => {
    const instance = document.createElement('ppt-control-boolean') as any;
    document.body.appendChild(instance);

    const labelEl = instance.shadowRoot.querySelector('.control-label');
    const inputEl = instance.shadowRoot.querySelector('input');

    expect(labelEl.textContent).toBe('Toggle');
    expect(inputEl.checked).toBe(false);

    instance.label = 'New Label';
    expect(labelEl.textContent).toBe('New Label');
    expect(instance.label).toBe('New Label');

    instance.value = true;
    expect(inputEl.checked).toBe(true);
    expect(instance.value).toBe(true);

    instance.value = false;
    expect(inputEl.checked).toBe(false);
  });

  it('should handle change events from input', () => {
    const instance = document.createElement('ppt-control-boolean') as any;
    document.body.appendChild(instance);

    const inputEl = instance.shadowRoot.querySelector('input');

    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));

    expect(instance.value).toBe(true);
  });
});
