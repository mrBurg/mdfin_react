const express = require('express');

const {
  URIS: { CONTACTS },
} = require('./../routes');

const router = express.Router();

router.get(CONTACTS, (req, res, next) => {
  return res.json({
    documentTitle: 'Contacts',
    pageTitle: 'Contacts',
    phones: {
      title: 'Điện Thoại:',
      list: [
        '+84 - 12 - 345 - 67 - 89',
        '+84 - 23 - 456 - 78 - 90',
        '+84 - 34 - 567 - 89 - 01',
      ],
    },
    emails: {
      title: 'E-mail:',
      list: ['collection@wеbvay.vn', 'info@wеbvay.vn'],
    },
  });
});

module.exports = router;
