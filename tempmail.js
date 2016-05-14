const crypto = require('crypto');
const https = require('https');


const API_URL = 'https://api.temp-mail.ru';

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url)
      .on('response', (response) => {
        if (response.statusCode < 200 && response.statusCode > 299) {
          reject(new Error(`${response.statusCode} ${response.statusMessage}`));
        }

        const data = [];

        response
          .on('data', (chunk) => data.push(chunk))
          .on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

function getEmailHash(email) {
  return crypto.createHash('md5').update(email).digest('hex');
}

function getRandomEmail(domains, len = 7) {
  const name = Math.random().toString(36).substring(len);
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return name + domain;
}

function getAvailableDomains() {
  return get(`${API_URL}/request/domains/format/json/`).then(JSON.parse);
}

function generateEmail(len) {
  return getAvailableDomains()
    .then(availableDomains => getRandomEmail(availableDomains, len));
}

function getInbox(email) {
  if (!email) {
    throw new Error('Please specify email');
  }

  return get(`${API_URL}/request/mail/id/${getEmailHash(email)}/format/json/`).then(JSON.parse);
}

module.exports = { generateEmail, getInbox };
