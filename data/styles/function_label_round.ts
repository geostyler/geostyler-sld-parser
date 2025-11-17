import { Style } from 'geostyler-style';

const functionLabelRound: Style = {
name: 'Line Label with rounded value',
  rules: [{
      name:'',
      symbolizers: [
        {
          kind: 'Line',
          color:'#267300',
          opacity: 1,
          width: 1.3333333333333333,
          cap: 'round',
          join: 'round'
        }
      ]
    },
    {
      name: '',
      symbolizers: [{ 
      kind: 'Text',
      color: '#38a800',
      font: ['Arial'],
      label: {
        args: [
          '#',
          {
            args: [
              'contour'
            ],
            name: 'property'
          },
          '',
        ],
        name: 'numberFormat'
      },
      size: 10.666666666666666,
      fontWeight: 'normal',
      placement: 'line',
      haloColor: '#ffffff',
      haloWidth: 1.3333333333333333,
      haloOpacity: 1,
    }]
  }]
};

export default functionLabelRound;