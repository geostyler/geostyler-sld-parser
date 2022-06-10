import { Style } from 'geostyler-style';

const polygonExpression: Style = {
  name: 'Polygon Fill with expressions',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Fill',
      color: {
        type: 'functioncall',
        name: 'peter',
        args: [{
          type: 'literal',
          value: '#000000'
        }, {
          type: 'property',
          name: 'myProp'
        }, {
          type: 'functioncall',
          name: 'hans',
          args: [{
            type: 'literal',
            value: 76
          }, {
            type: 'literal',
            value: 12
          }]
        }]
      }
    }]
  }]
};

export default polygonExpression;
