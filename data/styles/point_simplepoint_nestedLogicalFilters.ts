import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  'name': 'Simple Point Filter',
  'rules': [{
    'filter': ['&&',
      ['||',
        ['==', 'ID', 1],
        ['==', 'ID', 2]
      ],
      ['||',
        ['==', 'STREET', 'Main'],
        ['==', 'STREET', 'Time square'],
        ['&&',
          ['>=', 'HOUSENO', 1909],
          ['<=', 'HOUSENO', 19909]
        ]
      ]
    ],
    'name': 'Test',
    'scaleDenominator': {
      'max': 20000,
      'min': 10000
    },
    'symbolizer': [{
      'color': '#FF0000',
      'kind': 'Mark',
      'wellKnownName': 'Circle',
      'radius': 6,
      'strokeColor': '#000000',
      'strokeWidth': 2
    }]
  }]
};

export default pointSimplePoint;
