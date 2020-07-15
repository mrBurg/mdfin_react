const path = require('path');
const dotenv = require('dotenv');
const { SitemapPlugin } = require('./plugins');

dotenv.config({ path: './.env' });

module.exports = {
  env: {
    PO_API: process.env.PO_API,
    HTTP_HOST: process.env.HTTP_HOST,
    HTTP_PORT: process.env.HTTP_PORT,
    HTTPS_HOST: process.env.HTTPS_HOST,
    HTTPS_PORT: process.env.HTTPS_PORT,
  },
  distDir: 'build',
  webpack(config, options) {
    const { HTTPS_HOST, HTTPS_PORT } = this.env;

    config.resolve.alias.normalize = 'normalize.css/normalize.css';

    config.module.rules.push({
      test: /\.pot?$/,
      loaders: ['json-loader', 'po-gettext-loader'],
    });

    config.plugins.push(
      new SitemapPlugin({
        baseUrl: `${HTTPS_HOST}:${HTTPS_PORT}`,
        pagesDirectory: path.resolve(__dirname, 'pages'),
        targetDirectory: './',
      })
    );

    // console.info(config, options);
    return config;
  },
};
