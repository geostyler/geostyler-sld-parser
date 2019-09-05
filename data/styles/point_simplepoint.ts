import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  name: 'Simple Point',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'Circle',
      color: '#FF0000',
      radius: 3,
      fillOpacity: 0.5,
      strokeColor: '#0000FF',
      strokeOpacity: 0.7
    }]
  }]
};

export default pointSimplePoint;
