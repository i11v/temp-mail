'use strict';

var tempmail = require('../tempmail')
  , assert = require('chai').assert;

describe('Temp-mail.ru wrapper', function () {
  it('should create a new email', function () {
    return tempmail.generateEmail().then(function (email) {
      assert.isString(email, 'email is a string');
      assert.notEqual(email.indexOf('@'), -1, 'email contains at-mark');
    });
  });

  it('should get inbox', function () {
    return tempmail.generateEmail().then(tempmail.getInbox).then(function (inbox) {
      return assert.isDefined(inbox);
    })
  });
});
