const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const { PO_STATIC } = process.env;

module.exports = (server) => {
  server.get(`${PO_STATIC}/sign-up`, (req, res, next) => {
    return res.json({
      documentTitle: 'Sign Up',
      pageTitle: 'Sign Up',
    });
  });

  server.get(`${PO_STATIC}/registration-form`, (req, res, next) => {
    return res.json({
      placeholder: 'Họ Tên Đầy Đủ',
    });
  });
};
