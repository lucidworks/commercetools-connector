const fetch = require('node-fetch');
const Config = require('../config');
const { isNull } = require('util');
const { performance } = require('perf_hooks')

/**
 * Component wrapper for Fusion API - Users
 *
 * @class User
 */
class Index {
  /**
   * Create an index using a json file
   *
   * @memberof Index
   */
  async create(dataJson) {
    return new Promise((resolve, reject) => {
    
    const data = dataJson || process.argv.slice(2)[0];  

    fetch(
        `${Config.url()}/api/apps/${process.env.FUSION_APP}/index/${process.env.FUSION_COLLECTION}/?parserId=sunrise`,
        {
          method: 'POST',
          headers: { authorization: `Bearer ${Config.jwtToken()}` },
          body: require('fs').createReadStream(data)
        }
      )
        .then((response) => response.json())
        .then((json) => {
          resolve(json);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}

(async () => {
  console.log('start');
  var t0 = performance.now();
  try {
    const ndx = new Index();
    const result = await ndx.create(); // your personal
    var t1 = performance.now();
    //console.log("indexed in " + (t1 - t0) + " milliseconds.");
    // you can write instead of `then` statement below
    console.log(require('util').inspect(result, false, null, true));
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})()

module.exports = Index;
