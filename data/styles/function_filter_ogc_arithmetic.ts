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

// const style2: Style = {
//   name: 'Filter with OGC Function',
//   rules: [
//     {
//       name: 'Filter with OGC Function',
//       filter: [
//         '&&',
//         [
//           '>',
//           [
//             '*'
//           ],
//           100
//         ]
//       ],
//       symbolizers: [
//         {
//           kind: 'Fill',
//           color: '#ff5e23',
//         }
//       ]
//     }
//   ],
// };


// const functionFilterOgcArithmetic: Style = {
//   name: 'Filter with OGC Function',
//   rules: [{
//     name: 'Filter with OGC Function',
//     filter: [
//       '&&',
//       [
//         '>',
//         { name: 'property', args: ['posledni_hodnota'] },
//         { name: 'property', args: ['posledni_hodnota_sekundarni'] }
//       ],
//       // Different comparison operators
//       ['>', {
//         name: 'add',
//         args: [
//           {
//             name: 'property',
//             args: ['propname']
//           },
//           {
//             name: 'property',
//             args: ['propname2']
//           }
//         ]
//       }, {
//         name: 'property',
//         args: ['value2']
//       }],
//       ['<', {
//         name: 'property',
//         args: ['count1']
//       }, {
//         name: 'property',
//         args: ['count2']
//       }],
//       ['>=', {
//         name: 'property',
//         args: ['threshold1']
//       }, {
//         name: 'property',
//         args: ['threshold2']
//       }],

//       [
//         '<=',
//         {
//           name: 'property',
//           args: ['posledni_hodnota']
//         },
//         {
//           name: 'property',
//           args: ['spa1h']
//         }
//       ],
//       // Mixed with property-to-literal
//       ['!=', 'status', 'NULL']
//     ],
//     symbolizers: [{
//       kind: 'Fill',
//       color: '#ff5e23',
//     }]
//   }]
// };

export default functionFilterOgcArithmetic;
