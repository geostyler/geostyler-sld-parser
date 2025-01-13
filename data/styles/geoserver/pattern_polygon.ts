import { Style } from 'geostyler-style';

const style: Style = {
  name: 'pattern_polygon',
  rules: [
    {
      name: 'Polygon with spaced purple circle symbols',
      symbolizers: [
        {
          kind: 'Fill',
          graphicFill: {
            kind: 'Mark',
            wellKnownName: 'circle',
            color: '#880088',
            radius: 3
          },
          graphicFillPadding: [4, 6, 2, 3],
        }
      ]
    }
  ]
};

export default style;
