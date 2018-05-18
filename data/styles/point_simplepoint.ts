import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  type: 'Point',
  rules: [
    {
      symbolizer: {
        kind: 'Circle',
        color: '#FF0000',
        radius: 6
      }
    }
  ]
};

export default pointSimplePoint;
