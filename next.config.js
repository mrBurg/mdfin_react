const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = {
  env: {
    LOCAL_HOST: process.env.LOCAL_HOST,
    LOCAL_PORT: process.env.LOCAL_PORT,
    LANG_COOKIE_NAME: process.env.LANG_COOKIE_NAME,
  },
  distDir: 'build',
  webpack(config, options) {
    config.resolve.alias.normalize = 'normalize.css/normalize.css';

    config.module.rules.push({
      test: /\.pot?$/,
      loaders: ['json-loader', 'po-gettext-loader'],
    });

    // console.info(config, options);
    return config;
  },
};
