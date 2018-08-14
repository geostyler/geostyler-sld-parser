import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line',
  rules: [{
    name: '',
    symbolizer: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      graphicStroke: {
        kind: 'Circle',
        color: '#FF0000',
        radius: 7
      }
    }]
  }]
};

export default lineSimpleLine;
