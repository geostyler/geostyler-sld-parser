import { describe, expect, it } from 'vitest';

import { isNil, sldNumberOperatorOrFunctionOrTextToGeostyler } from './SldUtil';

describe('isNil', () => {
  it('is defined', () => {
    expect(isNil).toBeDefined();
  });

  it('returns true for null and undefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('returns false for falsy values that are present', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil(-0)).toBe(false);
    expect(isNil(NaN)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
  });

  it('returns false for truthy values', () => {
    expect(isNil(1)).toBe(false);
    expect(isNil('a')).toBe(false);
    expect(isNil(true)).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
  });

  it('returns false for GeoStylerFunction expressions', () => {
    expect(isNil({ name: 'property', args: ['size'] })).toBe(false);
  });
});

describe('sldNumberOperatorOrFunctionOrTextToGeostyler', () => {
  it('is defined', () => {
    expect(sldNumberOperatorOrFunctionOrTextToGeostyler).toBeDefined();
  });

  it('parses a plain text value', () => {
    expect(sldNumberOperatorOrFunctionOrTextToGeostyler({ '#text': 45 })).toBe(45);
  });

  it('parses a plain text value of 0', () => {
    expect(sldNumberOperatorOrFunctionOrTextToGeostyler({ '#text': 0 })).toBe(0);
  });

  it('parses a Literal value of 0', () => {
    expect(sldNumberOperatorOrFunctionOrTextToGeostyler({ Literal: [{ '#text': 0 }] })).toBe(0);
  });
});
