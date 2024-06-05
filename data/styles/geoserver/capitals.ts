import { Style } from 'geostyler-style';

const style: Style = {
  name: 'capitals',
  rules: [
    {
      name: 'Capitals',
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          color: '#FFFFFF',
          strokeColor:'#000000',
          strokeWidth: 2,
          opacity: 1,
          radius: 3
        }
      ]
    }
  ]
};

export default style;
