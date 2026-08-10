import { describe, it, expect } from 'vitest';
import { parseSafeMetadata } from '../parseComponents';

describe('parseSafeMetadata', () => {
  it('should throw error for unsupported unary expression', () => {
    const objStr = `{ unsupported: -'string' }`;
    expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported unary expression');
  });

  it('should throw error for unsupported identifier', () => {
    const objStr = `{ unsupported: window }`;
    expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported identifier: window');
  });

  it('should throw error for unsupported AST node type', () => {
    const objStr = `{ unsupported: function(){} }`;
    expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported AST node type');
  });

  it('should throw error for unsupported property type', () => {
    // A spread element might generate a non-Property type in ObjectExpression
    const objStr = `{ ...{} }`;
    expect(() => parseSafeMetadata(objStr)).toThrowError('Unsupported property type: SpreadElement');
  });
});
