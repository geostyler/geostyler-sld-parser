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
        kind: 'Mark',
        wellKnownName: 'Circle',
        color: '#FF0000'
      }
    }]
  }]
};

export default polygonGraphicFill;
