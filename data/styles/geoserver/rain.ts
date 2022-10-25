import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Rain distribution',
  rules: [
    {
      name: '',
      symbolizers: [
        {
          kind: 'Raster',
          opacity: 1,
          colorMap: {
            type: 'ramp',
            colorMapEntries: [
              {
                color: '#FF0000',
                quantity: 0
              },
              {
                color: '#FFFFFF',
                quantity: 100
              },
              {
                color: '#00FF00',
                quantity: 2000
              },
              {
                color: '#0000FF',
                quantity: 5000
              }
            ]
          }
        }
      ]
    }
  ]
};

export default style;
