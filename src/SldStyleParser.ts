import {
  Channel,
  ChannelSelection,
  ColorMap,
  ColorMapEntry,
  ColorMapType,
  CombinationOperator,
  ComparisonOperator,
  ContrastEnhancement,
  FillSymbolizer,
  Filter,
  GeoStylerFunction,
  IconSymbolizer,
  LineSymbolizer,
  MarkSymbolizer,
  PointSymbolizer,
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
  isSymbolizer
} from './Util/SldUtil';

export type SldVersion = '1.0.0' | '1.1.0';

export type ConstructorParams = {
  numericFilterFields?: string[];
  boolFilterFields?: string[];
  prettyOutput?: boolean;
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
      ignoreDeclaration: true,
      ignoreAttributes: false,
      preserveOrder: true
    });
    this.builder = new XMLBuilder({
      ignoreAttributes : false,
      ...opts?.builderOptions
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
   * Flag to tell if all values should be casted automatically
   */
  private _forceCasting: boolean = false;

  /**
   * Getter for _forceCasting
   * @return
   */
  get forceCasting(): boolean {
    return this._forceCasting;
  }

  /**
   * Setter for _forceCasting
   * @param forceCasting The forceCasting value to set
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
   * @return
   */
  get prettyOutput(): boolean {
    return this._prettyOutput;
  }

  /**
   * Setter for _prettyOutput
   * @param prettyOutput The _prettyOutput value to set
   */
  set prettyOutput(prettyOutput: boolean) {
    this._prettyOutput = prettyOutput;
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
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   * The Promise itself resolves with a SLD string.
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {Promise} The Promise resolving with the SLD as a string.
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      const unsupportedProperties = this.checkForUnsupportedProperites(geoStylerStyle);
      try {
        const sldObject = this.geoStylerStyleToSldObject(geoStylerStyle);
        resolve({
          output: sldString,
          unsupportedProperties,
          warnings: unsupportedProperties && ['Your style contains unsupportedProperties!']
        });
      } catch (error) {
        resolve({
          errors: [error]
        });
      }
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
    if (!sldFilter) {
      return;
    }
    const operator = Object.keys(sldFilter?.[0])?.[0];
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
        const labelName = Object.keys(labelEl)[0];
        switch (labelName.replace('ogc:', '')) {
          case '#text':
            return labelEl['#text'];
          case 'Literal':
            return labelEl[labelName][0]['#text'];
          case 'PropertyName':
            const propName = labelEl[labelName][0]['#text'];
            return `{{${propName}}}`;
            // TODO handle CDATA property
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
    // const otulineDashOffset = getParameterValue(strokeEl, 'stroke-dashoffset', this.sldVersion);

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
    // if (otulineDashOffset) {
    //   fillSymbolizer.outlineDashOffset = Number(otulineDashOffset);
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

  checkForUnsupportedProperites(geoStylerStyle: Style): UnsupportedProperties | undefined {
    const capitalizeFirstLetter = (a: string) => a[0].toUpperCase() + a.slice(1);
    const unsupportedProperties: UnsupportedProperties = {};
    geoStylerStyle.rules.forEach(rule => {
      // ScaleDenominator and Filters are completly supported so we just check for symbolizers
      rule.symbolizers.forEach(symbolizer => {
        const key = capitalizeFirstLetter(`${symbolizer.kind}Symbolizer`);
        const value = this.unsupportedProperties?.Symbolizer?.[key];
        if (value) {
          if (typeof value === 'string' || value instanceof String ) {
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
