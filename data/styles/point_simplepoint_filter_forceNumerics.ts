import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  'name': 'Simple Point Filter',
  'rules': [{
    'filter': ['&&',
      ['==', 'NAME', 'New York'],
      ['==', 'TEST', null],
      ['*=', 'TEST2', '*York*'],
      ['*=', 'TEST1', '*New*'],
      ['!', ['>', 'POPULATION', 100000]],
      ['||',
        ['==', 'TEST2', 1],
        ['==', 'TEST2', 2]
      ]
    ],
    'name': 'Small populated New Yorks',
    'scaleDenominator': {
      'max': 20000,
      'min': 10000
    },
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'Circle',
      'color': '#FF0000',
      'radius': 3,
      'strokeColor': '#000000',
      'strokeWidth': 2
    }]
  }]
};

export default pointSimplePoint;
