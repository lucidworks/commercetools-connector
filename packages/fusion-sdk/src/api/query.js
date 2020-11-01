/* eslint-disable */
const fetch = require('node-fetch');
const Config = require('../config');
//const { performance } = require('perf_hooks')

/**
 * Component wrapper for Fusion API - Query
 *
 * @class Query
 */
class Query {

  /**
   * Run a query
   *
   * @memberof Query
   */
  async run(query, sort, parser, queryField, facets, facetQueries) {

    let sortParam = '';
    if(typeof sort !== 'undefined')
      sortParam = '&sort=' + sort.replace(/\s/g, '_dt ');

    let queryFieldParam = '';
    if(typeof queryField !== 'undefined')
      queryFieldParam = '&qf=' + queryField;

    const facetParams = buildFacetParams(facets, facetQueries);

    let urlParams = 'q=' + query + sortParam + queryFieldParam + facetParams; 

    if(typeof parser === 'undefined')
      parser = Config.export().FUSION_PARSER_TYPE

    return new Promise((resolve, reject) => {
      fetch(
        `${Config.url()}/api/apps/${Config.export().FUSION_APP}/query/${Config.export().FUSION_COLLECTION}?${urlParams}`,
        {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${Config.jwtToken()}`
          },
        }
      ) .then((response) => response.json())
        .then((json) => {

            let sunriseJsonTxt = json;
            if(parser === 'json') {
              sunriseJsonTxt = getSunriseJson_indexed(json.response.docs);
            } else if (parser === 'text') {
              sunriseJsonTxt = getSunriseJson_text(json.response.docs, sort);
            }
  
            resolve (JSON.stringify(sunriseJsonTxt));
          
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}

/**
 * Constructs the facet query syntax based on provided facets and facetQueries
 * facets should be provided in a string array matching the syntax on the product docs
 * facetQueries should be provided in an object matching the 
 * @param {String[]} facets 
 * @param {Object} facetQueries 
 */
function buildFacetParams(facets, facetQueries) {
  if(!facets && !facetQueries)
    return '';  // TODO: determinine if this should return undefined/null instead of empty string
  let facetParam = ['&facet=true'];
  if(Array.isArray(facets))
    facetParam.push(`&facet.field=${facets.join('&facet.field=')}`);
  if(typeof facetQueries === 'object') {
    const facetQuery = Object.keys(facetQueries)
      .map((key) => key + ':' + facetQueries[key])
      .join('&fq=');
    facetParam.push(`&fq=${facetQuery}`);
  }
  return facetParam.join('');
}

/**
 * Return the fusion response in a commercetools json format
 * @param {*} docs 
 */
/* istanbul ignore next */
function getSunriseJson_text(docs, sort) {
  let sunriseJson = {}
  let results = [];
  docs.forEach((e) => {
    results.push(JSON.parse(e.body_t.substring(0, e.body_t.length - 1)));
  });

  //sort for store - based on lastModifiedAt
  if(typeof sort !== 'undefined') {
    let sortOrder = sort.split(' ')[1];
    if('asc' === sortOrder)
      results.sort((a, b) => (a.lastModifiedAt > b.lastModifiedAt) ? 1 : -1)
    else
      results.sort((a, b) => (a.lastModifiedAt < b.lastModifiedAt) ? 1 : -1)
  }

  sunriseJson.results = results;
  return sunriseJson;
}

/**
 * Return the fusion response in a commercetools json format
 * @param {*} docs 
 */
  /* istanbul ignore next */
function getSunriseJson_indexed(docs) {

    let sunriseJson = {};
    let results = [];
    docs.forEach((e) => {

      let product = {};
      product['id'] = e.id;

      let name = {};
      name['en'] = e['name.en_s'];
      name['de'] = e['name.de_s'];
      product.name = name;

      let slug = {};
      slug['en'] = e['slug.en_s'];
      slug['de'] = e['slug.de_s'];
      product.slug = slug;

      let masterVariant = {};
      
      let images = [];
      let img = {};
      img['url'] = e['masterVariant.images.0.url_s'];
      let dimensions = {}
      dimensions['w'] = e['masterVariant.images.0.dimensions.w_i'];
      dimensions['h'] = e['masterVariant.images.0.dimensions.h_i'];
      img.dimensions = dimensions;
      images.push(img);
      masterVariant.images = images;

      let prices = [];
      for(let i=0;i<15;i++) {
        let priceElement = 'masterVariant.prices.'+i;
        if(e.hasOwnProperty(priceElement + '.id_s')) {
          let price = {};
          price['id'] = e[priceElement + '.id_s'];
          let value = {};
          value['type'] = e[priceElement + '.value.type_s'];
          value['currencyCode'] = e[priceElement + '.value.currencyCode_s'];
          value['centAmount'] = e[priceElement + '.value.centAmount_i'];
          value['fractionDigits'] = e[priceElement + '.value.fractionDigits_i'];
          price.value = value;

          if(e.hasOwnProperty(priceElement + '.country_s'))
            price['country'] = e[priceElement + '.country_s'];

          if(e.hasOwnProperty(priceElement + '.customerGroup.id_s')) {
            let customerGroup = {}
            customerGroup['typeId'] = e[priceElement + '.customerGroup.typeId_s'];
            customerGroup['id'] = e[priceElement + '.customerGroup.id_s'];
            price.customerGroup = customerGroup;
          }

          if(e.hasOwnProperty(priceElement + '.channel.id_s')) {
            let channel = {}
            channel['typeId'] = e[priceElement + '.channel.typeId_s'];
            channel['id'] = e[priceElement + '.channel.id_s'];
            price.channel = channel;
          }

          prices.push(price);
        }
      }
      
      masterVariant.prices = prices;
      masterVariant['sku'] = e['masterVariant.sku_s'];

      product.masterVariant = masterVariant;
      results.push(product);

    });

    sunriseJson.results = results;
    return sunriseJson;

}

/**
 * TEST for command line use
 * usage:  node src/api/query.js wallet
 */
// (async () => {
//   console.log('start')
//   var t0 = performance.now();
//   try {
//     const qry = new Query();

//     const result = await qry.run(process.argv.slice(2)[0], '_dt asc')

//     var t1 = performance.now();
//     console.log("queried in " + (t1 - t0) + " milliseconds.");
//     console.log(require('util').inspect(result, false, null, true));

//   } catch (err) {
//     console.error(err.message);
//   } finally {
//     console.log('end');
//   }
// })()

module.exports = {Query, buildFacetParams}