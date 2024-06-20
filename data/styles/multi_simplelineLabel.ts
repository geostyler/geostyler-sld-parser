import { Style } from 'geostyler-style';

const multiSimplelineLabel: Style = {
  name: 'Simple Line with label',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37]
    }, {
      kind: 'Text',
      color: '#000000',
      opacity: 1,
      label: '{{name}}',
      font: ['Arial'],
      size: 12,
      offset: [0, -5],
      fontStyle: 'normal',
      fontWeight: 'bold',
      placement: 'point'
    }]
  }]
};

export default multiSimplelineLabel;
