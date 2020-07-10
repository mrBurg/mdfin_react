const path = require('path');
const sitemap = require('nextjs-sitemap-generator');

module.exports = class Sitemap {
  constructor(fn) {
    this.fn = fn;
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

      if (this.fn) this.fn();

      sitemap({
        baseUrl: `${process.env.LOCAL_HOST}:${process.env.LOCAL_PORT}`,
        pagesDirectory: path.resolve(__dirname + './../pages'),
        targetDirectory: './',
      });
    });
  }
};
