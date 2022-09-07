import {
  Style
} from 'geostyler-style';

/**
 * Class helping to transform from SLD 1.0.0 to SLD 1.1.0 / Synbology Encoding
 *
 * @class SymbologyEncoder
 */
export class SymbologyEncoder {

  /**
   * Methods returns Symbology Encoding / SLD 1.1.0 from given GeoStyler
   * style Object
   * @param geoStylerStyle A GeoStyler-Style Style.
   * @param rules The array of rules
   * @param symbolizerUnits The units to use for symbolizers
   * @returns The object representation of a SLD 1.1 Style
   * (readable with xml2js)
   */
  static getSymbologyEncoding(geoStylerStyle: Style, rules: any[],
    symbolizerUnits: string): any {
    const setTags = (rulez: any[], isFilterElement: boolean) => {
      if (!(rulez instanceof Array)) {
        rulez = [rulez];
      }
      rulez.forEach((rule: any) => {
        const keys = Object.keys(rule);
        for (const key of keys) {
          const val = rule[key][0];
          // handle renaming of ogc filter attributes
          if (key.toLowerCase() === 'filter') {
            delete Object.assign(rule, {['ogc:' + key]: rule[key]})[key];
            setTags(rule['ogc:' + key], true);
            continue;
          }
          if (isFilterElement) {
            if (key.toLowerCase().indexOf('property') > -1) {
              rule[key].forEach((el: any) => {
                if (el.$ && el.$.escape) {
                  // rename escape attribute
                  el.$.escapeChar = el.$.escape;
                  delete el.$.escape;
                }
              });
            }
          }
          // do not change special attribute handlers or ogc namespaces
          if (key === '$' || key  === '_' ||
            key.toLowerCase().indexOf('ogc:') > -1 ||
            (rule[key].$ && rule[key].$.xmlns)) {
            if (val instanceof Object) {
              setTags([rule[key]], isFilterElement);
            }
            continue;
          }
          // add uom attribute to symbolizers
          if (key.toLowerCase().indexOf('symbolizer') > -1) {
            val.$ = {
              uom: 'http://www.opengeospatial.org/se/units/' +
              symbolizerUnits
            };
          }

          if (key.toLowerCase() === 'cssparameter') {
            // change naming of css and svg parameters
            delete Object.assign(rule, {['se:SvgParameter']: rule[key]})[key];
          } else if (key.toLowerCase() === 'function') {
            delete Object.assign(rule, {['se:' + key]: rule[key]})[key];
            setTags(val, isFilterElement);
            continue;
          } else if (key.toLowerCase() === 'literal') {
            delete Object.assign(rule, {['ogc:' + key]: rule[key]})[key];
          } else if (key.toLowerCase() === 'propertyname') {
            delete Object.assign(rule, {['ogc:' + key]: rule[key]})[key];
          } else if (!isFilterElement) {
            // rename all other tags to include the "se" namespace
            delete Object.assign(rule, {['se:' + key]: rule[key]})[key];
          }
          // recursive call ourselves
          if (val instanceof Object) {
            setTags([val], isFilterElement);
          }
        }
      });
    };

    setTags(rules, false);

    return {
      StyledLayerDescriptor: {
        '$': {
          'version': '1.1.0',
          'xsi:schemaLocation': 'http://www.opengis.net/sld StyledLayerDescriptor.xsd',
          'xmlns': 'http://www.opengis.net/sld',
          'xmlns:ogc': 'http://www.opengis.net/ogc',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          'xmlns:se': 'http://www.opengis.net/se'
        },
        'NamedLayer': [{
          'se:Name': [geoStylerStyle.name || ''],
          'UserStyle': [{
            'se:Name': [geoStylerStyle.name || ''],
            'se:FeatureTypeStyle': [{
              'se:Rule': rules
            }]
          }]
        }]
      }
    };
  }
}

export default SymbologyEncoder;
