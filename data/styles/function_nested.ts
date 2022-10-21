import { Style } from 'geostyler-style';

const functionNestedFillSymbolizer: Style = {
  name: 'OL Style',
  rules: [
    {
      name: 'OL Style Rule 0',
      symbolizers: [{
        kind: 'Fill',
        color: '#F1337F',
        outlineWidth: {
          name: 'max',
          args: [{
            name: 'pi'
          }, {
            name: 'strLength',
            args: ['Peter']
          }]
        }
      }]
    }
  ]
};

export default functionNestedFillSymbolizer;
