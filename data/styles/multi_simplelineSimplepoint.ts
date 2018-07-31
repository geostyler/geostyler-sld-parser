import { Style } from 'geostyler-style';

const multi_simplelineSimplepoint: Style = {
  name: 'Simple Line and Point',
  type: ['Line', 'Point'],
  rules: [{
    name: '',
    symbolizer: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      dasharray: [13, 37]
    },{
      kind: 'Circle',
      color: '#FF0000',
      radius: 6
    }]
  }]
};

export default multi_simplelineSimplepoint;
