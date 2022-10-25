import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Red Line',
  rules: [
    {
      name: 'Roads',
      symbolizers: [
        {
          kind: 'Line',
          color: '#AA3333',
          width: 2
        }
      ]
    }
  ]
};

export default style;
