import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Simple Line',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37],
      cap: 'round',
      join: 'miter',
      graphicFill: {
        kind: 'Icon',
        image: 'http://geoserver.org/img/geoserver-logo.png',
        size: 10,
        rotate: 90
      }
    }]
  }]
};

export default lineSimpleLine;
