require('dotenv').config();

const JWT = require('./auth/jwt');
// const { config } = require('dotenv/types');

/**
 *
 *
 * @class Config
 */
class Config {
  /**
   *
   *
   * @static
   * @returns
   * @memberof Config
   */
  static export() {
    return {
      FUSION_PARSER_TYPE: 'csv', // text, json, csv
      /* eslint-disable-next-line max-len */
      FUSION_JWT_TOKEN: '***REMOVED***',
      FUSION_SIGNING_KEY: 'Commercetools',
      FUSION_HOST: 'general.dcom.lucidworkstest.com',
      FUSION_PORT: '443',
      FUSION_ISS: 'sunrise',
      FUSION_SUB: 'sunrise',
      FUSION_USERNAME: 'commercetools_dev',
      FUSION_APP: 'Commercetools',
      FUSION_COLLECTION: 'sunrise',
      FUSION_INDEX_PROFILE: 'sunrise-testing',
      FUSION_PARSER: 'sunrise',
      /* eslint-disable-next-line max-len */
      FUSION_AUTH: '***REMOVED***
    };
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof Config
   */
  static url() {
    return `https://${Config.export().FUSION_HOST}:${
      Config.export().FUSION_PORT
    }`;
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof Config
   */
  static jwtPayload() {
    return {
      iss: process.env.FUSION_ISS,
      iat: Math.floor(Date.now() / 1000) + 257,
      sub: process.env.FUSION_SUB,
      username: process.env.FUSION_USERNAME
    };
  }

  /**
   *
   *
   * @static
   * @returns
   * @memberof Config
   */
  static jwtToken() {
    if (Config.export().FUSION_JWT_TOKEN) {
      // console.log('exists');
    } else {
      const token = JWT.sign(
        Config.jwtPayload(),
        // process.env.FUSION_SIGNING_KEY
        Config.export().FUSION_SIGNING_KEY
      );

      Config.export().FUSION_JWT_TOKEN = token;
    }

    return Config.export().FUSION_JWT_TOKEN;
  }

  static basicAuth() {
    return Config.export().FUSION_AUTH;
  }
}

module.exports = Config;
