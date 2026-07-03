import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PeriodStepCircleComponent } from '../PeriodStepCircleComponent.js';

vi.mock('tone', () => {
  return {
    Frequency: vi.fn().mockImplementation((pitch) => {
      return {
        toMidi: () => {
          if (pitch === 'C4') return 60;
          throw new Error('Invalid pitch');
        }
      };
    })
  };
});

describe('PeriodStepCircleComponent', () => {
  beforeEach(() => {
    // Component already registered when module loaded
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should define component properties', () => {
    expect(PeriodStepCircleComponent.componentDef.displayName).toBe('Step Circle');
    expect(PeriodStepCircleComponent.pptMetadata.color).toBeDefined();
    expect(PeriodStepCircleComponent.pptMetadata.label).toBeDefined();
  });

  it('should render and update color and label', () => {
    const instance = document.createElement('ppt-period-step-circle') as any;
    document.body.appendChild(instance);

    const markerEl = instance.shadowRoot.querySelector('.step-marker');

    // Default color logic
    expect(instance.color).toBe('var(--ppt-marker-bg, #fff)');
    expect(instance.label).toBe('');

    instance.color = '#ff0000';
    expect(instance.color).toBe('#ff0000');
    expect(instance.style.getPropertyValue('--step-bg-color')).toBe('#ff0000');

    instance.label = '1';
    expect(instance.label).toBe('1');
    expect(markerEl.textContent.trim()).toBe('1');
  });

  it('should play sound and highlight on click if interactive', () => {
    vi.useFakeTimers();

    const instance = document.createElement('ppt-period-step-circle') as any;
    instance.playSound = vi.fn();
    instance.highlight = vi.fn();
    instance.unhighlight = vi.fn();

    document.body.appendChild(instance);
    instance.pitch = 'C4';

    const markerEl = instance.shadowRoot.querySelector('.step-marker');
    markerEl.dispatchEvent(new Event('click'));

    expect(instance.playSound).toHaveBeenCalledWith('C4');
    expect(instance.highlight).toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(instance.unhighlight).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should handle MIDI messages', () => {
    const instance = document.createElement('ppt-period-step-circle') as any;
    instance.highlight = vi.fn();
    instance.unhighlight = vi.fn();

    document.body.appendChild(instance);
    instance.pitch = 'C4'; // toMidi = 60

    instance.onMidiMessage({ type: 'noteon', note: 60 });
    expect(instance.highlight).toHaveBeenCalled();

    instance.onMidiMessage({ type: 'noteoff', note: 60 });
    expect(instance.unhighlight).toHaveBeenCalled();

    // Invalid pitch test
    instance.pitch = 'invalid';
    instance.onMidiMessage({ type: 'noteon', note: 60 });
    // Should swallow exception and not highlight again (call count remains 1)
    expect(instance.highlight).toHaveBeenCalledTimes(1);
  });
});
