import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Simple DEM style',
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
                color: '#AAFFAA',
                quantity: 0,
                label: 'values'
              },
              {
                color: '#00FF00',
                quantity: 1000
              },
              {
                color: '#FFFF00',
                quantity: 1200,
                label: 'values'
              },
              {
                color: '#FF7F00',
                quantity: 1400,
                label: 'values'
              },
              {
                color: '#BF7F3F',
                quantity: 1600,
                label: 'values'
              },
              {
                color: '#000000',
                quantity: 2000,
                label: 'values'
              }
            ]
          }
        }
      ]
    }
  ]
};


export default style;
