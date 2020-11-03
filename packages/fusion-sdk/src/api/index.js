const fetch = require('node-fetch');
const Config = require('../config');
const {isNull} = require('util');
const {performance} = require('perf_hooks');

/**
 * Component wrapper for Fusion API - Index
 *
 * @class Index
 */
class Index {
  /**
   * Create an index using json
   *
   * @memberof Index
   */

   async create(jsonArray) {
    return new Promise((resolve, reject) => {
      const data = jsonArray || process.argv.slice(2)[0];
      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/index/${
          Config.export().FUSION_COLLECTION
        }/?parserId=${Config.export().FUSION_PARSER}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Config.jwtToken()}`
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

      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/index/${
          Config.export().FUSION_COLLECTION
        }/?parserId=${Config.export().FUSION_PARSER}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Config.jwtToken()}`,
            'Content-Type': 'text/csv'
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
    const result = await ndx.createFromFile().catch(e => {
      console.log('index errored out.')
      throw e
   })

    const t1 = performance.now();
    console.log('indexed in ' + Math.round(t1 - t0) + ' milliseconds.');
    // console.log(require('util').inspect(result, false, null, true));
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})();

module.exports = Index;
