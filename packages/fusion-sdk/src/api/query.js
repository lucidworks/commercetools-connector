const fetch = require('node-fetch');
const Config = require('../config');

/**
 * Run a query
 *
 * @param {string} query
 * @param {string} sort
 * @param {string} parser
 * @param {string} queryField
 * @param {string[]} facets
 * @param {Object} facetQueries
 */
/* eslint-disable-next-line max-params */
async function runQuery(query, sort, parser, queryField, facets, facetQueries) {
  let sortParam = '';
  if (typeof sort !== 'undefined') {
    sortParam = '&sort=' + sort.replace(/\s/g, '_dt ');
  }

  let queryFieldParam = '';
  if (typeof queryField !== 'undefined') {
    queryFieldParam = '&qf=' + queryField;
  }

  const facetParams = buildFacetParams(facets, facetQueries);

  const urlParams = `q=${query}${sortParam}${queryFieldParam}${facetParams}`;

  if (typeof parser === 'undefined') {
    parser = Config.export().FUSION_PARSER_TYPE;
  }

  return new Promise((resolve, reject) => {
    fetch(
      /* eslint-disable-next-line max-len */
      `${Config.url()}/api/apps/${Config.export().FUSION_APP}/query/${Config.export().FUSION_QUERY_PROFILE}?${urlParams}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Config.jwtToken()}`
        }
      }
      /* eslint-disable-next-line promise/prefer-await-to-then */
    ).then(response => response.json())
    /* eslint-disable-next-line promise/prefer-await-to-then */
      .then(json => {
        if (!json.response) {
          throw new Error(json.message);
        }

        let sunriseResponse = json;
        if (parser === 'json') {
          sunriseResponse = parseSunriseJson(json);
        } else if (parser === 'text') {
          sunriseResponse = parseSunriseText(json, sort);
        } else {
          sunriseResponse = parseSunriseCsv(json);
        }

        resolve(JSON.stringify(sunriseResponse));
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

/**
 * Constructs the facet query syntax based on provided facets and facetQueries
 * facets should be provided in a string array matching the syntax on the
 * product docs facetQueries should be provided in an object based on the
 * following structure {facet_field1: facet_value1, facet_field2: facet_value2}
 * @param {String[]} facets
 * @param {Object} facetQueries
 */
function buildFacetParams(facets, facetQueries) {
  if (!facets && !facetQueries) {
    return '';
  }

  const facetParam = ['&facet=true'];
  if (Array.isArray(facets)) {
    facetParam.push(`&facet.field=${facets.join('&facet.field=')}`);
  }

  if (typeof facetQueries === 'object') {
    const facetQuery = Object.keys(facetQueries)
      .map(key => key + ':' + facetQueries[key])
      .join('&fq=');
    facetParam.push(`&fq=${facetQuery}`);
  }

  return facetParam.join('');
}

/**
 * Return the fusion response in a commercetools json format
 * @param {*} json
 */
/* istanbul ignore next */
function parseSunriseText(json, sort) {
  const sunriseText = {};
  const results = [];
  console.log('starting to parseSunriseText');

  if (
    !json.response ||
    !Array.isArray(json.response.docs) ||
    !json.response.docs.length > 0
  ) {
    return sunriseText;
  }

  json.response.docs.forEach(doc => {
    results.push(JSON.parse(doc.body_t.slice(0, doc.body_t.length - 1)));
  });

  // sort for store - based on lastModifiedAt
  if (typeof sort !== 'undefined') {
    const sortOrder = sort.split(' ')[1];
    if (sortOrder === 'asc') {
      results.sort((a, b) => (a.lastModifiedAt > b.lastModifiedAt) ? 1 : -1);
    } else {
      results.sort((a, b) => (a.lastModifiedAt < b.lastModifiedAt) ? 1 : -1);
    }
  }

  sunriseText.results = results;
  return sunriseText;
}

/**
 * Return the fusion response in a commercetools json format
 * @param {Object} json
 */
/* istanbul ignore next */
function parseSunriseJson(json) {
  const sunriseJson = {};
  const results = [];
  console.log('starting to parseSunriseJson');

  if (
    !json.response ||
      !Array.isArray(json.response.docs) ||
      !json.response.docs.length > 0
  ) {
    return sunriseJson;
  }

  json.response.docs.forEach(e => {
    const product = {};
    product.id = e.id;

    const name = {};
    name.en = e['name.en_s'];
    name.de = e['name.de_s'];
    product.name = name;

    const slug = {};
    slug.en = e['slug.en_s'];
    slug.de = e['slug.de_s'];
    product.slug = slug;

    const masterVariant = {};

    const images = [];
    const img = {};
    img.url = e['masterVariant.images.0.url_s'];
    const dimensions = {};
    dimensions.w = e['masterVariant.images.0.dimensions.w_i'];
    dimensions.h = e['masterVariant.images.0.dimensions.h_i'];
    img.dimensions = dimensions;
    images.push(img);
    masterVariant.images = images;

    const prices = [];
    for (let i = 0; i < 15; i++) {
      const priceElement = 'masterVariant.prices.' + i;
      if (Object.prototype.hasOwnProperty.call(
        e, priceElement + '.id_s'
      )) {
        const price = {};
        price.id = e[priceElement + '.id_s'];
        const value = {};
        value.type = e[priceElement + '.value.type_s'];
        value.currencyCode = e[priceElement + '.value.currencyCode_s'];
        value.centAmount = e[priceElement + '.value.centAmount_i'];
        value.fractionDigits = e[priceElement + '.value.fractionDigits_i'];
        price.value = value;

        if (Object.prototype.hasOwnProperty.call(
          e, priceElement + '.country_s'
        )) {
          price.country = e[priceElement + '.country_s'];
        }

        if (Object.prototype.hasOwnProperty.call(
          e, priceElement + '.customerGroup.id_s'
        )) {
          const customerGroup = {};
          customerGroup.typeId = e[priceElement + '.customerGroup.typeId_s'];
          customerGroup.id = e[priceElement + '.customerGroup.id_s'];
          price.customerGroup = customerGroup;
        }

        if (Object.prototype.hasOwnProperty.call(
          e, priceElement + '.channel.id_s'
        )) {
          const channel = {};
          channel.typeId = e[priceElement + '.channel.typeId_s'];
          channel.id = e[priceElement + '.channel.id_s'];
          price.channel = channel;
        }

        prices.push(price);
      }
    }

    masterVariant.prices = prices;
    masterVariant.sku = e['masterVariant.sku_s'];

    product.masterVariant = masterVariant;
    results.push(product);
  });
  sunriseJson.results = results;
  return sunriseJson;
}

/**
 * Return the fusion response in a commercetools json format
 * @param {Object} json
 */
function parseSunriseCsv(json) {
  const sunriseCsv = {};
  const results = [];
  console.log('starting to parseSunriseCsv');

  sunriseCsv.facets = parseFacets(json.facet_counts);

  if (
    !json.response ||
    !Array.isArray(json.response.docs) ||
    !json.response.docs.length > 0
  ) {
    return sunriseCsv;
  }

  json.response.docs.forEach(doc => {
    const product = {};
    product.id = doc.id;

    const name = {};
    name.en = doc['name.en_s'];
    name.de = doc['name.de_s'];
    product.name = name;

    const slug = {};
    slug.en = doc['slug.en_s'];
    slug.de = doc['slug.de_s'];
    product.slug = slug;

    const masterVariant = {};
    masterVariant.sku = doc.sku_s;

    const images = [];
    const img = {};
    img.url = doc.images_s.split('||')[0];

    images.push(img);
    masterVariant.images = images;

    const prices = [];
    doc.prices_t.split(';').forEach(doc_price => {
      const price = {};
      const spaceDelimited = doc_price.split(' ');
      const hashtagDelimited = spaceDelimited[1].split('#');

      const value = {};
      value.type = 'centPrecision';
      value.centAmount = hashtagDelimited[0];
      value.fractionDigits = '2';

      if (spaceDelimited[0].includes('-')) {
        value.currencyCode = spaceDelimited[0].split('-')[1];
        price.country = spaceDelimited[0].split('-')[0];
      } else {
        value.currencyCode = spaceDelimited[0];
      }

      price.value = value;

      const isB2b = spaceDelimited[2];
      if (isB2b) {
        const customerGroup = {};
        customerGroup.typeId = 'b2b';
        customerGroup.id = 'n/a';
        price.customerGroup = customerGroup;
      }

      const channel = hashtagDelimited[1];
      if (channel) {
        const channelObj = {};
        channelObj.typeId = 'store';
        channelObj.id = channel;
        price.channel = channelObj;
      }

      prices.push(price);
    });
    masterVariant.prices = prices;

    product.masterVariant = masterVariant;
    results.push(product);
  });
  sunriseCsv.results = results;

  return sunriseCsv;
}

function parseFacets(facets) {
  return Object.keys(facets.facet_fields)
    .filter(ff =>
      facets.facet_fields[ff] &&
      Array.isArray(facets.facet_fields[ff]) &&
      facets.facet_fields[ff].length > 0
    ).map(ff => {
      const facetField = facets.facet_fields[ff];
      const terms = [];
      const typeCount = facetField.length / 2;
      for (let i = 0; i < typeCount; i++) {
        const facetTerm = {
          term: facetField[i * 2],
          count: facetField[(i * 2) + 1]
        };
        terms.push(facetTerm);
      }

      return {
        [`variants.attributes.${ff}`]: {
          terms
        }};
    });
}

module.exports = {runQuery, buildFacetParams, parseSunriseCsv};
