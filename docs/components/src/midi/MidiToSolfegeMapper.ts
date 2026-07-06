import type { SolfegeSyllable } from '../solfegeUtils.js';

export type CommaString = string;

export interface SolfegeOutput {
  solfege: SolfegeSyllable;
  commas: CommaString[];
  raw: string; // The exact text string representation
}

export interface GlyphInputPayload {
  tokens: SolfegeOutput[];
}

export interface MidiToSolfegeMapper {
  processMidiEvent(event: WebMidi.MIDIMessageEvent): SolfegeOutput[] | null | 'DELETE';
  reset(): void;
}

export const MIDI_NOTE_C3 = 48; // Modifier octave base
export const MIDI_NOTE_C4 = 60; // Input octave base

export function chromaticToSolfege(chromaticIndex: number): SolfegeSyllable {
  const syllables: SolfegeSyllable[] = [
    'Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 
    'Fi', 'So', 'Le', 'La', 'Te', 'Ti'
  ];
  return syllables[((chromaticIndex % 12) + 12) % 12];
}
