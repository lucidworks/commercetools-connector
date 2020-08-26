/* eslint-disable */
import {
  withToken, groupFetchJson, makeConfig, toUrl, baseUrl,
} from './api';

import {FusionQuery, runQuery} from 'fusion-sdk';

const products = {
  get: withToken(
     (query, { access_token: accessToken }) => {

        if (query.category) {
          query.filter = `categories.id:subtree("${query.category}")`;
          delete query.category;
        }

        const urlparams = Object.entries(query)
        .filter(([, v]) => v !== undefined);

      if(isSearch(urlparams)) {
        // const fusion = new FusionQuery();
        // return fusion.runQuery(getSearchValue(urlparams))
        //return JSON.parse(runQuery(urlparams))
        return JSON.parse('{"limit":75,"offset":0,"count":0,"total":0,"results":[],"facets":{}}');
      } else {
        return groupFetchJson(
          toUrl(
            `${baseUrl}/product-projections/search`,
            { query },
          ),
          makeConfig(accessToken),
        );
      } 
    },
  ),
  getItem: query => query,
};

function getSearchValue(obj) {
  for (const [key, value] of obj) {
    //console.log(`${key}: ${value}`)
    if(key === 'text.en' || key === 'text.de') {
      return value;
    }
  }
}

function isSearch(obj) {
  for (const [key, value] of obj) {
    if(key === 'text.en' || key === 'text.de') {
      return true;
    }
  }
  return false;
}

export default products;
