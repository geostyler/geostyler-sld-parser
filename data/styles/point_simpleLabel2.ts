import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'Styled Label',
  rules: [
    {
      name: 'Rule 1',
      symbolizers: [
        {
          kind: 'Text',
          label: 'Your Label',
          color: '#2476ad',
          opacity: 1,
          size: 12
        }
      ]
    }
  ]
};

export default pointStyledLabel;
