## [6.0.0-next.7](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.6...v6.0.0-next.7) (2024-06-19)


### Bug Fixes

* use node 20 ([c11137d](https://github.com/geostyler/geostyler-sld-parser/commit/c11137d28d9722c079fdcc9223425ceced31dd71))

## [6.0.0-next.6](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.5...v6.0.0-next.6) (2024-06-19)


### Bug Fixes

* use preserve module strategy ([6934882](https://github.com/geostyler/geostyler-sld-parser/commit/6934882a37962020aa2f5ced6bc88420f1e99b46))

## [6.0.0-next.5](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.4...v6.0.0-next.5) (2024-06-19)


### Bug Fixes

* use bundler module resolution ([05f3055](https://github.com/geostyler/geostyler-sld-parser/commit/05f3055f4135a1b0459d8e3c174c16e1ea4ad9ca))

## [6.0.0-next.4](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.3...v6.0.0-next.4) (2024-06-19)


### Bug Fixes

* fix commitlint config ([6ec0730](https://github.com/geostyler/geostyler-sld-parser/commit/6ec07303d92d23c86ef955163e357586986b9d36))

## [6.0.0-next.3](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.2...v6.0.0-next.3) (2024-06-19)


### Bug Fixes

* update semantic release ([3897a2c](https://github.com/geostyler/geostyler-sld-parser/commit/3897a2c53f38c0e20fdb158c0c2c7ea68750d993))

## [6.0.0-next.2](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0-next.1...v6.0.0-next.2) (2024-06-19)


### Bug Fixes

* update commitlint ([fdc74dc](https://github.com/geostyler/geostyler-sld-parser/commit/fdc74dcbf3c294a02e0a318549d6cb091a2ab2e1))

## [6.0.0-next.1](https://github.com/geostyler/geostyler-sld-parser/compare/v5.3.1...v6.0.0-next.1) (2024-06-19)


### ⚠ BREAKING CHANGES

* You may need to adapt your imports. Also the
location of the browser build has changed.

### Features

* update package versions and switch to esm build ([3284c97](https://github.com/geostyler/geostyler-sld-parser/commit/3284c97455240cb0b7b403da00439fedcbd6141e))

## [5.3.1](https://github.com/geostyler/geostyler-sld-parser/compare/v5.3.0...v5.3.1) (2024-02-13)


### Bug Fixes

* actually set xmlns on filter ([bc12246](https://github.com/geostyler/geostyler-sld-parser/commit/bc1224693669d2c63fcadb295875c3c343712b8f))

## [5.3.0](https://github.com/geostyler/geostyler-sld-parser/compare/v5.2.0...v5.3.0) (2024-02-13)


### Features

* read/write labelplacement ([260c80d](https://github.com/geostyler/geostyler-sld-parser/commit/260c80d082ca57c7ecf409b0787b8d00c001954f))


### Bug Fixes

* omit setting style title for sld 1.1.0 ([2f24602](https://github.com/geostyler/geostyler-sld-parser/commit/2f246023ac0abe961c02270bcb45af3772c6da5c))
* remove unintended se namespace prefix from filter ([389b010](https://github.com/geostyler/geostyler-sld-parser/commit/389b010e0038d4edf50984ac4352f582d29d0eac))
* remove unnecessary ogc: prefix from filter ([450ee8f](https://github.com/geostyler/geostyler-sld-parser/commit/450ee8f963c929b566c9c3c1ac505a469e5c8bb2))

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
