import { analyzeChord, Fraction } from '../src/lib/primeLatticeProfiler.js';
import { mapPitchesToRatios } from '../src/pitchUtils.js';

const jnd = 0.02;
const maxDepth = 2;
const sigma = 1;

const ptolemaic = { m2: 'Tri', M2: 'Tri', m3: 'Qui', M3: 'Qui', P4: 'Tri', TT: 'Qui', P5: 'Tri', m6: 'Qui', M6: 'Qui', m7: 'Tri', M7: 'Qui' };

function getChordNotes(raw: string) {
  const rawMap = mapPitchesToRatios(raw, ptolemaic as any);
  return rawMap.map((r, i) => ({
    label: r.label,
    index: i,
    rmult: new Fraction(r.rmult.num, r.rmult.den)
  }));
}

const triads = {
  Major: getChordNotes('Do Mi So'),
  Minor: getChordNotes('Do Me So'),
  Diminished: getChordNotes('Do Me Se'),
  Augmented: getChordNotes('Do Mi Si')
};

const sevenths = {
  Maj7: getChordNotes('Do Mi So Ti'),
  min7: getChordNotes('Do Me So Te'),
  Dom7: getChordNotes('Do Mi So Te'),
  min7b5: getChordNotes('Do Me Se Te'),
  dim7: getChordNotes('Do Me Se La')
};

function dump(chordMap: Record<string, any>) {
  for (const [name, notes] of Object.entries(chordMap)) {
    const res = analyzeChord(notes, 0.02, jnd, maxDepth, sigma);
    console.log(`\n--- ${name} ---`);
    const entries = Array.from(res.entries());
    entries.sort((a,b) => b[1].value - a[1].value);
    
    // total profile
    for (const [family, data] of entries) {
      console.log(`${family}: ${data.value.toFixed(3)}`);
    }

    // calculate tone attributions
    const attributions = notes.map(() => 0);
    for (const [family, data] of entries) {
      for (const pair of data.pairs) {
        const p1TotalW = pair.p1.provenance.reduce((s, p) => s + p.weight, 0);
        const p2TotalW = pair.p2.provenance.reduce((s, p) => s + p.weight, 0);
        
        for (const prov of pair.p1.provenance) {
          attributions[prov.noteIndex - 1] += (pair.cw / 2) * (prov.weight / p1TotalW);
        }
        for (const prov of pair.p2.provenance) {
          attributions[prov.noteIndex - 1] += (pair.cw / 2) * (prov.weight / p2TotalW);
        }
      }
    }
    console.log(`Attributions: Root=${attributions[0]?.toFixed(3) || '-'} Third=${attributions[1]?.toFixed(3) || '-'} Fifth=${attributions[2]?.toFixed(3) || '-'} Seventh=${attributions[3]?.toFixed(3) || '-'}`);
  }
}

console.log("=== TRIADS ===");
dump(triads);

console.log("=== SEVENTHS ===");
dump(sevenths);
