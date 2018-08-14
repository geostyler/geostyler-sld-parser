import { Style } from 'geostyler-style';

const polygonTransparentPolygon: Style = {
  name: 'Transparent Polygon',
  rules: [{
    name: '',
    symbolizer: [{
      kind: 'Fill',
      color: '#000080',
      opacity: 0.5,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
      outlineDasharray: [1, 0]
    }]
  }]
};

export default polygonTransparentPolygon;
