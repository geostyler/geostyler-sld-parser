import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  'name': 'Simple Point Categorize Function',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'circle',
      'color': {
        'type': 'functioncall',
        'name': 'Categorize',
        'args': [{
          'type': 'property',
          'name': 'TEST_PROPERTY'
        }, {
          'type': 'literal',
          'value': 10
        }, {
          'type': 'property',
          'name': 'TEST_PROPERTY'
        }, {
          'type': 'literal',
          'value': 6
        }, {
          'type': 'literal',
          'value': 2500
        }, {
          'type': 'literal',
          'value': 1
        }]
      }
    }]
  }]
};

export default pointSimplePoint;
