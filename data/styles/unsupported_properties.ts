import { Style } from 'geostyler-style';

const unsupportedProperties: Style = {
  name: 'OL Style',
  rules: [
    {
      name: 'OL Style Rule 0',
      symbolizers: [{
        kind: 'Fill',
        color: '#F1337F',
        opacity: 0.5
      }]
    }
  ]
};

export default unsupportedProperties;
