import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Styled Label',
  rules: [{
    name: '',
    symbolizers: [{
      color: '#000000',
      opacity: 1,
      kind: 'Text',
      label: 'myText'
    }]
  }]
};

export default pointStyledLabel;
