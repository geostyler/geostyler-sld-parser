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
 *
 */
class SldStyleParser implements StyleParser {

  /**
   * Strip all namespaces from the tags.
   *
   * @param name
   */
  tagNameProcessor(name: string) {
    const prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    return name.replace(prefixMatch, '');
  }

  /**
   *
   * @param sldString
   */
  getStyleTypeFromSldString(sldString: string): StyleType | undefined  {
    const symbolizers = [
      'PointSymbolizer',
      'LineSymbolizer',
      'TextSymbolizer',
      'PolygonSymbolizer'
    ];
    const parser = new DOMParser();
    const dom = parser.parseFromString(sldString);
    let styleType: StyleType;
    const foundSymbolizers = symbolizers.filter(symbolizer => {
      return dom.getElementsByTagName(symbolizer).length > 0;
    });
    if (foundSymbolizers.length === 1) {
      const symbolizer = foundSymbolizers[0].replace('Symbolizer', '');
      styleType = symbolizer === 'Text' ? 'Point' : <StyleType> symbolizer;
      return styleType;
    }
    return;
  }

  /**
   *
   * @param operator
   * @param comparison
   */
  getFilterFromOperatorAndComparison(operator: string, comparison: any): Filter {
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

    if (Object.keys(comparisonMap).includes(operator)) {
      const comparisonOperator: ComparisonOperator = comparisonMap[operator];
      const property: string = comparison.PropertyName[0];
      const value = operator === 'PropertyIsNull' ? null : comparison.Literal[0];
      filter =  [
        comparisonOperator,
        property,
        value
      ];
    } else if (Object.keys(combinationMap).includes(operator)) {
      const combinationOperator: CombinationOperator = combinationMap[operator];
      const filters: Filter[] = Object.keys(comparison).map((op) => {
        return this.getFilterFromOperatorAndComparison(op, comparison[op][0]);
      });
      filter = [
        combinationOperator,
        ...filters
      ];
    } else if (operator === negationOperator) {
      const negatedOperator = Object.keys(comparison)[0];
      const negatedComparison = comparison[negatedOperator][0];
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
   *
   * @param sldRule
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
   *
   * @param sldRule
   */
  getScaleDenominatorFromRule(sldRule: any): ScaleDenominator {
    return {
      min: parseFloat(sldRule.MinScaleDenominator[0]),
      max: parseFloat(sldRule.MaxScaleDenominator[0])
    };
  }

  /**
   *
   * @param sldRule
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
   *
   * @param sldRule
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
   *
   * @param sldObject
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
   *
   * @param {object} sldObject
   */
  sldObjectToGeoStylerStyle(sldObject: object, type: StyleType): Style {
    const rules = this.getRulesFromSldObject(sldObject);
    return {
      type,
      rules
    };
  }

  /**
   *
   * @param {string} sldString
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
   *
   * @param inputData
   */
  writeStyle(geoStylerStyle: Style): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      // TODO
      resolve();
    });

    return promise;
  }

}

export default SldStyleParser;
