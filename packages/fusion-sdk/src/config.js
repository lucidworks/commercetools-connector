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
      FUSION_SIGNING_KEY: '',
      FUSION_HOST: '',
      FUSION_PORT: 0,
      FUSION_ISS: '',
      FUSION_SUB: '',
      FUSION_USERNAME: '',
      FUSION_APP: ''
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
    return `http://${process.env.FUSION_HOST}:${process.env.FUSION_PORT}`;
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
}

module.exports = Config;
