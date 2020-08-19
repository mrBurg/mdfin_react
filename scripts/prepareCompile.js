// const exec = require('child_process').exec;
const args = require('yargs').argv;
const fs = require('fs-extra');

switch (true) {
  case args.t:
    fs.copySync('./env', './');
    break;
  case args.p:
    fs.remove('./.env.production.local');
    break;
  default:
    fs.remove('./.env.production.local');
}
