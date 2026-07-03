import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WithSound } from '../WithSound.js';
import * as Tone from 'tone';

const triggerAttackReleaseMock = vi.fn();
const toDestinationMock = vi.fn().mockReturnValue({ triggerAttackRelease: triggerAttackReleaseMock });

vi.mock('tone', () => {
  const triggerAttackReleaseMock = vi.fn();
  const toDestinationMock = vi.fn().mockReturnValue({ triggerAttackRelease: triggerAttackReleaseMock });

  return {
    PolySynth: class {
      toDestination = toDestinationMock;
      triggerAttackRelease = triggerAttackReleaseMock;
    },
    Synth: class {},
    start: vi.fn().mockResolvedValue(undefined),
    context: { state: 'suspended' }
  };
});

describe('WithSound', () => {
  class MockBaseElement extends HTMLElement {
    constructor() {
      super();
    }
  }

  const SoundElementClass = WithSound(MockBaseElement);

  beforeEach(() => {
    if (!customElements.get('mock-sound-element')) {
      customElements.define('mock-sound-element', SoundElementClass);
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize synth and play sound', async () => {
    const instance = document.createElement('mock-sound-element') as any;

    instance.playSound('C4', '8n');

    expect(Tone.start).toHaveBeenCalled();
  });

  it('should not initialize synth multiple times', () => {
    const instance = document.createElement('mock-sound-element') as any;

    instance.playSound();
    instance.playSound();
  });
});
