const path = require('path');
const dotenv = require('dotenv');
const { SitemapPlugin } = require('./plugins');

dotenv.config({ path: './.env' });

console.info(path.resolve(__dirname, 'pages'));

module.exports = {
  env: {
    LOCAL_HOST: process.env.LOCAL_HOST,
    LOCAL_PORT: process.env.LOCAL_PORT,
  },
  distDir: 'build',
  webpack(config, options) {
    config.resolve.alias.normalize = 'normalize.css/normalize.css';

    config.module.rules.push({
      test: /\.pot?$/,
      loaders: ['json-loader', 'po-gettext-loader'],
    });

    config.plugins.push(
      new SitemapPlugin({
        baseUrl: `${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}`,
        pagesDirectory: path.resolve(__dirname, 'pages'),
        targetDirectory: './',
      })
    );

    // console.info(config, options);
    return config;
  },
};
