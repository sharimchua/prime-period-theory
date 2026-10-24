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

  describe('mapTokensToRatios', () => {
    const defaultConfig: TuningConfig = {
      thirds: 'Qui',
      sevenths: 'Sep',
      tritone: 'Qui'
    };

    it('should map base tokens accurately', () => {
      const tokens = tokenizePhrase('Do Ra Re Ri Me Mi Fa Fi So Le La Te Ti');
      const ratios = mapTokensToRatios(tokens, defaultConfig);

      // Do
      expect(ratios[0].rmult.num).toBe(1);
      expect(ratios[0].rmult.den).toBe(1);

      // Ra
      expect(ratios[1].rmult.num).toBe(16);
      expect(ratios[1].rmult.den).toBe(15);

      // Re
      expect(ratios[2].rmult.num).toBe(9);
      expect(ratios[2].rmult.den).toBe(8);

      // Ri
      expect(ratios[3].rmult.num).toBe(75);
      expect(ratios[3].rmult.den).toBe(64);

      // Me (Qui)
      expect(ratios[4].rmult.num).toBe(6);
      expect(ratios[4].rmult.den).toBe(5);

      // Mi (Qui)
      expect(ratios[5].rmult.num).toBe(5);
      expect(ratios[5].rmult.den).toBe(4);

      // Fa
      expect(ratios[6].rmult.num).toBe(4);
      expect(ratios[6].rmult.den).toBe(3);

      // Fi (Qui)
      expect(ratios[7].rmult.num).toBe(45);
      expect(ratios[7].rmult.den).toBe(32);

      // So
      expect(ratios[8].rmult.num).toBe(3);
      expect(ratios[8].rmult.den).toBe(2);

      // Le (Qui)
      expect(ratios[9].rmult.num).toBe(8);
      expect(ratios[9].rmult.den).toBe(5);

      // La (Qui)
      expect(ratios[10].rmult.num).toBe(5);
      expect(ratios[10].rmult.den).toBe(3);

      // Te (Sep)
      expect(ratios[11].rmult.num).toBe(7);
      expect(ratios[11].rmult.den).toBe(4);

      // Ti (Qui / Standard)
      expect(ratios[12].rmult.num).toBe(15);
      expect(ratios[12].rmult.den).toBe(8);
    });

    it('should map Pythagorean (Tri) tunings correctly', () => {
      const config: TuningConfig = { thirds: 'Tri', sevenths: 'Tri', tritone: 'Qui' };
      const tokens = tokenizePhrase('Me Mi Le La Te Ti');
      const ratios = mapTokensToRatios(tokens, config);

      // Me
      expect(ratios[0].rmult.num).toBe(32);
      expect(ratios[0].rmult.den).toBe(27);

      // Mi
      expect(ratios[1].rmult.num).toBe(81);
      expect(ratios[1].rmult.den).toBe(64);

      // Le
      expect(ratios[2].rmult.num).toBe(128);
      expect(ratios[2].rmult.den).toBe(81);

      // La
      expect(ratios[3].rmult.num).toBe(27);
      expect(ratios[3].rmult.den).toBe(16);

      // Te
      expect(ratios[4].rmult.num).toBe(16);
      expect(ratios[4].rmult.den).toBe(9);

      // Ti
      expect(ratios[5].rmult.num).toBe(243);
      expect(ratios[5].rmult.den).toBe(128);
    });

    it('should map other tritone (Fi) tunings correctly', () => {
      const configUndec: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Undec' };
      const configDu: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Du' };

      const ratiosUndec = mapTokensToRatios(tokenizePhrase('Fi'), configUndec);
      expect(ratiosUndec[0].rmult.num).toBe(11);
      expect(ratiosUndec[0].rmult.den).toBe(8);

      const ratiosDu = mapTokensToRatios(tokenizePhrase('Fi'), configDu);
      expect(ratiosDu[0].rmult.num).toBeCloseTo(1.4142135623730951);
      expect(ratiosDu[0].rmult.den).toBe(1);
    });

    it('should map aliases Di, Se, Si correctly', () => {
      const tokens = tokenizePhrase('Di Se Si');
      const ratios = mapTokensToRatios(tokens, defaultConfig);

      // Di -> same as Do
      expect(ratios[0].rmult.num).toBe(1);
      expect(ratios[0].rmult.den).toBe(1);

      // Se -> same as Te (Sep)
      expect(ratios[1].rmult.num).toBe(7);
      expect(ratios[1].rmult.den).toBe(4);

      // Si -> same as Ti
      expect(ratios[2].rmult.num).toBe(15);
      expect(ratios[2].rmult.den).toBe(8);
    });

    it('should apply positive octave offsets correctly', () => {
      const tokens = tokenizePhrase('Do^Ra Re^Mi');
      // ^Ra means octave offset +1, ^Mi means octave offset +2 (for testing purposes only offsets 1, -1 etc might be expected based on `parseSolfegeToken`)
      // Wait, let's just create tokens manually to be certain about octave offsets
      const manualTokens = [
        { type: 'glyph', solfege: 'Do', octaveOffset: 1, raw: 'DoUp', diacritic: '', modifiers: [] },
        { type: 'glyph', solfege: 'Do', octaveOffset: 2, raw: 'DoUp2', diacritic: '', modifiers: [] },
      ] as any;
      const ratios = mapTokensToRatios(manualTokens, defaultConfig);
      expect(ratios[0].rmult.num).toBe(2);
      expect(ratios[0].rmult.den).toBe(1);

      expect(ratios[1].rmult.num).toBe(4);
      expect(ratios[1].rmult.den).toBe(1);
    });

    it('should apply negative octave offsets correctly', () => {
      const manualTokens = [
        { type: 'glyph', solfege: 'Do', octaveOffset: -1, raw: 'DoDown', diacritic: '', modifiers: [] },
        { type: 'glyph', solfege: 'Do', octaveOffset: -2, raw: 'DoDown2', diacritic: '', modifiers: [] },
      ] as any;
      const ratios = mapTokensToRatios(manualTokens, defaultConfig);
      expect(ratios[0].rmult.num).toBe(1);
      expect(ratios[0].rmult.den).toBe(2);

      expect(ratios[1].rmult.num).toBe(1);
      expect(ratios[1].rmult.den).toBe(4);
    });

    it('should ignore non-glyph tokens and empty solfege', () => {
      const manualTokens = [
        { type: 'padding', paddingLength: 1 },
        { type: 'hold' },
        { type: 'glyph', solfege: '', raw: 'empty', octaveOffset: 0, diacritic: '', modifiers: [] }
      ] as any;
      const ratios = mapTokensToRatios(manualTokens, defaultConfig);
      expect(ratios).toEqual([]);
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
