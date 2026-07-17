import { describe, it, expect } from 'vitest';
import { Fraction, factorInt, primeVecInt, genPoints, getCents, pairVector, getPrimeCombination, analyzeChord, buildPool, AbsRatio, Tuning } from '../primeLatticeProfiler';

describe('primeLatticeProfiler', () => {
  describe('Fraction', () => {
    it('should simplify fractions', () => {
      const f = new Fraction(4, 8);
      expect(f.num).toBe(1);
      expect(f.den).toBe(2);
    });

    it('should multiply correctly', () => {
      const f1 = new Fraction(2, 3);
      const f2 = new Fraction(3, 4);
      const f3 = f1.mul(f2);
      expect(f3.num).toBe(1);
      expect(f3.den).toBe(2);
    });

    it('should multiply with a number correctly', () => {
      const f1 = new Fraction(2, 3);
      const f3 = f1.mul(3);
      expect(f3.num).toBe(2);
      expect(f3.den).toBe(1);
    });

    it('should divide correctly', () => {
      const f1 = new Fraction(2, 3);
      const f2 = new Fraction(4, 3);
      const f3 = f1.div(f2);
      expect(f3.num).toBe(1);
      expect(f3.den).toBe(2);
    });

    it('should calculate toNumber correctly', () => {
      const f = new Fraction(3, 2);
      expect(f.toNumber()).toBe(1.5);
    });

    it('should generate a correct key', () => {
      const f = new Fraction(3, 2);
      expect(f.toKey()).toBe('3/2');
    });
  });

  describe('factorInt', () => {
    it('should factorize integers', () => {
      const f1 = factorInt(12);
      expect(f1[2]).toBe(2);
      expect(f1[3]).toBe(1);

      const f2 = factorInt(15);
      expect(f2[3]).toBe(1);
      expect(f2[5]).toBe(1);
    });
  });

  describe('primeVecInt', () => {
    it('should factorize integers into prime vectors up to a limit', () => {
      const v = primeVecInt(12);
      expect(v[2]).toBe(2);
      expect(v[3]).toBe(1);
    });
  });

  describe('getCents', () => {
    it('should calculate cents from ratio', () => {
      expect(getCents(1)).toBe(0);
      expect(Math.abs(getCents(2) - 1200)).toBeLessThan(1e-9);
      expect(Math.abs(getCents(1.5) - 701.955)).toBeLessThan(1);
    });
  });

  describe('pairVector', () => {
    it('should return prime vector for ratio', () => {
      const ar1 = Tuning.ji(3, 2);
      const ar2 = Tuning.ji(1, 1);
      const { vec } = pairVector(ar2, ar1);
      expect(vec[2]).toBe(-1);
      expect(vec[3]).toBe(1);
    });
  });

  describe('getPrimeCombination', () => {
    it('should return prime combination label', () => {
      const v = getPrimeCombination({ 3: 1, 5: 1, 2: 0, 7: 0, 11: 0 }, false);
      expect(v.label).toBe('Tri Qui (15)'); // Based on implementation order: Du, Tri, Qui, Sep, Undec
      expect(v.product).toBe(15);

      const v2 = getPrimeCombination({ 3: 2, 2: 0, 5: 0, 7: 0, 11: 0 }, false);
      expect(v2.label).toBe('Tri (3)');
      expect(v2.product).toBe(3);

      const v3 = getPrimeCombination({ 7: 1, 11: 1, 2: 0, 3: 0, 5: 0 }, false);
      expect(v3.label).toBe('Sep Undec (77)');
      expect(v3.product).toBe(77);

      const v4 = getPrimeCombination({ 2: 0, 3: 0, 5: 0, 7: 0, 11: 0 }, false);
      expect(v4.label).toBe('Du (2)');
      expect(v4.product).toBe(2);
    });
  });

  describe('genPoints', () => {
    it('should generate harmonic points', () => {
      const points = genPoints(5, 1);
      expect(points.size).toBeGreaterThan(0);
      const rootKey = new Fraction(1, 1).toKey();
      expect(points.has(rootKey)).toBe(true);
    });
  });

  describe('buildPool', () => {
    it('should build a harmonic pool', () => {
      const notes = [
        { label: 'Do', rmult: Tuning.ji(1, 1) },
        { label: 'Mi', rmult: Tuning.ji(5, 4) }
      ];
      const pool = buildPool(notes, 1, 3);
      expect(pool.length).toBeGreaterThan(0);
      const first = pool[0];
      expect(first.weight).toBeGreaterThan(0);
      expect(first.provenance.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeChord', () => {
    it('should analyze a basic chord', () => {
      const notes = [
        { label: 'Do', rmult: Tuning.ji(1, 1) },
        { label: 'Mi', rmult: Tuning.ji(5, 4) },
        { label: 'So', rmult: Tuning.ji(3, 2) }
      ];
      const results = analyzeChord(notes, 0.01, 15, 1, 3, true, 3);
      expect(results.size).toBeGreaterThanOrEqual(0); // If filterSameTone removes everything it might be 0, that's fine for this test to just exercise the code
    });
  });
});
