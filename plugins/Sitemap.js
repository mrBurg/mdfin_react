const sitemap = require('nextjs-sitemap-generator');

module.exports = class Sitemap {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('compile', (compilation) => {
      // console.log('The compiler is starting to compile...!');
    });

    compiler.hooks.compilation.tap('compilation', (compilation) => {
      // console.log('The compiler is starting a new compilation...');
    });

    compiler.hooks.emit.tap('emit', (compilation) => {
      // console.log('The compilation is going to emit files...');
    });

    compiler.hooks.afterEmit.tap('afterEmit', (compilation) => {
      // console.log('The emit is finished...');

      sitemap(this.config);
    });
  }
};
