import {
  Filter,
  StyleParser,
  Style,
  Rule,
  ComparisonOperator,
  CombinationOperator,
  StyleType,
  ScaleDenominator,
  PointSymbolizer,
  Symbolizer,
  CircleSymbolizer,
  IconSymbolizer,
  LineSymbolizer,
  FillSymbolizer,
  TextSymbolizer,
  ComparisonFilter,
} from 'geostyler-style';

import {
  parseString,
  Builder
} from 'xml2js';

import {
  isString as _isString,
  isNumber as _isNumber,
  get as _get
} from 'lodash';

/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style StyleParser interface.
 *
 * @class SldStyleParser
 * @implements StyleParser
 */
class SldStyleParser implements StyleParser {

  /**
   * The name of the SLD Style Parser.
   */
  public static title = 'SLD Style Parser';

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
   * Get the GeoStyler-Style StyleType from the sldObject. It searches for the
   * first appearance of a SLD Symbolizer. Supported Symbolizers are:
   * 'PointSymbolizer',
   * 'LineSymbolizer',
   * 'TextSymbolizer',
   * 'PolygonSymbolizer'
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {StyleType} The StyleType of the parsed SLD string
   */
  getStyleTypeFromSldObject(sldObject: any): StyleType {
    const symbolizers = [
      'PointSymbolizer',
      'LineSymbolizer',
      'TextSymbolizer',
      'PolygonSymbolizer'
    ];
    let styleType: StyleType;
    const ruleObject = _get(sldObject, 'StyledLayerDescriptor.NamedLayer[0]' +
      '.UserStyle[0].FeatureTypeStyle[0].Rule[0]');

    if (!ruleObject) {
      throw new Error('StyleType could not be detected');
    }

    const ruleKeys = Object.keys(ruleObject);
    const symbolizer = ruleKeys.find(key => symbolizers.includes(key));
    switch (symbolizer) {
      case 'PointSymbolizer':
      case 'TextSymbolizer':
        styleType = 'Point';
        break;
      case 'PolygonSymbolizer':
        styleType = 'Fill';
        break;
      case 'LineSymbolizer':
        styleType = 'Line';
        break;
      default:
        throw new Error('StyleType could not be detected');
    }
    return styleType;
  }

  /**
   * Get the name for the Style from the SLD Object. Returns the Title of the UserStyle
   * if defined or the Name of the NamedLayer if defined or an empty string.
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {string} The name to be used for the GeoStyler Style Style
   */
  getStyleNameFromSldObject(sldObject: any): string {
    const userStyleTitle = _get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].UserStyle[0].Title[0]');
    const namedLayerName = _get(sldObject, 'StyledLayerDescriptor.NamedLayer[0].Name[0]');
    return userStyleTitle ? userStyleTitle
      : namedLayerName ? namedLayerName : '';
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
      const property: string = sldFilter.PropertyName[0];
      let value = null;
      if (sldOperatorName !== 'PropertyIsNull') {
        value = sldFilter.Literal[0];
      }
      if (!Number.isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }
      if (_isString(value)) {
        const lowerValue = value.toLowerCase();
        if (lowerValue === 'false') {value = false; }
        if (lowerValue === 'true') {value = true; }
      }
      filter =  [
        comparisonOperator,
        property,
        value
      ];
    } else if (Object.keys(SldStyleParser.combinationMap).includes(sldOperatorName)) {
      const combinationOperator: CombinationOperator = SldStyleParser.combinationMap[sldOperatorName];
      let filters: Filter[] = [];
      Object.keys(sldFilter).forEach((op) => {
        if (sldFilter[op].length === 1) {
          filters.push(this.getFilterFromOperatorAndComparison(op, sldFilter[op][0]));
        } else {
          sldFilter[op].forEach((el: any) => {
            filters.push(this.getFilterFromOperatorAndComparison(op, el));
          });
        }
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (Object.keys(SldStyleParser.negationOperatorMap).includes(sldOperatorName)) {
      const negationOperator = SldStyleParser.negationOperatorMap[sldOperatorName];
      const negatedOperator = Object.keys(sldFilter)[0];
      const negatedComparison = sldFilter[negatedOperator][0];
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
    const sldFilter = sldFilters[0];
    const operator = Object.keys(sldFilter).find((key, index) => {
      return key !== '$';
    });
    if (!operator) {
      return;
    }
    const comparison = sldFilter[operator][0];
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
    let scaleDenominator: ScaleDenominator = <ScaleDenominator> {};
    if (sldRule.MinScaleDenominator) {
      scaleDenominator.min = parseFloat(sldRule.MinScaleDenominator[0]);
    }
    if (sldRule.MaxScaleDenominator) {
      scaleDenominator.max = parseFloat(sldRule.MaxScaleDenominator[0]);
    }

    return (scaleDenominator.min || scaleDenominator.max)
      ? scaleDenominator
      : undefined;
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
    const wellKnownName = _get(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]');
    const externalGraphic = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0]');
    if (wellKnownName === 'circle') {
      let circleSymbolizer: CircleSymbolizer = <CircleSymbolizer> {
        kind: 'Circle'
      };
      const strokeParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Stroke[0].CssParameter') || [];
      const opacity = _get(sldSymbolizer, 'Graphic[0].Opacity[0]');
      const radius = _get(sldSymbolizer, 'Graphic[0].Size[0]');
      const color = _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].CssParameter[0]._');
      if (opacity) {
        circleSymbolizer.opacity = opacity;
      }
      if (radius) {
        circleSymbolizer.radius = parseFloat(radius);
      }
      if (color ) {
        circleSymbolizer.color = color;
      }
      strokeParams.forEach((param: any) => {
        switch (param.$.name) {
          case 'stroke':
            circleSymbolizer.strokeColor = param._;
            break;
          case 'stroke-width':
            circleSymbolizer.strokeWidth = parseFloat(param._);
            break;
          default:
            break;
        }
      });
      pointSymbolizer = circleSymbolizer;
    } else if (externalGraphic) {
      const onlineResource = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0].OnlineResource[0]');
      let iconSymbolizer: IconSymbolizer = <IconSymbolizer> {
        kind: 'Icon',
        image: onlineResource.$['xlink:href']
      };
      const opacity = _get(sldSymbolizer, 'Graphic[0].Opacity[0]');
      const size = _get(sldSymbolizer, 'Graphic[0].Size[0]');
      const rotate = _get(sldSymbolizer, 'Graphic[0].Rotation[0]');
      if (opacity) {
        iconSymbolizer.opacity = opacity;
      }
      if (size) {
        iconSymbolizer.size = parseInt(size, 10);
      }
      if (rotate) {
        iconSymbolizer.rotate = parseInt(rotate, 10);
      }
      pointSymbolizer = iconSymbolizer;
    } else {
      throw new Error(`PointSymbolizer can not be parsed. Only "circle" is supported
      as WellKnownName.`);
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
    let lineSymbolizer: LineSymbolizer = <LineSymbolizer> {
      kind: 'Line'
    };
    const cssParameters = _get(sldSymbolizer, 'Stroke[0].CssParameter') || [];
    if (cssParameters.length < 1) {
      throw new Error(`LineSymbolizer can not be parsed. No CssParameters detected.`);
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
          lineSymbolizer.join = value;
          break;
        case 'stroke-linecap':
          lineSymbolizer.cap = value;
          break;
        case 'stroke-dasharray':
          const dashStringAsArray = value.split(',').map((a: string) => parseFloat(a));
          lineSymbolizer.dasharray = dashStringAsArray;
          break;
        case 'stroke-dashoffset':
          // Currently not supported by GeoStyler Style
          break;
        default:
          break;
      }
    });
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
    let fillSymbolizer: FillSymbolizer = <FillSymbolizer> {
      kind: 'Fill'
    };
    const fillCssParameters = _get(sldSymbolizer, 'Fill[0].CssParameter') || [];
    const strokeCssParameters = _get(sldSymbolizer, 'Stroke[0].CssParameter') || [];

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
          fillSymbolizer.opacity = parseFloat(value);
          break;
        default:
          break;
      }
    });
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
        fillSymbolizer.outlineWidth = parseInt(value, 10);
      } else if (name === 'stroke-dasharray') {
        const outlineDasharrayStr = value.split(' ');
        const outlineDasharray: number[] = [];
        outlineDasharrayStr.forEach((dashStr: string) => {
          outlineDasharray.push(parseInt(dashStr, 10));
        });
        fillSymbolizer.outlineDasharray = outlineDasharray;
      }
    });
    return fillSymbolizer;
  }

  /**
   * Get the GeoStyler-Style TextSymbolizer from an SLD Symbolizer.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {TextSymbolizer} The GeoStyler-Style TextSymbolizer
   */
  getTextSymbolizerFromSldSymbolizer(sldSymbolizer: any): TextSymbolizer {
    let textSymbolizer: TextSymbolizer = <TextSymbolizer> {
      kind: 'Text'
    };
    const fontCssParameters = _get(sldSymbolizer, 'Font[0].CssParameter') || [];
    const field = _get(sldSymbolizer, 'Label[0].PropertyName[0]');
    const color = _get(sldSymbolizer, 'Fill[0].CssParameter[0]._');
    if (field) {
      textSymbolizer.field = field;
    }
    if (color) {
      textSymbolizer.color = color;
    }
    const displacement = _get(sldSymbolizer, 'LabelPlacement[0].PointPlacement[0].Displacement[0]');
    if (displacement) {
      const x = displacement.DisplacementX[0];
      const y = displacement.DisplacementY[0];
      textSymbolizer.offset = [
        x ? parseFloat(x) : 0,
        y ? parseFloat(y) : 0,
      ];
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
          // Currently not supported by GeoStyler Style
          break;
        case 'font-weight':
          // Currently not supported by GeoStyler Style
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
   * Get the GeoStyler-Style Symbolizer from an SLD Rule.
   *
   * Currently only one symbolizer per rule is supported.
   *
   * @param {object} sldRule The SLD Rule
   * @return {Symbolizer} The GeoStyler-Style Symbolizer
   */
  getSymbolizerFromRule(sldRule: any): Symbolizer {
    let symbolizer: Symbolizer = <Symbolizer> {};
    const sldSymbolizerName: string = Object.keys(sldRule).filter(key => key.endsWith('Symbolizer'))[0];
    const sldSymbolizer = sldRule[sldSymbolizerName][0];
    switch (sldSymbolizerName) {
      case 'PointSymbolizer':
        symbolizer = this.getPointSymbolizerFromSldSymbolizer(sldSymbolizer);
        break;
      case 'LineSymbolizer':
        symbolizer = this.getLineSymbolizerFromSldSymbolizer(sldSymbolizer);
        break;
      case 'TextSymbolizer':
        symbolizer = this.getTextSymbolizerFromSldSymbolizer(sldSymbolizer);
        break;
      case 'PolygonSymbolizer':
        symbolizer = this.getFillSymbolizerFromSldSymbolizer(sldSymbolizer);
        break;
      default:
        throw new Error('Failed to parse SymbolizerKind from SldRule');
    }

    return symbolizer;
  }

  /**
   * Get the GeoStyler-Style Rule from an SLD Object (created with xml2js).
   *
   * Currently only one symbolizer per rule is supported.
   *
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {Rule} The GeoStyler-Style Rule
   */
  getRulesFromSldObject(sldObject: any): Rule[] {
    const layers = sldObject.StyledLayerDescriptor.NamedLayer;

    let rules: Rule[] = [];
    layers.forEach((layer: any) => {
      layer.UserStyle.forEach((userStyle: any) => {
        userStyle.FeatureTypeStyle.forEach((featureTypeStyle: any) => {
          featureTypeStyle.Rule.forEach((sldRule: any) => {
            const filter: Filter | undefined = this.getFilterFromRule(sldRule);
            const scaleDenominator: ScaleDenominator | undefined = this.getScaleDenominatorFromRule(sldRule);
            const symbolizer: Symbolizer = this.getSymbolizerFromRule(sldRule);
            const name = sldRule.Title ? sldRule.Title[0]
              : (sldRule.Name ? sldRule.Name[0] : '');
            let rule: Rule = <Rule> {
              name
            };
            if (filter) {
              rule.filter = filter;
            }
            if (scaleDenominator) {
              rule.scaleDenominator = scaleDenominator;
            }
            if (symbolizer) {
              rule.symbolizer = symbolizer;
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
   * @param {object} sldObject The SLD object representation (created with xml2js)
   * @return {Style} The GeoStyler-Style Style
   */
  sldObjectToGeoStylerStyle(sldObject: object): Style {
    const type = this.getStyleTypeFromSldObject(sldObject);
    const rules = this.getRulesFromSldObject(sldObject);
    const name = this.getStyleNameFromSldObject(sldObject);
    return {
      name,
      type,
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
  readStyle(sldString: string): Promise<Style> {
    return new Promise<Style>((resolve, reject) => {
      const options = {
        tagNameProcessors: [this.tagNameProcessor]
      };
      try {
        parseString(sldString, options, (err, result) => {
          if (err) {
            reject(`Error while parsing sldString: ${err}`);
          }
          const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(result);
          resolve(geoStylerStyle);
        });
      } catch (error) {
        reject(error);
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
  writeStyle(geoStylerStyle: Style): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      try {
        const builder = new Builder();
        const sldObject = this.geoStylerStyleToSldObject(geoStylerStyle);
        const sldString = builder.buildObject(sldObject);
        resolve(sldString);
      } catch (error) {
        reject(error);
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
        rule.Filter.$ = {'xmlns': 'http://www.opengis.net/ogc'};
      }
    });
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
          'Name': [geoStylerStyle.name],
          'UserStyle': [{
            'Name': [geoStylerStyle.name],
            'Title': [geoStylerStyle.name],
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
        const {min, max} = rule.scaleDenominator;
        if (_isNumber(min)) {
          sldRule.MinScaleDenominator = [min.toString()];
        }
        if (_isNumber(max)) {
          sldRule.MaxScaleDenominator = [max.toString()];
        }
      }
      const symbolizer = this.getSldSymbolizerFromSymbolizer(rule.symbolizer);
      const symbolizerName = Object.keys(symbolizer)[0];
      if (symbolizer && symbolizerName) {
        sldRule[symbolizerName] = symbolizer[symbolizerName];
      }
      return sldRule;
    });
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style Symbolizer.
   *
   * @param {Symbolizer} symbolizer A GeoStyler-Style Symbolizer.
   * @return {object} The object representation of a SLD Symbolizer (readable with xml2js)
   */
  getSldSymbolizerFromSymbolizer(symbolizer: Symbolizer): any {
    let sldSymbolizer: any = {};
    switch (symbolizer.kind) {
      case 'Circle':
        sldSymbolizer = this.getSldPointSymbolizerFromCircleSymbolizer(symbolizer);
        break;
      case 'Icon':
        sldSymbolizer = this.getSldPointSymbolizerFromIconSymbolizer(symbolizer);
        break;
      case 'Text':
        sldSymbolizer = this.getSldTextSymbolizerFromTextSymbolizer(symbolizer);
        break;
      case 'Line':
        sldSymbolizer = this.getSldLineSymbolizerFromLineSymbolizer(symbolizer);
        break;
      case 'Fill':
        sldSymbolizer = this.getSldPolygonSymbolizerFromFillSymbolizer(symbolizer);
        break;
      default:
        break;
    }
    return sldSymbolizer;
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style TextSymbolizer.
   *
   * @param {TextSymbolizer} textSymbolizer A GeoStyler-Style TextSymbolizer.
   * @return {object} The object representation of a SLD TextSymbolizer (readable with xml2js)
   */
  getSldTextSymbolizerFromTextSymbolizer(textSymbolizer: TextSymbolizer): any {
    let sldTextSymbolizer: any = [{
      'Label': [{
        'PropertyName': [
          textSymbolizer.field
        ]
      }]
    }];
    const fontPropertyMap = {
      font: 'font-family',
      size: 'font-size'
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

    if (textSymbolizer.offset) {
      sldTextSymbolizer[0].LabelPlacement = [{
        'PointPlacement': [{
          'Displacement': [{
            'DisplacementX': [
              textSymbolizer.offset[0]
            ],
            'DisplacementY': [
              textSymbolizer.offset[1]
            ]
          }]
        }]
      }];
    }

    if (textSymbolizer.color) {
      sldTextSymbolizer[0].Fill = [{
        'CssParameter': [{
          '_': textSymbolizer.color,
          '$': {
            'name': 'fill'
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
      outlineDasharray: 'stroke-dasharray'
    };
    const fillPropertyMap = {
      color: 'fill',
      opacity: 'fill-opacity'
    };
    let strokeCssParameters: any[] = [];
    let fillCssParameters: any[] = [];

    Object.keys(fillSymbolizer)
      .filter((property: any) => property !== 'kind')
      .forEach((property: any) => {
        if (Object.keys(strokePropertyMap).includes(property)) {

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
          } else {
            transformedValue = fillSymbolizer[property];
          }

          strokeCssParameters.push({
            '_': transformedValue,
            '$': {
              'name': strokePropertyMap[property]
            }
          });

        } else if (Object.keys(fillPropertyMap).includes(property)) {
          fillCssParameters.push({
            '_': fillSymbolizer[property],
            '$': {
              'name': fillPropertyMap[property]
            }
          });
        }
      });

    let polygonSymbolizer: any = [{}];
    if (strokeCssParameters.length > 0) {
      polygonSymbolizer[0].Stroke = [{
        'CssParameter': strokeCssParameters
      }];
    }
    if (fillCssParameters.length > 0) {
      polygonSymbolizer[0].Fill = [{
        'CssParameter': fillCssParameters
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
      dasharray: 'stroke-dasharray'
    };

    const cssParameters: any[] = Object.keys(lineSymbolizer)
      .filter((property: any) => property !== 'kind' && propertyMap[property])
      .map((property: any) => {
        return {
          '_': lineSymbolizer[property],
          '$': {
            'name': propertyMap[property]
          }
        };
      });

    return {
      'LineSymbolizer': [{
        'Stroke': [{
          'CssParameter': cssParameters
        }]
      }]
    };
  }

  /**
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style CircleSymbolizer.
   *
   * @param {CircleSymbolizer} circleSymbolizer A GeoStyler-Style CircleSymbolizer.
   * @return {object} The object representation of a SLD PointSymbolizer with a
   * "circle" Mark (readable with xml2js)
   */
  getSldPointSymbolizerFromCircleSymbolizer(circleSymbolizer: CircleSymbolizer): any {
    let mark: any[] = [{
      'WellKnownName': [
        'circle'
      ]
    }];
    if (circleSymbolizer.color) {
      mark[0].Fill = [{
        'CssParameter': [{
          '_': circleSymbolizer.color,
          '$': {
            'name': 'fill'
          }
        }]
      }];
    }
    if (circleSymbolizer.strokeColor || circleSymbolizer.strokeWidth) {
      mark[0].Stroke = [{}];
      const strokeCssParameters = [];
      if (circleSymbolizer.strokeColor) {
        strokeCssParameters.push({
          '_': circleSymbolizer.strokeColor,
          '$': {
            'name': 'stroke'
          }
        });
      }
      if (circleSymbolizer.strokeWidth) {
        strokeCssParameters.push({
          '_': circleSymbolizer.strokeWidth,
          '$': {
            'name': 'stroke-width'
          }
        });
      }
      mark[0].Stroke[0].CssParameter = strokeCssParameters;
    }

    let graphic: any[] = [{
      'Mark': mark
    }];
    if (circleSymbolizer.radius) {
      graphic[0].Size = circleSymbolizer.radius;
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
    const onlineResource = {
      '$': {
        'xlink:type': 'simple',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'xlink:href': iconSymbolizer.image
      }
    };
    var graphic: any[] = [{
        'ExternalGraphic': [{
          'OnlineResource': onlineResource,
          'Format': 'image/png'// TODO: This has to be a property on the IconSymbolizer
        }]
    }];
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
   * Get the SLD Object (readable with xml2js) from an GeoStyler-Style ComparisonFilter.
   *
   * @param {ComparisonFilter} comparisonFilter A GeoStyler-Style ComparisonFilter.
   * @return {object} The object representation of a SLD Filter Expression with a
   * comparison operator (readable with xml2js)
   */
  getSldComparisonFilterFromComparisonFilter(comparisonFilter: ComparisonFilter): any[] {
    const sldComparisonFilter: any = <ComparisonFilter> {};
    const operator = comparisonFilter[0];
    const key = comparisonFilter[1];
    const value = comparisonFilter[2];

    const sldOperators: string[] = SldStyleParser.keysByValue(SldStyleParser.comparisonMap, operator);
    let sldOperator: string = (sldOperators.length > 1 && value === null)
      ? sldOperators[1] : sldOperators[0];

    if (sldOperator === 'PropertyIsNull') {
      // empty, selfclosing Literals are not valid in a propertyIsNull filter
      sldComparisonFilter[sldOperator] = [{
        'PropertyName': [key]
      }];
    } else if (sldOperator === 'PropertyIsLike') {
      sldComparisonFilter[sldOperator] = [{
        '$': {
          'wildCard': '*',
          'singleChar': '.',
          'escape': '!'
        },
        'PropertyName': [key],
        'Literal': [value]
      }];
    } else {
      sldComparisonFilter[sldOperator] = [{
        'PropertyName': [key],
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
    const [
      operator,
      ...args
    ] = <Array<any>> filter;

    if (Object.values(SldStyleParser.comparisonMap).includes(operator)) {
      sldFilter = this.getSldComparisonFilterFromComparisonFilter(<ComparisonFilter> filter);
    } else if (Object.values(SldStyleParser.combinationMap).includes(operator)) {
      const sldOperators: string[] = SldStyleParser.keysByValue(SldStyleParser.combinationMap, operator);
      // TODO Implement logic for "PropertyIsBetween" filter
      const combinator = sldOperators[0];
      sldFilter[combinator] = [{}];
      args.forEach((subFilter, subFilterIdx) => {
        const sldSubFilter = this.getSldFilterFromFilter(subFilter);
        const filterName = Object.keys(sldSubFilter)[0];
        const isCombinationFilter = (fName: string) => ['And', 'Or'].includes(fName);

        if (subFilter[0] === '||' || subFilter[0] === '&&') {
          if (isCombinationFilter(filterName)) {
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
    } else if (Object.values(SldStyleParser.negationOperatorMap).includes(operator)) {
      sldFilter.Not = args.map(subFilter => this.getSldFilterFromFilter(subFilter));
    }
    return sldFilter;
  }

}

export default SldStyleParser;
