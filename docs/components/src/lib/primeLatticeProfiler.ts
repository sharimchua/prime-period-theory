export class Fraction {
    constructor(public num: number, public den: number = 1) {
        if (den === 0) throw new Error("Denominator cannot be 0");
        const g = gcd(Math.abs(num), Math.abs(den));
        this.num = (num / g) * Math.sign(den);
        this.den = Math.abs(den / g);
    }

    mul(other: Fraction | number): Fraction {
        if (typeof other === 'number') {
            return new Fraction(this.num * other, this.den);
        }
        return new Fraction(this.num * other.num, this.den * other.den);
    }

    div(other: Fraction): Fraction {
        return new Fraction(this.num * other.den, this.den * other.num);
    }

    toNumber(): number {
        return this.num / this.den;
    }

    toKey(): string {
        return `${this.num}/${this.den}`;
    }
}

function gcd(a: number, b: number): number {
    if (!Number.isInteger(a) || !Number.isInteger(b)) return 1;
    return b === 0 ? a : gcd(b, a % b);
}

const PRIMES = [2, 3, 5, 7, 11];

export function factorInt(n: number): Record<number, number> {
    const factors: Record<number, number> = {};
    if (!Number.isInteger(n)) return factors;
    for (const p of PRIMES) {
        let count = 0;
        while (n % p === 0 && n > 0) {
            count++;
            n /= p;
        }
        factors[p] = count;
    }
    return factors;
}

export function primeVecInt(n: number): Record<number, number> {
    const f = factorInt(n);
    const vec: Record<number, number> = {};
    for (const p of PRIMES) {
        vec[p] = f[p] || 0;
    }
    return vec;
}

export type PointDerivation = { path: number[], weight: number };

export function genPoints(maxPartial: number = 5, maxDepth: number = 2): Map<string, { ratio: Fraction, weight: number, derivations: PointDerivation[] }> {
    const points = new Map<string, { ratio: Fraction, weight: number, derivations: PointDerivation[] }>();

    const add = (ratio: Fraction, w: number, path: number[]) => {
        const key = ratio.toKey();
        const existing = points.get(key);
        if (existing) {
            existing.weight += w;
            existing.derivations.push({ path, weight: w });
        } else {
            points.set(key, { ratio, weight: w, derivations: [{ path, weight: w }] });
        }
    };

    const recurse = (currentRatio: Fraction, currentWeight: number, currentPath: number[], currentDepth: number) => {
        if (currentDepth > maxDepth) return;

        const startPartial = currentDepth === 1 ? 1 : 2; // fundamental only allowed at root level
        for (let n = startPartial; n <= maxPartial; n++) {
            const nextRatio = currentRatio.mul(n);
            const nextWeight = currentWeight / n;
            const nextPath = [...currentPath, n];

            add(nextRatio, nextWeight, nextPath);
            
            // Only recurse if n > 1, because subpartials of the fundamental (n=1) 
            // are just the primary harmonics again and would cause redundant weighting.
            if (n > 1) {
                recurse(nextRatio, nextWeight, nextPath, currentDepth + 1);
            }
        }
    };

    recurse(new Fraction(1), 1, [], 1);
    
    return points;
}

export type NoteDef = { label: string, rmult: Fraction };

export type PointProvenance = { noteLabel: string, noteIndex: number, path: number[], weight: number };
export type PoolPoint = { ar: Fraction, weight: number, provenance: PointProvenance[] };

export function buildPool(notes: NoteDef[], maxDepth: number = 2, partialCount: number = 5): Array<PoolPoint> {
    const pts = genPoints(partialCount, maxDepth);
    const map = new Map<string, PoolPoint>();

    notes.forEach((note, idx) => {
        const noteIndex = idx + 1;
        for (const point of pts.values()) {
            const ar = note.rmult.mul(point.ratio);
            const arKey = ar.toKey();
            
            const provs = point.derivations.map(d => ({
                noteLabel: note.label,
                noteIndex,
                path: d.path,
                weight: d.weight
            }));

            const existing = map.get(arKey);
            if (existing) {
                existing.weight += point.weight;
                existing.provenance.push(...provs);
            } else {
                map.set(arKey, { ar, weight: point.weight, provenance: provs });
            }
        }
    });
    return Array.from(map.values());
}

export function getCents(ratio: number): number {
    return 1200 * Math.log2(ratio);
}

// Fixed canonical dictionary for 1-octave intervals (11-limit)
const GLOBAL_DICTIONARY = [
    { num: 1, den: 1 },
    { num: 16, den: 15 },
    { num: 9, den: 8 },
    { num: 6, den: 5 },
    { num: 5, den: 4 },
    { num: 4, den: 3 },
    { num: 45, den: 32 },
    { num: 11, den: 8 },
    { num: 7, den: 5 },
    { num: 3, den: 2 },
    { num: 8, den: 5 },
    { num: 5, den: 3 },
    { num: 16, den: 9 },
    { num: 7, den: 4 },
    { num: 15, den: 8 }
].map(r => new Fraction(r.num, r.den));

export function pairVector(ar1: Fraction, ar2: Fraction): Record<number, number> {
    const ratio = ar2.div(ar1);
    if (!Number.isInteger(ratio.num) || !Number.isInteger(ratio.den)) {
        return { 2: 0, 3: 0, 5: 0, 7: 0, 11: 0 };
    }
    const en = primeVecInt(ratio.num);
    const ed = primeVecInt(ratio.den);
    const vec: Record<number, number> = {};
    for (const p of PRIMES) {
        vec[p] = en[p] - ed[p];
    }
    return vec;
}

export function getPrimeCombination(vec: Record<number, number>): { label: string, product: number } {
    const parts: string[] = [];
    let product = 1;
    
    if (vec[2] !== 0) { parts.push("Du"); product *= 2; }
    if (vec[3] !== 0) { parts.push("Tri"); product *= 3; }
    if (vec[5] !== 0) { parts.push("Qui"); product *= 5; }
    if (vec[7] !== 0) { parts.push("Sep"); product *= 7; }
    if (vec[11] !== 0) { parts.push("Undec"); product *= 11; }
    
    if (parts.length === 0) {
        return { label: "Du (2)", product: 2 };
    }
    return { label: `${parts.join(" ")} (${product})`, product };
}

export type PairDetail = {
    p1: PoolPoint,
    p2: PoolPoint,
    ratio: Fraction,
    cw: number
};

export type AnalysisResult = {
    product: number,
    value: number,
    pairs: PairDetail[]
};

export function analyzeChord(notes: NoteDef[], weightThreshold: number = 0.02, jndCents: number = 15, maxDepth: number = 2, sigmaMultiplier: number = 3, filterSameTone: boolean = false, partialCount: number = 5): Map<string, AnalysisResult> {
    const pool = buildPool(notes, maxDepth, partialCount);
    pool.sort((a, b) => a.ar.toNumber() - b.ar.toNumber());

    const results = new Map<string, AnalysisResult>();
    
    const snapPool: Fraction[] = [...GLOBAL_DICTIONARY];

    for (let i = 0; i < pool.length; i++) {
        for (let j = i + 1; j < pool.length; j++) {
            const p1 = pool[i];
            const p2 = pool[j];

            let cw = 0;
            if (filterSameTone) {
                for (const prov1 of p1.provenance) {
                    for (const prov2 of p2.provenance) {
                        if (prov1.noteIndex !== prov2.noteIndex) {
                            cw += (prov1.weight * prov1.weight) * (prov2.weight * prov2.weight);
                        }
                    }
                }
            } else {
                cw = (p1.weight * p1.weight) * (p2.weight * p2.weight);
            }

            if (cw < weightThreshold) continue;

            let ratio = p2.ar.div(p1.ar);
            if (jndCents === 0) {
                const vec = pairVector(new Fraction(1), ratio);
                const { label, product } = getPrimeCombination(vec);
                const existing = results.get(label);
                if (existing) {
                    existing.value += cw;
                    existing.pairs.push({ p1, p2, ratio, cw });
                } else {
                    results.set(label, { product, value: cw, pairs: [{ p1, p2, ratio, cw }] });
                }
                continue;
            }

            let closestFrac: Fraction | null = null;
            let minCentsDiff = Infinity;
            const ratioVal = ratio.toNumber();
            
            for (const snap of snapPool) {
                const snapVal = snap.toNumber();
                // Check absolute distance modulo 1200 cents (octave invariance)
                const centsDiff = Math.abs(getCents(ratioVal) - getCents(snapVal)) % 1200;
                const normalizedDiff = centsDiff > 600 ? 1200 - centsDiff : centsDiff;
                
                if (normalizedDiff < minCentsDiff) {
                    minCentsDiff = normalizedDiff;
                    closestFrac = snap;
                }
            }

            if (closestFrac) {
                const sigma = jndCents / sigmaMultiplier;
                const weightScale = Math.exp(-Math.pow(minCentsDiff, 2) / (2 * Math.pow(sigma, 2)));
                const scaledCw = cw * weightScale;

                if (scaledCw >= weightThreshold) {
                    const snapCents = getCents(closestFrac.toNumber());
                    const ratioCents = getCents(ratioVal);
                    const octaves = Math.round((ratioCents - snapCents) / 1200);
                    
                    let adjustedSnap = closestFrac;
                    if (octaves > 0) {
                        adjustedSnap = adjustedSnap.mul(new Fraction(Math.pow(2, octaves), 1));
                    } else if (octaves < 0) {
                        adjustedSnap = adjustedSnap.div(new Fraction(Math.pow(2, -octaves), 1));
                    }

                    const vec = pairVector(new Fraction(1), adjustedSnap);
                    const { label, product } = getPrimeCombination(vec);
                    
                    const existing = results.get(label);
                    if (existing) {
                        existing.value += scaledCw;
                        existing.pairs.push({ p1, p2, ratio, cw: scaledCw });
                    } else {
                        results.set(label, { product, value: scaledCw, pairs: [{ p1, p2, ratio, cw: scaledCw }] });
                    }
                }
            }
        }
    }
    return results;
}

