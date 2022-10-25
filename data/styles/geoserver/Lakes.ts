import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Blue lake',
  rules: [
    {
      name: 'name',
      symbolizers: [
        {
          kind: 'Fill',
          color: '#4040C0',
          fillOpacity: 1,
          outlineCap: 'butt',
          outlineJoin: 'miter',
          outlineColor: '#000000',
          outlineWidth: 1,
          outlineOpacity: 1
        }
      ]
    }
  ]
};

export default style;
