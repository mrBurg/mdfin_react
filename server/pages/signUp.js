const express = require('express');
const cors = require('cors');

const {
  URIS: { SIGN_UP, REGISTRATION_FORM },
} = require('./../routes');

const router = express.Router();

router.get(SIGN_UP, (req, res, next) => {
  return res.json({
    documentTitle: 'Sign Up',
    pageTitle: 'Sign Up',
  });
});

router.get(REGISTRATION_FORM, cors(), (req, res, next) => {
  return res.json({
    namePlaceholder: 'Họ Tên Đầy Đủ',
    buttonText: 'More',
  });
});

module.exports = router;
