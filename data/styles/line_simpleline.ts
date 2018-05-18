import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  type: 'Line',
  rules: [
    {
      symbolizer: {
        kind: 'Line',
        color: '#000000',
        width: 3
      }
    }
  ]
};

export default lineSimpleLine;
