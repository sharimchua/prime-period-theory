import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../index';
import { EventBus } from '../features/EventBus';

// Mock WebMidi Event
function createMidiEvent(command: number, note: number, velocity: number = 100): WebMidi.MIDIMessageEvent {
  return {
    data: new Uint8Array([command, note, velocity])
  } as unknown as WebMidi.MIDIMessageEvent;
}

const NOTE_ON = 144;
const NOTE_OFF = 128;

describe('MidiInputBridgeComponent', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: undefined,
      configurable: true
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle layer focus change', () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    EventBus.publish('layer-focus-changed', { layerType: 'rhythm' });
    expect(el.currentLayerType).toBe('rhythm');
  });

  it('should disable button if WebMidi not supported', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    const btn = el.shadowRoot.querySelector('#connect-btn');
    btn.click();
    // It should log error to the screen
    await new Promise(r => setTimeout(r, 0));
    expect(el.shadowRoot.innerHTML).toContain('failed');
  });

  it('should store current raw text from active phrase editor', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    const mockEvent = new CustomEvent('active-phrase-editor-changed', {
      detail: { editor: {}, rawText: 'Do Re' }
    });
    el.handleActiveEditorChanged(mockEvent);
    expect(el.currentRawText).toBe('Do Re');

    const mockEventNull = new CustomEvent('active-phrase-editor-changed', {
      detail: { editor: null, rawText: null }
    });
    el.handleActiveEditorChanged(mockEventNull);
    expect(el.currentRawText).toBe('');
  });
});

describe('MidiInputBridgeComponent with MIDI Mock', () => {
  let midiAccessMock: any;
  let inputMock: any;

  beforeEach(() => {
    inputMock = {
      onmidimessage: null,
      state: 'connected'
    };
    midiAccessMock = {
      inputs: new Map([['input1', inputMock]]),
      onstatechange: null
    };

    Object.defineProperty(navigator, 'requestMIDIAccess', {
      value: vi.fn().mockResolvedValue(midiAccessMock),
      configurable: true
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should connect MIDI successfully', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    const btn = el.shadowRoot.querySelector('#connect-btn');
    btn.click();

    await new Promise(r => setTimeout(r, 0));
    expect(el.midiAccess).toBeDefined();
    expect(el.shadowRoot.innerHTML).toContain('Connected (1 inputs)');
  });

  it('should set up onmidimessage and activeMapper', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();

    expect(inputMock.onmidimessage).toBeDefined();
    expect(el.activeMapper).toBeDefined();
  });

  it('should process MIDI events and publish phrase', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    el.setAttribute('emit-id', 'test-emit');
    document.body.appendChild(el);
    await el.connectMidi();

    // Set active mapper to melody
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    let publishedTokens = null;
    EventBus.subscribe('test-emit', (payload) => {
        publishedTokens = payload;
    });

    // Press C4
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 60)); // 60 is C4
    // Commit (G3)
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 55)); // 55 is G3

    expect(publishedTokens).not.toBeNull();
    expect((publishedTokens as any).text.trim()).toBe('Do');
  });

  it('should handle structural command combo (delete row)', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    // mock emitId for handleMidiMessage to run
    el.setAttribute('emit-id', 'test-emit');

    let publishedEvent = false;
    EventBus.subscribe('coil-layer-delete', () => publishedEvent = true);

    // Hold C3 (48) and B4 (71)
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));

    // Press E3 (52)
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 52));

    expect(publishedEvent).toBe(true);
    expect(el.currentRawText).toBe('');
  });

  it('should handle structural command combo (add row)', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    el.setAttribute('emit-id', 'test-emit');

    let publishedEvent = false;
    EventBus.subscribe('coil-layer-add', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 55));

    expect(publishedEvent).toBe(true);
  });

  it('should handle structural command combo (nav up)', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    el.setAttribute('emit-id', 'test-emit');

    let publishedEvent = false;
    EventBus.subscribe('coil-nav-up', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 54));

    expect(publishedEvent).toBe(true);
  });

  it('should handle structural command combo (nav down)', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    el.setAttribute('emit-id', 'test-emit');

    let publishedEvent = false;
    EventBus.subscribe('coil-nav-down', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 51));

    expect(publishedEvent).toBe(true);
  });

  it('should ignore other keys while structural combo is held', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    el.setAttribute('emit-id', 'test-emit-2');
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    let publishedTokens = null;
    EventBus.subscribe('test-emit-2', (payload) => publishedTokens = payload);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));

    // Press C4 (60)
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 60));

    // We shouldn't process C4 as a melody note because structural combo is held
    expect(publishedTokens).toBeNull();
  });

  it('should handle mapper DELETE result', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    el.setAttribute('emit-id', 'test-emit-del');
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    // Pre-populate some text
    el.currentRawText = 'Do Re';

    let publishedTokens = null;
    EventBus.subscribe('test-emit-del', (payload) => publishedTokens = payload);

    // E3 is mapped to DELETE in PitchMapper
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 52));

    expect(publishedTokens).not.toBeNull();
    expect(el.currentRawText).toBe('Do');
  });

  it('should clean up on disconnectedCallback', async () => {
    const el = document.createElement('ppt-midi-input-bridge') as any;
    document.body.appendChild(el);
    await el.connectMidi();

    el.disconnectedCallback();

    expect(inputMock.onmidimessage).toBeNull();
  });

  it('should handle onstatechange event', async () => {
      const el = document.createElement('ppt-midi-input-bridge') as any;
      document.body.appendChild(el);
      await el.connectMidi();

      expect(midiAccessMock.onstatechange).toBeDefined();

      const newPort = { type: 'input', state: 'connected', onmidimessage: null };
      midiAccessMock.onstatechange({ port: newPort });

      expect(newPort.onmidimessage).toBeDefined();
  });
});
