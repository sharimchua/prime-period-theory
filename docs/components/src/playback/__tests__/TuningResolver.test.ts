import { describe, it, expect } from 'vitest';
import { TuningResolver } from '../TuningResolver.js';
import { ParsedToken } from '../../solfegeUtils.js';

describe('TuningResolver', () => {
  it('should resolve base solfege correctly', () => {
    const resolver = new TuningResolver(261.63);

    let token: ParsedToken = { type: 'glyph', solfege: 'Do', char: 'd', index: 0 };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(261.63, 1);

    token = { type: 'glyph', solfege: 'Re', char: 'r', index: 0 };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(293.66, 1);

    token = { type: 'glyph', solfege: 'Mi', char: 'm', index: 0 };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(329.63, 1);
  });

  it('should return null for non-glyph tokens', () => {
    const resolver = new TuningResolver();
    const token: ParsedToken = { type: 'hold', char: '-', index: 0 };
    expect(resolver.resolveFrequency(token)).toBeNull();
  });

  it('should handle octave offsets correctly', () => {
    const resolver = new TuningResolver(261.63);

    // One octave up
    let token: ParsedToken = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, octaveOffset: 1 };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(261.63 * 2, 1);

    // One octave down
    token = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, octaveOffset: -1 };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(261.63 / 2, 1);
  });

  it('should handle microtonal diacritics correctly', () => {
    const resolver = new TuningResolver(261.63);

    // Axis (+50 cents) -> 261.63 * 2^(0.5/12)
    let token: ParsedToken = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, diacritic: 'axis' };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(269.29, 1);

    // Sub (-33.3 cents) -> 261.63 * 2^(-0.333/12)
    token = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, diacritic: 'w_tri' };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(256.65, 1);

    // Sup (+33.3 cents) -> 261.63 * 2^(0.333/12)
    token = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, diacritic: 'd_tri' };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(266.70, 1);

    // HalfSub (-16.6 cents) -> 261.63 * 2^(-0.166/12)
    token = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, diacritic: 'w_dutri' };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(259.13, 1);

    // HalfSup (+16.6 cents) -> 261.63 * 2^(0.166/12)
    token = { type: 'glyph', solfege: 'Do', char: 'd', index: 0, diacritic: 'd_dutri' };
    expect(resolver.resolveFrequency(token)).toBeCloseTo(264.15, 1);
  });
});
