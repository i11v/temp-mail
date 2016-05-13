# tempmail-wrapper

Simple node.js API wrapper for temp-mail.ru

#### Initialize
```javascript
var tempMail = require('tempmail-wrapper/tempmail');
```

#### Example for generate new email


```javascript
tempMail.generateEmail().then(function (newEmail) {
    // your logic
});
```

#### Example for get all emails
```javascript
tempMail.getInbox(user.email).then(function(emails) {
    // your logic
});
```

#### Example for delete message
```javascript
tempMail.deleteMail(mailId).then(function(res) {
    // your logic
});
```
