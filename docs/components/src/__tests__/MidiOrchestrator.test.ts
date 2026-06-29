import { describe, it, expect } from 'vitest';
import { MidiOrchestrator } from '../features/MidiOrchestrator';

describe('MidiOrchestrator', () => {
  it('should have a static init method defined', () => {
    expect(MidiOrchestrator.init).toBeTypeOf('function');
  });

  it('should return a singleton instance via getInstance', () => {
    const instance1 = MidiOrchestrator.getInstance();
    const instance2 = MidiOrchestrator.getInstance();
    expect(instance1).toBe(instance2);
  });
});
