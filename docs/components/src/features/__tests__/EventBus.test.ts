import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../EventBus.js';

describe('EventBus', () => {
  it('should subscribe and receive published events', () => {
    const callback = vi.fn();
    EventBus.subscribe('test-event', callback);

    EventBus.publish('test-event', { data: 'test' });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ data: 'test' });

    EventBus.unsubscribe('test-event', callback);
  });

  it('should not receive events after unsubscribing', () => {
    const callback = vi.fn();
    EventBus.subscribe('test-event-2', callback);
    EventBus.unsubscribe('test-event-2', callback);

    EventBus.publish('test-event-2', { data: 'test' });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle publishing to an event with no subscribers', () => {
    expect(() => {
      EventBus.publish('non-existent-event', { data: 'test' });
    }).not.toThrow();
  });

  it('should ignore falsy event ids', () => {
    const callback = vi.fn();
    EventBus.subscribe('', callback);
    EventBus.publish('', { data: 'test' });
    expect(callback).not.toHaveBeenCalled();

    expect(() => {
      EventBus.unsubscribe('', callback);
    }).not.toThrow();
  });

  it('should not throw if a listener throws an error', () => {
    const errorCallback = vi.fn(() => { throw new Error('Test Error'); });
    const successCallback = vi.fn();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    EventBus.subscribe('error-event', errorCallback);
    EventBus.subscribe('error-event', successCallback);

    expect(() => {
      EventBus.publish('error-event', { data: 'test' });
    }).not.toThrow();

    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    EventBus.unsubscribe('error-event', errorCallback);
    EventBus.unsubscribe('error-event', successCallback);
  });
});
