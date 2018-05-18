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
} from 'geostyler-style';

import {
  parseString,
  Builder
} from 'xml2js';

import {
  DOMParser
} from 'xmldom';

import {
  isString as _isString,
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
   * Get the GeoStyler-Style StyleType from the sldString. It searches for the
   * first appearance of a SLD Symbolizer. Supported Symbolizers are:
   * 'PointSymbolizer',
   * 'LineSymbolizer',
   * 'TextSymbolizer',
   * 'PolygonSymbolizer'
   *
   * @param {string} sldString The SLD string
   * @return {StyleType} The StyleType of the parsed SLD string
   */
  getStyleTypeFromSldString(sldString: string): StyleType {
    const symbolizers = [
      'PointSymbolizer',
      'LineSymbolizer',
      'TextSymbolizer',
      'PolygonSymbolizer'
    ];
    const parser = new DOMParser();
    const dom = parser.parseFromString(sldString);
    let styleType: StyleType;
    const foundSymbolizers = symbolizers.filter(symb => {
      return dom.getElementsByTagName(symb).length > 0;
    });
    switch (foundSymbolizers[0]) {
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
   * Creates a GeoStyler-Style Filter from a given operator name and the js
   * object representation (created with xml2js) of the SLD Filter.
   *
   * @param {string} sldOperatorName The Name of the SLD Filter Operator
   * @param {object} sldFilter The SLD Filter
   * @return {Filter} The GeoStyler-Style Filter
   */
  getFilterFromOperatorAndComparison(sldOperatorName: string, sldFilter: any): Filter {
    let filter: Filter;
    const negationOperator: string = 'Not';
    const combinationMap = {
      And: '&&',
      Or: '||',
      PropertyIsBetween: '&&'
    };
    const comparisonMap = {
      PropertyIsEqualTo: '=',
      PropertyIsNotEqualTo: '!=',
      PropertyIsLike: '*=',
      PropertyIsLessThan: '<',
      PropertyIsLessThanOrEqualTo: '<=',
      PropertyIsGreaterThan: '>',
      PropertyIsGreaterThanOrEqualTo: '>=',
      PropertyIsNull: '='
    };

    if (Object.keys(comparisonMap).includes(sldOperatorName)) {
      const comparisonOperator: ComparisonOperator = comparisonMap[sldOperatorName];
      const property: string = sldFilter.PropertyName[0];
      let value = sldFilter.Literal[0];
      if (sldOperatorName === 'PropertyIsNull') {
        value = null;
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
    } else if (Object.keys(combinationMap).includes(sldOperatorName)) {
      const combinationOperator: CombinationOperator = combinationMap[sldOperatorName];
      const filters: Filter[] = Object.keys(sldFilter).map((op) => {
        return this.getFilterFromOperatorAndComparison(op, sldFilter[op][0]);
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (sldOperatorName === negationOperator) {
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
    const operator = Object.keys(sldFilter)[0];
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
    const externalGrahphic = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0]');
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
    } else if (externalGrahphic) {
      const onlineResource = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0].OnlineResource[0]');
      let iconSymbolizer: IconSymbolizer = <IconSymbolizer> {
        kind: 'Icon',
        image: onlineResource.$['xlink:href']
      };
      const opacity = _get(sldSymbolizer, 'Graphic[0].Opacity[0]');
      const size = _get(sldSymbolizer, 'Graphic[0].Size[0]');
      if (opacity) {
        iconSymbolizer.opacity = opacity;
      }
      if (size) {
        iconSymbolizer.size = size;
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
          lineSymbolizer.dasharray = value;
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
   * @param {object} sldObject The object representation (created with xml2js)
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
            let rule: Rule = <Rule> {};
            rule = {
              symbolizer
            };
            if (filter) {
              rule.filter = filter;
            }
            if (scaleDenominator) {
              rule.scaleDenominator = scaleDenominator;
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
   * @param {object} sldObject The object representation (created with xml2js)
   * @return {Style} The GeoStyler-Style Style
   */
  sldObjectToGeoStylerStyle(sldObject: object, type: StyleType): Style {
    const rules = this.getRulesFromSldObject(sldObject);
    return {
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
      const styleType: StyleType = this.getStyleTypeFromSldString(sldString);
      try {
        parseString(sldString, options, (err, result) => {
          if (err) {
            reject(`Error while parsing sldString: ${err}`);
          }
          const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(result, styleType);
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
   *
   * @param geoStylerStyle
   */
  geoStylerStyleToSldObject(geoStylerStyle: Style): any {
    const rules: any[] = this.getSldRulesFromRules(geoStylerStyle.rules);
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
          'Name': [
            'Simple Point'
          ],
          'UserStyle': [{
            'Title': [
              'SLD Cook Book: Simple Point'
            ],
            'FeatureTypeStyle': [{
              'Rule': rules
            }]
          }]
        }]
      }
    };
  }

  getSldRulesFromRules(rules: Rule[]): any {
    return rules.map((rule: Rule) => {
      let sldRule: any = {};
      const symbolizer = this.getSldSymbolizerFromSymbolizer(rule.symbolizer);
      const symbolizerName = Object.keys(symbolizer)[0];
      if (symbolizer && symbolizerName) {
        sldRule[symbolizerName] = symbolizer[symbolizerName];
      }
      if (rule.filter) {
        const filter = this.getSldFilterFromFilter(rule.filter);
        sldRule.filter = filter;
      }
      if (rule.scaleDenominator) {
        const scaleDenominator = this.getSldScaleDenominatorFromScaleDenominator(rule.scaleDenominator);
        sldRule.scaleDenominator = scaleDenominator;
      }
      return sldRule;
    });
  }

  getSldSymbolizerFromSymbolizer(symbolizer: Symbolizer): any {
    let sldSymbolizer: any = {};
    switch (symbolizer.kind) {
      case 'Circle':
        sldSymbolizer = this.getSldPointSymbolizerFromCircleSymbolizer(symbolizer);
        break;
      default:
        break;
    }
    return sldSymbolizer;
  }

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

  getSldFilterFromFilter(filter: Filter): any[] {
    return [{}];
  }

  getSldScaleDenominatorFromScaleDenominator(scaleDenominator: ScaleDenominator): any[] {
    return [{}];
  }

}

export default SldStyleParser;
