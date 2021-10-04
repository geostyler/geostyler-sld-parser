import {
  Filter,
  StyleParser,
  Style,
  Rule,
  FunctionFilter,
  ComparisonOperator,
  CombinationOperator,
  ScaleDenominator,
  PointSymbolizer,
  Symbolizer,
  IconSymbolizer,
  LineSymbolizer,
  FillSymbolizer,
  TextSymbolizer,
  RasterSymbolizer,
  ColorMap,
  ChannelSelection,
  ComparisonFilter,
  MarkSymbolizer,
  WellKnownName,
  ColorMapEntry,
  Channel,
  ContrastEnhancement,
  StrMatchesFunctionFilter,
  UnsupportedProperties,
  ReadStyleResult,
  WriteStyleResult
} from 'geostyler-style';

import {
  isCombinationFilter,
  isComparisonFilter,
  isNegationFilter
} from 'geostyler-style';

import {
  parseString,
  Builder,
  OptionsV2
} from 'xml2js';

import SymbologyEncoder from './SymbologyEncoder';

const _isString = require('lodash/isString');
const _isNumber = require('lodash/isNumber');
const _get = require('lodash/get');
const _set = require('lodash/set');
const _isEmpty = require('lodash/isEmpty');

export type ConstructorParams = {
  forceCasting?: boolean;
  numericFilterFields?: string[];
  boolFilterFields?: string[];
  prettyOutput?: boolean;
  sldVersion?: string;
  symbolizerUnits?: string;
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
    PropertyIsNull: '=='
  };

  constructor(opts?: ConstructorParams) {
    Object.assign(this, opts);
  }

  /**
   * Array of field / property names in a filter, which are casted to numerics
   * while parsing an SLD.
   */
  private _numericFilterFields: string[] = [];
  /**
   * Getter for _numericFilterFields
   * @return {string[]} The numericFilterFields
   */
  get numericFilterFields(): string[] {
    return this._numericFilterFields;
  }
  /**
   * Setter for _numericFilterFields
   * @param {string[]} numericFilterFields The numericFilterFields to set
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
   * @return {string[]} The boolFilterFields
   */
  get boolFilterFields(): string[] {
    return this._boolFilterFields;
  }
  /**
   * Setter for _boolFilterFields
   * @param {string[]} boolFilterFields The boolFilterFields to set
   */
  set boolFilterFields(boolFilterFields: string[]) {
    this._boolFilterFields = boolFilterFields;
  }

  /**
   * Flag to tell if all values should be casted automatically
   */
  private _forceCasting: boolean = false;

  /**
   * Getter for _forceCasting
   * @return {boolean}
   */
  get forceCasting(): boolean {
    return this._forceCasting;
  }

  /**
   * Setter for _forceCasting
   * @param {boolean} forceCasting The forceCasting value to set
   */
  set forceCasting(forceCasting: boolean) {
    this._forceCasting = forceCasting;
  }

  /**
   * Flag to tell if the generated output SLD will be prettified
   */
  private _prettyOutput: boolean = true;

  /**
   * Getter for _prettyOutput
   * @return {boolean}
   */
  get prettyOutput(): boolean {
    return this._prettyOutput;
  }

  /**
   * Setter for _prettyOutput
   * @param {boolean} prettyOutput The _prettyOutput value to set
   */
  set prettyOutput(prettyOutput: boolean) {
    this._prettyOutput = prettyOutput;
  }

  /**
   * String indicating the SLD version to use. 1.1.0 will make use of
   * Symbology Encoding. Default ist to use SLD 1.0.0
   */
  private _sldVersion: string = '1.0.0';

  /**
   * Getter for _sldVersion
   * @return {boolean}
   */
  get sldVersion(): string {
    return this._sldVersion;
  }

  /**
   * Setter for _sldVersion
   * @param {string} sldVersion The _sldVersion value to set
   */
  set sldVersion(sldVersion: string) {
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
   * Returns the keys of an object where the value is equal to the passed in
   * value.
   *
   * @param {object} object The object to get the key from.
   * @param {any} value The value to get the matching key from.
   * @return {string[]} The matching keys.
   */
  private static keysByValue(object: any, value: any): string[] {
    return Object.keys(object).filter(key => object[key] === value);
  }

  /**
   * The name Processor is passed as an option to the xml2js parser and modifies
   * the tagName. It strips all namespaces from the tags.
   *
   * @param {string} name The originial tagName
   * @return {string} The modified tagName
   */
  tagNameProcessor(name: string): string {
    const prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    return name.replace(prefixMatch, '');
  }

  /**
   * Get the name for the Style from the SLD Object. Returns the Title of the UserStyle
   * if defined or the Name of the NamedLayer if defined or an empty string.
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {string} The name to be used for the GeoStyler Style Style
   */
  getStyleNameFromSldObject(sldObject: any): string {
    const userStyleTitle = _get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].UserStyle[0].Title[0]._');
    const namedLayerName = _get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].Name[0]._');
    return userStyleTitle ? userStyleTitle
      : namedLayerName ? namedLayerName : '';
  }

  /**
   * Creates a GeoStyler-Style StrMatchesFunctionFilterr from a SLD strMatches Function.
   *
   * @param {object} sldFilter The SLD Filter
   * @return {Filter} The GeoStyler-Style FunctionFilter
   */
  getStrMatchesFunctionFilterFromSldFilter(sldFilter: any): StrMatchesFunctionFilter {
    const propertyName = _get(sldFilter, 'Function[0].PropertyName[0]._');
    const literal = _get(sldFilter, 'Function[0].Literal[0]._');
    const regex = new RegExp(literal);
    return [
      'FN_strMatches',
      propertyName,
      regex
    ];
  }

  /**
   * Creates a GeoStyler-Style FunctionFilter from a SLD Function.
   *
   * @param {object} sldFilter The SLD Filter
   * @return {Filter} The GeoStyler-Style FunctionFilter
   */
  getFunctionFilterFromSldFilter(sldFilter: any): FunctionFilter {
    const functionName = _get(sldFilter, 'Function[0].$.name');
    switch (functionName) {
      case 'strMatches':
        return this.getStrMatchesFunctionFilterFromSldFilter(sldFilter);
      default:
        return this.getStrMatchesFunctionFilterFromSldFilter(sldFilter);
    }
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

    if (Object.keys(SldStyleParser.comparisonMap).includes(sldOperatorName)) {
      const comparisonOperator: ComparisonOperator = SldStyleParser.comparisonMap[sldOperatorName];
      const propertyIsFilter = !!sldFilter.Function;
      const propertyOrFilter = propertyIsFilter
        ? this.getFunctionFilterFromSldFilter(sldFilter)
        : sldFilter.PropertyName[0]._;

      let value = null;
      if (sldOperatorName !== 'PropertyIsNull') {
        value = sldFilter.Literal[0]._;
      }
      const shouldParseFloat = this.forceCasting || propertyIsFilter ||
          this.numericFilterFields.indexOf(propertyOrFilter as string) !== -1;

      if (shouldParseFloat && !Number.isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }
      if (_isString(value)) {
        const lowerValue = value.toLowerCase();
        const shouldParseBool =  this.forceCasting || propertyIsFilter ||
          this.boolFilterFields.indexOf(propertyOrFilter as string) !== -1;
        if (shouldParseBool) {
          if (lowerValue === 'false') { value = false; }
          if (lowerValue === 'true') { value = true; }
        }
      }

      filter = [
        comparisonOperator,
        propertyOrFilter,
        value
      ];

    } else if (Object.keys(SldStyleParser.combinationMap).includes(sldOperatorName)) {
      const combinationOperator: CombinationOperator = SldStyleParser.combinationMap[sldOperatorName];
      const filters: Filter[] = sldFilter.$$.map((op: any) => {
        return this.getFilterFromOperatorAndComparison(op['#name'], op);
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (Object.keys(SldStyleParser.negationOperatorMap).includes(sldOperatorName)) {
      const negationOperator = SldStyleParser.negationOperatorMap[sldOperatorName];
      const negatedComparison = sldFilter.$$[0];
      const negatedOperator = negatedComparison['#name'];
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
   * Get the GeoStyler-Style Filter from an SLD Rule.
   *
   * Currently only supports one Filter per Rule.
   *
   * @param {object} sldRule The SLD Rule
   * @return {Filter} The GeoStyler-Style Filter
   */
  getFilterFromRule(sldRule: any): Filter | undefined {
    const {
      Filter: sldFilters
    } = sldRule;
    if (!sldFilters) {
      return;
    }
    const comparison = _get(sldFilters, '[0].$$[0]');
    const operator = comparison['#name'];
    if (!operator) {
      return;
    }
    const filter = this.getFilterFromOperatorAndComparison(operator, comparison);
    return filter;
  }

  /**
   * Get the GeoStyler-Style ScaleDenominator from an SLD Rule.
   *
   * @param {object} sldRule The SLD Rule
   * @return {ScaleDenominator} The GeoStyler-Style ScaleDenominator
   */
  getScaleDenominatorFromRule(sldRule: any): ScaleDenominator | undefined {
    const scaleDenominator: ScaleDenominator = <ScaleDenominator> {};
    if (sldRule.MinScaleDenominator) {
      scaleDenominator.min = parseFloat(sldRule.MinScaleDenominator[0]._);
    }
    if (sldRule.MaxScaleDenominator) {
      scaleDenominator.max = parseFloat(sldRule.MaxScaleDenominator[0]._);
    }

    return (scaleDenominator.min || scaleDenominator.max)
      ? scaleDenominator
      : undefined;
  }

  /**
   * Get the GeoStyler-Style MarkSymbolizer from an SLD Symbolizer
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {MarkSymbolizer} The GeoStyler-Style MarkSymbolizer
   */
  getMarkSymbolizerFromSldSymbolizer(sldSymbolizer: any): MarkSymbolizer {
    const wellKnownName: WellKnownName = _get(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]._');
    let strokeParams: any[];
    if (this.sldVersion === '1.0.0') {
      strokeParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Stroke[0].CssParameter') || [];
    } else {
      strokeParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Stroke[0].SvgParameter') || [];
    }
    const opacity: string = _get(sldSymbolizer, 'Graphic[0].Opacity[0]._');
    const size: string = _get(sldSymbolizer, 'Graphic[0].Size[0]._');
    const rotation: string = _get(sldSymbolizer, 'Graphic[0].Rotation[0]._');

    let fillParams: any[];
    if (this.sldVersion === '1.0.0') {
      fillParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].CssParameter') || [];
    } else {
      fillParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].SvgParameter') || [];
    }
    const colorIdx: number = fillParams.findIndex((cssParam: any) => {
      return cssParam.$.name === 'fill';
    });
    let color: string = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].CssParameter[' + colorIdx + ']._');
    if (this.sldVersion === '1.0.0') {
      color = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].CssParameter[' + colorIdx + ']._');
    } else {
      color = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].SvgParameter[' + colorIdx + ']._');
    }

    const fillOpacityIdx: number = fillParams.findIndex((cssParam: any) => {
      return cssParam.$.name === 'fill-opacity';
    });
    let fillOpacity: string = _get(sldSymbolizer,
      'Graphic[0].Mark[0].Fill[0].CssParameter[' + fillOpacityIdx + ']._');
    if (this.sldVersion === '1.0.0') {
      fillOpacity = _get(sldSymbolizer,
        'Graphic[0].Mark[0].Fill[0].CssParameter[' + fillOpacityIdx + ']._');
    } else {
      fillOpacity = _get(sldSymbolizer,
        'Graphic[0].Mark[0].Fill[0].SvgParameter[' + fillOpacityIdx + ']._');
    }
    const markSymbolizer: MarkSymbolizer = {
      kind: 'Mark',
      wellKnownName: 'circle'
    };

    if (opacity) {
      markSymbolizer.opacity = parseFloat(opacity);
    }
    if (fillOpacity) {
      markSymbolizer.fillOpacity = parseFloat(fillOpacity);
    }
    if (color) {
      markSymbolizer.color = color;
    }
    if (rotation) {
      markSymbolizer.rotate = parseFloat(rotation);
    }
    if (size) {
      markSymbolizer.radius = parseFloat(size) / 2;
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

    strokeParams.forEach((param: any) => {
      switch (param.$.name) {
        case 'stroke':
          markSymbolizer.strokeColor = param._;
          break;
        case 'stroke-width':
          markSymbolizer.strokeWidth = parseFloat(param._);
          break;
        case 'stroke-opacity':
          markSymbolizer.strokeOpacity = parseFloat(param._);
          break;
        default:
          break;
      }
    });

    return markSymbolizer;
  }

  /**
   * Get the GeoStyler-Style IconSymbolizer from an SLD Symbolizer
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {IconSymbolizer} The GeoStyler-Style IconSymbolizer
   */
  getIconSymbolizerFromSldSymbolizer(sldSymbolizer: any): IconSymbolizer {
    const onlineResource = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0].OnlineResource[0]');
    const iconSymbolizer: IconSymbolizer = <IconSymbolizer> {
      kind: 'Icon',
      image: onlineResource.$['xlink:href']
    };
    const opacity = _get(sldSymbolizer, 'Graphic[0].Opacity[0]._');
    const size = _get(sldSymbolizer, 'Graphic[0].Size[0]._');
    const rotate = _get(sldSymbolizer, 'Graphic[0].Rotation[0]._');
    if (opacity) {
      iconSymbolizer.opacity = opacity;
    }
    if (size) {
      iconSymbolizer.size = parseFloat(size);
    }
    if (rotate) {
      iconSymbolizer.rotate = parseFloat(rotate);
    }

    return iconSymbolizer;
  }

  /**
   * Get the GeoStyler-Style PointSymbolizer from an SLD Symbolizer.
   *
   * The opacity of the Symbolizer is taken from the <Graphic>.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {PointSymbolizer} The GeoStyler-Style PointSymbolizer
   */
  getPointSymbolizerFromSldSymbolizer(sldSymbolizer: any): PointSymbolizer {
    let pointSymbolizer: PointSymbolizer = <PointSymbolizer> {};
    const wellKnownName: string = _get(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]._');
    const externalGraphic: any = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0]');
    if (externalGraphic) {

      pointSymbolizer = this.getIconSymbolizerFromSldSymbolizer(sldSymbolizer);

    } else {
      // geoserver does not set a wellKnownName for square explicitly since it is the default value.
      // Therefore, we have to set the wellKnownName to square if no wellKownName is given.
      if (!wellKnownName) {
        _set(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]._', 'square');
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
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {LineSymbolizer} The GeoStyler-Style LineSymbolizer
   */
  getLineSymbolizerFromSldSymbolizer(sldSymbolizer: any): LineSymbolizer {
    const lineSymbolizer: LineSymbolizer = <LineSymbolizer> {
      kind: 'Line'
    };
    const strokeParameters = _get(sldSymbolizer, 'Stroke[0].$$') || [];
    if (strokeParameters.length < 1) {
      throw new Error('LineSymbolizer cannot be parsed. No Stroke detected');
    }
    let cssParameters: any[];
    if (this.sldVersion === '1.0.0') {
      cssParameters = strokeParameters.filter((strokeParam: any) => strokeParam['#name'] === 'CssParameter');
    } else {
      cssParameters = strokeParameters.filter((strokeParam: any) => strokeParam['#name'] === 'SvgParameter');
    }
    if (cssParameters.length < 1) {
      throw new Error('LineSymbolizer can not be parsed. No CssParameters detected.');
    }
    cssParameters.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;

      switch (name) {
        case 'stroke':
          lineSymbolizer.color = value;
          break;
        case 'stroke-width':
          lineSymbolizer.width = parseFloat(value);
          break;
        case 'stroke-opacity':
          lineSymbolizer.opacity = parseFloat(value);
          break;
        case 'stroke-linejoin':
          // geostyler-style and ol use 'miter' whereas sld uses 'mitre'
          if (value === 'mitre') {
            lineSymbolizer.join = 'miter';
          } else {
            lineSymbolizer.join = value;
          }
          break;
        case 'stroke-linecap':
          lineSymbolizer.cap = value;
          break;
        case 'stroke-dasharray':
          const dashStringAsArray = value.split(' ').map((a: string) => parseFloat(a));
          lineSymbolizer.dasharray = dashStringAsArray;
          break;
        case 'stroke-dashoffset':
          lineSymbolizer.dashOffset = parseFloat(value);
          break;
        default:
          break;
      }
    });

    const graphicStroke = strokeParameters.find(
      (strokeParameter: any) => strokeParameter['#name'] === 'GraphicStroke');
    if (graphicStroke !== undefined) {
      lineSymbolizer.graphicStroke = this.getPointSymbolizerFromSldSymbolizer(graphicStroke);
    }

    const graphicFill = strokeParameters.find(
      (strokeParameter: any) => strokeParameter['#name'] === 'GraphicFill');
    if (graphicFill !== undefined) {
      lineSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(graphicFill);
    }

    const perpendicularOffset = _get(sldSymbolizer, 'PerpendicularOffset[0]._');
    if (perpendicularOffset !== undefined) {
      lineSymbolizer.perpendicularOffset = Number(perpendicularOffset);
    }
    return lineSymbolizer;
  }

  /**
   * Get the GeoStyler-Style FillSymbolizer from an SLD Symbolizer.
   *
   * PolygonSymbolizer Stroke is just partially supported.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {FillSymbolizer} The GeoStyler-Style FillSymbolizer
   */
  getFillSymbolizerFromSldSymbolizer(sldSymbolizer: any): FillSymbolizer {
    const fillSymbolizer: FillSymbolizer = <FillSymbolizer> {
      kind: 'Fill'
    };
    let fillCssParameters;
    if (this.sldVersion === '1.0.0') {
      fillCssParameters = _get(sldSymbolizer, 'Fill[0].CssParameter') || [];
    } else {
      fillCssParameters = _get(sldSymbolizer, 'Fill[0].SvgParameter') || [];
    }

    let strokeCssParameters;
    if (this.sldVersion === '1.0.0') {
      strokeCssParameters = _get(sldSymbolizer, 'Stroke[0].CssParameter') || [];
    } else {
      strokeCssParameters = _get(sldSymbolizer, 'Stroke[0].SvgParameter') || [];
    }

    const graphicFill = _get(sldSymbolizer, 'Fill[0].GraphicFill[0]');
    if (graphicFill) {
      fillSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(
        graphicFill
      );
    }
    fillCssParameters.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;
      switch (name) {
        case 'fill':
          fillSymbolizer.color = value;
          break;
        case 'fill-opacity':
          fillSymbolizer.fillOpacity = parseFloat(value);
          break;
        default:
          break;
      }
    });
    if (!fillSymbolizer.color) {
      fillSymbolizer.opacity = 0;
    }
    strokeCssParameters.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;
      if (name === 'stroke') {
        fillSymbolizer.outlineColor = value;
      } else if (name === 'stroke-width') {
        fillSymbolizer.outlineWidth = parseFloat(value);
      } else if (name === 'stroke-opacity') {
        fillSymbolizer.outlineOpacity = parseFloat(value);
      } else if (name === 'stroke-dasharray') {
        const outlineDasharrayStr = value.split(' ');
        const outlineDasharray: number[] = [];
        outlineDasharrayStr.forEach((dashStr: string) => {
          outlineDasharray.push(parseFloat(dashStr));
        });
        fillSymbolizer.outlineDasharray = outlineDasharray;
      }
    });
    return fillSymbolizer;
  }

  /**
   * Get the GeoStyler-Style ColorMap from a SLD ColorMap.
   *
   * @param {object} sldColorMap The SLD ColorMap
   */
  getColorMapFromSldColorMap(sldColorMap: any): ColorMap {
    const colorMap: ColorMap = {} as ColorMap;
    const type = _get(sldColorMap, '$.type');
    if (type) {
      colorMap.type = type;
    } else {
      colorMap.type = 'ramp';
    }

    const extended = _get(sldColorMap, '$.extended');
    if (extended) {
      if (extended === 'true') {
        colorMap.extended = true;
      } else {
        colorMap.extended = false;
      }
    }

    const colorMapEntries = _get(sldColorMap, 'ColorMapEntry');
    if (Array.isArray(colorMapEntries)) {
      const cmEntries = colorMapEntries.map((cm: ColorMapEntry) => {
        const color = _get(cm, '$.color');
        if (!color) {
          throw new Error('Cannot parse ColorMapEntries. color is undefined.');
        }
        let quantity = _get(cm, '$.quantity');
        if (quantity) {
          quantity = parseFloat(quantity);
        }
        const label = _get(cm, '$.label');
        let opacity = _get(cm, '$.opacity');
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
    const hasHistogram = typeof sldContrastEnhancement.Histogram !== 'undefined';
    const hasNormalize = typeof sldContrastEnhancement.Normalize !== 'undefined';
    if (hasHistogram && hasNormalize) {
      throw new Error(`Cannot parse ContrastEnhancement. Histogram and Normalize
      are mutually exclusive.`);
    } else if (hasHistogram) {
      contrastEnhancement.enhancementType = 'histogram';
    } else if (hasNormalize) {
      contrastEnhancement.enhancementType = 'normalize';
    }
    // parse gammavalue
    let gammaValue = _get(sldContrastEnhancement, 'GammaValue[0]._');
    if (gammaValue) {
      gammaValue = parseFloat(gammaValue);
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
    const channel: Channel = {
      sourceChannelName: _get(sldChannel, 'SourceChannelName[0]._'),
    } as Channel;
    const contrastEnhancement = _get(sldChannel, 'ContrastEnhancement[0]');
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
    const red = _get(sldChannelSelection, 'RedChannel[0]');
    const blue = _get(sldChannelSelection, 'BlueChannel[0]');
    const green = _get(sldChannelSelection, 'GreenChannel[0]');
    const gray = _get(sldChannelSelection, 'GrayChannel[0]');

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
   * Get the GeoStyler-Style RasterSymbolizer from a SLD Symbolizer.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   */
  getRasterSymbolizerFromSldSymbolizer(sldSymbolizer: any): RasterSymbolizer {
    const rasterSymbolizer: RasterSymbolizer = <RasterSymbolizer> {
      kind: 'Raster'
    };
    // parse Opacity
    let opacity = _get(sldSymbolizer, 'Opacity[0]._');
    if (opacity) {
      opacity = parseFloat(opacity);
      rasterSymbolizer.opacity = opacity;
    }
    // parse ColorMap
    const sldColorMap = _get(sldSymbolizer, 'ColorMap') || [];
    if (sldColorMap.length > 0) {
      const colormap = this.getColorMapFromSldColorMap(sldColorMap[0]);
      rasterSymbolizer.colorMap = colormap;
    }
    // parse ChannelSelection
    const sldChannelSelection = _get(sldSymbolizer, 'ChannelSelection') || [];
    if (sldChannelSelection.length > 0) {
      const channelSelection = this.getChannelSelectionFromSldChannelSelection(sldChannelSelection[0]);
      rasterSymbolizer.channelSelection = channelSelection;
    }
    // parse ContrastEnhancement
    const sldContrastEnhancement = _get(sldSymbolizer, 'ContrastEnhancement') || [];
    if (sldContrastEnhancement.length > 0) {
      const contrastEnhancement = this.getContrastEnhancementFromSldContrastEnhancement(sldContrastEnhancement[0]);
      rasterSymbolizer.contrastEnhancement = contrastEnhancement;
    }
    return rasterSymbolizer;
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
    const label: string = sldLabel.$$
      .map((labelEl: any) => {
        const labelName = labelEl['#name'];
        switch (labelName) {
          case '__text__':
          case 'Literal':
            return labelEl._;
          case 'PropertyName':
            return `{{${labelEl._}}}`;
          // TODO handle CDATA property
          default:
            return '';
        }
      })
      .join('');
    return label;
  };

  /**
   * Get the GeoStyler-Style TextSymbolizer from an SLD Symbolizer.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {TextSymbolizer} The GeoStyler-Style TextSymbolizer
   */
  getTextSymbolizerFromSldSymbolizer(sldSymbolizer: any): TextSymbolizer {
    const textSymbolizer: TextSymbolizer = <TextSymbolizer> {
      kind: 'Text'
    };
    let fontCssParameters;
    if (this.sldVersion === '1.0.0') {
      fontCssParameters = _get(sldSymbolizer, 'Font[0].CssParameter') || [];
    } else {
      fontCssParameters = _get(sldSymbolizer, 'Font[0].SvgParameter') || [];
    }

    const label = _get(sldSymbolizer, 'Label[0]');
    if (label) {
      textSymbolizer.label = this.getTextSymbolizerLabelFromSldSymbolizer(label);
    }

    let fillCssParameters;
    if (this.sldVersion === '1.0.0') {
      fillCssParameters = _get(sldSymbolizer, 'Fill[0].CssParameters') || [];
    } else {
      fillCssParameters = _get(sldSymbolizer, 'Fill[0].SvgParameters') || [];
    }
    let color = '#000000';
    let opacity = 1;
    fillCssParameters.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;
      switch (name) {
        case 'fill':
          color = value;
          break;
        case 'fill-opacity':
          opacity = parseFloat(value);
          break;
        default:
          break;
      }
    });

    let haloColorCssParameter;
    if (this.sldVersion === '1.0.0') {
      haloColorCssParameter = _get(sldSymbolizer, 'Halo[0].Fill[0].CssParameter') || [];
    } else {
      haloColorCssParameter = _get(sldSymbolizer, 'Halo[0].Fill[0].SvgParameter') || [];
    }

    const haloRadius = _get(sldSymbolizer, 'Halo[0].Radius[0]._');
    if (color) {
      textSymbolizer.color = color;
    }
    if (opacity) {
      textSymbolizer.opacity = opacity;
    }
    if (haloRadius) {
      textSymbolizer.haloWidth = parseFloat(haloRadius);
    }
    haloColorCssParameter.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;
      switch (name) {
        case 'fill':
          textSymbolizer.haloColor = value;
          break;
        case 'fill-opacity':
        default:
          break;
      }
    });
    const displacement = _get(sldSymbolizer, 'LabelPlacement[0].PointPlacement[0].Displacement[0]');
    if (displacement) {
      const x = displacement.DisplacementX[0]._;
      const y = displacement.DisplacementY[0]._;
      textSymbolizer.offset = [
        x ? parseFloat(x) : 0,
        y ? parseFloat(y) : 0,
      ];
    }
    const rotation = _get(sldSymbolizer, 'LabelPlacement[0].PointPlacement[0].Rotation[0]._');
    if (rotation) {
      textSymbolizer.rotate = parseFloat(rotation);
    }
    fontCssParameters.forEach((cssParameter: any) => {
      const {
        $: {
          name
        },
        _: value
      } = cssParameter;
      switch (name) {
        case 'font-family':
          textSymbolizer.font = [value];
          break;
        case 'font-style':
          textSymbolizer.fontStyle = value;
          break;
        case 'font-weight':
          textSymbolizer.fontWeight = value;
          break;
        case 'font-size':
          textSymbolizer.size = parseFloat(value);
          break;
        default:
          break;
      }
    });
    return textSymbolizer;
  }

  /**
   * Get the GeoStyler-Style Symbolizers from an SLD Rule.
   *
   * @param {object} sldRule The SLD Rule
   * @return {Symbolizer[]} The GeoStyler-Style Symbolizer Array
   */
  getSymbolizersFromRule(sldRule: any): Symbolizer[] {
    const symbolizers: Symbolizer[] = sldRule.$$
      .filter((subEl: any) => subEl['#name'].endsWith('Symbolizer'))
      .map((sldSymbolizer: any) => {
        const sldSymbolizerName: string = sldSymbolizer['#name'];
        switch (sldSymbolizerName) {
          case 'PointSymbolizer':
            return this.getPointSymbolizerFromSldSymbolizer(sldSymbolizer);
          case 'LineSymbolizer':
            return this.getLineSymbolizerFromSldSymbolizer(sldSymbolizer);
          case 'TextSymbolizer':
            return this.getTextSymbolizerFromSldSymbolizer(sldSymbolizer);
          case 'PolygonSymbolizer':
            return this.getFillSymbolizerFromSldSymbolizer(sldSymbolizer);
          case 'RasterSymbolizer':
            return this.getRasterSymbolizerFromSldSymbolizer(sldSymbolizer);
          default:
            throw new Error('Failed to parse SymbolizerKind from SldRule');
        }
      });

    return symbolizers;
  }

  /**
   * Get the GeoStyler-Style Rule from an SLD Object (created with xml2js).
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {Rule} The GeoStyler-Style Rule
   */
  getRulesFromSldObject(sldObject: any): Rule[] {
    const layers = sldObject.StyledLayerDescriptor.NamedLayer;

    const rules: Rule[] = [];
    layers.forEach((layer: any) => {
      layer.UserStyle.forEach((userStyle: any) => {
        userStyle.FeatureTypeStyle.forEach((featureTypeStyle: any) => {
          featureTypeStyle.Rule.forEach((sldRule: any) => {
            const filter: Filter | undefined = this.getFilterFromRule(sldRule);
            const scaleDenominator: ScaleDenominator | undefined = this.getScaleDenominatorFromRule(sldRule);
            const symbolizers: Symbolizer[] = this.getSymbolizersFromRule(sldRule);
            const ruleTitle = _get(sldRule, 'Title[0]._');
            const ruleName = _get(sldRule, 'Name[0]._');
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
   * The readStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a SLD as a string and returns a Promise.
   * The Promise itself resolves with a GeoStyler-Style Style.
   *
   * @param {string} sldString A SLD as a string.
   * @return {Promise} The Promise resolving with the GeoStyler-Style Style
   */
  readStyle(sldString: string): Promise<ReadStyleResult> {
    return new Promise<ReadStyleResult>((resolve) => {
      const options = {
        tagNameProcessors: [this.tagNameProcessor],
        explicitChildren: true,
        preserveChildrenOrder: true,
        charsAsChildren: true
      };
      try {
        parseString(sldString, options, (err: any, result: any) => {
          if (err) {
            resolve({
              errors: [err]
            });
          }
          const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(result);
          resolve({
            output: geoStylerStyle
          });
        });
      } catch (error) {
        resolve({
          errors: [error]
        });
      }
    });
  }

  /**
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   * The Promise itself resolves with a SLD string.
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {Promise} The Promise resolving with the SLD as a string.
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      try {
        const builderOpts = {
          renderOpts: {pretty: this.prettyOutput}
        } as OptionsV2;

        const builder = new Builder(builderOpts);
        const sldObject = this.geoStylerStyleToSldObject(geoStylerStyle);
        const sldString = builder.buildObject(sldObject);
        resolve({
          output: sldString
        });
      } catch (error) {
        resolve({
          errors: [error]
        });
      }
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
      if (rule.Filter && !rule.Filter.$) {
        rule.Filter.$ = { 'xmlns': 'http://www.opengis.net/ogc' };
      }
    });

    if (this.sldVersion !== '1.0.0') {
      return SymbologyEncoder.getSymbologyEncoding(
        geoStylerStyle, rules, this.symbolizerUnits);
    }
    return {
      StyledLayerDescriptor: {
        '$': {
          'version': '1.0.0',
          'xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd',
          'xmlns': 'http://www.opengis.net/sld',
          'xmlns:ogc': 'http://www.opengis.net/ogc',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
        },
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
   * @param {Rule[]} rules An array of GeoStyler-Style Rules.
   * @return {object} The object representation of a SLD Rule (readable with xml2js)
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
        if (min && _isNumber(min)) {
          sldRule.MinScaleDenominator = [min.toString()];
        }
        if (max && _isNumber(max)) {
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
          if (_get(sldSymb, 'PointSymbolizer[0]')) {
            sldSymbolizer.PointSymbolizer.push(
              _get(sldSymb, 'PointSymbolizer[0]')
            );
          }
          break;
        case 'Icon':
          if (!sldSymbolizer.PointSymbolizer) {
            sldSymbolizer.PointSymbolizer = [];
          }

          sldSymb = this.getSldPointSymbolizerFromIconSymbolizer(symb);
          if (_get(sldSymb, 'PointSymbolizer[0]')) {
            sldSymbolizer.PointSymbolizer.push(
              _get(sldSymb, 'PointSymbolizer[0]')
            );
          }
          break;
        case 'Text':
          if (!sldSymbolizer.TextSymbolizer) {
            sldSymbolizer.TextSymbolizer = [];
          }

          sldSymb = this.getSldTextSymbolizerFromTextSymbolizer(symb);
          if (_get(sldSymb, 'TextSymbolizer[0]')) {
            sldSymbolizer.TextSymbolizer.push(
              _get(sldSymb, 'TextSymbolizer[0]')
            );
          }
          break;
        case 'Line':
          if (!sldSymbolizer.LineSymbolizer) {
            sldSymbolizer.LineSymbolizer = [];
          }

          sldSymb = this.getSldLineSymbolizerFromLineSymbolizer(symb);
          if (_get(sldSymb, 'LineSymbolizer[0]')) {
            sldSymbolizer.LineSymbolizer.push(
              _get(sldSymb, 'LineSymbolizer[0]')
            );
          }
          break;
        case 'Fill':
          if (!sldSymbolizer.PolygonSymbolizer) {
            sldSymbolizer.PolygonSymbolizer = [];
          }

          sldSymb = this.getSldPolygonSymbolizerFromFillSymbolizer(symb);
          if (_get(sldSymb, 'PolygonSymbolizer[0]')) {
            sldSymbolizer.PolygonSymbolizer.push(
              _get(sldSymb, 'PolygonSymbolizer[0]')
            );
          }
          break;
        case 'Raster':
          if (!sldSymbolizer.RasterSymbolizer) {
            sldSymbolizer.RasterSymbolizer = [];
          }

          sldSymb = this.getSldRasterSymbolizerFromRasterSymbolizer(symb);
          if (_get(sldSymb, 'RasterSymbolizer[0]')) {
            sldSymbolizer.RasterSymbolizer.push(
              _get(sldSymb, 'RasterSymbolizer[0]')
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
   * Get the Label from a TextSymbolizer
   */
  getSldLabelFromTextSymbolizer = (template: string): [any] => {
    // matches anything inside double curly braces (non-greedy)
    const placeholderReg = /^{{(.*?)}}/;
    // matches anything that does not start with curly braces
    const literalReg = /(^.+?){{|^([^{]+)$/;

    const tokens = [];
    const placeholderType = 'placeholder';
    const literalType = 'literal';
    let templateReducer = template;
    while (templateReducer.length) {
      const phMatch = placeholderReg.exec(templateReducer);
      if (phMatch) {
        tokens.push({type: placeholderType, value: phMatch[1]});
        // we have to strip the curly braces too
        templateReducer = templateReducer.substr(phMatch[1].length + 4);
      }

      const litMatch = literalReg.exec(templateReducer);
      if (litMatch) {
        if (litMatch[1]) {
          tokens.push({type: literalType, value: litMatch[1]});
          templateReducer = templateReducer.substr(litMatch[1].length);
        } else {
          tokens.push({type: literalType, value: litMatch[2]});
          templateReducer = templateReducer.substr(litMatch[2].length);
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
    return [sldLabel];
  };

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style TextSymbolizer.
   *
   * @param {TextSymbolizer} textSymbolizer A GeoStyler-Style TextSymbolizer.
   * @return {object} The object representation of a SLD TextSymbolizer (readable with xml2js)
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
          '_': property === 'font'
            ? textSymbolizer[property][0]
            : textSymbolizer[property],
          '$': {
            'name': fontPropertyMap[property]
          }
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
        haloCssParameter.push({
          '_': textSymbolizer.haloColor,
          '$': {
            'name': 'fill'
          }
        });
      }
      if (haloCssParameter.length > 0) {
        halo.Fill = [{
          CssParameter: haloCssParameter
        }];
      }
      sldTextSymbolizer[0].Halo = [halo];
    }
    if (textSymbolizer.color || textSymbolizer.opacity) {
      sldTextSymbolizer[0].Fill = [{
        'CssParameter': [{
          '_': textSymbolizer.color || '#000000',
          '$': {
            'name': 'fill'
          }
        }, {
          '_': textSymbolizer.opacity || '1',
          '$': {
            'name': 'fill-opacity'
          }
        }]
      }];
    }

    return {
      'TextSymbolizer': sldTextSymbolizer
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style FillSymbolizer.
   *
   * @param {FillSymbolizer} fillSymbolizer A GeoStyler-Style FillSymbolizer.
   * @return {object} The object representation of a SLD PolygonSymbolizer (readable with xml2js)
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

    if (_get(fillSymbolizer, 'graphicFill')) {
      if (_get(fillSymbolizer, 'graphicFill.kind') === 'Mark') {
        graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(
          <MarkSymbolizer> fillSymbolizer.graphicFill
        );
      } else if (_get(fillSymbolizer, 'graphicFill.kind') === 'Icon') {
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
          fillCssParameters.push({
            '_': fillSymbolizer[property],
            '$': {
              'name': fillPropertyMap[property]
            }
          });
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
            '_': transformedValue,
            '$': {
              'name': strokePropertyMap[property]
            }
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
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style LineSymbolizer.
   *
   * @param {LineSymbolizer} lineSymbolizer A GeoStyler-Style LineSymbolizer.
   * @return {object} The object representation of a SLD LineSymbolizer (readable with xml2js)
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
        }
        // simple transformation since geostyler-style uses prop 'miter' whereas sld uses 'mitre'
        if (property === 'join' && value === 'miter') {
          value = 'mitre';
        }
        return {
          '_': value,
          '$': {
            'name': propertyMap[property]
          }
        };
      });

    const perpendicularOffset = lineSymbolizer.perpendicularOffset;

    if (_get(lineSymbolizer, 'graphicStroke')) {
      if (_get(lineSymbolizer, 'graphicStroke.kind') === 'Mark') {
        const graphicStroke = this.getSldPointSymbolizerFromMarkSymbolizer(
          <MarkSymbolizer> lineSymbolizer.graphicStroke
        );
        result.LineSymbolizer[0].Stroke[0].GraphicStroke = [graphicStroke.PointSymbolizer[0]];
      } else if (_get(lineSymbolizer, 'graphicStroke.kind') === 'Icon') {
        const graphicStroke = this.getSldPointSymbolizerFromIconSymbolizer(
          <IconSymbolizer> lineSymbolizer.graphicStroke
        );
        result.LineSymbolizer[0].Stroke[0].GraphicStroke = [graphicStroke.PointSymbolizer[0]];
      }
    }

    if (_get(lineSymbolizer, 'graphicFill')) {
      if (_get(lineSymbolizer, 'graphicFill.kind') === 'Mark') {
        const graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(
          <MarkSymbolizer> lineSymbolizer.graphicFill
        );
        result.LineSymbolizer[0].Stroke[0].GraphicFill = [graphicFill.PointSymbolizer[0]];
      } else if (_get(lineSymbolizer, 'graphicFill.kind') === 'Icon') {
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
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style MarkSymbolizer.
   *
   * @param {MarkSymbolizer} markSymbolizer A GeoStyler-Style MarkSymbolizer.
   * @return {object} The object representation of a SLD PointSymbolizer with a
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
        cssParameters.push({
          '_': markSymbolizer.color,
          '$': {
            'name': 'fill'
          }
        });
      }
      if (markSymbolizer.fillOpacity) {
        cssParameters.push({
          '_': markSymbolizer.fillOpacity,
          '$': {
            'name': 'fill-opacity'
          }
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
        strokeCssParameters.push({
          '_': markSymbolizer.strokeColor,
          '$': {
            'name': 'stroke'
          }
        });
      }
      if (markSymbolizer.strokeWidth) {
        strokeCssParameters.push({
          '_': markSymbolizer.strokeWidth.toString(),
          '$': {
            'name': 'stroke-width'
          }
        });
      }
      if (markSymbolizer.strokeOpacity) {
        strokeCssParameters.push({
          '_': markSymbolizer.strokeOpacity.toString(),
          '$': {
            'name': 'stroke-opacity'
          }
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

    if (markSymbolizer.radius) {
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
   * @param {IconSymbolizer} iconSymbolizer A GeoStyler-Style IconSymbolizer.
   * @return {object} The object representation of a SLD PointSymbolizer with
   * en "ExternalGraphic" (readable with xml2js)
   */
  getSldPointSymbolizerFromIconSymbolizer(iconSymbolizer: IconSymbolizer): any {
    const onlineResource = [{
      '$': {
        'xlink:type': 'simple',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'xlink:href': iconSymbolizer.image
      }
    }];

    const graphic: any[] = [{
      'ExternalGraphic': [{
        'OnlineResource': onlineResource
      }]
    }];

    if (iconSymbolizer.image) {

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
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style RasterSymbolizer.
   *
   * @param {RasterSymbolizer} RasterSymbolizer A GeoStyler-Style RasterSymbolizer.
   * @return {object} The object representation of a SLD RasterSymbolizer (readable with xml2js)
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
      if (!_isEmpty(colorMap[0])) {
        sldRasterSymbolizer[0].ColorMap = colorMap;
      }
    }

    let channelSelection: any;
    if (rasterSymbolizer.channelSelection) {
      channelSelection = this.getSldChannelSelectionFromChannelSelection(rasterSymbolizer.channelSelection);
      if (!_isEmpty(channelSelection[0])) {
        sldRasterSymbolizer[0].ChannelSelection = channelSelection;
      }
    }

    let contrastEnhancement: any;
    if (rasterSymbolizer.contrastEnhancement) {
      contrastEnhancement = this.getSldContrastEnhancementFromContrastEnhancement(rasterSymbolizer.contrastEnhancement);
      if (!_isEmpty(contrastEnhancement[0])) {
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
   * @param {ColorMap} colorMap A GeoStyler-Style ColorMap.
   * @return {object} The object representation of a SLD ColorMap (readable with xml2js)
   */
  getSldColorMapFromColorMap(colorMap: ColorMap): any {
    const sldColorMap: any[] = [{
      '$': {}
    }];
    // parse colorMap.type
    if (colorMap.type) {
      const type = colorMap.type;
      sldColorMap[0].$.type = type;
    }
    // parse colorMap.extended
    if (typeof colorMap.extended !== 'undefined') {
      const extended = colorMap.extended.toString();
      sldColorMap[0].$.extended = extended;
    }
    // parse colorMap.colorMapEntries
    if (colorMap.colorMapEntries && colorMap.colorMapEntries.length > 0) {
      const colorMapEntries: any[] = colorMap.colorMapEntries.map((entry: ColorMapEntry) => {
        const result: any = {
          '$': {}
        };

        if (entry.color) {
          result.$.color = entry.color;
        }
        if (typeof entry.quantity !== 'undefined') {
          result.$.quantity = entry.quantity.toString();
        }
        if (entry.label) {
          result.$.label = entry.label;
        }
        if (typeof entry.opacity !== 'undefined') {
          result.$.opacity = entry.opacity.toString();
        }

        return result;
      }).filter((entry: any) => {
        // remove empty colorMapEntries
        return Object.keys(entry.$).length > 0;
      });
      sldColorMap[0].ColorMapEntry = colorMapEntries;
    }
    return sldColorMap;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ChannelSelection.
   *
   * @param {ChannelSelection} channelSelection A GeoStyler-Style ChannelSelection.
   * @return {object} The object representation of a SLD ChannelSelection (readable with xml2js)
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
      const sourceChannelName = _get(channelSelection, `${key}.sourceChannelName`);
      // parse contrastEnhancement
      const contrastEnhancement = _get(channelSelection, `${key}.contrastEnhancement`);
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
   * @param {ContrastEnhancement} contrastEnhancement A GeoStyler-Style ContrastEnhancement.
   * @return {object} The object representation of a SLD ContrastEnhancement (readable with xml2js)
   */
  getSldContrastEnhancementFromContrastEnhancement(contrastEnhancement: ContrastEnhancement): any {
    const sldContrastEnhancement: any = [{}];
    const enhancementType = _get(contrastEnhancement, 'enhancementType');
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

  /**
   * Get the SLD Object (readable with xml2js) from a GeoStyler-Style StrMatchesFunctionFilter.
   *
   * @param {StrMatchesFunctionFilter} functionFilter A GeoStyler-Style StrMatchesFunctionFilter.
   * @return {object} The object representation of a SLD strMatches Function Expression.
   */
  getSldStrMatchesFunctionFromFunctionFilter(functionFilter: StrMatchesFunctionFilter): any {
    const property: string = functionFilter[1];
    const regex: RegExp = functionFilter[2];
    return {
      '$': {
        'name': 'strMatches'
      },
      'PropertyName': [property],
      'Literal': [regex.toString().replace(/\//g, '')]
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from a GeoStyler-Style FunctionFilter.
   *
   * @param {FunctionFilter} functionFilter A GeoStyler-Style FunctionFilter.
   * @return {object} The object representation of a SLD Function Expression.
   */
  getSldFunctionFilterFromFunctionFilter(functionFilter: FunctionFilter): any {
    const functionName = functionFilter[0].split('FN_')[1];
    switch (functionName) {
      case 'strMatches':
        return this.getSldStrMatchesFunctionFromFunctionFilter(functionFilter);
      default:
        break;
    }
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ComparisonFilter.
   *
   * @param {ComparisonFilter} comparisonFilter A GeoStyler-Style ComparisonFilter.
   * @return {object} The object representation of a SLD Filter Expression with a
   * comparison operator (readable with xml2js)
   */
  getSldComparisonFilterFromComparisonFilter(comparisonFilter: ComparisonFilter): any[] {
    const sldComparisonFilter: any = <ComparisonFilter> {};
    const operator = comparisonFilter[0];
    let key = comparisonFilter[1];
    const value = comparisonFilter[2];

    const sldOperators: string[] = SldStyleParser.keysByValue(SldStyleParser.comparisonMap, operator);
    const sldOperator: string = (sldOperators.length > 1 && value === null)
      ? sldOperators[1] : sldOperators[0];

    let propertyKey = 'PropertyName';

    if (Array.isArray(key) && key[0].startsWith('FN_')) {
      key = this.getSldFunctionFilterFromFunctionFilter(key);
      propertyKey = 'Function';
    }

    if (sldOperator === 'PropertyIsNull') {
      // empty, selfclosing Literals are not valid in a propertyIsNull filter
      sldComparisonFilter[sldOperator] = [{
        [propertyKey]: [key]
      }];
    } else if (sldOperator === 'PropertyIsLike') {
      sldComparisonFilter[sldOperator] = [{
        '$': {
          'wildCard': '*',
          'singleChar': '.',
          'escape': '!'
        },
        [propertyKey]: [key],
        'Literal': [value]
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
   * @param {Filter} filter A GeoStyler-Style Filter.
   * @return {object} The object representation of a SLD Filter Expression (readable with xml2js)
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
      const sldOperators: string[] = SldStyleParser.keysByValue(SldStyleParser.combinationMap, operator);
      // TODO Implement logic for "PropertyIsBetween" filter
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

}

export default SldStyleParser;
