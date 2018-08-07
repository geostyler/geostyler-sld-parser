import { Style } from 'geostyler-style';

const pointSimpleSquare: Style = {
  'name': 'Simple Square',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizer': {
      'kind': 'Mark',
      'wellKnownName': 'Square',
      'points': 4,
      'color': '#FF0000',
      'radius': 10,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'rotation': 45
    }
  }],
  'type': 'Point'
};

export default pointSimpleSquare;
