const sitemap = require('nextjs-sitemap-generator');

module.exports = class Sitemap {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap('afterEmit', (compilation) => {
      sitemap(this.config);
    });
  }
};
