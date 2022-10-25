import { Style } from 'geostyler-style';

const style: Style = {
  name: 'Opaque Raster',
  rules: [
    {
      name: 'Opaque Raster',
      symbolizers: [
        {
          kind: 'Raster',
          opacity: 1
        }
      ]
    }
  ]
};

export default style;
