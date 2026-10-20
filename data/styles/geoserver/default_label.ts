import { Style } from 'geostyler-style';

const style: Style = {
  name: 'default_label',
  rules: [
    {
      name: 'Default label',
      symbolizers: [
        {
          kind: 'Text',
          color: '#000000',
          label: {
            name: "strConcat",
            args: [
              'prefix: ',
              '{{name}}',
              '{{title}}',
              ' entity',
            ]
          },
          font: ['Arial'],
          size: 12,
          offset: [0, -5],
          haloColor: '#000000',
          haloOpacity: 1,
          haloWidth: 5,
          rotate: 45,
          fontWeight: 'bold',
          placement: 'point',
          wrap: 50
        }
      ]
    }
  ]
};


export default style;
