const crypto = require('crypto');
const https = require('https');
const {URL} = require('url');

function TempMail (options = {API_URL: 'https://api.temp-mail.ru', headers: {}}) {

  this.API_URL = options.API_URL;
  this.HEADERS = options.headers;

  /**
   * Makes GET request
   * @param {string} url
   * @returns {Promise}
   */
  this.get = function (url) {
    let getOptions = {
      hostname: new URL(url).hostname,
      path: new URL(url).pathname
    };
    getOptions.headers = this.HEADERS;

    return new Promise((resolve, reject) => {
      https
        .get(getOptions, (res) => {
          if (res.statusCode < 200 || res.statusCode > 299) {
            reject(new Error(`Request failed: ${res.statusCode}`));
          }

          let data = '';

          res
            .on('data', (chunk) => {
              data += chunk;
            })
            .on('end', () => resolve(data));
        })
        .on('error', reject);
    });
  }

  /**
   * Generates MD5 hash from email
   * @param {string} email
   * @returns {string}
   */
  function getEmailHash (email) {
    return crypto.createHash('md5').update(email).digest('hex');
  }

  /**
   * Generates random email in given domains
   * @param {Array} domains
   * @param {number} [len=7]
   * @param {string} prefix
   * @returns {string}
   */
  function getRandomEmail (domains, len = 7, prefix = '') {
    const alfabet = '1234567890abcdefghijklmnopqrstuvwxyz';

    let name = !prefix ? '' : `${prefix}-`;

    for (let i = 0; i < len; i++) {
      const randomChar = Math.round(Math.random() * (alfabet.length - 1));
      name += alfabet.charAt(randomChar);
    }

    const domain = domains[Math.floor(Math.random() * domains.length)];

    return name + domain;
  }

  /**
   * Receives available domains
   * @returns {Promise.<Array, Error>}
   */
  this.getAvailableDomains = function () {
    return this.get(`${this.API_URL}/request/domains/format/json/`).then(JSON.parse);
  }

  /**
   * Generates email on temp-mail.ru
   * @param {number} [len]
   * @param {string} prefix
   * @returns {Promise.<String, Error>}
   */
  this.generateEmail = function (len, prefix) {
    return this.getAvailableDomains()
      .then(availableDomains => getRandomEmail(availableDomains, len, prefix));
  }

  /**
   * Receives inbox from temp-mail.ru
   * @param {string} email
   * @returns {Promise.<(Object|Array), Error>}
   */
  this.getInbox = function (email) {
    if (!email) {
      throw new Error('Please specify email');
    }

    return this.get(`${this.API_URL}/request/mail/id/${getEmailHash(email)}/format/json/`).then(JSON.parse);
  }

  this.deleteMail = function (mailId) {
    return new Promise((resolve, reject) => {
      if (!mailId) {
        return reject('Please specify mail identifier');
      }

      return this.get(`${this.API_URL}/request/delete/id/${mailId}/format/json/`).then(JSON.parse);
    });
  }

}

module.exports = TempMail;
