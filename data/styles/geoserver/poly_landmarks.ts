import { Style } from 'geostyler-style';

const style: Style = {
  name: 'area landmarks',
  rules: [
    {
      name: '',
      filter: [
        '||',
        [
          '||',
          [
            '||',
            [
              '==',
              'CFCC',
              'D82'
            ],
            [
              '==',
              'CFCC',
              'D83'
            ]
          ],
          [
            '==',
            'CFCC',
            'D84'
          ]
        ],
        [
          '==',
          'CFCC',
          'D85'
        ]
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#B4DFB4',
          fillOpacity: 1,
          outlineColor: '#88B588'
        }
      ]
    },
    {
      name: '',
      filter: [
        '||',
        [
          '||',
          [
            '||',
            [
              '==',
              'CFCC',
              'H11'
            ],
            [
              '==',
              'CFCC',
              'H31'
            ]
          ],
          [
            '==',
            'CFCC',
            'H41'
          ]
        ],
        [
          '==',
          'CFCC',
          'H51'
        ]
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#8AA9D1',
          fillOpacity: 1,
          outlineColor: '#436C91'
        }
      ]
    },
    {
      name: '',
      filter: [
        '||',
        [
          '||',
          [
            '||',
            [
              '||',
              [
                '||',
                [
                  '==',
                  'CFCC',
                  'D31'
                ],
                [
                  '==',
                  'CFCC',
                  'D43'
                ]
              ],
              [
                '==',
                'CFCC',
                'D64'
              ]
            ],
            [
              '==',
              'CFCC',
              'D65'
            ]
          ],
          [
            '==',
            'CFCC',
            'D90'
          ]
        ],
        [
          '==',
          'CFCC',
          'E23'
        ]
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#A5A5A5',
          fillOpacity: 1,
          outlineColor: '#6E6E6E'
        }
      ]
    },
    {
      name: '',
      symbolizers: [
        {
          kind: 'Text',
          label: '{{LANAME}}',
          color: '#000000',
          haloWidth: 2,
          haloColor: '#FDE5A5',
          haloOpacity: 0.75,
          font: [
            'Times New Roman'
          ],
          fontStyle: 'normal',
          fontWeight: 'bold',
          size: 14,
          placement: 'point'
        }
      ]
    }
  ]
};

export default style;
