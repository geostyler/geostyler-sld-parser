import { Style } from 'geostyler-style';

const pointSimpleCross: Style = {
  'name': 'Simple Cross',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'Cross',
      'points': 4,
      'color': '#FF0000',
      'radius': 10,
      'radius2': 0,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'rotate': 45
    }]
  }]
};

export default pointSimpleCross;
