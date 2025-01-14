## [7.2.0](https://github.com/geostyler/geostyler-sld-parser/compare/v7.1.0...v7.2.0) (2025-01-14)


### Features

* property to property comparison ([#975](https://github.com/geostyler/geostyler-sld-parser/issues/975)) ([72c794e](https://github.com/geostyler/geostyler-sld-parser/commit/72c794e2524f8ad0f8068d9f0d24a11f853980b1))

## [7.1.0](https://github.com/geostyler/geostyler-sld-parser/compare/v7.0.0...v7.1.0) (2025-01-13)


### Features

* add vendor-option graphic-margin ([#971](https://github.com/geostyler/geostyler-sld-parser/issues/971)) ([be950ea](https://github.com/geostyler/geostyler-sld-parser/commit/be950eae89dd262e2018fbdca9fab6ceba75d83d))


### Bug Fixes

* update image format handling ([0093c6b](https://github.com/geostyler/geostyler-sld-parser/commit/0093c6b979affc4db005d7fb0868c87f9504a063))

## [7.0.0](https://github.com/geostyler/geostyler-sld-parser/compare/v6.1.2...v7.0.0) (2024-10-09)


### ⚠ BREAKING CHANGES

* opacity will no longer be set to 1 on text
symbolizer if opacity was not explicitly set.

### Bug Fixes

* test if opacity is really undefined ([#968](https://github.com/geostyler/geostyler-sld-parser/issues/968)) ([858b42b](https://github.com/geostyler/geostyler-sld-parser/commit/858b42bfc3a363cabceeeffd4fe9fffb9eda667f))

## [6.1.2](https://github.com/geostyler/geostyler-sld-parser/compare/v6.1.1...v6.1.2) (2024-08-26)


### Bug Fixes

* updates fast-xml-parser ([511e02f](https://github.com/geostyler/geostyler-sld-parser/commit/511e02f275fef6f77c50cbc1681db433b9485062))

## [6.1.1](https://github.com/geostyler/geostyler-sld-parser/compare/v6.1.0...v6.1.1) (2024-07-09)


### Bug Fixes

* fix reading CDATA values from SLD ([3afb066](https://github.com/geostyler/geostyler-sld-parser/commit/3afb0669c81bd36326126e46cd5cb8e7fa9fece7))

## [6.1.0](https://github.com/geostyler/geostyler-sld-parser/compare/v6.0.0...v6.1.0) (2024-07-04)


### Features

* reimplementing i18n for error messages without i18next [#923](https://github.com/geostyler/geostyler-sld-parser/issues/923) [#924](https://github.com/geostyler/geostyler-sld-parser/issues/924) [#928](https://github.com/geostyler/geostyler-sld-parser/issues/928) [#944](https://github.com/geostyler/geostyler-sld-parser/issues/944) ([8252180](https://github.com/geostyler/geostyler-sld-parser/commit/825218070948d162d66d39ba6c414f63e90f5445))

## [6.0.0](https://github.com/geostyler/geostyler-sld-parser/compare/v5.4.0...v6.0.0) (2024-06-25)


### ⚠ BREAKING CHANGES

* You may need to adapt your imports. Also the
location of the browser build has changed.

### Features

* update package versions and switch to esm build ([42e6a2c](https://github.com/geostyler/geostyler-sld-parser/commit/42e6a2c662689e1c1ffcb6efa8c5402183d88d25))


### Bug Fixes

* fix commitlint config ([c1db90d](https://github.com/geostyler/geostyler-sld-parser/commit/c1db90de873c0e410b19a3e82e59a6cf96caa4b9))
* update commitlint ([390e668](https://github.com/geostyler/geostyler-sld-parser/commit/390e668487f86976b4e9b5a3afaf20b8ca04f800))
* update geostyler-style & cleanup package.json ([4183cb2](https://github.com/geostyler/geostyler-sld-parser/commit/4183cb26c3673e68bd6ed118a856212063224897))
* update geostyler-style version ([fe34f47](https://github.com/geostyler/geostyler-sld-parser/commit/fe34f47e5943f8ac9d3fa0dc8fcebf04a64baca4))
* update null checks for number values ([299b6c3](https://github.com/geostyler/geostyler-sld-parser/commit/299b6c3d5dbe890022f4d072c7ca57a013cbfc15))
* update semantic release ([809698c](https://github.com/geostyler/geostyler-sld-parser/commit/809698c1a8802ba15fca60e6163c7ae415733695))
* use bundler module resolution ([79eebaf](https://github.com/geostyler/geostyler-sld-parser/commit/79eebaf68cb1c49e5f91cb13f85239851643f67a))
* use node 20 ([aa0cdcd](https://github.com/geostyler/geostyler-sld-parser/commit/aa0cdcdbb6362b2362671faaed1824a5ee59bf26))
* use preserve module strategy ([40ffc9c](https://github.com/geostyler/geostyler-sld-parser/commit/40ffc9c3739889d76fc4ab225e6999abbc07b134))

## [6.0.0-next.1](https://github.com/geostyler/geostyler-sld-parser/compare/v5.4.0...v6.0.0-next.1) (2024-06-25)


### ⚠ BREAKING CHANGES

* You may need to adapt your imports. Also the
location of the browser build has changed.

### Features

* update package versions and switch to esm build ([42e6a2c](https://github.com/geostyler/geostyler-sld-parser/commit/42e6a2c662689e1c1ffcb6efa8c5402183d88d25))


### Bug Fixes

* fix commitlint config ([c1db90d](https://github.com/geostyler/geostyler-sld-parser/commit/c1db90de873c0e410b19a3e82e59a6cf96caa4b9))
* update commitlint ([390e668](https://github.com/geostyler/geostyler-sld-parser/commit/390e668487f86976b4e9b5a3afaf20b8ca04f800))
* update geostyler-style & cleanup package.json ([4183cb2](https://github.com/geostyler/geostyler-sld-parser/commit/4183cb26c3673e68bd6ed118a856212063224897))
* update geostyler-style version ([fe34f47](https://github.com/geostyler/geostyler-sld-parser/commit/fe34f47e5943f8ac9d3fa0dc8fcebf04a64baca4))
* update null checks for number values ([299b6c3](https://github.com/geostyler/geostyler-sld-parser/commit/299b6c3d5dbe890022f4d072c7ca57a013cbfc15))
* update semantic release ([809698c](https://github.com/geostyler/geostyler-sld-parser/commit/809698c1a8802ba15fca60e6163c7ae415733695))
* use bundler module resolution ([79eebaf](https://github.com/geostyler/geostyler-sld-parser/commit/79eebaf68cb1c49e5f91cb13f85239851643f67a))
* use node 20 ([aa0cdcd](https://github.com/geostyler/geostyler-sld-parser/commit/aa0cdcdbb6362b2362671faaed1824a5ee59bf26))
* use preserve module strategy ([40ffc9c](https://github.com/geostyler/geostyler-sld-parser/commit/40ffc9c3739889d76fc4ab225e6999abbc07b134))

### Bug Fixes

* offset Y for Textsymbolizer ([#932](https://github.com/geostyler/geostyler-sld-parser/issues/932)) ([398ce0c](https://github.com/geostyler/geostyler-sld-parser/commit/398ce0ca844e17d06e37ebc3eb8099c1d71f454f)), closes [#566](https://github.com/geostyler/geostyler-sld-parser/issues/566)

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

## [5.4.0](https://github.com/geostyler/geostyler-sld-parser/compare/v5.3.1...v5.4.0) (2024-06-21)


### Features

* Extract SLD version from SLD ([#926](https://github.com/geostyler/geostyler-sld-parser/issues/926)) ([56f231b](https://github.com/geostyler/geostyler-sld-parser/commit/56f231bf57b15242a5451ce9797847018053d201))
* implement i18n for error messages [#923](https://github.com/geostyler/geostyler-sld-parser/issues/923) [#924](https://github.com/geostyler/geostyler-sld-parser/issues/924) ([#928](https://github.com/geostyler/geostyler-sld-parser/issues/928)) ([e01c8c8](https://github.com/geostyler/geostyler-sld-parser/commit/e01c8c837bfcb0dc36912f8cc25581ccc2bfe3f3))


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
