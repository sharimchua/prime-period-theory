import { describe, it, expect } from 'vitest';
import { mapTokensToRatios } from '../solfegeUtils';
import type { ParsedToken, TuningConfig } from '../solfegeUtils';

describe('mapTokensToRatios', () => {
  const ptoConfig: TuningConfig = {
    thirds: 'Pto',
    sevenths: 'Pto',
    tritone: 'Qui'
  };

  const triConfig: TuningConfig = {
    thirds: 'Tri',
    sevenths: 'Tri',
    tritone: 'Du'
  };

  const altConfig: TuningConfig = {
    thirds: 'Tri',
    sevenths: 'Sep',
    tritone: 'Undec'
  };

  it('should map Do correctly', () => {
    const tokens: ParsedToken[] = [{ type: 'glyph', solfege: 'Do', raw: 'Do' }];
    const result = mapTokensToRatios(tokens, ptoConfig);
    expect(result).toHaveLength(1);
    expect(result[0].rmult).toEqual({ num: 1, den: 1 });
  });

  it('should map basic syllables', () => {
    const syllables = ['Di', 'Ra', 'Re', 'Ri', 'Fa', 'So'];
    const expected = [
      { num: 1, den: 1 },
      { num: 16, den: 15 },
      { num: 9, den: 8 },
      { num: 75, den: 64 },
      { num: 4, den: 3 },
      { num: 3, den: 2 }
    ];

    const tokens = syllables.map(s => ({ type: 'glyph', solfege: s, raw: s } as ParsedToken));
    const result = mapTokensToRatios(tokens, ptoConfig);

    result.forEach((r, i) => {
      expect(r.rmult).toEqual(expected[i]);
    });
  });

  it('should map thirds depending on config', () => {
    const syllables = ['Me', 'Mi'];
    const tokens = syllables.map(s => ({ type: 'glyph', solfege: s, raw: s } as ParsedToken));

    const ptoResult = mapTokensToRatios(tokens, ptoConfig);
    expect(ptoResult[0].rmult).toEqual({ num: 6, den: 5 });
    expect(ptoResult[1].rmult).toEqual({ num: 5, den: 4 });

    const triResult = mapTokensToRatios(tokens, triConfig);
    expect(triResult[0].rmult).toEqual({ num: 32, den: 27 });
    expect(triResult[1].rmult).toEqual({ num: 81, den: 64 });
  });

  it('should map sixths depending on config', () => {
    const syllables = ['Le', 'La'];
    const tokens = syllables.map(s => ({ type: 'glyph', solfege: s, raw: s } as ParsedToken));

    const ptoResult = mapTokensToRatios(tokens, ptoConfig);
    expect(ptoResult[0].rmult).toEqual({ num: 8, den: 5 });
    expect(ptoResult[1].rmult).toEqual({ num: 5, den: 3 });

    const triResult = mapTokensToRatios(tokens, triConfig);
    expect(triResult[0].rmult).toEqual({ num: 128, den: 81 });
    expect(triResult[1].rmult).toEqual({ num: 27, den: 16 });
  });

  it('should map sevenths depending on config', () => {
    const syllables = ['Te', 'Se', 'Ti', 'Si'];
    const tokens = syllables.map(s => ({ type: 'glyph', solfege: s, raw: s } as ParsedToken));

    const ptoResult = mapTokensToRatios(tokens, ptoConfig);
    expect(ptoResult[0].rmult).toEqual({ num: 16, den: 9 });
    expect(ptoResult[1].rmult).toEqual({ num: 16, den: 9 });
    expect(ptoResult[2].rmult).toEqual({ num: 15, den: 8 });
    expect(ptoResult[3].rmult).toEqual({ num: 15, den: 8 });

    const triResult = mapTokensToRatios(tokens, triConfig);
    expect(triResult[0].rmult).toEqual({ num: 16, den: 9 });
    expect(triResult[1].rmult).toEqual({ num: 16, den: 9 });
    expect(triResult[2].rmult).toEqual({ num: 243, den: 128 });
    expect(triResult[3].rmult).toEqual({ num: 243, den: 128 });

    const altResult = mapTokensToRatios(tokens, altConfig);
    expect(altResult[0].rmult).toEqual({ num: 7, den: 4 });
  });

  it('should map tritone depending on config', () => {
    const tokens = [{ type: 'glyph', solfege: 'Fi', raw: 'Fi' } as ParsedToken];

    const ptoResult = mapTokensToRatios(tokens, ptoConfig);
    expect(ptoResult[0].rmult).toEqual({ num: 45, den: 32 });

    const triResult = mapTokensToRatios(tokens, triConfig);
    expect(triResult[0].rmult).toEqual({ num: 1.4142135623730951, den: 1 });

    const altResult = mapTokensToRatios(tokens, altConfig);
    expect(altResult[0].rmult).toEqual({ num: 11, den: 8 });
  });

  it('should handle octave offsets correctly', () => {
    const tokens = [
      { type: 'glyph', solfege: 'Do', raw: 'Do^', octaveOffset: 1 },
      { type: 'glyph', solfege: 'Do', raw: 'Do_', octaveOffset: -1 },
      { type: 'glyph', solfege: 'Do', raw: 'Do^^', octaveOffset: 2 },
    ] as ParsedToken[];

    const result = mapTokensToRatios(tokens, ptoConfig);
    expect(result[0].rmult).toEqual({ num: 2, den: 1 });
    expect(result[1].rmult).toEqual({ num: 1, den: 2 });
    expect(result[2].rmult).toEqual({ num: 4, den: 1 });
  });

  it('should skip non-glyph tokens', () => {
    const tokens = [{ type: 'rhythm', duration: 1 }] as ParsedToken[];
    const result = mapTokensToRatios(tokens, ptoConfig);
    expect(result).toHaveLength(0);
  });
});
