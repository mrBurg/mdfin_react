// const exec = require('child_process').exec;
const args = require('yargs').argv;
const fs = require('fs-extra');
const rimraf = require('rimraf');
const _ = require('lodash');
const { baokim } = require('./../src/config.json');

let fileName = '';

rimraf.sync('./build', null, function () {
  console.log('Build has been cleared');
});

_.map(baokim, (item) => {
  rimraf.sync(`./public/${item}.txt`, null, function () {
    console.log('Baokim has been cleared');
  });
});

switch (true) {
  case args.t:
    fileName = `${baokim['test']}.txt`;

    fs.copySync('./env', './');
    fs.copySync(`./baokim/${fileName}`, `./public/${fileName}`);
    break;
  case args.p:
    fileName = `${baokim['prod']}.txt`;

    fs.copySync(`./baokim/${fileName}`, `./public/${fileName}`);
    rimraf.sync('./.env.production.local', null, function () {
      console.log('Env has been cleared');
    });
    break;
  default:
    rimraf.sync('./.env.production.local', null, function () {
      console.log('Env has been cleared');
    });
}
