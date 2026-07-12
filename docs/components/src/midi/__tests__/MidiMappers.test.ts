import { describe, it, expect, beforeEach } from 'vitest';
import { PitchMapper } from '../PitchMapper.js';
import { HarmonyMapper } from '../HarmonyMapper.js';
import { RhythmMapper } from '../RhythmMapper.js';

const noteOn = (note: number) => ({ data: [144, note, 100] } as WebMidi.MIDIMessageEvent);
const noteOff = (note: number) => ({ data: [128, note, 0] } as WebMidi.MIDIMessageEvent);

describe('PitchMapper', () => {
  let mapper: PitchMapper;

  beforeEach(() => {
    mapper = new PitchMapper();
  });

  it('should map single note on and off', () => {
    expect(mapper.processMidiEvent(noteOn(60))).toBeNull(); // C4 (Do)
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{ // Commit (G3)
      solfege: 'Do',
      commas: [],
      raw: 'Do'
    }]);
    expect(mapper.processMidiEvent(noteOff(60))).toBeNull();
  });

  it('should handle octave up/down modifiers', () => {
    mapper.processMidiEvent(noteOn(60)); // C4
    mapper.processMidiEvent(noteOn(54)); // Octave Up (F#3)
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Do',
      commas: [],
      raw: 'Do^Ra'
    }]);

    mapper.reset();

    mapper.processMidiEvent(noteOn(60)); // C4
    mapper.processMidiEvent(noteOn(51)); // Octave Down (D#3)
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Do',
      commas: [],
      raw: 'Do^Ti'
    }]);
  });

  it('should handle delete', () => {
    expect(mapper.processMidiEvent(noteOn(52))).toBe('DELETE'); // E3
  });

  it('should handle dot/dash modifiers', () => {
    mapper.processMidiEvent(noteOn(48)); // C3 (modifier start)
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: undefined,
      commas: [],
      raw: '.'
    }]);

    mapper.reset();

    mapper.processMidiEvent(noteOn(48)); // C3
    mapper.processMidiEvent(noteOn(52)); // E3 (Delete/Dash)
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: undefined,
      commas: [],
      raw: '-'
    }]);
  });
});

describe('HarmonyMapper', () => {
  let mapper: HarmonyMapper;

  beforeEach(() => {
    mapper = new HarmonyMapper();
  });

  it('should output a single root note', () => {
    mapper.processMidiEvent(noteOn(60)); // C4
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{ // Commit
      solfege: 'Do',
      commas: [],
      raw: 'Do'
    }]);
  });

  it('should output chord modifiers relative to C3', () => {
    mapper.processMidiEvent(noteOn(60)); // C4 (Root Do)
    mapper.processMidiEvent(noteOn(51)); // D#3 (+3 -> Me)
    mapper.processMidiEvent(noteOn(55)); // G3 (Commit) -> also +7 -> So, but 55 is commit so it's skipped as tone
    // Actually, wait, 55 is commit. If they want So, they can't use 55?
    // Let's just check D#3
    mapper.reset();
    mapper.processMidiEvent(noteOn(60)); // C4
    mapper.processMidiEvent(noteOn(51)); // Me
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Do',
      commas: [],
      raw: 'Do [Me]'
    }]);
  });

  it('should handle delete', () => {
    expect(mapper.processMidiEvent(noteOn(52))).toBe('DELETE');
  });

  it('should suppress delete when holding C3', () => {
    mapper.processMidiEvent(noteOn(48)); // C3
    expect(mapper.processMidiEvent(noteOn(52))).toBeNull();
  });
});

describe('RhythmMapper', () => {
  let mapper: RhythmMapper;

  beforeEach(() => {
    mapper = new RhythmMapper();
  });

  it('should map note on and off without modifiers', () => {
    mapper.processMidiEvent(noteOn(60)); // C4
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Do',
      commas: [],
      raw: 'Do'
    }]);
  });

  it('should handle C3 modifier to turn Do into Dox', () => {
    mapper.processMidiEvent(noteOn(48)); // C3
    mapper.processMidiEvent(noteOn(60)); // C4
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Dox',
      commas: [],
      raw: 'Dox'
    }]);
  });

  it('should handle C3 modifier to turn Di into Dix', () => {
    mapper.processMidiEvent(noteOn(48)); // C3
    mapper.processMidiEvent(noteOn(61)); // C#4
    expect(mapper.processMidiEvent(noteOn(55))).toEqual([{
      solfege: 'Dix',
      commas: [],
      raw: 'Dix'
    }]);
  });

  it('should handle delete', () => {
    expect(mapper.processMidiEvent(noteOn(52))).toBe('DELETE'); // E3
  });
});
