/* eslint-disable */
import { withToken, groupFetchJson, makeConfig, toUrl, baseUrl } from "./api";

//process.env.FUSION_SIGNING_KEY = 'abcd1234';
//const runQuery = require ('fusion-sdk/src/api/query').runQuery;
const fusionQuery = require("fusion-sdk/src/api/query");

const products = {
  get: withToken((query, { access_token: accessToken }) => {
    if (query.category) {
      query.filter = `categories.id:subtree("${query.category}")`;
      delete query.category;
    }

    const urlparams = Object.entries(query).filter(([, v]) => v !== undefined);

    let searchArray = isSearch(urlparams);
    if (searchArray[0]) {
      return fusionQuery
        .runQuery(
          searchArray[1],
          searchArray[2],
          "csv",
          undefined,
          ["size_s", "designer_s", "color_s"],
          query.filters
        )
        .then(JSON.parse);
    } else {
      return groupFetchJson(
        toUrl(`${baseUrl}/product-projections/search`, { query }),
        makeConfig(accessToken)
      );
    }
  }),
  getItem: (query) => query,
};

// function getSearchValue(obj) {
//   for (const [key, value] of obj) {
//     //console.log(`${key}: ${value}`)
//     if(key === 'text.en' || key === 'text.de') {
//       return value;
//     }
//   }
// }

function isSearch(obj) {
  const searchArray = new Array(3);
  for (const [key, value] of obj) {
    if (key === "text.en" || key === "text.de") {
      searchArray[0] = true;
      searchArray[1] = value;
    }
    if (key === "sort") {
      searchArray[2] = value;
    }
  }
  return searchArray;
}

export default products;
