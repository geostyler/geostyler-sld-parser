import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { Style } from 'geostyler-style';

import point_simplepoint from '../data/styles/point_simplepoint';
import line_simpleline from '../data/styles/line_simpleline';
import line_perpendicularOffset from '../data/styles/line_perpendicularOffset';
import line_graphicStroke from '../data/styles/line_graphicStroke';
import line_graphicStroke_externalGraphic from '../data/styles/line_graphicStroke_externalGraphic';
import line_graphicFill from '../data/styles/line_graphicFill';
import line_graphicFill_externalGraphic from '../data/styles/line_graphicFill_externalGraphic';
import polygon_transparentpolygon from '../data/styles/polygon_transparentpolygon';
import point_styledlabel from '../data/styles/point_styledlabel';
import point_simplepoint_filter from '../data/styles/point_simplepoint_filter';
import point_simplepoint_nestedLogicalFilters from '../data/styles/point_simplepoint_nestedLogicalFilters';
import point_externalgraphic from '../data/styles/point_externalgraphic';
import multi_simplelineLabel from '../data/styles/multi_simplelineLabel';
import point_simplesquare from '../data/styles/point_simplesquare';
import point_simpletriangle from '../data/styles/point_simpletriangle';
import point_simplestar from '../data/styles/point_simplestar';
import point_simplecross from '../data/styles/point_simplecross';
import point_simplex from '../data/styles/point_simplex';

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
    it('can read a SLD PointSymbolizer with wellKnownName square', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplesquare.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplesquare);
        });
    });
    it('can read a SLD PointSymbolizer with wellKnownName triangle', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simpletriangle.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simpletriangle);
        });
    });
    it('can read a SLD PointSymbolizer with wellKnownName star', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplestar.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplestar);
        });
    });
    it('can read a SLD PointSymbolizer with wellKnownName cross', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplecross.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplecross);
        });
    });
    it('can read a SLD PointSymbolizer with wellKnownName x', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplex.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplex);
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
    it('can read a SLD LineSymbolizer with Perpendicular Offset', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_perpendicularOffset.sld', 'utf8');
      return styleParser.readStyle(sld)
      .then((geostylerStyle: Style) => {
        expect(geostylerStyle).toBeDefined();
        expect(geostylerStyle).toEqual(line_perpendicularOffset);
      });
    });
    it('can read a SLD LineSymbolizer with GraphicStroke', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_graphicStroke.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_graphicStroke);
        });
    });
    it('can read a SLD LineSymbolizer with GraphicStroke and ExternalGraphic', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_graphicStroke_externalGraphic.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_graphicStroke_externalGraphic);
        });
    });
    it('can read a SLD LineSymbolizer with GraphicFill', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_graphicFill.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_graphicFill);
        });
    });
    it('can read a SLD LineSymbolizer with GraphicFill and ExternalGraphic', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/line_graphicFill_externalGraphic.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_graphicFill_externalGraphic);
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
    it('can read a SLD style with multiple symbolizers in one Rule', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/multi_simplelineLabel.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(multi_simplelineLabel);
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

    describe('#getSymbolizersFromRule', () => {
      it('is defined', () => {
        expect(styleParser.getSymbolizersFromRule).toBeDefined();
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
    it('can write a SLD PointSymbolizer with wellKnownName square', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplesquare)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplesquare);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName triangle', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simpletriangle)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simpletriangle);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName star', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplestar)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplestar);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName cross', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplecross)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplecross);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName x', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplex)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplex);
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
    it('can write a SLD LineSymbolizer with PerpendicularOffset', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_perpendicularOffset)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_perpendicularOffset);
            });
        });
    });
    it('can write a SLD LineSymbolizer with GraphicStroke', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_graphicStroke)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_graphicStroke);
            });
        });
    });
    it('can write a SLD LineSymbolizer with GraphicStroke and ExternalGraphic', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_graphicStroke_externalGraphic)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_graphicStroke_externalGraphic);
            });
        });
    });
    it('can write a SLD LineSymbolizer with GraphicFill', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_graphicFill)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_graphicFill);
            });
        });
    });
    it('can write a SLD LineSymbolizer with GraphicFill and ExternalGraphic', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_graphicFill_externalGraphic)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(line_graphicFill_externalGraphic);
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
    it('can write a SLD style with multiple symbolizers in one Rule', () => {
      expect.assertions(2);
      return styleParser.writeStyle(multi_simplelineLabel)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between to XML-Strings is awkward and nonesens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(multi_simplelineLabel);
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

    describe('#getSldSymbolizersFromSymbolizers', () => {
      it('is defined', () => {
        expect(styleParser.getSldSymbolizersFromSymbolizers).toBeDefined();
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

    describe('#getSldPointSymbolizerFromMarkSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldPointSymbolizerFromMarkSymbolizer).toBeDefined();
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
