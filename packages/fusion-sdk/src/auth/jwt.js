/**
 *
 * Inspiration and test signing here : https://jwt.io/#debugger-io
 * @class JWT
 */
class JWT {
  /**
   *
   * @param {*} payload
   * @param {*} secretOrPrivateKey
   * @returns
   * @memberof JWT
   */
  static sign(payload, secretOrPrivateKey) {
    if (!payload) {
      throw new Error('Payload is required for JWT signature.');
    }

    const jwt = require('jsonwebtoken');

    const token = jwt.sign(payload, secretOrPrivateKey);

    return token;
  }
}

module.exports = JWT;
