import { describe, it, expect } from 'vitest';
import { parseSafeMetadata } from '../parseComponents';

describe('parseComponents', () => {
  describe('parseSafeMetadata', () => {
    it('should parse simple objects', () => {
      const objStr = `{ 'min-width': { type: 'number', default: 100 } }`;
      const result = parseSafeMetadata(objStr);
      expect(result).toEqual({ 'min-width': { type: 'number', default: 100 } });
    });

    it('should parse boolean, arrays and unary expressions', () => {
       const objStr = `{
          visible: { type: 'boolean', default: false },
          colors: ['red', 'blue', 'green'],
          offset: -10,
          undef: undefined
       }`;
       const result = parseSafeMetadata(objStr);
       expect(result).toEqual({
           visible: { type: 'boolean', default: false },
           colors: ['red', 'blue', 'green'],
           offset: -10,
           undef: undefined
       });
    });

    it('should throw error for unsupported types', () => {
        const objStr = `{ func: () => {} }`;
        expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported AST node type: ArrowFunctionExpression');
    });
  });
});
