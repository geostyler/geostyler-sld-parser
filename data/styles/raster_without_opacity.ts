import { Style } from 'geostyler-style';

const rasterWithoutOpacity: Style = {
  name:'Default Styler',
  rules:[
    {
      name:'',
      symbolizers:[
        {
          kind:'Raster',
          colorMap:{
            type:'intervals',
            colorMapEntries:[
              {
                color:'#ffffff',
                quantity:1.0001,
                opacity:1
              },
              {
                color:'#ff0000',
                quantity:50000.0001,
                opacity:1
              },
              {
                color:'#ffff00',
                quantity:100000.0001,
                opacity:1
              },
              {
                color:'#00aa00',
                quantity:10000000,
                label:'100000 < x',
                opacity:1
              }
            ]
          },
          contrastEnhancement:{}
        }
      ]
    }
  ]
};

export default rasterWithoutOpacity;
