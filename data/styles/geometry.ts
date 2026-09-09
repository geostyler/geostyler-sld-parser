import { Style } from 'geostyler-style';

const geometry: Style = {
  name: 'Geometry',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'square',
      geometry: {
        name: 'property',
        args: ['geom']
      }
    }, {
      kind: 'Line',
      geometry: {
        name: 'property',
        args: ['geom']
      }
    }, {
      kind: 'Fill',
      geometry: {
        name: 'property',
        args: ['geom']
      }
    }, {
      kind: 'Text',
      label: '',
      color: '#000000',
      geometry: {
        name: 'property',
        args: ['geom']
      }
    }, {
      kind: 'Line',
      geometry: {
        name: 'startPoint',
        args: [{
          name: 'property',
          args: ['geom']
        }]
      }
    }, {
      kind: 'Line',
      geometry: {
        name: 'endPoint',
        args: [{
          name: 'property',
          args: ['geom']
        }]
      }
    }, {
      kind: 'Fill',
      geometry: {
        name: 'centroid',
        args: [{
          name: 'property',
          args: ['geom']
        }]
      }
    }]
  }]
};

export default geometry;
