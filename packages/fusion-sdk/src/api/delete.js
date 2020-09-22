const fetch = require('node-fetch');
const Config = require('../config');
const {performance} = require('perf_hooks');

/**
 * Component wrapper for Fusion API - Users
 *
 * @class Delete
 */
class Delete {
  /**
   * Create an index using a json file
   *
   * @memberof Delete
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const recordId = id || process.argv.slice(2)[0];

      console.log("recordId: " + recordId);  

      fetch(
        `${Config.url()}/api/apollo/index-pipelines/_system/collections/${Config.export().FUSION_COLLECTION}/index`,
        //`${Config.url()}/solr/${Config.export().FUSION_COLLECTION}/update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Config.jwtToken()}`,
            //'Content-Type': 'application/json'
            'Content-Type': 'application/vnd.lucidworks-document'
          },
          //body: require('fs').createReadStream(`{ "delete":"adcb16da-ff14-434f-b0c5-496d33700730" }`)
          body: JSON.stringify('[{"id": "adcb16da-ff14-434f-b0c5-496d33700730","commands": [{"name": "delete","params": {}},{"name": "commit","params": {}}]}]')
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
    const del = new Delete();
    const result = await del.delete();
    const t1 = performance.now();
    console.log('deleted in ' + (t1 - t0) + ' milliseconds.');
    // console.log(require('util').inspect(result, false, null, true));
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})();

module.exports = Delete;
