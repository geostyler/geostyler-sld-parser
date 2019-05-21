import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  'name': 'Simple Point Filter',
  'rules': [{
    'filter': [
      '*=',
      ['FN_strMatches', 'year', /^( )??2019,.*/],
      true
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
