import { describe, it, expect } from 'vitest';
import { isValidSolfegeToken, parseSolfegeToken, tokenizePhrase, expandRhythmPhrase, mapTokensToRatios, TuningConfig, ParsedToken } from '../solfegeUtils.js';

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
    const defaultConfig: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' };

    it('should map origin notes correctly', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Do', raw: 'Do' },
        { type: 'glyph', solfege: 'Di', raw: 'Di' }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } },
        { label: 'Di', rmult: { num: 1, den: 1 } }
      ]);
    });

    it('should map minor/major 2nd and augmented 2nd correctly', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Ra', raw: 'Ra' },
        { type: 'glyph', solfege: 'Re', raw: 'Re' },
        { type: 'glyph', solfege: 'Ri', raw: 'Ri' }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'Ra', rmult: { num: 16, den: 15 } },
        { label: 'Re', rmult: { num: 9, den: 8 } },
        { label: 'Ri', rmult: { num: 75, den: 64 } }
      ]);
    });

    it('should map 3rds and 6ths depending on thirds configuration', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Me', raw: 'Me' },
        { type: 'glyph', solfege: 'Mi', raw: 'Mi' },
        { type: 'glyph', solfege: 'Le', raw: 'Le' },
        { type: 'glyph', solfege: 'La', raw: 'La' }
      ];

      const triResult = mapTokensToRatios(tokens, { ...defaultConfig, thirds: 'Tri' });
      expect(triResult).toEqual([
        { label: 'Me', rmult: { num: 32, den: 27 } },
        { label: 'Mi', rmult: { num: 81, den: 64 } },
        { label: 'Le', rmult: { num: 128, den: 81 } },
        { label: 'La', rmult: { num: 27, den: 16 } }
      ]);

      const quiResult = mapTokensToRatios(tokens, { ...defaultConfig, thirds: 'Qui' });
      expect(quiResult).toEqual([
        { label: 'Me', rmult: { num: 6, den: 5 } },
        { label: 'Mi', rmult: { num: 5, den: 4 } },
        { label: 'Le', rmult: { num: 8, den: 5 } },
        { label: 'La', rmult: { num: 5, den: 3 } }
      ]);
    });

    it('should map 4th and 5th correctly', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Fa', raw: 'Fa' },
        { type: 'glyph', solfege: 'So', raw: 'So' }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'Fa', rmult: { num: 4, den: 3 } },
        { label: 'So', rmult: { num: 3, den: 2 } }
      ]);
    });

    it('should map tritone (Fi) depending on tritone configuration', () => {
      const tokens: ParsedToken[] = [{ type: 'glyph', solfege: 'Fi', raw: 'Fi' }];

      const quiResult = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Qui' });
      expect(quiResult).toEqual([{ label: 'Fi', rmult: { num: 45, den: 32 } }]);

      const undecResult = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Undec' });
      expect(undecResult).toEqual([{ label: 'Fi', rmult: { num: 11, den: 8 } }]);

      const duResult = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Du' });
      expect(duResult).toEqual([{ label: 'Fi', rmult: { num: 1.4142135623730951, den: 1 } }]);
    });

    it('should map 7ths depending on sevenths configuration', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Te', raw: 'Te' },
        { type: 'glyph', solfege: 'Se', raw: 'Se' },
        { type: 'glyph', solfege: 'Ti', raw: 'Ti' },
        { type: 'glyph', solfege: 'Si', raw: 'Si' }
      ];

      const sepResult = mapTokensToRatios(tokens, { ...defaultConfig, sevenths: 'Sep' });
      expect(sepResult).toEqual([
        { label: 'Te', rmult: { num: 7, den: 4 } },
        { label: 'Se', rmult: { num: 7, den: 4 } },
        { label: 'Ti', rmult: { num: 15, den: 8 } },
        { label: 'Si', rmult: { num: 15, den: 8 } }
      ]);

      const triResult = mapTokensToRatios(tokens, { ...defaultConfig, sevenths: 'Tri' });
      expect(triResult).toEqual([
        { label: 'Te', rmult: { num: 16, den: 9 } },
        { label: 'Se', rmult: { num: 16, den: 9 } },
        { label: 'Ti', rmult: { num: 243, den: 128 } },
        { label: 'Si', rmult: { num: 243, den: 128 } }
      ]);
    });

    it('should apply octave offsets', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Do', raw: 'Do^Ra', octaveOffset: 1 },
        { type: 'glyph', solfege: 'Do', raw: 'Do^Ti', octaveOffset: -1 },
        { type: 'glyph', solfege: 'Do', raw: 'Do^Ra^Ra', octaveOffset: 2 },
        { type: 'glyph', solfege: 'Do', raw: 'Do^Ti^Ti', octaveOffset: -2 }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'Do^Ra', rmult: { num: 2, den: 1 } },
        { label: 'Do^Ti', rmult: { num: 1, den: 2 } },
        { label: 'Do^Ra^Ra', rmult: { num: 4, den: 1 } },
        { label: 'Do^Ti^Ti', rmult: { num: 1, den: 4 } }
      ]);
    });

    it('should apply octave offsets to non-origin notes', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'So', raw: 'So^Ra', octaveOffset: 1 },
        { type: 'glyph', solfege: 'Fa', raw: 'Fa^Ti', octaveOffset: -1 }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'So^Ra', rmult: { num: 6, den: 2 } },
        { label: 'Fa^Ti', rmult: { num: 4, den: 6 } }
      ]);
    });

    it('should ignore non-glyph tokens and tokens without solfege', () => {
      const tokens: ParsedToken[] = [
        { type: 'padding', paddingLength: 2 },
        { type: 'hold' },
        { type: 'glyph', solfege: undefined, raw: '???' },
        { type: 'glyph', solfege: 'Do', raw: 'Do' }
      ];
      const result = mapTokensToRatios(tokens, defaultConfig);
      expect(result).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } }
      ]);
    });
  });
});
