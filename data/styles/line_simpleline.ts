import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line',
  type: 'Line',
  rules: [{
    name: '',
    symbolizer: {
      kind: 'Line',
      color: '#000000',
      width: 3
    }
  }]
};

export default lineSimpleLine;
