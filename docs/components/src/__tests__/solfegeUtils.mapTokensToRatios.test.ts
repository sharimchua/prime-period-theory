import { describe, it, expect } from 'vitest';
import { mapTokensToRatios } from '../solfegeUtils.js';

describe('solfegeUtils.mapTokensToRatios', () => {
  it('should map origin', () => {
    const tokens = [{ type: 'glyph', solfege: 'Do' as any, raw: 'Do' }];
    const res = mapTokensToRatios(tokens, {});
    expect(res.length).toBe(1);
    expect(res[0].rmult.num).toBe(1);
    expect(res[0].rmult.den).toBe(1);
  });

  it('should map base intervals with default tuning', () => {
    const tokens = [
      { type: 'glyph', solfege: 'Ra' as any, raw: 'Ra' },
      { type: 'glyph', solfege: 'Re' as any, raw: 'Re' },
      { type: 'glyph', solfege: 'Ri' as any, raw: 'Ri' },
      { type: 'glyph', solfege: 'Me' as any, raw: 'Me' },
      { type: 'glyph', solfege: 'Mi' as any, raw: 'Mi' },
      { type: 'glyph', solfege: 'Fa' as any, raw: 'Fa' },
      { type: 'glyph', solfege: 'Fi' as any, raw: 'Fi' },
      { type: 'glyph', solfege: 'So' as any, raw: 'So' },
      { type: 'glyph', solfege: 'Le' as any, raw: 'Le' },
      { type: 'glyph', solfege: 'La' as any, raw: 'La' },
      { type: 'glyph', solfege: 'Te' as any, raw: 'Te' },
      { type: 'glyph', solfege: 'Ti' as any, raw: 'Ti' }
    ];
    const res = mapTokensToRatios(tokens, {});
    expect(res[0].rmult).toEqual({ num: 16, den: 15 }); // Ra
    expect(res[1].rmult).toEqual({ num: 9, den: 8 });   // Re
    expect(res[2].rmult).toEqual({ num: 75, den: 64 });  // Ri
    expect(res[3].rmult).toEqual({ num: 6, den: 5 });   // Me (default Ptolemaic)
    expect(res[4].rmult).toEqual({ num: 5, den: 4 });   // Mi (default Ptolemaic)
    expect(res[5].rmult).toEqual({ num: 4, den: 3 });   // Fa
    expect(res[6].rmult).toEqual({ num: 45, den: 32 });  // Fi (default Qui)
    expect(res[7].rmult).toEqual({ num: 3, den: 2 });   // So
    expect(res[8].rmult).toEqual({ num: 8, den: 5 });   // Le (default Ptolemaic)
    expect(res[9].rmult).toEqual({ num: 5, den: 3 });   // La (default Ptolemaic)
    expect(res[10].rmult).toEqual({ num: 16, den: 9 }); // Te (default Tri)
    expect(res[11].rmult).toEqual({ num: 15, den: 8 }); // Ti (default 15/8)
  });

  it('should apply Du and Undec configurations for tritone', () => {
    const tokens = [{ type: 'glyph', solfege: 'Fi' as any, raw: 'Fi' }];
    let res = mapTokensToRatios(tokens, { tritone: 'Du' });
    expect(res[0].rmult.num).toBeCloseTo(1.4142135623730951);
    expect(res[0].rmult.den).toBe(1);

    res = mapTokensToRatios(tokens, { tritone: 'Undec' });
    expect(res[0].rmult).toEqual({ num: 11, den: 8 });
  });

  it('should apply Tri configuration for thirds and sixths', () => {
    const tokens = [
      { type: 'glyph', solfege: 'Me' as any, raw: 'Me' },
      { type: 'glyph', solfege: 'Mi' as any, raw: 'Mi' },
      { type: 'glyph', solfege: 'Le' as any, raw: 'Le' },
      { type: 'glyph', solfege: 'La' as any, raw: 'La' }
    ];
    const res = mapTokensToRatios(tokens, { thirds: 'Tri' });
    expect(res[0].rmult).toEqual({ num: 32, den: 27 });
    expect(res[1].rmult).toEqual({ num: 81, den: 64 });
    expect(res[2].rmult).toEqual({ num: 128, den: 81 });
    expect(res[3].rmult).toEqual({ num: 27, den: 16 });
  });

  it('should apply Sep and Tri configuration for sevenths', () => {
    const tokensTe = [{ type: 'glyph', solfege: 'Te' as any, raw: 'Te' }];
    const resTe = mapTokensToRatios(tokensTe, { sevenths: 'Sep' });
    expect(resTe[0].rmult).toEqual({ num: 7, den: 4 });

    const tokensTi = [{ type: 'glyph', solfege: 'Ti' as any, raw: 'Ti' }];
    const resTi = mapTokensToRatios(tokensTi, { sevenths: 'Tri' });
    expect(resTi[0].rmult).toEqual({ num: 243, den: 128 });
  });

  it('should apply octave offsets correctly', () => {
    const tokens = [
      { type: 'glyph', solfege: 'Do' as any, raw: 'Do', octaveOffset: 1 },
      { type: 'glyph', solfege: 'So' as any, raw: 'So', octaveOffset: -1 }
    ];
    const res = mapTokensToRatios(tokens, {});
    expect(res[0].rmult).toEqual({ num: 2, den: 1 }); // Do up an octave
    expect(res[1].rmult).toEqual({ num: 3, den: 4 }); // So down an octave
  });

  it('should ignore non-glyph tokens', () => {
    const tokens = [
      { type: 'whitespace', raw: ' ' },
      { type: 'barline', raw: '|' },
      { type: 'glyph', solfege: 'Do' as any, raw: 'Do' }
    ];
    const res = mapTokensToRatios(tokens as any, {});
    expect(res.length).toBe(1);
    expect(res[0].rmult).toEqual({ num: 1, den: 1 });
  });
});
