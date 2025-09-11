
/* eslint camelcase: 0 */

import * as fs from 'fs';
import SldStyleParser from './SldStyleParser';
import { beforeEach, expect, it, describe } from 'vitest';

import empty_filter from '../data/styles/empty_filter';
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
import point_simpleLabel2 from '../data/styles/point_simpleLabel2';
import point_simplepoint_filter from '../data/styles/point_simplepoint_filter';
import point_simplepoint_displacement from '../data/styles/point_simplepoint_displacement';
import point_simplepoint_filter_forceBools from '../data/styles/point_simplepoint_filter_forceBools';
import point_simplepoint_filter_forceNumerics from '../data/styles/point_simplepoint_filter_forceNumerics';
import point_simplepoint_nestedLogicalFilters from '../data/styles/point_simplepoint_nestedLogicalFilters';
import point_externalgraphic from '../data/styles/point_externalgraphic';
import point_externalgraphic_floatingPoint from '../data/styles/point_externalgraphic_floatingPoint';
import point_externalgraphic_svg from '../data/styles/point_externalgraphic_svg';
import point_externalgraphic_svg_displacement from '../data/styles/point_externalgraphic_svg_displacement';
import multi_simplelineLabel from '../data/styles/multi_simplelineLabel';
import point_simplesquare from '../data/styles/point_simplesquare';
import point_simpletriangle from '../data/styles/point_simpletriangle';
import point_simplestar from '../data/styles/point_simplestar';
import point_simplecross from '../data/styles/point_simplecross';
import point_simplex from '../data/styles/point_simplex';
import point_simpleslash from '../data/styles/point_simpleslash';
import point_fontglyph from '../data/styles/point_fontglyph';
import point_styledLabel_literalOpenCurlyBraces from '../data/styles/point_styledLabel_literalOpenCurlyBraces';
import point_styledLabel_literalPlaceholder from '../data/styles/point_styledLabel_literalPlaceholder';
import point_styledLabel_elementOrder from '../data/styles/point_styledLabel_elementOrder';
import raster_simpleraster from '../data/styles/raster_simpleRaster';
import raster_complexraster from '../data/styles/raster_complexRaster';
import text_pointplacement from '../data/styles/text_pointplacement';
import text_pointplacement_with_anchor from '../data/styles/text_pointplacement_anchor';
import text_lineplacement from '../data/styles/text_lineplacement';
import text_lineplacement_offset from '../data/styles/text_lineplacement_offset';
import unsupported_properties from '../data/styles/unsupported_properties';
import function_markSymbolizer from '../data/styles/function_markSymbolizer';
import function_filter from '../data/styles/function_filter';
import function_nested from '../data/styles/function_nested';
import functionFilterPropertyToProperty from '../data/styles/function_filter_property_to_property';

it('SldStyleParser is defined', () => {
  expect(SldStyleParser).toBeDefined();
});

describe('SldStyleParser with Symbology Encoding implements StyleParser (reading)', () => {
  let styleParser: SldStyleParser;

  beforeEach(() => {
    styleParser = new SldStyleParser();
  });

  describe('#readStyle', () => {
    it('is defined', () => {
      expect(styleParser.readStyle).toBeDefined();
    });
    it('can read a SLD 1.1 PointSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplepoint);
    });
    it('can read a SLD 1.1 PointSymbolizer with Displacment', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint_displacement.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplepoint_displacement);
    });
    it('can read a SLD 1.1 PointSymbolizer with ExternalGraphic', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_externalgraphic.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_externalgraphic);
    });
    it('can read a SLD 1.1 PointSymbolizer with ExternalGraphic with floating-point values', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_externalgraphic_floatingPoint.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_externalgraphic_floatingPoint);
    });
    it('can read a SLD 1.1 PointSymbolizer with ExternalGraphic svg', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_externalgraphic_svg.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_externalgraphic_svg);
    });
    it('can read a SLD 1.1 PointSymbolizer with ExternalGraphic and Displacement', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_externalgraphic_svg_displacement.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_externalgraphic_svg_displacement);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName square', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplesquare.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplesquare);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName triangle', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simpletriangle.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simpletriangle);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName star', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplestar.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplestar);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName cross', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplecross.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplecross);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName x', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplex.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplex);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName shape://slash', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simpleslash.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simpleslash);
    });
    it('can read a SLD 1.1 PointSymbolizer with wellKnownName using a font glyph (starting with ttf://)', async () => {
      const sld = fs.readFileSync( './data/slds/1.1/point_fontglyph.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_fontglyph);
    });
    it('can read a SLD 1.1 LineSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_simpleline.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_simpleline);
    });
    it('can read a SLD 1.1 LineSymbolizer with Perpendicular Offset', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_perpendicularOffset.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_perpendicularOffset);
    });
    it('can read a SLD 1.1 LineSymbolizer with GraphicStroke', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_graphicStroke.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_graphicStroke);
    });
    it('can read a SLD 1.1 LineSymbolizer with GraphicStroke and ExternalGraphic', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_graphicStroke_externalGraphic.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_graphicStroke_externalGraphic);
    });
    it('can read a SLD 1.1 LineSymbolizer with GraphicFill', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_graphicFill.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_graphicFill);
    });
    it('can read a SLD 1.1 LineSymbolizer with GraphicFill and ExternalGraphic', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/line_graphicFill_externalGraphic.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(line_graphicFill_externalGraphic);
    });
    it('can read a SLD 1.1 PolygonSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/polygon_transparentpolygon.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(polygon_transparentpolygon);
    });
    it('can read a SLD 1.1 PolygonSymbolizer with GraphicFill', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/polygon_graphicFill.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(polygon_graphicFill);
    });
    it('can read a SLD 1.1 PolygonSymbolizer with GraphicFill and ExternalGraphic', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/polygon_graphicFill_externalGraphic.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(polygon_graphicFill_externalGraphic);
    });
    it('can read a SLD 1.1 TextSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_styledlabel.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_styledlabel);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simpleLabel.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simpleLabel);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label and styling', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simpleLabel2.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simpleLabel2);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label and point placement', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/text_pointplacement.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_pointplacement);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label with point placement and anchor', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/text_pointplacement_anchor.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_pointplacement_with_anchor);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label and line placement', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/text_lineplacement.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_lineplacement);
    });
    it('can read a SLD 1.1 TextSymbolizer with a static label, line placement and perpendicular offset', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/text_lineplacement.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(text_lineplacement);
    });
    it('can read a simple SLD 1.1 RasterSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/raster_simpleRaster.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(raster_simpleraster);
    });
    it('can read a complex SLD 1.1 RasterSymbolizer', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/raster_complexRaster.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(raster_complexraster);
    });
    it('can read a SLD 1.1 style with a filter', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint_filter.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplepoint_filter);
    });
    it('can read a SLD 1.1 style with nested logical filters', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint_nestedLogicalFilters.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_simplepoint_nestedLogicalFilters);
    });
    it('can read a SLD 1.1 style with multiple symbolizers in one Rule', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/multi_simplelineLabel.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(multi_simplelineLabel);
    });
    it('can read a SLD 1.1 style with a styled label containing a PropertyName and a Literal', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_styledLabel_literalPlaceholder.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_styledLabel_literalPlaceholder);
    });
    it('can read a SLD style with a styled label and preserve its order', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/point_styledLabel_elementOrder.sld', 'utf8');
      const { output: geoStylerStyle} = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(point_styledLabel_elementOrder);
    });

    it('can read a SLD with an empty filter', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/empty_filter.sld', 'utf8');
      const readResult = await styleParser.readStyle(sld);
      expect(readResult.output).toBeDefined();
      expect(readResult.output).toEqual(empty_filter);
    });

    it('can read a SLD with a simple function', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/function_markSymbolizer.sld', 'utf8');
      const readResult = await styleParser.readStyle(sld);
      expect(readResult.output).toBeDefined();
      expect(readResult.output).toEqual(function_markSymbolizer);
    });

    it('can read a SLD with a function filter using property', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/function_filter.sld', 'utf8');
      const readResult = await styleParser.readStyle(sld);
      expect(readResult.output).toBeDefined();
      expect(readResult.output).toEqual(function_filter);
    });

    it('can read a SLD with a nested function', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/function_nested.sld', 'utf8');
      const readResult = await styleParser.readStyle(sld);
      expect(readResult.output).toBeDefined();
      expect(readResult.output).toEqual(function_nested);
    });

    it('can read a SLD with nested property-to-property comparisons', async () => {
      const sld = fs.readFileSync('./data/slds/1.1/function_filter_property_to_property.sld', 'utf8');
      const { output: geoStylerStyle } = await styleParser.readStyle(sld);
      expect(geoStylerStyle).toBeDefined();
      expect(geoStylerStyle).toEqual(functionFilterPropertyToProperty);
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
});

describe('SldStyleParser with Symbology Encoding implements StyleParser (writing)', () => {
  let styleParser: SldStyleParser;

  beforeEach(() => {
    styleParser = new SldStyleParser({sldVersion: '1.1.0'});
  });

  describe('#writeStyle', () => {
    it('is defined', () => {
      expect(styleParser.writeStyle).toBeDefined();
    });

    it('can write a SLD 1.1 PointSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint);
    });
    it('can write a SLD 1.1 PointSymbolizer with Displacement', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_displacement);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_displacement);
    });
    it('can write a SLD 1.1 PointSymbolizer with ExternalGraphic', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_externalgraphic);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_externalgraphic);
    });
    it('can write a SLD 1.1 PointSymbolizer with ExternalGraphic svg', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_externalgraphic_svg);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_externalgraphic_svg);
    });
    it('can write a SLD 1.1 PointSymbolizer with ExternalGraphic svg and displacment', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_externalgraphic_svg_displacement);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_externalgraphic_svg_displacement);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName square', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplesquare);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplesquare);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName triangle', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simpletriangle);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simpletriangle);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName star', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplestar);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplestar);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName cross', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplecross);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplecross);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName x', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplex);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplex);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName shape://slash', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simpleslash);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simpleslash);
    });
    it('can write a SLD 1.1 PointSymbolizer with wellKnownName using a font glyph (starting with ttf://)', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_fontglyph);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_fontglyph);
    });
    it('can write a SLD 1.1 LineSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_simpleline);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_simpleline);
    });
    it('can write a SLD 1.1 LineSymbolizer with PerpendicularOffset', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_perpendicularOffset);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_perpendicularOffset);
    });
    it('can write a SLD 1.1 LineSymbolizer with GraphicStroke', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_graphicStroke);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_graphicStroke);
    });
    it('can write a SLD 1.1 LineSymbolizer with GraphicStroke and ExternalGraphic', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_graphicStroke_externalGraphic);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_graphicStroke_externalGraphic);
    });
    it('can write a SLD 1.1 LineSymbolizer with GraphicFill', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_graphicFill);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_graphicFill);
    });
    it('can write a SLD 1.1 LineSymbolizer with GraphicFill and ExternalGraphic', async () => {
      const { output: sldString } = await styleParser.writeStyle(line_graphicFill_externalGraphic);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(line_graphicFill_externalGraphic);
    });
    it('can write a SLD 1.1 PolygonSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(polygon_transparentpolygon);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(polygon_transparentpolygon);
    });
    it('can write a SLD 1.1 PolygonSymbolizer with GraphicFill', async () => {
      const { output: sldString } = await styleParser.writeStyle(polygon_graphicFill);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(polygon_graphicFill);
    });
    it('can write a SLD 1.1 PolygonSymbolizer with GraphicFill and ExternalGraphic', async () => {
      const { output: sldString } = await styleParser.writeStyle(polygon_graphicFill_externalGraphic);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(polygon_graphicFill_externalGraphic);
    });
    it('can write a SLD 1.1 TextSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_styledlabel);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_styledlabel);
    });
    it('can write a SLD 1.1 TextSymbolizer with point placement', async () => {
      const { output: sldString } = await styleParser.writeStyle(text_pointplacement);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(text_pointplacement);
    });
    it('can write a SLD 1.1 TextSymbolizer with point placement and anchor', async () => {
      const { output: sldString } = await styleParser.writeStyle(text_pointplacement_with_anchor);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(text_pointplacement_with_anchor);
    });
    it('can write a SLD 1.1 TextSymbolizer with line placement', async () => {
      const { output: sldString } = await styleParser.writeStyle(text_lineplacement);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(text_lineplacement);
    });
    it('can write a SLD 1.1 TextSymbolizer with line placement and offset', async() =>{
      const {output: sldString} = await styleParser.writeStyle(text_lineplacement_offset);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle?.rules[0].symbolizers).toEqual(text_lineplacement_offset.rules[0].symbolizers);
    });
    it('can write a simple SLD RasterSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(raster_simpleraster);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(raster_simpleraster);
    });
    it('can write a complex SLD RasterSymbolizer', async () => {
      const { output: sldString } = await styleParser.writeStyle(raster_complexraster);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(raster_complexraster);
    });
    it('can write a SLD 1.1 style with a filter', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_filter);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_filter);
    });
    it('can write a SLD 1.1 style with a filter and force cast of numeric fields', async () => {
      // force fields beeing casted to numeric data type
      styleParser.numericFilterFields = ['POPULATION', 'TEST1', 'TEST2'];
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_filter_forceNumerics);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_filter_forceNumerics);
    });
    it('can write a SLD 1.1 style with a filter and force cast of numeric fields (forceCasting)', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_filter_forceNumerics);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_filter_forceNumerics);
    });
    it('can write a SLD 1.1 style with a filter and force cast of boolean fields', async () => {
      // force fields beeing casted to boolean data type
      styleParser.boolFilterFields = ['TEST', 'TEST2'];
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_filter_forceBools);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_filter_forceBools);
    });
    it('can write a SLD 1.1 style with a filter and force cast of boolean fields (forceCasting)', async () => {
      // force fields beeing casted to boolean data type
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_filter_forceBools);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_filter_forceBools);
    });
    it('can write a SLD 1.1 style with nested logical filters', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_simplepoint_nestedLogicalFilters);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_simplepoint_nestedLogicalFilters);
    });
    it('can write a SLD 1.1 with nested property-to-property comparison filters', async () => {
      const {
        output: sldString
      } = await styleParser.writeStyle(functionFilterPropertyToProperty);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle } = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(functionFilterPropertyToProperty);
    });
    // it('can write a SLD 1.1 style with functionfilters', async () => {
    //   const { output: sldString } = await styleParser.writeStyle(point_simplepoint_functionfilter);
    //   expect(sldString).toBeDefined();
    //   // As string comparison between two XML-Strings is awkward and nonsens
    //   // we read it again and compare the json input with the parser output
    //   const { output: readStyle} = await styleParser.readStyle(sldString!);
    //   expect(readStyle).toEqual(point_simplepoint_functionfilter);
    // });
    it('can write a SLD 1.1 style with multiple symbolizers in one Rule', async () => {
      const { output: sldString } = await styleParser.writeStyle(multi_simplelineLabel);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle } = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(multi_simplelineLabel);
    });
    it('can write a SLD 1.1 style with a styled label containing open curly braces as static text', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_styledLabel_literalOpenCurlyBraces);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_styledLabel_literalOpenCurlyBraces);
    });
    it('can write a SLD 1.1 style with a styled label containing placeholders and static text', async () => {
      const { output: sldString } = await styleParser.writeStyle(point_styledLabel_literalPlaceholder);
      expect(sldString).toBeDefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle} = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(point_styledLabel_literalPlaceholder);
    });

    it('can write a SLD 1.1 with a simple function filter', async () => {
      const {
        output: sldString,
        errors,
        warnings,
        unsupportedProperties
      } = await styleParser.writeStyle(function_markSymbolizer);
      expect(sldString).toBeDefined();
      expect(errors).toBeUndefined();
      expect(warnings).toBeUndefined();
      expect(unsupportedProperties).toBeUndefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle } = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(function_markSymbolizer);
    });

    it('can write a SLD with a function filter using property', async () => {
      const {
        output: sldString,
        errors,
        warnings,
        unsupportedProperties
      } = await styleParser.writeStyle(function_filter);
      expect(sldString).toBeDefined();
      expect(errors).toBeUndefined();
      expect(warnings).toBeUndefined();
      expect(unsupportedProperties).toBeUndefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle } = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(function_filter);
    });

    it('can write a SLD with a nested function', async () => {
      const {
        output: sldString,
        errors,
        warnings,
        unsupportedProperties
      } = await styleParser.writeStyle(function_nested);
      expect(sldString).toBeDefined();
      expect(errors).toBeUndefined();
      expect(warnings).toBeUndefined();
      expect(unsupportedProperties).toBeUndefined();
      // As string comparison between two XML-Strings is awkward and nonsens
      // we read it again and compare the json input with the parser output
      const { output: readStyle } = await styleParser.readStyle(sldString!);
      expect(readStyle).toEqual(function_nested);
    });

    it('can write a non-prettified SLD 1.1 by setting flag "prettyOutput" to false', async () => {
      const styleParserPrettyFalse = new SldStyleParser({
        sldVersion: '1.1.0',
        builderOptions: {
          format: false
        }
      });
      const { output: sldString } = await styleParserPrettyFalse.writeStyle(point_simplepoint);
      expect(sldString).toBeDefined();
      const sld = fs.readFileSync('./data/slds/1.1/point_simplepoint_oneline.sld', 'utf8');
      expect(sldString).toEqual(sld.trim());
    });

    it('creates the correct order in a text symbolizer', async () => {
      const styleParserOrder = new SldStyleParser({
        sldVersion: '1.1.0',
        builderOptions: {
          format: true
        }
      });
      const { output: sldString } = await styleParserOrder.writeStyle(point_styledLabel_elementOrder);
      expect(sldString).toBeDefined();
      const sld = fs.readFileSync('./data/slds/1.1/point_styledLabel_elementOrder.sld', 'utf8');
      expect(sldString).toEqual(sld.trim());
    });
    it('adds unsupportedProperties to the write output', async () => {
      const styleParserOrder = new SldStyleParser({
        sldVersion: '1.1.0',
        builderOptions: {
          format: true
        }
      });
      const {
        output: sldString,
        unsupportedProperties,
        warnings
      } = await styleParserOrder.writeStyle(unsupported_properties);
      expect(sldString).toBeDefined();
      const unsupportedGot = {
        Symbolizer: {
          FillSymbolizer: {
            opacity: {
              info: 'General opacity is not supported. Use fillOpacity and strokeOpacity instead.',
              support: 'none'
            }
          }
        }
      };
      const warningsGot = ['Your style contains unsupportedProperties!'];
      expect(unsupportedProperties).toEqual(unsupportedGot);
      expect(warnings).toEqual(warningsGot);
      const sld = fs.readFileSync('./data/slds/1.1/unsupported_properties.sld', 'utf8');
      expect(sldString).toEqual(sld.trimEnd());
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
