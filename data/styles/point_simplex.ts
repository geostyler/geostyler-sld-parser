import { Style } from 'geostyler-style';

const pointSimpleX: Style = {
  'name': 'Simple X',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'x',
      'color': '#FF0000',
      'radius': 5,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1
    }]
  }]
};

export default pointSimpleX;
