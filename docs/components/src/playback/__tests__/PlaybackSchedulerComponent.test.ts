import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlaybackSchedulerComponent } from '../PlaybackSchedulerComponent.js';
import { EventBus } from '../../features/EventBus.js';
import * as Tone from 'tone';

vi.mock('tone', () => {
  return {
    Transport: {
      bpm: { value: 120 },
      loop: false,
      loopStart: 0,
      loopEnd: 0,
      start: vi.fn(),
      stop: vi.fn(),
      clear: vi.fn(),
      schedule: vi.fn().mockImplementation(() => 1),
      scheduleOnce: vi.fn()
    },
    Draw: {
      schedule: vi.fn().mockImplementation((cb, time) => { cb(); })
    },
    start: vi.fn().mockResolvedValue(undefined),
    context: {
      state: 'running'
    }
  };
});

describe('PlaybackSchedulerComponent', () => {
  let element: PlaybackSchedulerComponent;
  let publishSpy: any;

  beforeEach(() => {
    publishSpy = vi.spyOn(EventBus, 'publish').mockImplementation(() => {});
    document.body.innerHTML = '';
    element = document.createElement('ppt-playback-scheduler') as PlaybackSchedulerComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle stop', () => {
    // Manually push a mock event ID to clear
    (element as any).scheduledEventIds.push(42);

    // Simulate stop event
    EventBus.publish('coil-stop', {});

    // unmock to call actual handler
    publishSpy.mockRestore();

    // Have to call manually since we already spy-mocked publish during subscribe
    (element as any).handleStop();

    expect(Tone.Transport.stop).toHaveBeenCalled();
    expect(Tone.Transport.clear).toHaveBeenCalledWith(42);
    expect((element as any).scheduledEventIds).toHaveLength(0);
  });

  it('should handle mixer-mute and mixer-solo', () => {
    (element as any).handleMute({ layer: 'melody', rowIndex: 0, active: true });
    expect((element as any).mutedRows.has('melody-0')).toBe(true);

    (element as any).handleMute({ layer: 'melody', rowIndex: 0, active: false });
    expect((element as any).mutedRows.has('melody-0')).toBe(false);

    (element as any).handleSolo({ layer: 'harmony', rowIndex: 1, active: true });
    expect((element as any).soloedRows.has('harmony-1')).toBe(true);

    (element as any).handleSolo({ layer: 'harmony', rowIndex: 1, active: false });
    expect((element as any).soloedRows.has('harmony-1')).toBe(false);
  });

  it('has componentDef', () => {
    const def = PlaybackSchedulerComponent.componentDef;
    expect(def.displayName).toBe('Playback Scheduler');
    expect(def.canNestIn).toContain('ppt-coil');
  });

  it('should handle play event basic fallback', async () => {
    // Call handlePlay directly. Without child elements it hits fallback logic
    await (element as any).handlePlay({ bpm: 120, loop: true });

    expect(Tone.start).not.toHaveBeenCalled(); // state is running
    expect(Tone.Transport.bpm.value).toBe(120);
    expect(Tone.Transport.loop).toBe(true);
    expect(Tone.Transport.start).toHaveBeenCalled();
  });

  it('should auto-stop if not looping', async () => {
    await (element as any).handlePlay({ bpm: 120, loop: false });

    expect(Tone.Transport.loop).toBe(false);
    expect(Tone.Transport.scheduleOnce).toHaveBeenCalled();
  });
});
