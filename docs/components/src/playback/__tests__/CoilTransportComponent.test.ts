import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CoilTransportComponent } from '../CoilTransportComponent.js';
import { EventBus } from '../../features/EventBus.js';

describe('CoilTransportComponent', () => {
  let element: CoilTransportComponent;
  let publishSpy: any;

  beforeEach(() => {
    publishSpy = vi.spyOn(EventBus, 'publish').mockImplementation(() => {});
    document.body.innerHTML = '';
    element = document.createElement('ppt-coil-transport') as CoilTransportComponent;
    document.body.appendChild(element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the component structure', () => {
    const shadow = element.shadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow!.getElementById('btn-play')).toBeTruthy();
    expect(shadow!.getElementById('bpm-input')).toBeTruthy();
    expect(shadow!.getElementById('loop-input')).toBeTruthy();
  });

  it('should publish coil-play on play button click', () => {
    const shadow = element.shadowRoot;
    const playBtn = shadow!.getElementById('btn-play') as HTMLButtonElement;

    playBtn.click();

    expect(EventBus.publish).toHaveBeenCalledWith('coil-play', { bpm: 120, loop: false });
    expect(playBtn.textContent).toBe('Stop');
    expect(playBtn.classList.contains('playing')).toBe(true);
  });

  it('should publish coil-stop on second play button click', () => {
    const shadow = element.shadowRoot;
    const playBtn = shadow!.getElementById('btn-play') as HTMLButtonElement;

    playBtn.click(); // play
    playBtn.click(); // stop

    expect(EventBus.publish).toHaveBeenCalledWith('coil-stop', {});
    expect(playBtn.textContent).toBe('Play');
    expect(playBtn.classList.contains('playing')).toBe(false);
  });

  it('should publish coil-play with updated bpm and loop values', () => {
    const shadow = element.shadowRoot;
    const playBtn = shadow!.getElementById('btn-play') as HTMLButtonElement;
    const bpmInput = shadow!.getElementById('bpm-input') as HTMLInputElement;
    const loopInput = shadow!.getElementById('loop-input') as HTMLInputElement;

    bpmInput.value = '140';
    loopInput.checked = true;

    playBtn.click();

    expect(EventBus.publish).toHaveBeenCalledWith('coil-play', { bpm: 140, loop: true });
  });

  it('should handle external coil-stop event', () => {
    const shadow = element.shadowRoot;
    const playBtn = shadow!.getElementById('btn-play') as HTMLButtonElement;

    playBtn.click(); // set to playing state
    expect(playBtn.classList.contains('playing')).toBe(true);

    // We need to restore the mock so the subscriber can actually receive the event
    // since we mocked publish. Or better yet, we just trigger the subscriber.
    // However, vitest restores spies in afterEach, but here we want to test the subscriber.
    // The easiest way is to actually call the callback we passed to subscribe.

    // Let's unmock just for this test so publish actually calls subscribers
    publishSpy.mockRestore();

    EventBus.publish('coil-stop', {});

    expect(playBtn.textContent).toBe('Play');
    expect(playBtn.classList.contains('playing')).toBe(false);
  });

  it('has componentDef', () => {
    const def = CoilTransportComponent.componentDef;
    expect(def.displayName).toBe('Coil Transport');
    expect(def.canNestIn).toContain('ppt-coil');
  });
});
