import { 
  MidiToSolfegeMapper, 
  SolfegeOutput, 
  MIDI_NOTE_C3, 
  MIDI_NOTE_C4, 
  chromaticToSolfege 
} from './MidiToSolfegeMapper.js';

export class HarmonyMapper implements MidiToSolfegeMapper {
  private activeNotes: Set<number> = new Set();
  
  // Note mappings
  private readonly MODIFIER_OCTAVE_START = MIDI_NOTE_C3; // 48
  private readonly MODIFIER_OCTAVE_END = 59;
  private readonly INPUT_OCTAVE_START = MIDI_NOTE_C4; // 60
  private readonly INPUT_OCTAVE_END = 71;

  // Modifier Keys
  private readonly KEY_COMMIT = this.MODIFIER_OCTAVE_START + 7; // G3 (7)
  private readonly KEY_DELETE = this.MODIFIER_OCTAVE_START + 4; // E3 (4)
  // G3 (7) is redundant but could be used later

  processMidiEvent(event: WebMidi.MIDIMessageEvent): SolfegeOutput[] | null | 'DELETE' {
    const [command, note, velocity] = event.data;
    
    const isNoteOn = (command === 144 && velocity > 0);
    const isNoteOff = (command === 128 || (command === 144 && velocity === 0));

    if (isNoteOff) {
      this.activeNotes.delete(note);
      return null;
    }

    if (isNoteOn) {
      this.activeNotes.add(note);

      // Handle explicit controls
      if (note === this.KEY_DELETE) {
        if (this.activeNotes.has(this.MODIFIER_OCTAVE_START)) {
           return null; // Suppress delete when holding C3 (Dash modifier)
        }
        return 'DELETE';
      }
      if (note === this.KEY_COMMIT) {
        return this.commit();
      }
    }

    return null;
  }

  private commit(): SolfegeOutput[] {
    const outputs: SolfegeOutput[] = [];
    
    // Handle Dot / Dash
    if (this.activeNotes.has(this.MODIFIER_OCTAVE_START)) {
      const isDash = this.activeNotes.has(this.KEY_DELETE);
      outputs.push({
        solfege: undefined as any,
        commas: [],
        raw: isDash ? '-' : '.'
      });
      return outputs;
    }
    
    // Determine the root from the INPUT_OCTAVE
    let rootNote = -1;
    for (let note = this.INPUT_OCTAVE_START; note <= this.INPUT_OCTAVE_END; note++) {
      if (this.activeNotes.has(note)) {
        rootNote = note;
        break; // Take the lowest note in the input octave as root
      }
    }

    if (rootNote !== -1) {
      const rootSolfege = chromaticToSolfege(rootNote - this.INPUT_OCTAVE_START);
      
      // Determine chord modifiers from the MODIFIER_OCTAVE
      // E.g., Eb3 (48 + 3 = 51) relative to C3 (48) is offset 3 -> Me
      const chordTones: string[] = [];
      for (let note = this.MODIFIER_OCTAVE_START; note <= this.MODIFIER_OCTAVE_END; note++) {
        if (note === this.KEY_COMMIT || note === this.KEY_DELETE) continue; // Skip controls
        
        if (this.activeNotes.has(note)) {
          const modifierOffset = note - this.MODIFIER_OCTAVE_START;
          const toneSolfege = chromaticToSolfege(modifierOffset);
          chordTones.push(toneSolfege);
        }
      }

      let rawStr = rootSolfege;
      if (chordTones.length > 0) {
        // e.g. Fa [Me So]
        rawStr += ` [${chordTones.join(' ')}]`;
      }

      outputs.push({
        solfege: rootSolfege,
        commas: [],
        raw: rawStr
      });
    }

    return outputs.length > 0 ? outputs : [];
  }

  reset(): void {
    this.activeNotes.clear();
  }
}
