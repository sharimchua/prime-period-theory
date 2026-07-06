import { describe, it, expect, beforeEach } from 'vitest';
import { PitchMapper } from '../midi/PitchMapper';
import { RhythmMapper } from '../midi/RhythmMapper';
import { HarmonyMapper } from '../midi/HarmonyMapper';
import { MIDI_NOTE_C3, MIDI_NOTE_C4 } from '../midi/MidiToSolfegeMapper';

// Mock WebMidi Event
function createMidiEvent(command: number, note: number, velocity: number = 100): WebMidi.MIDIMessageEvent {
  return {
    data: new Uint8Array([command, note, velocity])
  } as unknown as WebMidi.MIDIMessageEvent;
}

const NOTE_ON = 144;
const NOTE_OFF = 128;

describe('MIDI Mappers', () => {
  describe('PitchMapper', () => {
    let mapper: PitchMapper;

    beforeEach(() => {
      mapper = new PitchMapper();
    });

    it('should buffer notes and emit on COMMIT', () => {
      // Press C4 (Do)
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4));
      // Press E4 (Mi)
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4 + 4));
      
      // Press Commit (G3)
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7));
      
      expect(result).not.toBeNull();
      expect(result).not.toBe('DELETE');
      if (Array.isArray(result)) {
        expect(result.length).toBe(2);
        expect(result[0].solfege).toBe('Do');
        expect(result[1].solfege).toBe('Mi');
      }
    });

    it('should emit DELETE when E3 is pressed', () => {
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 4));
      expect(result).toBe('DELETE');
    });

    it('should output Dot when C3 is committed', () => {
      mapper.reset();
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3));
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7));
      if (Array.isArray(result)) {
        expect(result[0].raw).toBe('.');
      }
    });

    it('should output Dash when C3 and E3 are held and committed', () => {
      mapper.reset();
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3));
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 4));
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7));
      if (Array.isArray(result)) {
        expect(result[0].raw).toBe('-');
      }
    });

    it('should handle octave modifiers', () => {
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4)); // C4
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 6)); // F#3 (Octave UP)
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7)); // Commit
      
      if (Array.isArray(result)) {
        expect(result[0].raw).toBe('Do^Ra');
      }
    });
  });

  describe('RhythmMapper', () => {
    let mapper: RhythmMapper;

    beforeEach(() => {
      mapper = new RhythmMapper();
    });

    it('should map C4 to Dox and C#4 to Dix when C3 is held', () => {
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3)); // C3 (Opener modifier)
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4)); // C4
      const result1 = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7)); // Commit
      if (Array.isArray(result1)) expect(result1[0].raw).toBe('Dox');

      mapper.reset();

      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3)); // C3 (Opener modifier)
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4 + 1)); // C#4
      const result2 = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7)); // Commit
      if (Array.isArray(result2)) expect(result2[0].raw).toBe('Dix');
    });
  });

  describe('HarmonyMapper', () => {
    let mapper: HarmonyMapper;

    beforeEach(() => {
      mapper = new HarmonyMapper();
    });

    it('should map root from input octave and modifiers from modifier octave', () => {
      // F4 as root
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C4 + 5));
      // Eb3 as minor third modifier
      mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 3));
      
      const result = mapper.processMidiEvent(createMidiEvent(NOTE_ON, MIDI_NOTE_C3 + 7)); // Commit G3
      if (Array.isArray(result)) {
        expect(result.length).toBe(1);
        expect(result[0].solfege).toBe('Fa');
        expect(result[0].raw).toBe('Fa [Me]');
      }
    });
  });
});
