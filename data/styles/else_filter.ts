import { Style } from 'geostyler-style';

const elseFilter: Style = {
  name: 'some_dataset',
  rules: [{
    name: 'Defer Maintenance',
    filter: ['==', 'maintenance_suggestion', 'Defer Maintenance'],
    symbolizers: [{
      kind: 'Line',
      color: '#79ded7',
      width: 1,
      join: 'bevel',
      cap: 'square'
    }]
  }, {
    name: '',
    elseRule: true,
    symbolizers: [{
      kind: 'Line',
      color: '#a1e24b',
      width: 1,
      join: 'bevel',
      cap: 'square'
    }]
  }]
};

export default elseFilter;
