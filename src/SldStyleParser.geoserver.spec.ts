/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint camelcase: 0 */
import fs from 'fs';
import SldStyleParser from './SldStyleParser';

import burg from '../data/styles/geoserver/burg';
import capitals from '../data/styles/geoserver/capitals';
import default_generic from '../data/styles/geoserver/default_generic';
// import pophatch from '../data/styles/geoserver/pophatch';

it('SldStyleParser is defined', () => {
  expect(SldStyleParser).toBeDefined();
});

describe('SldStyleParser implements StyleParser', () => {
  let styleParser: SldStyleParser;

  beforeEach(() => {
    styleParser = new SldStyleParser();
  });

  describe('#readStyle', () => {
    it('can read the geoserver burg.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/burg.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(burg);
    });
    it('can read the geoserver captials.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/capitals.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(capitals);
    });
    it('can read the geoserver default_generic.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/default_generic.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(default_generic);
    });
    // it('can read the geoserver pophatch.sld', async () => {
    //   const sld = fs.readFileSync('./data/slds/geoserver/pophatch.sld', 'utf8');
    //   const { output: geoStylerStyle } = await styleParser.readStyle(sld);
    //   expect(geoStylerStyle).toBeDefined();
    //   expect(geoStylerStyle).toEqual(pophatch);
    // });
  });

  describe('#writeStyle', () => {
    it('is defined', () => {
      expect(styleParser.writeStyle).toBeDefined();
    });

    it('can write the geoserver burg.sld', async () => {
      const {
        output: sldString,
        errors,
        warnings,
        unsupportedProperties
      } = await styleParser.writeStyle(burg);
      expect(sldString).toBeDefined();
      expect(errors).toBeUndefined();
      expect(warnings).toBeUndefined();
      expect(unsupportedProperties).toBeUndefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(burg);
    });

  });

});
