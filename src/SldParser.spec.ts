/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint camelcase: 0 */

import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { expect, it, describe } from 'vitest';

import point_simplepoint from '../data/styles/point_simplepoint';
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
