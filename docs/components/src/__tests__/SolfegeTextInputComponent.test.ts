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

describe('SolfegeTextInputComponent edge cases', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should handle active editor change', () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);

    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do Re' });

    const input = el.shadowRoot.querySelector('input');
    expect(input.value).toBe('Do Re');
    expect(el.isBound).toBe(true);

    EventBus.publish('active-phrase-editor-changed', null);
    expect(el.isBound).toBe(false);
  });

  it('should ignore input if not bound', () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    el.setAttribute('emit-id', 'test-emit');
    document.body.appendChild(el);

    el.isBound = false;
    const input = el.shadowRoot.querySelector('input');
    input.value = 'Mi Fa';

    let fired = false;
    EventBus.subscribe('test-emit', () => fired = true);

    input.dispatchEvent(new Event('input'));
    expect(fired).toBe(false);
  });
});

describe('SolfegeTextInputComponent MIDI Integration', () => {
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

  it('should connect MIDI and handle connection state', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);

    const midiBtn = el.shadowRoot.querySelector('.midi-btn');
    midiBtn.click();

    await new Promise(r => setTimeout(r, 0));

    expect(el.midiAccess).toBeDefined();
    expect(inputMock.onmidimessage).toBeDefined();
    expect(el.shadowRoot.querySelector('.midi-btn').classList.contains('connected')).toBe(true);
  });

  it('should handle layer focus changed and switch mappers', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();

    EventBus.publish('layer-focus-changed', { layerType: 'rhythm' });
    expect(el.currentLayerType).toBe('rhythm');
  });

  it('should process MIDI events and update input value', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    el.setAttribute('emit-id', 'test-glyph-input');
    document.body.appendChild(el);
    await el.connectMidi();

    // Bind to editor so it processes MIDI
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: '' });
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    let publishedTokens = null;
    EventBus.subscribe('test-glyph-input', (payload) => {
        publishedTokens = payload;
    });

    const input = el.shadowRoot.querySelector('input');

    // Press C4
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 60)); // C4
    // Commit G3
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 55)); // G3

    expect(input.value).toBe('Do');
    expect(publishedTokens).not.toBeNull();
    expect((publishedTokens as any).text).toBe('Do');
  });

  it('should handle structural command combo (delete row) via MIDI', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();

    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do' });

    let publishedEvent = false;
    EventBus.subscribe('coil-layer-delete', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48)); // C3
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71)); // B4
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 52)); // E3

    expect(publishedEvent).toBe(true);
    expect(el.shadowRoot.querySelector('input').value).toBe('');
  });

  it('should handle structural command combo (add row) via MIDI', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do' });

    let publishedEvent = false;
    EventBus.subscribe('coil-layer-add', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 55)); // G3

    expect(publishedEvent).toBe(true);
  });

  it('should handle structural command combo (nav up) via MIDI', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do' });

    let publishedEvent = false;
    EventBus.subscribe('coil-nav-up', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 54));

    expect(publishedEvent).toBe(true);
  });

  it('should handle structural command combo (nav down) via MIDI', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do' });

    let publishedEvent = false;
    EventBus.subscribe('coil-nav-down', () => publishedEvent = true);

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 51));

    expect(publishedEvent).toBe(true);
  });

  it('should handle mapper DELETE result via MIDI', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: 'Do Re' });
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 52)); // E3 acts as DELETE in PitchMapper

    expect(el.shadowRoot.querySelector('input').value).toBe('Do');
  });

  it('should ignore MIDI input if structural keys are held', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();
    EventBus.publish('active-phrase-editor-changed', { editor: {}, rawText: '' });
    EventBus.publish('layer-focus-changed', { layerType: 'melody' });

    el.handleMidiMessage(createMidiEvent(NOTE_ON, 48));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 71));
    el.handleMidiMessage(createMidiEvent(NOTE_ON, 60)); // C4

    expect(el.shadowRoot.querySelector('input').value).toBe('');
  });

  it('should clean up on disconnectedCallback', async () => {
    const el = document.createElement('ppt-solfege-text-input') as any;
    document.body.appendChild(el);
    await el.connectMidi();

    el.disconnectedCallback();

    expect(inputMock.onmidimessage).toBeNull();
  });
});
