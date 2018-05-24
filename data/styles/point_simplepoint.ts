import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  name: 'Simple Point',
  type: 'Point',
  rules: [{
    name: '',
    symbolizer: {
      kind: 'Circle',
      color: '#FF0000',
      radius: 6
    }
  }]
};

export default pointSimplePoint;
