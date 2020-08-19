const express = require('express');

const {
  URIS: { TEST },
} = require('../constants');

const router = express.Router();

router.get(TEST, (req, res, next) => {
  return res.json({
    data:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo tempora voluptatum, modi maiores illo odit nam odio quod ullam, beatae ab architecto? Fuga explicabo beatae saepe magnam doloremque sequi itaque.',
  });
});

module.exports = router;
