import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Green line',
  rules: [
    {
      name: 'Green Line',
      symbolizers: [
        {
          kind: 'Line',
          color: '#319738',
          width: 2
        }
      ]
    }
  ]
};


export default style;
