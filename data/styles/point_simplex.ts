import { Style } from 'geostyler-style';

const pointSimpleX: Style = {
  'name': 'Simple X',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'X',
      'color': '#FF0000',
      'radius': 10,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1
    }]
  }]
};

export default pointSimpleX;
