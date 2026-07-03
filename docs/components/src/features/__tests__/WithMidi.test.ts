import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithMidi } from '../WithMidi.js';
import { MidiOrchestrator } from '../MidiOrchestrator.js';

describe('WithMidi', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const MidiElementClass = WithMidi(MockBaseElement);

  let subscribeMock: any;
  let unsubscribeMock: any;

  beforeEach(() => {
    if (!customElements.get('mock-midi-element')) {
      customElements.define('mock-midi-element', MidiElementClass);
    }

    unsubscribeMock = vi.fn();
    subscribeMock = vi.fn().mockReturnValue(unsubscribeMock);

    vi.spyOn(MidiOrchestrator, 'getInstance').mockReturnValue({
      initialize: vi.fn(),
      subscribe: subscribeMock
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should subscribe to MidiOrchestrator on connectedCallback', () => {
    const instance = document.createElement('mock-midi-element') as any;
    document.body.appendChild(instance);

    expect(MidiOrchestrator.getInstance().initialize).toHaveBeenCalled();
    expect(subscribeMock).toHaveBeenCalled();

    document.body.removeChild(instance);
  });

  it('should unsubscribe on disconnectedCallback', () => {
    const instance = document.createElement('mock-midi-element') as any;
    document.body.appendChild(instance);
    document.body.removeChild(instance);

    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should forward midi events to onMidiMessage if defined', () => {
    let cb: any;
    subscribeMock.mockImplementation((callback: any) => { cb = callback; return unsubscribeMock; });

    const instance = document.createElement('mock-midi-element') as any;
    const msgMock = vi.fn();
    instance.onMidiMessage = msgMock;

    document.body.appendChild(instance);

    cb({ note: 60, type: 'noteon', velocity: 100 });

    expect(msgMock).toHaveBeenCalledWith({ note: 60, type: 'noteon', velocity: 100 });

    document.body.removeChild(instance);
  });
});
