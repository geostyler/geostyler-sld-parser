import { Style } from 'geostyler-style';

const style: Style = {
  name: 'default_polygon',
  rules: [
    {
      name: 'Gray Polygon with Black Outline',
      symbolizers: [
        {
          kind: 'Fill',
          color: '#AAAAAA',
          outlineColor: '#000000',
          outlineWidth: 1
        }
      ]
    }
  ]
};

export default style;
