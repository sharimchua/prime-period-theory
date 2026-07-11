import { describe, it, expect } from 'vitest';
import { Phrase, CoilRow, CoilLayer, CoilModel, type GlyphToken } from '../grammar/grammarCore';
import { RhythmicGrammarInterpreter, MelodicGrammarInterpreter, HarmonicGrammarInterpreter } from '../grammar/interpreters';

describe('Grammar Core Models', () => {
  it('should construct a Phrase with tokens', () => {
    const tokens: GlyphToken[] = [
      { syllable: 'Do', diacritic: 'Base', octaveOffset: 0 },
      { syllable: 'Re', diacritic: 'HalfSup', octaveOffset: 1 }
    ];
    const phrase = new Phrase(tokens, 'melody');
    
    expect(phrase.tokens).toHaveLength(2);
    expect(phrase.context).toBe('melody');
  });

  it('should construct a CoilModel with layers', () => {
    const rhythmLayer = new CoilLayer('rhythm');
    const harmonyLayer = new CoilLayer('harmony');
    const melodyLayer = new CoilLayer('melody');

    const model = new CoilModel(rhythmLayer, harmonyLayer, melodyLayer);
    
    expect(model.rhythmLayer.context).toBe('rhythm');
    expect(model.harmonyLayer.context).toBe('harmony');
    expect(model.melodyLayer.context).toBe('melody');
  });
});

describe('Grammar Interpreters', () => {
  describe('RhythmicGrammarInterpreter', () => {
    it('should correctly produce onset specs from a rhythm phrase', () => {
      const tokens: GlyphToken[] = [
        { syllable: 'Do', diacritic: 'Base', octaveOffset: 0, durationWeight: 1 },
        { syllable: 'Re', diacritic: 'Base', octaveOffset: 0, durationWeight: 3 }
      ];
      const phrase = new Phrase(tokens, 'rhythm');
      
      const onsets = RhythmicGrammarInterpreter.interpret(phrase);
      
      expect(onsets).toHaveLength(2);
      expect(onsets[0].positionRatio).toBeCloseTo(0);
      expect(onsets[0].durationRatio).toBeCloseTo(0.25);
      
      expect(onsets[1].positionRatio).toBeCloseTo(0.25);
      expect(onsets[1].durationRatio).toBeCloseTo(0.75);
    });

    it('should throw an error for non-rhythm phrases', () => {
      const phrase = new Phrase([], 'melody');
      expect(() => RhythmicGrammarInterpreter.interpret(phrase)).toThrow();
    });
  });

  describe('MelodicGrammarInterpreter', () => {
    it('should resolve melody tokens into scale degree positions', () => {
      const tokens: GlyphToken[] = [
        { syllable: 'Mi', diacritic: 'HalfSub', octaveOffset: -1 }
      ];
      const phrase = new Phrase(tokens, 'melody');
      
      const degrees = MelodicGrammarInterpreter.interpret(phrase);
      
      expect(degrees).toHaveLength(1);
      expect(degrees[0].syllable).toBe('Mi');
      expect(degrees[0].diacritic).toBe('HalfSub');
      expect(degrees[0].octaveOffset).toBe(-1);
    });
  });

  describe('HarmonicGrammarInterpreter', () => {
    it('should resolve harmony tokens into a chord tone set', () => {
      const tokens: GlyphToken[] = [
        { syllable: 'Do', diacritic: 'Base', octaveOffset: 0 },
        { syllable: 'Mi', diacritic: 'Base', octaveOffset: 0 },
        { syllable: 'So', diacritic: 'Base', octaveOffset: 0 }
      ];
      const phrase = new Phrase(tokens, 'harmony');
      
      const chord = HarmonicGrammarInterpreter.interpret(phrase);
      
      expect(chord.tones).toHaveLength(3);
      expect(chord.tones[1].syllable).toBe('Mi');
    });
  });
});
