import { Style } from 'geostyler-style';

const style: Style = {
  'name': 'Population in the United States',
  'rules': [
    {
      'name': '< 2M',
      'filter': [
        '<',
        'PERSONS',
        '2000000'
      ],
      'symbolizers': [
        {
          'kind': 'Fill',
          'graphicFill': {
            'kind': 'Mark',
            'wellKnownName': 'shape://slash',
            'radius': 8,
            'strokeColor': '0xAAAAAA'
          },
          'opacity': 0
        }
      ]
    },
    {
      'name': '2M - 4M',
      'filter': [
        '<=x<=',
        'PERSONS',
        2000000,
        4000000
      ],
      'symbolizers': [
        {
          'kind': 'Fill',
          'graphicFill': {
            'kind': 'Mark',
            'wellKnownName': 'shape://slash',
            'radius': 4,
            'strokeColor': '0xAAAAAA'
          },
          'opacity': 0
        }
      ]
    },
    {
      'name': '> 4M',
      'filter': [
        '>',
        'PERSONS',
        '4000000'
      ],
      'symbolizers': [
        {
          'kind': 'Fill',
          'graphicFill': {
            'kind': 'Mark',
            'wellKnownName': 'shape://slash',
            'radius': 2,
            'strokeColor': '0xAAAAAA'
          },
          'opacity': 0
        }
      ]
    },
    {
      'name': 'Boundary',
      'symbolizers': [
        {
          'kind': 'Line'
        },
        {
          'kind': 'Text',
          'label': '{{STATE_ABBR}}',
          'color': '#000000',
          'opacity': 1,
          'haloWidth': 2,
          'haloColor': '0xFFFFFF',
          'font': [
            'Times New Roman'
          ],
          'fontStyle': 'normal',
          'size': 14
        }
      ]
    }
  ]
};

export default style;
