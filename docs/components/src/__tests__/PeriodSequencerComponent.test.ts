import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PeriodSequencerComponent } from '../PeriodSequencerComponent';
import '../PeriodSequencerComponent'; // Ensure it's defined

describe('PeriodSequencerComponent', () => {
  let element: PeriodSequencerComponent;

  beforeEach(() => {
    element = document.createElement('ppt-period-sequencer') as PeriodSequencerComponent;
    document.body.appendChild(element);
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
    vi.restoreAllMocks();
  });

  it('should define component metadata correctly', () => {
    expect(PeriodSequencerComponent.componentDef.displayName).toBe('Sequencer');
    expect(PeriodSequencerComponent.componentDef.familyColor).toBe('#e74c3c');
    expect(PeriodSequencerComponent.pptMetadata.tempo.default).toBe(120);
    expect(PeriodSequencerComponent.pptMetadata['is-playing'].default).toBe(false);
  });

  it('should have default properties', () => {
    expect(element.tempo).toBe(120);
    expect(element.isPlaying).toBe(false);
  });

  it('should reflect tempo attribute to property', () => {
    element.setAttribute('tempo', '140');
    expect(element.tempo).toBe(140);
  });

  it('should update tempo property when set via setter', () => {
    element.tempo = 100;
    expect(element.getAttribute('tempo')).toBe('100');
  });

  it('should reflect is-playing attribute to property', () => {
    element.setAttribute('is-playing', 'true');
    expect(element.isPlaying).toBe(true);

    element.removeAttribute('is-playing');
    expect(element.isPlaying).toBe(false);
  });

  it('should update is-playing attribute when set via setter', () => {
    element.isPlaying = true;
    expect(element.getAttribute('is-playing')).toBe('true');

    element.isPlaying = false;
    expect(element.hasAttribute('is-playing')).toBe(false);
  });

  it('should handle onStateMessage for metronome-tempo and metronome-play', () => {
    element.onStateMessage('metronome-tempo', 150);
    expect(element.tempo).toBe(150);

    element.onStateMessage('metronome-play', true);
    expect(element.isPlaying).toBe(true);

    element.onStateMessage('metronome-play', false);
    expect(element.isPlaying).toBe(false);
  });

  it('should play siblings sequentially when started', () => {
    const parent = document.createElement('div');

    // Create fake siblings that have playSound and highlight
    const sibling1 = document.createElement('div') as any;
    sibling1.playSound = vi.fn();
    sibling1.highlight = vi.fn();
    sibling1.unhighlight = vi.fn();
    sibling1.pitch = 'C4';

    const sibling2 = document.createElement('div') as any;
    sibling2.playSound = vi.fn();
    sibling2.highlight = vi.fn();
    sibling2.unhighlight = vi.fn();
    sibling2.pitch = 'E4';

    parent.appendChild(sibling1);
    parent.appendChild(element); // The sequencer itself
    parent.appendChild(sibling2);

    document.body.appendChild(parent);

    element.tempo = 120; // 500ms per beat
    element.isPlaying = true; // Starts playback

    // First interval (500ms) -> plays sibling1
    vi.advanceTimersByTime(500);
    expect(sibling1.playSound).toHaveBeenCalledWith('C4');
    expect(sibling1.highlight).toHaveBeenCalled();

    // 200ms later, it should unhighlight
    vi.advanceTimersByTime(200);
    expect(sibling1.unhighlight).toHaveBeenCalled();

    // Next interval (300ms + 200ms = 500ms total since last tick) -> plays sibling2
    vi.advanceTimersByTime(300);
    expect(sibling2.playSound).toHaveBeenCalledWith('E4');
    expect(sibling2.highlight).toHaveBeenCalled();

    // Wrap around
    vi.advanceTimersByTime(500);
    expect(sibling1.playSound).toHaveBeenCalledTimes(2);

    element.isPlaying = false; // Stops playback
    vi.advanceTimersByTime(1000); // Wait 2 more beats

    // Play counts should not change
    expect(sibling1.playSound).toHaveBeenCalledTimes(2);
    expect(sibling2.playSound).toHaveBeenCalledTimes(1);

    if (parent.parentElement) {
      parent.parentElement.removeChild(parent);
    }
  });
});
