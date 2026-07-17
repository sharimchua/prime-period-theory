// ============================================================
// PPT Chord/Interharmonic Analysis
// ============================================================
// Changes from previous version:
//   1. Classification is now EXACT and SYMBOLIC (prime-exponent
//      vectors), not derived by dividing Fractions and factoring
//      the result. This removes the implicit octave-reduction that
//      integer div/factor forced, so register-sensitive comparisons
//      (C4->G4 vs C4->G5) are distinguished correctly.
//   2. GLOBAL_DICTIONARY is gone. In its place, findSimplicityAnchor
//      derives the nearest low-complexity rational approximation to
//      a ratio via continued-fraction convergents (Stern-Brocot),
//      bounded by a complexity ceiling (maxDenominator) rather than
//      a fixed hand-curated list. This is used ONLY as a confidence
//      weight -- it never overrides the exact classification.
//   3. Irrational tuning points (12TET degrees, the sqrt(2) Axis,
//      or any arbitrary root) are first-class via AbsRatio, carrying
//      a real-valued (possibly fractional) exponent per prime. They
//      skip the simplicity search entirely -- there's no simpler
//      rational target to be "close to" by design -- and classify
//      directly from their exact exponent vector.
//   4. Self-closure: if an irrational-tagged AbsRatio's exponents
//      happen to land on integers after combination (e.g. two
//      stacked tritones -> exactly 2/1), it's automatically
//      reclassified as rational.
// ============================================================

// ------------------------------------------------------------
// Rational arithmetic (unchanged) -- partial stacking (genPoints)
// always deals in integer partial numbers, so it stays exact
// Fraction arithmetic. Irrationality only enters via NoteDef.rmult.
// ------------------------------------------------------------
export class Fraction {
  constructor(
    public num: number,
    public den: number = 1,
  ) {
    if (den === 0) throw new Error("Denominator cannot be 0");
    const g = gcd(Math.abs(num), Math.abs(den));
    this.num = (num / g) * Math.sign(den);
    this.den = Math.abs(den / g);
  }

  mul(other: Fraction | number): Fraction {
    if (typeof other === "number") {
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
const FAMILY_NAMES: Record<number, string> = {
  2: "Du",
  3: "Tri",
  5: "Qui",
  7: "Sep",
  11: "Undec",
};

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

export function getCents(ratio: number): number {
  return 1200 * Math.log2(ratio);
}

// ------------------------------------------------------------
// AbsRatio: symbolic prime-exponent vector. Exponents may be
// fractional/irrational (EDO degrees, Axis points) or plain
// integers (ordinary JI ratios). All chord-point arithmetic
// (partial stacking x register/tuning) happens by adding these
// vectors, so no numeric division or factoring is ever needed
// downstream -- comparisons stay exact all the way through.
// ------------------------------------------------------------
export type PrimeVec = Record<number, number>;

export class AbsRatio {
  constructor(
    public vec: PrimeVec,
    public irrational: boolean = false,
  ) {
    for (const p of PRIMES) if (this.vec[p] === undefined) this.vec[p] = 0;
  }

  static rational(f: Fraction): AbsRatio {
    const numVec = primeVecInt(Math.abs(f.num));
    const denVec = primeVecInt(f.den);
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = (numVec[p] || 0) - (denVec[p] || 0);
    return new AbsRatio(vec, false);
  }

  /**
   * A degree of an N-EDO system, e.g. edoStep(6, 12) is the 12TET
   * tritone: 2^(6/12) = 2^0.5. If steps/edo happens to reduce to an
   * integer exponent (e.g. edoStep(12,12) = 2^1, the octave), this
   * is tagged rational automatically.
   */
  static edoStep(
    steps: number,
    edo: number = 12,
    basePrime: number = 2,
  ): AbsRatio {
    const exp = steps / edo;
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = 0;
    vec[basePrime] = exp;
    return new AbsRatio(vec, !Number.isInteger(exp));
  }

  /** An arbitrary irrational axis point, e.g. axisPoint(2, 2) = sqrt(2). */
  static axisPoint(basePrime: number = 2, rootDegree: number = 2): AbsRatio {
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = 0;
    vec[basePrime] = 1 / rootDegree;
    return new AbsRatio(vec, rootDegree !== 1);
  }

  mul(other: AbsRatio): AbsRatio {
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = (this.vec[p] || 0) + (other.vec[p] || 0);
    return new AbsRatio(vec, this.irrational || other.irrational);
  }

  div(other: AbsRatio): AbsRatio {
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = (this.vec[p] || 0) - (other.vec[p] || 0);
    return new AbsRatio(vec, this.irrational || other.irrational);
  }

  pow(k: number): AbsRatio {
    const vec: PrimeVec = {};
    for (const p of PRIMES) vec[p] = (this.vec[p] || 0) * k;
    return new AbsRatio(vec, this.irrational);
  }

  toNumber(): number {
    let v = 1;
    for (const p of PRIMES) {
      const e = this.vec[p] || 0;
      if (e !== 0) v *= Math.pow(p, e);
    }
    return v;
  }

  /**
   * Self-closure check: an AbsRatio tagged irrational at construction
   * (e.g. a single tritone) may still land back on integer exponents
   * after combination (e.g. two tritones stacked -> Du exponent 1
   * exactly). This detects that and lets pairVector reclassify it
   * as rational.
   */
  isEffectivelyRational(epsilon: number = 1e-9): boolean {
    for (const p of PRIMES) {
      const e = this.vec[p] || 0;
      if (Math.abs(e - Math.round(e)) > epsilon) return false;
    }
    return true;
  }

  toKey(): string {
    const parts = PRIMES.map((p) => {
      const e = this.vec[p] || 0;
      return Math.abs(e) > 1e-9 ? `${p}^${e.toFixed(6)}` : null;
    }).filter((x): x is string => x !== null);
    return parts.length ? parts.join("_") : "1";
  }
}

// ------------------------------------------------------------
// Convenience constructors for note tuning definitions -- mix
// JI, N-EDO, and explicit irrational axis points freely.
// ------------------------------------------------------------
export const Tuning = {
  ji: (num: number, den: number = 1): AbsRatio =>
    AbsRatio.rational(new Fraction(num, den)),
  edo: (steps: number, edo: number = 12): AbsRatio =>
    AbsRatio.edoStep(steps, edo),
  axis: (basePrime: number = 2, rootDegree: number = 2): AbsRatio =>
    AbsRatio.axisPoint(basePrime, rootDegree),
};

// ------------------------------------------------------------
// genPoints: unchanged. Partial stacking is always over integer
// partial numbers, so it stays exact Fraction arithmetic -- this
// is the literal "5th partial of the 5th partial" recursion.
// ------------------------------------------------------------
export type PointDerivation = { path: number[]; weight: number };

export function genPoints(
  maxPartial: number = 5,
  maxDepth: number = 2,
): Map<
  string,
  { ratio: Fraction; weight: number; derivations: PointDerivation[] }
> {
  const points = new Map<
    string,
    { ratio: Fraction; weight: number; derivations: PointDerivation[] }
  >();

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

  const recurse = (
    currentRatio: Fraction,
    currentWeight: number,
    currentPath: number[],
    currentDepth: number,
  ) => {
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

// ------------------------------------------------------------
// NoteDef now carries an AbsRatio register/tuning multiplier
// instead of a plain Fraction, so a chord can freely mix JI notes,
// N-EDO notes, and explicit irrational axis points.
// ------------------------------------------------------------
export type NoteDef = { label: string; rmult: AbsRatio };

export type PointProvenance = {
  noteLabel: string;
  noteIndex: number;
  path: number[];
  weight: number;
};
export type PoolPoint = {
  ar: AbsRatio;
  weight: number;
  provenance: PointProvenance[];
};

export function buildPool(
  notes: NoteDef[],
  maxDepth: number = 2,
  partialCount: number = 5,
): Array<PoolPoint> {
  const pts = genPoints(partialCount, maxDepth);
  const map = new Map<string, PoolPoint>();

  notes.forEach((note, idx) => {
    const noteIndex = idx + 1;
    for (const point of pts.values()) {
      const ar = note.rmult.mul(AbsRatio.rational(point.ratio));
      const arKey = ar.toKey();

      const provs = point.derivations.map((d) => ({
        noteLabel: note.label,
        noteIndex,
        path: d.path,
        weight: d.weight,
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

// ------------------------------------------------------------
// pairVector: exact symbolic subtraction of exponent vectors.
// No integer-ratio requirement, no octave folding -- C4->G4 and
// C4->G5 are genuinely different vectors, as intended.
// ------------------------------------------------------------
export function pairVector(
  ar1: AbsRatio,
  ar2: AbsRatio,
): { vec: PrimeVec; irrational: boolean } {
  const diff = ar2.div(ar1);
  const stillIrrational = diff.irrational && !diff.isEffectivelyRational();
  return { vec: diff.vec, irrational: stillIrrational };
}

export function getPrimeCombination(
  vec: PrimeVec,
  irrational: boolean,
): { label: string; product: number | null } {
  const parts: string[] = [];
  let product = 1;
  let anyNonInteger = false;

  for (const p of PRIMES) {
    const e = vec[p] || 0;
    if (Math.abs(e) > 1e-9) {
      const famName = FAMILY_NAMES[p];
      if (Number.isInteger(e)) {
        parts.push(famName);
      } else {
        parts.push(`${famName}*${e.toFixed(3)}`); // fractional-exponent marker
        anyNonInteger = true;
      }
      product *= p; // presence indicator only, not exponentiated magnitude
    }
  }

  if (parts.length === 0) {
    return { label: "Unison (1)", product: 1 };
  }

  const finalProduct = anyNonInteger || irrational ? null : product;
  return {
    label: `${parts.join(" ")} (${finalProduct ?? "irrational"})`,
    product: finalProduct,
  };
}

// ------------------------------------------------------------
// Option A: derive a "simplicity anchor" via continued-fraction
// convergents (Stern-Brocot search), bounded by a complexity
// ceiling, instead of a fixed hand-curated dictionary. Used ONLY
// to weight confidence -- classification always comes from the
// exact vec above, never from this approximation.
// ------------------------------------------------------------
export type SimplicityMatch = {
  fraction: Fraction;
  centsDiff: number; // octave-class distance in cents
  complexity: number; // Tenney height: log2(num * den)
};

function continuedFractionConvergents(
  x: number,
  maxDen: number,
): Array<{ num: number; den: number }> {
  const convergents: Array<{ num: number; den: number }> = [];
  const a0 = Math.floor(x);
  let h_prev2 = 1,
    h_prev1 = a0;
  let k_prev2 = 0,
    k_prev1 = 1;
  convergents.push({ num: h_prev1, den: k_prev1 });

  let frac = x - a0;
  let iterations = 0;
  while (frac > 1e-12 && iterations < 30) {
    const inv = 1 / frac;
    const a = Math.floor(inv);
    const h = a * h_prev1 + h_prev2;
    const k = a * k_prev1 + k_prev2;
    if (k > maxDen) break;
    convergents.push({ num: h, den: k });
    h_prev2 = h_prev1;
    h_prev1 = h;
    k_prev2 = k_prev1;
    k_prev1 = k;
    frac = inv - a;
    iterations++;
  }
  return convergents;
}

/**
 * Finds the simplest rational approximation to `ratioVal` (any positive
 * real; octave-reduced to [1,2) for the search) within `maxDenominator`
 * complexity, via continued-fraction convergents -- no fixed list.
 * Continued-fraction convergents are, by construction, the best rational
 * approximations achievable at their complexity -- each successive
 * convergent both increases in denominator AND strictly improves
 * precision. So the simplicity/precision tradeoff is already baked into
 * the sequence itself: the last convergent within maxDenominator is the
 * best-fitting ratio available at or below that complexity ceiling.
 */
export function findSimplicityAnchor(
  ratioVal: number,
  maxDenominator: number = 64,
): SimplicityMatch | null {
  let reduced = ratioVal;
  while (reduced >= 2) reduced /= 2;
  while (reduced < 1) reduced *= 2;

  const convergents = continuedFractionConvergents(reduced, maxDenominator);
  if (convergents.length === 0) return null;

  const { num, den } = convergents[convergents.length - 1];
  if (num <= 0 || den <= 0) return null;
  const approxVal = num / den;
  const centsDiff = Math.abs(getCents(reduced) - getCents(approxVal));
  const complexity = Math.log2(num * den);
  return { fraction: new Fraction(num, den), centsDiff, complexity };
}

export function simplicityConfidence(
  centsDiff: number,
  jndCents: number,
  sigmaMultiplier: number = 3,
): number {
  const sigma = jndCents / sigmaMultiplier;
  return Math.exp(-Math.pow(centsDiff, 2) / (2 * Math.pow(sigma, 2)));
}

// ------------------------------------------------------------
// analyzeChord: classification is exact (from pairVector); JND
// enters only as a derived confidence weight on rational pairs.
// Irrational pairs (EDO degrees, Axis points not self-closing to
// rational) skip the simplicity search entirely and are weighted
// by cw alone.
// ------------------------------------------------------------
export type PairDetail = {
  p1: PoolPoint;
  p2: PoolPoint;
  ratioVal: number;
  cw: number;
  simplicity?: SimplicityMatch;
};

export type AnalysisResult = {
  product: number | null;
  value: number;
  pairs: PairDetail[];
};

export function analyzeChord(
  notes: NoteDef[],
  weightThreshold: number = 0.02,
  jndCents: number = 15,
  maxDepth: number = 2,
  sigmaMultiplier: number = 3,
  filterSameTone: boolean = false,
  partialCount: number = 5,
  maxDenominator: number = 64,
): Map<string, AnalysisResult> {
  const pool = buildPool(notes, maxDepth, partialCount);
  pool.sort((a, b) => a.ar.toNumber() - b.ar.toNumber());

  const results = new Map<string, AnalysisResult>();

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const p1 = pool[i];
      const p2 = pool[j];

      let cw = 0;
      if (filterSameTone) {
        for (const prov1 of p1.provenance) {
          for (const prov2 of p2.provenance) {
            if (prov1.noteIndex !== prov2.noteIndex) {
              cw += prov1.weight * prov1.weight * (prov2.weight * prov2.weight);
            }
          }
        }
      } else {
        cw = p1.weight * p1.weight * (p2.weight * p2.weight);
      }

      if (cw < weightThreshold) continue;

      // Exact, register-sensitive, un-octave-reduced symbolic comparison.
      const { vec, irrational } = pairVector(p1.ar, p2.ar);
      const ratioVal = p2.ar.toNumber() / p1.ar.toNumber();

      let finalWeight = cw;
      let simplicity: SimplicityMatch | undefined;

      let classificationVec = vec;
      let isIrrational = irrational;

      if (jndCents > 0) {
        simplicity =
          findSimplicityAnchor(ratioVal, maxDenominator) ?? undefined;
        if (simplicity) {
          const confidence = simplicityConfidence(
            simplicity.centsDiff,
            jndCents,
            sigmaMultiplier,
          );
          finalWeight = cw * confidence;

          if (confidence > 0) {
            const snapRatio = Tuning.rational(simplicity.fraction);
            const snapDiff = pairVector(Tuning.ji(1, 1), snapRatio);
            classificationVec = snapDiff.vec;
            isIrrational = snapDiff.irrational;
          }
        }
      }

      if (finalWeight < weightThreshold) continue;

      // If a pair is still irrational (e.g. an EDO degree that didn't snap),
      // we exclude it from prime classification rather than generating irrational buckets.
      if (isIrrational) continue;

      const { label, product } = getPrimeCombination(classificationVec, isIrrational);
      const existing = results.get(label);
      if (existing) {
        existing.value += finalWeight;
        existing.pairs.push({ p1, p2, ratioVal, cw: finalWeight, simplicity });
      } else {
        results.set(label, {
          product,
          value: finalWeight,
          pairs: [{ p1, p2, ratioVal, cw: finalWeight, simplicity }],
        });
      }
    }
  }
  return results;
}
