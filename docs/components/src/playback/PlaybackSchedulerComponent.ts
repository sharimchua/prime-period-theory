import { BasePPTComponent } from '../BasePPTComponent.js';
import { EventBus } from '../features/EventBus.js';
import * as Tone from 'tone';
import { TimingGridResolver } from './TimingGridResolver.js';
import { TuningResolver } from './TuningResolver.js';
import { expandRhythmPhrase } from '../solfegeUtils.js';

export class PlaybackSchedulerComponent extends BasePPTComponent {
  static override get componentDef() {
    return {
      displayName: 'Playback Scheduler',
      familyColor: '#8b5cf6',
      acceptsChildren: [],
      canNestIn: ['ppt-coil']
    };
  }

  private timingResolver = new TimingGridResolver(1.0); // 1 sec per beat default
  private tuningResolver = new TuningResolver(261.63);  // C4 default
  private scheduledEventIds: number[] = [];
  
  private mutedRows: Set<string> = new Set();
  private soloedRows: Set<string> = new Set();

  override connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none';

    EventBus.subscribe('coil-play', this.handlePlay.bind(this));
    EventBus.subscribe('coil-stop', this.handleStop.bind(this));
    EventBus.subscribe('mixer-mute', this.handleMute.bind(this));
    EventBus.subscribe('mixer-solo', this.handleSolo.bind(this));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.handleStop();
  }

  private handleMute(payload: any) {
    const key = `${payload.layer}-${payload.rowIndex}`;
    if (payload.active) {
      this.mutedRows.add(key);
    } else {
      this.mutedRows.delete(key);
    }
  }

  private handleSolo(payload: any) {
    const key = `${payload.layer}-${payload.rowIndex}`;
    if (payload.active) {
      this.soloedRows.add(key);
    } else {
      this.soloedRows.delete(key);
    }
  }

  private async handlePlay(payload?: any) {
    // Start Audio Context if needed
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    this.handleStop(); // clear previous

    const bpm = payload?.bpm || 120;
    const isLooping = payload?.loop || false;
    
    Tone.Transport.bpm.value = bpm;
    // Assume 4 tokens per beat (16th notes in 4/4) so it's not too slow at 120 BPM
    const secondsPerToken = (60 / bpm) / 4;
    this.timingResolver = new TimingGridResolver(secondsPerToken);

    const coil = this.closest('ppt-coil') || document.body;
    
    // 1. Find Rhythm layer to generate the timing grid
    const rhythmLayer = coil.querySelector('ppt-coil-layer[layer="rhythm"]');
    if (!rhythmLayer) {
      console.warn('PlaybackScheduler: No rhythm layer found to derive timing grid.');
      return;
    }

    // We'll take the first rhythm row for the master grid for now
    const rhythmEditor = rhythmLayer.querySelector('ppt-phrase-editor') as any;
    if (!rhythmEditor || !rhythmEditor.tokens) return;
    
    // Resolve Timing using the fully expanded rhythm phrase
    const rhythmTokens = expandRhythmPhrase(rhythmEditor.tokens);
    const onsets = this.timingResolver.resolve(rhythmTokens);
    if (onsets.length === 0) return;

    // Set loop properties if enabled
    if (isLooping && onsets.length > 0) {
      const lastOnset = onsets[onsets.length - 1];
      const totalDuration = lastOnset.timeInSeconds + lastOnset.durationInSeconds;
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = 0;
      Tone.Transport.loopEnd = totalDuration;
    } else {
      Tone.Transport.loop = false;
    }

    // 2. Schedule Melody, Harmony, and Rhythm layers using the onsets
    const scheduleLayer = (layerContext: 'melody' | 'harmony' | 'rhythm') => {
      const isHarmony = layerContext === 'harmony';
      const layer = coil.querySelector(`ppt-coil-layer[layer="${layerContext}"]`);
      if (!layer) return;
      
      const rows = Array.from(layer.querySelectorAll('ppt-coil-row'));
      rows.forEach((row, rowIndex) => {
        const key = `${layerContext}-${rowIndex}`;
        
        // Check mixer state
        if (this.soloedRows.size > 0 && !this.soloedRows.has(key)) return;
        if (this.mutedRows.has(key)) return;

        const editor = row.querySelector('ppt-phrase-editor') as any;
        if (!editor || !editor.tokens) return;
        
        // Find the tone voice for this row, or fallback to default
        const voice = row.querySelector('ppt-tone-voice') || coil.querySelector('ppt-tone-voice');
        const voiceId = voice ? voice.getAttribute('voice-id') || 'default' : 'default';

        const tokensToSchedule = layerContext === 'rhythm' ? expandRhythmPhrase(editor.tokens) : editor.tokens;
        let tokenIdx = 0;
        let onsetIdx = 0;
        
        // Map tokens sequentially to the rhythm onsets
        while (tokenIdx < tokensToSchedule.length && onsetIdx < onsets.length) {
          const mToken = tokensToSchedule[tokenIdx];
          
          if (mToken.type === 'glyph') {
            const freq = this.tuningResolver.resolveFrequency(mToken);
            if (freq !== null) {
              const onset = onsets[onsetIdx];
              
              let duration = onset.durationInSeconds;

              // Harmony sustains until the next chord is defined
              if (isHarmony) {
                let nextOnsetIdx = onsetIdx + 1;
                let nextTokenIdx = tokenIdx + 1;
                while (nextTokenIdx < tokensToSchedule.length) {
                  const lookahead = tokensToSchedule[nextTokenIdx];
                  if (lookahead.type === 'glyph') break;
                  if (lookahead.type === 'padding') nextOnsetIdx += (lookahead.paddingLength || 1);
                  if (lookahead.type === 'hold') nextOnsetIdx++;
                  nextTokenIdx++;
                }
                
                if (nextOnsetIdx < onsets.length) {
                  duration = onsets[nextOnsetIdx].timeInSeconds - onset.timeInSeconds;
                } else if (onsets.length > 0) {
                  const lastOnset = onsets[onsets.length - 1];
                  duration = (lastOnset.timeInSeconds + lastOnset.durationInSeconds) - onset.timeInSeconds;
                }
              }

              // Schedule with Tone.Transport
              const eventId = Tone.Transport.schedule((time) => {
                EventBus.publish(`play-note-${voiceId}`, {
                  freq: freq,
                  duration: duration,
                  time: time
                });
              }, onset.timeInSeconds);
              this.scheduledEventIds.push(eventId);
            }
            tokenIdx++;
            onsetIdx++;
          } else if (mToken.type === 'padding') {
            const pLen = mToken.paddingLength || 1;
            tokenIdx++;
            onsetIdx += pLen; // Skip onsets
          } else if (mToken.type === 'hold') {
            // It just extends the previous note visually, but we don't handle tie logic for melody yet
            tokenIdx++;
            onsetIdx++;
          }
        }
      });
    };

    scheduleLayer('rhythm');
    scheduleLayer('melody');
    scheduleLayer('harmony');

    // Start transport
    Tone.Transport.start();
  }

  private handleStop() {
    Tone.Transport.stop();
    Tone.Transport.cancel(); // Clears all scheduled events
    this.scheduledEventIds.forEach(id => Tone.Transport.clear(id));
    this.scheduledEventIds = [];
    
    // Stop all active notes on all voices
    const coil = this.closest('ppt-coil') || document.body;
    const voices = Array.from(coil.querySelectorAll('ppt-tone-voice'));
    voices.forEach(voice => {
      const vId = voice.getAttribute('voice-id') || 'default';
      EventBus.publish(`stop-note-${vId}`, {}); // broadcast a generic stop if possible, but our synth needs freq.
    });
    // In our ToneVoiceComponent, if freq is undefined, maybe we can add a stopAll?
    // For now Tone.Transport.stop() generally stops scheduled events, but active notes might hang if not released.
  }
}

if (!customElements.get('ppt-playback-scheduler')) {
  customElements.define('ppt-playback-scheduler', PlaybackSchedulerComponent);
}
