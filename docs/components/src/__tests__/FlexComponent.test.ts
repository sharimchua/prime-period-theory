import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FlexComponent } from '../FlexComponent.js';

describe('FlexComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(FlexComponent.componentDef.displayName).toBe('Flex Layout');
  });

  it('should render and apply styles based on attributes', () => {
    const instance = document.createElement('ppt-flex') as any;
    document.body.appendChild(instance);

    // Default styles
    expect(instance.style.display).toBe('flex');
    expect(instance.style.flexDirection).toBe('row');

    // Update attributes
    instance.setAttribute('direction', 'column');
    instance.setAttribute('justify', 'center');
    instance.setAttribute('align', 'center');
    instance.setAttribute('wrap', 'wrap');
    instance.setAttribute('gap', '10px');
    instance.setAttribute('flex', '1 1 auto');
    instance.setAttribute('padding', '20px');
    instance.setAttribute('width', '100%');
    instance.setAttribute('height', '100%');
    instance.setAttribute('min-height', '200px');

    expect(instance.style.flexDirection).toBe('column');
    expect(instance.style.justifyContent).toBe('center');
    expect(instance.style.alignItems).toBe('center');
    expect(instance.style.flexWrap).toBe('wrap');
    expect(instance.style.gap).toBe('10px');
    expect(instance.style.flex).toBe('1 1 auto');
    expect(instance.style.padding).toBe('20px');
    expect(instance.style.width).toBe('100%');
    expect(instance.style.height).toBe('100%');
    expect(instance.style.minHeight).toBe('200px');

    // Remove attribute
    instance.removeAttribute('min-height');
    expect(instance.style.minHeight).toBe('');
  });
});
