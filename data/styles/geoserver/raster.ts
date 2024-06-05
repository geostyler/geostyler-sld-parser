import { Style } from 'geostyler-style';

const style: Style = {
  name: 'default_raster',
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
