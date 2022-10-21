import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Border-less gray fill',
  rules: [
    {
      name: '',
      symbolizers: [
        {
          kind: 'Fill',
          color: '#DDDDDD',
          fillOpacity: 1
        }
      ]
    }
  ]
};

export default style;
