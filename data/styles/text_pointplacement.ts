import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Simple Text',
  rules: [{
    name: '',
    symbolizers: [{
      color: '#000000',
      kind: 'Text',
      label: 'myText',
      placement: 'point'
    }]
  }]
};

export default pointStyledLabel;
