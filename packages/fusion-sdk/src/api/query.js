/* eslint-disable */
const fetch = require('node-fetch');
const Config = require('../config');
const { performance } = require('perf_hooks')

/**
 * Component wrapper for Fusion API - Query
 *
 * @class Query
 */
class Query {
  
  constructor() {
    console.log('query created');
  }

  /**
   * Run a query
   *
   * @memberof Query
   */
  async run(queryString) {

    const query = queryString || process.argv.slice(2)[0];

    return new Promise((resolve, reject) => {
      fetch(
        `${Config.url()}/api/apps/${process.env.FUSION_APP}/query/${process.env.FUSION_COLLECTION}?q=${query}`,
        {
          method: 'GET',
          headers: { authorization: `Bearer ${Config.jwtToken()}` },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          // var results = [];
          // let docs = json.response.docs;
          // for(var i = 0; i < docs.length; i++) {
          //   let prod = JSON.parse(docs[i].body_t);
          //   results[i] = prod[0];
          // }
          // var root = {};
          // root.results = results.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
          // resolve(JSON.stringify(root));
          //let jsonStr = '{"results":[{"id":"d6f5c363-5cfa-4000-bfe8-3c3130c4a03e","name":{"en":"Wallet “Studio Cappelli“ Gabs multi","de":"Brieftasche „Studio Cappelli“ Gabs multi"},"slug":{"en":"gabs-wallet-gmoney17-145-multi","de":"gabs-brieftasche-gmoney17-145-multi"},"masterVariant":{"images":[{"url":"https://s3-eu-west-1.amazonaws.com/commercetools-maximilian/products/072377_1_large.jpg","dimensions":{"w":0,"h":0}}],"prices":[{"value":{"type":"centPrecision","currencyCode":"USD","centAmount":10625,"fractionDigits":2},"id":"90bcb5e2-dd2c-4cc3-8dbd-e7a9af1cae7e"}],"sku":"A0E200000001WRP"}}]}'
          resolve('{"limit":75,"offset":0,"count":0,"total":0,"results":[],"facets":{}}');
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}


(async () => {
  console.log('start')
  var t0 = performance.now();
  try {
    const qry = new Query();
    const result = await qry.run() // your personal
    var t1 = performance.now();
    //console.log("queried in " + (t1 - t0) + " milliseconds.");
    // you can write instead of `then` statement below
    console.log(require('util').inspect(result, false, null, true));
  } catch (err) {
    console.error(err.message);
  } finally {
    console.log('end');
  }
})()


module.exports.FusionQuery = Query;
module.exports.runQuery = this.run;
