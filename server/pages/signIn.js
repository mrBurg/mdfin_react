const express = require('express');

const {
  URIS: { SIGN_IN },
} = require('./../routes');

const router = express.Router();

router.get(SIGN_IN, (req, res, next) => {
  return res.json({
    documentTitle: 'Sign In',
    pageTitle: 'Sign In',
  });
});

module.exports = router;
