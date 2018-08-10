import { Style } from 'geostyler-style';

const pointSimpleStar: Style = {
  'name': 'Simple Star',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizer': {
      'kind': 'Mark',
      'wellKnownName': 'Star',
      'points': 5,
      'color': '#FF0000',
      'radius': 10,
      'radius2': 4,
      'strokeColor': '#000000',
      'strokeWidth': 2,
      'opacity': 1,
      'rotate': 45
    }
  }],
  'type': 'Point'
};

export default pointSimpleStar;
