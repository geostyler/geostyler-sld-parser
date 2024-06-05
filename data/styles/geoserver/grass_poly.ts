import { Style } from 'geostyler-style';

const style: Style = {
  name: 'grass',
  rules: [
    {
      name: 'Grass',
      symbolizers: [
        {
          kind: 'Fill',
          graphicFill: {
            kind: 'Icon',
            image: 'grass_fill.png',
            opacity: 1
          },
          outlineColor: '#FF0000',
          outlineWidth: 1
        }
      ]
    }
  ]
};

export default style;
