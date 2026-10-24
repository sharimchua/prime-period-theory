import { describe, it, expect } from 'vitest';
import { isValidSolfegeToken, parseSolfegeToken, tokenizePhrase, expandRhythmPhrase, mapTokensToRatios } from '../solfegeUtils.js';

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
    const defaultConfig = {
      thirds: 'Pto',
      sevenths: 'Pto',
      tritone: 'Qui'
    } as any;

    it('should map base tokens correctly', () => {
      const tokens: any[] = [
        { type: 'glyph', solfege: 'Do', raw: 'Do' },
        { type: 'glyph', solfege: 'Ra', raw: 'Ra' },
        { type: 'glyph', solfege: 'Re', raw: 'Re' },
        { type: 'glyph', solfege: 'Me', raw: 'Me' },
        { type: 'glyph', solfege: 'Mi', raw: 'Mi' },
        { type: 'glyph', solfege: 'Fa', raw: 'Fa' },
        { type: 'glyph', solfege: 'Fi', raw: 'Fi' },
        { type: 'glyph', solfege: 'So', raw: 'So' },
        { type: 'glyph', solfege: 'Le', raw: 'Le' },
        { type: 'glyph', solfege: 'La', raw: 'La' },
        { type: 'glyph', solfege: 'Te', raw: 'Te' },
        { type: 'glyph', solfege: 'Ti', raw: 'Ti' },
        { type: 'padding', paddingLength: 1 } // Ignored
      ];

      const mapped = mapTokensToRatios(tokens, defaultConfig);

      expect(mapped).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } },
        { label: 'Ra', rmult: { num: 16, den: 15 } },
        { label: 'Re', rmult: { num: 9, den: 8 } },
        { label: 'Me', rmult: { num: 6, den: 5 } },
        { label: 'Mi', rmult: { num: 5, den: 4 } },
        { label: 'Fa', rmult: { num: 4, den: 3 } },
        { label: 'Fi', rmult: { num: 45, den: 32 } }, // Qui by default
        { label: 'So', rmult: { num: 3, den: 2 } },
        { label: 'Le', rmult: { num: 8, den: 5 } },
        { label: 'La', rmult: { num: 5, den: 3 } },
        { label: 'Te', rmult: { num: 16, den: 9 } },
        { label: 'Ti', rmult: { num: 15, den: 8 } },
      ]);
    });

    it('should apply Pythagorean tuning (Tri) when configured', () => {
      const pythagoreanConfig = {
        thirds: 'Tri',
        sevenths: 'Tri',
        tritone: 'Qui'
      } as any;

      const tokens: any[] = [
        { type: 'glyph', solfege: 'Me', raw: 'Me' },
        { type: 'glyph', solfege: 'Mi', raw: 'Mi' },
        { type: 'glyph', solfege: 'Le', raw: 'Le' },
        { type: 'glyph', solfege: 'La', raw: 'La' },
        { type: 'glyph', solfege: 'Te', raw: 'Te' },
        { type: 'glyph', solfege: 'Ti', raw: 'Ti' },
      ];

      const mapped = mapTokensToRatios(tokens, pythagoreanConfig);

      expect(mapped).toEqual([
        { label: 'Me', rmult: { num: 32, den: 27 } },
        { label: 'Mi', rmult: { num: 81, den: 64 } },
        { label: 'Le', rmult: { num: 128, den: 81 } },
        { label: 'La', rmult: { num: 27, den: 16 } },
        { label: 'Te', rmult: { num: 16, den: 9 } },
        { label: 'Ti', rmult: { num: 243, den: 128 } },
      ]);
    });

    it('should apply Septimal minor 7th when configured', () => {
      const config = {
        thirds: 'Pto',
        sevenths: 'Sep',
        tritone: 'Qui'
      } as any;
      const tokens: any[] = [{ type: 'glyph', solfege: 'Te', raw: 'Te' }];
      expect(mapTokensToRatios(tokens, config)[0].rmult).toEqual({ num: 7, den: 4 });
    });

    it('should handle alternative spellings like Se and Si', () => {
       const mapped = mapTokensToRatios([
         { type: 'glyph', solfege: 'Se', raw: 'Se' },
         { type: 'glyph', solfege: 'Si', raw: 'Si' },
         { type: 'glyph', solfege: 'Di', raw: 'Di' },
         { type: 'glyph', solfege: 'Ri', raw: 'Ri' }
       ], defaultConfig);

       expect(mapped).toEqual([
         { label: 'Se', rmult: { num: 16, den: 9 } },
         { label: 'Si', rmult: { num: 15, den: 8 } },
         { label: 'Di', rmult: { num: 1, den: 1 } },
         { label: 'Ri', rmult: { num: 75, den: 64 } },
       ]);
    });

    it('should apply Du and Undecimal tritone tuning', () => {
       let mapped = mapTokensToRatios([{ type: 'glyph', solfege: 'Fi', raw: 'Fi' }], { ...defaultConfig, tritone: 'Du' });
       expect(mapped[0].rmult).toEqual({ num: Math.SQRT2, den: 1 });

       mapped = mapTokensToRatios([{ type: 'glyph', solfege: 'Fi', raw: 'Fi' }], { ...defaultConfig, tritone: 'Undec' });
       expect(mapped[0].rmult).toEqual({ num: 11, den: 8 });
    });

    it('should apply positive and negative octave offsets', () => {
       const tokens: any[] = [
         { type: 'glyph', solfege: 'Do', raw: 'DoSup', octaveOffset: 1 },
         { type: 'glyph', solfege: 'So', raw: 'SoSub', octaveOffset: -1 },
         { type: 'glyph', solfege: 'Mi', raw: 'MiSup2', octaveOffset: 2 },
       ];

       const mapped = mapTokensToRatios(tokens, defaultConfig);

       expect(mapped).toEqual([
         { label: 'DoSup', rmult: { num: 2, den: 1 } }, // 1/1 * 2 = 2/1
         { label: 'SoSub', rmult: { num: 3, den: 4 } }, // 3/2 / 2 = 3/4
         { label: 'MiSup2', rmult: { num: 20, den: 4 } }, // 5/4 * 4 = 20/4 = 5
       ]);
    });
  });

});
