

<p align="center">
  <img alt="Lerna" src="https://avatars1.githubusercontent.com/u/47536745?s=200&v=4" width="200">
</p>

<p align="center">
  A multi-package repository with the lucidworks fusion plugin for commercetools sunrise store.
</p>

#

- [About](#about)
- [Getting Started](#getting-started)
- [Run the Sunrise SPA](#run-the-sunrise-spa)
- [Fusion SDK Configuration](#fusion-sdk-configuration)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)

## About

<p>This monorepository created by New Elevation contains a plug-in (fusion-sdk) intended to enable the extraction of catalog data from commercetools into Lucidworks to provide a more dynamic search option for users.  This data once indexed can be queried and searched from the Sunrise SPA (store) using the Lucidworks Fusion API
</p>

<p>
  <img alt="Architecture Diagram" src="https://user-images.githubusercontent.com/6887820/100938471-92168980-34a9-11eb-8344-b9cd6e7c5b3a.png">
</p>

## Getting Started
Clone the Repository - `git clone git@github.com:lucidworks/commercetools-connector.git`

Install Lerna and Yarn - `npm i -g lerna yarn`

From under the lucidworks repository, install the package dependencies - `lerna bootstrap`

## Installing fusion-sdk
The fusion-sdk is Node module that should be installed as package.json dependency for your Node/JS project or application

Steps   | with [Yarn](https://yarnpkg.com/)  | with [NPM](https://www.npmjs.com/) |
------- | ---------------------------------- | ---------------------------------- |
Install | `yarn add fusion-sdk`              | `npm install`           |

## Run the Sunrise SPA

Steps   | with [Yarn](https://yarnpkg.com/)  | with [NPM](https://www.npmjs.com/) |
------- | ---------------------------------- | ---------------------------------- |
Run     | `yarn serve`                       | `npm run serve`                    |

## Fusion SDK Configuration

In order for the fusion search to function properly the src/config.js needs to have the correct values in the export() function.

```javascript
static export() {
    return {
      FUSION_PARSER_TYPE: '<parser type - e.g. csv>',
      FUSION_JWT_TOKEN: '<jwt token>',
      FUSION_HOST: '<host>',
      FUSION_PORT: '<port>',
      FUSION_APP: '<app name>',
      FUSION_QUERY_PROFILE: '<query profile name>',
      FUSION_INDEX_PROFILE: '<index profile name>',
      FUSION_PARSER: '<parser name>'
    };
  }
  ```
  ## How It Works

  Before we can begin searching on the Sunrise SPA we must first load our data in our Fusion App.  If you downloaded your commercetools products as JSON then in the Fusion App we recommend you turn off the JSON parser and set the Text parser to enable `split lines` in order to create multiple records per line.  The JSON parser needs additional settings and is not quite as fast as the text.  However if you choose to use the JSON parse make sure the `JSON list handling` is set to `index_numbered`.  The plugin supports both parsers.  Support for CSV is in the works.

  From under the fusion-sdk package - `node src/api/index.js <path to your products json>`

  Now you should be able to search right away on the store.

  ## Troubleshooting

  The plugin defaults to Text parser search.  If you indexed your data using the JSON parser, then you would have to enable it in the src/api/query.js.  Uncomment the call to json and comment out the call to text.

  ```javascript
//let sunriseJsonIndexed = getSunriseJson_indexed(json.response.docs);
//resolve(JSON.stringify(sunriseJsonIndexed))

let sunriseJsonTxt = getSunriseJson_text(json.response.docs, sortOrig);
resolve (JSON.stringify(sunriseJsonTxt));
```














