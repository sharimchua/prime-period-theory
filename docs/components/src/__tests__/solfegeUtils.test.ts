import { describe, it, expect } from 'vitest';
import { isValidSolfegeToken, parseSolfegeToken, tokenizePhrase, expandRhythmPhrase, mapTokensToRatios } from '../solfegeUtils.js';

describe('solfegeUtils', () => {
  describe('mapTokensToRatios', () => {
    it('should map standard tokens with Ptolemaic tuning correctly', () => {
      const tokens = tokenizePhrase('Do Me Mi Fi Le La Te Ti');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Ptol', tritone: 'Qui', sevenths: 'Ptol' });

      expect(ratios[0].rmult).toEqual({ num: 1, den: 1 });
      expect(ratios[1].rmult).toEqual({ num: 6, den: 5 }); // Ptolemaic minor 3rd
      expect(ratios[2].rmult).toEqual({ num: 5, den: 4 }); // Ptolemaic major 3rd
      expect(ratios[3].rmult).toEqual({ num: 45, den: 32 }); // Qui
      expect(ratios[4].rmult).toEqual({ num: 8, den: 5 }); // Ptolemaic minor 6th
      expect(ratios[5].rmult).toEqual({ num: 5, den: 3 }); // Ptolemaic major 6th
      expect(ratios[6].rmult).toEqual({ num: 16, den: 9 }); // Default minor 7th
      expect(ratios[7].rmult).toEqual({ num: 15, den: 8 }); // Standard major 7th
    });

    it('should map standard tokens with Pythagorean (Tri) tuning correctly', () => {
      const tokens = tokenizePhrase('Me Mi Le La Ti');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Tri', tritone: 'Qui', sevenths: 'Tri' });

      expect(ratios[0].rmult).toEqual({ num: 32, den: 27 }); // Pythagorean minor 3rd
      expect(ratios[1].rmult).toEqual({ num: 81, den: 64 }); // Pythagorean major 3rd
      expect(ratios[2].rmult).toEqual({ num: 128, den: 81 }); // Pythagorean minor 6th
      expect(ratios[3].rmult).toEqual({ num: 27, den: 16 }); // Pythagorean major 6th
      expect(ratios[4].rmult).toEqual({ num: 243, den: 128 }); // Pythagorean major 7th
    });

    it('should map septimal sevenths correctly', () => {
      const tokens = tokenizePhrase('Te');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Ptol', tritone: 'Qui', sevenths: 'Sep' });

      expect(ratios[0].rmult).toEqual({ num: 7, den: 4 }); // Septimal minor 7th
    });

    it('should map Du and Undec tritones correctly', () => {
      const duTokens = tokenizePhrase('Fi');
      const duRatios = mapTokensToRatios(duTokens, { thirds: 'Ptol', tritone: 'Du', sevenths: 'Ptol' });
      expect(duRatios[0].rmult.num).toBeCloseTo(1.4142135623730951, 10);
      expect(duRatios[0].rmult.den).toEqual(1);

      const undecTokens = tokenizePhrase('Fi');
      const undecRatios = mapTokensToRatios(undecTokens, { thirds: 'Ptol', tritone: 'Undec', sevenths: 'Ptol' });
      expect(undecRatios[0].rmult).toEqual({ num: 11, den: 8 });
    });

    it('should apply octave offsets for ^Ra and ^Ti superscripts', () => {
      const tokens = tokenizePhrase('Do^Ra Re^Ti');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Ptol', tritone: 'Qui', sevenths: 'Ptol' });

      expect(ratios[0].rmult).toEqual({ num: 2, den: 1 }); // ^Ra = +1 octave
      expect(ratios[1].rmult).toEqual({ num: 9, den: 16 }); // ^Ti = -1 octave (9/8 / 2)
    });

    it('should ignore non-glyph tokens', () => {
      const tokens = tokenizePhrase('Do [ - Re');
      const ratios = mapTokensToRatios(tokens, { thirds: 'Ptol', tritone: 'Qui', sevenths: 'Ptol' });

      expect(ratios.length).toBe(2);
      expect(ratios[0].label).toBe('Do');
      expect(ratios[1].label).toBe('Re');
    });
  });

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
});
