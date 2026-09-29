import { describe, expect, it } from 'vitest';

import {
  concatenateAllSldElements,
  deconcatenateAllSldElements,
  isNil,
  sldNumberOperatorOrFunctionOrTextToGeostyler
} from './SldUtil';

describe('concatenateSldElements', () => {
  it('concatenates 1 SLD elements', () => {
    const sldElement = [{ '#text': 1 }];
    const result = concatenateAllSldElements(sldElement);
    expect(result).toEqual(sldElement);
  });

  it('concatenates 2 SLD elements', () => {
    const sldElements = [{ '#text': 1 }, { '#text': 2 }];
    const result = concatenateAllSldElements(sldElements);
    expect(result).toEqual([{
      'ogc:Function': sldElements.reverse(),
      ':@': {
        '@_name': 'Concatenate'
      }
    }]);
  });

  it('concatenates more SLD elements', () => {
    const sldElements = [{ '#text': 1 }, { '#text': 2 }, { 'text': 3 }];
    const result = concatenateAllSldElements(sldElements);
    expect(result).toEqual([{
      'ogc:Function': [
        sldElements[2],
        {
          'ogc:Function': [
            sldElements[1],
            sldElements[0],
          ],
          ':@': {
            '@_name': 'Concatenate'
          }
        }
      ],
      ':@': {
        '@_name': 'Concatenate'
      }
    }]);
  });

  it('deconcatenate all sld elements', () => {
    const sldElements = [{ '#text': 1 }, { '#text': 2 }, { 'text': 3 }, { 'text': 4 }];
    const concatenatedElement = concatenateAllSldElements(sldElements)[0];
    const result = deconcatenateAllSldElements(concatenatedElement);
    expect(result).toEqual(sldElements);
  });

});

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
