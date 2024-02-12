import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Simple Text',
  rules: [{
    name: '',
    symbolizers: [{
      color: '#000000',
      opacity: 1,
      kind: 'Text',
      label: 'myText',
      placement: 'line'
    }]
  }]
};

export default pointStyledLabel;
