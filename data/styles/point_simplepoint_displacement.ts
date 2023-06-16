import { Style } from 'geostyler-style';

const pointSimplePointDisplacement: Style = {
  name: 'Simple Point',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#FF0000',
      radius: 3,
      fillOpacity: 0.5,
      strokeColor: '#0000FF',
      strokeOpacity: 0.7,
      offset: [13, 37]
    }]
  }]
};

export default pointSimplePointDisplacement;
