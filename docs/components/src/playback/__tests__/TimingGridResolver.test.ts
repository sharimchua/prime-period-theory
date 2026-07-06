import { describe, it, expect } from 'vitest';
import { TimingGridResolver } from '../TimingGridResolver.js';
import { ParsedToken } from '../../solfegeUtils.js';

describe('TimingGridResolver', () => {
  it('should resolve simple glyphs correctly', () => {
    const resolver = new TimingGridResolver(0.5); // 0.5s per beat
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Do', char: 'd', index: 0 },
      { type: 'glyph', solfege: 'Re', char: 'r', index: 1 }
    ];

    const onsets = resolver.resolve(tokens);

    expect(onsets).toHaveLength(2);
    expect(onsets[0]).toEqual({ timeInSeconds: 0, durationInSeconds: 0.5, beatIndex: 0 });
    expect(onsets[1]).toEqual({ timeInSeconds: 0.5, durationInSeconds: 0.5, beatIndex: 1 });
  });

  it('should handle padding correctly', () => {
    const resolver = new TimingGridResolver(1.0);
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Do', char: 'd', index: 0 },
      { type: 'padding', paddingLength: 2, index: 1 },
      { type: 'glyph', solfege: 'Mi', char: 'm', index: 2 }
    ];

    const onsets = resolver.resolve(tokens);

    expect(onsets).toHaveLength(2);
    expect(onsets[0]).toEqual({ timeInSeconds: 0, durationInSeconds: 1.0, beatIndex: 0 });
    expect(onsets[1]).toEqual({ timeInSeconds: 3.0, durationInSeconds: 1.0, beatIndex: 3 });
  });

  it('should handle hold correctly', () => {
    const resolver = new TimingGridResolver(1.0);
    const tokens: ParsedToken[] = [
      { type: 'glyph', solfege: 'Do', char: 'd', index: 0 },
      { type: 'hold', char: '-', index: 1 },
      { type: 'glyph', solfege: 'Mi', char: 'm', index: 2 }
    ];

    const onsets = resolver.resolve(tokens);

    expect(onsets).toHaveLength(2);
    expect(onsets[0]).toEqual({ timeInSeconds: 0, durationInSeconds: 2.0, beatIndex: 0 });
    expect(onsets[1]).toEqual({ timeInSeconds: 2.0, durationInSeconds: 1.0, beatIndex: 2 });
  });

  it('should handle hold with no preceding glyph correctly', () => {
    const resolver = new TimingGridResolver(1.0);
    const tokens: ParsedToken[] = [
      { type: 'hold', char: '-', index: 0 },
      { type: 'glyph', solfege: 'Mi', char: 'm', index: 1 }
    ];

    const onsets = resolver.resolve(tokens);

    expect(onsets).toHaveLength(1);
    expect(onsets[0]).toEqual({ timeInSeconds: 1.0, durationInSeconds: 1.0, beatIndex: 1 });
  });
});
