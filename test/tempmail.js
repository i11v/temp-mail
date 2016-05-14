/* globals describe, it */

const tempmail = require('../tempmail');
const assert = require('chai').assert;


describe('Temp-mail.ru wrapper', () => {
  it('should create a new email', () => {
    tempmail.generateEmail().then((email) => {
      assert.isString(email, 'email is a string');
      assert.notEqual(email.indexOf('@'), -1, 'email contains at-mark');
    });
  });

  it('should get inbox', () => {
    tempmail.generateEmail()
      .then(tempmail.getInbox)
      .then(inbox => assert.isDefined(inbox));
  });
});
