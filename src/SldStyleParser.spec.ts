import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { Style } from 'geostyler-style';

import point_simplepoint from '../data/styles/point_simplepoint';
import line_simpleline from '../data/styles/line_simpleline';
import polygon_transparentpolygon from '../data/styles/polygon_transparentpolygon';
import point_styledlabel from '../data/styles/point_styledlabel';
import point_simplepoint_filter from '../data/styles/point_simplepoint_filter';
import point_simplepoint_nestedLogicalFilters from '../data/styles/point_simplepoint_nestedLogicalFilters';
import point_externalgraphic from '../data/styles/point_externalgraphic';

it('SldStyleParser is defined', () => {
  expect(SldStyleParser).toBeDefined();
});

describe('SldStyleParser implements StyleParser', () => {
  let styleParser: SldStyleParser;

  beforeEach(() => {
    styleParser = new SldStyleParser();
  });

  describe('#tagNameProcessor', () => {
    it('is defined', () => {
      expect(styleParser.tagNameProcessor).toBeDefined();
    });
    it('strips namespaces from TagNames', () => {
      const tagNameProcessor = styleParser.tagNameProcessor;
      expect(tagNameProcessor('ogc:PropertyName')).toBe('PropertyName');
      expect(tagNameProcessor('ogc:Filter')).toBe('Filter');
      expect(tagNameProcessor('sld:NamedLayer')).toBe('NamedLayer');
      expect(tagNameProcessor('sld:PointSymbolizer')).toBe('PointSymbolizer');
    });
  });

  describe('#readStyle', () => {
    it('is defined', () => {
      expect(styleParser.readStyle).toBeDefined();
    });
    it('can read a SLD PointSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplepoint.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplepoint);
        });
      });
    it('can read a SLD PointSymbolizer with ExternalGraphic', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_externalgraphic.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_externalgraphic);
        });
      });
    it('can read a SLD LineSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_simpleline.sld', 'utf8');
      return styleParser.readStyle(sld)
      .then((geoStylerStyle: Style) => {
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(line_simpleline);
      });
    });
    it('can read a SLD PolygonSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/polygon_transparentpolygon.sld', 'utf8');
      return styleParser.readStyle(sld)
      .then((geoStylerStyle: Style) => {
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(polygon_transparentpolygon);
        });
    });
    it('can read a SLD TextSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_styledlabel.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_styledlabel);
        });
    });
    it('can read a SLD style with a filter', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplepoint_filter.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplepoint_filter);
        });
    });
    it('can read a SLD style with nested logical filters', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplepoint_nestedLogicalFilters.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplepoint_nestedLogicalFilters);
        });
    });

    describe('#getStyleTypeFromSldObject', () => {
      it('is defined', () => {
        expect(styleParser.getStyleTypeFromSldObject).toBeDefined();
      });
    });

    describe('#getFilterFromOperatorAndComparison', () => {
      it('is defined', () => {
        expect(styleParser.getFilterFromOperatorAndComparison).toBeDefined();
      });
    });

    describe('#getFilterFromRule', () => {
      it('is defined', () => {
        expect(styleParser.getFilterFromRule).toBeDefined();
      });
    });

    describe('#getScaleDenominatorFromRule', () => {
      it('is defined', () => {
        expect(styleParser.getScaleDenominatorFromRule).toBeDefined();
      });
    });

    describe('#getPointSymbolizerFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getPointSymbolizerFromSldSymbolizer).toBeDefined();
      });
    });

    describe('#getLineSymbolizerFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getLineSymbolizerFromSldSymbolizer).toBeDefined();
      });
    });

    describe('#getFillSymbolizerFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getFillSymbolizerFromSldSymbolizer).toBeDefined();
      });
    });

    describe('#getTextSymbolizerFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getTextSymbolizerFromSldSymbolizer).toBeDefined();
      });
    });

    describe('#getSymbolizerFromRule', () => {
      it('is defined', () => {
        expect(styleParser.getSymbolizerFromRule).toBeDefined();
      });
    });

    describe('#getRulesFromSldObject', () => {
      it('is defined', () => {
        expect(styleParser.getRulesFromSldObject).toBeDefined();
      });
    });

    describe('#sldObjectToGeoStylerStyle', () => {
      it('is defined', () => {
        expect(styleParser.sldObjectToGeoStylerStyle).toBeDefined();
      });
    });
  });

  describe('#writeStyle', () => {
    it('is defined', () => {
      expect(styleParser.writeStyle).toBeDefined();
    });
    it('can write a SLD PointSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint);
            });
        });
    });
    it('can write a SLD PointSymbolizer with ExternalGraphic', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_externalgraphic)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_externalgraphic);
            });
        });
    });
    it('can write a SLD LineSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_simpleline)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_simpleline);
            });
        });
    });
    it('can write a SLD PolygonSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(polygon_transparentpolygon)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(polygon_transparentpolygon);
            });
        });
    });
    it('can write a SLD TextSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_styledlabel)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_styledlabel);
            });
        });
    });
    it('can write a SLD style with a filter', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint_filter)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter);
            });
        });
    });
    it('can write a SLD style with nested logical filters', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint_nestedLogicalFilters)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_nestedLogicalFilters);
            });
        });
    });

    describe('#geoStylerStyleToSldObject', () => {
      it('is defined', () => {
        expect(styleParser.geoStylerStyleToSldObject).toBeDefined();
      });
    });

    describe('#getSldRulesFromRules', () => {
      it('is defined', () => {
        expect(styleParser.getSldRulesFromRules).toBeDefined();
      });
    });

    describe('#getSldSymbolizerFromSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldSymbolizerFromSymbolizer).toBeDefined();
      });
    });

    describe('#getSldTextSymbolizerFromTextSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldTextSymbolizerFromTextSymbolizer).toBeDefined();
      });
    });

    describe('#getSldPolygonSymbolizerFromFillSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldPolygonSymbolizerFromFillSymbolizer).toBeDefined();
      });
    });

    describe('#getSldLineSymbolizerFromLineSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldLineSymbolizerFromLineSymbolizer).toBeDefined();
      });
    });

    describe('#getSldPointSymbolizerFromCircleSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldPointSymbolizerFromCircleSymbolizer).toBeDefined();
      });
    });

    describe('#getSldComparisonFilterFromComparisonFilte', () => {
      it('is defined', () => {
        expect(styleParser.getSldComparisonFilterFromComparisonFilter).toBeDefined();
      });
    });

    describe('#getSldFilterFromFilter', () => {
      it('is defined', () => {
        expect(styleParser.getSldFilterFromFilter).toBeDefined();
      });
    });
  });

});
