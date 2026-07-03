import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventBindingComponent } from '../EventBindingComponent.js';
import { EventBus } from '../features/EventBus.js';

describe('EventBindingComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
    vi.spyOn(EventBus, 'subscribe').mockImplementation(() => {});
    vi.spyOn(EventBus, 'unsubscribe').mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should define component properties', () => {
    expect(EventBindingComponent.componentDef.displayName).toBe('Event Binding');
    expect(EventBindingComponent.pptMetadata['listen-id']).toBeDefined();
    expect(EventBindingComponent.pptMetadata['target-attr']).toBeDefined();
  });

  it('should manage subscriptions on connect, disconnect, and attribute change', () => {
    const instance = document.createElement('ppt-event-binding') as any;

    // Connected
    instance.setAttribute('listen-id', 'test-event');
    document.body.appendChild(instance);

    expect(EventBus.subscribe).toHaveBeenCalledWith('test-event', expect.any(Function));

    // Attribute Change
    instance.setAttribute('listen-id', 'test-event-2');
    expect(EventBus.unsubscribe).toHaveBeenCalledWith('test-event', expect.any(Function));
    expect(EventBus.subscribe).toHaveBeenCalledWith('test-event-2', expect.any(Function));

    // Disconnect
    document.body.removeChild(instance);
    expect(EventBus.unsubscribe).toHaveBeenCalledWith('test-event-2', expect.any(Function));
  });

  it('should update parent attribute on event message', () => {
    let subscribeCb: any;
    vi.mocked(EventBus.subscribe).mockImplementation((id, cb) => { subscribeCb = cb; });

    const parent = document.createElement('div');
    const instance = document.createElement('ppt-event-binding') as any;
    parent.appendChild(instance);
    document.body.appendChild(parent);

    instance.setAttribute('listen-id', 'test-event');
    instance.setAttribute('target-attr', 'data-value');

    subscribeCb('new-value');

    expect(parent.getAttribute('data-value')).toBe('new-value');
  });

  it('should map boolean values to strings if value-true and value-false are provided', () => {
    let subscribeCb: any;
    vi.mocked(EventBus.subscribe).mockImplementation((id, cb) => { subscribeCb = cb; });

    const parent = document.createElement('div');
    const instance = document.createElement('ppt-event-binding') as any;
    parent.appendChild(instance);
    document.body.appendChild(parent);

    instance.setAttribute('listen-id', 'test-event');
    instance.setAttribute('target-attr', 'data-value');
    instance.setAttribute('value-true', 'mapped-true');
    instance.setAttribute('value-false', 'mapped-false');

    subscribeCb(true);
    expect(parent.getAttribute('data-value')).toBe('mapped-true');

    subscribeCb(false);
    expect(parent.getAttribute('data-value')).toBe('mapped-false');
  });
});
