const dotenv = require('dotenv');
const withSass = require('@zeit/next-sass');

dotenv.config({ path: './.env' });

module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 2,
    localIdentName: '[local]___[hash:base64:5]',
  },
  env: {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
  },
  webpack(config, options) {
    let {
      resolve: { alias },
    } = config;

    config.resolve.alias = {
      ...alias,
      normalize: 'normalize.css/normalize.css',
    };

    return config;
  },
});
