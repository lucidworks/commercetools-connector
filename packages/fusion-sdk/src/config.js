require('dotenv').config();

const JWT = require('./auth/jwt');

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
      FUSION_PARSER_TYPE: '',
      /* eslint-disable-next-line max-len */
      FUSION_JWT_TOKEN: '',
      FUSION_SIGNING_KEY: '',
      FUSION_HOST: '',
      FUSION_PORT: '',
      FUSION_ISS: '',
      FUSION_SUB: '',
      FUSION_USERNAME: '',
      FUSION_APP: '',
      FUSION_QUERY_PROFILE: '',
      FUSION_INDEX_PROFILE: '',
      FUSION_PARSER: '',
      /* eslint-disable-next-line max-len */
      FUSION_AUTH: ''
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
    } else {
      const token = JWT.sign(
        Config.jwtPayload(),
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
