'use strict';

var crypto = require('crypto')
  , http = require('http');

var apiUrl = 'http://api.temp-mail.ru';

function TempmailWrapper(login, domain) {
  if (this instanceof TempmailWrapper) {
    this.login = login;
    this.domain = domain;
    this.apiUrl = apiUrl;

    this.init();
  } else {
    return new TempmailWrapper(login, domain);
  }
}

TempmailWrapper.prototype.init = function () {
  var _this = this;

  if (!_this.login) {
    _this.login = _this.generateLogin();
  }

  _this.getAvailableDomains()
    .on('response', function (res) {
      res.on('data', function (chunk) {
        _this.availableDomains = chunk.toString();
        _this.email = _this.getEmailAddress(_this.availableDomains);
        _this.emailHash = _this.getEmailHash(_this.login);
      });
    });
};

TempmailWrapper.prototype.getAvailableDomains = function () {
  var _this = this
    , req = http.get(_this.apiUrl + '/request/domains/format/json/');

  req.on('error', function (err) {
    console.error(err);
  });

  return req;
};

TempmailWrapper.prototype.generateLogin = function (len) {
  return this.login = Math.random().toString(36).substring(len ? len : 7);
};

TempmailWrapper.prototype.getEmailHash = function (email) {
  return crypto.createHash('md5').update(email ? email : this.email).digest('hex');
};

TempmailWrapper.prototype.getEmailAddress = function () {
  var _this = this
    , domains = _this.availableDomains;

  return _this.login + domains[Math.floor(Math.random() * domains.length)];
};

TempmailWrapper.prototype.getMail = function (emailHash) {
  var _this = this
    , req = http.get(_this.apiUrl + '/request/mail/id/' + (emailHash ? emailHash : _this.emailHash) + '/format/json/');

  req
    .on('response', function (res) {
      res.on('data', function (chunk) {
        console.log(chunk.toString());
      });
    })
    .on('error', function (err) {
      console.error(err);
    });

  //return req;
};

module.exports = TempmailWrapper;
