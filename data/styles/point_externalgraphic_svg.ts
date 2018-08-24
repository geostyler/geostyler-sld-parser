import { Style } from 'geostyler-style';

const pointExternalGraphic: Style = {
  name: 'External Graphic',
  rules: [{
    name: '',
    symbolizers: [{
      kind: 'Icon',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/OpenLayers_logo.svg',
      size: 10,
      rotate: 90
    }]
  }]
};

export default pointExternalGraphic;
