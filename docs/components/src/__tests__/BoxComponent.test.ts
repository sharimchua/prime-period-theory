import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BoxComponent } from '../BoxComponent.js';

describe('BoxComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(BoxComponent.componentDef.displayName).toBe('Box (Layout Proxy)');
  });

  it('should render correctly', () => {
    const instance = document.createElement('ppt-box') as any;
    document.body.appendChild(instance);

    expect(instance.shadowRoot).not.toBeNull();
    expect(instance.shadowRoot.querySelector('slot')).not.toBeNull();
  });
});
