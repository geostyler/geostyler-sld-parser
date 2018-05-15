import {
  StyleParser,
  Style
} from 'geostyler-style';

/**
 *
 */
class SldStyleParser implements StyleParser {
  /**
   *
   * @param inputStyle
   */
  readStyle(inputStyle: any): Promise<Style> {
    const promise = new Promise<Style>((resolve, reject) => {
      // TODO
      resolve();
    });

    return promise;
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
