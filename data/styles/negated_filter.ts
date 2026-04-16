import { Style } from 'geostyler-style';

const negatedFilter: Style = {
  name: 'Default Styler',
  rules: [
    {
      name: 'kein IVU-Betrieb',
      filter: ['==', 'ARBEITSSTAETTEN_NR', null],
      scaleDenominator: { max: 150000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#FFC000',
        radius: 5,
        strokeColor: '#001C90',
      }],
    },
    {
      name: 'IVU Betrieb',
      filter: ['!', ['==', 'ARBEITSSTAETTEN_NR', null]],
      scaleDenominator: { max: 150000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#7DDD00',
        radius: 5,
        strokeColor: '#001C90',
      }],
    },
    {
      name: 'kein IVU-Betrieb',
      filter: ['==', 'ARBEITSSTAETTEN_NR', null],
      scaleDenominator: { min: 150000, max: 500000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#FFC000',
        radius: 4,
        strokeColor: '#001C90',
      }],
    },
    {
      name: 'IVU Betrieb',
      filter: ['!', ['==', 'ARBEITSSTAETTEN_NR', null]],
      scaleDenominator: { min: 150000, max: 500000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#7DDD00',
        radius: 4,
        strokeColor: '#001C90',
      }],
    },
    {
      name: 'kein IVU-Betrieb',
      filter: ['==', 'ARBEITSSTAETTEN_NR', null],
      scaleDenominator: { min: 500000, max: 1000000000000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#FFC000',
        radius: 3,
        strokeColor: '#001C90',
      }],
    },
    {
      name: 'IVU Betrieb',
      filter: ['!', ['==', 'ARBEITSSTAETTEN_NR', null]],
      scaleDenominator: { min: 500000, max: 1000000000000 },
      symbolizers: [{
        kind: 'Mark',
        wellKnownName: 'circle',
        color: '#7DDD00',
        radius: 3,
        strokeColor: '#001C90',
      }],
    },
  ],
};

export default negatedFilter;
