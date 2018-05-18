import { Style } from 'geostyler-style';

const polygonTransparentPolygon: Style = {
  type: 'Fill',
  rules: [
    {
      symbolizer: {
        kind: 'Fill',
        color: '#000080',
        opacity: 0.5,
        outlineColor: '#FFFFFF'
      }
    }
  ]
};

export default polygonTransparentPolygon;
