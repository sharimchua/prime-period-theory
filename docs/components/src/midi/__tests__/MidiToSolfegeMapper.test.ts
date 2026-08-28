import { describe, it, expect } from 'vitest';
import { chromaticToSolfege } from '../MidiToSolfegeMapper.js';

describe('MidiToSolfegeMapper', () => {
  describe('chromaticToSolfege', () => {
    it('should correctly map chromatic indices to solfege syllables', () => {
      expect(chromaticToSolfege(0)).toBe('Do');
      expect(chromaticToSolfege(1)).toBe('Ra');
      expect(chromaticToSolfege(2)).toBe('Re');
      expect(chromaticToSolfege(3)).toBe('Me');
      expect(chromaticToSolfege(4)).toBe('Mi');
      expect(chromaticToSolfege(5)).toBe('Fa');
      expect(chromaticToSolfege(6)).toBe('Fi');
      expect(chromaticToSolfege(7)).toBe('So');
      expect(chromaticToSolfege(8)).toBe('Le');
      expect(chromaticToSolfege(9)).toBe('La');
      expect(chromaticToSolfege(10)).toBe('Te');
      expect(chromaticToSolfege(11)).toBe('Ti');
    });

    it('should wrap around correctly for indices >= 12', () => {
      expect(chromaticToSolfege(12)).toBe('Do');
      expect(chromaticToSolfege(13)).toBe('Ra');
      expect(chromaticToSolfege(24)).toBe('Do');
    });

    it('should wrap around correctly for negative indices', () => {
      expect(chromaticToSolfege(-1)).toBe('Ti');
      expect(chromaticToSolfege(-2)).toBe('Te');
      expect(chromaticToSolfege(-12)).toBe('Do');
    });
  });
});
