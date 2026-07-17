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

import { AbsRatio, Tuning } from "./lib/primeLatticeProfiler.js";

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

export function mapPitchesToRatios(text: string, config: PitchTuningConfig): { label: string, rmult: AbsRatio }[] {
  const tokens = text.split(/\s+/).filter(t => t.length > 0);
  const results: { label: string, rmult: AbsRatio }[] = [];
  
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
    
    let rmult: AbsRatio;

    switch (semitones) {
      case 0: rmult = Tuning.ji(1, 1); break; // Unison
      case 1: // Minor 2nd
        if (config.m2 === 'Du') rmult = Tuning.edo(1, 12);
        else rmult = Tuning.ji(16, 15);
        break;
      case 2: // Major 2nd
        if (config.M2 === 'Du') rmult = Tuning.edo(2, 12);
        else rmult = Tuning.ji(9, 8);
        break;
      case 3: // Minor 3rd
        if (config.m3 === 'Du') rmult = Tuning.edo(3, 12);
        else if (config.m3 === 'Tri') rmult = Tuning.ji(32, 27); 
        else rmult = Tuning.ji(6, 5);
        break;
      case 4: // Major 3rd
        if (config.M3 === 'Du') rmult = Tuning.edo(4, 12);
        else if (config.M3 === 'Tri') rmult = Tuning.ji(81, 64); 
        else rmult = Tuning.ji(5, 4);
        break;
      case 5: // Perfect 4th
        if (config.P4 === 'Du') rmult = Tuning.edo(5, 12);
        else rmult = Tuning.ji(4, 3);
        break;
      case 6: // Tritone
        if (config.TT === 'Du') rmult = Tuning.edo(6, 12);
        else if (config.TT === 'Undec') rmult = Tuning.ji(11, 8); 
        else if (config.TT === 'Tri') rmult = Tuning.ji(729, 512);
        else rmult = Tuning.ji(45, 32);
        break;
      case 7: // Perfect 5th
        if (config.P5 === 'Du') rmult = Tuning.edo(7, 12);
        else rmult = Tuning.ji(3, 2);
        break;
      case 8: // Minor 6th
        if (config.m6 === 'Du') rmult = Tuning.edo(8, 12);
        else if (config.m6 === 'Tri') rmult = Tuning.ji(128, 81);
        else rmult = Tuning.ji(8, 5);
        break;
      case 9: // Major 6th
        if (config.M6 === 'Du') rmult = Tuning.edo(9, 12);
        else if (config.M6 === 'Tri') rmult = Tuning.ji(27, 16);
        else rmult = Tuning.ji(5, 3);
        break;
      case 10: // Minor 7th
        if (config.m7 === 'Du') rmult = Tuning.edo(10, 12);
        else if (config.m7 === 'Sep') rmult = Tuning.ji(7, 4);
        else rmult = Tuning.ji(16, 9);
        break;
      case 11: // Major 7th
        if (config.M7 === 'Du') rmult = Tuning.edo(11, 12);
        else if (config.M7 === 'Tri') rmult = Tuning.ji(243, 128);
        else rmult = Tuning.ji(15, 8);
        break;
      default:
        rmult = Tuning.ji(1, 1);
        break;
    }

    if (octaves > 0) rmult = rmult.mul(Tuning.ji(Math.pow(2, octaves), 1));
    else if (octaves < 0) rmult = rmult.div(Tuning.ji(Math.pow(2, Math.abs(octaves)), 1));

    results.push({ label: pitch.raw, rmult });
  }

  return results;
}
