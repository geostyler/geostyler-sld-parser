import { Style } from 'geostyler-style';

const style: Style = {
  name: 'default_point',
  rules: [
    {
      name: 'Red Square Point',
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'square',
          color: '#FF0000',
          radius: 3
        }
      ]
    }
  ]
};


export default style;
