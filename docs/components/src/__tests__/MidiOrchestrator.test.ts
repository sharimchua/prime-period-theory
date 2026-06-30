import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MidiOrchestrator, MidiNoteEvent } from '../features/MidiOrchestrator';

describe('MidiOrchestrator', () => {
  let instance: MidiOrchestrator;

  beforeEach(() => {
    // Reset singleton instance for test isolation (hacky but works since we can't easily reset private static without ts-ignore)
    // @ts-ignore
    MidiOrchestrator.instance = undefined;
    instance = MidiOrchestrator.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have a static init method defined', () => {
    expect(MidiOrchestrator.init).toBeTypeOf('function');
  });

  it('should return a singleton instance via getInstance', () => {
    const instance1 = MidiOrchestrator.getInstance();
    const instance2 = MidiOrchestrator.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('initialize', () => {
    it('should handle missing WebMidi API gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // navigator.requestMIDIAccess is undefined in happy-dom by default

      await instance.initialize();

      expect(consoleWarnSpy).toHaveBeenCalledWith('WebMidi API not supported in this browser.');
    });

    it('should initialize and attach listeners when WebMidi API is available', async () => {
      const mockInput = {
        onmidimessage: null as any
      };
      const mockMidiAccess = {
        inputs: new Map([['input1', mockInput]]),
        onstatechange: null as any
      };

      // @ts-ignore
      global.navigator.requestMIDIAccess = vi.fn().mockResolvedValue(mockMidiAccess);

      await instance.initialize();

      expect(navigator.requestMIDIAccess).toHaveBeenCalled();
      expect(mockInput.onmidimessage).toBeTypeOf('function');

      // Simulate state change (device connect)
      const stateChangeEvent = {
        port: { type: 'input', state: 'connected', onmidimessage: null }
      };
      mockMidiAccess.onstatechange(stateChangeEvent as any);
      expect(stateChangeEvent.port.onmidimessage).toBeTypeOf('function');

      // Simulate state change (device connect but not input)
      const stateChangeEventOutput = {
        port: { type: 'output', state: 'connected', onmidimessage: null }
      };
      mockMidiAccess.onstatechange(stateChangeEventOutput as any);
      expect(stateChangeEventOutput.port.onmidimessage).toBeNull();

      // Simulate state change (device disconnect)
      const stateChangeEventDisconnect = {
        port: { type: 'input', state: 'disconnected', onmidimessage: null }
      };
      mockMidiAccess.onstatechange(stateChangeEventDisconnect as any);
      expect(stateChangeEventDisconnect.port.onmidimessage).toBeNull();

      // Clean up
      // @ts-ignore
      delete global.navigator.requestMIDIAccess;
    });

    it('should handle requestMIDIAccess failure', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-ignore
      global.navigator.requestMIDIAccess = vi.fn().mockRejectedValue(new Error('Denied'));

      await instance.initialize();

      expect(consoleWarnSpy).toHaveBeenCalledWith('MIDI access denied or failed', expect.any(Error));

      // Clean up
      // @ts-ignore
      delete global.navigator.requestMIDIAccess;
    });

    it('should not initialize twice', async () => {
      // @ts-ignore
      global.navigator.requestMIDIAccess = vi.fn().mockResolvedValue({ inputs: new Map() });

      await instance.initialize();
      const callCount1 = (navigator.requestMIDIAccess as any).mock.calls.length;

      await instance.initialize();
      const callCount2 = (navigator.requestMIDIAccess as any).mock.calls.length;

      expect(callCount1).toBe(1);
      expect(callCount2).toBe(1); // Should not call again

      // Clean up
      // @ts-ignore
      delete global.navigator.requestMIDIAccess;
    });
  });

  describe('MIDI Message Handling and Subscription', () => {
    let mockInput: any;

    beforeEach(async () => {
      mockInput = { onmidimessage: null };
      const mockMidiAccess = {
        inputs: new Map([['input1', mockInput]]),
        onstatechange: null
      };
      // @ts-ignore
      global.navigator.requestMIDIAccess = vi.fn().mockResolvedValue(mockMidiAccess);
      await instance.initialize();
    });

    afterEach(() => {
      // @ts-ignore
      delete global.navigator.requestMIDIAccess;
    });

    it('should notify subscribers on Note On event', () => {
      const callback = vi.fn();
      instance.subscribe(callback);

      // Command 9 (Note On), Channel 0, Note 60 (Middle C), Velocity 100
      const noteOnData = new Uint8Array([0x90, 60, 100]);
      mockInput.onmidimessage({ data: noteOnData } as MIDIMessageEvent);

      expect(callback).toHaveBeenCalledWith({ note: 60, velocity: 100, type: 'noteon' });
    });

    it('should notify subscribers on Note Off event (command 8)', () => {
      const callback = vi.fn();
      instance.subscribe(callback);

      // Command 8 (Note Off), Channel 0, Note 60, Velocity 0
      const noteOffData = new Uint8Array([0x80, 60, 0]);
      mockInput.onmidimessage({ data: noteOffData } as MIDIMessageEvent);

      expect(callback).toHaveBeenCalledWith({ note: 60, velocity: 0, type: 'noteoff' });
    });

    it('should notify subscribers on Note Off event (command 9 with 0 velocity)', () => {
      const callback = vi.fn();
      instance.subscribe(callback);

      // Command 9 (Note On), Channel 0, Note 60, Velocity 0 (Acts as Note Off)
      const noteOffData = new Uint8Array([0x90, 60, 0]);
      mockInput.onmidimessage({ data: noteOffData } as MIDIMessageEvent);

      expect(callback).toHaveBeenCalledWith({ note: 60, velocity: 0, type: 'noteoff' });
    });

    it('should handle midi messages with length <= 2', () => {
      const callback = vi.fn();
      instance.subscribe(callback);

      // Command 9 (Note On), Channel 0, Note 60, missing velocity
      const shortData = new Uint8Array([0x90, 60]);
      mockInput.onmidimessage({ data: shortData } as MIDIMessageEvent);

      // It should default velocity to 0, which triggers noteoff
      expect(callback).toHaveBeenCalledWith({ note: 60, velocity: 0, type: 'noteoff' });
    });

    it('should allow unsubscribing', () => {
      const callback = vi.fn();
      const unsubscribe = instance.subscribe(callback);

      unsubscribe();

      const noteOnData = new Uint8Array([0x90, 60, 100]);
      mockInput.onmidimessage({ data: noteOnData } as MIDIMessageEvent);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty or malformed midi data safely', () => {
       const callback = vi.fn();
       instance.subscribe(callback);

       // No data
       mockInput.onmidimessage({ data: null } as any);

       // Unknown command (Control Change - B0)
       mockInput.onmidimessage({ data: new Uint8Array([0xB0, 1, 127]) } as MIDIMessageEvent);

       expect(callback).not.toHaveBeenCalled();
    });

    it('should handle init static call', () => {
       MidiOrchestrator.init(); // Just shouldn't throw
    });
  });
});
