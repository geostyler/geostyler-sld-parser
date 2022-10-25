import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Styled Label',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Text',
      color: '#000000',
      opacity: 1,
      label: '{{name}}',
      font: ['Arial'],
      size: 12,
      offset: [0, 5],
      haloColor: '#000000',
      haloWidth: 5,
      haloOpacity: 1,
      rotate: 45,
      fontStyle: 'normal',
      fontWeight: 'bold'
    }]
  }]
};

export default pointStyledLabel;
