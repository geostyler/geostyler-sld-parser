# geostyler-sld-parser

[![Coverage Status](https://coveralls.io/repos/github/geostyler/geostyler-sld-parser/badge.svg?branch=master)](https://coveralls.io/github/geostyler/geostyler-sld-parser?branch=master)
[![License](https://img.shields.io/github/license/geostyler/geostyler-sld-parser)](https://github.com/geostyler/geostyler-sld-parser/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/geostyler-sld-parser.svg)](https://www.npmjs.com/package/geostyler-sld-parser)

## :rocket: GeoStyler Code Sprint 2024

We are happy to announce the third GeoStyler Code Sprint from **17.-21.06.2024** in Paris. Be part of it! More infos on https://geostyler.org/.

[GeoStyler](https://github.com/terrestris/geostyler/) Style Parser implementation for Styled Layer Descriptor (SLD)

### How to use

ES6:
```js
import SLDParser from 'geostyler-sld-parser';
import { Style } from 'geostyler-style';

const pointSimplePoint = {
  name: 'My Style',
  rules: [
    {
      name: 'My Rule',
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          color: '#FF0000',
          radius: 6
        }
      ]
    }
  ]
};

const parser = new SLDParser();

parser
  .writeStyle(pointSimplePoint)
  .then(({output: sld}) => console.log(sld))
  .catch(error => console.log(error));


// Read style from string
let sldString = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"> <sld:NamedLayer> <sld:Name>Default Styler</sld:Name> <sld:UserStyle> <sld:Name>Default Styler</sld:Name> <sld:Title>Gravel_Program_2016</sld:Title> <sld:FeatureTypeStyle> <sld:Name>name</sld:Name> <sld:Rule> <sld:MinScaleDenominator>1.0</sld:MinScaleDenominator> <sld:MaxScaleDenominator>1.0E7</sld:MaxScaleDenominator> <sld:LineSymbolizer> <sld:Stroke> <sld:CssParameter name="stroke">#8000FF</sld:CssParameter> <sld:CssParameter name="stroke-width">3.000</sld:CssParameter> </sld:Stroke> </sld:LineSymbolizer> </sld:Rule> </sld:FeatureTypeStyle> </sld:UserStyle> </sld:NamedLayer> </sld:StyledLayerDescriptor>';

parser
  .readStyle(sldString)
  .then(({output: sldObject}) => console.log(sldObject))
  .catch(error => console.log(error));

```

Browser:

```js
const pointSimplePoint = {
  name: "My Style",
  rules: [
    {
      name: "My Rule",
      symbolizers: [
        {
          kind: "Mark",
          wellKnownName: "Circle",
          color: "#FF0000",
          radius: 6
        }
      ]
    }
  ]
};
var parser = new GeoStylerSLDParser.SldStyleParser();
parser
  .writeStyle(pointSimplePoint)
  .then(({output: sld}) => console.log(sld))
  .catch(error => console.log(error));
    
// Read style from string
var sldString = '<?xml version="1.0" encoding="UTF-8"?><sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"> <sld:NamedLayer> <sld:Name>Default Styler</sld:Name> <sld:UserStyle> <sld:Name>Default Styler</sld:Name> <sld:Title>Gravel_Program_2016</sld:Title> <sld:FeatureTypeStyle> <sld:Name>name</sld:Name> <sld:Rule> <sld:MinScaleDenominator>1.0</sld:MinScaleDenominator> <sld:MaxScaleDenominator>1.0E7</sld:MaxScaleDenominator> <sld:LineSymbolizer> <sld:Stroke> <sld:CssParameter name="stroke">#8000FF</sld:CssParameter> <sld:CssParameter name="stroke-width">3.000</sld:CssParameter> </sld:Stroke> </sld:LineSymbolizer> </sld:Rule> </sld:FeatureTypeStyle> </sld:UserStyle> </sld:NamedLayer> </sld:StyledLayerDescriptor>';


parser
  .readStyle(sldString)
  .then(({output: sldObject}) => console.log(sldObject))
  .catch(error => console.log(error));
```

## <a name="funding"></a>Funding & financial sponsorship

Maintenance and further development of this code can be funded through the
[GeoStyler Open Collective](https://opencollective.com/geostyler). All contributions and
expenses can transparently be reviewed by anyone; you see what we use the donated money for.
Thank you for any financial support you give the GeoStyler project 💞

