import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Simple Streams',
  rules: [
    {
      name: 'Blue Line',
      symbolizers: [
        {
          kind: 'Line',
          color: '#003EBA',
          width: 2
        }
      ]
    }
  ]
};

export default style;
