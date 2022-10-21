import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Blue Line',
  rules: [
    {
      name: 'Blue Line',
      symbolizers: [
        {
          kind: 'Line',
          color: '#0000FF'
        }
      ]
    }
  ]
};


export default style;
