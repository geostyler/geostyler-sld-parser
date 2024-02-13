import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Restricted areas',
  rules: [
    {
      name: 'RedFill RedOutline',
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FF0000',
          fillOpacity: 0.7,
          outlineColor: '#AA0000',
          outlineWidth: 1
        }
      ]
    }
  ]
};

export default style;
