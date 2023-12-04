## [5.2.0](https://github.com/geostyler/geostyler-sld-parser/compare/v5.1.0...v5.2.0) (2023-12-04)


### Features

* **deps:** updates geostyler-style to v8 ([7200e79](https://github.com/geostyler/geostyler-sld-parser/commit/7200e790bd1cb0ce0d81e1787fe648bb4ad09026))


### Bug Fixes

* **deps:** update dependency fast-xml-parser to v4.2.4 [security] ([cba8616](https://github.com/geostyler/geostyler-sld-parser/commit/cba8616529c24c5db30cfc9e5d515484913493fc))
* **deps:** update dependency fast-xml-parser to v4.2.5 [security] ([72e5b96](https://github.com/geostyler/geostyler-sld-parser/commit/72e5b96fbdfd1eae7bbaea2882dfa5cd818d9900))
* **deps:** update dependency fast-xml-parser to v4.2.7 ([aeee571](https://github.com/geostyler/geostyler-sld-parser/commit/aeee571d90b82d6437dba31bbe55a69315fa3b39))
* update semantic-release configs ([fa147d9](https://github.com/geostyler/geostyler-sld-parser/commit/fa147d9cda7a0b97500c815d8b462f8965196a2b))

# Version 5.0.0

- `prettyOutput` constructor option was removed
  - use `format` in `builderOptions` instead
- `forceCasting` constructor option was removed
  - TagValues will be cast to their respective types by default
  - use `parseTagValue` option of parserOptions to change behaviour
- Labels with leading or dangling whitespaces have to use `<![CDATA[]]>`
  compare `point_styledLabel_literalPlaceholder.sld` in data/slds
