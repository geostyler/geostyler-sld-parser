import { Style } from 'geostyler-style';

const rasterSimpleRaster: Style = {
  'name': 'Simple Raster',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Raster',
      'opacity': 0.5,
    }]
  }]
};

export default rasterSimpleRaster;
