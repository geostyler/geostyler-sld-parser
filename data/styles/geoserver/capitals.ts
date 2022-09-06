import { Style } from 'geostyler-style';

const style: Style = {
  'name': 'Capital cities',
  'rules': [
    {
      'name': 'Capitals',
      'symbolizers': [
        {
          'kind': 'Mark',
          'wellKnownName': 'circle',
          'color': '#FFFFFF',
          'strokeColor':'#000000',
          'strokeWidth': 2
        }
      ]
    }
  ]
};

export default style;
