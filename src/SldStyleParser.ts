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
} from 'geostyler-style';

import {
  parseString
} from 'xml2js';

import {
  DOMParser
} from 'xmldom';

import {
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
    const symbolizer = foundSymbolizers[0].replace('Symbolizer', '');
    styleType = symbolizer === 'Text' ? 'Point' : <StyleType> symbolizer;
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
      const value = sldOperatorName === 'PropertyIsNull' ? null : sldFilter.Literal[0];
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
  getFilterFromRule(sldRule: any): Filter {
    const {
      Filter: sldFilters
    } = sldRule;
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
  getScaleDenominatorFromRule(sldRule: any): ScaleDenominator {
    return {
      min: parseFloat(sldRule.MinScaleDenominator[0]),
      max: parseFloat(sldRule.MaxScaleDenominator[0])
    };
  }

  /**
   * Get the GeoStyler-Style PointSymbolizer from an SLD Symbolizer.
   *
   * The opacity of the Symbolizer is taken from the <Graphic>.
   *
   * @param {object} sldSymbolizer The SLD Symbolizer
   * @return {PointSymbolizer} The GeoStyler-Style PointSymbolizer
   */
  getPointSymbolizerSldSymbolizer(sldSymbolizer: any): PointSymbolizer {
    let pointSymbolizer: PointSymbolizer = <PointSymbolizer> {};
    const wellKnownName = _get(sldSymbolizer, 'Graphic[0].Mark[0].WellKnownName[0]');
    const externalGrahphic = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0]');
    if (wellKnownName === 'circle') {
      const strokeParams = _get(sldSymbolizer, 'Graphic[0].Mark[0].Stroke[0].CssParameter') || [];
      const circleSymbolizer: CircleSymbolizer = {
        kind: 'Circle',
        opacity: _get(sldSymbolizer, 'Graphic[0].Opacity[0]'), // Could also come from fill-opacity
        radius: _get(sldSymbolizer, 'Graphic[0].Size[0]'),
        color: _get(sldSymbolizer, 'Graphic[0].Mark[0].Fill[0].CssParameter[0]._')
      };
      strokeParams.forEach((param: any) => {
        switch (param.$.name) {
          case 'stroke':
            circleSymbolizer.strokeColor = param._;
            break;
          case 'stroke-width':
            circleSymbolizer.strokeWidth = param._;
            break;
          default:
            break;
        }
      });
      pointSymbolizer = circleSymbolizer;
    } else if (externalGrahphic) {
      const onlineResource = _get(sldSymbolizer, 'Graphic[0].ExternalGraphic[0].OnlineResource[0]');
      const iconSymbolizer: IconSymbolizer = {
        kind: 'Icon',
        opacity: _get(sldSymbolizer, 'Graphic[0].Opacity[0]'),
        size: _get(sldSymbolizer, 'Graphic[0].Size[0]'),
        image: onlineResource.$['xlink:href']
      };
      pointSymbolizer = iconSymbolizer;
    } else {
      throw new Error(`PointSymbolizer can not be parsed. Only "circle" is supported
      as WellKnownName.`);
    }

    return pointSymbolizer;
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
        symbolizer = this.getPointSymbolizerSldSymbolizer(sldSymbolizer);
        break;
      case 'LineSymbolizer':
        symbolizer.kind = 'Line';
        break;
      case 'TextSymbolizer':
        symbolizer.kind = 'Text';
        break;
      case 'PolygonSymbolizer':
        symbolizer.kind = 'Fill';
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
            const filter: Filter = this.getFilterFromRule(sldRule);
            const scaleDenominator: ScaleDenominator = this.getScaleDenominatorFromRule(sldRule);
            const symbolizer: Symbolizer = this.getSymbolizerFromRule(sldRule);
            const rule = {
              filter,
              scaleDenominator,
              symbolizer
            };
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
      const styleType: StyleType | undefined  = this.getStyleTypeFromSldString(sldString);
      if (styleType) {
        parseString(sldString, options, (err, result) => {
          if (err) {
            reject(`Error while parsing sldString: ${err}`);
          }
          const geoStylerStyle: Style = this.sldObjectToGeoStylerStyle(result, styleType);
          resolve(geoStylerStyle);
        });
      } else {
        reject('Could not determine style type.');
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
  writeStyle(geoStylerStyle: Style): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // TODO
      resolve();
    });
  }

}

export default SldStyleParser;
