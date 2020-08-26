# fusion-sdk

[![build status](https://img.shields.io/travis/com/newelevation/fusion-sdk.svg)](https://travis-ci.com/newelevation/fusion-sdk)
[![code coverage](https://img.shields.io/codecov/c/github/newelevation/fusion-sdk.svg)](https://codecov.io/gh/newelevation/fusion-sdk)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/newelevation/fusion-sdk.svg)](LICENSE)

> New Elevation Lucidworks Fusion API SDK


## Table of Contents

* [Design Documentation](#design-documentation)
  * [0.1.0 - Notes](#010---notes)
* [Install](#install)
  * [Environment](#environment)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)
* [Package Management](#package-management)


## Design Documentation

[High Level Design Document](https://docs.google.com/document/d/174PAAcKplVRrK9wRnCtJeZqzkz9bKVR11LceW4G7Lk8/edit?ts=5e7a25b7#)

Operations

* Create Collection
* Describe Schema
* Create Data Source
* Create Job trigger on DataSource

### 0.1.0 - Notes


## Install

[npm][]:

```sh
npm install fusion-sdk
```

[yarn][]:

```sh
yarn add fusion-sdk
```

### Environment

The following Environment variables are required.  This module uses dotEnv to manage these, so create a local .env file with your specific values.

```shell
      FUSION_SIGNING_KEY: '',
      FUSION_HOST: '',
      FUSION_PORT: 0,
      FUSION_ISS: '',
      FUSION_SUB: '',
      FUSION_USERNAME: ''
```


## Usage

```js
const FusionSdk = require('fusion-sdk');

const fusionSdk = new FusionSdk();

console.log(fusionSdk.renderName());
// script
```


## Contributors

| Name                 | Website                   |
| -------------------- | ------------------------- |
| **Raul Quintanilla** | <http://newelevation.com> |


## License

[MIT](LICENSE) © [Raul Quintanilla](http://newelevation.com)


## Package Management

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
