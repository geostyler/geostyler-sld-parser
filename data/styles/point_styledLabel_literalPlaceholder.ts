import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Styled Label',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Text',
      color: '#000000',
      label: '{{name}} entity',
      font: ['Arial'],
      size: 12,
      offset: [0, 5],
      haloColor: '#000000',
      haloWidth: 5,
      rotate: 45,
      fontStyle: 'normal',
      fontWeight: 'bold'
    }]
  }]
};

export default pointStyledLabel;
