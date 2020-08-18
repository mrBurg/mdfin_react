const path = require('path');
const dotenv = require('dotenv');
const args = require('yargs').argv;
const webpack = require('webpack');

const { SitemapPlugin } = require('./plugins');

module.exports = {
  distDir: 'build',
  webpack(config, options) {
    const { PO_PROJECT_HOST, PO_PROJECT_PORT } = this.env;

    config.resolve.alias.normalize = 'normalize.css/normalize.css';

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.pot?$/,
        loaders: ['json-loader', 'po-gettext-loader'],
      },
    ];

    config.plugins = [
      ...config.plugins,
      new SitemapPlugin({
        baseUrl: `${PO_PROJECT_HOST}:${PO_PROJECT_PORT}`,
        pagesDirectory: path.resolve(__dirname, 'pages'),
        targetDirectory: './',
      }),
    ];

    // console.info(config, options);
    return config;
  },
};
