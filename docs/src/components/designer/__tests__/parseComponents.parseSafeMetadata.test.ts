import { describe, it, expect } from 'vitest';
import { parseSafeMetadata } from '../parseComponents.js';

describe('parseComponents.parseSafeMetadata', () => {
  it('should parse simple objects', () => {
    const objStr = `{ a: 1, b: 'string', c: true }`;
    const res = parseSafeMetadata(objStr);
    expect(res).toEqual({ a: 1, b: 'string', c: true });
  });

  it('should parse nested objects', () => {
    const objStr = `{ a: { b: 1 } }`;
    const res = parseSafeMetadata(objStr);
    expect(res).toEqual({ a: { b: 1 } });
  });

  it('should parse arrays', () => {
    const objStr = `{ a: [1, 'two', false] }`;
    const res = parseSafeMetadata(objStr);
    expect(res).toEqual({ a: [1, 'two', false] });
  });

  it('should parse negative numbers', () => {
    const objStr = `{ a: -1 }`;
    const res = parseSafeMetadata(objStr);
    expect(res).toEqual({ a: -1 });
  });

  it('should parse undefined', () => {
    const objStr = `{ a: undefined }`;
    const res = parseSafeMetadata(objStr);
    expect(res).toEqual({ a: undefined });
  });

  it('should throw on unsupported identifiers', () => {
    const objStr = `{ a: someVar }`;
    expect(() => parseSafeMetadata(objStr)).toThrow('Unsupported identifier: someVar');
  });
});
