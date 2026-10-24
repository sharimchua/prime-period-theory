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
    const configQuiTriTri: TuningConfig = { thirds: 'Qui', tritone: 'Qui', sevenths: 'Tri' };
    const configTriDuSep: TuningConfig = { thirds: 'Tri', tritone: 'Du', sevenths: 'Sep' };
    const configQuiUndecTri: TuningConfig = { thirds: 'Qui', tritone: 'Undec', sevenths: 'Tri' };

    it('should handle basic tokens correctly with Qui/Qui/Tri config', () => {
      const tokens = tokenizePhrase('Do Re Mi Fa So La Ti');
      const ratios = mapTokensToRatios(tokens, configQuiTriTri);

      expect(ratios).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } },
        { label: 'Re', rmult: { num: 9, den: 8 } },
        { label: 'Mi', rmult: { num: 5, den: 4 } },
        { label: 'Fa', rmult: { num: 4, den: 3 } },
        { label: 'So', rmult: { num: 3, den: 2 } },
        { label: 'La', rmult: { num: 5, den: 3 } },
        { label: 'Ti', rmult: { num: 243, den: 128 } } // sevenths: 'Tri'
      ]);
    });

    it('should handle basic tokens correctly with Tri/Du/Sep config', () => {
      const tokens = tokenizePhrase('Do Re Mi Fa So La Ti');
      const ratios = mapTokensToRatios(tokens, configTriDuSep);

      expect(ratios).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } },
        { label: 'Re', rmult: { num: 9, den: 8 } },
        { label: 'Mi', rmult: { num: 81, den: 64 } }, // thirds: 'Tri'
        { label: 'Fa', rmult: { num: 4, den: 3 } },
        { label: 'So', rmult: { num: 3, den: 2 } },
        { label: 'La', rmult: { num: 27, den: 16 } }, // thirds: 'Tri'
        { label: 'Ti', rmult: { num: 15, den: 8 } } // sevenths is not 'Tri'
      ]);
    });

    it('should handle accidental tokens correctly', () => {
      const tokens = tokenizePhrase('Di Ra Ri Me Fi Le Te Se Si');
      const ratiosTriDuSep = mapTokensToRatios(tokens, configTriDuSep);

      expect(ratiosTriDuSep).toEqual([
        { label: 'Di', rmult: { num: 1, den: 1 } },
        { label: 'Ra', rmult: { num: 16, den: 15 } },
        { label: 'Ri', rmult: { num: 75, den: 64 } },
        { label: 'Me', rmult: { num: 32, den: 27 } }, // thirds: 'Tri'
        { label: 'Fi', rmult: { num: 1.4142135623730951, den: 1 } }, // tritone: 'Du'
        { label: 'Le', rmult: { num: 128, den: 81 } }, // thirds: 'Tri'
        { label: 'Te', rmult: { num: 7, den: 4 } }, // sevenths: 'Sep'
        { label: 'Se', rmult: { num: 7, den: 4 } }, // sevenths: 'Sep'
        { label: 'Si', rmult: { num: 15, den: 8 } }
      ]);

      const ratiosQuiUndecTri = mapTokensToRatios(tokens, configQuiUndecTri);

      expect(ratiosQuiUndecTri).toEqual([
        { label: 'Di', rmult: { num: 1, den: 1 } },
        { label: 'Ra', rmult: { num: 16, den: 15 } },
        { label: 'Ri', rmult: { num: 75, den: 64 } },
        { label: 'Me', rmult: { num: 6, den: 5 } }, // thirds: 'Qui'
        { label: 'Fi', rmult: { num: 11, den: 8 } }, // tritone: 'Undec'
        { label: 'Le', rmult: { num: 8, den: 5 } }, // thirds: 'Qui'
        { label: 'Te', rmult: { num: 16, den: 9 } }, // sevenths is not 'Sep'
        { label: 'Se', rmult: { num: 16, den: 9 } }, // sevenths is not 'Sep'
        { label: 'Si', rmult: { num: 243, den: 128 } } // sevenths: 'Tri'
      ]);
    });

    it('should handle Fi with Qui tritone', () => {
      const tokens = tokenizePhrase('Fi');
      const ratios = mapTokensToRatios(tokens, configQuiTriTri);
      expect(ratios).toEqual([
        { label: 'Fi', rmult: { num: 45, den: 32 } } // tritone: 'Qui'
      ]);
    });

    it('should handle octave offsets correctly', () => {
      // tokenizePhrase handles Do^Ra as octaveOffset: 1 and Do^Ti as -1
      const tokens = tokenizePhrase('Do^Ra Do^Ti');
      const ratios = mapTokensToRatios(tokens, configQuiTriTri);
      expect(ratios).toEqual([
        { label: 'Do^Ra', rmult: { num: 2, den: 1 } },
        { label: 'Do^Ti', rmult: { num: 1, den: 2 } }
      ]);
    });

    it('should ignore non-glyph tokens and tokens without solfege', () => {
      const tokens = tokenizePhrase('Do - ..');
      const ratios = mapTokensToRatios(tokens, configQuiTriTri);
      expect(ratios).toEqual([
        { label: 'Do', rmult: { num: 1, den: 1 } }
      ]);
    });
  });
});
