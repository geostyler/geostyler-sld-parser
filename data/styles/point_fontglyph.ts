import { Style } from 'geostyler-style';

const pointSimpleCross: Style = {
  name: 'Font Glyph',
  rules: [{
    name: 'Small populated New Yorks',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'ttf://My Font Name#0x0A23',
      color: '#FF0000',
      radius: 5,
      opacity: 1,
      fillOpacity: 0.5,
      strokeColor: '#0000FF',
      strokeOpacity: 0.7
    }]
  }]
};

export default pointSimpleCross;
