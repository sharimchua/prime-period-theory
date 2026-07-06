import { 
  MidiToSolfegeMapper, 
  SolfegeOutput, 
  MIDI_NOTE_C3, 
  MIDI_NOTE_C4, 
  chromaticToSolfege 
} from './MidiToSolfegeMapper.js';

export class PitchMapper implements MidiToSolfegeMapper {
  private activeNotes: Set<number> = new Set();
  
  // Note mappings
  private readonly MODIFIER_OCTAVE_START = MIDI_NOTE_C3; // 48
  private readonly MODIFIER_OCTAVE_END = 59;
  private readonly INPUT_OCTAVE_START = MIDI_NOTE_C4; // 60
  private readonly INPUT_OCTAVE_END = 71;

  // Modifier Keys
  private readonly KEY_COMMIT = this.MODIFIER_OCTAVE_START + 7; // G3
  private readonly KEY_DELETE = this.MODIFIER_OCTAVE_START + 4; // E3
  private readonly KEY_OCTAVE_DOWN = this.MODIFIER_OCTAVE_START + 3; // D#3
  private readonly KEY_OCTAVE_UP = this.MODIFIER_OCTAVE_START + 6; // F#3

  processMidiEvent(event: WebMidi.MIDIMessageEvent): SolfegeOutput[] | null | 'DELETE' {
    const [command, note, velocity] = event.data;
    
    // We only care about note on/off
    const isNoteOn = (command === 144 && velocity > 0);
    const isNoteOff = (command === 128 || (command === 144 && velocity === 0));

    if (isNoteOff) {
      this.activeNotes.delete(note);
      return null;
    }

    if (isNoteOn) {
      this.activeNotes.add(note);

      // Handle modifiers
      if (note >= this.MODIFIER_OCTAVE_START && note <= this.MODIFIER_OCTAVE_END) {
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
    
    // Check if there are octave modifiers
    let octaveModifier = '';
    if (this.activeNotes.has(this.KEY_OCTAVE_UP)) {
      octaveModifier = '^Ra';
    } else if (this.activeNotes.has(this.KEY_OCTAVE_DOWN)) {
      octaveModifier = '^Ti';
    }

    // Process all active notes in the input octave
    for (let note = this.INPUT_OCTAVE_START; note <= this.INPUT_OCTAVE_END; note++) {
      if (this.activeNotes.has(note)) {
        const solfege = chromaticToSolfege(note - this.INPUT_OCTAVE_START);
        outputs.push({
          solfege,
          commas: [],
          raw: `${solfege}${octaveModifier}`
        });
      }
    }

    // Usually we don't auto-reset the notes if they are still held down physically,
    // but the mapper is stateless enough to just read `activeNotes`.
    // Wait, actually, if they commit and hold notes, we might get double commits if they press commit again.
    // We'll leave `activeNotes` alone to reflect physical state.
    
    return outputs.length > 0 ? outputs : [];
  }

  reset(): void {
    this.activeNotes.clear();
  }
}
