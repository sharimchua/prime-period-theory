export type TriDuTuning = 'Tri' | 'Du';
export type TriQuiDuTuning = 'Tri' | 'Qui' | 'Du';
export type TriSepDuTuning = 'Tri' | 'Sep' | 'Du';
export type TritoneTuning = 'Undec' | 'Qui' | 'Tri' | 'Du';

export interface PitchTuningConfig {
  m2: TriDuTuning;
  M2: TriDuTuning;
  m3: TriQuiDuTuning;
  M3: TriQuiDuTuning;
  P4: TriDuTuning;
  TT: TritoneTuning;
  P5: TriDuTuning;
  m6: TriQuiDuTuning;
  M6: TriQuiDuTuning;
  m7: TriSepDuTuning;
  M7: TriQuiDuTuning;
}
export interface ParsedPitch {
  note: string;
  accidental: string;
  octave: number;
  raw: string;
}

const SOLFEGE_REGEX = /^([A-Z][a-z])(-?\d+)?$/;

export function parsePitch(text: string): ParsedPitch | null {
  const match = text.trim().match(SOLFEGE_REGEX);
  if (!match) return null;
  return {
    note: match[1],
    accidental: '', // Not used in solfege directly this way
    octave: match[2] ? parseInt(match[2], 10) - 1 : 0, // 0 is base register, Do1 is equivalent to Do
    raw: text.trim()
  };
}

export function pitchToMidi(pitch: ParsedPitch): number {
  const noteMap: Record<string, number> = {
    'Do': 0, 'Di': 1, 'Ra': 1, 'Re': 2, 'Ri': 3, 'Me': 3, 'Mi': 4,
    'Fa': 5, 'Fi': 6, 'Se': 6, 'So': 7, 'Le': 8, 'Si': 8, 'La': 9,
    'Te': 10, 'Ti': 11
  };
  
  const semitones = noteMap[pitch.note];
  if (semitones === undefined) return 0;
  
  // Base Do is 0, octave shifts by 12
  return (pitch.octave * 12) + semitones;
}

export function mapPitchesToRatios(text: string, config: PitchTuningConfig): { label: string, rmult: { num: number, den: number } }[] {
  const tokens = text.split(/\s+/).filter(t => t.length > 0);
  const results: { label: string, rmult: { num: number, den: number } }[] = [];
  
  if (tokens.length === 0) return results;

  const basePitch = parsePitch(tokens[0]);
  if (!basePitch) return results;
  const baseMidi = pitchToMidi(basePitch);
  let currentMidi = baseMidi;

  for (const token of tokens) {
    const pitch = parsePitch(token);
    if (!pitch) continue; // Skip invalid tokens
    
    let midi = pitchToMidi(pitch);
    while (midi < currentMidi) {
      midi += 12;
    }
    currentMidi = midi;
    
    const intervalFromBase = midi - baseMidi;
    
    let octaves = Math.floor(intervalFromBase / 12);
    let semitones = intervalFromBase % 12;
    if (semitones < 0) {
      semitones += 12;
    }
    
    let num = 1;
    let den = 1;

    switch (semitones) {
      case 0: num = 1; den = 1; break; // Unison
      case 1: // Minor 2nd
        if (config.m2 === 'Du') { num = Math.pow(2, 1/12); den = 1; }
        else { num = 16; den = 15; } // Tri fallback for m2 is 256/243, but standard JI is 16/15
        break;
      case 2: // Major 2nd
        if (config.M2 === 'Du') { num = Math.pow(2, 2/12); den = 1; }
        else { num = 9; den = 8; }
        break;
      case 3: // Minor 3rd
        if (config.m3 === 'Du') { num = Math.pow(2, 3/12); den = 1; }
        else if (config.m3 === 'Tri') { num = 32; den = 27; } 
        else { num = 6; den = 5; }
        break;
      case 4: // Major 3rd
        if (config.M3 === 'Du') { num = Math.pow(2, 4/12); den = 1; }
        else if (config.M3 === 'Tri') { num = 81; den = 64; } 
        else { num = 5; den = 4; }
        break;
      case 5: // Perfect 4th
        if (config.P4 === 'Du') { num = Math.pow(2, 5/12); den = 1; }
        else { num = 4; den = 3; }
        break;
      case 6: // Tritone
        if (config.TT === 'Du') { num = Math.SQRT2; den = 1; }
        else if (config.TT === 'Undec') { num = 11; den = 8; } 
        else if (config.TT === 'Tri') { num = 729; den = 512; }
        else { num = 45; den = 32; }
        break;
      case 7: // Perfect 5th
        if (config.P5 === 'Du') { num = Math.pow(2, 7/12); den = 1; }
        else { num = 3; den = 2; }
        break;
      case 8: // Minor 6th
        if (config.m6 === 'Du') { num = Math.pow(2, 8/12); den = 1; }
        else if (config.m6 === 'Tri') { num = 128; den = 81; }
        else { num = 8; den = 5; }
        break;
      case 9: // Major 6th
        if (config.M6 === 'Du') { num = Math.pow(2, 9/12); den = 1; }
        else if (config.M6 === 'Tri') { num = 27; den = 16; }
        else { num = 5; den = 3; }
        break;
      case 10: // Minor 7th
        if (config.m7 === 'Du') { num = Math.pow(2, 10/12); den = 1; }
        else if (config.m7 === 'Sep') { num = 7; den = 4; }
        else { num = 16; den = 9; }
        break;
      case 11: // Major 7th
        if (config.M7 === 'Du') { num = Math.pow(2, 11/12); den = 1; }
        else if (config.M7 === 'Tri') { num = 243; den = 128; }
        else { num = 15; den = 8; }
        break;
    }

    if (octaves > 0) num *= Math.pow(2, octaves);
    else if (octaves < 0) den *= Math.pow(2, Math.abs(octaves));

    results.push({ label: pitch.raw, rmult: { num, den } });
  }

  return results;
}
