const test = require('tape'); // eslint-disable-line import/no-extraneous-dependencies
const { generateEmail, getInbox } = require('../index');


test('Create a new email', (t) => {
  generateEmail()
    .then((email) => {
      t.equal(typeof email, 'string', 'email is a string');
      t.notEqual(email.indexOf('@'), -1, 'email contains at-mark');

      return email;
    })
    .then(getInbox)
    .catch((err) => {
      t.equal(err.message, 'Request failed: 404', 'inbox is empty');
      t.end();
    });
});

test('Generate email with prefix', (t) => {
  // avoid http error 429
  setTimeout(() => {
    generateEmail(5, 'prefix')
      .then((email) => {
        const name = email.slice(0, email.indexOf('@'));
        const prefix = name.slice(0, 6);

        t.equal(name.length, 12, 'email name is correct');
        t.equal(prefix, 'prefix', 'prefix is correct');

        t.end();
      });
  }, 700);
});

test('Generate email without prefix', (t) => {
  // avoid http error 429
  setTimeout(() => {
    generateEmail(5)
      .then((email) => {
        const name = email.slice(0, email.indexOf('@'));

        t.equal(name.length, 5, 'email name is correct');

        t.end();
      });
  }, 700);
});
