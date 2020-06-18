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
    LOCAL_HOST: process.env.LOCAL_HOST,
    LOCAL_PORT: process.env.LOCAL_PORT,
  },
  distDir: 'build',
  webpack(config, options) {
    const {
      resolve: { alias },
    } = config;

    config.resolve.alias = {
      ...alias,
      normalize: 'normalize.css/normalize.css',
    };

    config.node = {
      // fs: 'empty',
    };

    return config;
  },
});
