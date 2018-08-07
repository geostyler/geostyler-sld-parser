import { Style } from 'geostyler-style';

const pointSimpleCross: Style = {
  'name': 'Simple Cross',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizer': {
      'kind': 'Mark',
      'wellKnownName': 'Cross',
      'points': 4,
      'color': '#FF0000',
      'radius1': 10,
      'radius2': 0,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'rotation': 45
    }
  }],
  'type': 'Point'
};

export default pointSimpleCross;
