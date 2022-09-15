import {
  Channel,
  ChannelSelection,
  ColorMap,
  ColorMapEntry,
  ColorMapType,
  CombinationOperator,
  ComparisonFilter,
  ComparisonOperator,
  ContrastEnhancement,
  Expression,
  FillSymbolizer,
  Filter,
  GeoStylerFunction,
  IconSymbolizer,
  isCombinationFilter,
  isComparisonFilter,
  isNegationFilter,
  LineSymbolizer,
  MarkSymbolizer,
  PointSymbolizer,
  RangeFilter,
  RasterSymbolizer,
  ReadStyleResult,
  Rule,
  ScaleDenominator,
  StyleParser,
  Symbolizer,
  TextSymbolizer,
  UnsupportedProperties,
  WellKnownName,
  WriteStyleResult
} from 'geostyler-style';
import {
  Style
} from 'geostyler-style';
import {
  XMLBuilder,
  XMLParser,
  X2jOptionsOptional,
  XmlBuilderOptionsOptional
} from 'fast-xml-parser';

import SymbologyEncoder from './SymbologyEncoder';
import {
  get,
  getAttribute,
  getChildren,
  getParameterValue,
  isSymbolizer,
  keysByValue
} from './Util/SldUtil';

export type SldVersion = '1.0.0' | '1.1.0';

export type ConstructorParams = {
  numericFilterFields?: string[];
  boolFilterFields?: string[];
  sldVersion?: SldVersion;
  symbolizerUnits?: string;
  parserOptions?: X2jOptionsOptional;
  builderOptions?: XmlBuilderOptionsOptional;
};

const WELLKNOWNNAME_TTF_REGEXP = /^ttf:\/\/(.+)#(.+)$/;

/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style StyleParser interface.
 *
 * @class SldStyleParser
 * @implements StyleParser
 */
export class SldStyleParser implements StyleParser<string> {

  /**
   * The name of the SLD Style Parser.
   */
  public static title = 'SLD Style Parser';

  title = 'SLD Style Parser';

  unsupportedProperties: UnsupportedProperties = {
    Symbolizer: {
      MarkSymbolizer: {
        avoidEdges: 'none',
        blur: 'none',
        offset: 'none',
        offsetAnchor: 'none',
        pitchAlignment: 'none',
        pitchScale: 'none',
        visibility: 'none'
      },
      FillSymbolizer: {
        antialias: 'none',
        opacity: {
          support: 'none',
          info: 'General opacity is not supported. Use fillOpacity and strokeOpacity instead.'
        },
        visibility: 'none'
      },
      IconSymbolizer: {
        allowOverlap: 'none',
        anchor: 'none',
        avoidEdges: 'none',
        color: 'none',
        haloBlur: 'none',
        haloColor: 'none',
        haloWidth: 'none',
        keepUpright: 'none',
        offset: 'none',
        offsetAnchor: 'none',
        optional: 'none',
        padding: 'none',
        pitchAlignment: 'none',
        rotationAlignment: 'none',
        textFit: 'none',
        textFitPadding: 'none',
        visibility: 'none'
      },
      LineSymbolizer: {
        blur: 'none',
        gapWidth: 'none',
        gradient: 'none',
        miterLimit: 'none',
        roundLimit: 'none',
        spacing: 'none',
        visibility: 'none'
      },
      RasterSymbolizer: {
        brightnessMax: 'none',
        brightnessMin: 'none',
        contrast: 'none',
        fadeDuration: 'none',
        hueRotate: 'none',
        resampling: 'none',
        saturation: 'none',
        visibility: 'none'
      }
    }
  };

  static negationOperatorMap = {
    Not: '!'
  };
  static combinationMap = {
    And: '&&',
    Or: '||',
    PropertyIsBetween: '&&'
  };
  static comparisonMap = {
    PropertyIsEqualTo: '==',
    PropertyIsNotEqualTo: '!=',
    PropertyIsLike: '*=',
    PropertyIsLessThan: '<',
    PropertyIsLessThanOrEqualTo: '<=',
    PropertyIsGreaterThan: '>',
    PropertyIsGreaterThanOrEqualTo: '>=',
    PropertyIsNull: '==',
    PropertyIsBetween: '<=x<='
  };

  constructor(opts?: ConstructorParams) {
    this.parser = new XMLParser({
      ...opts?.parserOptions,
      // Fixed attributes
      ignoreDeclaration: true,
      ignoreAttributes: false,
      preserveOrder: true
    });
    this.builder = new XMLBuilder({
      ...opts?.builderOptions,
      // Fixed attributes
      ignoreAttributes : false,
      suppressEmptyNode: true,
      // This is fixed to false to make it easier to write the xml order should be preserved anyway
      preserveOrder: false
    });
    if (opts?.sldVersion) {
      this.sldVersion = opts?.sldVersion;
    }
    Object.assign(this, opts);
  }

  private _parser: XMLParser;
  get parser(): XMLParser {
    return this._parser;
  }
  set parser(parser: XMLParser) {
    this._parser = parser;
  }

  private _builder: XMLBuilder;
  get builder(): XMLBuilder {
    return this._builder;
  }
  set builder(builder: XMLBuilder) {
    this._builder = builder;
  }

  /**
   * Array of field / property names in a filter, which are casted to numerics
   * while parsing an SLD.
   */
  private _numericFilterFields: string[] = [];
  /**
   * Getter for _numericFilterFields
   * @return The numericFilterFields
   */
  get numericFilterFields(): string[] {
    return this._numericFilterFields;
  }
  /**
   * Setter for _numericFilterFields
   * @param numericFilterFields The numericFilterFields to set
   */
  set numericFilterFields(numericFilterFields: string[]) {
    this._numericFilterFields = numericFilterFields;
  }

  /**
   * Array of field / property names in a filter, which are casted to boolean
   * while parsing an SLD.
   */
  private _boolFilterFields: string[] = [];
  /**
   * Getter for _boolFilterFields
   * @return The boolFilterFields
   */
  get boolFilterFields(): string[] {
    return this._boolFilterFields;
  }
  /**
   * Setter for _boolFilterFields
   * @param boolFilterFields The boolFilterFields to set
   */
  set boolFilterFields(boolFilterFields: string[]) {
    this._boolFilterFields = boolFilterFields;
  }

  /**
   * String indicating the SLD version to use. 1.1.0 will make use of
   * Symbology Encoding. Default ist to use SLD 1.0.0
   */
  private _sldVersion: SldVersion = '1.0.0';

  /**
   * Getter for _sldVersion
   * @return
   */
  get sldVersion(): SldVersion {
    return this._sldVersion;
  }

  /**
   * Setter for _sldVersion
   * @param sldVersion The _sldVersion value to set
   */
  set sldVersion(sldVersion: SldVersion) {
    this._sldVersion = sldVersion;
  }

  /**
   * Used to add a `uom` attribute to the symbolizer tag. Can be one of
   * `metre`, `foot` or `pixel`. Defaults to pixel.
   */
  private _symbolizerUnits: string = 'pixel';

  /**
   * Getter for _symbolizerUnits
   * @return {string}
   */
  get symbolizerUnits(): string {
    return this._symbolizerUnits;
  }

  /**
   * Setter for _symbolizerUnits
   * @param {string} symbolizerUnits The _symbolizerUnits value to set
   */
  set symbolizerUnits(symbolizerUnits: string) {
    this._symbolizerUnits = symbolizerUnits;
  }

  /**
   * The readStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a SLD as a string and returns a Promise.
   * The Promise itself resolves with a GeoStyler-Style Style.
   *
   * @param {string} sldString A SLD as a string.
   * @return {Promise} The Promise resolving with the GeoStyler-Style Style
   */
  readStyle(sldString: string): Promise<ReadStyleResult> {
    return new Promise<ReadStyleResult>((resolve) => {
      // try {
      const output = this.parser.parse(sldString);
      const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(output);
      resolve({
        output: geoStylerStyle
      });
      // } catch (error) {
      //   resolve({
      //     errors: [error]
      //   });
      // }
    });
  }

  /**
   * Get the GeoStyler-Style Style from an SLD Object (created with xml2js).
   *
   * @param sldObject The SLD object representation (created with xml2js)
   * @return The GeoStyler-Style Style
   */
  sldObjectToGeoStylerStyle(sldObject: any): Style {
    const rules = this.getRulesFromSldObject(sldObject);
    const name = this.getStyleNameFromSldObject(sldObject);
    return {
      name,
      rules
    };
  }

  /**
   * Get the GeoStyler-Style Rule from an SLD Object (created with xml2js).
   *
   * @param sldObject The SLD object representation (created with xml2js)
   * @return The GeoStyler-Style Rule
   */
  getRulesFromSldObject(sldObject: any): Rule[] {
    const layers = getChildren(sldObject[0].StyledLayerDescriptor, 'NamedLayer');
    const rules: Rule[] = [];
    layers.forEach(({NamedLayer: layer}: any) => {
      getChildren(layer, 'UserStyle').forEach(({UserStyle: userStyle}: any) => {
        getChildren(userStyle, 'FeatureTypeStyle').forEach(({FeatureTypeStyle: featureTypeStyle}: any) => {
          getChildren(featureTypeStyle, 'Rule').forEach(({Rule: sldRule}: any) => {
            const filter: Filter | undefined = this.getFilterFromRule(sldRule);
            const scaleDenominator: ScaleDenominator | undefined = this.getScaleDenominatorFromRule(sldRule);
            const symbolizers: Symbolizer[] = this.getSymbolizersFromRule(sldRule);
            const ruleTitle = get(sldRule, 'Title.#text');
            const ruleName = get(sldRule, 'Name.#text');
            const name = ruleTitle !== undefined
              ? ruleTitle
              : (ruleName !== undefined ? ruleName : '');
            const rule: Rule = <Rule> {
              name
            };
            if (filter) {
              rule.filter = filter;
            }
            if (scaleDenominator) {
              rule.scaleDenominator = scaleDenominator;
            }
            if (symbolizers) {
              rule.symbolizers = symbolizers;
            }
            rules.push(rule);
          });
        });
      });
    });
    return rules;
  }

  /**
   * Get the name for the Style from the SLD Object. Returns the Title of the UserStyle
   * if defined or the Name of the NamedLayer if defined or an empty string.
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {string} The name to be used for the GeoStyler Style Style
   */
  getStyleNameFromSldObject(sldObject: any): string {
    const userStyleTitle = get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].UserStyle.Title.#text');
    const namedLayerName = get(sldObject, 'StyledLayerDescriptor.NamedLayer.Name.#text');
    return userStyleTitle ? userStyleTitle
      : namedLayerName ? namedLayerName : '';
  }

  /**
   * Get the GeoStyler-Style Filter from an SLD Rule.
   *
   * Currently only supports one Filter per Rule.
   *
   * @param sldRule The SLD Rule
   * @return The GeoStyler-Style Filter
   */
  getFilterFromRule(sldRule: any[]): Filter | undefined {
    const sldFilter = get(sldRule, 'Filter');
    if (!sldFilter || sldFilter.length === 0) {
      return;
    }
    const operator = Object.keys(sldFilter[0])?.[0];
    if (!operator) {
      return;
    }
    const filter = this.getFilterFromOperatorAndComparison(operator, sldFilter);
    return filter;
  }

  /**
   * Get the GeoStyler-Style ScaleDenominator from an SLD Rule.
   *
   * @param sldRule The SLD Rule
   * @return The GeoStyler-Style ScaleDenominator
   */
  getScaleDenominatorFromRule(sldRule: any[]): ScaleDenominator | undefined {
    const scaleDenominator: ScaleDenominator = <ScaleDenominator> {};
    const min = get(sldRule, 'MinScaleDenominator.#text');
    if (min) {
      scaleDenominator.min = Number(min);
    }
    const max = get(sldRule, 'MaxScaleDenominator.#text');
    if (max) {
      scaleDenominator.max = Number(max);
    }

    return (scaleDenominator.min || scaleDenominator.max)
      ? scaleDenominator
      : undefined;
  }

  /**
   * Get the GeoStyler-Style Symbolizers from an SLD Rule.
   *
   * @param sldRule The SLD Rule
   * @return The GeoStyler-Style Symbolizer Array
   */
  getSymbolizersFromRule(sldRule: any[]): Symbolizer[] {
    const symbolizers: Symbolizer[] = sldRule
      .filter(isSymbolizer)
      .map((sldSymbolizer: any) => {
        const sldSymbolizerName: string = Object.keys(sldSymbolizer)[0];
        switch (sldSymbolizerName) {
          case 'PointSymbolizer':
            return this.getPointSymbolizerFromSldSymbolizer(sldSymbolizer.PointSymbolizer);
          case 'LineSymbolizer':
            return this.getLineSymbolizerFromSldSymbolizer(sldSymbolizer.LineSymbolizer);
          case 'TextSymbolizer':
            return this.getTextSymbolizerFromSldSymbolizer(sldSymbolizer.TextSymbolizer);
          case 'PolygonSymbolizer':
            return this.getFillSymbolizerFromSldSymbolizer(sldSymbolizer.PolygonSymbolizer);
          case 'RasterSymbolizer':
            return this.getRasterSymbolizerFromSldSymbolizer(sldSymbolizer.RasterSymbolizer);
          default:
            throw new Error('Failed to parse SymbolizerKind from SldRule');
        }
      });

    return symbolizers;
  }

  /**
   * Creates a GeoStyler-Style Filter from a given operator name and the js
   * SLD object representation (created with xml2js) of the SLD Filter.
   *
   * @param {string} sldOperatorName The Name of the SLD Filter Operator
   * @param {object} sldFilter The SLD Filter
   * @return {Filter} The GeoStyler-Style Filter
   */
  getFilterFromOperatorAndComparison(sldOperatorName: string, sldFilter: any): Filter {
    let filter: Filter;

    // we have to first check for PropertyIsBetween,
    // since it is also a comparisonOperator. But it
    // needs to be treated differently.
    if (sldOperatorName === 'PropertyIsBetween') {
      // TODO PropertyIsBetween spec allows more than just a
      //      PropertyName as its first argument.
      const propertyName = get(sldFilter, 'PropertyIsBetween.PropertyName.#text');
      const lower = Number(get(sldFilter, 'PropertyIsBetween.LowerBoundary.Literal.#text'));
      const upper = Number(get(sldFilter, 'PropertyIsBetween.UpperBoundary.Literal.#text'));

      filter = ['<=x<=', propertyName, lower, upper];
    } else if (Object.keys(SldStyleParser.comparisonMap).includes(sldOperatorName)) {
      const comparisonOperator: ComparisonOperator = SldStyleParser.comparisonMap[sldOperatorName];
      const propertyIsFilter = !!sldFilter.Function;
      const propertyOrFilter = propertyIsFilter
        ? this.getFunctionFilterFromSldFilter(sldFilter.Function)
        : get(sldFilter[sldOperatorName], 'PropertyName.#text');

      let value = null;
      if (sldOperatorName !== 'PropertyIsNull') {
        value = get(sldFilter[sldOperatorName], 'Literal.#text');
      }

      filter = [
        comparisonOperator,
        propertyOrFilter,
        value
      ];

    } else if (Object.keys(SldStyleParser.combinationMap).includes(sldOperatorName)) {
      const combinationOperator: CombinationOperator = SldStyleParser.combinationMap[sldOperatorName];
      const filters: Filter[] = get(sldFilter, sldOperatorName)?.map((op: any) => {
        const operatorName = Object.keys(op)?.[0];
        return this.getFilterFromOperatorAndComparison(operatorName, op);
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (Object.keys(SldStyleParser.negationOperatorMap).includes(sldOperatorName)) {
      const negationOperator = SldStyleParser.negationOperatorMap[sldOperatorName];
      const negatedOperator = Object.keys(sldFilter[sldOperatorName][0])[0];
      const negatedComparison = sldFilter[sldOperatorName][0];
      const negatedFilter: Filter = this.getFilterFromOperatorAndComparison(
        negatedOperator,
        negatedComparison
      );
      filter = [
        negationOperator,
        negatedFilter
      ];
    } else {
      throw new Error('No Filter detected');
    }
    return filter;
  }

  /**
   * Creates a GeoStyler-Style FunctionFilter from a SLD Function.
   *
   * @param sldFilter The SLD Filter
   * @return The GeoStyler-Style FunctionFilter
   */
  getFunctionFilterFromSldFilter(sldFilter: any): GeoStylerFunction | undefined {
    const functionName = get(sldFilter, 'Function[0].$.name');
    switch (functionName) {
      // case 'strMatches':
      //   return this.getStrMatchesFunctionFilterFromSldFilter(sldFilter);
      //   break;
      default:
        return undefined;
    }
  }

  /**
   * Get the GeoStyler-Style PointSymbolizer from an SLD Symbolizer.
   *
   * The opacity of the Symbolizer is taken from the <Graphic>.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style PointSymbolizer
   */
  getPointSymbolizerFromSldSymbolizer(sldSymbolizer: any): PointSymbolizer {
    let pointSymbolizer: PointSymbolizer;
    const wellKnownName: string = get(sldSymbolizer, 'Graphic.Mark.WellKnownName.#text');
    const externalGraphic: any = get(sldSymbolizer, 'Graphic.ExternalGraphic');
    if (externalGraphic) {
      pointSymbolizer = this.getIconSymbolizerFromSldSymbolizer(sldSymbolizer);
    } else {
      // geoserver does not set a wellKnownName for square explicitly since it is the default value.
      // Therefore, we have to set the wellKnownName to square if no wellKownName is given.
      if (!wellKnownName) {
        // TODO: Fix this. Idealy without lodash
        // _set(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]._', 'square');
      }
      pointSymbolizer = this.getMarkSymbolizerFromSldSymbolizer(sldSymbolizer);
    }
    return pointSymbolizer;
  }

  /**
   * Get the GeoStyler-Style LineSymbolizer from an SLD Symbolizer.
   *
   * Currently only the CssParameters are available.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style LineSymbolizer
   */
  getLineSymbolizerFromSldSymbolizer(sldSymbolizer: any): LineSymbolizer {
    const lineSymbolizer: LineSymbolizer = {
      kind: 'Line'
    };
    const strokeEl = get(sldSymbolizer, 'Stroke');
    if (strokeEl.length < 1) {
      throw new Error('LineSymbolizer cannot be parsed. No Stroke detected');
    }
    const color = getParameterValue(strokeEl, 'stroke', this.sldVersion);
    const width = getParameterValue(strokeEl, 'stroke-width', this.sldVersion);
    const opacity = getParameterValue(strokeEl, 'stroke-opacity', this.sldVersion);
    const lineJoin = getParameterValue(strokeEl, 'stroke-linejoin', this.sldVersion);
    const lineCap = getParameterValue(strokeEl, 'stroke-linecap', this.sldVersion);
    const dashArray = getParameterValue(strokeEl, 'stroke-dasharray', this.sldVersion);
    const dashOffset = getParameterValue(strokeEl, 'stroke-dashoffset', this.sldVersion);

    if (color) {
      lineSymbolizer.color = color;
    }
    if (width !== undefined) {
      lineSymbolizer.width = parseFloat(width);
    }
    if (opacity !== undefined) {
      lineSymbolizer.opacity = parseFloat(opacity);
    }
    if (lineJoin) {
      // geostyler-style and ol use 'miter' whereas sld uses 'mitre'
      if (lineJoin === 'mitre') {
        lineSymbolizer.join = 'miter';
      } else {
        lineSymbolizer.join = lineJoin as 'bevel' | 'miter' | 'round' | undefined;
      }
    }
    if (lineCap) {
      lineSymbolizer.cap = lineCap as 'round' | 'butt' | 'square' | undefined;
    }

    if (dashArray) {
      const dashStringAsArray = dashArray.split(' ').map(Number);
      lineSymbolizer.dasharray = dashStringAsArray;
    }
    if (dashOffset) {
      lineSymbolizer.dashOffset = Number(dashOffset);
    }

    const graphicStroke = get(strokeEl, 'GraphicStroke');
    if (graphicStroke !== undefined) {
      lineSymbolizer.graphicStroke = this.getPointSymbolizerFromSldSymbolizer(graphicStroke);
    }

    const graphicFill = get(strokeEl, 'GraphicFill');
    if (graphicFill !== undefined) {
      lineSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(graphicFill);
    }

    const perpendicularOffset = get(sldSymbolizer, 'PerpendicularOffset.#text');
    if (perpendicularOffset !== undefined) {
      lineSymbolizer.perpendicularOffset = Number(perpendicularOffset);
    }

    return lineSymbolizer;
  }

  /**
   * Get the GeoStyler-Style TextSymbolizer from an SLD Symbolizer.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style TextSymbolizer
   */
  getTextSymbolizerFromSldSymbolizer(sldSymbolizer: any): TextSymbolizer {
    const textSymbolizer: TextSymbolizer = {
      kind: 'Text'
    };
    const fontEl = get(sldSymbolizer, 'Font');
    const fillEl = get(sldSymbolizer, 'Fill');
    const labelEl = get(sldSymbolizer, 'Label');
    const haloEl = get(sldSymbolizer, 'Halo');
    const haloFillEl = get(haloEl, 'Fill');

    const color = getParameterValue(fillEl, 'fill', this.sldVersion);
    const opacity = getParameterValue(fillEl, 'fill-opacity', this.sldVersion);

    const fontFamily = getParameterValue(fontEl, 'font-family', this.sldVersion);
    const fontStyle = getParameterValue(fontEl, 'font-style', this.sldVersion);
    const fontSize = getParameterValue(fontEl, 'font-size', this.sldVersion);
    const fontWeight = getParameterValue(fontEl, 'font-weight', this.sldVersion);

    const haloColor = getParameterValue(haloFillEl, 'fill', this.sldVersion);

    if (labelEl) {
      textSymbolizer.label = this.getTextSymbolizerLabelFromSldSymbolizer(labelEl);
    }

    textSymbolizer.color = color ? color : '#000000';
    textSymbolizer.opacity = opacity ? Number(opacity) : 1;

    const haloRadius = get(sldSymbolizer, 'Halo.Radius.#text');
    if (haloRadius) {
      textSymbolizer.haloWidth = Number(haloRadius);
    }
    if (haloColor) {
      textSymbolizer.haloColor = haloColor;
    }
    const displacement = get(sldSymbolizer, 'LabelPlacement.PointPlacement.Displacement');
    if (displacement) {
      const x = get(displacement, 'DisplacementX.#text');
      const y = get(displacement, 'DisplacementY.#text');
      textSymbolizer.offset = [
        x ? parseFloat(x) : 0,
        y ? parseFloat(y) : 0,
      ];
    }
    const rotation = get(sldSymbolizer, 'LabelPlacement.PointPlacement.Rotation.#text');
    if (rotation) {
      textSymbolizer.rotate = Number(rotation);
    }
    if (fontFamily) {
      textSymbolizer.font = [fontFamily];
    }
    if (fontStyle) {
      textSymbolizer.fontStyle = fontStyle as 'normal' | 'italic' | 'oblique' | undefined;
    }
    if (fontWeight) {
      textSymbolizer.fontWeight = fontWeight as 'normal' | 'bold' | undefined;
    }
    if (fontSize) {
      textSymbolizer.size = Number(fontSize);
    }
    return textSymbolizer;
  }

  /**
   * Create a template string from a TextSymbolizer Label element.
   * The ordering of the elemments inside the Label element is preserved.
   *
   * Examples:
   * <Label>
   *  <Literal>foo</Literal>
   *  <PropertyName>bar</PropertyName>
   * </Label>
   * --> "foo{{bar}}"
   *
   * <Label>
   *  <PropertyName>bar</PropertyName>
   *  <Literal>foo</Literal>
   * </Label>
   * --> "{{bar}}foo"
   *
   * <Label>
   *  <PropertyName>bar</PropertyName>
   *  <Literal>foo</Literal>
   *  <PropertyName>john</PropertyName>
   * </Label>
   * --> "{{bar}}foo{{john}}"
   *
   * <Label>
   *  <PropertyName>bar</PropertyName>
   *  <PropertyName>john</PropertyName>
   *  <Literal>foo</Literal>
   * </Label>
   * --> "{{bar}}{{john}}foo"
   *
   * <Label>
   *  <PropertyName>bar</PropertyName>
   *  <PropertyName>john</PropertyName>
   *  <Literal>foo</Literal>
   *  <PropertyName>doe</PropertyName>
   * </Label>
   * --> "{{bar}}{{john}}foo{{doe}}"
   *
   */
  getTextSymbolizerLabelFromSldSymbolizer = (sldLabel: any): string => {
    const label: string = sldLabel
      .map((labelEl: any) => {
        // TODO: ogc namespace should be removed on parsing. check why it is not
        // TODO: fast-xml-parser trims everything between xml tags. whitspaces get
        // lost. When trimValues is set to false ALL whitespaces are kept including newlines etc.
        const labelName = Object.keys(labelEl)[0];
        switch (labelName.replace('ogc:', '')) {
          case '#text':
            return labelEl['#text'];
          case 'Literal':
            return labelEl[labelName][0]['#text'];
          case 'PropertyName':
            const propName = labelEl[labelName][0]['#text'];
            return `{{${propName}}}`;
            // TODO: handle CDATA property
          default:
            return '';
        }
      })
      .join('');
    return label;
  };

  /**
   * Get the GeoStyler-Style FillSymbolizer from an SLD Symbolizer.
   *
   * PolygonSymbolizer Stroke is just partially supported.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style FillSymbolizer
   */
  getFillSymbolizerFromSldSymbolizer(sldSymbolizer: any): FillSymbolizer {
    const fillSymbolizer: FillSymbolizer = {
      kind: 'Fill'
    };
    const strokeEl = get(sldSymbolizer, 'Stroke');
    const fillEl = get(sldSymbolizer, 'Fill');

    const fillOpacity = getParameterValue(fillEl, 'fill-opacity', this.sldVersion);
    const color = getParameterValue(fillEl, 'fill', this.sldVersion);

    const outlineColor = getParameterValue(strokeEl, 'stroke', this.sldVersion);
    const outlineWidth = getParameterValue(strokeEl, 'stroke-width', this.sldVersion);
    const outlineOpacity = getParameterValue(strokeEl, 'stroke-opacity', this.sldVersion);
    const outlineDashArray = getParameterValue(strokeEl, 'stroke-dasharray', this.sldVersion);
    // const outlineDashOffset = getParameterValue(strokeEl, 'stroke-dashoffset', this.sldVersion);

    const graphicFill = get(sldSymbolizer, 'Fill.GraphicFill');
    if (graphicFill) {
      fillSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(
        graphicFill
      );
    }
    if (color) {
      fillSymbolizer.color = color;
    }
    if (fillOpacity) {
      fillSymbolizer.fillOpacity = Number(fillOpacity);

    } else {
      if (!fillSymbolizer.color) {
        fillSymbolizer.opacity = 0;
      }
    }

    if (outlineColor) {
      fillSymbolizer.outlineColor = outlineColor;
    }
    if (outlineWidth) {
      fillSymbolizer.outlineWidth = Number(outlineWidth);
    }
    if (outlineOpacity) {
      fillSymbolizer.outlineOpacity = Number(outlineOpacity);
    }
    if (outlineDashArray) {
      fillSymbolizer.outlineDasharray = outlineDashArray.split(' ').map(Number);
    }
    // TODO: seems like this is missing in the geostyer-stlye
    // if (outlineDashOffset) {
    //   fillSymbolizer.outlineDashOffset = Number(outlineDashOffset);
    // }
    return fillSymbolizer;
  }

  /**
   * Get the GeoStyler-Style RasterSymbolizer from a SLD Symbolizer.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   */
  getRasterSymbolizerFromSldSymbolizer(sldSymbolizer: any): RasterSymbolizer {
    const rasterSymbolizer: RasterSymbolizer = {
      kind: 'Raster'
    };
      // parse Opacity
    let opacity = get(sldSymbolizer, 'Opacity.#text');
    if (opacity) {
      opacity = parseFloat(opacity);
      rasterSymbolizer.opacity = opacity;
    }
    // parse ColorMap
    const sldColorMap = get(sldSymbolizer, 'ColorMap');
    const sldColorMapType = get(sldSymbolizer, 'ColorMap.@type');
    const extended = get(sldSymbolizer, 'ColorMap.@extended');
    if (sldColorMap) {
      const colormap = this.getColorMapFromSldColorMap(sldColorMap, sldColorMapType, extended);
      rasterSymbolizer.colorMap = colormap;
    }
    // parse ChannelSelection
    const sldChannelSelection = get(sldSymbolizer, 'ChannelSelection');
    if (sldChannelSelection) {
      const channelSelection = this.getChannelSelectionFromSldChannelSelection(sldChannelSelection);
      rasterSymbolizer.channelSelection = channelSelection;
    }
    // parse ContrastEnhancement
    const sldContrastEnhancement = get(sldSymbolizer, 'ContrastEnhancement');
    if (sldContrastEnhancement) {
      const contrastEnhancement = this.getContrastEnhancementFromSldContrastEnhancement(sldContrastEnhancement);
      rasterSymbolizer.contrastEnhancement = contrastEnhancement;
    }
    return rasterSymbolizer;
  }

  /**
   * Get the GeoStyler-Style MarkSymbolizer from an SLD Symbolizer
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style MarkSymbolizer
   */
  getMarkSymbolizerFromSldSymbolizer(sldSymbolizer: any): MarkSymbolizer {
    const wellKnownName: WellKnownName = get(sldSymbolizer, 'Graphic.Mark.WellKnownName.#text');
    const strokeEl = get(sldSymbolizer, 'Graphic.Mark.Stroke');
    const fillEl = get(sldSymbolizer, 'Graphic.Mark.Fill');

    const opacity: string = get(sldSymbolizer, 'Graphic.Opacity.#text');
    const size: string = get(sldSymbolizer, 'Graphic.Size.#text');
    const rotation: string = get(sldSymbolizer, 'Graphic.Rotation.#text');
    const fillOpacity = getParameterValue(fillEl, 'fill-opacity', this.sldVersion);
    const color = getParameterValue(fillEl, 'fill', this.sldVersion);

    const markSymbolizer: MarkSymbolizer = {
      kind: 'Mark',
      wellKnownName: 'circle'
    };

    if (opacity) {
      markSymbolizer.opacity = Number(opacity);
    }
    if (fillOpacity) {
      markSymbolizer.fillOpacity = Number(fillOpacity);
    }
    if (color) {
      markSymbolizer.color = color;
    }
    if (rotation) {
      markSymbolizer.rotate = Number(rotation);
    }
    if (size) {
      markSymbolizer.radius = Number(size) / 2;
    }

    switch (wellKnownName) {
      case 'circle':
      case 'square':
      case 'triangle':
      case 'star':
      case 'cross':
      case 'x':
      case 'shape://vertline':
      case 'shape://horline':
      case 'shape://slash':
      case 'shape://backslash':
      case 'shape://dot':
      case 'shape://plus':
      case 'shape://times':
      case 'shape://oarrow':
      case 'shape://carrow':
        markSymbolizer.wellKnownName = wellKnownName;
        break;
      default:
        if (WELLKNOWNNAME_TTF_REGEXP.test(wellKnownName)) {
          markSymbolizer.wellKnownName = wellKnownName;
          break;
        }
        throw new Error('MarkSymbolizer cannot be parsed. Unsupported WellKnownName.');
    }

    const strokeColor = getParameterValue(strokeEl, 'stroke', this.sldVersion);
    if (strokeColor) {
      markSymbolizer.strokeColor = strokeColor;
    }
    const strokeWidth = getParameterValue(strokeEl, 'stroke-width', this.sldVersion);
    if (strokeWidth) {
      markSymbolizer.strokeWidth = Number(strokeWidth);
    }
    const strokeOpacity = getParameterValue(strokeEl, 'stroke-opacity', this.sldVersion);
    if (strokeOpacity) {
      markSymbolizer.strokeOpacity = Number(strokeOpacity);
    }

    return markSymbolizer;
  }

  /**
   * Get the GeoStyler-Style IconSymbolizer from an SLD Symbolizer
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The GeoStyler-Style IconSymbolizer
   */
  getIconSymbolizerFromSldSymbolizer(sldSymbolizer: any): IconSymbolizer {
    const image = get(sldSymbolizer, 'Graphic.ExternalGraphic.OnlineResource.@xlink:href');
    const iconSymbolizer: IconSymbolizer = <IconSymbolizer> {
      kind: 'Icon',
      image
    };
    const opacity: string = get(sldSymbolizer, 'Graphic.Opacity.#text');
    const size: string = get(sldSymbolizer, 'Graphic.Size.#text');
    const rotation: string = get(sldSymbolizer, 'Graphic.Rotation.#text');
    if (opacity) {
      iconSymbolizer.opacity = Number(opacity);
    }
    if (size) {
      iconSymbolizer.size = Number(size);
    }
    if (rotation) {
      iconSymbolizer.rotate = Number(rotation);
    }
    return iconSymbolizer;
  }

  /**
   * Get the GeoStyler-Style ColorMap from a SLD ColorMap.
   *
   * @param {object} sldColorMap The SLD ColorMap
   */
  getColorMapFromSldColorMap(sldColorMap: any, type: ColorMapType = 'ramp', extended?: string): ColorMap {
    const colorMap: ColorMap = {
      type
    };

    if (extended) {
      if (extended === 'true') {
        colorMap.extended = true;
      } else {
        colorMap.extended = false;
      }
    }

    const colorMapEntries = getChildren(sldColorMap, 'ColorMapEntry');
    if (Array.isArray(colorMapEntries)) {
      const cmEntries = colorMapEntries.map((cm) => {
        const color = getAttribute(cm, 'color');
        if (!color) {
          throw new Error('Cannot parse ColorMapEntries. color is undefined.');
        }
        let quantity = getAttribute(cm, 'quantity');
        if (quantity) {
          quantity = parseFloat(quantity);
        }
        const label = getAttribute(cm, 'label');
        let opacity = getAttribute(cm, 'opacity');
        if (opacity) {
          opacity = parseFloat(opacity);
        }
        return {
          color,
          quantity,
          label,
          opacity
        } as ColorMapEntry;
      });
      colorMap.colorMapEntries = cmEntries;
    }

    return colorMap;
  }

  /**
     * Get the GeoStyler-Style ContrastEnhancement from a SLD ContrastEnhancement.
     *
     * @param {object} sldContrastEnhancement The SLD ContrastEnhancement
     */
  getContrastEnhancementFromSldContrastEnhancement(sldContrastEnhancement: any): ContrastEnhancement {
    const contrastEnhancement: ContrastEnhancement = {};

    // parse enhancementType
    const hasHistogram = !!get(sldContrastEnhancement, 'Histogram');
    const hasNormalize = !!get(sldContrastEnhancement, 'Normalize');
    if (hasHistogram && hasNormalize) {
      throw new Error(`Cannot parse ContrastEnhancement. Histogram and Normalize
        are mutually exclusive.`);
    } else if (hasHistogram) {
      contrastEnhancement.enhancementType = 'histogram';
    } else if (hasNormalize) {
      contrastEnhancement.enhancementType = 'normalize';
    }
    // parse gammavalue
    let gammaValue = get(sldContrastEnhancement, 'GammaValue.#text');
    if (gammaValue) {
      gammaValue = Number(gammaValue);
    }
    contrastEnhancement.gammaValue = gammaValue;

    return contrastEnhancement;
  }

  /**
     * Get the GeoStyler-Style Channel from a SLD Channel.
     *
     * @param {object} sldChannel The SLD Channel
     */
  getChannelFromSldChannel(sldChannel: any): Channel {
    const sourceChannelName = get(sldChannel, 'SourceChannelName.#text')?.toString();
    const channel: Channel = {
      sourceChannelName
    };
    const contrastEnhancement = get(sldChannel, 'ContrastEnhancement');
    if (contrastEnhancement) {
      channel.contrastEnhancement = this.getContrastEnhancementFromSldContrastEnhancement(contrastEnhancement);
    }
    return channel;
  }

  /**
     * Get the GeoStyler-Style ChannelSelection from a SLD ChannelSelection.
     *
     * @param {object} sldChannelSelection The SLD ChannelSelection
     */
  getChannelSelectionFromSldChannelSelection(sldChannelSelection: any): ChannelSelection {
    let channelSelection: ChannelSelection;
    const red = get(sldChannelSelection, 'RedChannel');
    const blue = get(sldChannelSelection, 'BlueChannel');
    const green = get(sldChannelSelection, 'GreenChannel');
    const gray = get(sldChannelSelection, 'GrayChannel');

    if (gray && red && blue && green) {
      throw new Error('Cannot parse ChannelSelection. RGB and Grayscale are mutually exclusive');
    }
    if (gray) {
      const grayChannel = this.getChannelFromSldChannel(gray);
      channelSelection = {
        grayChannel
      };
    } else if (red && green && blue) {
      const redChannel = this.getChannelFromSldChannel(red);
      const blueChannel = this.getChannelFromSldChannel(blue);
      const greenChannel = this.getChannelFromSldChannel(green);
      channelSelection = {
        redChannel,
        blueChannel,
        greenChannel
      };
    } else {
      throw new Error('Cannot parse ChannelSelection. Red, Green and Blue channels must be defined.');
    }
    return channelSelection;
  }

  /**
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   * The Promise itself resolves with a SLD string.
   *
   * @param geoStylerStyle A GeoStyler-Style Style.
   * @return The Promise resolving with the SLD as a string.
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      const unsupportedProperties = this.checkForUnsupportedProperites(geoStylerStyle);
      // try {
      const sldObject = this.geoStylerStyleToSldObject(geoStylerStyle);
      const sldString = this.builder.build(sldObject);
      resolve({
        output: sldString,
        unsupportedProperties,
        warnings: unsupportedProperties && ['Your style contains unsupportedProperties!']
      });
      // } catch (error) {
      //   resolve({
      //     errors: [error]
      //   });
      // }
    });
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style Style
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {object} The object representation of a SLD Style (readable with xml2js)
   */
  geoStylerStyleToSldObject(geoStylerStyle: Style): any {
    const rules: any[] = this.getSldRulesFromRules(geoStylerStyle.rules);
    // add the ogc namespace to the filter element, if a filter is present
    rules.forEach(rule => {
      if (rule.Filter && !rule.Filter['@_xmlns']) {
        rule.Filter['@_xmlns'] = 'http://www.opengis.net/ogc';
      }
    });

    if (this.sldVersion !== '1.0.0') {
      return SymbologyEncoder.getSymbologyEncoding(geoStylerStyle, rules, this.symbolizerUnits);
    }
    return {
      '?xml': {
        '@_version': '1.0',
        '@_encoding': 'UTF-8',
        '@_standalone': 'yes'
      },
      StyledLayerDescriptor: {
        '@_version': '1.0.0',
        '@_xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd',
        '@_xmlns': 'http://www.opengis.net/sld',
        '@_xmlns:ogc': 'http://www.opengis.net/ogc',
        '@_xmlns:xlink': 'http://www.w3.org/1999/xlink',
        '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'NamedLayer': [{
          'Name': [geoStylerStyle.name || ''],
          'UserStyle': [{
            'Name': [geoStylerStyle.name || ''],
            'Title': [geoStylerStyle.name || ''],
            'FeatureTypeStyle': [{
              'Rule': rules
            }]
          }]
        }]
      }
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style Rule.
   *
   * @param rules An array of GeoStyler-Style Rules.
   * @return The object representation of a SLD Rule (readable with xml2js)
   */
  getSldRulesFromRules(rules: Rule[]): any {
    return rules.map((rule: Rule) => {
      let sldRule: any = {
        Name: [rule.name]
      };
      if (rule.filter) {
        const filter = this.getSldFilterFromFilter(rule.filter);
        sldRule.Filter = filter;
      }
      if (rule.scaleDenominator) {
        const { min, max } = rule.scaleDenominator;
        if (min && Number.isFinite(min)) {
          sldRule.MinScaleDenominator = [min.toString()];
        }
        if (max && Number.isFinite(max)) {
          sldRule.MaxScaleDenominator = [max.toString()];
        }
      }

      // Remove empty Symbolizers and check if there is at least 1 symbolizer
      const symbolizers = this.getSldSymbolizersFromSymbolizers(rule.symbolizers);
      let symbolizerKeys: string[] = [];
      if (symbolizers.length > 0) {
        symbolizerKeys = Object.keys(symbolizers[0]);
      }

      symbolizerKeys.forEach((key: string) => {
        if (symbolizers[0][key].length === 0) {
          delete symbolizers[0][key];
        }
      });
      if (symbolizers.length > 0 && Object.keys(symbolizers[0]).length !== 0) {
        sldRule = Object.assign(sldRule, symbolizers[0]);
      }
      return sldRule;
    });
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ComparisonFilter.
   *
   * @param {ComparisonFilter} comparisonFilter A GeoStyler-Style ComparisonFilter.
   * @return {object} The object representation of a SLD Filter Expression with a
   * comparison operator (readable with xml2js)
   */
  getSldComparisonFilterFromComparisonFilter(comparisonFilter: ComparisonFilter): any[] {
    const sldComparisonFilter: any = {};
    const operator = comparisonFilter[0];
    const key = comparisonFilter[1];
    const value = comparisonFilter[2];

    const sldOperators: string[] = keysByValue(SldStyleParser.comparisonMap, operator);
    const sldOperator: string = (sldOperators.length > 1 && value === null)
      ? sldOperators[1] : sldOperators[0];

    const propertyKey = 'PropertyName';

    // TODO: parse GeoStylerFunction
    // if (Array.isArray(key) && key[0].startsWith('FN_')) {
    //   key = this.getSldFunctionFilterFromFunctionFilter(key);
    //   propertyKey = 'Function';
    // }

    if (sldOperator === 'PropertyIsNull') {
      // empty, selfclosing Literals are not valid in a propertyIsNull filter
      sldComparisonFilter[sldOperator] = [{
        [propertyKey]: [key]
      }];
    } else if (sldOperator === 'PropertyIsLike') {
      sldComparisonFilter[sldOperator] = [{
        '@_wildCard': '*',
        '@_singleChar': '.',
        '@_escape': '!',
        [propertyKey]: [key],
        'Literal': [value]
      }];
    } else if (sldOperator === 'PropertyIsBetween') {
      // Currently we only support Literals as values.
      const betweenFilter = comparisonFilter as RangeFilter;
      sldComparisonFilter[sldOperator] = [{
        [propertyKey]: [key],
        'LowerBoundary': [{
          'Literal': [betweenFilter[2]]
        }],
        'UpperBoundary': [{
          'Literal': [betweenFilter[3]]
        }]
      }];
    } else {
      sldComparisonFilter[sldOperator] = [{
        [propertyKey]: [key],
        'Literal': [value]
      }];
    }

    return sldComparisonFilter;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style Filter.
   *
   * @param filter A GeoStyler-Style Filter.
   * @return The object representation of a SLD Filter Expression (readable with xml2js)
   */
  getSldFilterFromFilter(filter: Filter): any[] {
    let sldFilter: any = {};

    if (isComparisonFilter(filter)) {
      sldFilter = this.getSldComparisonFilterFromComparisonFilter(filter);
    } else if (isCombinationFilter(filter)) {
      const [
        operator,
        ...args
      ] = filter;
      const sldOperators: string[] = keysByValue(SldStyleParser.combinationMap, operator);
      // TODO: Implement logic for "PropertyIsBetween" filter
      const combinator = sldOperators[0];
      sldFilter[combinator] = [{}];
      args.forEach((subFilter: Filter, subFilterIdx: number) => {
        const sldSubFilter = this.getSldFilterFromFilter(subFilter);
        const filterName = Object.keys(sldSubFilter)[0];

        if (subFilter[0] === '||' || subFilter[0] === '&&') {
          if (isCombinationFilter(subFilter)) {
            if (!(sldFilter[combinator][0][filterName])) {
              sldFilter[combinator][0][filterName] = [];
            }
            sldFilter[combinator][0][filterName][subFilterIdx] = {};
          } else {
            sldFilter[combinator][0][filterName] = {};
          }
          const parentFilterName = Object.keys(sldSubFilter)[0];

          subFilter.forEach((el: any, index: number) => {
            if (index > 0) {
              const sldSubFilter2 = this.getSldFilterFromFilter(el);
              const filterName2 = Object.keys(sldSubFilter2)[0];
              if (!(sldFilter[combinator][0][parentFilterName][subFilterIdx])) {
                sldFilter[combinator][0][parentFilterName][subFilterIdx] = {};
              }
              if (!sldFilter[combinator][0][parentFilterName][subFilterIdx][filterName2]) {
                sldFilter[combinator][0][parentFilterName][subFilterIdx][filterName2] = [];
              }
              sldFilter[combinator][0][parentFilterName][subFilterIdx][filterName2]
                .push(sldSubFilter2[filterName2][0]);
            }
          });
        } else {
          if (Array.isArray(sldFilter[combinator][0][filterName])) {
            sldFilter[combinator][0][filterName].push(sldSubFilter[filterName][0]);
          } else {
            sldFilter[combinator][0][filterName] = sldSubFilter[filterName];
          }
        }
      });
    } else if (isNegationFilter(filter)) {
      sldFilter.Not = this.getSldFilterFromFilter(filter[1]);
    }
    return sldFilter;
  }

  /**
   * Get the SLD Object (readable with xml2js) from GeoStyler-Style Symbolizers.
   *
   * @param {Symbolizer[]} symbolizers A GeoStyler-Style Symbolizer array.
   * @return {object} The object representation of a SLD Symbolizer (readable with xml2js)
   */
  getSldSymbolizersFromSymbolizers(symbolizers: Symbolizer[]): any {
    const sldSymbolizers: any = [];
    const sldSymbolizer: any = {};
    symbolizers.forEach(symb => {
      let sldSymb: any;
      switch (symb.kind) {
        case 'Mark':
          if (!sldSymbolizer.PointSymbolizer) {
            sldSymbolizer.PointSymbolizer = [];
          }
          sldSymb = this.getSldPointSymbolizerFromMarkSymbolizer(symb);
          if (sldSymb?.PointSymbolizer[0]) {
            sldSymbolizer.PointSymbolizer.push(sldSymb?.PointSymbolizer[0]);
          }
          break;
        case 'Icon':
          if (!sldSymbolizer.PointSymbolizer) {
            sldSymbolizer.PointSymbolizer = [];
          }

          sldSymb = this.getSldPointSymbolizerFromIconSymbolizer(symb);
          if (sldSymb?.PointSymbolizer[0]) {
            sldSymbolizer.PointSymbolizer.push(
              sldSymb?.PointSymbolizer[0]
            );
          }
          break;
        case 'Text':
          if (!sldSymbolizer.TextSymbolizer) {
            sldSymbolizer.TextSymbolizer = [];
          }

          sldSymb = this.getSldTextSymbolizerFromTextSymbolizer(symb);
          if (sldSymb?.TextSymbolizer[0]) {
            sldSymbolizer.TextSymbolizer.push(
              sldSymb?.TextSymbolizer[0]
            );
          }
          break;
        case 'Line':
          if (!sldSymbolizer.LineSymbolizer) {
            sldSymbolizer.LineSymbolizer = [];
          }

          sldSymb = this.getSldLineSymbolizerFromLineSymbolizer(symb);
          if (sldSymb?.LineSymbolizer[0]) {
            sldSymbolizer.LineSymbolizer.push(
              sldSymb?.LineSymbolizer[0]
            );
          }
          break;
        case 'Fill':
          if (!sldSymbolizer.PolygonSymbolizer) {
            sldSymbolizer.PolygonSymbolizer = [];
          }

          sldSymb = this.getSldPolygonSymbolizerFromFillSymbolizer(symb);
          if (sldSymb?.PolygonSymbolizer[0]) {
            sldSymbolizer.PolygonSymbolizer.push(
              sldSymb?.PolygonSymbolizer[0]
            );
          }
          break;
        case 'Raster':
          if (!sldSymbolizer.RasterSymbolizer) {
            sldSymbolizer.RasterSymbolizer = [];
          }

          sldSymb = this.getSldRasterSymbolizerFromRasterSymbolizer(symb);
          if (sldSymb?.RasterSymbolizer[0]) {
            sldSymbolizer.RasterSymbolizer.push(
              sldSymb?.RasterSymbolizer[0]
            );
          }
          break;
        default:
          break;
      }
      sldSymbolizers.push(sldSymbolizer);
    });
    return sldSymbolizers;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style MarkSymbolizer.
   *
   * @param markSymbolizer A GeoStyler-Style MarkSymbolizer.
   * @return The object representation of a SLD PointSymbolizer with a
   * Mark (readable with xml2js)
   */
  getSldPointSymbolizerFromMarkSymbolizer(markSymbolizer: MarkSymbolizer): any {
    const isFontSymbol = WELLKNOWNNAME_TTF_REGEXP.test(markSymbolizer.wellKnownName);
    const mark: any[] = [{
      'WellKnownName': [
        isFontSymbol ? markSymbolizer.wellKnownName : markSymbolizer.wellKnownName.toLowerCase()
      ]
    }];

    if (markSymbolizer.color || markSymbolizer.fillOpacity) {
      const cssParameters = [];
      if (markSymbolizer.color) {
        // TODO: parse GeoStylerFunctions
        // const expr = this.getSldExpressionFromExpression(markSymbolizer.color);
        // if (typeof expr !== 'object') {
        //   cssParameters.push({
        //     _: expr,
        //     $: {
        //       name: 'fill'
        //     }
        //   });
        // } else {
        cssParameters.push({
          '#text': markSymbolizer.color,
          '@_name': 'fill'
        });
        // }
      }
      if (markSymbolizer.fillOpacity) {
        cssParameters.push({
          '#text': markSymbolizer.fillOpacity,
          '@_name': 'fill-opacity'
        });
      }
      mark[0].Fill = [{
        'CssParameter': cssParameters
      }];
    }

    if (markSymbolizer.strokeColor || markSymbolizer.strokeWidth || markSymbolizer.strokeOpacity) {
      mark[0].Stroke = [{}];
      const strokeCssParameters = [];
      if (markSymbolizer.strokeColor) {
        // TODO: pars GeoStylerFunctions
        // if (isExpression(markSymbolizer.strokeColor)) {
        //   strokeCssParameters.push({
        //     ...this.getSldExpressionFromExpression(markSymbolizer.strokeColor),
        //     '$': {
        //       'name': 'stroke'
        //     }
        //   });
        // } else {
        strokeCssParameters.push({
          '#text': markSymbolizer.strokeColor,
          '@_name': 'stroke'
        });
        // }
      }
      if (markSymbolizer.strokeWidth) {
        strokeCssParameters.push({
          '#text': markSymbolizer.strokeWidth.toString(),
          '@_name': 'stroke-width'
        });
      }
      if (markSymbolizer.strokeOpacity) {
        strokeCssParameters.push({
          '#text': markSymbolizer.strokeOpacity.toString(),
          '@_name': 'stroke-opacity'
        });
      }
      mark[0].Stroke[0].CssParameter = strokeCssParameters;
    }

    const graphic: any[] = [{
      'Mark': mark
    }];

    if (markSymbolizer.opacity) {
      graphic[0].Opacity = [markSymbolizer.opacity.toString()];
    }

    if (typeof markSymbolizer.radius === 'number') {
      graphic[0].Size = [(markSymbolizer.radius * 2).toString()];
    }

    if (markSymbolizer.rotate) {
      graphic[0].Rotation = [markSymbolizer.rotate.toString()];
    }

    return {
      'PointSymbolizer': [{
        'Graphic': graphic
      }]
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style IconSymbolizer.
   *
   * @param iconSymbolizer A GeoStyler-Style IconSymbolizer.
   * @return The object representation of a SLD PointSymbolizer with
   * en "ExternalGraphic" (readable with xml2js)
   */
  getSldPointSymbolizerFromIconSymbolizer(iconSymbolizer: IconSymbolizer): any {
    const graphic: any[] = [{
      'ExternalGraphic': [{
        'OnlineResource': {
          '@_xlink:type': 'simple',
          '@_xmlns:xlink': 'http://www.w3.org/1999/xlink',
          '@_xlink:href': iconSymbolizer.image
        }
      }]
    }];

    if (typeof iconSymbolizer.image === 'string' || iconSymbolizer.image instanceof String) {
      const iconExt = iconSymbolizer.image.split('.').pop();
      switch (iconExt) {
        case 'png':
        case 'jpeg':
        case 'gif':
          graphic[0].ExternalGraphic[0].Format = [`image/${iconExt}`];
          break;
        case 'jpg':
          graphic[0].ExternalGraphic[0].Format = ['image/jpeg'];
          break;
        case 'svg':
          graphic[0].ExternalGraphic[0].Format = ['image/svg+xml'];
          break;
        default:
          break;
      }
    }

    if (iconSymbolizer.opacity) {
      graphic[0].Opacity = iconSymbolizer.opacity;
    }
    if (iconSymbolizer.size) {
      graphic[0].Size = iconSymbolizer.size;
    }
    if (iconSymbolizer.rotate) {
      graphic[0].Rotation = iconSymbolizer.rotate;
    }
    return {
      'PointSymbolizer': [{
        'Graphic': graphic
      }]
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style TextSymbolizer.
   *
   * @param textSymbolizer A GeoStyler-Style TextSymbolizer.
   * @return The object representation of a SLD TextSymbolizer (readable with xml2js)
   */
  getSldTextSymbolizerFromTextSymbolizer(textSymbolizer: TextSymbolizer): any {
    const sldTextSymbolizer: any = [{
      'Label': textSymbolizer.label ? this.getSldLabelFromTextSymbolizer(textSymbolizer.label) : undefined
    }];

    const fontPropertyMap = {
      font: 'font-family',
      size: 'font-size',
      fontStyle: 'font-style',
      fontWeight: 'font-weight'
    };

    const fontCssParameters: any[] = Object.keys(textSymbolizer)
      .filter((property: any) => property !== 'kind' && fontPropertyMap[property])
      .map((property: any) => {
        return {
          '#text': property === 'font'
            ? textSymbolizer[property][0]
            : textSymbolizer[property],
          '@_name': fontPropertyMap[property]
        };
      });

    if (fontCssParameters.length > 0) {
      sldTextSymbolizer[0].Font = [{
        'CssParameter': fontCssParameters
      }];
    }

    if (textSymbolizer.offset || textSymbolizer.rotate !== undefined) {
      const pointPlacement: any = [{}];

      if (textSymbolizer.offset) {
        pointPlacement[0].Displacement = [{
          'DisplacementX': [
            textSymbolizer.offset[0].toString()
          ],
          'DisplacementY': [
            textSymbolizer.offset[1].toString()
          ]
        }];
      }
      if (textSymbolizer.rotate !== undefined) {
        pointPlacement[0].Rotation = [textSymbolizer.rotate.toString()];
      }
      sldTextSymbolizer[0].LabelPlacement = [{
        PointPlacement: pointPlacement
      }];
    }

    if (textSymbolizer.haloWidth || textSymbolizer.haloColor) {
      const halo: any = {};
      const haloCssParameter = [];
      if (textSymbolizer.haloWidth) {
        halo.Radius = [textSymbolizer.haloWidth.toString()];
      }
      if (textSymbolizer.haloColor) {
        // TODO: parse GeoStylerFunction
        // if (isExpression(textSymbolizer.haloColor)) {
        //   haloCssParameter.push({
        //     ...this.getSldExpressionFromExpression(textSymbolizer.haloColor),
        //     '$': {
        //       'name': 'fill'
        //     }
        //   });
        // } else {
        haloCssParameter.push({
          '#text': textSymbolizer.haloColor,
          '@_name': 'fill'
        });
        // }
      }
      if (haloCssParameter.length > 0) {
        halo.Fill = [{
          CssParameter: haloCssParameter
        }];
      }
      sldTextSymbolizer[0].Halo = [halo];
    }
    if (textSymbolizer.color || textSymbolizer.opacity) {
      // TODO: parse GeoStylerFunction
      // if (isExpression(textSymbolizer.color)) {
      //   sldTextSymbolizer[0].Fill = [{
      //     'CssParameter': [{
      //       ...this.getSldExpressionFromExpression(textSymbolizer.color),
      //       '$': {
      //         'name': 'fill'
      //       }
      //     }, {
      //       '_': textSymbolizer.opacity || '1',
      //       '$': {
      //         'name': 'fill-opacity'
      //       }
      //     }]
      //   }];
      // } else {
      sldTextSymbolizer[0].Fill = [{
        'CssParameter': [{
          '#text': textSymbolizer.color || '#000000',
          '@_name': 'fill'
        }, {
          '#text': textSymbolizer.opacity || '1',
          '@_name': 'fill-opacity'
        }]
      }];
      // }
    }

    return {
      'TextSymbolizer': sldTextSymbolizer
    };
  }

  /**
   * Get the Label from a TextSymbolizer
   */
  getSldLabelFromTextSymbolizer = (template: Expression<string>): any => {
    // TODO: parse GeoStylerFunction
    if (!(typeof template === 'string' || template instanceof String)) {
      return;
    }

    // matches anything inside double curly braces (non-greedy)
    const placeholderReg = /^{{(.*?)}}/;
    // matches anything that does not start with curly braces
    const literalReg = /(^.+?){{|^([^{]+)$/;

    const tokens = [];
    const placeholderType = 'placeholder';
    const literalType = 'literal';
    let templateReducer = template as string;
    while (templateReducer.length) {
      const phMatch = placeholderReg.exec(templateReducer);
      if (phMatch) {
        tokens.push({type: placeholderType, value: phMatch[1]});
        // we have to strip the curly braces too
        templateReducer = templateReducer.substring(phMatch[1].length + 4);
      }

      const litMatch = literalReg.exec(templateReducer);
      if (litMatch) {
        if (litMatch[1]) {
          tokens.push({type: literalType, value: litMatch[1]});
          templateReducer = templateReducer.substring(litMatch[1].length);
        } else {
          tokens.push({type: literalType, value: litMatch[2]});
          templateReducer = templateReducer.substring(litMatch[2].length);
        }
      }
    }

    const sldLabel = tokens.map((token: any) => {
      if (token.type === placeholderType) {
        return {
          'ogc:PropertyName': token.value
        };
      }
      return {
        'ogc:Literal': token.value
      };

    });
    return sldLabel;
  };

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style LineSymbolizer.
   *
   * @param lineSymbolizer A GeoStyler-Style LineSymbolizer.
   * @return The object representation of a SLD LineSymbolizer (readable with xml2js)
   */
  getSldLineSymbolizerFromLineSymbolizer(lineSymbolizer: LineSymbolizer): any {
    const propertyMap = {
      color: 'stroke',
      width: 'stroke-width',
      opacity: 'stroke-opacity',
      join: 'stroke-linejoin',
      cap: 'stroke-linecap',
      dasharray: 'stroke-dasharray',
      dashOffset: 'stroke-dashoffset'
    };

    const result: any = {
      'LineSymbolizer': [{
        'Stroke': [{}]
      }]
    };

    const cssParameters: any[] = Object.keys(lineSymbolizer)
      .filter((property: any) => property !== 'kind' && propertyMap[property] &&
          lineSymbolizer[property] !== undefined && lineSymbolizer[property] !== null)
      .map((property: any) => {
        let value = lineSymbolizer[property];
        if (property === 'dasharray') {
          value = lineSymbolizer.dasharray ? lineSymbolizer.dasharray.join(' ') : undefined;
          return {
            '#text': value,
            '@_name': propertyMap[property]
          };
        }
        // simple transformation since geostyler-style uses prop 'miter' whereas sld uses 'mitre'
        if (property === 'join' && value === 'miter') {
          value = 'mitre';
        }

        // TODO: parse GeoStylerFunction
        // const expr = this.getSldExpressionFromExpression(lineSymbolizer[property]);
        // if (typeof expr !== 'object') {
        //   return {
        //     _: value,
        //     $: {
        //       name: propertyMap[property]
        //     }
        //   };
        // }

        return {
          '#text': lineSymbolizer[property],
          '@_name': propertyMap[property]
        };
      });

    const perpendicularOffset = lineSymbolizer.perpendicularOffset;

    if (lineSymbolizer?.graphicStroke) {
      if (lineSymbolizer?.graphicStroke?.kind === 'Mark') {
        const graphicStroke = this.getSldPointSymbolizerFromMarkSymbolizer(
            <MarkSymbolizer> lineSymbolizer.graphicStroke
        );
        result.LineSymbolizer[0].Stroke[0].GraphicStroke = [graphicStroke.PointSymbolizer[0]];
      } else if (lineSymbolizer?.graphicStroke?.kind === 'Icon') {
        const graphicStroke = this.getSldPointSymbolizerFromIconSymbolizer(
            <IconSymbolizer> lineSymbolizer.graphicStroke
        );
        result.LineSymbolizer[0].Stroke[0].GraphicStroke = [graphicStroke.PointSymbolizer[0]];
      }
    }

    if (lineSymbolizer?.graphicFill) {
      if (lineSymbolizer?.graphicFill?.kind === 'Mark') {
        const graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(
            <MarkSymbolizer> lineSymbolizer.graphicFill
        );
        result.LineSymbolizer[0].Stroke[0].GraphicFill = [graphicFill.PointSymbolizer[0]];
      } else if (lineSymbolizer?.graphicFill?.kind === 'Icon') {
        const graphicFill = this.getSldPointSymbolizerFromIconSymbolizer(
            <IconSymbolizer> lineSymbolizer.graphicFill
        );
        result.LineSymbolizer[0].Stroke[0].GraphicFill = [graphicFill.PointSymbolizer[0]];
      }
    }

    if (cssParameters.length !== 0) {
      result.LineSymbolizer[0].Stroke[0].CssParameter = cssParameters;
    }
    if (perpendicularOffset) {
      result.LineSymbolizer[0].PerpendicularOffset = [perpendicularOffset];
    }

    return result;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style FillSymbolizer.
   *
   * @param fillSymbolizer A GeoStyler-Style FillSymbolizer.
   * @return The object representation of a SLD PolygonSymbolizer (readable with xml2js)
   */
  getSldPolygonSymbolizerFromFillSymbolizer(fillSymbolizer: FillSymbolizer): any {
    const strokePropertyMap = {
      outlineColor: 'stroke',
      outlineWidth: 'stroke-width',
      outlineOpacity: 'stroke-opacity',
      outlineDasharray: 'stroke-dasharray'
    };
    const fillPropertyMap = {
      color: 'fill',
      fillOpacity: 'fill-opacity'
    };
    const strokeCssParameters: any[] = [];
    const fillCssParameters: any[] = [];
    let graphicFill: any;

    if (fillSymbolizer?.graphicFill) {
      if (fillSymbolizer?.graphicFill.kind === 'Mark') {
        graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(
            <MarkSymbolizer> fillSymbolizer.graphicFill
        );
      } else if (fillSymbolizer?.graphicFill.kind === 'Icon') {
        graphicFill = this.getSldPointSymbolizerFromIconSymbolizer(
            <IconSymbolizer> fillSymbolizer.graphicFill
        );
      }
    }

    Object.keys(fillSymbolizer)
      .filter((property: any) => property !== 'kind')
      .filter((property: any) => fillSymbolizer[property] !== undefined && fillSymbolizer[property] !== null)
      .forEach((property: any) => {
        if (Object.keys(fillPropertyMap).includes(property)) {
          // TODO: parse GeoStylerFunction
          // const expr = this.getSldExpressionFromExpression(fillSymbolizer[property]);
          // if ((typeof expr !== 'object')) {
          //   fillCssParameters.push({
          //     _: fillSymbolizer[property],
          //     $: {
          //       name: fillPropertyMap[property]
          //     }
          //   });
          // } else {
          fillCssParameters.push({
            '#text': fillSymbolizer[property],
            '@_name': fillPropertyMap[property]
          });
          // }
        } else if (Object.keys(strokePropertyMap).includes(property)) {

          let transformedValue: string = '';

          if (property === 'outlineDasharray') {
            const paramValue: number[] = fillSymbolizer[property];
            transformedValue = '';
            paramValue.forEach((dash: number, idx) => {
              transformedValue += dash;
              if (idx < paramValue.length - 1) {
                transformedValue += ' ';
              }
            });
          } else if (property === 'outlineWidth') {
            transformedValue = fillSymbolizer[property] + '';
          }  else if (property === 'outlineOpacity') {
            transformedValue = fillSymbolizer[property] + '';
          } else {
            transformedValue = fillSymbolizer[property];
          }

          strokeCssParameters.push({
            '#text': transformedValue,
            '@_name': strokePropertyMap[property]
          });
        }
      });

    const polygonSymbolizer: any = [{}];
    if (fillCssParameters.length > 0 || graphicFill) {
      polygonSymbolizer[0].Fill = [{}];
      if (graphicFill) {
        polygonSymbolizer[0].Fill[0].GraphicFill = [graphicFill.PointSymbolizer[0]];
      }
      if (fillCssParameters.length > 0) {
        polygonSymbolizer[0].Fill[0].CssParameter = fillCssParameters;
      }
    }

    if (strokeCssParameters.length > 0) {
      polygonSymbolizer[0].Stroke = [{
        'CssParameter': strokeCssParameters
      }];
    }

    return {
      'PolygonSymbolizer': polygonSymbolizer
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style RasterSymbolizer.
   *
   * @param rasterSymbolizer A GeoStyler-Style RasterSymbolizer.
   * @return The object representation of a SLD RasterSymbolizer (readable with xml2js)
   */
  getSldRasterSymbolizerFromRasterSymbolizer(rasterSymbolizer: RasterSymbolizer): any {
    const sldRasterSymbolizer: any = [{}];
    let opacity: any;
    if (typeof rasterSymbolizer.opacity !== 'undefined') {
      opacity = [rasterSymbolizer.opacity.toString()];
      sldRasterSymbolizer[0].Opacity = opacity;
    }

    let colorMap: any;
    if (rasterSymbolizer.colorMap) {
      colorMap = this.getSldColorMapFromColorMap(rasterSymbolizer.colorMap);
      if (colorMap?.[0]) {
        sldRasterSymbolizer[0].ColorMap = colorMap;
      }
    }

    let channelSelection: any;
    if (rasterSymbolizer.channelSelection) {
      channelSelection = this.getSldChannelSelectionFromChannelSelection(rasterSymbolizer.channelSelection);
      if (channelSelection?.[0]) {
        sldRasterSymbolizer[0].ChannelSelection = channelSelection;
      }
    }

    let contrastEnhancement: any;
    if (rasterSymbolizer.contrastEnhancement) {
      contrastEnhancement = this.getSldContrastEnhancementFromContrastEnhancement(rasterSymbolizer.contrastEnhancement);
      if (contrastEnhancement?.[0]) {
        sldRasterSymbolizer[0].ContrastEnhancement = contrastEnhancement;
      }
    }

    return {
      'RasterSymbolizer': sldRasterSymbolizer
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ColorMap.
   *
   * @param colorMap A GeoStyler-Style ColorMap.
   * @return The object representation of a SLD ColorMap (readable with xml2js)
   */
  getSldColorMapFromColorMap(colorMap: ColorMap): any {
    const sldColorMap: any[] = [{
    }];
      // parse colorMap.type
    if (colorMap.type) {
      const type = colorMap.type;
      sldColorMap[0]['@_type'] = type;
    }
    // parse colorMap.extended
    if (typeof colorMap.extended !== 'undefined') {
      const extended = colorMap.extended.toString();
      sldColorMap[0]['@_extended'] = extended;
    }
    // parse colorMap.colorMapEntries
    if (colorMap.colorMapEntries && colorMap.colorMapEntries.length > 0) {
      const colorMapEntries: any[] = colorMap.colorMapEntries.map((entry: ColorMapEntry) => {
        const result: any = {};
        if (entry.color) {
          result['@_color'] = entry.color;
        }
        if (typeof entry.quantity !== 'undefined') {
          result['@_quantity'] = entry.quantity.toString();
        }
        if (entry.label) {
          result['@_label'] = entry.label;
        }
        if (typeof entry.opacity !== 'undefined') {
          result['@_opacity'] = entry.opacity.toString();
        }
        return result;
      // remove empty colorMapEntries
      }).filter((entry: any) => Object.keys(entry).length > 0);
      sldColorMap[0].ColorMapEntry = colorMapEntries;
    }
    return sldColorMap;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ChannelSelection.
   *
   * @param channelSelection A GeoStyler-Style ChannelSelection.
   * @return The object representation of a SLD ChannelSelection (readable with xml2js)
   */
  getSldChannelSelectionFromChannelSelection(channelSelection: ChannelSelection): any {
    const propertyMap = {
      'redChannel': 'RedChannel',
      'blueChannel': 'BlueChannel',
      'greenChannel': 'GreenChannel',
      'grayChannel': 'GrayChannel'
    };
    const keys = Object.keys(channelSelection);
    const sldChannelSelection: any[] = [{}];
    keys.forEach((key: string) => {
      const channel: any = [{}];
      // parse sourceChannelName
      const sourceChannelName = channelSelection?.[key]?.sourceChannelName;
      // parse contrastEnhancement
      const contrastEnhancement = channelSelection?.[key]?.contrastEnhancement;
      if (sourceChannelName || contrastEnhancement) {
        if (sourceChannelName) {
          channel[0].SourceChannelName = [sourceChannelName];
        }
        if (contrastEnhancement) {
          channel[0].ContrastEnhancement = this.getSldContrastEnhancementFromContrastEnhancement(contrastEnhancement);
        }
        sldChannelSelection[0][propertyMap[key]] = channel;
      }
    });

    return sldChannelSelection;
  }

  /**
     * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ContrastEnhancement.
     *
     * @param contrastEnhancement A GeoStyler-Style ContrastEnhancement.
     * @return The object representation of a SLD ContrastEnhancement (readable with xml2js)
     */
  getSldContrastEnhancementFromContrastEnhancement(contrastEnhancement: ContrastEnhancement): any {
    const sldContrastEnhancement: any = [{}];
    const enhancementType = contrastEnhancement?.enhancementType;
    if (enhancementType === 'normalize') {
      // parse normalize
      sldContrastEnhancement[0].Normalize = [''];
    } else if (enhancementType === 'histogram') {
      // parse histogram
      sldContrastEnhancement[0].Histogram = [''];
    }
    // parse gammaValue
    if (typeof contrastEnhancement.gammaValue !== 'undefined') {
      sldContrastEnhancement[0].GammaValue = [contrastEnhancement.gammaValue.toString()];
    }
    return sldContrastEnhancement;
  }

  checkForUnsupportedProperites(geoStylerStyle: Style): UnsupportedProperties | undefined {
    const capitalizeFirstLetter = (a: string) => a[0].toUpperCase() + a.slice(1);
    const unsupportedProperties: UnsupportedProperties = {};
    geoStylerStyle.rules.forEach(rule => {
      // ScaleDenominator and Filters are completly supported so we just check for symbolizers
      rule.symbolizers.forEach(symbolizer => {
        const key = capitalizeFirstLetter(`${symbolizer.kind}Symbolizer`);
        const value = this.unsupportedProperties?.Symbolizer?.[key];
        if (value) {
          if (typeof value === 'string' || value instanceof String) {
            if (!unsupportedProperties.Symbolizer) {
              unsupportedProperties.Symbolizer = {};
            }
            unsupportedProperties.Symbolizer[key] = value;
          } else {
            Object.keys(symbolizer).forEach(property => {
              if (value[property]) {
                if (!unsupportedProperties.Symbolizer) {
                  unsupportedProperties.Symbolizer = {};
                }
                if (!unsupportedProperties.Symbolizer[key]) {
                  unsupportedProperties.Symbolizer[key] = {};
                }
                unsupportedProperties.Symbolizer[key][property] = value[property];
              }
            });
          }
        }
      });
    });
    if (Object.keys(unsupportedProperties).length > 0) {
      return unsupportedProperties;
    }
    return undefined;
  }

}

export default SldStyleParser;
