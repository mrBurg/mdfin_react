const rimraf = require('rimraf');

module.exports = class ClearTarget {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('beforeRun', (compilation) => {
      const { target } = this.config;

      rimraf(target, function () {
        console.log('Target has been cleared');
      });
    });
  }
};
