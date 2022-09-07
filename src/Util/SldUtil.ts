import { SldVersion } from '../SldStyleParser';

export function getChildren(arr: any[], tagName: string) {
  return arr
    .filter(obj => Object.keys(obj).includes(tagName));
}

export function getChild(arr: any[], tagName: string) {
  return arr
    .find(obj => Object.keys(obj).includes(tagName));
}

export function getParameterValue(elements: any[], parameter: string, sldVersion: SldVersion) {
  const paramKey = sldVersion === '1.0.0' ? 'CssParameter' : 'SvgParameter';
  const element = elements
    .filter(obj => Object.keys(obj).includes(paramKey))
    .find(obj => obj[':@']['@_name'] === parameter);
  return element?.[paramKey]?.[0]?.['#text'];
}

export function isSymbolizer(obj: any) {
  return Object.keys(obj).some(key => key.endsWith('Symbolizer'));
}

export function getAttributes(obj: any) {
  return Object.keys(obj).filter(key => key.startsWith('@'));
}

export function getAttribute(obj: any, attributeName: string) {
  return obj[`@_${attributeName}`];
}
