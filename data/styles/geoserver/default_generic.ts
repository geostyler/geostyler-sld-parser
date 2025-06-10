import { Style } from 'geostyler-style';

const style: Style = {
  name: 'generic',
  rules: [{
    name: 'Opaque Raster',
    filter: ['==', {
      // @ts-expect-error
      name: 'isCoverage'
    }, true],
    symbolizers: [{
      kind: 'Raster',
      opacity: 1
    }]
  },
  {
    name: 'Grey Polygon',
    filter: ['==', {
      // @ts-expect-error
      name: 'dimension',
      args: [{
        name: 'geometry'
      }]
    }, 2],
    symbolizers: [{
      kind: 'Fill',
      color: '#AAAAAA',
      outlineColor: '#000000',
      outlineWidth: 1
    }]
  },
  {
    name: 'Blue Line',
    filter: ['==',{
      // @ts-expect-error
      name: 'dimension',
      args: [{
        name: 'geometry'
      }]
    }, 1],
    symbolizers: [{
      kind: 'Line',
      color: '#0000FF',
      opacity: 1
    }]
  },
  {
    name: 'Red Square Point',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'square',
      color: '#FF0000',
      radius: 3
    }]
  }]
};


export default style;
