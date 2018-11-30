# geostyler-sld-parser

[![Greenkeeper badge](https://badges.greenkeeper.io/terrestris/geostyler-sld-parser.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/terrestris/geostyler-sld-parser.svg?branch=master)](https://travis-ci.com/terrestris/geostyler-sld-parser)
[![Coverage Status](https://coveralls.io/repos/github/terrestris/geostyler-sld-parser/badge.svg?branch=master)](https://coveralls.io/github/terrestris/geostyler-sld-parser?branch=master)
[![npm version](https://badge.fury.io/js/geostyler-sld-parser.svg)](https://www.npmjs.com/package/geostyler-sld-parser)

[GeoStyler](https://github.com/terrestris/geostyler/) Style Parser implementation for Styled Layer Descriptor (SLD)

### Issues
Please provide related issues here https://github.com/terrestris/geostyler/issues

### How to use

ES6:
```js
import SLDParser from "geostyler-sld-parser";

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

const parser = new SLDParser();

parser
  .writeStyle(pointSimplePoint)
  .then(sld => console.log(sld))
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
  .writeStyle(geostyle)
  .then(function(style) {
    console.log(style);
  })
  catch(function(error) {
    console.log(error);
  });
```
