require('dotenv').config();

const JWT = require('./auth/jwt');
//const { config } = require('dotenv/types');

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
      FUSION_SIGNING_KEY: 'abcd123',
      FUSION_HOST: '34.96.230.28',
      FUSION_PORT: '8764',
      FUSION_ISS: 'sunrise',
      FUSION_SUB: 'sunrise',
      FUSION_USERNAME: 'sunrise-user',
      FUSION_APP: 'sunrise',
      FUSION_COLLECTION: 'sunrise',
      FUSION_PARSER: 'sunrise',
      FUSION_AUTH: 'c3VucmlzZTpQQHNzdzByZA==' //c3VucmlzZTpQQHNzdzByZA==, c3VucmlzZS11c2VyOlBAc3N3MHJk
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
    return `http://${Config.export().FUSION_HOST}:${Config.export().FUSION_PORT}`;
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
    if (process.env.FUSION_JWT_TOKEN) {
      console.log('exists');
    } else {
       const token = JWT.sign(
        Config.jwtPayload(),
        process.env.FUSION_SIGNING_KEY
      );

      process.env.FUSION_JWT_TOKEN = token;
    }

    return process.env.FUSION_JWT_TOKEN;
  }

  static basicAuth() {
    return Config.export().FUSION_AUTH;
  }
}

module.exports = Config;
