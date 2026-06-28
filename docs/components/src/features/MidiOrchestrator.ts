export type MidiNoteEvent = {
  note: number;
  velocity: number;
  type: 'noteon' | 'noteoff';
};

export class MidiOrchestrator {
  private static instance: MidiOrchestrator;
  private midiAccess: MIDIAccess | null = null;
  private listeners: Set<(event: MidiNoteEvent) => void> = new Set();
  private initialized = false;

  private constructor() {}

  static getInstance(): MidiOrchestrator {
    if (!MidiOrchestrator.instance) {
      MidiOrchestrator.instance = new MidiOrchestrator();
    }
    return MidiOrchestrator.instance;
  }

  async initialize() {
    if (this.initialized) return;
    if (navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        this.midiAccess.inputs.forEach((input) => {
          input.onmidimessage = this.handleMidiMessage.bind(this);
        });
        
        this.midiAccess.onstatechange = (event) => {
          if (event.port && event.port.type === 'input') {
            const input = event.port as MIDIInput;
            if (input.state === 'connected') {
               input.onmidimessage = this.handleMidiMessage.bind(this);
            }
          }
        };
        this.initialized = true;
      } catch (err) {
        console.warn('MIDI access denied or failed', err);
      }
    } else {
      console.warn('WebMidi API not supported in this browser.');
    }
  }

  private handleMidiMessage(message: MIDIMessageEvent) {
    const data = message.data;
    if (!data) return;

    const command = data[0] >> 4;
    // const channel = data[0] & 0xf;
    const note = data[1];
    const velocity = (data.length > 2) ? data[2] : 0;

    if (command === 9 && velocity > 0) {
      this.notifyListeners({ note, velocity, type: 'noteon' });
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      this.notifyListeners({ note, velocity: 0, type: 'noteoff' });
    }
  }

  subscribe(callback: (event: MidiNoteEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(event: MidiNoteEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}
