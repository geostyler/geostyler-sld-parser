import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Styled Label',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Text',
      label: 'myText'
    }]
  }]
};

export default pointStyledLabel;
