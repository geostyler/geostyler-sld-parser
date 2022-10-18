import { SldVersion } from '../SldStyleParser';

/**
 * Get all child objects with a given tag name.
 *
 * @param elements An array of objects as created by the fast-xml-parser.
 * @param tagName The tagname to get.
 * @returns An array of objects as created by the fast-xml-parser.
 */
export function getChildren(elements: any[], tagName: string): any[] {
  return elements?.filter(obj => Object.keys(obj).includes(tagName));
}

/**
 * Get the child object with a given tag name.
 *
 * @param elements An array of objects as created by the fast-xml-parser.
 * @param tagName The tagname to get.
 * @returns An object as created by the fast-xml-parser.
 */
export function getChild(elements: any[], tagName: string): any {
  return elements?.find(obj => Object.keys(obj).includes(tagName));
}

/**
 * Get the value of a Css-/SvgParameter.
 *
 * @param elements An array of objects as created by the fast-xml-parser.
 * @param parameter The parameter name to get.
 * @param sldVersion The sldVersion to distinguish if CssParameter or SvgParameter is used.
 * @returns The string value of the searched parameter.
 */
export function getParameterValue(elements: any[], parameter: string, sldVersion: SldVersion): string | undefined {
  if (!elements) {
    return undefined;
  }
  const paramKey = sldVersion === '1.0.0' ? 'CssParameter' : 'SvgParameter';
  const element = elements
    .filter(obj => Object.keys(obj)?.includes(paramKey))
    .find(obj => obj?.[':@']?.['@_name'] === parameter);
  return element?.[paramKey]?.[0]?.['#text'];
}

/**
 * Get the attribute value of an object.
 *
 * @param obj The object to check.
 * @param name The name of the attribute
 * @returns The value of the requested parameter (if available)
 */
export function getAttribute(obj: any, name: string): any | undefined {
  return obj?.[':@']?.[`@_${name}`];
}

/**
 * Determine if a fast-xml-parser object is a symbolizer representation.
 *
 * @param obj The object to check.
 * @returns Whether the passed object is a symbolizer representation or not.
 */
export function isSymbolizer(obj: any): boolean {
  return Object.keys(obj).some(key => key.endsWith('Symbolizer'));
}

/**
 * Generic get function which tries to get the nested value of the given object or array.
 * It contains some SLD specific handling and tries to be smart but keep the syntax easy.
 * It always takes the first child of an array if no index was specified in the path argument.
 * e.g.
 *   Get text value: get(sldSymbolizer, 'Graphic.Mark.WellKnownName.#text')
 *   Get an attribute value: get(sldSymbolizer, 'Graphic.ExternalGraphic.OnlineResource.@xlink:href')
 *   Get an Css-/SvgParameter value: get(sldSymbolizer, 'Graphic.Mark.Fill.$fill-opacity', '1.1.0')
 *   Use with an index: get(sldObject, 'StyledLayerDescriptor.NamedLayer[1].UserStyle.Title.#text')
 *
 * @param obj A part of the parser result of the fast-xml-parser.
 * @param path The path to get the value from.
 * @param sldVersion The SLD version to use.
 * @returns
 */
export function get(obj: any, path: string, sldVersion?: SldVersion): any | undefined {
  const parts = path.split(/\.(.*)/s);
  let key = parts[0];
  const rest = parts[1];
  let target = obj;
  let index = 0;
  // handle queries for attributes
  if (rest?.startsWith('@')) {
    target = getChildren(obj, key)[index];
    return getAttribute(target, rest.substring(1));
  }
  if (Array.isArray(obj)) {
    // handle queries for CssParameter/SvgParameter
    if (key.startsWith('$') && sldVersion) {
      return getParameterValue(target, key.substring(1), sldVersion);
    }
    // handle queries with specified indexes
    if(key.endsWith(']')) {
      index = Number(key.split('[')[1].split(']')[0]);
      key = key.split('[')[0];
    }
    target = getChildren(obj, key)[index];
  }
  if (!target) {
    return undefined;
  }
  if (rest) {
    return get(target[key], rest, sldVersion);
  }
  return target[key];
}

/**
 * Returns the keys of an object where the value is equal to the passed in
 * value.
 *
 * @param object The object to get the key from.
 * @param value The value to get the matching key from.
 * @return The matching keys.
 */
export function keysByValue(object: any, value: any): string[] {
  return Object.keys(object).filter(key => object[key] === value);
}
