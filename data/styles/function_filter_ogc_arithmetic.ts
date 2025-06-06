import { Style } from 'geostyler-style';

const functionFilterOgcArithmetic: Style = {
  name: 'Filter with OGC Function',
  rules: [
    {
      name: 'Filter with OGC Function',
      filter: [
        '&&',
        [
          '>',
          {
            name: 'mul',
            args: [
              {
                name: 'div',
                args: [
                  {
                    name: 'property',
                    args: ['men_pauv']
                  },
                  {
                    name: 'property',
                    args: ['men']
                  },
                ]
              },
              100
            ]
          },
          25
        ],
        [
          '<=',
          {
            name: 'mul',
            args: [
              {
                name: 'div',
                args: [
                  {
                    name: 'property',
                    args: ['men_pauv'],
                  },
                  {
                    name: 'property',
                    args: ['men']
                  }
                ]
              },
              100
            ]
          },
          36
        ]
      ],
      symbolizers: [
        {
          kind: 'Fill',
          color: '#ff5e23',
        }
      ]
    }
  ],
};

export default functionFilterOgcArithmetic;
