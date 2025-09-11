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
  FunctionCall,
  GeoStylerFunction,
  IconSymbolizer,
  isCombinationFilter,
  isComparisonFilter,
  isGeoStylerFunction,
  isGeoStylerNumberFunction,
  isNegationFilter,
  LineSymbolizer,
  MarkSymbolizer,
  PointSymbolizer,
  RangeFilter,
  RasterSymbolizer,
  ReadStyleResult,
  Rule,
  ScaleDenominator,
  Style,
  StyleParser,
  Symbolizer,
  TextSymbolizer,
  UnsupportedProperties,
  WellKnownName,
  WriteStyleResult,
} from 'geostyler-style';
import {
  X2jOptions,
  XMLBuilder,
  XmlBuilderOptions,
  XMLParser
} from 'fast-xml-parser';

import { isNumber, merge } from 'lodash';

import {
  geoStylerFunctionToSldFunction,
  get,
  getAttribute,
  getChildren,
  getParameterValue,
  getVendorOptionValue,
  isSymbolizer,
  keysByValue,
  numberExpression
} from './Util/SldUtil';

const SLD_VERSIONS = ['1.0.0', '1.1.0'] as const;

export type SldVersion = (typeof SLD_VERSIONS)[number];

/** GeoServer allows VendorOptions and mix some SLD versions */
export const sldEnvGeoServer = 'GeoServer';
const SLD_ENVIRONMENTS = [sldEnvGeoServer] as const;
/** Environment Configuration for the SLD parser/writer. */
export type SldEnvironment = (typeof SLD_ENVIRONMENTS)[number];

export type ParserOptions = Omit<X2jOptions,
'ignoreDeclaration' |
'removeNSPrefix' |
'ignoreAttributes' |
'preserveOrder' |
'trimValues'
>;

export type BuilderOptions = Omit<XmlBuilderOptions,
'cdataPropName' |
'ignoreAttributes' |
'suppressEmptyNode' |
'preserveOrder'
>;

export type ConstructorParams = {
  numericFilterFields?: string[];
  boolFilterFields?: string[];
  /* optional for reading style (it will be guessed from sld style) and mandatory for writing */
  sldVersion?: SldVersion;
  sldEnvironment?: SldEnvironment;
  symbolizerUnits?: string;
  parserOptions?: ParserOptions;
  builderOptions?: XmlBuilderOptions;
  translations?: SldStyleParserTranslations;
  locale?: string;
};

const WELLKNOWNNAME_TTF_REGEXP = /^ttf:\/\/(.+)#(.+)$/;

const COMPARISON_MAP = {
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

type ComparisonType = keyof typeof COMPARISON_MAP;

const NEGATION_OPERATOR_MAP = {
  Not: '!'
};

const COMBINATION_MAP = {
  And: '&&',
  Or: '||',
  PropertyIsBetween: '&&'
};

type CombinationType = keyof typeof COMBINATION_MAP;

const ARITHMETIC_OPERATORS = [
  'add',
  'sub',
  'mul',
  'div',
] as const;

type ArithmeticType = typeof ARITHMETIC_OPERATORS[number];

export type SldStyleParserTranslationKeys = {
  marksymbolizerParseFailedUnknownWellknownName?: (params: {wellKnownName: string}) => string;
  noFilterDetected?: string;
  symbolizerKindParseFailed?: (params: {sldSymbolizerName: string}) => string;
  colorMapEntriesParseFailedColorUndefined?: string;
  contrastEnhancParseFailedHistoAndNormalizeMutuallyExclusive?: string;
  channelSelectionParseFailedRGBAndGrayscaleMutuallyExclusive?: string;
  channelSelectionParseFailedRGBChannelsUndefined?: string;
};

export type SldStyleParserTranslations = Record<string, SldStyleParserTranslationKeys>;

export const defaultTranslations: SldStyleParserTranslations = {
  en: {
    marksymbolizerParseFailedUnknownWellknownName: ({wellKnownName}) =>
      `MarkSymbolizer cannot be parsed. WellKnownName ${wellKnownName} is not supported.`,
    noFilterDetected: 'No Filter detected.',
    symbolizerKindParseFailed: ({sldSymbolizerName}) =>
      `Failed to parse SymbolizerKind ${sldSymbolizerName} from SldRule.`,
    colorMapEntriesParseFailedColorUndefined: 'Cannot parse ColorMapEntries. color is undefined.',
    contrastEnhancParseFailedHistoAndNormalizeMutuallyExclusive:
      'Cannot parse ContrastEnhancement. Histogram and Normalize are mutually exclusive.',
    channelSelectionParseFailedRGBAndGrayscaleMutuallyExclusive:
      'Cannot parse ChannelSelection. RGB and Grayscale are mutually exclusive.',
    channelSelectionParseFailedRGBChannelsUndefined:
      'Cannot parse ChannelSelection. Red, Green and Blue channels must be defined.'
  },
  de: {},
  fr: {
    marksymbolizerParseFailedUnknownWellknownName: ({wellKnownName}) =>
      `Échec de lecture du symbole de type MarkSymbolizer. Le WellKnownName ${wellKnownName} n'est pas supporté.`,
    noFilterDetected: 'Aucun filtre détecté.',
    symbolizerKindParseFailed: ({sldSymbolizerName}) =>
      `Échec de lecture du type de symbole ${sldSymbolizerName} à partir de SldRule.`,
    colorMapEntriesParseFailedColorUndefined: 'Lecture de ColorMapEntries échoué. color n\'est pas défini.',
    contrastEnhancParseFailedHistoAndNormalizeMutuallyExclusive:
      'Échec de lecture des propriétés de contraste ContrastEnhancement échoué. '
      +'Histogram et Normalize sont mutuellement exclusifs.',
    channelSelectionParseFailedRGBAndGrayscaleMutuallyExclusive:
      'Échec de lecture de la sélection de canaux ChannelSelection. '
      +'RGB et Grayscale sont mutuellement exclusifs.',
    channelSelectionParseFailedRGBChannelsUndefined:
      'Échec de lecture de la sélection de canaux ChannelSelection. '
      +'Les canaux Rouge, Vert et Bleu doivent être définis.',

  },
} as const;

/**
 * @returns true if the provided value is null or undefined. Returns false otherwise.
 */
const isNil = (val: unknown): boolean => val === undefined || val === null;

/**
 * This parser can be used with the GeoStyler.
 * It implements the geostyler-style StyleParser interface.
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
        offset: {
          support: 'partial',
          info: 'Only supported for SLD Version 1.1.0'
        },
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
        haloOpacity: 'none',
        haloWidth: 'none',
        keepUpright: 'none',
        offset: {
          support: 'partial',
          info: 'Only supported for SLD Version 1.1.0'
        },
        offsetAnchor: 'none',
        optional: 'none',
        padding: 'none',
        pitchAlignment: 'none',
        rotationAlignment: 'none',
        textFit: 'none',
        image: {
          support: 'partial',
          info: 'Sprites are not supported'
        },
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
      },
      TextSymbolizer: {
        placement: {
          support: 'partial',
          info: 'Only "line" and "point" are currently supported'
        }
      }
    }
  };

  translations: SldStyleParserTranslations = defaultTranslations;

  locale: string = 'en';

  constructor(opts?: ConstructorParams) {
    this.parser = new XMLParser({
      ...opts?.parserOptions,
      // Fixed attributes
      ignoreDeclaration: true,
      removeNSPrefix: true,
      ignoreAttributes: false,
      preserveOrder: true,
      trimValues: true
    });

    this.builder = new XMLBuilder({
      ...opts?.builderOptions,
      // Fixed attributes
      cdataPropName: '#cdata',
      ignoreAttributes: false,
      suppressEmptyNode: true,
      preserveOrder: true
    });

    if (opts?.sldVersion) {
      this.sldVersion = opts?.sldVersion;
    }

    if (opts?.sldEnvironment !== undefined) {
      this.sldEnvironment = opts.sldEnvironment;
    }

    if (opts?.locale) {
      this.locale = opts.locale;
    }

    if (opts?.translations){
      this.translations = merge(this.translations, opts.translations);
    }

    Object.assign(this, opts);
  }

  translate(key: keyof SldStyleParserTranslationKeys, params?: any): string {
    const trans = this.translations?.[this.locale]?.[key] ?? key;

    if (typeof trans === 'function') {
      return trans(params);
    }

    return trans;
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
   * while parsing a SLD.
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
   * while parsing a SLD.
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
   * Symbology Encoding.
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
   * Indicate the sld environment to parse the SLD or write the SLD.
   * This allows or restrict some SLD tags.
   * @private
   */
  private _sldEnvironment: SldEnvironment | null = null;

  /**
   * Getter for _sldEnvironment
   * @return SldEnvironment or null.
   */
  get sldEnvironment(): SldEnvironment | null {
    return this._sldEnvironment;
  }

  /**
   * Setter for _sldEnvironment
   * @param a SldEnvironment or null.
   */
  set sldEnvironment(env: SldEnvironment | null) {
    this._sldEnvironment = env;
  }

  /**
   * Check if the given SldEnvironment match the current environment.
   * @param env the SldEnvironment to check.
   * @private
   */
  private isSldEnv(env: SldEnvironment): boolean {
    return this.sldEnvironment === env;
  }

  /**
   * String indicating the SLD version used in reading mode
   */
  private _readingSldVersion: SldVersion = '1.0.0';

  /**
   * Getter for _readingSldVersion
   * @return
   */
  get readingSldVersion(): SldVersion {
    return this._readingSldVersion;
  }

  /**
   * Setter for _readingSldVersion
   * @param sldVersion The _readingSldVersion value to set
   */
  set readingSldVersion(sldVersion: SldVersion) {
    this._readingSldVersion = sldVersion;
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
   * The readStyle implementation of the geostyler-style StyleParser interface.
   * It reads a SLD as a string and returns a Promise.
   * The Promise itself resolves with an object containing the geostyler-style.
   *
   * @param sldString A SLD as a string.
   * @return The Promise resolving with an object containing the geostyler-style.
   */
  readStyle(sldString: string): Promise<ReadStyleResult> {
    return new Promise<ReadStyleResult>((resolve) => {
      try {
        const sldObject = this.parser.parse(sldString);

        const version = getAttribute(sldObject[0], 'version');
        if (!SLD_VERSIONS.includes(version)) {
          throw new Error(`SLD version must be ${SLD_VERSIONS.toString()}`);
        }
        this._readingSldVersion = version;

        const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(sldObject);
        resolve({
          output: geoStylerStyle
        });
      } catch (error) {
        resolve({
          errors: [error]
        });
      }
    });
  }

  /**
   * Get the geostyler-style from a SLD Object (created with fast-xml-parser).
   *
   * @param sldObject The SLD object representation (created with fast-xml-parser)
   * @return The geostyler-style
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
   * Get the geostyler-style rules from a SLD Object (created with fast-xml-parser).
   *
   * @param sldObject The SLD object representation (created with fast-xml-parser)
   * @return The geostyler-style rules
   */
  getRulesFromSldObject(sldObject: any): Rule[] {
    const layers = getChildren(sldObject[0].StyledLayerDescriptor, 'NamedLayer');
    const rules: Rule[] = [];
    layers.forEach(({ NamedLayer: layer }: any) => {
      getChildren(layer, 'UserStyle').forEach(({ UserStyle: userStyle }: any) => {
        getChildren(userStyle, 'FeatureTypeStyle').forEach(({ FeatureTypeStyle: featureTypeStyle }: any) => {
          getChildren(featureTypeStyle, 'Rule').forEach(({ Rule: sldRule }: any) => {
            const filter: Filter | undefined = this.getFilterFromRule(sldRule);
            const scaleDenominator: ScaleDenominator | undefined = this.getScaleDenominatorFromRule(sldRule);
            const symbolizers: Symbolizer[] = this.getSymbolizersFromRule(sldRule);
            const ruleTitle = get(sldRule, 'Title.#text');
            const ruleName = get(sldRule, 'Name.#text');
            const name = ruleTitle !== undefined
              ? ruleTitle
              : (ruleName !== undefined ? ruleName : '');
            const rule: Rule = <Rule>{
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
   * @param sldObject The SLD object representation (created with fast-xml-parser)
   * @return The name to be used for the GeoStyler Style Style
   */
  getStyleNameFromSldObject(sldObject: any): string {
    const userStyleTitle = get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].UserStyle.Name.#text');
    const namedLayerName = get(sldObject, 'StyledLayerDescriptor.NamedLayer.Name.#text');
    return userStyleTitle ? userStyleTitle
      : namedLayerName ? namedLayerName : '';
  }

  /**
   * Get the geostyler-style Filter from a SLD Rule.
   *
   * Currently only supports one Filter per Rule.
   *
   * @param sldRule The SLD Rule
   * @return The geostyler-style Filter
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
    const filter = this.getFilterFromOperatorAndComparison(operator as ComparisonType, sldFilter);
    return filter;
  }

  /**
   * Get the geostyler-style ScaleDenominator from a SLD Rule.
   *
   * @param sldRule The SLD Rule
   * @return The geostyler-style ScaleDenominator
   */
  getScaleDenominatorFromRule(sldRule: any[]): ScaleDenominator | undefined {
    const scaleDenominator: ScaleDenominator = <ScaleDenominator>{};
    const min = get(sldRule, 'MinScaleDenominator.#text');
    if (min) {
      scaleDenominator.min = Number(min);
    }
    const max = get(sldRule, 'MaxScaleDenominator.#text');
    if (max) {
      scaleDenominator.max = Number(max);
    }

    return (Number.isFinite(scaleDenominator.min) || Number.isFinite(scaleDenominator.max))
      ? scaleDenominator
      : undefined;
  }

  /**
   * Get the geostyler-style Symbolizers from a SLD Rule.
   *
   * @param sldRule The SLD Rule
   * @return The geostyler-style Symbolizer array
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
            throw new Error(this.translate('symbolizerKindParseFailed', { sldSymbolizerName: sldSymbolizerName }));
        }
      });

    return symbolizers;
  }

  /**
   * Creates a geostyler-style Filter from a given operator name and the js
   * SLD object representation (created with fast-xml-parser) of the SLD Filter.
   *
   * @param sldOperatorName The Name of the SLD Filter Operator
   * @param sldFilter The SLD Filter
   * @return The geostyler-style Filter
   */
  getFilterFromOperatorAndComparison(
    sldOperatorName: ComparisonType | 'Function',
    sldFilter: any
  ): Filter {
    let filter: Filter;

    if (sldOperatorName === 'Function') {
      const functionName = Array.isArray(sldFilter) ? sldFilter[0][':@']['@_name'] : sldFilter[':@']['@_name'];
      const tempFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
      sldOperatorName = `PropertyIs${tempFunctionName}` as ComparisonType;
    }

    // we have to first check for PropertyIsBetween,
    // since it is also a comparisonOperator. But it
    // needs to be treated differently.
    if (sldOperatorName === 'PropertyIsBetween') {
      // TODO: PropertyIsBetween spec allows more than just a PropertyName as its first argument.
      const propertyName = get(sldFilter, 'PropertyIsBetween.PropertyName.#text');
      const lower = Number(get(sldFilter, 'PropertyIsBetween.LowerBoundary.Literal.#text'));
      const upper = Number(get(sldFilter, 'PropertyIsBetween.UpperBoundary.Literal.#text'));

      filter = ['<=x<=', propertyName, lower, upper];
    } else if (Object.keys(COMPARISON_MAP).includes(sldOperatorName)) {

      filter = this.getFilterFromComparisonOperator(sldOperatorName, sldFilter);

    } else if (Object.keys(COMBINATION_MAP).includes(sldOperatorName)) {
      const combinationOperator: CombinationOperator = COMBINATION_MAP[
        sldOperatorName as CombinationType] as CombinationOperator;
      const filters: Filter[] = get(sldFilter, sldOperatorName)?.map((op: any) => {
        const operatorName = Object.keys(op)?.[0];
        return this.getFilterFromOperatorAndComparison(operatorName as any, op);
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (Object.keys(NEGATION_OPERATOR_MAP).includes(sldOperatorName)) {
      const negationOperator = NEGATION_OPERATOR_MAP[sldOperatorName as 'Not'];
      const negatedOperator = Object.keys(sldFilter[sldOperatorName][0])[0];
      const negatedComparison = sldFilter[sldOperatorName][0];
      const negatedFilter: Filter = this.getFilterFromOperatorAndComparison(
        negatedOperator as any,
        negatedComparison
      );
      filter = [
        negationOperator as any,
        negatedFilter
      ];
    } else {
      throw new Error(this.translate('noFilterDetected'));
    }
    return filter;
  }

  getFilterFromComparisonOperator(
    sldOperatorName: ComparisonType | 'Function',
    sldFilter: any
  ): Filter {
    if (sldOperatorName === 'Function') {
      const functionName = Array.isArray(sldFilter) ? sldFilter[0][':@']['@_name'] : sldFilter[':@']['@_name'];
      const tempFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);
      sldOperatorName = `PropertyIs${tempFunctionName}` as ComparisonType;
    }

    const comparisonOperator: ComparisonOperator = COMPARISON_MAP[sldOperatorName] as ComparisonOperator;
    const filterIsFunction = !!get(sldFilter, 'Function');
    let args: (FunctionCall<unknown>|null)[] = [];

    const children = get(sldFilter, filterIsFunction ? 'Function' : sldOperatorName) || [];
    args = children.map((child: any, index: number) => {
      const operatorName = Object.keys(child)?.[0];

      if (ARITHMETIC_OPERATORS.includes(operatorName.toLowerCase() as ArithmeticType)) {
        const arithmeticOperator = child[operatorName];
        return this.getFilterArgsFromArithmeticOperators(operatorName as ArithmeticType, arithmeticOperator);
      }

      return this.getFilterArgsFromPropertyName(child, children, index);
    });

    if (sldOperatorName === 'PropertyIsNull') {
      args[1] = null;
    }

    return [
      comparisonOperator,
      ...args
    ] as ComparisonFilter;
  }

  /**
   * Creates a FunctionCall from arithmetic operators in SLD filters.
   * Handles nested arithmetic operations recursively.
   */
  getFilterArgsFromArithmeticOperators(
    arithmeticOperatorName: ArithmeticType,
    arithmeticOperator: any
  ): FunctionCall<number> {
    const [leftSide, rightSide] = arithmeticOperator;
    return {
      name: arithmeticOperatorName.toLowerCase() as FunctionCall<number>['name'],
      args: [
        this.processArithmeticOperand(leftSide, arithmeticOperator),
        this.processArithmeticOperand(rightSide, arithmeticOperator)
      ]
    };
  }

  /**
   * Processes a single operand in an arithmetic operation.
   * If the operand is itself an arithmetic operator, processes it recursively.
   */
  private processArithmeticOperand(operand: any, parentOperator: any): any {
    const operatorName = Object.keys(operand)?.[0];

    if (operatorName && ARITHMETIC_OPERATORS.includes(operatorName.toLowerCase() as ArithmeticType)) {
      return this.getFilterArgsFromArithmeticOperators(operatorName as ArithmeticType, operand[operatorName]);
    }

    return this.getFilterArgsFromPropertyName(operand, parentOperator, 0);
  }

  getFilterArgsFromPropertyName(
    child: any,
    children?: any,
    index?: number
  ): FunctionCall<unknown> {
    const propName = get([child], 'PropertyName.#text');
    if (propName !== undefined) {
      const isSingleArgOperator = children.length === 1;
      // Return property name for the first argument in case second argument is literal
      // or isSingleArgOperator eg (PropertyIsNull)
      if (isSingleArgOperator || (index === 0 && get([children[1]], 'PropertyName.#text') === undefined)) {
        return propName;
      }
      // ..otherwise + (second argument) return as property function
      return {
        name: 'property',
        args: [propName]
      };
    } else {
      return get([child], '#text');
    }
  }

  /**
   * Get the geostyler-style PointSymbolizer from a SLD Symbolizer.
   *
   * The opacity of the Symbolizer is taken from the <Graphic>.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style PointSymbolizer
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
   * Get the geostyler-style LineSymbolizer from a SLD Symbolizer.
   *
   * Currently only the CssParameters are available.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style LineSymbolizer
   */
  getLineSymbolizerFromSldSymbolizer(sldSymbolizer: any): LineSymbolizer {
    const lineSymbolizer: LineSymbolizer = {
      kind: 'Line'
    };
    const strokeEl = get(sldSymbolizer, 'Stroke', this.readingSldVersion);
    const color = getParameterValue(strokeEl, 'stroke', this.readingSldVersion);
    const width = getParameterValue(strokeEl, 'stroke-width', this.readingSldVersion);
    const opacity = getParameterValue(strokeEl, 'stroke-opacity', this.readingSldVersion);
    const lineJoin = getParameterValue(strokeEl, 'stroke-linejoin', this.readingSldVersion);
    const lineCap = getParameterValue(strokeEl, 'stroke-linecap', this.readingSldVersion);
    const dashArray = getParameterValue(strokeEl, 'stroke-dasharray', this.readingSldVersion);
    const dashOffset = getParameterValue(strokeEl, 'stroke-dashoffset', this.readingSldVersion);

    if (!isNil(color)) {
      lineSymbolizer.color = color;
    }
    if (!isNil(width)) {
      lineSymbolizer.width = numberExpression(width);
    }
    if (!isNil(opacity)) {
      lineSymbolizer.opacity = numberExpression(opacity);
    }
    if (!isNil(lineJoin)) {
      // geostyler-style and ol use 'miter' whereas sld uses 'mitre'
      if (lineJoin === 'mitre') {
        lineSymbolizer.join = 'miter';
      } else {
        lineSymbolizer.join = lineJoin as 'bevel' | 'miter' | 'round' | undefined;
      }
    }
    if (!isNil(lineCap)) {
      lineSymbolizer.cap = lineCap as 'round' | 'butt' | 'square' | undefined;
    }

    if (!isNil(dashArray)) {
      const dashStringAsArray = dashArray.split(' ').map(numberExpression);
      lineSymbolizer.dasharray = dashStringAsArray;
    }
    if (!isNil(dashOffset)) {
      lineSymbolizer.dashOffset = numberExpression(dashOffset);
    }

    const graphicStroke = get(strokeEl, 'GraphicStroke');
    if (!isNil(graphicStroke)) {
      lineSymbolizer.graphicStroke = this.getPointSymbolizerFromSldSymbolizer(graphicStroke);
    }

    const graphicFill = get(strokeEl, 'GraphicFill');
    if (!isNil(graphicFill)) {
      lineSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(graphicFill);
    }

    const perpendicularOffset = get(sldSymbolizer, 'PerpendicularOffset.#text');
    if (!isNil(perpendicularOffset)) {
      lineSymbolizer.perpendicularOffset = numberExpression(perpendicularOffset);
    }

    return lineSymbolizer;
  }

  /**
   * Get the geostyler-style TextSymbolizer from a SLD Symbolizer.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style TextSymbolizer
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

    const color = getParameterValue(fillEl, 'fill', this.readingSldVersion);
    const opacity = getParameterValue(fillEl, 'fill-opacity', this.readingSldVersion);

    const fontFamily = getParameterValue(fontEl, 'font-family', this.readingSldVersion);
    const fontStyle = getParameterValue(fontEl, 'font-style', this.readingSldVersion);
    const fontSize = getParameterValue(fontEl, 'font-size', this.readingSldVersion);
    const fontWeight = getParameterValue(fontEl, 'font-weight', this.readingSldVersion);

    const haloColor = getParameterValue(haloFillEl, 'fill', this.readingSldVersion);

    if (!isNil(labelEl)) {
      textSymbolizer.label = this.getTextSymbolizerLabelFromSldSymbolizer(labelEl);
    }

    textSymbolizer.color = color ? color : '#000000';

    if (!isNil(opacity)) {
      textSymbolizer.opacity = numberExpression(opacity);
    }

    const haloRadius = get(sldSymbolizer, 'Halo.Radius.#text');
    if (!isNil(haloRadius)) {
      textSymbolizer.haloWidth = numberExpression(haloRadius);
    }
    const haloOpacity = getParameterValue(haloFillEl, 'fill-opacity', this.readingSldVersion);
    if (!isNil(haloOpacity)) {
      textSymbolizer.haloOpacity = numberExpression(haloOpacity);
    }
    if (!isNil(haloColor)) {
      textSymbolizer.haloColor = haloColor;
    }
    const placement = get(sldSymbolizer, 'LabelPlacement');
    if (!isNil(placement)) {
      const pointPlacement = get(placement, 'PointPlacement');
      const linePlacement = get(placement, 'LinePlacement');
      if (!isNil(pointPlacement)) {
        textSymbolizer.placement = 'point';
        const anchorPoint = get(pointPlacement, 'AnchorPoint');
        if (!isNil(anchorPoint)) {
          const anchorX = get(anchorPoint, 'AnchorPointX.#text');
          const anchorY = get(anchorPoint, 'AnchorPointY.#text');
          textSymbolizer.anchor = this.getAnchorFromSldAnchorPoint(anchorX, anchorY);
        }
        const displacement = get(pointPlacement, 'Displacement');
        if (!isNil(displacement)) {
          const x = get(displacement, 'DisplacementX.#text');
          const y = get(displacement, 'DisplacementY.#text');
          textSymbolizer.offset = [
            Number.isFinite(x) ? numberExpression(x) : 0,
            Number.isFinite(y) ? -numberExpression(y) : 0,
          ];
        }
        const rotation = get(pointPlacement, 'Rotation.#text');
        if (!isNil(rotation)) {
          textSymbolizer.rotate = numberExpression(rotation);
        }
      } else if (!isNil(linePlacement)) {
        textSymbolizer.placement = 'line';
      }
    }
    if (!isNil(fontFamily)) {
      textSymbolizer.font = [fontFamily];
    }
    if (!isNil(fontStyle)) {
      textSymbolizer.fontStyle = fontStyle.toLowerCase() as 'normal' | 'italic' | 'oblique' | undefined;
    }
    if (!isNil(fontWeight)) {
      textSymbolizer.fontWeight = fontWeight.toLowerCase() as 'normal' | 'bold' | undefined;
    }
    if (!isNil(fontSize)) {
      textSymbolizer.size = numberExpression(fontSize);
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
   * @param sldLabel
   */
  getTextSymbolizerLabelFromSldSymbolizer = (sldLabel: any): string => {
    const label: string = sldLabel
      .map((labelEl: any) => {
        const labelName = Object.keys(labelEl)[0];
        switch (labelName.replace('ogc:', '')) {
          case '#text':
            return labelEl['#text'];
          case 'Literal':
            return labelEl?.[labelName]?.[0]?.['#text'] || labelEl?.[labelName]?.[0]?.['#cdata']?.[0]?.['#text'];
          case 'PropertyName':
            const propName = labelEl[labelName][0]['#text'];
            return `{{${propName}}}`;
          default:
            return '';
        }
      })
      .join('');
    return label;
  };

  /**
   * Get the geostyler-style FillSymbolizer from a SLD Symbolizer.
   *
   * PolygonSymbolizer Stroke is just partially supported.
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style FillSymbolizer
   */
  getFillSymbolizerFromSldSymbolizer(sldSymbolizer: any): FillSymbolizer {
    const fillSymbolizer: FillSymbolizer = {
      kind: 'Fill'
    };
    const strokeEl = get(sldSymbolizer, 'Stroke');
    const fillEl = get(sldSymbolizer, 'Fill');

    const fillOpacity = getParameterValue(fillEl, 'fill-opacity', this.readingSldVersion);
    const color = getParameterValue(fillEl, 'fill', this.readingSldVersion);

    const outlineColor = getParameterValue(strokeEl, 'stroke', this.readingSldVersion);
    const outlineWidth = getParameterValue(strokeEl, 'stroke-width', this.readingSldVersion);
    const outlineOpacity = getParameterValue(strokeEl, 'stroke-opacity', this.readingSldVersion);
    const outlineDashArray = getParameterValue(strokeEl, 'stroke-dasharray', this.readingSldVersion);
    const outlineCap = getParameterValue(strokeEl, 'stroke-linecap', this.readingSldVersion);
    const outlineJoin = getParameterValue(strokeEl, 'stroke-linejoin', this.readingSldVersion);
    // const outlineDashOffset = getParameterValue(strokeEl, 'stroke-dashoffset', this.readingSldVersion);

    const graphicFill = get(sldSymbolizer, 'Fill.GraphicFill');
    if (!isNil(graphicFill)) {
      fillSymbolizer.graphicFill = this.getPointSymbolizerFromSldSymbolizer(
        graphicFill
      );
    }
    if (this.isSldEnv(sldEnvGeoServer)) {
      const graphicFillPadding = getVendorOptionValue(sldSymbolizer, 'graphic-margin');
      if (!isNil(graphicFillPadding)) {
        fillSymbolizer.graphicFillPadding = graphicFillPadding.split(/\s/).map(numberExpression);
      }
    }
    if (!isNil(color)) {
      fillSymbolizer.color = color;
    }
    if (!isNil(fillOpacity)) {
      fillSymbolizer.fillOpacity = numberExpression(fillOpacity);
    }

    if (!isNil(outlineColor)) {
      fillSymbolizer.outlineColor = outlineColor;
    }
    if (!isNil(outlineWidth)) {
      fillSymbolizer.outlineWidth = numberExpression(outlineWidth);
    }
    if (!isNil(outlineOpacity)) {
      fillSymbolizer.outlineOpacity = numberExpression(outlineOpacity);
    }
    if (!isNil(outlineDashArray)) {
      fillSymbolizer.outlineDasharray = outlineDashArray.split(' ').map(numberExpression);
    }
    if (!isNil(outlineCap)) {
      fillSymbolizer.outlineCap = outlineCap;
    }
    if (!isNil(outlineJoin)) {
      fillSymbolizer.outlineJoin = outlineJoin;
    }
    // TODO: seems like this is missing in the geostyer-stlye
    // if (outlineDashOffset) {
    //   fillSymbolizer.outlineDashOffset = Number(outlineDashOffset);
    // }
    return fillSymbolizer;
  }

  /**
   * Get the geostyler-style RasterSymbolizer from a SLD Symbolizer.
   *
   * @param sldSymbolizer The SLD Symbolizer
   */
  getRasterSymbolizerFromSldSymbolizer(sldSymbolizer: any): RasterSymbolizer {
    const rasterSymbolizer: RasterSymbolizer = {
      kind: 'Raster'
    };
    // parse Opacity
    let opacity = get(sldSymbolizer, 'Opacity.#text');
    if (!isNil(opacity)) {
      opacity = numberExpression(opacity);
      rasterSymbolizer.opacity = opacity;
    }
    // parse ColorMap
    const sldColorMap = get(sldSymbolizer, 'ColorMap');
    const sldColorMapType = get(sldSymbolizer, 'ColorMap.@type');
    const extended = get(sldSymbolizer, 'ColorMap.@extended');
    if (!isNil(sldColorMap)) {
      const colormap = this.getColorMapFromSldColorMap(sldColorMap, sldColorMapType, extended);
      rasterSymbolizer.colorMap = colormap;
    }
    // parse ChannelSelection
    const sldChannelSelection = get(sldSymbolizer, 'ChannelSelection');
    if (!isNil(sldChannelSelection)) {
      const channelSelection = this.getChannelSelectionFromSldChannelSelection(sldChannelSelection);
      rasterSymbolizer.channelSelection = channelSelection;
    }
    // parse ContrastEnhancement
    const sldContrastEnhancement = get(sldSymbolizer, 'ContrastEnhancement');
    if (!isNil(sldContrastEnhancement)) {
      const contrastEnhancement = this.getContrastEnhancementFromSldContrastEnhancement(sldContrastEnhancement);
      rasterSymbolizer.contrastEnhancement = contrastEnhancement;
    }
    return rasterSymbolizer;
  }

  /**
   * Get the geostyler-style MarkSymbolizer from a SLD Symbolizer
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style MarkSymbolizer
   */
  getMarkSymbolizerFromSldSymbolizer(sldSymbolizer: any): MarkSymbolizer {
    const wellKnownName: WellKnownName = get(sldSymbolizer, 'Graphic.Mark.WellKnownName.#text');
    const strokeEl = get(sldSymbolizer, 'Graphic.Mark.Stroke');
    const fillEl = get(sldSymbolizer, 'Graphic.Mark.Fill');

    const opacity = get(sldSymbolizer, 'Graphic.Opacity.#text');
    const size = get(sldSymbolizer, 'Graphic.Size.#text');
    const rotation = get(sldSymbolizer, 'Graphic.Rotation.#text');
    const fillOpacity = getParameterValue(fillEl, 'fill-opacity', this.readingSldVersion);
    const color = getParameterValue(fillEl, 'fill', this.readingSldVersion);
    const displacement = get(sldSymbolizer, 'Graphic.Displacement');

    const markSymbolizer: MarkSymbolizer = {
      kind: 'Mark',
      wellKnownName: 'circle'
    };

    if (!isNil(opacity)) {
      markSymbolizer.opacity = numberExpression(opacity);
    }
    if (!isNil(fillOpacity)) {
      markSymbolizer.fillOpacity = numberExpression(fillOpacity);
    }
    if (!isNil(color)) {
      markSymbolizer.color = color;
    }
    if (!isNil(rotation)) {
      markSymbolizer.rotate = numberExpression(rotation);
    }
    if (!isNil(size)) {
      // edge case where the value has to be divided by 2 which has to be considered in the function
      markSymbolizer.radius = isGeoStylerNumberFunction(size) ? size : Number(size) / 2;
    }
    if (displacement) {
      const x = get(displacement, 'DisplacementX.#text');
      const y = get(displacement, 'DisplacementY.#text');
      markSymbolizer.offset = [
        Number.isFinite(x) ? numberExpression(x) : 0,
        Number.isFinite(y) ? numberExpression(y) : 0,
      ];
    }

    switch (wellKnownName) {
      case 'arrow':
      case 'arrowhead':
      case 'asterisk_fill':
      case 'backslash':
      case 'circle':
      case 'cross':
      case 'cross2':
      case 'cross_fill':
      case 'decagon':
      case 'diagonal_half_square':
      case 'diamond':
      case 'equilateral_triangle':
      case 'filled_arrowhead':
      case 'half_arc':
      case 'half_square':
      case 'heart':
      case 'hexagon':
      case 'horline':
      case 'left_half_triangle':
      case 'line':
      case 'octagon':
      case 'parallelogram_left':
      case 'parallelogram_right':
      case 'pentagon':
      case 'quarter_arc':
      case 'quarter_circle':
      case 'quarter_square':
      case 'right_half_triangle':
      case 'rounded_square':
      case 'semi_circle':
      case 'shield':
      case 'slash':
      case 'square':
      case 'square_with_corners':
      case 'star':
      case 'star_diamond':
      case 'third_arc':
      case 'third_circle':
      case 'trapezoid':
      case 'triangle':
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
      case 'brush://dense1':
      case 'brush://dense2':
      case 'brush://dense3':
      case 'brush://dense4':
      case 'brush://dense5':
      case 'brush://dense6':
      case 'brush://dense7':
        markSymbolizer.wellKnownName = wellKnownName;
        break;
      default:
        if (WELLKNOWNNAME_TTF_REGEXP.test(wellKnownName)) {
          markSymbolizer.wellKnownName = wellKnownName;
          break;
        }
        throw new Error(
          this.translate('marksymbolizerParseFailedUnknownWellknownName', { wellKnownName: wellKnownName })
        );
    }

    const strokeColor = getParameterValue(strokeEl, 'stroke', this.readingSldVersion);
    if (!isNil(strokeColor)) {
      markSymbolizer.strokeColor = strokeColor;
    }
    const strokeWidth = getParameterValue(strokeEl, 'stroke-width', this.readingSldVersion);
    if (!isNil(strokeWidth)) {
      markSymbolizer.strokeWidth = numberExpression(strokeWidth);
    }
    const strokeOpacity = getParameterValue(strokeEl, 'stroke-opacity', this.readingSldVersion);
    if (!isNil(strokeOpacity)) {
      markSymbolizer.strokeOpacity = numberExpression(strokeOpacity);
    }
    const strokeDasharray = getParameterValue(strokeEl, 'stroke-dasharray', this.readingSldVersion);
    if (!isNil(strokeDasharray)) {
      const dashStringAsArray = strokeDasharray.split(' ').map(numberExpression);
      markSymbolizer.strokeDasharray = dashStringAsArray;
    }

    return markSymbolizer;
  }

  /**
   * Get the geostyler-style IconSymbolizer from a SLD Symbolizer
   *
   * @param sldSymbolizer The SLD Symbolizer
   * @return The geostyler-style IconSymbolizer
   */
  getIconSymbolizerFromSldSymbolizer(sldSymbolizer: any): IconSymbolizer {
    const image = get(sldSymbolizer, 'Graphic.ExternalGraphic.OnlineResource.@href');
    const iconSymbolizer: IconSymbolizer = <IconSymbolizer>{
      kind: 'Icon',
      image
    };
    const opacity: string = get(sldSymbolizer, 'Graphic.Opacity.#text');
    const size: string = get(sldSymbolizer, 'Graphic.Size.#text');
    const rotation: string = get(sldSymbolizer, 'Graphic.Rotation.#text');
    const displacement = get(sldSymbolizer, 'Graphic.Displacement');
    if (!isNil(opacity)) {
      iconSymbolizer.opacity = numberExpression(opacity);
    }
    if (!isNil(size)) {
      iconSymbolizer.size = numberExpression(size);
    }
    if (!isNil(rotation)) {
      iconSymbolizer.rotate = numberExpression(rotation);
    }
    if (displacement) {
      const x = get(displacement, 'DisplacementX.#text');
      const y = get(displacement, 'DisplacementY.#text');
      iconSymbolizer.offset = [
        Number.isFinite(x) ? numberExpression(x) : 0,
        Number.isFinite(y) ? numberExpression(y) : 0,
      ];
    }
    return iconSymbolizer;
  }

  /**
   * Get the geostyler-style ColorMap from a SLD ColorMap.
   *
   * @param sldColorMap The SLD ColorMap
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
          throw new Error(this.translate('colorMapEntriesParseFailedColorUndefined'));
        }
        let quantity = getAttribute(cm, 'quantity');
        if (quantity) {
          quantity = numberExpression(quantity);
        }
        const label = getAttribute(cm, 'label');
        let opacity = getAttribute(cm, 'opacity');
        if (!isNil(opacity)) {
          opacity = numberExpression(opacity);
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
   * Get the geostyler-style ContrastEnhancement from a SLD ContrastEnhancement.
   *
   * @param sldContrastEnhancement The SLD ContrastEnhancement
   */
  getContrastEnhancementFromSldContrastEnhancement(sldContrastEnhancement: any): ContrastEnhancement {
    const contrastEnhancement: ContrastEnhancement = {};

    // parse enhancementType
    const hasHistogram = !!get(sldContrastEnhancement, 'Histogram');
    const hasNormalize = !!get(sldContrastEnhancement, 'Normalize');
    if (hasHistogram && hasNormalize) {
      throw new Error(this.translate('contrastEnhancParseFailedHistoAndNormalizeMutuallyExclusive'));
    } else if (hasHistogram) {
      contrastEnhancement.enhancementType = 'histogram';
    } else if (hasNormalize) {
      contrastEnhancement.enhancementType = 'normalize';
    }
    // parse gammavalue
    let gammaValue = get(sldContrastEnhancement, 'GammaValue.#text');
    if (gammaValue) {
      gammaValue = numberExpression(gammaValue);
    }
    contrastEnhancement.gammaValue = gammaValue;

    return contrastEnhancement;
  }

  /**
   * Get the geostyler-style Channel from a SLD Channel.
   *
   * @param sldChannel The SLD Channel
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
   * Get the geostyler-style ChannelSelection from a SLD ChannelSelection.
   *
   * @param sldChannelSelection The SLD ChannelSelection
   */
  getChannelSelectionFromSldChannelSelection(sldChannelSelection: any): ChannelSelection {
    let channelSelection: ChannelSelection;
    const red = get(sldChannelSelection, 'RedChannel');
    const blue = get(sldChannelSelection, 'BlueChannel');
    const green = get(sldChannelSelection, 'GreenChannel');
    const gray = get(sldChannelSelection, 'GrayChannel');

    if (gray && red && blue && green) {
      throw new Error(this.translate('channelSelectionParseFailedRGBAndGrayscaleMutuallyExclusive'));
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
      throw new Error(this.translate('channelSelectionParseFailedRGBChannelsUndefined'));
    }
    return channelSelection;
  }

  /**
   * The writeStyle implementation of the geostyler-style StyleParser interface.
   * It reads a geostyler-style and returns a Promise.
   * The Promise itself resolves with a SLD string.
   *
   * @param geoStylerStyle A geostyler-style.
   * @return The Promise resolving with the SLD as a string.
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      const unsupportedProperties = this.checkForUnsupportedProperties(geoStylerStyle);
      try {
        const sldObject = this.geoStylerStyleToSldObject(geoStylerStyle);
        const sldString = this.builder.build(sldObject);
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
   * Get the correct tagName in dependency to the configured sldVersion.
   *
   * @param tagName
   * @returns The tagName as used by the configured sldVersion
   */
  getTagName(tagName: string): string {
    const ogcList = ['Filter'];
    if (ogcList.includes(tagName)) {
      return tagName;
    }
    if (tagName === 'CssParameter') {
      return this.sldVersion === '1.1.0' ? 'se:SvgParameter' : 'CssParameter';
    }
    return this.sldVersion === '1.1.0' ? `se:${tagName}` : tagName;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style
   *
   * @param geoStylerStyle A geostyler-style.
   * @return The object representation of a SLD Style (readable with fast-xml-parser)
   */
  geoStylerStyleToSldObject(geoStylerStyle: Style): any {
    const rules: any[] = this.getSldRulesFromRules(geoStylerStyle.rules);
    // add the ogc namespace to the filter element, if a filter is present
    rules.forEach(rule => {
      const ruleEl = get(rule, this.getTagName('Rule'));
      const filter = getChildren(ruleEl, 'Filter').at(0);
      if (filter) {
        filter[':@'] = {
          '@_xmlns': 'http://www.opengis.net/ogc'
        };
      }
    });

    const featureTypeStyle = [
      ...rules
    ];
    const Name = this.getTagName('Name');
    const Title = this.getTagName('Title');
    const FeatureTypeStyle = this.getTagName('FeatureTypeStyle');

    const attributes = {
      '@_version': this.sldVersion,
      '@_xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd',
      '@_xmlns': 'http://www.opengis.net/sld',
      '@_xmlns:ogc': 'http://www.opengis.net/ogc',
      '@_xmlns:xlink': 'http://www.w3.org/1999/xlink',
      '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@_xmlns:se': 'http://www.opengis.net/se'
    };

    const userStyle = [];
    userStyle.push({
      [Name]: [{ '#text': geoStylerStyle.name || '' }]
    });
    if (this.sldVersion === '1.0.0') {
      userStyle.push({
        [Title]: [{ '#text': geoStylerStyle.name || '' }]
      });
    }
    userStyle.push({
      [FeatureTypeStyle]: featureTypeStyle
    });

    return [{
      '?xml': [{ '#text': '' }],
      ':@': {
        '@_version': '1.0',
        '@_encoding': 'UTF-8',
        '@_standalone': 'yes'
      },
    }, {
      StyledLayerDescriptor: [{
        NamedLayer: [{
          [Name]: [{ '#text': geoStylerStyle.name || '' }]
        }, {
          UserStyle: userStyle
        }]
      }],
      ':@': attributes
    }];
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style Rule.
   *
   * @param rules An array of geostyler-style Rules.
   * @return The object representation of a SLD Rule (readable with fast-xml-parser)
   */
  getSldRulesFromRules(rules: Rule[]): any[] {
    const Name = this.getTagName('Name');
    const filterTag = this.getTagName('Filter');
    const ruleTag = this.getTagName('Rule');
    const MinScaleDenominator = this.getTagName('MinScaleDenominator');
    const MaxScaleDenominator = this.getTagName('MaxScaleDenominator');

    return rules.map((rule: Rule) => {
      const sldRule: any = {
        [ruleTag]: []
      };
      if (rule.name) {
        sldRule[ruleTag].push({
          [Name]: [{
            '#text': rule.name
          }]
        });
      }
      if (rule.filter) {
        const filter = this.getSldFilterFromFilter(rule.filter);
        sldRule[ruleTag].push({
          [filterTag]: filter
        });
      }
      if (rule.scaleDenominator) {
        const { min, max } = rule.scaleDenominator;
        if (min && Number.isFinite(min)) {
          sldRule[ruleTag].push({
            [MinScaleDenominator]: [{
              '#text': min
            }]
          });
        }
        if (max && Number.isFinite(max)) {
          sldRule[ruleTag].push({
            [MaxScaleDenominator]: [{
              '#text': max
            }]
          });
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

      if (symbolizers.length > 0 && symbolizerKeys.length !== 0) {
        sldRule[ruleTag] = [
          ...sldRule[ruleTag],
          ...symbolizers
        ];
      }
      return sldRule;
    });
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style ComparisonFilter.
   *
   * @param comparisonFilter A geostyler-style ComparisonFilter.
   * @return The object representation of a SLD Filter Expression with a
   * comparison operator (readable with fast-xml-parser)
   */
  getSldComparisonFilterFromComparisonFilter(comparisonFilter: ComparisonFilter): any[] {
    const sldComparisonFilter: any = [];
    const operator = comparisonFilter[0];
    const key = comparisonFilter[1];
    const value = comparisonFilter[2];

    const sldOperators: string[] = keysByValue(COMPARISON_MAP, operator);
    const sldOperator: string = (sldOperators.length > 1 && value === null)
      ? sldOperators[1] : sldOperators[0];

    const propertyKey = 'PropertyName';

    if (isGeoStylerFunction(key) || isGeoStylerFunction(value)) {
      const tempOperator = sldOperator.replace('PropertyIs', '');
      const sldFunctionOperator = tempOperator.charAt(0).toLowerCase() + tempOperator.slice(1);
      const keyResult = isGeoStylerFunction(key) ? geoStylerFunctionToSldFunction(key) : key;
      const valueResult = isGeoStylerFunction(value) ? geoStylerFunctionToSldFunction(value) : value;

      const functionChildren: any = [];

      if (isGeoStylerFunction(key)) {
        functionChildren.unshift(Array.isArray(keyResult) ? keyResult?.[0] : keyResult);
      } else {
        functionChildren.unshift({
          Literal: [{
            '#text': keyResult
          }]
        });
      }

      if (isGeoStylerFunction(value)) {
        functionChildren.push(Array.isArray(valueResult) ? valueResult?.[0] : valueResult);
      } else {
        functionChildren.push({
          Literal: [{
            '#text': valueResult
          }]
        });
      }

      return [{
        Function: functionChildren,
        ':@': {
          '@_name': sldFunctionOperator
        }
      }];
    }

    if (sldOperator === 'PropertyIsNull') {
      // empty, selfclosing Literals are not valid in a propertyIsNull filter
      sldComparisonFilter.push({
        [sldOperator]: [{
          [propertyKey]: [{
            '#text': key
          }]
        }]
      });
    } else if (sldOperator === 'PropertyIsLike') {
      sldComparisonFilter.push({
        [sldOperator]: [{
          [propertyKey]: [{
            '#text': key
          }]
        }, {
          Literal: [{
            '#text': value
          }]
        }],
        [':@']: {
          '@_wildCard': '*',
          '@_singleChar': '.',
          '@_escape': '!',
        }
      });
    } else if (sldOperator === 'PropertyIsBetween') {
      // Currently we only support Literals as values.
      const betweenFilter = comparisonFilter as RangeFilter;
      sldComparisonFilter.push({
        [sldOperator]: [{
          [propertyKey]: [{
            '#text': key
          }]
        }, {
          LowerBoundary: [{
            Literal: [{
              '#text': betweenFilter[2]
            }]
          }]
        }, {
          UpperBoundary: [{
            Literal: [{
              '#text': betweenFilter[3]
            }]
          }]
        }]
      });
    } else {
      sldComparisonFilter.push({
        [sldOperator]: [{
          [propertyKey]: [{
            '#text': key
          }]
        }, {
          Literal: [{
            '#text': value
          }]
        }]
      });
    }


    return sldComparisonFilter;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style Filter.
   *
   * @param filter A geostyler-style Filter.
   * @return The object representation of a SLD Filter Expression (readable with fast-xml-parser)
   */
  getSldFilterFromFilter(filter: Filter): any[] {
    let sldFilter: any[] = [];

    if (isComparisonFilter(filter)) {
      sldFilter = this.getSldComparisonFilterFromComparisonFilter(filter);
    } else if (isNegationFilter(filter)) {
      sldFilter.push({
        Not: this.getSldFilterFromFilter(filter[1])
      });
    } else if (isCombinationFilter(filter)) {
      const [
        operator,
        ...args
      ] = filter;
      const sldOperators: string[] = keysByValue(COMBINATION_MAP, operator);
      const combinator = sldOperators[0];
      const sldSubFilters = args.map(subFilter => this.getSldFilterFromFilter(subFilter)[0]);
      sldFilter.push({
        [combinator]: sldSubFilters
      });
    }
    return sldFilter;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from geostyler-style Symbolizers.
   *
   * @param symbolizers A geostyler-style Symbolizer array.
   * @return The object representation of a SLD Symbolizer (readable with fast-xml-parser)
   */
  getSldSymbolizersFromSymbolizers(symbolizers: Symbolizer[]): any {
    const sldSymbolizers: any = [];
    const pointSymbolizerTag = this.getTagName('PointSymbolizer');
    const textSymbolizerTag = this.getTagName('TextSymbolizer');
    const lineSymbolizerTag = this.getTagName('LineSymbolizer');
    const polygonSymbolizerTag = this.getTagName('PolygonSymbolizer');
    const rasterSymbolizerTag = this.getTagName('RasterSymbolizer');

    symbolizers.forEach(symb => {
      const sldSymbolizer: any = {};
      let sldSymb: any[];
      switch (symb.kind) {
        case 'Mark':
          sldSymb = this.getSldPointSymbolizerFromMarkSymbolizer(symb);
          sldSymbolizer[pointSymbolizerTag] = sldSymb;
          break;
        case 'Icon':
          sldSymb = this.getSldPointSymbolizerFromIconSymbolizer(symb);
          sldSymbolizer[pointSymbolizerTag] = sldSymb;
          break;
        case 'Text':
          sldSymb = this.getSldTextSymbolizerFromTextSymbolizer(symb);
          sldSymbolizer[textSymbolizerTag] = sldSymb;
          break;
        case 'Line':
          sldSymb = this.getSldLineSymbolizerFromLineSymbolizer(symb);
          sldSymbolizer[lineSymbolizerTag] = sldSymb;
          break;
        case 'Fill':
          sldSymb = this.getSldPolygonSymbolizerFromFillSymbolizer(symb);
          sldSymbolizer[polygonSymbolizerTag] = sldSymb;
          break;
        case 'Raster':
          sldSymb = this.getSldRasterSymbolizerFromRasterSymbolizer(symb);
          sldSymbolizer[rasterSymbolizerTag] = sldSymb;
          break;
        default:
          break;
      }
      sldSymbolizers.push(sldSymbolizer);
    });
    return sldSymbolizers;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style MarkSymbolizer.
   *
   * @param markSymbolizer A geostyler-style MarkSymbolizer.
   * @return The object representation of a SLD PointSymbolizer with a Mark
   */
  getSldPointSymbolizerFromMarkSymbolizer(markSymbolizer: MarkSymbolizer): any {
    const wellKnownName = this.getTagName('WellKnownName');
    const CssParameter = this.getTagName('CssParameter');
    const Fill = this.getTagName('Fill');
    const Mark = this.getTagName('Mark');
    const Stroke = this.getTagName('Stroke');
    const Opacity = this.getTagName('Opacity');
    const Rotation = this.getTagName('Rotation');
    const Size = this.getTagName('Size');
    const Graphic = this.getTagName('Graphic');
    const Displacement = this.getTagName('Displacement');
    const DisplacementX = this.getTagName('DisplacementX');
    const DisplacementY = this.getTagName('DisplacementY');

    const isFontSymbol = WELLKNOWNNAME_TTF_REGEXP.test(markSymbolizer.wellKnownName);
    const mark: any[] = [{
      [wellKnownName]: [{
        '#text': isFontSymbol ? markSymbolizer.wellKnownName : markSymbolizer.wellKnownName.toLowerCase()
      }]
    }];

    if (markSymbolizer.color || !isNil(markSymbolizer.fillOpacity)) {
      const fillCssParamaters = [];
      if (markSymbolizer.color) {
        if (isGeoStylerFunction(markSymbolizer.color)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.color);
          fillCssParamaters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'fill'
            }
          });
        } else {
          fillCssParamaters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.color,
            }],
            ':@': {
              '@_name': 'fill'
            }
          });
        }
      }
      if (!isNil(markSymbolizer.fillOpacity)) {
        if (isGeoStylerFunction(markSymbolizer.fillOpacity)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.fillOpacity);
          fillCssParamaters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'fill-opacity'
            }
          });
        } else {
          fillCssParamaters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.fillOpacity,
            }],
            ':@': {
              '@_name': 'fill-opacity'
            }
          });
        }
      }
      mark.push({
        [Fill]: fillCssParamaters
      });
    }

    if (markSymbolizer.strokeColor ||
      Number.isFinite(markSymbolizer.strokeWidth) ||
      Number.isFinite(markSymbolizer.strokeOpacity)
    ) {
      const strokeCssParameters = [];
      if (markSymbolizer.strokeColor) {
        if (isGeoStylerFunction(markSymbolizer.strokeColor)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.strokeColor);
          strokeCssParameters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'stroke'
            }
          });
        } else {
          strokeCssParameters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.strokeColor,
            }],
            ':@': {
              '@_name': 'stroke'
            }
          });
        }
      }
      if (!isNil(markSymbolizer.strokeWidth)) {
        if (isGeoStylerFunction(markSymbolizer.strokeWidth)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.strokeWidth);
          strokeCssParameters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'stroke-width'
            }
          });
        } else {
          strokeCssParameters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.strokeWidth,
            }],
            ':@': {
              '@_name': 'stroke-width'
            }
          });
        }
      }
      if (!isNil(markSymbolizer.strokeOpacity)) {
        if (isGeoStylerFunction(markSymbolizer.strokeOpacity)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.strokeOpacity);
          strokeCssParameters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'stroke-opacity'
            }
          });
        } else {
          strokeCssParameters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.strokeOpacity,
            }],
            ':@': {
              '@_name': 'stroke-opacity'
            }
          });
        }
      }
      if (!isNil(markSymbolizer.strokeDasharray)) {
        if (isGeoStylerFunction(markSymbolizer.strokeDasharray)) {
          const children = geoStylerFunctionToSldFunction(markSymbolizer.strokeDasharray);
          strokeCssParameters.push({
            [CssParameter]: children,
            ':@': {
              '@_name': 'stroke-dasharray'
            }
          });
        } else {
          strokeCssParameters.push({
            [CssParameter]: [{
              '#text': markSymbolizer.strokeDasharray?.join(' '),
            }],
            ':@': {
              '@_name': 'stroke-dasharray'
            }
          });
        }
      }
      mark.push({
        [Stroke]: strokeCssParameters
      });
    }

    const graphic: any[] = [{
      [Mark]: mark
    }];

    if (!isNil(markSymbolizer.opacity)) {
      graphic.push({
        [Opacity]: [{
          '#text': markSymbolizer.opacity!.toString()
        }]
      });
    }

    if (markSymbolizer.radius !== undefined) {
      if (isGeoStylerFunction(markSymbolizer.radius)) {
        graphic.push({
          // TODO: Double check if we have to multiply this by 2
          [Size]: geoStylerFunctionToSldFunction(markSymbolizer.radius)
        });
      } else {
        graphic.push({
          [Size]: [{
            '#text': (markSymbolizer.radius * 2).toString()
          }]
        });
      }
    }

    if (markSymbolizer.rotate) {
      graphic.push({
        [Rotation]: [{
          '#text': markSymbolizer.rotate.toString()
        }]
      });
    }

    if (markSymbolizer.offset && (this.sldVersion === '1.1.0' || this.isSldEnv(sldEnvGeoServer))) {
      graphic.push({
        [Displacement]: [{
          [DisplacementX]: [{
            '#text': markSymbolizer.offset[0].toString()
          }]
        }, {
          [DisplacementY]: [{
            '#text': markSymbolizer.offset[1].toString()
          }]
        }]
      });
    }

    return [{
      [Graphic]: graphic
    }];
  }

  /**
   * Push a new GeoServerVendorOption in the given array if such options are allowed.
   */
  pushGeoServerVendorOption(elementArray: any[], name: string, text: string) {
    if (this.isSldEnv(sldEnvGeoServer)) {
      elementArray.push(this.createGeoServerVendorOption(name, text));
    }
  }

  /**
   * @returns <VendorOption name="name">text</VendorOption>
   */
  createGeoServerVendorOption(name: string, text: string) {
    const VendorOption = this.getTagName('VendorOption');
    return {
      [VendorOption]: [{
        '#text': text,
      }],
      ':@': {
        '@_name': name,
      }
    };
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style IconSymbolizer.
   *
   * @param iconSymbolizer A geostyler-style IconSymbolizer.
   * @return The object representation of a SLD PointSymbolizer with
   * an "ExternalGraphic" (readable with fast-xml-parser)
   */
  getSldPointSymbolizerFromIconSymbolizer(iconSymbolizer: IconSymbolizer): any {
    const ExternalGraphic = this.getTagName('ExternalGraphic');
    const Format = this.getTagName('Format');
    const OnlineResource = this.getTagName('OnlineResource');
    const Opacity = this.getTagName('Opacity');
    const Rotation = this.getTagName('Rotation');
    const Size = this.getTagName('Size');
    const Graphic = this.getTagName('Graphic');
    const Displacement = this.getTagName('Displacement');
    const DisplacementX = this.getTagName('DisplacementX');
    const DisplacementY = this.getTagName('DisplacementY');

    const graphic: any[] = [{
      [ExternalGraphic]: [{
        [OnlineResource]: [],
        ':@': {
          '@_xlink:type': 'simple',
          '@_xmlns:xlink': 'http://www.w3.org/1999/xlink',
          '@_xlink:href': iconSymbolizer.image
        }
      }, {[Format]: []}]
    }];

    if (typeof iconSymbolizer.image === 'string' || iconSymbolizer.image instanceof String) {
      const iconExt = iconSymbolizer.image.split('.').pop();
      switch (iconExt) {
        case 'png':
        case 'jpeg':
        case 'gif':
          graphic[0][ExternalGraphic][1][Format] = [{
            '#text': `image/${iconExt}`
          }];
          break;
        case 'jpg':
          graphic[0][ExternalGraphic][1][Format] = [{
            '#text': 'image/jpeg'
          }];
          break;
        case 'svg':
          graphic[0][ExternalGraphic][1][Format] = [{
            '#text': 'image/svg+xml'
          }];
          break;
        case undefined:
        default:
          break;
      }
    }

    if (!isNil(iconSymbolizer.opacity)) {
      graphic.push({
        [Opacity]: [{
          '#text': iconSymbolizer.opacity
        }]
      });
    }
    if (iconSymbolizer.size) {
      graphic.push({
        [Size]: [{
          '#text': iconSymbolizer.size
        }]
      });
    }
    if (iconSymbolizer.rotate) {
      graphic.push({
        [Rotation]: [{
          '#text': iconSymbolizer.rotate
        }]
      });
    }
    if (iconSymbolizer.offset && this.sldVersion === '1.1.0') {
      graphic.push({
        [Displacement]: [{
          [DisplacementX]: [{
            '#text': iconSymbolizer.offset[0].toString()
          }]
        }, {
          [DisplacementY]: [{
            '#text': iconSymbolizer.offset[1].toString()
          }]
        }]
      });
    }
    return [{
      [Graphic]: graphic
    }];
  }

  /**
   * Translates an anchor-setting into SLD-anchor-numbers
   */
  getSldAnchorPointFromAnchor(anchor: TextSymbolizer['anchor'], dimension: 'x' | 'y'): number {
    if (!anchor || isGeoStylerFunction(anchor)) {
      return 0;
    }
    // As explained in https://docs.geoserver.org/main/en/user/styling/sld/reference/labeling.html#anchorpoint,
    // we have the following translation for anchors:
    // x-dimension
    //   left -> 0.0
    //   center -> 0.5
    //   right -> 1.0
    // y-dimension
    //   top -> 1.0
    //   middle -> 0.5
    //   bottom -> 0.0

    if (dimension === 'x') {
      if (anchor.indexOf('left') >= 0) {
        return 0.0;
      }
      else if (anchor.indexOf('right') >= 0) {
        return 1.0;
      }
      else {
        return 0.5;
      }
    }
    else {
      if (anchor.indexOf('bottom') >= 0) {
        return 0.0;
      }
      else if (anchor.indexOf('top') >= 0) {
        return 1.0;
      }
      else {
        return 0.5;
      }
    }
  }

  /**
   * Translates a SLD-anchor-number into a geostyler anchor-setting
   */
  getAnchorFromSldAnchorPoint(anchorX: any, anchorY: any): TextSymbolizer['anchor'] | undefined {

    if (!isNumber(anchorX) || !isNumber(anchorY)) {
      return undefined;
    }
    // see comment in getSldAnchorPointFromAnchor

    const gsAnchorHoriz = anchorX < 0.25 ? 'left' : anchorX > 0.75 ? 'right' : '';
    const gsAnchorVert = anchorY < 0.25 ? 'bottom' : anchorY > 0.75 ? 'top' : '';
    const gsAnchor: TextSymbolizer['anchor'] = ((gsAnchorHoriz && gsAnchorVert) ?
      (gsAnchorVert + '-' +gsAnchorHoriz) : (gsAnchorVert + gsAnchorHoriz)) as TextSymbolizer['anchor'];

    // for not breaking existing tests like "can read the geoserver popshade.sld", we treat
    // a center anchor as the default and deliver undefined in this case (instead of 'center')
    return gsAnchor ? gsAnchor : undefined;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style TextSymbolizer.
   *
   * @param textSymbolizer A geostyler-style TextSymbolizer.
   * @return The object representation of a SLD TextSymbolizer (readable with fast-xml-parser)
   */
  getSldTextSymbolizerFromTextSymbolizer(textSymbolizer: TextSymbolizer): any {
    const CssParameter = this.getTagName('CssParameter');
    const Fill = this.getTagName('Fill');
    const Halo = this.getTagName('Halo');
    const Font = this.getTagName('Font');
    const Displacement = this.getTagName('Displacement');
    const DisplacementX = this.getTagName('DisplacementX');
    const DisplacementY = this.getTagName('DisplacementY');
    const AnchorPoint = this.getTagName('AnchorPoint');
    const AnchorPointX = this.getTagName('AnchorPointX');
    const AnchorPointY = this.getTagName('AnchorPointY');
    const LabelPlacement = this.getTagName('LabelPlacement');
    const PointPlacement = this.getTagName('PointPlacement');
    const LinePlacement = this.getTagName('LinePlacement');
    const Rotation = this.getTagName('Rotation');
    const Radius = this.getTagName('Radius');
    const Label = this.getTagName('Label');
    const PerpendicularOffset = this.getTagName('PerpendicularOffset');

    const sldTextSymbolizer: any = [{
      [Label]: textSymbolizer.label ? this.getSldLabelFromTextSymbolizer(textSymbolizer.label) : undefined
    }];

    const fontPropertyMap = {
      font: 'font-family',
      size: 'font-size',
      fontStyle: 'font-style',
      fontWeight: 'font-weight'
    };

    const fontCssParameters: any[] = Object.keys(textSymbolizer)
      .filter((property: any) => property !== 'kind' && fontPropertyMap[property as keyof typeof fontPropertyMap])
      .map((property: any) => {
        if (isGeoStylerFunction(textSymbolizer[property as keyof typeof fontPropertyMap])) {
          const children = geoStylerFunctionToSldFunction(textSymbolizer[
            property as keyof typeof textSymbolizer] as GeoStylerFunction);
          return {
            [CssParameter]: children,
            ':@': {
              '@_name': fontPropertyMap[property as keyof typeof fontPropertyMap]
            }
          };
        } else {
          return {
            [CssParameter]: [{
              '#text': property === 'font'
                ? (textSymbolizer[property as keyof typeof textSymbolizer] as any[])?.[0]
                : textSymbolizer[property as keyof typeof textSymbolizer],
            }],
            ':@': {
              '@_name': fontPropertyMap[property as keyof typeof fontPropertyMap]
            }
          };
        }
      });

    if (fontCssParameters.length > 0) {
      sldTextSymbolizer.push({
        [Font]: fontCssParameters
      });
    }

    if (textSymbolizer.placement === 'line') {
      sldTextSymbolizer.push({
        [LabelPlacement]: [{
          [LinePlacement]: [{
            [PerpendicularOffset]: [{
              '#text': textSymbolizer.perpendicularOffset?.toString()
            }]
          }]
        }]
      });
    } else if (Number.isFinite(textSymbolizer.offset)
      || textSymbolizer.anchor
      || textSymbolizer.rotate !== undefined
      || textSymbolizer.placement === 'point'
    ) {
      const pointPlacement: any = [];
      if (textSymbolizer.offset) {
        pointPlacement.push({
          [Displacement]: [{
            [DisplacementX]: [{
              '#text': textSymbolizer.offset[0].toString()
            }]
          }, {
            [DisplacementY]: [{
              '#text': (-textSymbolizer.offset[1]).toString()
            }]
          }]
        });
      }
      if (textSymbolizer.anchor) {
        pointPlacement.push({
          [AnchorPoint]: [{
            [AnchorPointX]: [{
              '#text': this.getSldAnchorPointFromAnchor(textSymbolizer.anchor,'x').toString()
            }]
          }, {
            [AnchorPointY]: [{
              '#text': this.getSldAnchorPointFromAnchor(textSymbolizer.anchor,'y').toString()
            }]
          }]
        });
      }
      if (textSymbolizer.rotate !== undefined) {
        pointPlacement.push({
          [Rotation]: [{
            '#text': textSymbolizer.rotate.toString()
          }]
        });
      }
      sldTextSymbolizer.push({
        [LabelPlacement]: [{
          [PointPlacement]: pointPlacement
        }]
      });
    }

    if (Number.isFinite(textSymbolizer.haloWidth) || textSymbolizer.haloColor) {
      const halo: any = [];
      const haloFillCssParameter = [];
      if (textSymbolizer.haloWidth) {
        halo.push({
          [Radius]: [{
            '#text': textSymbolizer.haloWidth.toString()
          }]
        });
      }
      if (textSymbolizer.haloColor) {
        haloFillCssParameter.push({
          [CssParameter]: [{
            '#text': textSymbolizer.haloColor,
          }],
          ':@': {
            '@_name': 'fill'
          }
        });
      }
      if (textSymbolizer.haloOpacity) {
        haloFillCssParameter.push({
          [CssParameter]: [{
            '#text': textSymbolizer.haloOpacity,
          }],
          ':@': {
            '@_name': 'fill-opacity'
          }
        });
      }
      if (haloFillCssParameter.length > 0) {
        halo.push({
          [Fill]: haloFillCssParameter
        });
      }
      sldTextSymbolizer.push({
        [Halo]: halo
      });
    }
    if (textSymbolizer.color || Number.isFinite(textSymbolizer.opacity)) {
      const fill = [{
        [CssParameter]: [{
          '#text': textSymbolizer.color || '#000000',
        }],
        ':@': {
          '@_name': 'fill'
        }
      }];
      if (Number.isFinite(textSymbolizer.opacity)) {
        fill.push({
          [CssParameter]: [{
            '#text': `${textSymbolizer.opacity}`,
          }],
          ':@': {
            '@_name': 'fill-opacity'
          },
        });
      }
      sldTextSymbolizer.push({
        [Fill]: fill
      });
    }

    return sldTextSymbolizer;
  }

  /**
   * Get the Label from a TextSymbolizer
   *
   * @param template The Expression<string> representing the label
   */
  getSldLabelFromTextSymbolizer = (template: Expression<string>): any => {
    // TODO: parse GeoStylerFunction
    if (!(typeof template === 'string' || template instanceof String)) {
      return undefined;
    }

    const openingBraces = '{{';
    const closingBraces = '}}';

    const tokens = [];
    let templateReducer = template;

    while (templateReducer.length) {
      let tmpTemplateReducer = templateReducer;
      let tmpPreTemplateLiteral;
      const openingBracesIdx = tmpTemplateReducer.indexOf(openingBraces);
      if (openingBracesIdx === -1) {
        if (templateReducer.includes(' ')) {
          tokens.push({
            'ogc:Literal': [{
              '#cdata': [{
                '#text': templateReducer
              }]
            }]
          });
        } else {
          tokens.push({
            'ogc:Literal': [{
              '#text': templateReducer
            }]
          });
        }
        break;
      }

      if (openingBracesIdx > 0) {
        tmpPreTemplateLiteral = tmpTemplateReducer.slice(0, openingBracesIdx);
      }
      tmpTemplateReducer = tmpTemplateReducer.slice(openingBracesIdx + openingBraces.length);

      const closingBracesIdx = tmpTemplateReducer.indexOf(closingBraces);
      if (closingBracesIdx === -1) {
        if (templateReducer.includes(' ')) {
          tokens.push({
            'ogc:Literal': [{
              '#cdata': [{
                '#text': templateReducer
              }]
            }]
          });
        } else {
          tokens.push({
            'ogc:Literal': [{
              '#text': templateReducer
            }]
          });
        }
        break;
      }
      const propertyName = tmpTemplateReducer.slice(0, closingBracesIdx);
      tmpTemplateReducer = tmpTemplateReducer.slice(closingBracesIdx + closingBraces.length);
      if (tmpPreTemplateLiteral) {
        if (tmpPreTemplateLiteral.includes(' ')) {
          tokens.push({
            'ogc:Literal': [{
              '#cdata': [{
                '#text': tmpPreTemplateLiteral
              }]
            }]
          });
        } else {
          tokens.push({
            'ogc:Literal': [{
              '#text': tmpPreTemplateLiteral
            }]
          });
        }
      }
      tokens.push({
        'ogc:PropertyName': [{
          '#text': propertyName
        }]
      });
      templateReducer = tmpTemplateReducer;
    }

    return tokens;
  };

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style LineSymbolizer.
   *
   * @param lineSymbolizer A geostyler-style LineSymbolizer.
   * @return The object representation of a SLD LineSymbolizer (readable with fast-xml-parser)
   */
  getSldLineSymbolizerFromLineSymbolizer(lineSymbolizer: LineSymbolizer): any[] {
    const CssParameter = this.getTagName('CssParameter');
    const Stroke = this.getTagName('Stroke');
    const GraphicStroke = this.getTagName('GraphicStroke');
    const GraphicFill = this.getTagName('GraphicFill');
    const PerpendicularOffset = this.getTagName('PerpendicularOffset');

    const propertyMap = {
      color: 'stroke',
      width: 'stroke-width',
      opacity: 'stroke-opacity',
      join: 'stroke-linejoin',
      cap: 'stroke-linecap',
      dasharray: 'stroke-dasharray',
      dashOffset: 'stroke-dashoffset'
    };

    const sldLineSymbolizer: any = [];

    const cssParameters: any[] = Object.keys(lineSymbolizer)
      .filter((property: any) => property !== 'kind' && propertyMap[property as keyof typeof propertyMap] &&
        lineSymbolizer[property as keyof typeof lineSymbolizer] !== undefined &&
        lineSymbolizer[property as keyof typeof lineSymbolizer] !== null)
      .map((property: any) => {
        let value = lineSymbolizer[property as keyof typeof lineSymbolizer];
        if (property === 'dasharray') {
          value = lineSymbolizer.dasharray ? lineSymbolizer.dasharray.join(' ') : undefined;

          return {
            [CssParameter]: [{
              '#text': value,
            }],
            ':@': {
              '@_name': propertyMap[property as keyof typeof propertyMap]
            }
          };
        }
        // simple transformation since geostyler-style uses prop 'miter' whereas sld uses 'mitre'
        if (property === 'join' && value === 'miter') {
          value = 'mitre';
        }

        if (isGeoStylerFunction(lineSymbolizer[property as keyof typeof lineSymbolizer])) {
          const children = geoStylerFunctionToSldFunction(lineSymbolizer[
            property as keyof typeof lineSymbolizer] as GeoStylerFunction);
          return {
            [CssParameter]: children,
            ':@': {
              '@_name': propertyMap[property as keyof typeof propertyMap]
            }
          };
        } else {
          return {
            [CssParameter]: [{
              '#text': lineSymbolizer[property as keyof typeof lineSymbolizer],
            }],
            ':@': {
              '@_name': propertyMap[property as keyof typeof propertyMap]
            }
          };
        }

      });

    if (lineSymbolizer?.graphicStroke) {
      if (!Array.isArray(sldLineSymbolizer?.[0]?.[Stroke])) {
        sldLineSymbolizer[0] = { [Stroke]: [] };
      }
      if (lineSymbolizer?.graphicStroke?.kind === 'Mark') {
        const graphicStroke = this.getSldPointSymbolizerFromMarkSymbolizer(lineSymbolizer.graphicStroke);
        sldLineSymbolizer[0][Stroke].push({
          [GraphicStroke]: graphicStroke
        });
      } else if (lineSymbolizer?.graphicStroke?.kind === 'Icon') {
        const graphicStroke = this.getSldPointSymbolizerFromIconSymbolizer(lineSymbolizer.graphicStroke);
        sldLineSymbolizer[0][Stroke].push({
          [GraphicStroke]: graphicStroke
        });
      }
    }

    if (lineSymbolizer?.graphicFill) {
      if (!Array.isArray(sldLineSymbolizer?.[0]?.[Stroke])) {
        sldLineSymbolizer[0] = { [Stroke]: [] };
      }
      if (lineSymbolizer?.graphicFill?.kind === 'Mark') {
        const graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(lineSymbolizer.graphicFill);
        sldLineSymbolizer[0][Stroke].push({
          [GraphicFill]: graphicFill
        });
      } else if (lineSymbolizer?.graphicFill?.kind === 'Icon') {
        const graphicFill = this.getSldPointSymbolizerFromIconSymbolizer(lineSymbolizer.graphicFill);
        sldLineSymbolizer[0][Stroke].push({
          [GraphicFill]: graphicFill
        });
      }
    }

    if (cssParameters.length !== 0) {
      if (!Array.isArray(sldLineSymbolizer?.[0]?.[Stroke])) {
        sldLineSymbolizer[0] = { [Stroke]: [] };
      }
      sldLineSymbolizer[0][Stroke].push(...cssParameters);
    }
    if (lineSymbolizer.perpendicularOffset) {
      sldLineSymbolizer.push({
        [PerpendicularOffset]: [
          {
            '#text': lineSymbolizer.perpendicularOffset
          }
        ]
      });
    }

    if (sldLineSymbolizer.length === 0) {
      sldLineSymbolizer.push({
        [Stroke]: {}
      });
    }

    return sldLineSymbolizer;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style FillSymbolizer.
   *
   * @param fillSymbolizer A geostyler-style FillSymbolizer.
   * @return The object representation of a SLD PolygonSymbolizer (readable with fast-xml-parser)
   */
  getSldPolygonSymbolizerFromFillSymbolizer(fillSymbolizer: FillSymbolizer): any {
    const CssParameter = this.getTagName('CssParameter');
    const Stroke = this.getTagName('Stroke');
    const Fill = this.getTagName('Fill');
    const strokePropertyMap = {
      outlineColor: 'stroke',
      outlineWidth: 'stroke-width',
      outlineOpacity: 'stroke-opacity',
      outlineDasharray: 'stroke-dasharray',
      outlineCap: 'stroke-linecap',
      outlineJoin: 'stroke-linejoin'
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
        graphicFill = this.getSldPointSymbolizerFromMarkSymbolizer(fillSymbolizer.graphicFill);
      } else if (fillSymbolizer?.graphicFill.kind === 'Icon') {
        graphicFill = this.getSldPointSymbolizerFromIconSymbolizer(fillSymbolizer.graphicFill);
      }
    }

    Object.keys(fillSymbolizer)
      .filter((property: any) => property !== 'kind')
      .filter((property: any) => fillSymbolizer[property as keyof typeof fillSymbolizer] !== undefined &&
        fillSymbolizer[property as keyof typeof fillSymbolizer] !== null)
      .forEach((property: any) => {
        if (Object.keys(fillPropertyMap).includes(property)) {
          if (isGeoStylerFunction(fillSymbolizer[property as keyof typeof fillSymbolizer])) {
            const children = geoStylerFunctionToSldFunction(fillSymbolizer[
              property as keyof typeof fillSymbolizer] as GeoStylerFunction);
            fillCssParameters.push({
              [CssParameter]: children,
              ':@': {
                '@_name': fillPropertyMap[property as keyof typeof fillPropertyMap]
              }
            });
          } else {
            fillCssParameters.push({
              [CssParameter]: [{
                '#text': fillSymbolizer[property as keyof typeof fillSymbolizer],
              }],
              ':@': {
                '@_name': fillPropertyMap[property as keyof typeof fillPropertyMap]
              }
            });
          }
        } else if (Object.keys(strokePropertyMap).includes(property)) {

          let transformedValue: string = '';

          if (property === 'outlineDasharray') {
            const paramValue: number[] = fillSymbolizer[property as keyof typeof fillSymbolizer] as number[];
            transformedValue = '';
            paramValue.forEach((dash: number, idx) => {
              transformedValue += dash;
              if (idx < paramValue.length - 1) {
                transformedValue += ' ';
              }
            });
          } else if (property === 'outlineWidth') {
            transformedValue = fillSymbolizer[property as keyof typeof fillSymbolizer] + '';
          } else if (property === 'outlineOpacity') {
            transformedValue = fillSymbolizer[property as keyof typeof fillSymbolizer] + '';
          } else {
            (transformedValue as any) = fillSymbolizer[property as keyof typeof fillSymbolizer];
          }

          if (isGeoStylerFunction(fillSymbolizer[property as keyof typeof fillSymbolizer])) {
            const children = geoStylerFunctionToSldFunction((fillSymbolizer as any)[property]);
            strokeCssParameters.push({
              [CssParameter]: children,
              ':@': {
                '@_name': strokePropertyMap[property as keyof typeof strokePropertyMap]
              }
            });
          } else {
            strokeCssParameters.push({
              [CssParameter]: [{
                '#text': transformedValue,
              }],
              ':@': {
                '@_name': strokePropertyMap[property as keyof typeof strokePropertyMap]
              }
            });
          }

        }
      });

    const polygonSymbolizer: any = [];
    if (fillCssParameters.length > 0 || graphicFill) {
      const fillArray: any[] = [];
      const graphicFillPadding = fillSymbolizer.graphicFillPadding;
      if (graphicFillPadding) {
        this.pushGeoServerVendorOption(polygonSymbolizer, 'graphic-margin', graphicFillPadding.join(' '));
      }
      polygonSymbolizer.push({ [Fill]: fillArray });
      if (fillCssParameters.length > 0) {
        fillArray.push(...fillCssParameters);
      }
      if (graphicFill) {
        fillArray.push({ GraphicFill: graphicFill });
      }
    }

    if (strokeCssParameters.length > 0) {
      polygonSymbolizer.push({
        [Stroke]: strokeCssParameters
      });
    }

    return polygonSymbolizer;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style RasterSymbolizer.
   *
   * @param rasterSymbolizer A geostyler-style RasterSymbolizer.
   * @return The object representation of a SLD RasterSymbolizer (readable with fast-xml-parser)
   */
  getSldRasterSymbolizerFromRasterSymbolizer(rasterSymbolizer: RasterSymbolizer): any {
    const sldRasterSymbolizer: any = [];
    if (rasterSymbolizer.opacity !== undefined) {
      sldRasterSymbolizer.push({});
      sldRasterSymbolizer[0].Opacity = [{
        '#text': rasterSymbolizer.opacity
      }];
    }

    let colorMap: any;
    if (rasterSymbolizer.colorMap) {
      colorMap = this.getSldColorMapFromColorMap(rasterSymbolizer.colorMap);
      if (colorMap?.[0]) {
        sldRasterSymbolizer.push({
          ColorMap: colorMap
        });
      }
    }

    let channelSelection: any;
    if (rasterSymbolizer.channelSelection) {
      channelSelection = this.getSldChannelSelectionFromChannelSelection(rasterSymbolizer.channelSelection);
      if (channelSelection?.[0]) {
        sldRasterSymbolizer.push({
          ChannelSelection: channelSelection
        });
      }
    }

    let contrastEnhancement: any;
    if (rasterSymbolizer.contrastEnhancement) {
      contrastEnhancement = this.getSldContrastEnhancementFromContrastEnhancement(rasterSymbolizer.contrastEnhancement);
      if (contrastEnhancement?.[0]) {
        sldRasterSymbolizer.push({
          ContrastEnhancement: contrastEnhancement
        });
      }
    }

    return sldRasterSymbolizer;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style ColorMap.
   *
   * @param colorMap A geostyler-style ColorMap.
   * @return The object representation of a SLD ColorMap (readable with fast-xml-parser)
   */
  getSldColorMapFromColorMap(colorMap: ColorMap): any {
    const sldColorMap: any[] = [];
    // parse colorMap.type
    if (colorMap.type) {
      const type = colorMap.type;
      (sldColorMap as any)[':@'] = {
        '@_type': type
      };
    }
    // parse colorMap.extended
    if (colorMap.extended !== undefined) {
      const extended = colorMap.extended.toString();
      if (!(sldColorMap as any)[':@']) {
        (sldColorMap as any)[':@'] = {};
      }
      (sldColorMap as any)[':@']['@_extended'] = extended;
    }
    // parse colorMap.colorMapEntries
    if (colorMap.colorMapEntries && colorMap.colorMapEntries.length > 0) {
      const colorMapEntries: any[] = colorMap.colorMapEntries.map((entry: ColorMapEntry) => {
        const result: any = {
          ColorMapEntry: [],
          ':@': {}
        };
        if (entry.color) {
          result[':@']['@_color'] = entry.color;
        }
        if (typeof entry.quantity !== 'undefined') {
          result[':@']['@_quantity'] = entry.quantity.toString();
        }
        if (entry.label) {
          result[':@']['@_label'] = entry.label;
        }
        if (typeof entry.opacity !== 'undefined') {
          result[':@']['@_opacity'] = entry.opacity.toString();
        }
        return result;
        // remove empty colorMapEntries
      }).filter((entry: any) => Object.keys(entry).length > 0);
      sldColorMap.push(...colorMapEntries);
    }
    return sldColorMap;
  }

  /**
   * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style ChannelSelection.
   *
   * @param channelSelection A geostyler-style ChannelSelection.
   * @return The object representation of a SLD ChannelSelection (readable with fast-xml-parser)
   */
  getSldChannelSelectionFromChannelSelection(channelSelection: ChannelSelection): any {
    const propertyMap = {
      redChannel: 'RedChannel',
      blueChannel: 'BlueChannel',
      greenChannel: 'GreenChannel',
      grayChannel: 'GrayChannel'
    };
    const keys = Object.keys(channelSelection);
    const sldChannelSelection: any[] = [];
    keys.forEach((key: string) => {
      const channel: any = [];
      // parse sourceChannelName
      const sourceChannelName = (channelSelection?.[key as keyof ChannelSelection] as any)?.sourceChannelName;
      const channelName = propertyMap[key as keyof typeof propertyMap];
      // parse contrastEnhancement
      const contrastEnhancement = (channelSelection?.[key as keyof ChannelSelection] as any)?.contrastEnhancement;
      if (sourceChannelName || contrastEnhancement) {
        if (sourceChannelName) {
          channel.push({
            SourceChannelName: [{
              '#text': sourceChannelName
            }]
          });
        }
        if (contrastEnhancement) {
          channel.push({
            ContrastEnhancement: this.getSldContrastEnhancementFromContrastEnhancement(contrastEnhancement)
          });
        }
        sldChannelSelection.push({
          [channelName]: channel
        });
      }
    });

    return sldChannelSelection;
  }

  /**
     * Get the SLD Object (readable with fast-xml-parser) from a geostyler-style ContrastEnhancement.
     *
     * @param contrastEnhancement A geostyler-style ContrastEnhancement.
     * @return The object representation of a SLD ContrastEnhancement (readable with fast-xml-parser)
     */
  getSldContrastEnhancementFromContrastEnhancement(contrastEnhancement: ContrastEnhancement): any {
    const sldContrastEnhancement: any = [];
    const enhancementType = contrastEnhancement?.enhancementType;
    if (enhancementType === 'normalize') {
      // parse normalize
      sldContrastEnhancement.push({
        Normalize: []
      });
    } else if (enhancementType === 'histogram') {
      // parse histogram
      sldContrastEnhancement.push({
        Histogram: []
      });
    }
    // parse gammaValue
    if (contrastEnhancement.gammaValue !== undefined) {
      sldContrastEnhancement.push({
        GammaValue: [{
          '#text': contrastEnhancement.gammaValue
        }]
      });
    }
    return sldContrastEnhancement;
  }

  checkForUnsupportedProperties(geoStylerStyle: Style): UnsupportedProperties | undefined {
    const capitalizeFirstLetter = (a: string) => a[0].toUpperCase() + a.slice(1);
    const unsupportedProperties: UnsupportedProperties = {};
    geoStylerStyle.rules.forEach(rule => {
      // ScaleDenominator and Filters are completely supported so we just check for symbolizers
      rule.symbolizers.forEach(symbolizer => {
        const key = capitalizeFirstLetter(`${symbolizer.kind}Symbolizer`);
        const value = (this.unsupportedProperties?.Symbolizer as any)?.[key];
        if (value) {
          if (typeof value === 'string' || value instanceof String) {
            if (!unsupportedProperties.Symbolizer) {
              unsupportedProperties.Symbolizer = {};
            }
            (unsupportedProperties.Symbolizer as any)[key] = value;
          } else {
            Object.keys(symbolizer).forEach(property => {
              if (value[property]) {
                const propValue = new RegExp(`["']${symbolizer[property as keyof typeof symbolizer]}["']`);
                if (value[property].support === 'partial' && (propValue.test(value[property].info)))
                {
                  return;
                }
                if (!unsupportedProperties.Symbolizer) {
                  unsupportedProperties.Symbolizer = {};
                }
                if (!unsupportedProperties.Symbolizer[key as keyof typeof unsupportedProperties.Symbolizer]) {
                  (unsupportedProperties.Symbolizer as any)[key] = {};
                }
                (unsupportedProperties.Symbolizer as any)[key][property] = value[property];
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
