import { Style } from 'geostyler-style';

const polygonGraphicFill: Style = {
  name: 'Polygon Graphic Fill',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Fill',
      color: '#000080',
      outlineColor: '#FFFFFF',
      outlineWidth: 2,
      outlineDasharray: [1, 0],
      graphicFill: {
        kind: 'Icon',
        image: 'http://geoserver.org/img/geoserver-logo.png',
        size: 10,
        rotate: 90
      }
    }]
  }]
};

export default polygonGraphicFill;
