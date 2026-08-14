import { describe, it, expect } from 'vitest';
import { isValidSolfegeToken, parseSolfegeToken, tokenizePhrase, expandRhythmPhrase, mapTokensToRatios, TuningConfig } from '../solfegeUtils.js';

describe('solfegeUtils', () => {
  describe('isValidSolfegeToken', () => {
    it('should return true for valid base solfege tokens', () => {
      expect(isValidSolfegeToken('Do')).toBe(true);
      expect(isValidSolfegeToken('Re')).toBe(true);
      expect(isValidSolfegeToken('Mi')).toBe(true);
      expect(isValidSolfegeToken('Fa')).toBe(true);
      expect(isValidSolfegeToken('So')).toBe(true);
      expect(isValidSolfegeToken('La')).toBe(true);
      expect(isValidSolfegeToken('Ti')).toBe(true);
    });

    it('should return true for valid PPT variant solfege tokens', () => {
      expect(isValidSolfegeToken('Se')).toBe(true);
      expect(isValidSolfegeToken('Si')).toBe(true);
      expect(isValidSolfegeToken('Di')).toBe(true);
    });

    it('should return true for valid base solfege tokens with diacritics', () => {
      expect(isValidSolfegeToken('DoSup')).toBe(true);
      expect(isValidSolfegeToken('ReSub')).toBe(true);
      expect(isValidSolfegeToken('MiAxis')).toBe(true);
    });

    it('should return true for valid tokens with superscripts', () => {
      expect(isValidSolfegeToken('Do^Re')).toBe(true);
      expect(isValidSolfegeToken('MeSup^FaSub')).toBe(true);
    });

    it('should return false for completely invalid tokens', () => {
      expect(isValidSolfegeToken('')).toBe(false);
      expect(isValidSolfegeToken('A')).toBe(false);
      expect(isValidSolfegeToken('XYZ')).toBe(false);
    });

    it('should return false for lowercase tokens', () => {
      expect(isValidSolfegeToken('do')).toBe(false);
      expect(isValidSolfegeToken('re')).toBe(false);
    });

    it('should return false for uppercase tokens', () => {
      expect(isValidSolfegeToken('DO')).toBe(false);
      expect(isValidSolfegeToken('RE')).toBe(false);
    });

    it('should return false for unknown base syllables', () => {
      expect(isValidSolfegeToken('Za')).toBe(false);
      expect(isValidSolfegeToken('Zu')).toBe(false);
    });
  });

  describe('parseSolfegeToken', () => {
    it('should parse a standard base solfege token', () => {
      expect(parseSolfegeToken('Do')).toEqual({
        solfege: 'Do',
        diacritic: ''
      });
      expect(parseSolfegeToken('Re')).toEqual({
        solfege: 'Re',
        diacritic: ''
      });
    });

    it('should parse a token with a known diacritic', () => {
      expect(parseSolfegeToken('DoSup')).toEqual({
        solfege: 'Do',
        diacritic: 'd_tri'
      });
      expect(parseSolfegeToken('ReSub')).toEqual({
        solfege: 'Re',
        diacritic: 'w_tri'
      });
      expect(parseSolfegeToken('MiHalfSup')).toEqual({
        solfege: 'Mi',
        diacritic: 'd_dutri'
      });
      expect(parseSolfegeToken('FaHalfSub')).toEqual({
        solfege: 'Fa',
        diacritic: 'w_dutri'
      });
      expect(parseSolfegeToken('SoAxis')).toEqual({
        solfege: 'So',
        diacritic: 'axis'
      });
      expect(parseSolfegeToken('Lax')).toEqual({
        solfege: 'La',
        diacritic: 'axis'
      });
    });

    it('should fallback to Do for invalid base solfege while ignoring casing', () => {
        expect(parseSolfegeToken('do')).toEqual({
            solfege: 'Do',
            diacritic: ''
        });
        expect(parseSolfegeToken('DO')).toEqual({
            solfege: 'Do',
            diacritic: ''
        });
        expect(parseSolfegeToken('Za')).toEqual({
            solfege: 'Za',
            diacritic: ''
        });
    });

    it('should parse tokens with a single superscript', () => {
      expect(parseSolfegeToken('Do^Re')).toEqual({
        solfege: 'Do',
        diacritic: '',
        superscriptStr: 'Re',
        superscript: {
          solfege: 'Re',
          diacritic: ''
        }
      });
    });

    it('should parse tokens with a superscript and diacritics', () => {
      expect(parseSolfegeToken('DoSup^ReSub')).toEqual({
        solfege: 'Do',
        diacritic: 'd_tri',
        superscriptStr: 'ReSub',
        superscript: {
          solfege: 'Re',
          diacritic: 'w_tri'
        }
      });
    });

    it('should handle deeply nested superscripts', () => {
      expect(parseSolfegeToken('Do^Re^Mi')).toEqual({
        solfege: 'Do',
        diacritic: '',
        superscriptStr: 'Re^Mi',
        superscript: {
          solfege: 'Re',
          diacritic: '',
          superscriptStr: 'Mi',
          superscript: {
            solfege: 'Mi',
            diacritic: ''
          }
        }
      });
    });

    it('should return Do with empty diacritic for empty strings or falsy values', () => {
      expect(parseSolfegeToken('')).toEqual({
        solfege: 'Do',
        diacritic: ''
      });
      expect(parseSolfegeToken(undefined as unknown as string)).toEqual({
        solfege: 'Do',
        diacritic: ''
      });
    });
  });

  describe('tokenizePhrase', () => {
    it('should parse padding', () => {
      expect(tokenizePhrase('..')).toEqual([{ type: 'padding', paddingLength: 2 }]);
    });

    it('should parse hold', () => {
      expect(tokenizePhrase('-')).toEqual([{ type: 'hold' }]);
    });

    it('should parse simple glyphs', () => {
      expect(tokenizePhrase('Do')).toEqual([
        { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], raw: 'Do', octaveOffset: 0 }
      ]);
    });

    it('should parse octave offsets from superscript', () => {
      expect(tokenizePhrase('Do^Ra')).toEqual([
        { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], raw: 'Do^Ra', octaveOffset: 1 }
      ]);
      expect(tokenizePhrase('Do^Ti')).toEqual([
        { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], raw: 'Do^Ti', octaveOffset: -1 }
      ]);
    });

    it('should parse modifiers', () => {
      expect(tokenizePhrase('Do [Mi, So]')).toEqual([
        {
          type: 'glyph',
          solfege: 'Do',
          diacritic: '',
          modifiers: [
            { type: 'glyph', solfege: 'Mi', diacritic: '', octaveOffset: 0, raw: 'Mi' },
            { type: 'glyph', solfege: 'So', diacritic: '', octaveOffset: 0, raw: 'So' }
          ],
          raw: 'Do',
          octaveOffset: 0
        }
      ]);
    });

    it('should handle invalid modifiers', () => {
      expect(tokenizePhrase('Do [XYZ]')).toEqual([
        {
          type: 'glyph',
          solfege: 'Do',
          diacritic: '',
          modifiers: [],
          raw: 'Do',
          octaveOffset: 0
        }
      ]);
    });

    it('should handle invalid tokens', () => {
      expect(tokenizePhrase('XYZ')).toEqual([]);
    });

  });

  describe('expandRhythmPhrase', () => {
    it('should promote Do to Dox', () => {
      const tokens = tokenizePhrase('Do Re');
      const expanded = expandRhythmPhrase(tokens);
      expect(expanded[0].diacritic).toBe('axis');
      expect(expanded[0].raw).toBe('Dox');
    });

    it('should promote Di to Dix', () => {
      const tokens = tokenizePhrase('Di Re');
      const expanded = expandRhythmPhrase(tokens);
      expect(expanded[0].diacritic).toBe('axis');
      expect(expanded[0].raw).toBe('Dix');
    });

    it('should expand Dox shorthand', () => {
      // Shorthand: Dox La -> Dox La Re So
      const tokens = tokenizePhrase('Dox La');
      // For testing, mock Dox manually since tokenizer might not add axis unless token is exactly Dox
      // actually tokenizePhrase will see Dox as Do + x -> axis
      const expanded = expandRhythmPhrase(tokens);

      expect(expanded).toEqual([
        { type: 'glyph', solfege: 'Do', diacritic: 'axis', modifiers: [], raw: 'Dox', octaveOffset: 0 },
        { type: 'glyph', solfege: 'La', diacritic: '', modifiers: [], raw: 'La', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Re', diacritic: '', isImplicit: true, modifiers: [], raw: 'Re', octaveOffset: 0 },
        { type: 'glyph', solfege: 'So', diacritic: '', isImplicit: true, modifiers: [], raw: 'So', octaveOffset: 0 }
      ]);
    });

    it('should return empty array when input is empty', () => {
      expect(expandRhythmPhrase([])).toEqual([]);
    });

    it('should leave unknown sequences intact', () => {
       const tokens = tokenizePhrase('Re Mi');
       const expanded = expandRhythmPhrase(tokens);
       expect(expanded).toEqual(tokens);
    });
  });

  describe('mapTokensToRatios', () => {
    it('should skip non-glyph tokens', () => {
      const tokens = tokenizePhrase('.. -');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' });
      expect(ratios.length).toBe(0);
    });

    it('should map base syllables correctly (Qui/Sep tunings)', () => {
      const config: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' };
      const tokens = tokenizePhrase('Do Ra Re Ri Me Mi Fa Fi So Le La Te Ti Se Si');
      const ratios = mapTokensToRatios(tokens, config);

      const expected = [
        { label: 'Do', num: 1, den: 1 },
        { label: 'Ra', num: 16, den: 15 },
        { label: 'Re', num: 9, den: 8 },
        { label: 'Ri', num: 75, den: 64 },
        { label: 'Me', num: 6, den: 5 },
        { label: 'Mi', num: 5, den: 4 },
        { label: 'Fa', num: 4, den: 3 },
        { label: 'Fi', num: 45, den: 32 },
        { label: 'So', num: 3, den: 2 },
        { label: 'Le', num: 8, den: 5 },
        { label: 'La', num: 5, den: 3 },
        { label: 'Te', num: 7, den: 4 },
        { label: 'Ti', num: 15, den: 8 },
        { label: 'Se', num: 7, den: 4 }, // Se maps to Septimal minor 7th here
        { label: 'Si', num: 15, den: 8 }, // Si maps to Major 7th here
      ];

      expect(ratios.length).toBe(expected.length);
      ratios.forEach((r, i) => {
        expect(r.label).toBe(expected[i].label);
        expect(r.rmult.num).toBeCloseTo(expected[i].num);
        expect(r.rmult.den).toBeCloseTo(expected[i].den);
      });
    });

    it('should map Tri tunings correctly', () => {
      const config: TuningConfig = { thirds: 'Tri', sevenths: 'Tri', tritone: 'Undec' }; // Use Undec for Fi to hit that branch
      const tokens = tokenizePhrase('Me Mi Fi Le La Te Ti');
      const ratios = mapTokensToRatios(tokens, config);

      const expected = [
        { label: 'Me', num: 32, den: 27 },
        { label: 'Mi', num: 81, den: 64 },
        { label: 'Fi', num: 11, den: 8 },
        { label: 'Le', num: 128, den: 81 },
        { label: 'La', num: 27, den: 16 },
        { label: 'Te', num: 16, den: 9 },
        { label: 'Ti', num: 243, den: 128 },
      ];

      expect(ratios.length).toBe(expected.length);
      ratios.forEach((r, i) => {
        expect(r.label).toBe(expected[i].label);
        expect(r.rmult.num).toBeCloseTo(expected[i].num);
        expect(r.rmult.den).toBeCloseTo(expected[i].den);
      });
    });

    it('should map Du tuning correctly for Tritone', () => {
      const config: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Du' };
      const tokens = tokenizePhrase('Fi');
      const ratios = mapTokensToRatios(tokens, config);

      expect(ratios.length).toBe(1);
      expect(ratios[0].rmult.num).toBeCloseTo(Math.SQRT2);
      expect(ratios[0].rmult.den).toBeCloseTo(1);
    });

    it('should handle octave offsets via superscript parsing properly', () => {
      const config: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' };
      // Do^Ra means Do with octave offset +1 (num * 2)
      // Do^Ti means Do with octave offset -1 (den * 2)
      const tokens = tokenizePhrase('Do^Ra Do^Ti');
      const ratios = mapTokensToRatios(tokens, config);

      expect(ratios.length).toBe(2);
      expect(ratios[0].label).toBe('Do^Ra');
      expect(ratios[0].rmult.num).toBeCloseTo(2);
      expect(ratios[0].rmult.den).toBeCloseTo(1);

      expect(ratios[1].label).toBe('Do^Ti');
      expect(ratios[1].rmult.num).toBeCloseTo(1);
      expect(ratios[1].rmult.den).toBeCloseTo(2);
    });

    it('should fallback gracefully for unknown syllable formats', () => {
       const config: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' };
       // valid structure but unknown to the ratio mapper switch
       const tokens = [{ type: 'glyph', solfege: 'Za', raw: 'Za' } as any];
       const ratios = mapTokensToRatios(tokens, config);

       expect(ratios.length).toBe(1);
       expect(ratios[0].rmult.num).toBeCloseTo(1);
       expect(ratios[0].rmult.den).toBeCloseTo(1);
    });
  });
});
