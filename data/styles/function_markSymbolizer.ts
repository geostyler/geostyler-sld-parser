import { Style } from 'geostyler-style';

const functionMarkSymbolizer: Style = {
  name: 'Function MarkSymbolizer',
  rules: [
    {
      name: 'Function MarkSymbolizer',
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'cross',
        color: '#FF0000',
        radius: {
          name: 'pi'
        }
      }]
    }
  ]
};

export default functionMarkSymbolizer;
