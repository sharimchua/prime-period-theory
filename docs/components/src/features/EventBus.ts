type EventCallback = (value: any) => void;

class PPTEventBus {
  private _listeners: Map<string, Set<EventCallback>> = new Map();

  publish(id: string, value: any) {
    if (!id) return;
    const callbacks = this._listeners.get(id);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(value);
        } catch (e) {
          console.error(`PPT EventBus: Error in listener for id '${id}':`, e);
        }
      });
    }
  }

  subscribe(id: string, callback: EventCallback) {
    if (!id) return;
    if (!this._listeners.has(id)) {
      this._listeners.set(id, new Set());
    }
    this._listeners.get(id)!.add(callback);
  }

  unsubscribe(id: string, callback: EventCallback) {
    if (!id) return;
    const callbacks = this._listeners.get(id);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this._listeners.delete(id);
      }
    }
  }
}

export const EventBus = new PPTEventBus();
