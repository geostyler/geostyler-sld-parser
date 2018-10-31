import { Style } from 'geostyler-style';

const pointSimpleSlash: Style = {
  'name': 'Simple Slash',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Mark',
      'wellKnownName': 'shape://slash',
      'color': '#FF0000',
      'radius': 5,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1
    }]
  }]
};

export default pointSimpleSlash;
