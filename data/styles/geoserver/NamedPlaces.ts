import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Default Styler',
  rules: [
    {
      name: 'Ashton',
      filter: [
        '==',
        'NAME',
        'Ashton'
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#AAAAAA',
          outlineColor: '#000000'
        }
      ]
    },
    {
      name: 'Goose Island',
      filter: [
        '==',
        'NAME',
        'Goose Island'
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFFFFF',
          outlineColor: '#000000'
        }
      ]
    }
  ]
};

export default style;
