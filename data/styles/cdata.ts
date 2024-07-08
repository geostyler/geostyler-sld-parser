import { Style } from 'geostyler-style';

const lineSimpleLine: Style = {
  name: 'Wegdeel_vlak_style',
  rules: [
    {
      name: 'autosnelweg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10202,
            10200,
            10201
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#996089'
        }
      ]
    },
    {
      name: 'fietspad',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10742,
            10740,
            10741
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFD37F'
        }
      ]
    },
    {
      name: 'half verharde weg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10721,
            10720
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#B3B300'
        }
      ]
    },
    {
      name: 'hoofdweg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10302,
            10300,
            10401,
            10310,
            10311,
            10312
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#E60000'
        }
      ]
    },
    {
      name: 'lokale weg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10502,
            10500,
            10501,
            10510,
            10511,
            10512
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFFF00'
        }
      ]
    },
    {
      name: 'onverharde weg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10732,
            10730,
            10731
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#9C9C9C'
        }
      ]
    },
    {
      name: 'overige weg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10790,
            10700,
            10701,
            10702,
            10710,
            10711,
            10712,
            10791,
            10792
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFFFFF'
        }
      ]
    },
    {
      name: 'parkeerplaats',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10781,
            10780
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFFFFF',
          outlineColor: '#343434',
          outlineWidth: 1
        }
      ]
    },
    {
      name: 'regionale weg',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10402,
            10400,
            10301,
            10410,
            10411,
            10412
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFAA00'
        }
      ]
    },
    {
      name: 'rolbaan, platform',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10102,
            10100,
            10101
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#CCCCCC'
        }
      ]
    },
    {
      name: 'startbaan, landingsbaan',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10002,
            10000
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#CCCCCC'
        }
      ]
    },
    {
      name: 'straat',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10602,
            10601,
            10600
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFFFFF'
        }
      ]
    },
    {
      name: 'voetgangersgebied',
      filter: [
        '==',
        {
          name: 'in',
          args: [
            {
              name: 'property',
              args: [
                'visualisatiecode'
              ]
            },
            10760,
            10750,
            10751,
            10752,
            10761,
            10762
          ]
        },
        true
      ],
      scaleDenominator: {
        max: 40000
      },
      symbolizers: [
        {
          kind: 'Fill',
          color: '#FFA77F'
        }
      ]
    }
  ]
};

export default lineSimpleLine;
