const fetch = require('node-fetch');
const Config = require('../config');

/**
 * Component wrapper for Fusion API - Users
 *
 * @class User
 */
class User {
  /**
   * List all Users
   *
   * @memberof User
   */
  async list() {
    return new Promise((resolve, reject) => {
      fetch(`${Config.url()}/api/users`, {
        method: 'GET',
        headers: {authorization: `Bearer ${Config.jwtToken()}`}
      })
        .then(response => response.json())
        .then(json => {
          resolve(json);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports = User;
