import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithListen } from '../WithListen.js';
import { EventBus } from '../EventBus.js';

describe('WithListen', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const ListenElementClass = WithListen(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-listen-element')) {
      customElements.define('mock-listen-element', ListenElementClass);
    }
    vi.spyOn(EventBus, 'subscribe').mockImplementation(() => {});
    vi.spyOn(EventBus, 'unsubscribe').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should register subscriptions on listen-id change', () => {
    const instance = document.createElement('mock-listen-element') as any;

    // connectedCallback is called when appended
    document.body.appendChild(instance);

    instance.listenId = 'test-id';

    // The browser automatically calls attributeChangedCallback when setAttribute is used (which the setter does)
    // Wait for the microtask queue to process
    expect(EventBus.subscribe).toHaveBeenCalledWith('test-id', expect.any(Function));

    document.body.removeChild(instance);
  });

  it('should register multiple subscriptions on comma-separated listen-id', () => {
    const instance = document.createElement('mock-listen-element') as any;
    document.body.appendChild(instance);

    instance.listenId = 'test-id1, test-id2';

    expect(EventBus.subscribe).toHaveBeenCalledWith('test-id1', expect.any(Function));
    expect(EventBus.subscribe).toHaveBeenCalledWith('test-id2', expect.any(Function));

    document.body.removeChild(instance);
  });

  it('should unsubscribe on disconnectedCallback', () => {
    const instance = document.createElement('mock-listen-element') as any;
    document.body.appendChild(instance);
    instance.listenId = 'test-id';

    document.body.removeChild(instance);

    expect(EventBus.unsubscribe).toHaveBeenCalledWith('test-id', expect.any(Function));
  });

  it('should call onStateMessage when event is fired', () => {
    let subscribeCb: any;
    vi.mocked(EventBus.subscribe).mockImplementation((id, cb) => { subscribeCb = cb; });

    const instance = document.createElement('mock-listen-element') as any;
    const msgMock = vi.fn();
    instance.onStateMessage = msgMock;

    document.body.appendChild(instance);
    instance.listenId = 'test-id';

    // Simulate event
    subscribeCb('test-value');

    expect(msgMock).toHaveBeenCalledWith('test-id', 'test-value');
    document.body.removeChild(instance);
  });
});
