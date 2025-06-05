import { Style } from 'geostyler-style';

const style: Style = {
  name: 'population',
  rules: [
    {
      name: '< 2M',
      filter: [
        '<',
        'PERSONS',
        2000000
      ],
      symbolizers: [
        {
          kind: 'Fill',
          graphicFill: {
            kind: 'Mark',
            wellKnownName: 'shape://slash',
            radius: 8,
            strokeColor: '#AAAAAA'
          }
        }
      ]
    },
    {
      name: '2M - 4M',
      filter: [
        '<=x<=',
        'PERSONS',
        2000000,
        4000000
      ],
      symbolizers: [
        {
          kind: 'Fill',
          graphicFill: {
            kind: 'Mark',
            wellKnownName: 'shape://slash',
            radius: 4,
            strokeColor: '#AAAAAA'
          }
        }
      ]
    },
    {
      name: '> 4M',
      filter: [
        '>',
        'PERSONS',
        4000000
      ],
      symbolizers: [
        {
          kind: 'Fill',
          graphicFill: {
            kind: 'Mark',
            wellKnownName: 'shape://slash',
            radius: 2,
            strokeColor: '#AAAAAA',
            strokeDasharray: [4, 5]
          }
        }
      ]
    },
    {
      name: 'Boundary',
      symbolizers: [
        {
          kind: 'Line'
        },
        {
          kind: 'Text',
          label: '{{STATE_ABBR}}',
          color: '#000000',
          haloWidth: 2,
          haloColor: '#FFFFFF',
          font: [
            'Times New Roman'
          ],
          fontStyle: 'normal',
          size: 14,
          placement: 'point'
        }
      ]
    }
  ]
};

export default style;
