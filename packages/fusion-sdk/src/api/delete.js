const fetch = require('node-fetch');
const Config = require('../config');
const {performance} = require('perf_hooks');

/**
 * Component wrapper for Fusion API - Delete
 *
 * @class Delete
 */
class Delete {
  /**
   * Delete an item
   *
   * @memberof Delete
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const recordId = id || process.argv.slice(2)[0];

      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/index/${Config.export().FUSION_INDEX_PROFILE}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Config.jwtToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: recordId,
            action: 'DELETE'
          })
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
 * usage : node src/api/delete.js <product id>
 */
(async () => {
  console.log('start');
  const t0 = performance.now();
  try {
    const del = new Delete();
    await del.delete();
    const t1 = performance.now();
    console.log('deleted in ' + Math.round(t1 - t0) + ' milliseconds.');
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})();

module.exports = Delete;
