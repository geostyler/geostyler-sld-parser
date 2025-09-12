import { Style } from 'geostyler-style';

const lineGroundUnitWidth: Style = {
  name: 'Simple Line',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3500,
      widthUnit: 'm'
    }]
  }]
};

export default lineGroundUnitWidth;
