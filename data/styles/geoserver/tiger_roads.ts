import { Style } from 'geostyler-style';

const style: Style = {
  name: 'area landmarks',
  rules: [
    {
      name: '',
      scaleDenominator: {
        min: 32000
      },
      symbolizers: [
        {
          kind: 'Line',
          color: '#666666',
          width: 2
        }
      ]
    },
    {
      name: '',
      scaleDenominator: {
        max: 32000
      },
      symbolizers: [
        {
          kind: 'Line',
          color: '#666666',
          width: 7
        }
      ]
    },
    {
      name: '',
      scaleDenominator: {
        max: 32000
      },
      symbolizers: [
        {
          kind: 'Line',
          color: '#FFFFFF',
          width: 4
        }
      ]
    },
    {
      name: '',
      scaleDenominator: {
        max: 32000
      },
      symbolizers: [
        {
          kind: 'Text',
          label: '{{NAME}}',
          color: '#000000',
          haloWidth: 2,
          haloColor: '#FFFFFF',
          haloOpacity: 0.85,
          font: [
            'Times New Roman'
          ],
          fontStyle: 'normal',
          fontWeight: 'bold',
          size: 14,
          placement: 'line'
        }
      ]
    }
  ]
};

export default style;
