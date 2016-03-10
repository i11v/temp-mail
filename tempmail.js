'use strict';

var crypto = require('crypto')
  , http = require('http')
  , Promise = require('promise');

var API_URL = 'https://api.temp-mail.ru';

function _getEmailHash(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

function _getRandomEmail(domains, len) {
  return Math.random().toString(36).substring(len ? len : 7) + domains[Math.floor(Math.random() * domains.length)];
}

function _getAvailableDomains() {
  return new Promise(function (resolve, reject) {
    http
      .get(API_URL + '/request/domains/format/json/')
      .on('response', function (res) {
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        }).on('end', function () {
          resolve(data);
        });
      })
      .on('error', reject);
  }).then(JSON.parse).catch(console.error);
}

function _generateEmail(len) {
  return _getAvailableDomains().then(function (availableDomains) {
    return _getRandomEmail(availableDomains, len);
  });
}

function _getIndbox(email) {
  return new Promise(function (resolve, reject) {
    if (!email) {
      return reject('Please specify email');
    }

    http
      .get(API_URL + '/request/mail/id/' + _getEmailHash(email) + '/format/json/')
      .on('response', function (res) {
        var data = '';

        res.on('data', function (chunk) {
          data += chunk;
        }).on('end', function () {
          resolve(data);
        });
      })
      .on('error', reject);
  }).then(JSON.parse).catch(console.error);
}

module.exports = {
  generateEmail: _generateEmail,
  getInbox: _getIndbox
};
