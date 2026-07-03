import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithEmit } from '../WithEmit.js';
import { EventBus } from '../EventBus.js';

describe('WithEmit', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const EmitElementClass = WithEmit(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-emit-element')) {
      customElements.define('mock-emit-element', EmitElementClass);
    }
    vi.spyOn(EventBus, 'publish').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add bindId property and emitState method', () => {
    const instance = document.createElement('mock-emit-element') as any;
    expect(instance.bindId).toBe('');

    instance.bindId = 'test-id';
    expect(instance.bindId).toBe('test-id');
    expect(instance.getAttribute('bind-id')).toBe('test-id');

    instance.emitState('test-value');
    expect(EventBus.publish).toHaveBeenCalledWith('test-id', 'test-value');
  });

  it('should not emit if bindId is empty', () => {
    const instance = document.createElement('mock-emit-element') as any;
    // ensure bindId is empty
    expect(instance.bindId).toBe('');
    instance.emitState('test-value');
    expect(EventBus.publish).not.toHaveBeenCalled();
  });
});
