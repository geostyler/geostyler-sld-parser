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
import polygon_graphicFill from '../data/styles/polygon_graphicFill';
import polygon_graphicFill_externalGraphic from '../data/styles/polygon_graphicFill_externalGraphic';
import point_styledlabel from '../data/styles/point_styledlabel';
import point_simpleLabel from '../data/styles/point_simpleLabel';
import point_simplepoint_filter from '../data/styles/point_simplepoint_filter';
import point_simplepoint_filter_forceBools from '../data/styles/point_simplepoint_filter_forceBools';
import point_simplepoint_filter_forceNumerics from '../data/styles/point_simplepoint_filter_forceNumerics';
import point_simplepoint_functionfilter from '../data/styles/point_simplepoint_functionfilter';
import point_simplepoint_nestedLogicalFilters from '../data/styles/point_simplepoint_nestedLogicalFilters';
import point_externalgraphic from '../data/styles/point_externalgraphic';
import point_externalgraphic_floatingPoint from '../data/styles/point_externalgraphic_floatingPoint';
import point_externalgraphic_svg from '../data/styles/point_externalgraphic_svg';
import multi_simplelineLabel from '../data/styles/multi_simplelineLabel';
import point_simplesquare from '../data/styles/point_simplesquare';
import point_simpletriangle from '../data/styles/point_simpletriangle';
import point_simplestar from '../data/styles/point_simplestar';
import point_simplecross from '../data/styles/point_simplecross';
import point_simplex from '../data/styles/point_simplex';
import point_simpleslash from '../data/styles/point_simpleslash';
import point_styledLabel_literalPlaceholder from '../data/styles/point_styledLabel_literalPlaceholder';
import raster_simpleraster from '../data/styles/raster_simpleRaster';
import raster_complexraster from '../data/styles/raster_complexRaster';

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
    it('can read a SLD PointSymbolizer with ExternalGraphic with floating-point values', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_externalgraphic_floatingPoint.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_externalgraphic_floatingPoint);
        });
      });
    it('can read a SLD PointSymbolizer with ExternalGraphic svg', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_externalgraphic_svg.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_externalgraphic_svg);
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
    it('can read a SLD PointSymbolizer with wellKnownName shape://slash', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simpleslash.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simpleslash);
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
    it('can read a SLD PolygonSymbolizer with GraphicFill', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/polygon_graphicFill.sld', 'utf8');
      return styleParser.readStyle(sld)
      .then((geoStylerStyle: Style) => {
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(polygon_graphicFill);
        });
    });
    it('can read a SLD PolygonSymbolizer with GraphicFill and ExternalGraphic', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/polygon_graphicFill_externalGraphic.sld', 'utf8');
      return styleParser.readStyle(sld)
      .then((geoStylerStyle: Style) => {
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(polygon_graphicFill_externalGraphic);
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
    it('can read a SLD TextSymbolizer with a static label', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simpleLabel.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simpleLabel);
        });
    });
    it('can read a simple SLD RasterSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync('./data/slds/raster_simpleRaster.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(raster_simpleraster);
        });
    });
    it('can read a complex SLD RasterSymbolizer', () => {
      expect.assertions(2);
      const sld = fs.readFileSync('./data/slds/raster_complexRaster.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(raster_complexraster);
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
    it('can read a SLD style with functionfilters', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_simplepoint_functionfilter.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simplepoint_functionfilter);
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
    it('can read a SLD style with a styled label containing a PropertyName and a Literal', () => {
      expect.assertions(2);
      const sld = fs.readFileSync( './data/slds/point_styledLabel_literalPlaceholder.sld', 'utf8');
      return styleParser.readStyle(sld)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_styledLabel_literalPlaceholder);
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

    describe('#getRasterSymbolizerFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getRasterSymbolizerFromSldSymbolizer).toBeDefined();
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

    describe('#getTextSymbolizerLabelFromSldSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getTextSymbolizerLabelFromSldSymbolizer).toBeDefined();
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_externalgraphic);
            });
        });
    });
    it('can write a SLD PointSymbolizer with ExternalGraphic svg', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_externalgraphic_svg)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_externalgraphic_svg);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName square', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplesquare)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplex);
            });
        });
    });
    it('can write a SLD PointSymbolizer with wellKnownName shape://slash', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simpleslash)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simpleslash);
            });
        });
    });
    it('can write a SLD LineSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(line_simpleline)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
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
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(polygon_transparentpolygon);
            });
        });
    });
    it('can write a SLD PolygonSymbolizer with GraphicFill', () => {
      expect.assertions(2);
      return styleParser.writeStyle(polygon_graphicFill)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(polygon_graphicFill);
            });
        });
    });
    it('can write a SLD PolygonSymbolizer with GraphicFill and ExternalGraphic', () => {
      expect.assertions(2);
      return styleParser.writeStyle(polygon_graphicFill_externalGraphic)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(polygon_graphicFill_externalGraphic);
            });
        });
    });
    it('can write a SLD TextSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_styledlabel)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_styledlabel);
            });
        });
    });
    it('can write a simple SLD RasterSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(raster_simpleraster)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(raster_simpleraster);
            });
        });
    });
    it('can write a complex SLD RasterSymbolizer', () => {
      expect.assertions(2);
      return styleParser.writeStyle(raster_complexraster)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(raster_complexraster);
            });
        });
    });
    it('can write a SLD style with a filter', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint_filter)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter);
            });
        });
    });
    it('can write a SLD style with a filter and force cast of numeric fields', () => {
      expect.assertions(2);
      // force fields beeing casted to numeric data type
      styleParser.numericFilterFields = ['POPULATION', 'TEST1', 'TEST2'];
      return styleParser.writeStyle(point_simplepoint_filter_forceNumerics)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter_forceNumerics);
            });
        });
    });
    it('can write a SLD style with a filter and force cast of numeric fields (forceCasting)', () => {
      expect.assertions(2);
      styleParser.forceCasting = true;
      return styleParser.writeStyle(point_simplepoint_filter_forceNumerics)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter_forceNumerics);
            });
        });
    });
    it('can write a SLD style with a filter and force cast of boolean fields', () => {
      expect.assertions(2);
      // force fields beeing casted to boolean data type
      styleParser.boolFilterFields = ['TEST', 'TEST2'];
      return styleParser.writeStyle(point_simplepoint_filter_forceBools)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter_forceBools);
            });
        });
    });
    it('can write a SLD style with a filter and force cast of boolean fields (forceCasting)', () => {
      expect.assertions(2);
      // force fields beeing casted to boolean data type
      styleParser.forceCasting = true;
      return styleParser.writeStyle(point_simplepoint_filter_forceBools)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_filter_forceBools);
            });
        });
    });
    it('can write a SLD style with nested logical filters', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint_nestedLogicalFilters)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_nestedLogicalFilters);
            });
        });
    });
    it('can write a SLD style with functionfilters', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_simplepoint_functionfilter)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_simplepoint_functionfilter);
            });
        });
    });
    it('can write a SLD style with multiple symbolizers in one Rule', () => {
      expect.assertions(2);
      return styleParser.writeStyle(multi_simplelineLabel)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(multi_simplelineLabel);
            });
        });
    });
    it('can write a SLD style with a styled label containing a placeholder and static text', () => {
      expect.assertions(2);
      return styleParser.writeStyle(point_styledLabel_literalPlaceholder)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          // As string comparison between two XML-Strings is awkward and nonsens
          // we read it again and compare the json input with the parser output
          return styleParser.readStyle(sldString)
            .then(readStyle => {
              expect(readStyle).toEqual(point_styledLabel_literalPlaceholder);
            });
        });
    });

    it('can write a non-prettified SLD by setting flag "prettyOutput" to false', () => {
      expect.assertions(2);
      const styleParserPrettyFalse = new SldStyleParser({prettyOutput: false});
      return styleParserPrettyFalse.writeStyle(point_simplepoint)
        .then((sldString: string) => {
          expect(sldString).toBeDefined();
          const sld = fs.readFileSync( './data/slds/point_simplepoint_oneline.sld', 'utf8');
          expect(sldString).toEqual(sld.trim());
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

    describe('#getSldRasterSymbolizerFromRasterSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldRasterSymbolizerFromRasterSymbolizer).toBeDefined();
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

    describe('#getSldLabelFromTextSymbolizer', () => {
      it('is defined', () => {
        expect(styleParser.getSldLabelFromTextSymbolizer).toBeDefined();
      });
    });
  });

});
