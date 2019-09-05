import { Style } from 'geostyler-style';

const polygonTransparentPolygon: Style = {
  name: 'Transparent Polygon',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Fill',
      color: '#000080',
      fillOpacity: 0.5,
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
      outlineOpacity: 0.9,
      outlineDasharray: [1, 0]
    }]
  }]
};

export default polygonTransparentPolygon;
