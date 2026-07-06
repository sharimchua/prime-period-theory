import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToneVoiceComponent } from '../ToneVoiceComponent.js';
import { EventBus } from '../../features/EventBus.js';
import * as Tone from 'tone';

const mockTriggerAttackRelease = vi.fn();
const mockTriggerRelease = vi.fn();
const mockReleaseAll = vi.fn();
const mockDispose = vi.fn();
const mockToDestination = vi.fn().mockReturnThis();

vi.mock('tone', () => {
  return {
    PolySynth: class {
      toDestination = mockToDestination;
      triggerAttackRelease = mockTriggerAttackRelease;
      triggerRelease = mockTriggerRelease;
      releaseAll = mockReleaseAll;
      dispose = mockDispose;
    },
    Synth: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
    now: vi.fn().mockReturnValue(1),
    context: {
      state: 'running'
    }
  };
});

describe('ToneVoiceComponent', () => {
  let element: ToneVoiceComponent;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    element = document.createElement('ppt-tone-voice') as ToneVoiceComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (element.parentElement) {
      document.body.removeChild(element);
    }
  });

  it('should initialize correctly', () => {
    expect(element.style.display).toBe('none');
  });

  it('should respond to play-note events', async () => {
    const vId = element.getAttribute('voice-id') || 'default';
    EventBus.publish(`play-note-${vId}`, { freq: 440, duration: 1, time: 2 });

    await new Promise(r => setTimeout(r, 0));

    expect(mockTriggerAttackRelease).toHaveBeenCalledWith(440, 1, 2);
  });

  it('should trigger Tone.start if context is not running', async () => {
     const vId = element.getAttribute('voice-id') || 'default';
     (Tone.context as any).state = 'suspended';
     EventBus.publish(`play-note-${vId}`, { freq: 440, duration: 1, time: 2 });

     await new Promise(r => setTimeout(r, 0));

     expect(Tone.start).toHaveBeenCalled();
     (Tone.context as any).state = 'running'; // reset for other tests
  });

  it('should stop note on stop-note event with freq', async () => {
    const vId = element.getAttribute('voice-id') || 'default';
    // first initialize it by playing
    EventBus.publish(`play-note-${vId}`, { freq: 440 });
    await new Promise(r => setTimeout(r, 0));

    EventBus.publish(`stop-note-${vId}`, { freq: 440, time: 3 });
    expect(mockTriggerRelease).toHaveBeenCalledWith(440, 3);
  });

  it('should stop all notes on stop-note event without freq', async () => {
    const vId = element.getAttribute('voice-id') || 'default';
    // first initialize it by playing
    EventBus.publish(`play-note-${vId}`, { freq: 440 });
    await new Promise(r => setTimeout(r, 0));

    EventBus.publish(`stop-note-${vId}`, {});
    expect(mockReleaseAll).toHaveBeenCalled();
  });

  it('should dispose synth on disconnect', async () => {
     const vId = element.getAttribute('voice-id') || 'default';
     EventBus.publish(`play-note-${vId}`, { freq: 440 });
     await new Promise(r => setTimeout(r, 0));

     document.body.removeChild(element);
     expect(mockDispose).toHaveBeenCalled();
  });

  it('has componentDef', () => {
    const def = ToneVoiceComponent.componentDef;
    expect(def.displayName).toBe('Tone Voice');
    expect(def.canNestIn).toContain('ppt-coil');
  });

  it('has pptMetadata and observedAttributes', () => {
     expect(ToneVoiceComponent.observedAttributes).toContain('voice-id');
     expect(ToneVoiceComponent.pptMetadata['voice-id']).toBeDefined();
  });
});
