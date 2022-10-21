import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Default Polygon',
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
