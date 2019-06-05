import { Style } from 'geostyler-style';

const pointExternalGraphic: Style = {
  name: 'External Graphic',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Icon',
      image: 'http://geoserver.org/img/geoserver-logo.png',
      size: 0.1,
      rotate: 90.5
    }]
  }]
};

export default pointExternalGraphic;
