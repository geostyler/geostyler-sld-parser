/* eslint camelcase: 0 */

import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { expect, it, describe } from 'vitest';

// @ts-ignore
import point_simplepoint from '../data/styles/point_simplepoint';
// @ts-ignore
import cdata from '../data/styles/cdata';

describe('SldStyleParser implements StyleParser (reading from one version and writing to another version)', () => {
  it('can read and write a SLD PointSymbolizer (from 1.0.0 version to 1.1.0 version)', async () => {
    const styleParser = new SldStyleParser({sldVersion: '1.1.0'});

    const sld = fs.readFileSync('./data/slds/1.0/point_simplepoint.sld', 'utf8');
    const { output: geoStylerStyle } = await styleParser.readStyle(sld);
    expect(geoStylerStyle).toBeDefined();
    expect(geoStylerStyle).toEqual(point_simplepoint);

    // writing
    const {
      output: sldString,
      errors
    } = await styleParser.writeStyle(geoStylerStyle!);
    expect(sldString).toBeDefined();
    expect(errors).toBeUndefined();

    // As string comparison between two XML-Strings is awkward and nonsens
    // we read it again and compare the json input with the parser output
    const { output: readStyle } = await styleParser.readStyle(sldString!);
    expect(readStyle).toEqual(point_simplepoint);
  });
  it('can read and write a SLD PointSymbolizer (from 1.1.0 version to 1.0.0 version)', async () => {
    const styleParser = new SldStyleParser({sldVersion: '1.0.0'});

    const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint.sld', 'utf8');
    const { output: geoStylerStyle } = await styleParser.readStyle(sld);
    expect(geoStylerStyle).toBeDefined();
    expect(geoStylerStyle).toEqual(point_simplepoint);

    // writing
    const {
      output: sldString,
      errors
    } = await styleParser.writeStyle(geoStylerStyle!);
    expect(sldString).toBeDefined();
    expect(errors).toBeUndefined();

    // As string comparison between two XML-Strings is awkward and nonsens
    // we read it again and compare the json input with the parser output
    const { output: readStyle } = await styleParser.readStyle(sldString!);
    expect(readStyle).toEqual(point_simplepoint);
  });

  it('can read CDATA values', async () => {
    const styleParser = new SldStyleParser({
      sldVersion: '1.0.0'
    });

    const sld = fs.readFileSync('./data/slds/1.0/cdata.sld', 'utf8');
    const { output: geoStylerStyle } = await styleParser.readStyle(sld);
    expect(geoStylerStyle).toBeDefined();
    expect(geoStylerStyle).toEqual(cdata);
  });
});

describe('Test Anchor-Point-Conversions', () => {
  it('transforms the sld-Anchorpoint-values to geostyler-anchors', async () => {
    const test1 = new SldStyleParser().getAnchorFromSldAnchorPoint(0.0,0.0);
    expect(test1).toEqual('bottom-left');
    const test2 = new SldStyleParser().getAnchorFromSldAnchorPoint(1.0,1.0);
    expect(test2).toEqual('top-right');
    const test3 = new SldStyleParser().getAnchorFromSldAnchorPoint(0.5,1.0);
    expect(test3).toEqual('top');
    const test4 = new SldStyleParser().getAnchorFromSldAnchorPoint(0.45,0.9);
    expect(test4).toEqual('top');
    const test5 = new SldStyleParser().getAnchorFromSldAnchorPoint(0.5,0.5);
    expect(test5).toBeUndefined();
    const test6 = new SldStyleParser().getAnchorFromSldAnchorPoint(undefined,undefined);
    expect(test6).toBeUndefined();
  });
  it('transformes the geostyler-anchors to sld-Anchopoint-values', async () => {
    const test1 = new SldStyleParser().getSldAnchorPointFromAnchor('bottom-left','x');
    expect(test1).toEqual(0.0);
    const test2 = new SldStyleParser().getSldAnchorPointFromAnchor('bottom-left','y');
    expect(test2).toEqual(0.0);
    const test3 = new SldStyleParser().getSldAnchorPointFromAnchor('bottom','x');
    expect(test3).toEqual(0.5);
    const test4 = new SldStyleParser().getSldAnchorPointFromAnchor('bottom','y');
    expect(test4).toEqual(0.0);
    const test5 = new SldStyleParser().getSldAnchorPointFromAnchor('center','x');
    expect(test5).toEqual(0.5);
    const test6 = new SldStyleParser().getSldAnchorPointFromAnchor('center','y');
    expect(test6).toEqual(0.5);
    const test7 = new SldStyleParser().getAnchorFromSldAnchorPoint(undefined,'x');
    expect(test7).toBeUndefined();
  });
});
