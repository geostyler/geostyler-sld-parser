import { Style } from 'geostyler-style';

const burg: Style = {
  name: 'A small red flag',
  rules: [
    {
      name: 'Red flag',
      symbolizers: [
        {
          kind: 'Icon',
          image: 'burg02.svg',
          size: 20
        }
      ]
    }
  ]
};

export default burg;
