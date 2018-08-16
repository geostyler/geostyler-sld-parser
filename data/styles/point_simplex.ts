import { Style } from 'geostyler-style';

const pointSimpleX: Style = {
  'name': 'Simple X',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizer': [{
      'kind': 'Mark',
      'wellKnownName': 'X',
      'points': 4,
      'color': '#FF0000',
      'radius': 10,
      'radius2': 0,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'angle': 45
    }]
  }]
};

export default pointSimpleX;
