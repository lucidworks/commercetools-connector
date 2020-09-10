const fetch = require('node-fetch');
const Config = require('../config');
const {isNull} = require('util');
const {performance} = require('perf_hooks');

/**
 * Component wrapper for Fusion API - Users
 *
 * @class User
 */
class Index {
  /**
   * Create an index using json
   *
   * @memberof Index
   */

   async create(jsonArray) {
    return new Promise((resolve, reject) => {
      const data = dataJson || process.argv.slice(2)[0];

      /**
       * we need to have a parser on fusion that parses json lists as 'indexed_numbered' and not 'multivalued' which is the default
       * use the name of that parser for the value of the parserId param
       */
      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/index/${
          Config.export().FUSION_COLLECTION
        }/?parserId=${Config.export().FUSION_PARSER}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Config.basicAuth()}`
          },
          // headers: { authorization: `Bearer ${Config.jwtToken()}` },
          body: jsonArray
        }
      )
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

   }
  async createFromFile(dataJson) {
    return new Promise((resolve, reject) => {
      const data = dataJson || process.argv.slice(2)[0];

      /**
       * we need to have a parser on fusion that parses json lists as 'indexed_numbered' and not 'multivalued' which is the default
       * use the name of that parser for the value of the parserId param
       */
      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/index/${
          Config.export().FUSION_COLLECTION
        }/?parserId=${Config.export().FUSION_PARSER}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Config.basicAuth()}`
          },
          // headers: { authorization: `Bearer ${Config.jwtToken()}` },
          body: require('fs').createReadStream(data)
        }
      )
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

/**
 * test for command line use
 *
 * usage : node src/api/index.js ./data.json
 */
(async () => {
  console.log('start');
  const t0 = performance.now();
  try {
    const ndx = new Index();
    const result = await ndx.create();
    const t1 = performance.now();
    console.log('indexed in ' + (t1 - t0) + ' milliseconds.');
    // console.log(require('util').inspect(result, false, null, true));
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})();

module.exports = Index;
