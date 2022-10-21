import { Style } from 'geostyler-style';

const functionProperty: Style = {
  name: 'Function Property',
  rules: [
    {
      name: 'Function Property Rule 0',
      filter: [
        '==',
        {
          name: 'between',
          args: [{
            name: 'property',
            args: ['testprop']
          }, 0, 1]
        },
        true
      ],
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#FF0000',
        radius: 10
      }]
    }, {
      name: 'Function Property Rule 1',
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#FF0000',
        radius: 6
      }]
    }
  ]
};

export default functionProperty;
