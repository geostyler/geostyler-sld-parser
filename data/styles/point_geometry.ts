import { Style } from 'geostyler-style';

const style: Style = {
  name: 'point_geometry',
  rules: [
    {
      name: 'Point at the end of a line geom',
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'square',
          color: '#FF0000',
          radius: 3,
          geometry: {
             name: 'custom',
             fnName: 'endPoint',
             args: [{
                 name: 'property',
                 args: ['shape']
             }],
          }
        }
      ]
    }
  ]
};

export default style;
