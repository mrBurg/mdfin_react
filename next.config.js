const path = require('path');

const { SitemapPlugin } = require('./plugins');

module.exports = {
  distDir: 'build',
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    PO_API: process.env.PO_API,
    PO_API_HOST: process.env.PO_API_HOST,
    PO_API_PORT: process.env.PO_API_PORT,
    ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    SESSIONID_KEY: process.env.SESSIONID_KEY,
    FINGER_PRINT: process.env.FINGER_PRINT,
  },
  webpack(config, options) {
    const { PO_PROJECT_HOST, PO_PROJECT_PORT } = this.env;

    config.resolve.alias = {
      ...config.resolve.alias,
      normalize: 'normalize.css/normalize.css',
    };

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
