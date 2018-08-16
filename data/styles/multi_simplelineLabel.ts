import { Style } from 'geostyler-style';

const multiSimplelineLabel: Style = {
  name: 'Simple Line with label',
  rules: [{
    name: '',
    symbolizer: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37]
    }, {
      kind: 'Text',
      color: '#000000',
      field: 'name',
      font: ['Arial'],
      size: 12,
      offset: [0, 5]
    }]
  }]
};

export default multiSimplelineLabel;
