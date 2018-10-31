import { Style } from 'geostyler-style';

const pointSimpleSquare: Style = {
  'name': 'Simple Square',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'Square',
      'color': '#FF0000',
      'radius': 5,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1
    }]
  }]
};

export default pointSimpleSquare;
