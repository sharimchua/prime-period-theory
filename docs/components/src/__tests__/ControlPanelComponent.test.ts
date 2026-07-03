import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ControlPanelComponent } from '../ControlPanelComponent.js';

describe('ControlPanelComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(ControlPanelComponent.componentDef.displayName).toBe('Control Panel');
    expect(ControlPanelComponent.pptMetadata.label).toBeDefined();
  });

  it('should render and update label', () => {
    const instance = document.createElement('ppt-control-panel') as any;
    document.body.appendChild(instance);

    const titleEl = instance.shadowRoot.querySelector('.panel-title');

    expect(titleEl.textContent).toBe('Control Panel');

    instance.label = 'New Label';
    expect(titleEl.textContent).toBe('New Label');
    expect(instance.label).toBe('New Label');

    instance.setAttribute('label', 'Another Label');
    expect(titleEl.textContent).toBe('Another Label');
  });
});
