import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  type: 'Point',
  rules: [
    {
      filter: ['&&',
        ['==', 'NAME', 'New York'],
        ['!',
          ['>', 'POPULATION', 100000]
        ]
      ],
      scaleDenominator: {
        min: 10000,
        max: 20000
      },
      symbolizer: {
        kind: 'Circle',
        color: '#FF0000',
        radius: 6,
        strokeColor: '#000000',
        strokeWidth: 2
      }
    }
  ]
};

export default pointSimplePoint;
