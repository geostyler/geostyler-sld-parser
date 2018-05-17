import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { Style } from 'geostyler-style';

it('SldStyleParser is defined', () => {
  expect(SldStyleParser).toBeDefined();
});

describe('SldStyleParser implements StyleParser', () => {

  describe('#readStyle', () => {
    it('is defined', () => {
      const styleParser = new SldStyleParser();
      expect(styleParser.readStyle).toBeDefined();
    });
    it('can read a point SLD style', () => {
      const styleParser = new SldStyleParser();
      expect.assertions(1);
      const sld = fs.readFileSync( './data/slds/point_simplepoint.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
        });
    });
    it('can read a line SLD style', () => {
      const styleParser = new SldStyleParser();
      expect.assertions(1);
      const sld = fs.readFileSync( './data/slds/line_simpleline.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
        });
    });
    it('can read a fill SLD style', () => {
      const styleParser = new SldStyleParser();
      expect.assertions(1);
      const sld = fs.readFileSync( './data/slds/polygon_transparentpolygon.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
        });
    });
    it('can read a SLD style with a filter', () => {
      const styleParser = new SldStyleParser();
      expect.assertions(1);
      const sld = fs.readFileSync( './data/slds/point_simplepoint_filter.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
        });
    });
  });

  it('writeStyle is defined', () => {
    const styleParser = new SldStyleParser();
    expect(styleParser.writeStyle).toBeDefined();
  });
});
