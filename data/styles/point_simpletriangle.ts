import { Style } from 'geostyler-style';

const pointSimpleTriangle: Style = {
  'name': 'Simple Triangle',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'Triangle',
      'color': '#FF0000',
      'radius': 5,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'rotate': 45
    }]
  }]
};

export default pointSimpleTriangle;
