/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint camelcase: 0 */
import fs from 'fs';
import SldStyleParser from './SldStyleParser';

import burg from '../data/styles/geoserver/burg';
import capitals from '../data/styles/geoserver/capitals';
import default_generic from '../data/styles/geoserver/default_generic';
import default_line from '../data/styles/geoserver/default_line';
import default_line2 from '../data/styles/geoserver/default_line2';
import default_point from '../data/styles/geoserver/default_point';
import default_polygon from '../data/styles/geoserver/default_polygon';
import dem from '../data/styles/geoserver/dem';
import giant_polygon from '../data/styles/geoserver/giant_polygon';
import grass_poly from '../data/styles/geoserver/grass_poly';
import green from '../data/styles/geoserver/green';
import Lakes from '../data/styles/geoserver/Lakes';
import NamedPlaces from '../data/styles/geoserver/NamedPlaces';
import poi from '../data/styles/geoserver/poi';
import poly_landmarks from '../data/styles/geoserver/poly_landmarks';
import pophatch from '../data/styles/geoserver/pophatch';
import popshade from '../data/styles/geoserver/popshade';
import rain from '../data/styles/geoserver/rain';
import raster from '../data/styles/geoserver/raster';
import restricted from '../data/styles/geoserver/restricted';
import simple_streams from '../data/styles/geoserver/simple_streams';
import simpleRoads from '../data/styles/geoserver/simpleRoads';
import tiger_roads from '../data/styles/geoserver/tiger_roads';

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
    it('can read the geoserver default_line.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/default_line.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(default_line);
    });
    it('can read the geoserver default_line2.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/default_line2.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(default_line2);
    });
    it('can read the geoserver default_point.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/default_point.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(default_point);
    });
    it('can read the geoserver default_polygon.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/default_polygon.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(default_polygon);
    });
    it('can read the geoserver dem.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/dem.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(dem);
    });
    it('can read the geoserver giant_polygon.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/giant_polygon.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(giant_polygon);
    });
    it('can read the geoserver grass_poly.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/grass_poly.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(grass_poly);
    });
    it('can read the geoserver green.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/green.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(green);
    });
    it('can read the geoserver Lakes.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/Lakes.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(Lakes);
    });
    it('can read the geoserver NamedPlaces.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/NamedPlaces.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(NamedPlaces);
    });
    it('can read the geoserver poi.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/poi.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(poi);
    });
    it('can read the geoserver poly_landmarks.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/poly_landmarks.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(poly_landmarks);
    });
    it('can read the geoserver pophatch.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/pophatch.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(pophatch);
    });
    it('can read the geoserver popshade.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/popshade.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(popshade);
    });
    it('can read the geoserver rain.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/rain.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(rain);
    });
    it('can read the geoserver raster.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/raster.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(raster);
    });
    it('can read the geoserver restricted.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/restricted.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(restricted);
    });
    it('can read the geoserver simple_streams.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/simple_streams.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(simple_streams);
    });
    it('can read the geoserver simpleRoads.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/simpleRoads.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(simpleRoads);
    });
    it('can read the geoserver tiger_roads.sld', async () => {
      const sld = fs.readFileSync('./data/slds/geoserver/tiger_roads.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(tiger_roads);
    });
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
