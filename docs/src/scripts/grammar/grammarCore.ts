export type DiacriticState = 'Sub' | 'HalfSub' | 'Base' | 'HalfSup' | 'Sup' | 'Axis';
export type GrammarContext = 'rhythm' | 'melody' | 'harmony';

export interface GlyphToken {
  syllable: string;
  diacritic: DiacriticState;
  octaveOffset: number;
  durationWeight?: number; // Used mainly in rhythm context
}

export class Phrase {
  tokens: GlyphToken[];
  context: GrammarContext;

  constructor(tokens: GlyphToken[], context: GrammarContext) {
    this.tokens = tokens;
    this.context = context;
  }
}

export interface RowMetadata {
  label: string;
  registerOffset: number;
  isMuted: boolean;
  isSoloed: boolean;
  voiceColor?: string;
}

export class CoilRow {
  phrase: Phrase;
  metadata: RowMetadata;

  constructor(phrase: Phrase, metadata: RowMetadata) {
    this.phrase = phrase;
    this.metadata = metadata;
  }
}

export class CoilLayer {
  context: GrammarContext;
  rows: CoilRow[];

  constructor(context: GrammarContext, rows: CoilRow[] = []) {
    this.context = context;
    this.rows = rows;
  }
}

export class CoilModel {
  rhythmLayer: CoilLayer;
  harmonyLayer: CoilLayer;
  melodyLayer: CoilLayer;
  
  tonalCenter?: string;
  tempo?: number;

  constructor(rhythmLayer: CoilLayer, harmonyLayer: CoilLayer, melodyLayer: CoilLayer) {
    this.rhythmLayer = rhythmLayer;
    this.harmonyLayer = harmonyLayer;
    this.melodyLayer = melodyLayer;
  }
}
