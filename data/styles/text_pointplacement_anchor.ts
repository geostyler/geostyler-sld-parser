import { Style } from 'geostyler-style';

const pointStyledLabelWithAnchor: Style = {
  name: 'Label With Below-Left Text',
  rules: [{
    name: '',
    symbolizers: [{
      color: '#000000',
      kind: 'Text',
      label: 'myText_at_below_left_position',
      placement: 'point',
      anchor: 'top-right'
    }]
  }]
};

export default pointStyledLabelWithAnchor;
