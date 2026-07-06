import { 
  MidiToSolfegeMapper, 
  SolfegeOutput, 
  MIDI_NOTE_C3, 
  MIDI_NOTE_C4, 
  chromaticToSolfege 
} from './MidiToSolfegeMapper.js';

export class RhythmMapper implements MidiToSolfegeMapper {
  private activeNotes: Set<number> = new Set();
  
  // Note mappings
  private readonly MODIFIER_OCTAVE_START = MIDI_NOTE_C3; // 48
  private readonly MODIFIER_OCTAVE_END = 59;
  private readonly INPUT_OCTAVE_START = MIDI_NOTE_C4; // 60
  private readonly INPUT_OCTAVE_END = 71;

  // Modifier Keys
  private readonly KEY_COMMIT = this.MODIFIER_OCTAVE_START + 7; // G3
  private readonly KEY_DELETE = this.MODIFIER_OCTAVE_START + 4; // E3

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

      // Handle modifiers
      if (note >= this.MODIFIER_OCTAVE_START && note <= this.MODIFIER_OCTAVE_END) {
        if (note === this.KEY_DELETE) {
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
    
    const hasOpenerModifier = this.activeNotes.has(this.MODIFIER_OCTAVE_START);
    
    for (let note = this.INPUT_OCTAVE_START; note <= this.INPUT_OCTAVE_END; note++) {
      if (this.activeNotes.has(note)) {
        const offset = note - this.INPUT_OCTAVE_START;
        
        let solfegeStr = chromaticToSolfege(offset);
        // C3 modifier makes C4 into Dox, C#4 into Dix
        if (hasOpenerModifier) {
          if (offset === 0) solfegeStr = 'Dox' as any;
          if (offset === 1) solfegeStr = 'Dix' as any;
        }

        outputs.push({
          solfege: solfegeStr as any,
          commas: [],
          raw: solfegeStr
        });
      }
    }

    return outputs.length > 0 ? outputs : [];
  }

  reset(): void {
    this.activeNotes.clear();
  }
}
