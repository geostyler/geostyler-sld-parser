import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Simple Text',
  rules: [{
    name: '',
    symbolizers: [{
      color: '#000000',
      kind: 'Text',
      label: 'myText',
      placement: 'line',    
    },
    {
      kind: 'Line',
      perpendicularOffset: 12
    }],
  }]
};

export default pointStyledLabel;
