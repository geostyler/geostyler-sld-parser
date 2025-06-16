import { Style } from 'geostyler-style';

const functionFilterPropertyToProperty: Style = {
  name: 'Function Property to Property',
  rules: [{
    name: 'Property Comparison Rule',
    filter: ['&&',
      // Basic property to property comparison
      ['==', {
        name: 'property',
        args: ['posledni_hodnota']
      }, {
        name: 'property',
        args: ['posledni_hodnota_sekundarni']
      }],
      // Different comparison operators
      ['>', {
        name: 'property',
        args: ['value1']
      }, {
        name: 'property',
        args: ['value2']
      }],
      ['<', {
        name: 'property',
        args: ['count1']
      }, {
        name: 'property',
        args: ['count2']
      }],
      ['>=', {
        name: 'property',
        args: ['threshold1']
      }, {
        name: 'property',
        args: ['threshold2']
      }],

      [
        '<=',
        {
          name: 'property',
          args: ['posledni_hodnota']
        },
        {
          name: 'property',
          args: ['spa1h']
        }
      ],
      // Mixed with property-to-literal
      ['!=', 'status', 'NULL']
    ],
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'square',
      color: '#FF0000',
      radius: 2.5,
      strokeColor: '#000000',
      strokeWidth: 1
    }]
  }]
};

export default functionFilterPropertyToProperty;
