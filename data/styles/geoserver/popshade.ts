import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Population in the United States',
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
          color: '#4DFF4D',
          fillOpacity: 0.7
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
          color: '#FF4D4D',
          fillOpacity: 0.7
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
          color: '#4D4DFF',
          fillOpacity: 0.7
        }
      ]
    },
    {
      name: 'Boundary',
      symbolizers: [
        {
          kind: 'Line',
          width: 0.2
        },
        {
          kind: 'Text',
          label: '{{STATE_ABBR}}',
          color: '#000000',
          opacity: 1,
          font: [
            'Times New Roman'
          ],
          fontStyle: 'normal',
          size: 14
        }
      ]
    }
  ]
};

export default style;
