import { describe, it, expect } from 'vitest';
import { mapTokensToRatios, TuningConfig, ParsedToken } from '../solfegeUtils.js';

describe('mapTokensToRatios', () => {
  const defaultConfig: TuningConfig = {
    thirds: 'Qui',
    sevenths: 'Sep',
    tritone: 'Qui'
  };

  it('should handle Do and Di as origin', () => {
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Do' },
      { type: 'glyph', solfege: 'Di', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Di' }
    ];
    const ratios = mapTokensToRatios(tokens, defaultConfig);
    expect(ratios).toEqual([
      { label: 'Do', rmult: { num: 1, den: 1 } },
      { label: 'Di', rmult: { num: 1, den: 1 } }
    ]);
  });

  it('should apply Pythagorean thirds when configured', () => {
    const triConfig: TuningConfig = { thirds: 'Tri', sevenths: 'Sep', tritone: 'Qui' };
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Me', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Me' },
      { type: 'glyph', solfege: 'Mi', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Mi' },
      { type: 'glyph', solfege: 'Le', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Le' },
      { type: 'glyph', solfege: 'La', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'La' }
    ];
    const ratios = mapTokensToRatios(tokens, triConfig);
    expect(ratios).toEqual([
      { label: 'Me', rmult: { num: 32, den: 27 } },
      { label: 'Mi', rmult: { num: 81, den: 64 } },
      { label: 'Le', rmult: { num: 128, den: 81 } },
      { label: 'La', rmult: { num: 27, den: 16 } }
    ]);
  });

  it('should apply Ptolemaic thirds when configured as Qui', () => {
    const quiConfig: TuningConfig = { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' };
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Me', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Me' },
      { type: 'glyph', solfege: 'Mi', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Mi' },
      { type: 'glyph', solfege: 'Le', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Le' },
      { type: 'glyph', solfege: 'La', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'La' }
    ];
    const ratios = mapTokensToRatios(tokens, quiConfig);
    expect(ratios).toEqual([
      { label: 'Me', rmult: { num: 6, den: 5 } },
      { label: 'Mi', rmult: { num: 5, den: 4 } },
      { label: 'Le', rmult: { num: 8, den: 5 } },
      { label: 'La', rmult: { num: 5, den: 3 } }
    ]);
  });

  it('should apply correct tritone when configured', () => {
    const tokens: ParsedToken[] = [{ type: 'glyph', solfege: 'Fi', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Fi' }];

    let ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Du' });
    expect(ratios[0].rmult.num).toBeCloseTo(1.4142135623730951);
    expect(ratios[0].rmult.den).toBe(1);

    ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Undec' });
    expect(ratios[0].rmult).toEqual({ num: 11, den: 8 });

    ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' });
    expect(ratios[0].rmult).toEqual({ num: 45, den: 32 });
  });

  it('should apply correct sevenths when configured', () => {
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Te', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Te' },
      { type: 'glyph', solfege: 'Ti', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Ti' },
      { type: 'glyph', solfege: 'Se', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Se' },
      { type: 'glyph', solfege: 'Si', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Si' },
    ];

    // Sep
    let ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' });
    expect(ratios[0].rmult).toEqual({ num: 7, den: 4 }); // Te
    expect(ratios[1].rmult).toEqual({ num: 15, den: 8 }); // Ti
    expect(ratios[2].rmult).toEqual({ num: 7, den: 4 }); // Se
    expect(ratios[3].rmult).toEqual({ num: 15, den: 8 }); // Si

    // Tri
    ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Tri', tritone: 'Qui' });
    expect(ratios[0].rmult).toEqual({ num: 16, den: 9 }); // Te
    expect(ratios[1].rmult).toEqual({ num: 243, den: 128 }); // Ti
    expect(ratios[2].rmult).toEqual({ num: 16, den: 9 }); // Se
    expect(ratios[3].rmult).toEqual({ num: 243, den: 128 }); // Si
  });

  it('should handle minor and major 2nds, 4ths, 5ths, aug 2nds', () => {
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Ra', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Ra' },
      { type: 'glyph', solfege: 'Re', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Re' },
      { type: 'glyph', solfege: 'Ri', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Ri' },
      { type: 'glyph', solfege: 'Fa', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Fa' },
      { type: 'glyph', solfege: 'So', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'So' },
    ];
    const ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' });
    expect(ratios[0].rmult).toEqual({ num: 16, den: 15 });
    expect(ratios[1].rmult).toEqual({ num: 9, den: 8 });
    expect(ratios[2].rmult).toEqual({ num: 75, den: 64 });
    expect(ratios[3].rmult).toEqual({ num: 4, den: 3 });
    expect(ratios[4].rmult).toEqual({ num: 3, den: 2 });
  });

  it('should apply octave offsets correctly', () => {
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], octaveOffset: 1, raw: 'Do^Ra' },
      { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], octaveOffset: -1, raw: 'Do^Ti' },
      { type: 'glyph', solfege: 'So', diacritic: '', modifiers: [], octaveOffset: 2, raw: 'So+2' },
      { type: 'glyph', solfege: 'Fa', diacritic: '', modifiers: [], octaveOffset: -2, raw: 'Fa-2' },
    ];
    const ratios = mapTokensToRatios(tokens, { thirds: 'Qui', sevenths: 'Sep', tritone: 'Qui' });

    // Do^Ra (octaveOffset 1) -> 1/1 * 2 = 2/1
    expect(ratios[0].rmult).toEqual({ num: 2, den: 1 });

    // Do^Ti (octaveOffset -1) -> 1/1 * (1/2) = 1/2
    expect(ratios[1].rmult).toEqual({ num: 1, den: 2 });

    // So+2 (octaveOffset 2) -> 3/2 * 4 = 12/2
    expect(ratios[2].rmult).toEqual({ num: 12, den: 2 });

    // Fa-2 (octaveOffset -2) -> 4/3 * (1/4) = 4/12
    expect(ratios[3].rmult).toEqual({ num: 4, den: 12 });
  });

  it('should ignore non-glyph tokens', () => {
    const tokens: ParsedToken[] = [
      { type: 'hold' },
      { type: 'padding', paddingLength: 1 },
      { type: 'glyph', solfege: 'Do', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'Do' }
    ];
    const ratios = mapTokensToRatios(tokens, defaultConfig);
    expect(ratios).toEqual([
      { label: 'Do', rmult: { num: 1, den: 1 } }
    ]);
  });

  it('should ignore glyph tokens without solfege', () => {
    const tokens: ParsedToken[] = [
      { type: 'glyph', diacritic: '', modifiers: [], octaveOffset: 0, raw: 'X', solfege: '' }
    ];
    const ratios = mapTokensToRatios(tokens, defaultConfig);
    expect(ratios).toEqual([]);
  });
});
