import {
  Filter,
  StyleParser,
  Style,
  Rule,
  ComparisonOperator,
  CombinationOperator,
  StyleType
} from 'geostyler-style';

import {
  parseString
} from 'xml2js';

import {
  DOMParser
} from 'xmldom';

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
   * @param sldObject
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
            // const scaleDenominator: ScaleDenominator = this.getScaleDenominatorFromRule();
            // const symbolizer: Symbolizer = this.getSymbolizerFromRule();
            const rule = {
              filter,
              // scaleDenominator,
              // symbolizer
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
