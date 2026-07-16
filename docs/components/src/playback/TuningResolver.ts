import type { ParsedToken } from '../solfegeUtils.js';
import { TuningConfig } from '../solfegeUtils.js';

export class TuningResolver {
  // Reference: A4 = 440Hz -> C4 is approx 261.63Hz
  // We'll assume Do = C4 = 261.63Hz for default.
  private baseFreq: number = 261.63; 
  private baseOctave: number = 4;

  // 12TET semitone offsets for the base syllables
  private static SYLLABLE_OFFSETS: Record<string, number> = {
    'do': 0, 'di': 1, 'ra': 1, 're': 2, 'ri': 3,
    'me': 3, 'mi': 4, 'fa': 5, 'fi': 6, 'so': 7,
    'le': 8, 'la': 9, 'te': 10, 'se': 10, 'ti': 11, 'si': 11
  };

  constructor(tonalCenterHz: number = 261.63) {
    this.baseFreq = tonalCenterHz;
  }

  public resolveFrequency(token: ParsedToken): number | null {
    if (token.type !== 'glyph' || !token.solfege) return null;

    const base = token.solfege.toLowerCase();
    const semitonesFromDo = TuningResolver.SYLLABLE_OFFSETS[base];
    if (semitonesFromDo === undefined) return null;

    // Handle Diacritic Microtonal Offsets in 72 EDO / cent values
    // Assuming Half = 16.66c, full = 33.33c, etc. (we'll simplify for phase 1)
    let microtonalCents = 0;
    if (token.diacritic) {
      if (token.diacritic === 'w_tri') microtonalCents = -33.3; // Sub
      if (token.diacritic === 'w_dutri') microtonalCents = -16.6; // HalfSub
      if (token.diacritic === 'd_dutri') microtonalCents = 16.6; // HalfSup
      if (token.diacritic === 'd_tri') microtonalCents = 33.3; // Sup
      if (token.diacritic === 'axis') microtonalCents = 50.0; // Axis
    }

    const totalSemitones = semitonesFromDo + (token.octaveOffset || 0) * 12 + (microtonalCents / 100);
    
    // Calculate frequency: f = f0 * 2^(n/12)
    return this.baseFreq * Math.pow(2, totalSemitones / 12);
  }
}
