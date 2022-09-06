import { Style } from 'geostyler-style';

const burg: Style = {
  'name': 'A small red flag',
  'rules': [
    {
      'name': 'Red flag',
      'symbolizers': [
        {
          'kind': 'Icon',
          'image': 'burg02.svg'
        }
      ]
    }
  ]
};

export default burg;
