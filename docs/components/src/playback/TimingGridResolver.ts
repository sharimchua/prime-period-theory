import type { ParsedToken } from '../solfegeUtils.js';

export interface GridOnset {
  timeInSeconds: number;
  durationInSeconds: number;
  beatIndex: number; // The visual column index this corresponds to
}

export class TimingGridResolver {
  private secondsPerBeat: number = 1.0; 

  constructor(secondsPerBeat: number = 1.0) {
    this.secondsPerBeat = secondsPerBeat;
  }

  public resolve(rhythmTokens: ParsedToken[]): GridOnset[] {
    const onsets: GridOnset[] = [];
    let currentTime = 0;
    let currentBeat = 0;

    for (let i = 0; i < rhythmTokens.length; i++) {
      const t = rhythmTokens[i];
      if (t.type === 'glyph') {
        onsets.push({
          timeInSeconds: currentTime,
          durationInSeconds: this.secondsPerBeat,
          beatIndex: currentBeat
        });
        currentTime += this.secondsPerBeat;
        currentBeat++;
      } else if (t.type === 'padding') {
        const pLen = t.paddingLength || 1;
        currentTime += pLen * this.secondsPerBeat;
        currentBeat += pLen;
      } else if (t.type === 'hold') {
        currentTime += this.secondsPerBeat;
        currentBeat++;
        if (onsets.length > 0) {
           onsets[onsets.length - 1].durationInSeconds += this.secondsPerBeat;
        }
      }
    }
    return onsets;
  }
}
