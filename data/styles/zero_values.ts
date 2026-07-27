import { Style } from 'geostyler-style';

const zeroValues: Style = {
  name: 'Zero Values',
  rules: [{
    name: 'Zero Mark',
    scaleDenominator: {
      min: 0,
      max: 500000
    },
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'circle',
      color: '#FF0000',
      rotate: 0,
      strokeWidth: 0,
      strokeOpacity: 0
    }]
  }, {
    name: 'Zero Icon',
    symbolizers: [{
      kind: 'Icon',
      image: 'http://geoserver.org/img/geoserver-logo.png',
      size: 0,
      rotate: 0
    }]
  }, {
    name: 'Zero Text',
    symbolizers: [{
      kind: 'Text',
      color: '#000000',
      opacity: 0,
      label: '{{name}}',
      haloColor: '#FFFFFF',
      haloWidth: 0,
      haloOpacity: 0,
      rotate: 0,
      placement: 'point'
    }]
  }, {
    name: 'Zero Line',
    symbolizers: [{
      kind: 'Line',
      color: '#000000',
      width: 3,
      perpendicularOffset: 0
    }]
  }]
};

export default zeroValues;
