import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Points of interest',
  rules: [
    {
      name: '',
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          fillOpacity: 1,
          color: '#FF0000',
          radius: 5.5
        },
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          fillOpacity: 1,
          color: '#EDE513',
          radius: 3.5
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
          opacity: 1,
          haloWidth: 2,
          haloColor: '#FFFFFF',
          offset: [
            0,
            -15
          ],
          font: [
            'Arial'
          ],
          fontWeight: 'bold',
          size: 14,
          placement: 'point'
        }
      ]
    }
  ]
};

export default style;
