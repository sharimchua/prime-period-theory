import { describe, it, expect } from 'vitest';
import { parsePitch, pitchToMidi, mapPitchesToRatios, PitchTuningConfig } from '../pitchUtils';

describe('pitchUtils', () => {
  describe('parsePitch', () => {
    it('should parse basic solfege', () => {
      expect(parsePitch('Do')).toEqual({ note: 'Do', accidental: '', octave: 0, raw: 'Do' });
      expect(parsePitch('Fi')).toEqual({ note: 'Fi', accidental: '', octave: 0, raw: 'Fi' });
    });

    it('should parse solfege with octaves', () => {
      expect(parsePitch('Do2')).toEqual({ note: 'Do', accidental: '', octave: 1, raw: 'Do2' });
      expect(parsePitch('Re-1')).toEqual({ note: 'Re', accidental: '', octave: -2, raw: 'Re-1' });
    });

    it('should return null for invalid solfege', () => {
      expect(parsePitch('Invalid')).toBeNull();
      expect(parsePitch('C4')).toBeNull();
    });
  });

  describe('pitchToMidi', () => {
    it('should map solfege to midi correctly', () => {
      expect(pitchToMidi({ note: 'Do', accidental: '', octave: 0, raw: 'Do' })).toBe(0);
      expect(pitchToMidi({ note: 'Fi', accidental: '', octave: 0, raw: 'Fi' })).toBe(6);
      expect(pitchToMidi({ note: 'Do', accidental: '', octave: 1, raw: 'Do2' })).toBe(12);
    });

    it('should handle undefined notes', () => {
      expect(pitchToMidi({ note: 'Invalid', accidental: '', octave: 0, raw: 'Invalid' })).toBe(0);
    });
  });

  describe('mapPitchesToRatios', () => {
    const config: PitchTuningConfig = {
      m2: 'Du', M2: 'Du', m3: 'Du', M3: 'Du', P4: 'Du', TT: 'Du', P5: 'Du', m6: 'Du', M6: 'Du', m7: 'Du', M7: 'Du'
    };

    const triConfig: PitchTuningConfig = {
      m2: 'Tri', M2: 'Tri', m3: 'Tri', M3: 'Tri', P4: 'Tri', TT: 'Tri', P5: 'Tri', m6: 'Tri', M6: 'Tri', m7: 'Sep', M7: 'Tri'
    };

    const standardConfig: PitchTuningConfig = {
      m2: 'Tri', M2: 'Tri', m3: 'Qui', M3: 'Qui', P4: 'Tri', TT: 'Qui', P5: 'Tri', m6: 'Qui', M6: 'Qui', m7: 'Sep', M7: 'Qui'
    };

    it('should map pitches to ratios with Du tuning', () => {
      const results = mapPitchesToRatios('Do Di Re Ri Mi Fa Fi So Le La Te Ti Do2', config);
      expect(results.length).toBe(13);
      expect(results[0].rmult.toKey()).toBe('1/1');
      expect(results[1].rmult.toNumber()).toBeCloseTo(Math.pow(2, 1/12)); // m2
      expect(results[2].rmult.toNumber()).toBeCloseTo(Math.pow(2, 2/12)); // M2
      expect(results[3].rmult.toNumber()).toBeCloseTo(Math.pow(2, 3/12)); // m3
      expect(results[4].rmult.toNumber()).toBeCloseTo(Math.pow(2, 4/12)); // M3
      expect(results[5].rmult.toNumber()).toBeCloseTo(Math.pow(2, 5/12)); // P4
      expect(results[6].rmult.toNumber()).toBeCloseTo(Math.pow(2, 6/12)); // TT
      expect(results[7].rmult.toNumber()).toBeCloseTo(Math.pow(2, 7/12)); // P5
      expect(results[8].rmult.toNumber()).toBeCloseTo(Math.pow(2, 8/12)); // m6
      expect(results[9].rmult.toNumber()).toBeCloseTo(Math.pow(2, 9/12)); // M6
      expect(results[10].rmult.toNumber()).toBeCloseTo(Math.pow(2, 10/12)); // m7
      expect(results[11].rmult.toNumber()).toBeCloseTo(Math.pow(2, 11/12)); // M7
      expect(results[12].rmult.toKey()).toBe('2/1'); // Octave
    });

    it('should map pitches to ratios with Tri/Qui/Sep tuning', () => {
      const results = mapPitchesToRatios('Do Di Re Ri Mi Fa Fi So Le La Te Ti Do2', standardConfig);
      expect(results.length).toBe(13);
      expect(results[0].rmult.toKey()).toBe('1/1');
      expect(results[1].rmult.toKey()).toBe('16/15');
      expect(results[2].rmult.toKey()).toBe('9/8');
      expect(results[3].rmult.toKey()).toBe('6/5');
      expect(results[4].rmult.toKey()).toBe('5/4');
      expect(results[5].rmult.toKey()).toBe('4/3');
      expect(results[6].rmult.toKey()).toBe('45/32');
      expect(results[7].rmult.toKey()).toBe('3/2');
      expect(results[8].rmult.toKey()).toBe('8/5');
      expect(results[9].rmult.toKey()).toBe('5/3');
      expect(results[10].rmult.toKey()).toBe('7/4');
      expect(results[11].rmult.toKey()).toBe('15/8');
      expect(results[12].rmult.toKey()).toBe('2/1');
    });

    it('should handle Tri variations', () => {
       const results2 = mapPitchesToRatios('Do Di Ri Mi Fi Le La Te Ti', triConfig);
       expect(results2[1].rmult.toKey()).toBe('16/15');
       expect(results2[2].rmult.toKey()).toBe('32/27');
       expect(results2[3].rmult.toKey()).toBe('81/64');
       expect(results2[4].rmult.toKey()).toBe('729/512');
       expect(results2[5].rmult.toKey()).toBe('128/81');
       expect(results2[6].rmult.toKey()).toBe('27/16');
       expect(results2[7].rmult.toKey()).toBe('7/4');
       expect(results2[8].rmult.toKey()).toBe('243/128');
    });

    it('should handle Undec and fallback tunings', () => {
       const results = mapPitchesToRatios('Do Fi', { ...standardConfig, TT: 'Undec' });
       expect(results[1].rmult.toKey()).toBe('11/8');

       const results2 = mapPitchesToRatios('Do Fi', { ...standardConfig, TT: 'SomethingElse' } as any);
       expect(results2[1].rmult.toKey()).toBe('45/32');
    });

    it('should handle empty input', () => {
      expect(mapPitchesToRatios('', config)).toEqual([]);
      expect(mapPitchesToRatios('Invalid', config)).toEqual([]);
    });

    it('should handle tokens with invalid solfege after base', () => {
        expect(mapPitchesToRatios('Do Invalid Mi', config).length).toBe(2);
    });

    it('should compute negative octaves correctly', () => {
      const results = mapPitchesToRatios('Do-1', config);
      expect(results.length).toBe(1);
      expect(results[0].rmult.toKey()).toBe('1/1');

      const results2 = mapPitchesToRatios('Do Do-1', config);
      expect(results2[1].rmult.toKey()).toBe('1/1'); // For Do to Do-1, the octave delta calculation works via absolute semitone difference.
    });

    it('should handle descending intervals that wrap around octaves correctly', () => {
       const results = mapPitchesToRatios('So Do', config);
       expect(results[1].rmult.toNumber()).toBeCloseTo(Math.pow(2, 5/12));
    });

    it('should handle Tri tuning for minor 7th (fallback)', () => {
       const triConfig2 = { ...triConfig, m7: 'Tri' as any };
       const results = mapPitchesToRatios('Do Te', triConfig2);
       expect(results[1].rmult.toKey()).toBe('16/9'); // fallback for m7
    });
  });
});
