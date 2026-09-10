import { describe, it, expect } from 'vitest';
import { isValidSolfegeToken, parseSolfegeToken, tokenizePhrase, expandRhythmPhrase, mapTokensToRatios } from '../solfegeUtils.js';
import type { ParsedToken } from '../solfegeUtils.js';

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
    const defaultConfig = { thirds: 'Pto', tritone: 'Qui', sevenths: 'Pto' };

    it('should return empty array for empty tokens', () => {
      expect(mapTokensToRatios([], defaultConfig)).toEqual([]);
    });

    it('should ignore non-glyph tokens', () => {
      const tokens: ParsedToken[] = [
        { type: 'hold' },
        { type: 'padding', paddingLength: 1 }
      ];
      expect(mapTokensToRatios(tokens, defaultConfig)).toEqual([]);
    });

    it('should correctly map standard solfege syllables with default tunings', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Do', raw: 'Do', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Ra', raw: 'Ra', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Re', raw: 'Re', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Me', raw: 'Me', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Mi', raw: 'Mi', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Fa', raw: 'Fa', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'So', raw: 'So', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Le', raw: 'Le', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'La', raw: 'La', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Te', raw: 'Te', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Ti', raw: 'Ti', modifiers: [], diacritic: '', octaveOffset: 0 }
      ];

      const ratios = mapTokensToRatios(tokens, defaultConfig);
      expect(ratios).toHaveLength(11);

      // Do
      expect(ratios[0].rmult.num).toBeCloseTo(1);
      expect(ratios[0].rmult.den).toBeCloseTo(1);
      // Ra
      expect(ratios[1].rmult.num).toBeCloseTo(16);
      expect(ratios[1].rmult.den).toBeCloseTo(15);
      // Re
      expect(ratios[2].rmult.num).toBeCloseTo(9);
      expect(ratios[2].rmult.den).toBeCloseTo(8);
      // Me (Ptolemaic default)
      expect(ratios[3].rmult.num).toBeCloseTo(6);
      expect(ratios[3].rmult.den).toBeCloseTo(5);
      // Mi (Ptolemaic default)
      expect(ratios[4].rmult.num).toBeCloseTo(5);
      expect(ratios[4].rmult.den).toBeCloseTo(4);
      // Fa
      expect(ratios[5].rmult.num).toBeCloseTo(4);
      expect(ratios[5].rmult.den).toBeCloseTo(3);
      // So
      expect(ratios[6].rmult.num).toBeCloseTo(3);
      expect(ratios[6].rmult.den).toBeCloseTo(2);
      // Le (Ptolemaic default)
      expect(ratios[7].rmult.num).toBeCloseTo(8);
      expect(ratios[7].rmult.den).toBeCloseTo(5);
      // La (Ptolemaic default)
      expect(ratios[8].rmult.num).toBeCloseTo(5);
      expect(ratios[8].rmult.den).toBeCloseTo(3);
      // Te (Pythagorean default, as Tri fallback per the code)
      expect(ratios[9].rmult.num).toBeCloseTo(16);
      expect(ratios[9].rmult.den).toBeCloseTo(9);
      // Ti (Ptolemaic default)
      expect(ratios[10].rmult.num).toBeCloseTo(15);
      expect(ratios[10].rmult.den).toBeCloseTo(8);
    });

    it('should handle tritone variants (Fi)', () => {
      const tokens: ParsedToken[] = [{ type: 'glyph', solfege: 'Fi', raw: 'Fi', modifiers: [], diacritic: '', octaveOffset: 0 }];

      // Qui
      let ratios = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Qui' });
      expect(ratios[0].rmult.num).toBeCloseTo(45);
      expect(ratios[0].rmult.den).toBeCloseTo(32);

      // Du
      ratios = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Du' });
      expect(ratios[0].rmult.num).toBeCloseTo(1.4142135623730951);
      expect(ratios[0].rmult.den).toBeCloseTo(1);

      // Undec
      ratios = mapTokensToRatios(tokens, { ...defaultConfig, tritone: 'Undec' });
      expect(ratios[0].rmult.num).toBeCloseTo(11);
      expect(ratios[0].rmult.den).toBeCloseTo(8);
    });

    it('should handle Pythagorean thirds (Tri)', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Me', raw: 'Me', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Mi', raw: 'Mi', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Le', raw: 'Le', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'La', raw: 'La', modifiers: [], diacritic: '', octaveOffset: 0 }
      ];

      const ratios = mapTokensToRatios(tokens, { ...defaultConfig, thirds: 'Tri' });

      // Me
      expect(ratios[0].rmult.num).toBeCloseTo(32);
      expect(ratios[0].rmult.den).toBeCloseTo(27);
      // Mi
      expect(ratios[1].rmult.num).toBeCloseTo(81);
      expect(ratios[1].rmult.den).toBeCloseTo(64);
      // Le
      expect(ratios[2].rmult.num).toBeCloseTo(128);
      expect(ratios[2].rmult.den).toBeCloseTo(81);
      // La
      expect(ratios[3].rmult.num).toBeCloseTo(27);
      expect(ratios[3].rmult.den).toBeCloseTo(16);
    });

    it('should handle sevenths variants (Sep, Tri)', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Te', raw: 'Te', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Ti', raw: 'Ti', modifiers: [], diacritic: '', octaveOffset: 0 }
      ];

      // Sep (Te is 7/4, Ti is default 15/8 since only Te/Se checks for 'Sep')
      let ratios = mapTokensToRatios(tokens, { ...defaultConfig, sevenths: 'Sep' });
      expect(ratios[0].rmult.num).toBeCloseTo(7);
      expect(ratios[0].rmult.den).toBeCloseTo(4);
      expect(ratios[1].rmult.num).toBeCloseTo(15);
      expect(ratios[1].rmult.den).toBeCloseTo(8);

      // Tri (Te is default 16/9, Ti is 243/128)
      ratios = mapTokensToRatios(tokens, { ...defaultConfig, sevenths: 'Tri' });
      expect(ratios[0].rmult.num).toBeCloseTo(16);
      expect(ratios[0].rmult.den).toBeCloseTo(9);
      expect(ratios[1].rmult.num).toBeCloseTo(243);
      expect(ratios[1].rmult.den).toBeCloseTo(128);
    });

    it('should handle Di, Ri, Se, Si', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Di', raw: 'Di', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Ri', raw: 'Ri', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Se', raw: 'Se', modifiers: [], diacritic: '', octaveOffset: 0 },
        { type: 'glyph', solfege: 'Si', raw: 'Si', modifiers: [], diacritic: '', octaveOffset: 0 }
      ];

      const ratios = mapTokensToRatios(tokens, defaultConfig);

      // Di
      expect(ratios[0].rmult.num).toBeCloseTo(1);
      expect(ratios[0].rmult.den).toBeCloseTo(1);
      // Ri
      expect(ratios[1].rmult.num).toBeCloseTo(75);
      expect(ratios[1].rmult.den).toBeCloseTo(64);
      // Se (acts like Te)
      expect(ratios[2].rmult.num).toBeCloseTo(16);
      expect(ratios[2].rmult.den).toBeCloseTo(9);
      // Si (acts like Ti)
      expect(ratios[3].rmult.num).toBeCloseTo(15);
      expect(ratios[3].rmult.den).toBeCloseTo(8);
    });

    it('should handle octave offsets (positive and negative)', () => {
      const tokens: ParsedToken[] = [
        { type: 'glyph', solfege: 'Do', raw: 'Do^Ra', modifiers: [], diacritic: '', octaveOffset: 1 },
        { type: 'glyph', solfege: 'So', raw: 'So^Ti', modifiers: [], diacritic: '', octaveOffset: -1 },
        { type: 'glyph', solfege: 'Fa', raw: 'Fa^^Me', modifiers: [], diacritic: '', octaveOffset: 2 }
      ];

      const ratios = mapTokensToRatios(tokens, defaultConfig);

      // Do (+1 octave -> num * 2)
      expect(ratios[0].rmult.num).toBeCloseTo(2);
      expect(ratios[0].rmult.den).toBeCloseTo(1);

      // So (-1 octave -> den * 2)
      expect(ratios[1].rmult.num).toBeCloseTo(3);
      expect(ratios[1].rmult.den).toBeCloseTo(4);

      // Fa (+2 octave -> num * 4)
      expect(ratios[2].rmult.num).toBeCloseTo(16); // 4 * 4
      expect(ratios[2].rmult.den).toBeCloseTo(3);
    });
  });
});
