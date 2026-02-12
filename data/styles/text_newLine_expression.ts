import { Style } from 'geostyler-style';

const textNewLineExpression: Style = {
  name: 'Forstkreise',
  rules: [{
    name: 'Forstkreise',
    symbolizers: [{
      kind: 'Fill',
      outlineColor: '#267300',
      outlineOpacity: 1,
      outlineWidth: 3.333333333333333
    }]
  }, {
    name: '',
    symbolizers: [{
      kind: 'Text',
      color: '#267300',
      label: '{{fokr}}\n{{fokrname}}',
      font: ['Arial'],
      size: 13.333333333333332,
      fontWeight: 'normal',
      offset: [0, -0],
      rotate: 0,
      placement: 'point'
    }]
  }]
};

export default textNewLineExpression;
