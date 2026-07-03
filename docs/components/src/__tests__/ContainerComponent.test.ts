import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContainerComponent } from '../ContainerComponent.js';

describe('ContainerComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(ContainerComponent.componentDef.displayName).toBe('Container');
  });

  it('should render and setup layout', () => {
    const instance = document.createElement('ppt-container') as any;
    document.body.appendChild(instance);

    expect(instance.shadowRoot).not.toBeNull();
    expect(instance.shadowRoot.querySelector('slot')).not.toBeNull();

    // Simulate event
    instance.dispatchEvent(new CustomEvent('ppt-panel-updated'));
  });
});
