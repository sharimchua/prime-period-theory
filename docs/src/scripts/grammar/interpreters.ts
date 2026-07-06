import { Phrase, GlyphToken, DiacriticState } from './grammarCore';

export interface OnsetSpec {
  positionRatio: number; // Ratio from the start of the sequence
  durationRatio: number;
}

export class RhythmicGrammarInterpreter {
  /**
   * Validates a rhythm-layer Phrase against Rhythmic Grammar rules
   * and produces a sequence of relative beat positions and durations.
   */
  static interpret(phrase: Phrase): OnsetSpec[] {
    if (phrase.context !== 'rhythm') {
      throw new Error("RhythmicGrammarInterpreter requires a Phrase with 'rhythm' context.");
    }
    
    const onsets: OnsetSpec[] = [];
    let currentPosition = 0;
    
    // Simple basic implementation for Phase 1
    // A real implementation would parse 'Dox' / 'Dix' and cadential chains
    for (const token of phrase.tokens) {
      const weight = token.durationWeight ?? 1;
      onsets.push({
        positionRatio: currentPosition,
        durationRatio: weight
      });
      currentPosition += weight;
    }
    
    // Normalize against total duration to get ratios
    const totalDuration = currentPosition;
    if (totalDuration > 0) {
      return onsets.map(onset => ({
        positionRatio: onset.positionRatio / totalDuration,
        durationRatio: onset.durationRatio / totalDuration
      }));
    }
    
    return onsets;
  }
}

export interface ScaleDegreePosition {
  syllable: string;
  diacritic: DiacriticState;
  octaveOffset: number;
}

export class MelodicGrammarInterpreter {
  /**
   * Resolves a melody-layer Phrase into a sequence of scale-degree positions.
   */
  static interpret(phrase: Phrase): ScaleDegreePosition[] {
    if (phrase.context !== 'melody') {
      throw new Error("MelodicGrammarInterpreter requires a Phrase with 'melody' context.");
    }

    return phrase.tokens.map(token => ({
      syllable: token.syllable,
      diacritic: token.diacritic,
      octaveOffset: token.octaveOffset
    }));
  }
}

export interface ChordToneSet {
  tones: ScaleDegreePosition[];
}

export class HarmonicGrammarInterpreter {
  /**
   * Resolves a harmony-layer Phrase (or multiple rows) into a chord-tone set.
   * For Phase 1, interprets a single phrase where each token is a chord member.
   */
  static interpret(phrase: Phrase): ChordToneSet {
    if (phrase.context !== 'harmony') {
      throw new Error("HarmonicGrammarInterpreter requires a Phrase with 'harmony' context.");
    }

    const tones = phrase.tokens.map(token => ({
      syllable: token.syllable,
      diacritic: token.diacritic,
      octaveOffset: token.octaveOffset
    }));

    return { tones };
  }
}
