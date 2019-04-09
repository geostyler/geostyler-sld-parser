import { Style } from 'geostyler-style';

const rasterComplexRaster: Style = {
  'name': 'Complex Raster',
  'rules': [{
    'name': 'Small populated New Yorks',
    'symbolizers': [{
      'kind': 'Raster',
      'opacity': 0.5,
      'channelSelection': {
        'redChannel': {
          'sourceChannelName': '1'
        },
        'blueChannel': {
          'sourceChannelName': '2',
          'contrastEnhancement': {
            'enhancementType': 'histogram',
            'gammaValue': 2
          }
        },
        'greenChannel': {
          'sourceChannelName': '3',
          'contrastEnhancement': {
            'enhancementType': 'normalize'
          }
        }
      },
      'colorMap': {
        'type': 'ramp',
        'colorMapEntries': [{
          'color': '#323232',
          'quantity': -300,
          'label': 'label1',
          'opacity': 1
        }, {
          'color': '#BBBBBB',
          'quantity': 200,
          'label': 'label2',
          'opacity': 1
        }]
      },
      'contrastEnhancement': {
        'enhancementType': 'histogram'
      }
    }]
  }]
};

export default rasterComplexRaster;
